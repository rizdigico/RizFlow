// AI Score analysis endpoint — Vercel serverless function
// Uses free OpenRouter models to analyze business answers and return personalized score

const MODEL_CHAIN = [
  "openai/gpt-oss-120b:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "z-ai/glm-4.5-air:free",
];

const REQUEST_TIMEOUT_MS = 18000;

function cleanModelResponse(content) {
  if (!content) return "";
  let cleaned = content
    .replace(/<think[\s\S]*?<\/think>/g, "")
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
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
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://rizflow.co",
          "X-Title": "RizFlow AI Score",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 800,
          temperature: 0.7,
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Model ${model}: ${response.status}`);

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "";
    if (!reply) reply = data.choices?.[0]?.message?.reasoning || "";
    reply = cleanModelResponse(reply);
    if (!reply || reply.length < 5)
      throw new Error(`Model ${model}: empty response`);
    return { reply, model: data.model };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function tryModelsWithFallback(messages) {
  const primary = MODEL_CHAIN.slice(0, 3);
  const fallback = MODEL_CHAIN.slice(3);

  const primaryResult = await Promise.any(
    primary.map((m) => callModel(messages, m)),
  ).catch(() => null);
  if (primaryResult) return primaryResult;

  for (const m of fallback) {
    const r = await callModel(messages, m).catch(() => null);
    if (r) return r;
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ error: "Answers required" });

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "Service unavailable" });
    }

    const prompt = `You are an AI automation consultant. A business owner answered these questions:

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
{"score":0-100,"level":"Untapped Potential|Early Stage|Getting There|High Potential|AI-Ready","estimatedSavings":"X-Y hours/week","topAutomations":["specific1","specific2","specific3","specific4"],"recommendations":["specific1","specific2","specific3","specific4"],"impactSummary":"1-2 sentence personalized summary"}

CRITICAL: Every single value must reference their SPECIFIC industry, tools, pain points, goals, and blockers. No generic advice. No template phrases. Name their actual tools and challenges.`;

    const result = await tryModelsWithFallback([
      {
        role: "system",
        content:
          "Output ONLY valid JSON. No explanation, no reasoning, no markdown fences, no thinking out loud. Just the JSON object.",
      },
      { role: "user", content: prompt },
    ]);

    if (!result)
      return res.status(502).json({ error: "AI service unavailable" });

    let parsed;
    try {
      let cleaned = result.reply
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = null;
    }

    if (!parsed || !parsed.score) {
      const manualMap = { under5: 5, "5to15": 10, "15to30": 25, "30plus": 40 };
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
      const baseScore = Math.min(65, mh + ai + blockerBonus + hasAiTools + 10);
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

    res.status(200).json(parsed);
  } catch (err) {
    console.error("[ai-score] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
