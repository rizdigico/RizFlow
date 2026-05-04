// Demo chat API — races VPS proxy + direct OpenRouter in parallel
// Uses free models only. VPS proxy ensures reliability from Vercel.

const MODEL_CHAIN = [
  "openai/gpt-oss-120b:free",
  "meta-llama/llama-4-maverick-17b-128e-instruct:free",
  "google/gemma-4-31b-it:free",
  "minimax/minimax-m2.5:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

const VPS_PROXY = "http://37.60.226.100:3002/api/demo/chat";
const REQUEST_TIMEOUT_MS = 15000;
const PROXY_TIMEOUT_MS = 25000;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const key = process.env.OPENROUTER_API_KEY;
    const keyStatus = key
      ? `set (${key.slice(0, 8)}...${key.slice(-4)})`
      : "NOT SET";
    return res.status(200).json({
      status: key ? "key-configured" : "key-missing",
      keyStatus,
      models: MODEL_CHAIN,
    });
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, industry } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // Race VPS proxy + direct OpenRouter — first successful response wins
    const result = await raceAllSources(messages);

    if (!result) {
      return res.status(502).json({
        error:
          "AI service temporarily unavailable. Please try again in a moment.",
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(result);
  } catch (err) {
    console.error("Demo chat API error:", err.message || err);
    return res.status(500).json({
      error: "Internal server error",
      detail: err.message?.slice(0, 200),
    });
  }
}

/**
 * Race VPS proxy and direct OpenRouter models simultaneously.
 * Returns the first successful result from any source.
 */
async function raceAllSources(messages) {
  const sources = [];

  // Always try VPS proxy (known-good key, works from VPS)
  sources.push(tryVpsProxy(messages).catch(() => null));

  // Also try direct OpenRouter (works if Vercel env key is valid)
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (OPENROUTER_API_KEY) {
    // Race top 3 models in parallel
    for (const model of MODEL_CHAIN.slice(0, 3)) {
      sources.push(
        callModel(model, messages, OPENROUTER_API_KEY).catch(() => null),
      );
    }
  }

  // Promise.any: first successful result wins
  const result = await Promise.any(sources).catch(() => null);
  return result;
}

async function tryVpsProxy(messages) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const response = await fetch(VPS_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`VPS proxy failed: ${response.status}`);
      throw new Error(`VPS proxy: ${response.status}`);
    }

    const data = await response.json();
    if (data.reply && data.reply.length >= 5) {
      return { reply: data.reply, model: data.model };
    }

    throw new Error("VPS proxy: empty response");
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function callModel(model, messages, apiKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://rizflow.co",
          "X-Title": "RizFlow Demo",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      const err = new Error(
        `Model ${model}: ${response.status} ${errBody.slice(0, 200)}`,
      );
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "";
    reply = cleanModelResponse(reply);

    if (!reply || reply.length < 5) {
      const err = new Error(`Model ${model}: empty or too-short response`);
      err.status = 204;
      throw err;
    }

    return { reply, model: data.model };
  } catch (err) {
    clearTimeout(timeoutId);
    if (!err.status) err.status = err.name === "AbortError" ? 408 : 500;
    throw err;
  }
}

function cleanModelResponse(content) {
  if (!content) return "";

  let cleaned = content.replace(/<think[\s\S]*?<\/think>/g, "").trim();

  if (/^(Okay|Let me|Hmm|I need to|The user|So,|Well,)/i.test(cleaned)) {
    const sentences = cleaned.split(/\.\s+/);
    const meaningfulStart = sentences.findIndex(
      (s) =>
        s.length > 20 &&
        !/^(Okay|Let me|Hmm|I should|I'll|The user wants|So I|Well)/i.test(s),
    );
    if (meaningfulStart > 0) {
      cleaned = sentences.slice(meaningfulStart).join(". ").trim();
    }
  }

  cleaned = cleaned.replace(/reasoning_details?\s*:\s*\[.*?\]/gs, "").trim();
  return cleaned || content;
}
