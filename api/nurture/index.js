/**
 * RizFlow Email Nurture Sequence API
 *
 * 5-email drip sequence triggered after AI Score quiz submission:
 *   Day 0:  Score + Top 3 automations (sent by lead-capture, not here)
 *   Day 2:  RainFresh case study
 *   Day 5:  Brewed Identity case study
 *   Day 8:  Industry-specific pain point email
 *   Day 12: Urgency CTA — limited audit spots
 *
 * Called by Vercel Cron or external scheduler.
 * Each call sends ALL due emails (checks scheduled_at <= now).
 */

import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const {
    SMTP_HOST = "smtp.gmail.com",
    SMTP_PORT = "465",
    SMTP_USER = "",
    SMTP_PASS = "",
  } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

// ── In-memory store (production: replace with DB/Google Sheets) ──
// Format: { email: { score, level, estimatedSavings, topAutomations, industry, biggestPain, sentEmails: Set } }
const leads = new Map();

/**
 * Register a lead for nurture sequence.
 * Called by lead-capture after sending the Day 0 welcome email.
 */
export function registerLead(data) {
  leads.set(data.email, {
    ...data,
    registeredAt: new Date().toISOString(),
    sentEmails: new Set(["day0"]),
  });
  console.log(`[nurture] Registered lead: ${data.email}`);
}

/**
 * Send a single nurture email.
 */
async function sendNurtureEmail(to, subject, html, text) {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[nurture] SMTP not configured — skipping email send");
    return false;
  }
  try {
    await transport.sendMail({
      from: `"Aariz from RizFlow" <${process.env.SMTP_USER}>`,
      to,
      replyTo: "main@rizflow.co",
      subject,
      html,
      text,
    });
    console.log(`[nurture] Sent email to ${to}: ${subject}`);
    return true;
  } catch (err) {
    console.error(`[nurture] Failed to send to ${to}:`, err.message);
    return false;
  }
}

// ── Email Templates ──

const BASE_STYLE = `
  body { margin:0; padding:0; background:#050A14; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#e2e8f0; }
  .container { max-width:560px; margin:0 auto; background:#0A0F1A; border:1px solid rgba(0,229,255,0.2); border-radius:16px; overflow:hidden; }
  .header { padding:32px 28px 16px; text-align:center; background:linear-gradient(135deg,rgba(0,229,255,0.08),transparent); }
  .content { padding:24px 28px; }
  .footer { padding:16px 28px; text-align:center; background:rgba(0,229,255,0.03); }
  h1 { color:#fff; font-size:24px; margin:0 0 8px; font-weight:800; }
  h2 { color:#fff; font-size:20px; margin:0 0 12px; }
  p { color:#94a3b8; font-size:14px; line-height:1.6; margin:0 0 16px; }
  .stat-box { display:inline-block; padding:12px 20px; margin:4px; background:#050A14; border:1px solid rgba(0,229,255,0.2); border-radius:10px; text-align:center; }
  .stat-number { font-size:28px; font-weight:800; color:#00E5FF; font-family:monospace; }
  .stat-label { font-size:10px; color:#64748b; text-transform:uppercase; letter-spacing:1px; }
  .cta-button { display:inline-block; padding:14px 32px; background:linear-gradient(135deg,#00E5FF,#06B6D4); color:#050A14; font-weight:700; font-size:16px; text-decoration:none; border-radius:12px; }
  .cta-subtext { margin:10px 0 0; font-size:11px; color:#475569; font-family:monospace; }
  .divider { border:none; border-top:1px solid rgba(0,229,255,0.15); margin:16px 0; }
  .label { font-size:11px; color:#00E5FF; text-transform:uppercase; letter-spacing:2px; font-family:monospace; margin:0 0 8px; }
  .metric { color:#06B6D4; font-weight:700; }
  .unsubscribe { font-size:11px; color:#475569; }
  .unsubscribe a { color:#64748b; text-decoration:underline; }
`;

