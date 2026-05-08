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

function isLazyResponse(parsed) {
  const bannedPhrases = [
    "specific1",
    "specific2",
    "specific3",
    "specific4",
    "item1",
    "item2",
    "item3",
    "item4",
    "example1",
    "example2",
    "example3",
    "streamline operations",
    "leverage ai",
    "optimize workflows",
    "harness technology",
    "embrace ai",
    "unlock potential",
    "automation 1",
    "automation 2",
    "recommendation 1",
    "recommendation 2",
  ];
  const allStrings = [
    ...(parsed.topAutomations || []),
    ...(parsed.recommendations || []),
    parsed.impactSummary || "",
    parsed.estimatedSavings || "",
    parsed.level || "",
  ].map((s) => (s || "").toLowerCase());

  for (const phrase of bannedPhrases) {
    for (const str of allStrings) {
      if (str.includes(phrase.toLowerCase())) return true;
    }
  }

  const autos = parsed.topAutomations || [];
  if (autos.length < 3) return true;
  if (autos.every((a) => (a || "").length < 20)) return true;

  const recs = parsed.recommendations || [];
  if (recs.length < 3) return true;
  if (recs.every((r) => (r || "").length < 25)) return true;

  return false;
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

  // ── AI Score Analysis Endpoint ──
  if (req.url === "/api/ai-score" && req.method === "POST") {
    let scoreBody = "";
    req.on("data", (chunk) => {
      scoreBody += chunk;
    });
    req.on("end", async () => {
      try {
        const { answers } = JSON.parse(scoreBody);
        if (!answers || typeof answers !== "object") {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Answers object required" }));
        }

        if (!OPENROUTER_API_KEY) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Service unavailable" }));
        }

        const prompt = `You are an AI automation consultant. A business owner just answered these questions about their business:

Industry/Type: ${answers.industry || "Not specified"}
Team size: ${answers.teamSize || "Not specified"}
Biggest daily pain: ${answers.biggestPain || "Not specified"}
Manual hours/week on repetitive tasks: ${answers.manualHours || "Not specified"}
Current tools used: ${answers.currentTools || "Not specified"}
AI/automation tools currently using: ${answers.aiToolsUsed || "Not specified"}
AI experience level: ${answers.aiTools || "Not specified"}
What they'd automate first: ${answers.automateFirst || "Not specified"}
#1 goal for next 6 months: ${answers.biggestGoal || "Not specified"}
What's holding them back from automating: ${answers.automationBlocker || "Not specified"}

Based on ALL their answers, respond with ONLY a JSON object. No explanation, no reasoning, no markdown. Just the raw JSON:
{"score":0-100,"level":"Untapped Potential|Early Stage|Getting There|High Potential|AI-Ready","estimatedSavings":"X-Y hours/week","topAutomations":["FIRST automation — name the exact task and tool, e.g. 'Auto-invoice processing between Shopify and Xero'","SECOND automation — specific to their industry and pain","THIRD automation — references their actual tools","FOURTH automation — ties to their stated goal"],"recommendations":["FIRST recommendation — actionable, references their specific pain point","SECOND recommendation — names their actual tools","THIRD recommendation — addresses their specific blocker","FOURTH recommendation — concrete next step tied to their goal"],"impactSummary":"1-2 sentence personalized summary referencing their industry, pain, and goal"}

ABSOLUTE RULES — VIOLATIONS WILL CAUSE REJECTION:
1. NEVER use generic phrases like "streamline operations", "leverage AI", "optimize workflows", "harness technology" — these are banned
2. NEVER use placeholder text like "specific1", "item1", "example" — every string must be a real, specific recommendation
3. Every topAutomation MUST name at least ONE of: their industry, their tools, their pain point, or their goal
4. Every recommendation MUST reference something they specifically mentioned in their answers
5. impactSummary MUST mention their industry AND their biggest pain AND their goal by name
6. If you output any template/generic/placeholder text the entire response will be rejected`;

        const result = await tryModelsWithFallback([
          {
            role: "system",
            content:
              "Output ONLY valid JSON. No explanation, no reasoning, no markdown fences, no thinking out loud. Just the JSON object.",
          },
          { role: "user", content: prompt },
        ]);

        if (!result) {
          res.writeHead(502, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "AI service unavailable" }));
        }

        let parsed;
        try {
          // Try to find JSON object in the response — free models are chatty
          let cleaned = result.reply
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "");
          const firstBrace = cleaned.indexOf("{");
          const lastBrace = cleaned.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
          }
          // Try parsing, attempt to fix common issues (truncated JSON)
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            // Model may have truncated the JSON — try to complete it
            let fixed = cleaned;
            // Count open/close brackets and braces
            const openBraces = (fixed.match(/{/g) || []).length;
            const closeBraces = (fixed.match(/}/g) || []).length;
            const openBrackets = (fixed.match(/\[/g) || []).length;
            const closeBrackets = (fixed.match(/]/g) || []).length;
            // Close any unclosed strings (find last " and add closing quote + comma)
            const lastQuoteIdx = fixed.lastIndexOf('"');
            if (
              lastQuoteIdx > 0 &&
              fixed[lastQuoteIdx - 1] !== "\\" &&
              fixed[lastQuoteIdx - 1] !== ":"
            ) {
              // Check if the string is unclosed — look for odd number of quotes after last colon
            }
            fixed += "]".repeat(Math.max(0, openBrackets - closeBrackets));
            fixed += "}".repeat(Math.max(0, openBraces - closeBraces));
            parsed = JSON.parse(fixed);
          }
        } catch {
          parsed = null;
        }

        // If AI parsing failed or returned lazy/template responses, build fully personalized fallback from answers
        if (!parsed || !parsed.score) {
          // Will use fallback logic below
        } else if (isLazyResponse(parsed)) {
          console.log(
            "[ai-score] Model returned lazy/template response, using fallback",
          );
          parsed = null;
        }

        if (!parsed) {
          const manualMap = {
            under5: 5,
            "5to15": 10,
            "15to30": 25,
            "30plus": 40,
          };
          const aiMap = { none: 0, dabbled: 10, some: 25, deep: 40 };
          const blockerMap = {
            dontKnowHow: 0,
            noTime: 5,
            cost: 5,
            triedFailed: 10,
            dontNeed: -5,
          };
          const mh = manualMap[answers.manualHours] || 10;
          const ai = aiMap[answers.aiTools] || 0;
          const blockerBonus = blockerMap[answers.automationBlocker] || 0;
          const hasAiTools =
            answers.aiToolsUsed && answers.aiToolsUsed.length > 3 ? 5 : 0;
          const baseScore = Math.min(
            65,
            mh + ai + blockerBonus + hasAiTools + 10,
          );
          const score = Math.min(
            100,
            Math.max(15, baseScore + Math.floor(Math.random() * 8)),
          );
          const level =
            score >= 80
              ? "AI-Ready"
              : score >= 60
                ? "High Potential"
                : score >= 40
                  ? "Getting There"
                  : score >= 20
                    ? "Early Stage"
                    : "Untapped Potential";
          const ind = answers.industry || "business";
          const pain = answers.biggestPain || "repetitive tasks";
          const tools = answers.currentTools || "";
          const aiToolsStr = answers.aiToolsUsed || "";
          const goal = answers.biggestGoal || "growth";
          const firstTool = tools ? tools.split(",")[0].trim() : "";
          const secondTool =
            tools.split(",").length > 1 ? tools.split(",")[1].trim() : "";
          const topTools =
            [firstTool, secondTool].filter(Boolean).join(" and ") ||
            "your existing tools";

          const blockerAdvice = {
            dontKnowHow: `Since you're unsure where to start with AI automation for ${ind}, a guided audit can map the highest-impact automations for your specific workflow`,
            noTime: `You don't have time to figure out automation — that's exactly why delegating the setup to specialists makes sense for your ${ind} business`,
            cost: `AI automation doesn't have to be expensive — starting with ${firstTool || "your existing tools"} integrations can deliver ROI within the first week`,
            triedFailed: `If past automation attempts didn't work for your ${ind} business, the issue was likely the approach, not the technology — a targeted strategy changes everything`,
            dontNeed: `Even in ${ind}, businesses that stay manual are losing ${mh > 15 ? "20+" : "5-10"} hours/week to tasks AI agents handle better`,
          };

          parsed = {
            score,
            level,
            estimatedSavings:
              mh > 20
                ? "15-22 hours/week"
                : mh > 5
                  ? "6-12 hours/week"
                  : "3-6 hours/week",
            topAutomations: [
              `AI-powered ${pain.toLowerCase().split(" ").slice(0, 3).join(" ")} automation for ${ind}`,
              `Auto-sync data between ${topTools} to eliminate manual entry`,
              `Intelligent ${ind} scheduling, reminders & follow-up sequences`,
              aiToolsStr
                ? `Expand your ${aiToolsStr.split(",").slice(0, 2).join(" and ")} setup with agent-driven ${pain.toLowerCase().split(" ").slice(0, 2).join(" ")} workflows`
                : `Deploy AI agents to handle ${pain.toLowerCase().split(" ").slice(0, 2).join(" ")} while you focus on ${goal.toLowerCase()}`,
            ],
            recommendations: [
              `Automate ${pain.toLowerCase().split(" ").slice(0, 3).join(" ")} first — it's your biggest daily pain and the fastest win for your ${ind} business`,
              firstTool
                ? `Connect ${firstTool} with AI agents to stop copy-pasting and free up ${mh > 15 ? "15+" : "5-10"} hours/week`
                : `Connect your core tools with AI agents to eliminate manual data entry`,
              blockerAdvice[answers.automationBlocker] ||
                `A free audit call can map the exact automation roadmap for your ${ind} business and ${goal.toLowerCase()}`,
              `Your ${ind} peers who adopted AI automation are already saving ${mh > 15 ? "15-20" : "8-12"} hours/week — here's how to catch up`,
            ],
            impactSummary: `As a ${ind} business ${answers.teamSize ? `with ${answers.teamSize} team members` : ""} spending ${mh > 15 ? "15+" : "5-10"} hours/week on manual ${pain.toLowerCase().split(" ").slice(0, 2).join(" ")}, AI agents could free up that time so you can focus on ${goal.toLowerCase()}.`,
          };
        }

        console.log(
          `[ai-score] Model ${result.model} succeeded, score: ${parsed.score}`,
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(parsed));
      } catch (err) {
        console.error("[ai-score] Error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
    return;
  }

  // ── Demo Chat Endpoint ──
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
