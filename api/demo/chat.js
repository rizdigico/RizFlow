// Free-only model cascade with parallel requests and smart fallback
// Uses OpenRouter's free models only — no paid models

const MODEL_CHAIN = [
  "google/gemma-4-31b-it:free", // Best free model for chat, 256K context
  "openai/gpt-oss-120b:free", // 120B, strong alternative
  "minimax/minimax-m2.5:free", // 196K context, good availability
  "nvidia/nemotron-3-super-120b-a12b:free", // 120B MoE, decent fallback
];

// Reduced timeout per model — with parallel requests, we don't need 25s
const REQUEST_TIMEOUT_MS = 15000; // 15s per model (Vercel maxDuration is 30s)

export default async function handler(req, res) {
  // CORS preflight
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

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY not set in environment");
    return res
      .status(500)
      .json({ error: "Demo is being set up. Please try again in a moment." });
  }

  try {
    const { messages, industry } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // Strategy: Try models in parallel (first 2), then fallback to remaining
    // This maximizes success rate within Vercel's 30s function limit
    const result = await tryModelsWithFallback(messages);

    if (!result) {
      return res.status(502).json({
        error:
          "AI service temporarily unavailable. Please try again in a moment.",
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(result);
  } catch (err) {
    console.error("Demo chat API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Try models with a parallel-then-serial fallback strategy:
 * 1. Fire first 2 models in parallel (race)
 * 2. If both fail, try remaining models one by one
 * 3. Returns first successful result or null
 */
async function tryModelsWithFallback(messages) {
  // Phase 1: Try first 2 models in parallel (race)
  const primaryModels = MODEL_CHAIN.slice(0, 2);
  const fallbackModels = MODEL_CHAIN.slice(2);

  const primaryResult = await Promise.any(
    primaryModels.map((model) => callModel(model, messages)),
  ).catch(() => null);

  if (primaryResult) {
    return primaryResult;
  }

  // Phase 2: Try fallback models sequentially
  for (const model of fallbackModels) {
    const result = await callModel(model, messages).catch(() => null);
    if (result) return result;
  }

  return null;
}

/**
 * Call a single OpenRouter model and return the result.
 * Returns null on failure (caller handles fallback).
 */
async function callModel(model, messages) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
      console.error(
        `Model ${model} failed: ${response.status} ${errBody.slice(0, 200)}`,
      );
      // Throw to trigger fallback in Promise.any / sequential fallback
      throw new Error(`Model ${model}: ${response.status}`);
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "";

    // Some models return reasoning in content — extract only the actual response
    // If the reply looks like reasoning/thinking, try to extract the real content
    reply = cleanModelResponse(reply);

    if (!reply || reply.length < 5) {
      throw new Error(`Model ${model}: empty or too-short response`);
    }

    return { reply, model: data.model };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err; // Re-throw so Promise.any and sequential fallback work
  }
}

/**
 * Clean model responses that include reasoning/thinking tokens in content.
 * Some free models (nemotron, hy3) return their reasoning process as content.
 */
function cleanModelResponse(content) {
  if (!content) return "";

  // Remove <think>...</think> blocks (common with reasoning models)
  let cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // If content looks like internal reasoning (starts with thinking markers)
  if (/^(Okay|Let me|Hmm|I need to|The user|So,|Well,)/i.test(cleaned)) {
    // Try to find the actual response after reasoning
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

  // Remove reasoning_details artifacts
  cleaned = cleaned.replace(/reasoning_details?\s*:\s*\[.*?\]/gs, "").trim();

  return cleaned || content; // Fall back to original if cleaning stripped everything
}
