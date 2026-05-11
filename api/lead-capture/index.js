import nodemailer from "nodemailer";

// Email transporter — lazy-initialized
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST = "smtp.gmail.com",
    SMTP_PORT = "587",
    SMTP_USER = "",
    SMTP_PASS = "",
  } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[lead-capture] SMTP credentials not set — email will be skipped",
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

function buildEmailHtml(data) {
  const {
    score,
    level,
    estimatedSavings,
    topAutomations,
    recommendations,
    industry,
  } = data;
  const scoreColor =
    score >= 70 ? "#06B6D4" : score >= 45 ? "#22D3EE" : "#F59E0B";
  const levelEmoji = level.includes("Ready")
    ? "🟢"
    : level.includes("High")
      ? "🔵"
      : level.includes("Getting")
        ? "🟡"
        : "🟠";

  const automationItems = (topAutomations || [])
    .map((a) => `<li style="margin-bottom:8px;padding-left:4px;">✅ ${a}</li>`)
    .join("");

  const recommendationItems = (recommendations || [])
    .map((r) => `<li style="margin-bottom:8px;padding-left:4px;">→ ${r}</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050A14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0A0F1A;border:1px solid rgba(0,229,255,0.2);border-radius:16px;overflow:hidden;">
    <!-- Header -->
    <tr>
      <td style="padding:32px 28px 16px;text-align:center;background:linear-gradient(135deg,rgba(0,229,255,0.08),transparent);">
        <p style="margin:0;font-size:11px;font-family:monospace;color:#00E5FF;text-transform:uppercase;letter-spacing:3px;">AI Readiness Score</p>
        <h1 style="margin:12px 0 0;font-size:28px;color:#fff;font-weight:800;">Your Results Are In</h1>
      </td>
    </tr>

    <!-- Score -->
    <tr>
      <td style="padding:24px 28px;text-align:center;">
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="text-align:center;">
              <p style="margin:0;font-size:72px;font-weight:800;font-family:monospace;color:${scoreColor};line-height:1;">${score}</p>
              <p style="margin:4px 0 0;font-size:16px;color:#64748b;font-family:monospace;">/100</p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:16px;font-weight:700;color:${scoreColor};">${levelEmoji} ${level}</p>
        <p style="margin:8px 0 0;font-size:14px;color:#94a3b8;">Estimated savings: <strong style="color:#fff;">${estimatedSavings}</strong></p>
      </td>
    </tr>

    <!-- Divider -->
    <tr><td style="padding:0 28px;"><hr style="border:none;border-top:1px solid rgba(0,229,255,0.15);"></td></tr>

    <!-- Top Automations -->
    ${
      automationItems
        ? `
    <tr>
      <td style="padding:24px 28px;">
        <p style="margin:0 0 12px;font-size:11px;font-family:monospace;color:#00E5FF;text-transform:uppercase;letter-spacing:2px;">⚡ Top Automations for You</p>
        <ul style="margin:0;padding-left:20px;list-style:none;font-size:14px;color:#cbd5e1;line-height:1.6;">
          ${automationItems}
        </ul>
      </td>
    </tr>
    `
        : ""
    }

    <!-- Recommendations -->
    ${
      recommendationItems
        ? `
    <tr>
      <td style="padding:0 28px 24px;">
        <p style="margin:0 0 12px;font-size:11px;font-family:monospace;color:#00E5FF;text-transform:uppercase;letter-spacing:2px;">💡 Your Personalized Roadmap</p>
        <ul style="margin:0;padding-left:20px;list-style:none;font-size:14px;color:#cbd5e1;line-height:1.6;">
          ${recommendationItems}
        </ul>
      </td>
    </tr>
    `
        : ""
    }

    <!-- Divider -->
    <tr><td style="padding:0 28px;"><hr style="border:none;border-top:1px solid rgba(0,229,255,0.15);"></td></tr>

    <!-- CTA -->
    <tr>
      <td style="padding:24px 28px 32px;text-align:center;">
        <p style="margin:0 0 16px;font-size:15px;color:#94a3b8;">Want to see these automations running in <em>your</em> business?</p>
        <a href="https://cal.com/aariz-a/ai-audit" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#00E5FF,#06B6D4);color:#050A14;font-weight:700;font-size:16px;text-decoration:none;border-radius:12px;">Book Free AI Audit →</a>
        <p style="margin:12px 0 0;font-size:11px;color:#475569;font-family:monospace;">30 min · zero pitch · personalized roadmap</p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:16px 28px;text-align:center;background:rgba(0,229,255,0.03);">
        <p style="margin:0;font-size:11px;color:#475569;">RizFlow · AI Automation for SMEs</p>
        <p style="margin:4px 0 0;font-size:10px;color:#334155;">Singapore · <a href="https://rizflow.co" style="color:#00E5FF;text-decoration:none;">rizflow.co</a></p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(data) {
  const { score, level, estimatedSavings, topAutomations, recommendations } =
    data;
  let text = `Your AI Readiness Score: ${score}/100 (${level})\n`;
  text += `Estimated weekly savings: ${estimatedSavings}\n\n`;

  if (topAutomations?.length) {
    text += `Top Automations:\n`;
    topAutomations.forEach((a) => (text += `  ✅ ${a}\n`));
    text += `\n`;
  }

  if (recommendations?.length) {
    text += `Your Roadmap:\n`;
    recommendations.forEach((r) => (text += `  → ${r}\n`));
    text += `\n`;
  }

  text += `Book your free 30-minute AI Audit: https://cal.com/aariz-a/ai-audit\n`;
  text += `\n— RizFlow · AI Automation for SMEs\n`;
  text += `rizflow.co`;

  return text;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://rizflow.co");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
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
    } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    // Send welcome email with results
    const transport = getTransporter();
    if (transport) {
      try {
        await transport.sendMail({
          from: `"RizFlow" <${process.env.SMTP_USER}>`,
          to: email,
          replyTo: "main@rizflow.co",
          subject: `Your AI Readiness Score: ${score}/100 — Personalized Roadmap Inside`,
          html: buildEmailHtml({
            score,
            level,
            estimatedSavings,
            topAutomations,
            recommendations,
            industry,
          }),
          text: buildEmailText({
            score,
            level,
            estimatedSavings,
            topAutomations,
            recommendations,
          }),
        });
        console.log(`[lead-capture] Welcome email sent to ${email}`);
      } catch (emailErr) {
        // Email failure is non-critical — lead is still captured
        console.error("[lead-capture] Email send failed:", emailErr.message);
      }
    } else {
      console.warn("[lead-capture] SMTP not configured — skipping email send");
    }

    // Forward to VPS webhook for Google Sheets + email nurture
    const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL;
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            score,
            level,
            estimatedSavings,
            industry,
            teamSize,
            biggestPain,
            source: source || "ai-score-preview",
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.error("[lead-capture] Webhook failed:", webhookErr.message);
      }
    }

    res.status(200).json({ success: true, message: "Roadmap on its way!" });
  } catch (err) {
    console.error("[lead-capture] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
