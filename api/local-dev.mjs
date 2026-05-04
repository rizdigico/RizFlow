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

  let cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

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
    // Some reasoning models return content:null with reasoning in a separate field
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
  // Phase 1: Try first 3 models in parallel (race)
  const primaryModels = MODEL_CHAIN.slice(0, 3);
  const fallbackModels = MODEL_CHAIN.slice(3);

  const primaryResult = await Promise.any(
    primaryModels.map((model) => callModel(messages, model)),
  ).catch(() => null);

  if (primaryResult) return primaryResult;

  // Phase 2: Try fallback models sequentially
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

  // Health check
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
