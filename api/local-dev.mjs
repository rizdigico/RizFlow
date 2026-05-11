#!/usr/bin/env node
// Local dev API server for the demo chat endpoint
// Proxies chat requests to OpenRouter with free-model cascade
// In production, Vercel serverless functions handle this (with VPS proxy fallback)

import http from "node:http";
import nodemailer from "nodemailer";

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
          const ai = aiMap[answers.aiToolsExperience] || 0;
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

  // ── Lead Capture Endpoint ──
  if (req.url === "/api/lead-capture" && req.method === "POST") {
    let leadBody = "";
    req.on("data", (chunk) => {
      leadBody += chunk;
    });
    req.on("end", async () => {
      try {
        const data = JSON.parse(leadBody);
        const {
          email,
          score,
          level,
          estimatedSavings,
          topAutomations,
          recommendations,
          industry,
          teamSize,
          biggestPain,
          source,
        } = data;

        if (!email || !email.includes("@")) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Valid email required" }));
        }

        console.log(
          `[lead-capture] New lead: ${email} | Score: ${score} | Level: ${level} | Source: ${source}`,
        );

        // Save to local leads file as backup
        const fs = await import("fs/promises");
        const leadsPath = new URL("../leads.json", import.meta.url);
        let leads = [];
        try {
          const existing = await fs.readFile(leadsPath, "utf-8");
          leads = JSON.parse(existing);
        } catch {}
        leads.push({
          email,
          score,
          level,
          estimatedSavings,
          industry,
          teamSize,
          biggestPain,
          source,
          submittedAt: new Date().toISOString(),
        });
        await fs.writeFile(leadsPath, JSON.stringify(leads, null, 2));

        // Send welcome email with results
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;
        if (SMTP_USER && SMTP_PASS) {
          try {
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST || "smtp.gmail.com",
              port: parseInt(process.env.SMTP_PORT || "587", 10),
              secure: (process.env.SMTP_PORT || "587") === "465",
              auth: { user: SMTP_USER, pass: SMTP_PASS },
            });

            const scoreColor =
              score >= 70 ? "#06B6D4" : score >= 45 ? "#22D3EE" : "#F59E0B";
            const automationHtml = (topAutomations || [])
              .map((a) => `<li style="margin-bottom:8px;">✅ ${a}</li>`)
              .join("");
            const recHtml = (recommendations || [])
              .map((r) => `<li style="margin-bottom:8px;">→ ${r}</li>`)
              .join("");

            await transporter.sendMail({
              from: `"RizFlow" <${SMTP_USER}>`,
              to: email,
              replyTo: "main@rizflow.co",
              subject: `Your AI Readiness Score: ${score}/100 — Personalized Roadmap Inside`,
              html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#050A14;font-family:sans-serif;color:#e2e8f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0A0F1A;border:1px solid rgba(0,229,255,0.2);border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 28px 16px;text-align:center;background:linear-gradient(135deg,rgba(0,229,255,0.08),transparent);"><p style="margin:0;font-size:11px;font-family:monospace;color:#00E5FF;text-transform:uppercase;letter-spacing:3px;">AI Readiness Score</p><h1 style="margin:12px 0 0;font-size:28px;color:#fff;font-weight:800;">Your Results Are In</h1></td></tr>
<tr><td style="padding:24px 28px;text-align:center;"><p style="margin:0;font-size:72px;font-weight:800;font-family:monospace;color:${scoreColor};line-height:1;">${score}</p><p style="margin:4px 0 0;font-size:16px;color:#64748b;font-family:monospace;">/100</p><p style="margin:16px 0 0;font-size:16px;font-weight:700;color:${scoreColor};">${level}</p><p style="margin:8px 0 0;font-size:14px;color:#94a3b8;">Estimated savings: <strong style="color:#fff;">${estimatedSavings}</strong></p></td></tr>
<tr><td style="padding:0 28px;"><hr style="border:none;border-top:1px solid rgba(0,229,255,0.15);"></td></tr>
${automationHtml ? `<tr><td style="padding:24px 28px;"><p style="margin:0 0 12px;font-size:11px;font-family:monospace;color:#00E5FF;text-transform:uppercase;letter-spacing:2px;">⚡ Top Automations for You</p><ul style="margin:0;padding-left:20px;list-style:none;font-size:14px;color:#cbd5e1;">${automationHtml}</ul></td></tr>` : ""}
${recHtml ? `<tr><td style="padding:0 28px 24px;"><p style="margin:0 0 12px;font-size:11px;font-family:monospace;color:#00E5FF;text-transform:uppercase;letter-spacing:2px;">💡 Your Personalized Roadmap</p><ul style="margin:0;padding-left:20px;list-style:none;font-size:14px;color:#cbd5e1;">${recHtml}</ul></td></tr>` : ""}
<tr><td style="padding:0 28px;"><hr style="border:none;border-top:1px solid rgba(0,229,255,0.15);"></td></tr>
<tr><td style="padding:24px 28px 32px;text-align:center;"><p style="margin:0 0 16px;font-size:15px;color:#94a3b8;">Want to see these automations running in <em>your</em> business?</p><a href="https://cal.com/aariz-a/ai-audit" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#00E5FF,#06B6D4);color:#050A14;font-weight:700;font-size:16px;text-decoration:none;border-radius:12px;">Book Free AI Audit →</a><p style="margin:12px 0 0;font-size:11px;color:#475569;font-family:monospace;">30 min · zero pitch · personalized roadmap</p></td></tr>
<tr><td style="padding:16px 28px;text-align:center;background:rgba(0,229,255,0.03);"><p style="margin:0;font-size:11px;color:#475569;">RizFlow · AI Automation for SMEs</p><p style="margin:4px 0 0;font-size:10px;color:#334155;">Singapore · <a href="https://rizflow.co" style="color:#00E5FF;text-decoration:none;">rizflow.co</a></p></td></tr>
</table></body></html>`,
              text: `Your AI Readiness Score: ${score}/100 (${level})\nEstimated weekly savings: ${estimatedSavings}\n\nBook your free AI Audit: https://cal.com/aariz-a/ai-audit\n\n— RizFlow · rizflow.co`,
            });
            console.log(`[lead-capture] Welcome email sent to ${email}`);

            // Notify business owner
            try {
              const ownerHtml = `
              <div style="font-family:monospace;background:#0a0f1a;color:#e2e8f0;padding:24px;border-radius:8px;">
                <h2 style="color:#00E5FF;margin:0 0 16px;">New Lead Captured</h2>
                <table style="color:#cbd5e1;font-size:14px;">
                  <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Email</td><td><strong>${email}</strong></td></tr>
                  <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Score</td><td><strong style="color:${score >= 70 ? "#06B6D4" : score >= 45 ? "#22D3EE" : "#F59E0B"}">${score}/100</strong></td></tr>
                  <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Level</td><td>${level}</td></tr>
                  <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Savings</td><td>${estimatedSavings}</td></tr>
                  ${industry ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Industry</td><td>${industry}</td></tr>` : ""}
                  ${teamSize ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Team Size</td><td>${teamSize}</td></tr>` : ""}
                  ${biggestPain ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Biggest Pain</td><td>${biggestPain}</td></tr>` : ""}
                  <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Source</td><td>${source || "ai-score-preview"}</td></tr>
                  <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Time</td><td>${new Date().toISOString()}</td></tr>
                </table>
                <p style="margin:16px 0 0;font-size:12px;color:#475569;">— RizFlow Lead Capture</p>
              </div>`;
              await transporter.sendMail({
                from: `"RizFlow Leads" <${SMTP_USER}>`,
                to: "main@rizflow.co",
                subject: `New Lead: ${email} — Score ${score}/100`,
                html: ownerHtml,
                text: `New Lead: ${email}\nScore: ${score}/100 (${level})\nSavings: ${estimatedSavings}\nIndustry: ${industry || "N/A"}\nTeam: ${teamSize || "N/A"}\nPain: ${biggestPain || "N/A"}\nSource: ${source || "ai-score-preview"}\nTime: ${new Date().toISOString()}`,
              });
              console.log(
                `[lead-capture] Owner notification sent for ${email}`,
              );
            } catch (notifyErr) {
              console.error(
                "[lead-capture] Owner notification failed:",
                notifyErr.message,
              );
            }
          } catch (emailErr) {
            console.error(
              "[lead-capture] Email send failed:",
              emailErr.message,
            );
          }
        } else {
          console.warn(
            "[lead-capture] SMTP not configured — skipping email send",
          );
        }

        // Forward to VPS webhook for Google Sheets + email nurture (non-blocking)
        const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL;
        if (WEBHOOK_URL) {
          try {
            await fetch(WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
          } catch (e) {
            console.error("[lead-capture] Webhook failed:", e.message);
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: true, message: "Roadmap on its way!" }),
        );
      } catch (err) {
        console.error("[lead-capture] Error:", err);
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
