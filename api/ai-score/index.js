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

  // Also reject if topAutomations has fewer than 3 items or all are under 20 chars
  const autos = parsed.topAutomations || [];
  if (autos.length < 3) return true;
  if (autos.every((a) => (a || "").length < 20)) return true;

  const recs = parsed.recommendations || [];
  if (recs.length < 3) return true;
  if (recs.every((r) => (r || "").length < 25)) return true;

  return false;
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

    const ind = answers.industry || "business";
    const pain = answers.biggestPain || "repetitive tasks";
    const tools = answers.currentTools || "";
    const aiToolsUsed = answers.aiToolsUsed || "";
    const goal = answers.biggestGoal || "growth";
    const autoFirst = answers.automateFirst || "";
    const manualHrs = answers.manualHours || "under5";
    const teamSz = answers.teamSize || "solo";
    const aiExp = answers.aiToolsExperience || "none";
    const blocker = answers.automationBlocker || "dontKnowHow";

    const expLabel =
      {
        none: "No AI experience",
        dabbled: "Dabbled with ChatGPT",
        some: "Uses a few AI tools",
        deep: "AI-integrated workflows",
      }[aiExp] || aiExp;
    const hrsLabel =
      {
        under5: "Under 5 hrs/week",
        "5to15": "5-15 hrs/week",
        "15to30": "15-30 hrs/week",
        "30plus": "30+ hrs/week",
      }[manualHrs] || manualHrs;
    const teamLabel =
      {
        solo: "Solo founder",
        small: "2-5 people",
        medium: "6-15 people",
        large: "16-30 people",
        bigger: "30+ people",
      }[teamSz] || teamSz;
    const blockerLabel =
      {
        dontKnowHow: "Doesn't know where to start",
        noTime: "No time to set up",
        cost: "Worried about cost",
        triedFailed: "Tried before, didn't work",
        dontNeed: "Not sure AI is relevant",
      }[blocker] || blocker;

    const prompt = `You are an expert AI automation consultant giving a personalized assessment. A real business owner answered these questions — give them genuinely useful, specific advice.

BUSINESS PROFILE:
- Industry: ${ind}
- Team size: ${teamLabel}
- Biggest daily pain: "${pain}"
- Hours/week on repetitive tasks: ${hrsLabel}
- Current tools: "${tools}"
- AI tools they already use: "${aiToolsUsed}"
- AI experience: ${expLabel}
- What they'd automate first: "${autoFirst}"
- #1 goal for next 6 months: "${goal}"
- What's holding them back: ${blockerLabel}

PERSONALIZATION RULES (CRITICAL — responses that violate these will be rejected):
1. Every automation MUST reference their SPECIFIC industry, tools, pain, or goal by name — no generic advice
2. Every recommendation MUST be actionable and reference what they actually told you — no vague "streamline" or "leverage" language
3. Use natural, conversational English — write like a consultant talking to a client, not a template
4. impactSummary MUST mention their industry name, their exact pain, and their stated goal
5. Score should genuinely reflect their readiness — high if they already use AI tools and have clear pain, low if they're just starting

Respond with ONLY a JSON object (no markdown, no explanation):
{"score":0-100,"level":"Untapped Potential|Early Stage|Getting There|High Potential|AI-Ready","estimatedSavings":"X-Y hours/week","topAutomations":["specific automation naming their actual tools and pain, e.g. 'Auto-invoice processing between Shopify and Xero'","another specific one tied to their industry","third one addressing their stated pain","fourth one connected to their 6-month goal"],"recommendations":["specific first step referencing their exact pain and tools","recommendation naming their actual tools","one addressing their specific blocker","concrete next step tied to their stated goal"],"impactSummary":"1-2 sentence personalized summary naming their industry, pain, and goal"}`;

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
      // Will use fallback logic below
    } else if (isLazyResponse(parsed)) {
      parsed = null; // Force fallback to manual generation
    }

    // Clean up level — AI sometimes outputs "High Potential|AI-Ready"
    if (parsed && parsed.level) {
      const validLevels = [
        "Untapped Potential",
        "Early Stage",
        "Getting There",
        "High Potential",
        "AI-Ready",
      ];
      if (parsed.level.includes("|")) {
        const parts = parsed.level.split("|").map((s) => s.trim());
        // Pick the more advanced level
        parsed.level = parts.sort(
          (a, b) => validLevels.indexOf(b) - validLevels.indexOf(a),
        )[0];
      }
      if (!validLevels.includes(parsed.level)) {
        // Fallback based on score
        const s = parsed.score;
        parsed.level =
          s >= 80
            ? "AI-Ready"
            : s >= 60
              ? "High Potential"
              : s >= 40
                ? "Getting There"
                : s >= 20
                  ? "Early Stage"
                  : "Untapped Potential";
      }
    }

    if (!parsed) {
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
      const ai = aiMap[answers.aiToolsExperience] || 0;
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
      const painShort =
        pain.length > 30 ? pain.split(" ").slice(0, 4).join(" ") : pain;
      const tools = answers.currentTools || "";
      const aiToolsStr = answers.aiToolsUsed || "";
      const goal = answers.biggestGoal || "growth";
      const firstTool = tools ? tools.split(",")[0].trim() : "";
      const secondTool =
        tools.split(",").length > 1 ? tools.split(",")[1].trim() : "";
      const autoFirst = answers.automateFirst || "";

      const blockerAdvice = {
        dontKnowHow: `A free audit call will map the exact automation roadmap for your ${ind} business — you'll know exactly where to start`,
        noTime: `Since you're short on time, delegating the setup to specialists gets you automation without the learning curve`,
        cost: `Starting with ${firstTool || "your existing tools"} integrations can deliver ROI within the first week — automation doesn't have to be expensive`,
        triedFailed: `If past automation didn't work for your ${ind} business, it was likely the approach — a targeted strategy built around ${firstTool || "your actual tools"} makes the difference`,
        dontNeed: `Even in ${ind}, businesses that stay manual are losing ${mh > 15 ? "20+" : "5-10"} hours/week to tasks AI handles better — and your competition is already automating`,
      };

      const autos = [
        autoFirst
          ? `Set up ${autoFirst.toLowerCase()} automation — you already identified this as your top priority`
          : `Automate ${painShort.toLowerCase()} end-to-end with AI agents tailored to ${ind} workflows`,
        firstTool
          ? `Connect ${firstTool}${secondTool ? ` and ${secondTool}` : ""} so orders, invoices, and customer data flow without manual re-entry`
          : `Auto-sync your core business tools to eliminate copy-paste between systems`,
        `Set up smart follow-up sequences for ${ind} — automatically chase leads, confirm bookings, and send reminders`,
        aiToolsStr
          ? `Build on your ${aiToolsStr.split(",").slice(0, 2).join(" and ")} setup with dedicated agents for ${painShort.toLowerCase()}`
          : `Deploy AI agents that handle ${painShort.toLowerCase()} while you focus on ${goal.toLowerCase()}`,
      ];

      const recs = [
        `Start with ${autoFirst ? autoFirst.toLowerCase() : painShort.toLowerCase()} — it's the quickest win for your ${ind} business${mh > 10 ? " and where you're losing the most hours" : ""}`,
        firstTool
          ? `Connect ${firstTool} to an AI agent so ${mh > 15 ? "the 15+ hours you spend on manual work" : "repetitive data entry"} gets handled automatically`
          : `Plug your core tools into an AI agent pipeline — stop copy-pasting between systems`,
        blockerAdvice[answers.automationBlocker] ||
          `Book a free audit call to map the exact automation roadmap for your ${ind} business`,
        `${ind} businesses using AI agents are already saving ${mh > 15 ? "15-20" : "8-12"} hours/week — the same is within reach for your ${goal.toLowerCase()} goal`,
      ];

      parsed = {
        score,
        level,
        estimatedSavings:
          mh > 20
            ? "15-22 hours/week"
            : mh > 5
              ? "6-12 hours/week"
              : "3-6 hours/week",
        topAutomations: autos,
        recommendations: recs,
        impactSummary: `As a ${ind} business ${answers.teamSize ? `with a ${answers.teamSize} team` : ""} spending ${mh > 15 ? "15+" : mh > 5 ? "5-10" : "a few"} hours/week on ${painShort.toLowerCase()}, AI agents could reclaim that time so you can focus on ${goal.toLowerCase()}.`,
      };
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error("[ai-score] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
