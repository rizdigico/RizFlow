// Demo chat API — races VPS proxy + direct OpenRouter in parallel
// Uses free models only. VPS proxy ensures reliability from Vercel.

// Tested reliable free models (May 2026):
// - gpt-oss-120b: consistently available
// - gpt-oss-20b: fast, good availability
// - nemotron-3-super: large, reliable
// - gemma-3-27b: good when not rate-limited
// - llama-3.3-70b: fallback
// Removed: llama-4-maverick (no endpoints), minimax-m2.5 (rate-limited)
const MODEL_CHAIN = [
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

const VPS_PROXY =
  "https://variations-phillips-ringtones-laundry.trycloudflare.com/api/demo/chat";
const REQUEST_TIMEOUT_MS = 12000;
const PROXY_TIMEOUT_MS = 20000;

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
    console.log(
      `Final result: ${result ? `model=${result.model} reply=${result.reply?.slice(0, 50)}` : "null"}`,
    );

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
 *
 * IMPORTANT: We do NOT catch individual promises before passing to Promise.any.
 * Promise.any fulfills as soon as ONE promise fulfills; it only rejects with
 * AggregateError if ALL promises reject. Catching individual promises converts
 * rejections into null resolutions, which makes Promise.any fulfill with null
 * instead of propagating the rejection — that was the 502 bug.
 */
async function raceAllSources(messages) {
  const sources = [];

  // Always try VPS proxy (known-good key, works from VPS)
  sources.push(tryVpsProxy(messages));

  // Also try direct OpenRouter (works if Vercel env key is valid)
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (OPENROUTER_API_KEY) {
    // Race ALL 5 models — more sources = higher chance one isn't rate-limited
    for (const model of MODEL_CHAIN) {
      sources.push(callModel(model, messages, OPENROUTER_API_KEY));
    }
  }

  // Promise.any: first successful result wins; AggregateError if all fail
  try {
    const result = await Promise.any(sources);
    console.log(`raceAllSources: got result from model=${result?.model}`);
    return result;
  } catch (aggErr) {
    // All sources failed — log each error for debugging
    const errors = aggErr instanceof AggregateError ? aggErr.errors : [aggErr];
    for (const e of errors) {
      console.error(
        `raceAllSources: source failed — ${e?.message?.slice(0, 200)}`,
      );
    }
    return null;
  }
}

async function tryVpsProxy(messages) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    console.log(`VPS proxy: calling ${VPS_PROXY}`);
    const response = await fetch(VPS_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`VPS proxy: response status ${response.status}`);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      console.error(
        `VPS proxy failed: ${response.status} ${errBody.slice(0, 200)}`,
      );
      throw new Error(`VPS proxy: ${response.status}`);
    }

    const data = await response.json();
    if (data.reply && data.reply.length >= 5) {
      console.log(`VPS proxy: success, model=${data.model}`);
      return { reply: data.reply, model: data.model };
    }

    throw new Error("VPS proxy: empty response");
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(
      `VPS proxy error: ${err.name}: ${err.message?.slice(0, 300)}`,
    );
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
    // Some reasoning models return content:null with reasoning in a separate field
    if (!reply) {
      const reasoning = data.choices?.[0]?.message?.reasoning || "";
      if (reasoning) reply = reasoning;
    }
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

  let cleaned = content
    // Strip <thinking>...</thinking> or <think>...</think> blocks
    .replace(/<think(?:ing)?[\s\S]*?<\/think(?:ing)?>/gi, "")
    // Strip ### Thinking / ## Reasoning markdown sections
    .replace(
      /^#{1,3}\s+(?:Thinking|Reasoning|Analysis|My thought|Thought process|Internal)[\s\S]*?(?=\n#{1,3}\s|\n[A-Z][a-z]|\[ACTION|$)/gim,
      "",
    )
    // Strip markdown-style internal reasoning (*Brainstorming:..., *Self-check:..., etc.)
    .replace(
      /\*(?:Brainstorming|Self-check|Checking rules|Avoiding scope creep|Final|Important|Note):[^*]*\*/gi,
      "",
    )
    // Strip *thought process* lines
    .replace(
      /\*(?:First, I need to|Hmm\.\.\.|Let me think|I should|I'll focus|I need to)[^*]*\*/gi,
      "",
    )
    // Strip reasoning_details JSON artifacts
    .replace(/reasoning_details?\s*:\s*\[.*?\]/gs, "")
    // Strip [ACTION: ...] markers from visible response (parsed client-side)
    .replace(/\[ACTION:\s*[^[\]]+\]/gi, "")
    .trim();

  // Strip sentences that are clearly internal reasoning (plain text, no markers)
  const reasoningPatterns = [
    /^(?:From what I know|As far as I know|Based on my knowledge|I think I recall)/i,
    /^(?:First, I need to|First, I should|I need to figure out|I should consider|I should check|I should verify|Let me think about|Let me consider|Let me recall|Hmm,? let me)/i,
    /^(?:The user(?:'s| wants| is| might| probably| explicitly| didn't)|They might|They probably|They could|The question is)/i,
    /^(?:Wait,? |Actually,? |But wait|Another angle|I should also|Also,? considering|I'll focus)/i,
    /^(?:Since they|Given that|It seems like|I'm not sure|I don't have|Assuming|Based on what)/i,
    /^(?:Okay,? so|Okay,? let me|Alright,? let me|So,? I (?:need|should|think|will|can))/i,
    /^(?:Let me (?:check|verify|look|think|consider|recall|think about|figure)|Hmm|I wonder)/i,
    /^(?:For a (?:hair|nail|beauty|salon|dental|restaurant|fitness|law|account|real)[\w\s]*,?(?:I|they|we|you)\s+(?:need|should|could|might|want|probably|would))/i,
    /^(?:I (?:understand|know|see|recall|remember|think|believe|will|can|should|would|need to|have to|am going to))/i,
    /^(?:Now,? (?:I|let me|the|this)|Next,? (?:I|let me|we|the)|Then,? (?:I|let me|we|the))/i,
    /^(?:My (?:approach|response|answer|plan|strategy)|Here(?:'s| is) (?:my|what|how|the))/i,
    /^(?:To (?:answer|respond|help|address|provide|handle|assist))/i,
  ];

  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const meaningful = sentences.filter((s) => {
    const trimmed = s.trim();
    if (trimmed.length < 10) return true; // keep short sentences (they're answers)
    return !reasoningPatterns.some((p) => p.test(trimmed));
  });

  cleaned = meaningful.join(" ").trim();

  // If we stripped everything, fall back to original minus known markers
  if (!cleaned || cleaned.length < 20)
    return content.replace(/<think[\s\S]*?<\/think>/g, "").trim() || content;

  return cleaned;
}
