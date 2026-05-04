import type { ActionStep } from "@/data/demo-industries";

interface ActionTemplate {
  label: string;
  tool: string;
  icon: string;
  detailFn: (ctx: ActionContext) => string;
}

interface ActionContext {
  businessType: string;
  messageSnippet: string;
}

// ─── Template pools (9 categories with diverse actions) ────────────

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
        `Updated ${c.businessType} appointment time, notifications sent`,
    },
    {
      label: "Added to waitlist",
      tool: "CRM",
      icon: "📋",
      detailFn: (c) =>
        `Customer added to ${c.businessType} waitlist, auto-notify when slot opens`,
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
    {
      label: "Segmented customer",
      tool: "CRM",
      icon: "📊",
      detailFn: (c) =>
        `Tagged customer by ${c.businessType} segment for targeted outreach`,
    },
  ],
  email: [
    {
      label: "Sent confirmation email",
      tool: "Email",
      icon: "📧",
      detailFn: (c) => `Confirmation email sent for ${c.businessType} request`,
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
    {
      label: "Sent SMS notification",
      tool: "Twilio",
      icon: "📱",
      detailFn: (c) => `SMS confirmation sent for ${c.businessType} action`,
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
    {
      label: "Reserved stock",
      tool: "Inventory System",
      icon: "🔒",
      detailFn: (c) =>
        `Items reserved in ${c.businessType} inventory, preventing oversell`,
    },
  ],
  payment: [
    {
      label: "Processed payment",
      tool: "Payment Gateway",
      icon: "💳",
      detailFn: (c) => `Payment initiated for ${c.businessType} order`,
    },
    {
      label: "Generated invoice",
      tool: "Accounting",
      icon: "🧾",
      detailFn: (c) => `Invoice created and sent for ${c.businessType} service`,
    },
    {
      label: "Updated order status",
      tool: "Order System",
      icon: "📋",
      detailFn: (c) => `${c.businessType} order marked as confirmed in system`,
    },
    {
      label: "Issued refund",
      tool: "Payment Gateway",
      icon: "💸",
      detailFn: (c) =>
        `Refund processed for ${c.businessType} customer, confirmation sent`,
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
    {
      label: "Escalated review",
      tool: "Slack",
      icon: "🔔",
      detailFn: (c) =>
        `Negative ${c.businessType} review flagged to manager for personal follow-up`,
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
      label: "Logged in system",
      tool: "Database",
      icon: "📝",
      detailFn: (c) =>
        `${c.businessType} event logged for audit trail and reporting`,
    },
    {
      label: "Triggered automation",
      tool: "Zapier",
      icon: "⚡",
      detailFn: (c) =>
        `Workflow triggered for ${c.businessType} process automation`,
    },
  ],
  complaint: [
    {
      label: "Acknowledged concern",
      tool: "Email",
      icon: "📨",
      detailFn: (c) =>
        `Empathetic response sent to ${c.businessType} customer within 2 minutes`,
    },
    {
      label: "Escalated to manager",
      tool: "Slack",
      icon: "🔔",
      detailFn: (c) =>
        `${c.businessType} complaint flagged to management for resolution`,
    },
    {
      label: "Applied goodwill credit",
      tool: "Payment Gateway",
      icon: "🎁",
      detailFn: (c) =>
        `Complimentary ${c.businessType} credit applied to customer account`,
    },
    {
      label: "Sent follow-up survey",
      tool: "Email",
      icon: "📋",
      detailFn: (c) =>
        `Satisfaction survey queued for ${c.businessType} customer post-resolution`,
    },
  ],
  shipping: [
    {
      label: "Tracked shipment",
      tool: "Shipping API",
      icon: "📍",
      detailFn: (c) =>
        `Real-time ${c.businessType} order tracking retrieved for customer`,
    },
    {
      label: "Updated delivery status",
      tool: "Order System",
      icon: "🚚",
      detailFn: (c) =>
        `${c.businessType} delivery status updated, customer notified automatically`,
    },
    {
      label: "Scheduled pickup",
      tool: "Shipping API",
      icon: "📦",
      detailFn: (c) => `Pickup scheduled for ${c.businessType} return/exchange`,
    },
  ],
  review: [
    {
      label: "Sent thank you",
      tool: "Email",
      icon: "⭐",
      detailFn: (c) =>
        `Personalized thank-you sent to ${c.businessType} reviewer`,
    },
    {
      label: "Requested review",
      tool: "Email",
      icon: "📝",
      detailFn: (c) =>
        `Automated review request sent to satisfied ${c.businessType} customer`,
    },
    {
      label: "Drafted public reply",
      tool: "Google Business",
      icon: "💬",
      detailFn: (c) =>
        `Professional response drafted for ${c.businessType} public review`,
    },
  ],
};

// ─── Weighted keyword scoring ─────────────────────────────────────

interface KeywordEntry {
  word: string;
  weight: number;
}

const KEYWORD_ENTRIES: Record<string, KeywordEntry[]> = {
  scheduling: [
    { word: "book", weight: 3 },
    { word: "schedule", weight: 3 },
    { word: "appointment", weight: 3 },
    { word: "reservation", weight: 3 },
    { word: "slot", weight: 2 },
    { word: "viewing", weight: 2 },
    { word: "calendar", weight: 2 },
    { word: "meeting", weight: 2 },
    { word: "visit", weight: 1 },
    { word: "available", weight: 1 },
    { word: "check-in", weight: 2 },
    { word: "pickup", weight: 1 },
    { word: "reschedule", weight: 3 },
    { word: "cancel", weight: 2 },
    { word: "confirm", weight: 1 },
    { word: "remind", weight: 1 },
    { word: "timing", weight: 1 },
    { word: "session", weight: 2 },
    { word: "class", weight: 2 },
    { word: "consultation", weight: 3 },
    { word: "intake", weight: 2 },
    { word: "enrollment", weight: 2 },
    { word: "walk-in", weight: 1 },
  ],
  crm: [
    { word: "customer", weight: 3 },
    { word: "client", weight: 3 },
    { word: "lead", weight: 3 },
    { word: "inquiry", weight: 2 },
    { word: "prospect", weight: 2 },
    { word: "returning", weight: 2 },
    { word: "new customer", weight: 2 },
    { word: "family", weight: 1 },
    { word: "tenant", weight: 2 },
    { word: "buyer", weight: 2 },
    { word: "profile", weight: 1 },
    { word: "contact", weight: 1 },
    { word: "onboard", weight: 2 },
    { word: "welcome", weight: 1 },
    { word: "membership", weight: 2 },
    { word: "subscriber", weight: 2 },
    { word: "retention", weight: 2 },
    { word: "churn", weight: 2 },
    { word: "loyalty", weight: 2 },
    { word: "referral", weight: 2 },
  ],
  email: [
    { word: "email", weight: 2 },
    { word: "notify", weight: 1 },
    { word: "send", weight: 1 },
    { word: "follow up", weight: 2 },
    { word: "reply", weight: 1 },
    { word: "response", weight: 1 },
    { word: "reach out", weight: 2 },
    { word: "message", weight: 1 },
    { word: "whatsapp", weight: 2 },
    { word: "communication", weight: 1 },
    { word: "newsletter", weight: 2 },
    { word: "campaign", weight: 2 },
    { word: "outreach", weight: 2 },
    { word: "confirm", weight: 1 },
    { word: "receipt", weight: 1 },
    { word: "acknowledge", weight: 2 },
  ],
  inventory: [
    { word: "stock", weight: 3 },
    { word: "inventory", weight: 3 },
    { word: "supply", weight: 2 },
    { word: "reorder", weight: 3 },
    { word: "material", weight: 2 },
    { word: "product", weight: 2 },
    { word: "out of stock", weight: 3 },
    { word: "low stock", weight: 3 },
    { word: "quantity", weight: 1 },
    { word: "restock", weight: 3 },
    { word: "shortage", weight: 2 },
    { word: "running low", weight: 2 },
    { word: "catalog", weight: 1 },
    { word: "item", weight: 1 },
    { word: "ingredient", weight: 2 },
    { word: "parts", weight: 2 },
    { word: "equipment", weight: 2 },
    { word: "medicine", weight: 2 },
    { word: "spare", weight: 2 },
  ],
  payment: [
    { word: "pay", weight: 3 },
    { word: "invoice", weight: 3 },
    { word: "quote", weight: 3 },
    { word: "price", weight: 2 },
    { word: "cost", weight: 2 },
    { word: "bill", weight: 2 },
    { word: "receipt", weight: 2 },
    { word: "deposit", weight: 3 },
    { word: "payment", weight: 3 },
    { word: "refund", weight: 3 },
    { word: "pricing", weight: 2 },
    { word: "budget", weight: 1 },
    { word: "fee", weight: 2 },
    { word: "charge", weight: 2 },
    { word: "checkout", weight: 2 },
    { word: "subscription", weight: 2 },
    { word: "salary", weight: 2 },
    { word: "payroll", weight: 3 },
    { word: "tax", weight: 2 },
    { word: "commission", weight: 2 },
  ],
  social: [
    { word: "review", weight: 2 },
    { word: "post", weight: 2 },
    { word: "social", weight: 2 },
    { word: "instagram", weight: 3 },
    { word: "tiktok", weight: 3 },
    { word: "facebook", weight: 2 },
    { word: "feedback", weight: 2 },
    { word: "rating", weight: 3 },
    { word: "google review", weight: 3 },
    { word: "comment", weight: 1 },
    { word: "mention", weight: 1 },
    { word: "viral", weight: 1 },
    { word: "engagement", weight: 2 },
    { word: "content", weight: 1 },
    { word: "caption", weight: 2 },
    { word: "linkedin", weight: 2 },
    { word: "marketing", weight: 2 },
    { word: "brand", weight: 2 },
    { word: "ad", weight: 2 },
    { word: "promote", weight: 2 },
  ],
  notification: [
    { word: "alert", weight: 3 },
    { word: "team", weight: 1 },
    { word: "staff", weight: 1 },
    { word: "manager", weight: 2 },
    { word: "urgent", weight: 3 },
    { word: "incident", weight: 2 },
    { word: "flag", weight: 2 },
    { word: "escalate", weight: 3 },
    { word: "slipped", weight: 1 },
    { word: "report", weight: 1 },
    { word: "dashboard", weight: 1 },
    { word: "monitor", weight: 1 },
  ],
  complaint: [
    { word: "complaint", weight: 3 },
    { word: "complain", weight: 3 },
    { word: "unhappy", weight: 3 },
    { word: "dissatisfied", weight: 3 },
    { word: "angry", weight: 2 },
    { word: "issue", weight: 2 },
    { word: "problem", weight: 2 },
    { word: "wrong", weight: 2 },
    { word: "terrible", weight: 2 },
    { word: "disappointed", weight: 2 },
    { word: "unacceptable", weight: 3 },
    { word: "apologize", weight: 2 },
    { word: "compensation", weight: 2 },
    { word: "make it right", weight: 3 },
    { word: "refund", weight: 2 },
    { word: "fix", weight: 1 },
    { word: "broken", weight: 2 },
    { word: "delay", weight: 1 },
    { word: "mistake", weight: 2 },
  ],
  shipping: [
    { word: "shipping", weight: 3 },
    { word: "delivery", weight: 3 },
    { word: "ship", weight: 2 },
    { word: "deliver", weight: 2 },
    { word: "tracking", weight: 3 },
    { word: "package", weight: 2 },
    { word: "arrive", weight: 1 },
    { word: "dispatch", weight: 2 },
    { word: "courier", weight: 2 },
    { word: "freight", weight: 2 },
    { word: "return", weight: 2 },
    { word: "exchange", weight: 2 },
  ],
  review: [
    { word: "leave a review", weight: 3 },
    { word: "5 stars", weight: 3 },
    { word: "google review", weight: 3 },
    { word: "feedback request", weight: 2 },
    { word: "testimonial", weight: 2 },
    { word: "satisfied", weight: 1 },
    { word: "happy customer", weight: 2 },
    { word: "positive review", weight: 3 },
    { word: "reputation", weight: 2 },
    { word: "online presence", weight: 2 },
  ],
};

// ─── Business type patterns (expanded with many more industries) ──

const BUSINESS_PATTERNS: Record<string, Record<string, number>> = {
  scheduling: {
    clinic: 3,
    dental: 3,
    dentist: 3,
    medical: 3,
    salon: 3,
    spa: 3,
    barber: 3,
    hair: 3,
    gym: 2,
    fitness: 2,
    studio: 2,
    tutor: 2,
    tuition: 2,
    class: 2,
    lesson: 2,
    restaurant: 2,
    cafe: 1,
    hotel: 2,
    resort: 2,
    massage: 3,
    therapy: 2,
    yoga: 3,
    pilates: 3,
    "pet groom": 3,
    vet: 2,
    "car detail": 2,
    laundry: 1,
    coaching: 3,
    consulting: 2,
    trainer: 3,
    physician: 3,
    chiropractor: 3,
    acupuncture: 3,
    tattoo: 2,
    nail: 3,
    beauty: 3,
    skincare: 3,
    photography: 2,
    event: 2,
    catering: 2,
    "real estate": 2,
    property: 2,
    "car rental": 2,
    coworking: 2,
    childcare: 3,
    preschool: 3,
    enrichment: 3,
    driving: 2,
    music: 2,
    language: 2,
  },
  crm: {
    "real estate": 3,
    property: 2,
    agent: 2,
    broker: 2,
    insurance: 2,
    legal: 2,
    consulting: 2,
    agency: 2,
    finance: 1,
    mortgage: 2,
    b2b: 2,
    saas: 1,
    coaching: 2,
    "personal training": 2,
    recruitment: 3,
    staffing: 3,
    hr: 2,
    accounting: 2,
    "wealth management": 2,
    advisory: 2,
    nonprofit: 2,
    charity: 2,
    "auto dealer": 2,
    travel: 2,
  },
  inventory: {
    retail: 2,
    shop: 2,
    store: 2,
    ecommerce: 3,
    "e-commerce": 3,
    "f&b": 3,
    restaurant: 3,
    cafe: 2,
    bakery: 2,
    grocery: 3,
    supermarket: 3,
    construction: 3,
    trade: 2,
    hardware: 3,
    manufacturing: 3,
    warehouse: 3,
    pharmacy: 2,
    dispensary: 2,
    fashion: 2,
    apparel: 2,
    clothing: 2,
    electronics: 2,
    automotive: 2,
    printing: 2,
    florist: 2,
    "pet shop": 2,
    "book store": 2,
    convenience: 2,
    mini: 2,
    mart: 2,
  },
  payment: {
    ecommerce: 3,
    "e-commerce": 3,
    retail: 2,
    shop: 2,
    store: 2,
    subscription: 3,
    saas: 3,
    "f&b": 2,
    restaurant: 2,
    invoice: 3,
    billing: 3,
    finance: 2,
    accounting: 2,
    freelance: 2,
    consulting: 1,
    legal: 1,
    agency: 1,
  },
  social: {
    marketing: 3,
    agency: 2,
    brand: 3,
    fashion: 3,
    beauty: 3,
    lifestyle: 3,
    influencer: 3,
    content: 3,
    restaurant: 1,
    cafe: 1,
    hotel: 1,
    photography: 2,
    event: 2,
    fitness: 1,
    travel: 2,
    "food truck": 2,
    bakery: 1,
    "pet groom": 1,
    salon: 1,
  },
  complaint: {
    restaurant: 1,
    retail: 1,
    ecommerce: 1,
    "e-commerce": 1,
    service: 1,
    hotel: 1,
    delivery: 1,
    healthcare: 1,
    telecom: 1,
    utility: 1,
  },
  shipping: {
    ecommerce: 3,
    "e-commerce": 3,
    retail: 2,
    store: 2,
    "f&b": 1,
    restaurant: 1,
    logistics: 3,
    warehouse: 2,
    manufacturing: 2,
    "auto parts": 2,
    furniture: 2,
    appliance: 2,
  },
  review: {
    restaurant: 2,
    cafe: 2,
    hotel: 2,
    salon: 2,
    dental: 2,
    clinic: 2,
    "real estate": 1,
    retail: 1,
    service: 1,
    spa: 2,
    gym: 1,
    automotive: 1,
    healthcare: 1,
  },
};

// ─── Semantic intent detection from message content ───────────────
// Detects what the user is ASKING about, not just what keywords match

const INTENT_PATTERNS: Record<
  string,
  { patterns: RegExp[]; weight: number }[]
> = {
  scheduling: [
    { patterns: [/want to (book|schedule|reserve|set up)/i], weight: 4 },
    { patterns: [/need (an? )?appointment/i], weight: 4 },
    { patterns: [/when (is|are|can|could)/i], weight: 2 },
    { patterns: [/available (slot|time|date|schedule)/i], weight: 3 },
    { patterns: [/(change|move|reschedule|cancel) (my|the|our)/i], weight: 3 },
  ],
  crm: [
    { patterns: [/who is (this|that) (customer|client)/i], weight: 4 },
    {
      patterns: [/(customer|client) (history|record|profile|details)/i],
      weight: 4,
    },
    {
      patterns: [/(new|potential|prospective) (customer|client|lead)/i],
      weight: 3,
    },
    { patterns: [/(onboard|welcome|intake) (new|a|the)/i], weight: 3 },
  ],
  inventory: [
    {
      patterns: [
        /(how many|how much|do we have|is there) (left|available|in stock|remaining)/i,
      ],
      weight: 4,
    },
    {
      patterns: [
        /(low|out of|running out of|no more) (stock|supply|inventory)/i,
      ],
      weight: 4,
    },
    {
      patterns: [/(need to|should|time to) (reorder|restock|order more)/i],
      weight: 4,
    },
    {
      patterns: [/check (the |our )?(inventory|stock|supply|warehouse)/i],
      weight: 3,
    },
  ],
  payment: [
    {
      patterns: [/(how much|what('s| is) the) (price|cost|fee|rate)/i],
      weight: 4,
    },
    {
      patterns: [/(need to|want to|please) (pay|invoice|bill|charge)/i],
      weight: 4,
    },
    {
      patterns: [
        /(send|generate|create|issue) (an? )?(invoice|quote|receipt|bill)/i,
      ],
      weight: 4,
    },
    { patterns: [/(refund|credit|discount|waive)/i], weight: 3 },
  ],
  social: [
    {
      patterns: [
        /(post|share|publish|upload) (to|on|a|this) (social|instagram|facebook|tiktok|linkedin)/i,
      ],
      weight: 4,
    },
    {
      patterns: [
        /(respond|reply|answer) to (the|a|this) (review|comment|post)/i,
      ],
      weight: 4,
    },
    {
      patterns: [
        /(social media|marketing|content) (strategy|plan|campaign|schedule)/i,
      ],
      weight: 3,
    },
  ],
  complaint: [
    {
      patterns: [
        /(unhappy|disappointed|frustrated|angry|upset) (about|with|that)/i,
      ],
      weight: 4,
    },
    { patterns: [/(complain|escalate|manager|supervisor)/i], weight: 3 },
    {
      patterns: [/this is (unacceptable|ridiculous|terrible|wrong)/i],
      weight: 4,
    },
  ],
  shipping: [
    {
      patterns: [
        /(where is|track|status of) (my|the|our) (order|package|delivery|shipment)/i,
      ],
      weight: 4,
    },
    {
      patterns: [
        /(when (will|does|is)|has) (my|the|our) (order|package|delivery) (arrive|deliver|ship|dispatch)/i,
      ],
      weight: 4,
    },
    { patterns: [/(return|exchange|send back)/i], weight: 3 },
  ],
  email: [
    {
      patterns: [
        /(send|write|draft|compose) (an? )?(email|message|notification|follow-up)/i,
      ],
      weight: 4,
    },
    {
      patterns: [
        /(confirm|acknowledge|notify|inform) (the|a|our) (customer|client|team)/i,
      ],
      weight: 3,
    },
  ],
  notification: [
    {
      patterns: [
        /(alert|notify|inform|tell|flag) (the|our|my) (team|staff|manager|kitchen)/i,
      ],
      weight: 4,
    },
    { patterns: [/(urgent|emergency|critical|asap|immediately)/i], weight: 3 },
  ],
  review: [
    {
      patterns: [
        /(ask|request|prompt|encourage) (for|to leave|to write) (a|an? )?(review|feedback|rating)/i,
      ],
      weight: 4,
    },
    {
      patterns: [/(google|online|public) (review|rating|reputation)/i],
      weight: 3,
    },
  ],
};

// ─── Scoring engine ───────────────────────────────────────────────

function scoreCategories(
  text: string,
  businessType: string,
): Map<string, number> {
  const lower = text.toLowerCase();
  const scores = new Map<string, number>();

  // Score by message keywords (weighted)
  for (const [category, entries] of Object.entries(KEYWORD_ENTRIES)) {
    let score = 0;
    for (const entry of entries) {
      if (lower.includes(entry.word)) score += entry.weight;
    }
    if (score > 0) scores.set(category, score);
  }

  // Score by business type patterns (weighted)
  const bizLower = businessType.toLowerCase();
  for (const [category, patterns] of Object.entries(BUSINESS_PATTERNS)) {
    for (const [pattern, weight] of Object.entries(patterns)) {
      if (bizLower.includes(pattern)) {
        scores.set(category, (scores.get(category) || 0) + weight);
      }
    }
  }

  // Score by semantic intent patterns (highest signal — what user is asking about)
  for (const [category, intents] of Object.entries(INTENT_PATTERNS)) {
    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        if (pattern.test(text)) {
          scores.set(category, (scores.get(category) || 0) + intent.weight);
        }
      }
    }
  }

  return scores;
}

// ─── Smart fallback by business type ───────────────────────────────
// When keyword/intent matching yields <2 categories, pick based on industry

function getSmartDefaults(businessType: string): string[] {
  const biz = businessType.toLowerCase();
  const defaults: string[] = [];

  // Service-type businesses → scheduling + CRM
  if (
    biz.match(
      /clinic|dental|medical|salon|spa|barber|hair|gym|fitness|studio|tutor|tuition|yoga|pilates|massage|therapy|coaching|consulting|trainer|physician|chiropractor|acupuncture|nail|beauty|skincare|photography|childcare|preschool|driving|music|language|real estate|property|insurance|legal|accounting|recruitment|staffing|advisory|nonprofit|charity/,
    )
  ) {
    defaults.push("scheduling", "crm", "email");
  }
  // Retail/product businesses → inventory + payment
  else if (
    biz.match(
      /retail|shop|store|ecommerce|e-commerce|f&b|restaurant|cafe|bakery|grocery|supermarket|construction|hardware|manufacturing|warehouse|pharmacy|fashion|apparel|clothing|electronics|automotive|printing|florist|pet shop|book store|convenience|mini|mart|dispensary/,
    )
  ) {
    defaults.push("inventory", "payment", "email");
  }
  // Marketing/brand businesses → social + CRM
  else if (
    biz.match(
      /marketing|agency|brand|fashion|beauty|lifestyle|influencer|content|advertising|pr|event/,
    )
  ) {
    defaults.push("social", "crm", "email");
  }
  // Default generic
  else {
    defaults.push("crm", "email", "notification");
  }

  return defaults;
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Generate automated action steps for a custom prompt.
 * Uses keyword scoring + business-type patterns + semantic intent detection.
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

  const scores = scoreCategories(message, businessType);

  // Sort categories by score (descending)
  const sorted = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  // Filter out categories with very low scores (<2 is noise)
  const significant = sorted.filter((cat) => (scores.get(cat) || 0) >= 2);

  // Fallback: if not enough categories matched, use smart defaults
  if (significant.length < 2) {
    const defaults = getSmartDefaults(businessType);
    for (const d of defaults) {
      if (!significant.includes(d)) significant.push(d);
    }
  }

  // Pick 3-4 actions across top categories, prioritizing higher-scored ones
  const actions: ActionStep[] = [];
  const usedLabels = new Set<string>();
  let delay = 800;
  let id = 0;

  const categoriesToUse = significant.length > 0 ? significant : sorted;

  for (const category of categoriesToUse) {
    if (actions.length >= 4) break;
    const pool = TEMPLATES[category];
    if (!pool) continue;

    // Top category gets 2 actions, rest get 1
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

  // Ensure we always return at least 3 actions
  if (actions.length < 3) {
    const fallbackCategories = ["notification", "email", "scheduling", "crm"];
    for (const cat of fallbackCategories) {
      if (actions.length >= 3) break;
      const pool = TEMPLATES[cat];
      if (!pool) continue;
      for (const template of pool) {
        if (actions.length >= 3) break;
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
      }
    }
  }

  return actions;
}
