import type { ActionStep } from "@/data/demo-industries";

// Action template categories — each has multiple action variants
interface ActionTemplate {
  label: string;
  tool: string;
  icon: string;
  detailFn: (ctx: ActionContext) => string;
}

interface ActionContext {
  businessType: string; // e.g. "dental clinic", "real estate"
  messageSnippet: string; // first ~60 chars of user's message
}

// ─── Template pools ───────────────────────────────────────────────

const TEMPLATES: Record<string, ActionTemplate[]> = {
  scheduling: [
    {
      label: "Checked availability",
      tool: "Google Calendar",
      icon: "📅",
      detailFn: (c) =>
        `Scanned ${c.businessType} calendar for open slots this week`,
    },
    {
      label: "Booked appointment",
      tool: "Calendar API",
      icon: "📅",
      detailFn: (c) =>
        `New ${c.businessType} appointment created with confirmation sent`,
    },
    {
      label: "Sent reminder",
      tool: "Email",
      icon: "📧",
      detailFn: (c) =>
        `24h reminder queued for upcoming ${c.businessType} appointment`,
    },
    {
      label: "Rescheduled booking",
      tool: "Calendar API",
      icon: "🔄",
      detailFn: (c) =>
        `Updated ${c.businessType} appointment time, notifications sent to all parties`,
    },
  ],
  crm: [
    {
      label: "Looked up customer",
      tool: "CRM",
      icon: "👤",
      detailFn: (c) =>
        `Retrieved customer profile and ${c.businessType} interaction history`,
    },
    {
      label: "Created lead",
      tool: "CRM",
      icon: "🎯",
      detailFn: (c) =>
        `New lead added to ${c.businessType} pipeline with source tagging`,
    },
    {
      label: "Updated customer record",
      tool: "CRM",
      icon: "📝",
      detailFn: (c) =>
        `${c.businessType} customer details and interaction notes updated`,
    },
    {
      label: "Set follow-up sequence",
      tool: "CRM",
      icon: "🔄",
      detailFn: (c) =>
        `Automated ${c.businessType} follow-up: 24hr check-in + 7-day re-engagement`,
    },
  ],
  email: [
    {
      label: "Sent confirmation email",
      tool: "Email",
      icon: "📧",
      detailFn: (c) =>
        `Confirmation email sent for ${c.businessType} request`,
    },
    {
      label: "Drafted follow-up email",
      tool: "Email",
      icon: "✉️",
      detailFn: (c) =>
        `Personalized ${c.businessType} follow-up email composed and queued`,
    },
    {
      label: "Sent quote",
      tool: "Email",
      icon: "📄",
      detailFn: (c) =>
        `Pricing quote with ${c.businessType} details generated and sent`,
    },
    {
      label: "Sent WhatsApp message",
      tool: "WhatsApp Business",
      icon: "💬",
      detailFn: (c) =>
        `Quick ${c.businessType} update sent via WhatsApp for faster response`,
    },
  ],
  inventory: [
    {
      label: "Checked stock levels",
      tool: "Inventory System",
      icon: "📦",
      detailFn: (c) =>
        `Current ${c.businessType} inventory checked for availability`,
    },
    {
      label: "Created reorder",
      tool: "Procurement",
      icon: "📦",
      detailFn: (c) =>
        `Purchase order generated for low-stock ${c.businessType} items`,
    },
    {
      label: "Updated catalog",
      tool: "Inventory System",
      icon: "📋",
      detailFn: (c) =>
        `${c.businessType} product availability synced across channels`,
    },
  ],
  payment: [
    {
      label: "Processed payment",
      tool: "Payment Gateway",
      icon: "💳",
      detailFn: (c) =>
        `Payment initiated for ${c.businessType} order`,
    },
    {
      label: "Generated invoice",
      tool: "Accounting",
      icon: "🧾",
      detailFn: (c) =>
        `Invoice created and sent for ${c.businessType} service`,
    },
    {
      label: "Updated order status",
      tool: "Order System",
      icon: "📋",
      detailFn: (c) =>
        `${c.businessType} order marked as confirmed in system`,
    },
  ],
  social: [
    {
      label: "Drafted social response",
      tool: "Social Media",
      icon: "💬",
      detailFn: (c) =>
        `Professional reply to ${c.businessType} customer review prepared`,
    },
    {
      label: "Scheduled post",
      tool: "Social Media",
      icon: "📱",
      detailFn: (c) =>
        `${c.businessType} content queued for optimal engagement time`,
    },
    {
      label: "Sent goodwill gesture",
      tool: "Email",
      icon: "🎁",
      detailFn: (c) =>
        `Complimentary ${c.businessType} voucher sent to reviewer`,
    },
  ],
  notification: [
    {
      label: "Sent team alert",
      tool: "Slack",
      icon: "🔔",
      detailFn: (c) =>
        `Team notified about ${c.businessType} update requiring attention`,
    },
    {
      label: "Sent SMS notification",
      tool: "Twilio",
      icon: "📱",
      detailFn: (c) =>
        `SMS confirmation sent for ${c.businessType} action`,
    },
    {
      label: "Logged in system",
      tool: "Database",
      icon: "📝",
      detailFn: (c) =>
        `${c.businessType} event logged for audit trail and reporting`,
    },
  ],
};

