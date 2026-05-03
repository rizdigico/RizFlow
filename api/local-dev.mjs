#!/usr/bin/env node
// Local dev API server for the demo chat endpoint
// This proxies chat requests to OpenRouter during development
// In production, Vercel serverless functions handle this

import http from "http";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const PORT = 3002;

const PRIMARY_MODEL = "meta-llama/llama-4-maverick-17b-128e-instruct";
const FALLBACK_MODEL = "google/gemma-3-27b-it:free";

async function callOpenRouter(messages, model) {
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
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter ${model}: ${response.status} ${errText}`);
  }

  return response.json();
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Health check — before method check so GET works
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        status: "ok",
        key: OPENROUTER_API_KEY ? "configured" : "missing",
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

      let data;
      try {
        data = await callOpenRouter(messages, PRIMARY_MODEL);
        console.log(`[demo-api] Primary model (${PRIMARY_MODEL}) succeeded`);
      } catch (primaryErr) {
        console.log(
          `[demo-api] Primary model failed: ${primaryErr.message}, trying fallback...`,
        );
        try {
          data = await callOpenRouter(messages, FALLBACK_MODEL);
          console.log(
            `[demo-api] Fallback model (${FALLBACK_MODEL}) succeeded`,
          );
        } catch (fallbackErr) {
          console.error(
            `[demo-api] Fallback also failed: ${fallbackErr.message}`,
          );
          res.writeHead(502, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ error: "AI service temporarily unavailable" }),
          );
        }
      }

      const reply =
        data.choices?.[0]?.message?.content ||
        "I apologize, I was unable to process that. Please try again.";
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ reply, model: data.model }));
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
  console.log(`[demo-api] Primary model: ${PRIMARY_MODEL}`);
  console.log(`[demo-api] Fallback model: ${FALLBACK_MODEL}`);
});