function wrapEmail(bodyHtml, bodyText) {
  return {
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${BASE_STYLE}</style></head><body>${bodyHtml}</body></html>`,
    text: bodyText,
  };
}

// ── Day 2: RainFresh Case Study ──
function emailDay2(lead) {
  const { industry, biggestPain } = lead;
  const industryRef =
    industry && industry !== "business" ? ` in ${industry}` : "";
  const painRef = biggestPain
    ? ` — especially that ${biggestPain.toLowerCase()} headache`
    : "";

  const html = `
    <div class="container">
      <div class="header">
        <p class="label" style="text-align:center;">Case Study</p>
        <h1>RainFresh Cut Processing Time by 99%</h1>
        <p style="color:#94a3b8;">Here's what AI automation looks like for a real Singapore business.</p>
      </div>
      <div class="content">
        <p>Two days ago you got your AI Readiness Score. Today I want to show you what "AI-Ready" actually looks like in practice.</p>
        <p><strong style="color:#fff;">RainFreshSG</strong> is a fresh produce business in Singapore. Before RizFlow, they spent hours manually processing orders, tracking deliveries, and responding to buyers.</p>
        <div style="text-align:center;padding:16px 0;">
          <div class="stat-box"><div class="stat-number">99%</div><div class="stat-label">Faster Processing</div></div>
          <div class="stat-box"><div class="stat-number">14+</div><div class="stat-label">Hrs/Week Saved</div></div>
          <div class="stat-box"><div class="stat-number">100%</div><div class="stat-label">More Buyer Emails</div></div>
        </div>
        <hr class="divider">
        <p>Their AI agents now handle order confirmations, delivery tracking, and buyer communications — automatically. The owner went from working <em>in</em> the business to working <em>on</em> it.</p>
        <p>Your business${industryRef} could see similar results${painRef}.</p>
        <div style="text-align:center;padding:20px 0;">
          <a href="https://www.rizflow.co/case-study/rainfresh-sg" class="cta-button">Read the Full Case Study →</a>
          <p class="cta-subtext">Real numbers from a real Singapore business</p>
        </div>
      </div>
      <div class="footer">
        <p class="unsubscribe">RizFlow · AI Automation for SMEs · Singapore<br><a href="https://rizflow.co/unsubscribe?email={{EMAIL}}">Unsubscribe</a></p>
      </div>
    </div>`;

  const text = `RAINFRESH CASE STUDY: 99% Faster Processing, 14+ Hrs/Week Saved

RainFreshSG is a fresh produce business in Singapore. Before RizFlow, they spent hours manually processing orders, tracking deliveries, and responding to buyers.

Now their AI agents handle it all automatically:
- 99% faster processing
- 14+ hours/week saved
- 100% more buyer emails

Your business${industryRef} could see similar results${painRef}.

Read the full case study: https://www.rizflow.co/case-study/rainfresh-sg

— Aariz from RizFlow
Unsubscribe: https://rizflow.co/unsubscribe?email={{EMAIL}}`;

  return wrapEmail(html, text);
}

// ── Day 5: Brewed Identity Case Study ──
function emailDay5(lead) {
  const { estimatedSavings, industry } = lead;
  const savingsRef = estimatedSavings
    ? ` You estimated ${estimatedSavings} potential savings — this case study shows what that looks like in practice.`
    : "";

  const html = `
    <div class="container">
      <div class="header">
        <p class="label" style="text-align:center;">Case Study #2</p>
        <h1>Brewed Identity: 93% Faster Listings</h1>
        <p style="color:#94a3b8;">Another real business, another dramatic before/after.</p>
      </div>
      <div class="content">
        <p>Last time I shared RainFresh's story. Today: <strong style="color:#fff;">Brewed Identity</strong>, a Singapore business that was drowning in manual listing work and slow response times.</p>
        <div style="text-align:center;padding:16px 0;">
          <div class="stat-box"><div class="stat-number">93%</div><div class="stat-label">Faster Listings</div></div>
          <div class="stat-box"><div class="stat-number">99%</div><div class="stat-label">Faster Response</div></div>
          <div class="stat-box"><div class="stat-number">10+</div><div class="stat-label">Hrs/Week Saved</div></div>
        </div>
        <hr class="divider">
        <p>${savingsRef}</p>
        <p>Here's the thing: both RainFresh and Brewed Identity started exactly where you are now — wondering if AI automation is worth it for <em>their</em> specific business. The answer was yes. For both of them.</p>
        <div style="text-align:center;padding:20px 0;">
          <a href="https://www.rizflow.co/case-study/brewed-identity" class="cta-button">See How Brewed Identity Did It →</a>
          <p class="cta-subtext">Full breakdown: what they had, what changed, what they saved</p>
        </div>
      </div>
      <div class="footer">
        <p class="unsubscribe">RizFlow · AI Automation for SMEs · Singapore<br><a href="https://rizflow.co/unsubscribe?email={{EMAIL}}">Unsubscribe</a></p>
      </div>
    </div>`;

  const text = `BREWED IDENTITY CASE STUDY: 93% Faster Listings, 10+ Hrs/Week Saved

Before RizFlow, Brewed Identity was drowning in manual listing work and slow response times. After:
- 93% faster listings
- 99% faster response time
- 10+ hours/week saved
${savingsRef}

Both RainFresh and Brewed Identity started exactly where you are now. The answer was yes for both.

See the full breakdown: https://www.rizflow.co/case-study/brewed-identity

— Aariz from RizFlow
Unsubscribe: https://rizflow.co/unsubscribe?email={{EMAIL}}`;

  return wrapEmail(html, text);
}

// ── Day 8: Industry-Specific Pain Point ──
function emailDay8(lead) {
  const { industry, biggestPain } = lead;
  const industryLabel =
    industry && industry !== "business" ? industry : "your industry";

  const painPoints = {
    retail: {
      pain: "inventory mismatches and order processing delays",
      automation:
        "Auto-sync inventory across channels, process orders in real-time, send shipment updates automatically",
      hours: "8-12",
    },
    food: {
      pain: "order mix-ups during peak hours and slow customer response times",
      automation:
        "Auto-confirm orders, manage reservations, send real-time kitchen status updates",
      hours: "10-15",
    },
    services: {
      pain: "client follow-ups falling through the cracks and manual scheduling conflicts",
      automation:
        "Auto-follow-up sequences, smart scheduling, client communication automation",
      hours: "6-10",
    },
    health: {
      pain: "appointment no-shows and patient follow-up gaps",
      automation:
        "Automated appointment reminders, patient follow-up sequences, prescription refill alerts",
      hours: "8-14",
    },
    construction: {
      pain: "lost quotes, missed follow-ups, and project update bottlenecks",
      automation:
        "Auto-generate quotes from inquiries, follow-up sequences, project status updates",
      hours: "10-16",
    },
    education: {
      pain: "student enrollment delays and repetitive admin work",
      automation:
        "Auto-respond to enrollment inquiries, schedule reminders, progress report generation",
      hours: "6-10",
    },
    realestate: {
      pain: "slow listing turnaround and lead response times that cost deals",
      automation:
        "Auto-respond to property inquiries, schedule viewings, generate listing descriptions",
      hours: "8-14",
    },
    logistics: {
      pain: "shipment tracking chaos and customer status update gaps",
      automation:
        "Auto-track shipments, send proactive updates, handle delivery rescheduling",
      hours: "10-18",
    },
    tech: {
      pain: "support ticket backlogs and manual onboarding processes",
      automation:
        "Auto-triage support tickets, personalized onboarding sequences, status updates",
      hours: "6-12",
    },
  };

  const pp = painPoints[industry] || {
    pain: biggestPain || "repetitive manual tasks eating up your week",
    automation:
      "Custom AI agents that handle your specific workflows automatically",
    hours: "8-14",
  };

  const html = `
    <div class="container">
      <div class="header">
        <p class="label" style="text-align:center;">${industryLabel} Focus</p>
        <h1>The ${pp.hours}-Hour Week You're Losing</h1>
        <p style="color:#94a3b8;">And exactly how to get it back.</p>
      </div>
      <div class="content">
        <p>If you run a <strong style="color:#fff;">${industryLabel}</strong> business in Singapore, you already know the biggest time drain:</p>
        <div style="background:#050A14;border:1px solid rgba(0,229,255,0.2);border-radius:10px;padding:16px;margin:16px 0;">
          <p style="margin:0;color:#00E5FF;font-size:16px;font-weight:700;">${pp.pain}</p>
          <p style="margin:8px 0 0;color:#64748b;font-size:12px;">This is what ${industryLabel} owners tell us eats ${pp.hours}+ hours every week.</p>
        </div>
        <p>Here's what that looks like when it's automated:</p>
        <ul style="color:#cbd5e1;padding-left:20px;font-size:14px;line-height:2;">
          <li>${pp.automation}</li>
          <li>Zero manual data entry — everything flows between your existing tools</li>
          <li>Owner gets a phone notification summary instead of doing the work</li>
        </ul>
        <p>That's <strong style="color:#fff;">${pp.hours}+ hours/week</strong> back in your pocket. Time you can spend on growth, not grunt work.</p>
        <div style="text-align:center;padding:20px 0;">
          <a href="https://www.rizflow.co/audit" class="cta-button">Get Your Free Audit →</a>
          <p class="cta-subtext">30 min · personalized to your ${industryLabel} business · zero pitch</p>
        </div>
      </div>
      <div class="footer">
        <p class="unsubscribe">RizFlow · AI Automation for SMEs · Singapore<br><a href="https://rizflow.co/unsubscribe?email={{EMAIL}}">Unsubscribe</a></p>
      </div>
    </div>`;

  const text = `THE ${pp.hours}-HOUR WEEK YOU'RE LOSING — AND HOW TO GET IT BACK

If you run a ${industryLabel} business, the biggest time drain is:
${pp.pain}

When automated:
- ${pp.automation}
- Zero manual data entry
- Owner gets a phone notification summary instead of doing the work

That's ${pp.hours}+ hours/week back. Time for growth, not grunt work.

Get your free 30-minute audit: https://www.rizflow.co/audit

— Aariz from RizFlow
Unsubscribe: https://rizflow.co/unsubscribe?email={{EMAIL}}`;

  return wrapEmail(html, text);
}

// ── Day 12: Urgency CTA ──
function emailDay12(lead) {
  const { score, estimatedSavings } = lead;
  const scoreRef = score
    ? `You scored ${score}/100 on our AI Readiness Quiz — that puts you in the "${score >= 60 ? "high potential" : "ready to grow"}" category.`
    : "You took our AI Readiness Quiz recently.";
  const savingsRef = estimatedSavings
    ? ` Our analysis showed ${estimatedSavings} in potential weekly savings for your business.`
    : "";

  const html = `
    <div class="container">
      <div class="header">
        <p class="label" style="text-align:center;">⏳ Limited Availability</p>
        <h1>5 Audit Spots Left This Month</h1>
        <p style="color:#94a3b8;">Your personalized roadmap is ready — but the window is closing.</p>
      </div>
      <div class="content">
        <p>${scoreRef}${savingsRef}</p>
        <p>Over the past 12 days, you've seen:</p>
        <ul style="color:#cbd5e1;padding-left:20px;font-size:14px;line-height:2;">
          <li>✅ <strong style="color:#fff;">RainFresh</strong> — 99% faster processing, 14+ hrs/week saved</li>
          <li>✅ <strong style="color:#fff;">Brewed Identity</strong> — 93% faster listings, 10+ hrs/week saved</li>
          <li>✅ Exactly how AI automation solves <em>your</em> industry's biggest pain point</li>
        </ul>
        <hr class="divider">
        <p>Here's what happens in a free 30-minute Discovery Audit:</p>
        <ol style="color:#cbd5e1;padding-left:20px;font-size:14px;line-height:2;">
          <li>We map your top 3 time-draining workflows</li>
          <li>You get a personalized automation roadmap</li>
          <li>We show you live demo agents built for your industry</li>
          <li>Zero pitch — just actionable next steps</li>
        </ol>
        <div style="background:#050A14;border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:16px;margin:16px 0;text-align:center;">
          <p style="margin:0;color:#F59E0B;font-weight:700;">⚡ Only 5 free audit slots remain this month</p>
        </div>
        <div style="text-align:center;padding:20px 0;">
          <a href="https://cal.com/aariz-a/ai-audit" class="cta-button">Book Your Free Audit Now →</a>
          <p class="cta-subtext">30 min · zero pitch · personalized roadmap for your business</p>
        </div>
        <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px;">If you're not ready yet, that's fine — these emails stop here. No spam, ever.</p>
      </div>
      <div class="footer">
        <p class="unsubscribe">RizFlow · AI Automation for SMEs · Singapore<br><a href="https://rizflow.co/unsubscribe?email={{EMAIL}}">Unsubscribe</a></p>
      </div>
    </div>`;

  const text = `5 AUDIT SPOTS LEFT THIS MONTH

${scoreRef}${savingsRef}

Over the past 12 days, you've seen:
- RainFresh: 99% faster processing, 14+ hrs/week saved
- Brewed Identity: 93% faster listings, 10+ hrs/week saved
- How AI automation solves your industry's biggest pain

What happens in a free 30-minute Discovery Audit:
1. We map your top 3 time-draining workflows
2. You get a personalized automation roadmap
3. Live demo agents built for your industry
4. Zero pitch — just actionable next steps

Only 5 free audit slots remain this month.

Book now: https://cal.com/aariz-a/ai-audit

— Aariz from RizFlow
Unsubscribe: https://rizflow.co/unsubscribe?email={{EMAIL}}`;

  return wrapEmail(html, text);
}

// ── Nurture Email Config ──
const NURTURE_EMAILS = [
  {
    day: 2,
    subjectFn: (l) => `RainFresh saved 14+ hours/week — see how`,
    templateFn: emailDay2,
  },
  {
    day: 5,
    subjectFn: (l) => `Brewed Identity: 93% faster listings`,
    templateFn: emailDay5,
  },
  {
    day: 8,
    subjectFn: (l) =>
      `The ${l.estimatedSavings || "8-14"} hours/week you're losing`,
    templateFn: emailDay8,
  },
  {
    day: 12,
    subjectFn: (l) => `5 audit spots left this month — book yours`,
    templateFn: emailDay12,
  },
];

/**
 * Process nurture emails for all registered leads.
 * Called by Vercel Cron or external scheduler.
 * Sends emails that are due (day >= scheduled day) and not yet sent.
 */
export async function processNurtureEmails() {
  const now = Date.now();
  let sent = 0;
  let skipped = 0;

  for (const [email, lead] of leads) {
    const registeredAt = new Date(lead.registeredAt).getTime();
    const daysSince = Math.floor((now - registeredAt) / (1000 * 60 * 60 * 24));

    for (const emailConfig of NURTURE_EMAILS) {
      const emailKey = `day${emailConfig.day}`;
      if (daysSince >= emailConfig.day && !lead.sentEmails.has(emailKey)) {
        const { html, text } = emailConfig.templateFn(lead);
        const personalizedHtml = html.replace(
          /\{\{EMAIL\}\}/g,
          encodeURIComponent(email),
        );
        const personalizedText = text.replace(
          /\{\{EMAIL\}\}/g,
          encodeURIComponent(email),
        );
        const subject = emailConfig.subjectFn(lead);

        const success = await sendNurtureEmail(
          email,
          subject,
          personalizedHtml,
          personalizedText,
        );
        if (success) {
          lead.sentEmails.add(emailKey);
          sent++;
        } else {
          skipped++;
        }
      }
    }
  }

  return { sent, skipped, totalLeads: leads.size };
}

/**
 * Vercel Cron endpoint — triggers nurture email processing.
 * Add to vercel.json: { "crons": [{ "path": "/api/nurture", "schedule": "0 9 * * *" }] }
 */
export default async function handler(req, res) {
  // Only allow GET from Vercel Cron or POST with auth
  if (req.method === "POST") {
    const { action, ...data } = req.body;

    // Register a new lead
    if (action === "register") {
      if (!data.email) {
        return res.status(400).json({ error: "Email required" });
      }
      registerLead(data);
      return res.status(200).json({
        success: true,
        message: "Lead registered for nurture sequence",
      });
    }

    // Send a specific email manually
    if (action === "send") {
      const { email: to, day, subject, html, text } = req.body;
      if (!to || !day || !subject || !html) {
        return res
          .status(400)
          .json({ error: "email, day, subject, html required" });
      }
      const success = await sendNurtureEmail(to, subject, html, text);
      return res.status(success ? 200 : 500).json({ success });
    }

    return res
      .status(400)
      .json({ error: "Unknown action. Use 'register' or 'send'." });
  }

  // GET — Vercel Cron trigger: process all due nurture emails
  if (req.method === "GET") {
    // Verify cron secret if set
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await processNurtureEmails();
    return res.status(200).json({ success: true, ...result });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