// ─── Keyword → Category mapping ──────────────────────────────────

const KEYWORD_MAP: Record<string, string[]> = {
  scheduling: [
    "book", "schedule", "appointment", "reservation", "slot", "viewing",
    "available", "calendar", "meeting", "visit", "coming", "this weekend",
    "move in", "check-in", "check in", "pickup", "delivery time",
  ],
  crm: [
    "customer", "client", "lead", "inquiry", "profile", "contact",
    "returning", "new customer", "prospect", "family", "tenant", "buyer",
  ],
  email: [
    "email", "confirm", "notify", "send", "follow up", "reply", "response",
    "reach out", "message", "whatsapp", "communication",
  ],
  inventory: [
    "stock", "inventory", "supply", "order", "reorder", "material", "item",
    "product", "available", "out of stock", "low stock", "quantity",
  ],
  payment: [
    "pay", "invoice", "quote", "price", "cost", "bill", "receipt", "deposit",
    "payment", "refund", "pricing", "budget", "fee", "charge",
  ],
  social: [
    "review", "post", "social", "instagram", "tiktok", "facebook", "feedback",
    "rating", "google review", "comment", "mention",
  ],
  notification: [
    "alert", "notify", "team", "staff", "manager", "reminder", "update",
    "flag", "urgent", "incident",
  ],
};

// ─── Category scoring ─────────────────────────────────────────────

function scoreCategories(text: string): Map<string, number> {
  const lower = text.toLowerCase();
  const scores = new Map<string, number>();

  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += 1;
    }
    if (score > 0) scores.set(category, score);
  }

  return scores;
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Generate automated action steps for a custom prompt.
 * Returns 3-4 ActionSteps that match the user's business type and message content.
 */
export function generateActions(
  businessType: string,
  message: string,
): ActionStep[] {
  const ctx: ActionContext = {
    businessType: businessType.toLowerCase(),
    messageSnippet: message.slice(0, 60),
  };

  // Score categories by keyword matches
  const scores = scoreCategories(message + " " + businessType);

  // Also score by business type alone — common business patterns
  const businessLower = businessType.toLowerCase();
  const BUSINESS_PATTERNS: Record<string, string[]> = {
    scheduling: [
      "clinic", "dental", "medical", "salon", "spa", "barber", "hair",
      "gym", "fitness", "studio", "tutor", "tuition", "class", "lesson",
      "restaurant", "cafe", "hotel", "resort", "massage",
    ],
    crm: [
      "real estate", "property", "agent", "broker", "insurance", "legal",
      "consulting", "agency", "finance", "mortgage",
    ],
    inventory: [
      "retail", "shop", "store", "ecommerce", "e-commerce", "f&b",
      "restaurant", "cafe", "bakery", "grocery", "supermarket",
      "construction", "trade", "hardware", "manufacturing",
    ],
    payment: [
      "ecommerce", "e-commerce", "retail", "shop", "store", "subscription",
      "saas", "f&b", "restaurant",
    ],
    social: [
      "marketing", "agency", "brand", "fashion", "beauty", "lifestyle",
      "influencer", "content",
    ],
  };

  for (const [cat, patterns] of Object.entries(BUSINESS_PATTERNS)) {
    for (const p of patterns) {
      if (businessLower.includes(p)) {
        scores.set(cat, (scores.get(cat) || 0) + 0.5);
      }
    }
  }

  // Sort categories by score (descending)
  const sorted = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  // Fallback: always include scheduling + CRM + notification as defaults
  if (sorted.length < 2) {
    const defaults = ["scheduling", "crm", "notification"];
    for (const d of defaults) {
      if (!sorted.includes(d)) sorted.push(d);
    }
  }

  // Pick 3-4 actions across top 2-3 categories
  const actions: ActionStep[] = [];
  const usedLabels = new Set<string>();
  let delay = 800;
  let id = 0;

  for (const category of sorted) {
    if (actions.length >= 4) break;
    const pool = TEMPLATES[category];
    if (!pool) continue;

    // Pick 1-2 from this category
    const pickCount = actions.length === 0 ? 2 : 1;
    let picked = 0;

    for (const template of pool) {
      if (picked >= pickCount || actions.length >= 4) break;
      if (usedLabels.has(template.label)) continue;

      usedLabels.add(template.label);
      actions.push({
        id: `gen-${++id}`,
        label: template.label,
        tool: template.tool,
        icon: template.icon,
        detail: template.detailFn(ctx),
        delayMs: delay,
      });
      delay += 800;
      picked++;
    }
  }

  return actions;
}