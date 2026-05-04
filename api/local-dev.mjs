#!/usr/bin/env node
// Local dev API server for the demo chat endpoint
// Proxies chat requests to OpenRouter with free-model cascade
// In production, Vercel serverless functions handle this (with VPS proxy fallback)

import http from "node:http";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const PORT = 3002;
const REQUEST_TIMEOUT_MS = 18000;

// Free-only model cascade: tries models in parallel then falls back
const MODEL_CHAIN = [
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

function cleanModelResponse(content) {
  if (!content) return "";

  let cleaned = content
    .replace(/<think[\s\S]*?<\/think>/g, "")
    .replace(
      /\*(?:Brainstorming|Self-check|Checking rules|Avoiding scope creep|Final|Important|Note):[^*]*\*/gi,
      "",
    )
    .replace(
      /\*(?:First, I need to|Hmm\.\.\.|Let me think|I should|I'll focus|I need to)[^*]*\*/gi,
      "",
    )
    .replace(/reasoning_details?\s*:\s*\[.*?\]/gs, "")
    .trim();

  const reasoningPatterns = [
    /^(?:From what I know|As far as I know|Based on my knowledge|I think I recall)/i,
    /^(?:First, I need to|First, I should|I need to figure out|I should consider|I should check|I should verify|Let me think about|Let me consider|Let me recall|Hmm,? let me)/i,
    /^(?:The user(?:'s| wants| is| might| probably| explicitly| didn't)|They might|They probably|They could|The question is)/i,
    /^(?:Wait,? |Actually,? |But wait|Another angle|I should also|Also,? considering|I'll focus)/i,
    /^(?:Since they|Given that|It seems like|I'm not sure|I don't have|Assuming|Based on what)/i,
    /^(?:Okay,? so|Okay,? let me|Alright,? let me|So,? I (?:need|should|think|will|can))/i,
    /^(?:Let me (?:check|verify|look|think|consider|recall|think about|figure)|Hmm|I wonder)/i,
    /^(?:For a (?:hair|nail|beauty|salon|dental|restaurant|fitness|law|account|real)[\w\s]*,?(?:I|they|we|you)\s+(?:need|should|could|might|want|probably|would))/i,
  ];

  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const meaningful = sentences.filter((s) => {
    const trimmed = s.trim();
    if (trimmed.length < 10) return true;
    return !reasoningPatterns.some((p) => p.test(trimmed));
  });

  cleaned = meaningful.join(" ").trim();

  if (!cleaned || cleaned.length < 20)
    return content.replace(/<think[\s\S]*?<\/think>/g, "").trim() || content;

  return cleaned;
}

async function callModel(messages, model) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://rizflow.co",
          "X-Title": "RizFlow Demo (dev)",
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
      throw new Error(
        `Model ${model}: ${response.status} ${errBody.slice(0, 200)}`,
      );
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "";
    if (!reply) {
      const reasoning = data.choices?.[0]?.message?.reasoning || "";
      if (reasoning) reply = reasoning;
    }

    reply = cleanModelResponse(reply);

    if (!reply || reply.length < 5) {
      throw new Error(`Model ${model}: empty or too-short response`);
    }

    return { reply, model: data.model };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function tryModelsWithFallback(messages) {
  const primaryModels = MODEL_CHAIN.slice(0, 3);
  const fallbackModels = MODEL_CHAIN.slice(3);

  const primaryResult = await Promise.any(
    primaryModels.map((model) => callModel(messages, model)),
  ).catch(() => null);

  if (primaryResult) return primaryResult;

  for (const model of fallbackModels) {
    const result = await callModel(messages, model).catch(() => null);
    if (result) return result;
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        status: "ok",
        key: OPENROUTER_API_KEY ? "configured" : "missing",
        models: MODEL_CHAIN,
      }),
    );
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  if (req.url !== "/api/demo/chat") {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const { messages, industry } = JSON.parse(body);

      if (!messages || !Array.isArray(messages)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Messages array required" }));
      }

      console.log(
        `[demo-api] Request for industry: ${industry || "unknown"}, messages: ${messages.length}`,
      );

      if (!OPENROUTER_API_KEY) {
        console.error("[demo-api] OPENROUTER_API_KEY not set");
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error: "Demo is being set up. Please try again in a moment.",
          }),
        );
      }

      const result = await tryModelsWithFallback(messages);

      if (!result) {
        console.error("[demo-api] All models failed");
        res.writeHead(502, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error:
              "AI service temporarily unavailable. Please try again in a moment.",
          }),
        );
      }

      console.log(`[demo-api] Model ${result.model} succeeded`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (err) {
      console.error("[demo-api] Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`[demo-api] Local dev API running on http://localhost:${PORT}`);
  console.log(
    `[demo-api] OpenRouter key: ${OPENROUTER_API_KEY ? "configured" : "MISSING"}`,
  );
  console.log(`[demo-api] Model cascade: ${MODEL_CHAIN.join(" → ")}`);
});
