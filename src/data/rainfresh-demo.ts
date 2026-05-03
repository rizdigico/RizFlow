import type { ActionStep } from "./demo-industries";

export interface RainFreshScenario {
  id: string;
  label: string;
  description: string;
  icon: string;
  userMessage: string;
  systemPrompt: string;
  actions: ActionStep[];
}

// System prompt for RainFresh's home fragrance & lifestyle products context
const RAINFRESH_SYSTEM_PROMPT = `You are a RizFlow AI agent working for RainFreshSG, a Singapore-based brand selling scented air fresheners, hand soaps, essential oils, and custom corporate/wedding gift packages. Orders come through TikTok Shop, suppliers are from Alibaba and other overseas sources. You handle orders, inventory, social media, and customer inquiries automatically. You're professional, efficient, and always reference the specific tools and systems you've connected to (TikTok Shop, Gmail, Google Sheets, Instagram, Slack, Alibaba). Keep responses concise (2-3 sentences max). Use Singapore English where appropriate.`;

export const rainfreshScenarios: RainFreshScenario[] = [
  {
    id: "rf-order",
    label: "New Order",
    description: "Customer orders a gift set on TikTok Shop",
    icon: "🛒",
    userMessage:
      "Hi, I just placed an order on TikTok Shop for 2 Lavender Dream air freshener sets and 1 wedding favour package. Can you confirm my order?",
    systemPrompt: RAINFRESH_SYSTEM_PROMPT,
    actions: [
      {
        id: "rf-o1",
        label: "Confirmed order",
        tool: "TikTok Shop",
        icon: "🛍️",
        detail:
          "Order #RF-4472 synced from TikTok Shop: 2x Lavender Dream Air Freshener Set + 1x Wedding Favour Package, $68.90 total",
        delayMs: 800,
      },
      {
        id: "rf-o2",
        label: "Sent confirmation email",
        tool: "Gmail",
        icon: "✉️",
        detail:
          'Confirmation sent: "Your RainFresh order #RF-4472 is confirmed! Estimated delivery: 3-5 business days via SingPost."',
        delayMs: 1600,
      },
      {
        id: "rf-o3",
        label: "Updated inventory",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          "Stock levels adjusted: Lavender Dream 48→46, Wedding Favour Package 20→19. Low-stock flag raised for Favour Package.",
        delayMs: 2400,
      },
      {
        id: "rf-o4",
        label: "Notified fulfilment team",
        tool: "Slack",
        icon: "💬",
        detail:
          '#orders: "New TikTok order RF-4472 — gift set + wedding favour, pack with care tissue. Repeat customer — include thank-you card."',
        delayMs: 3200,
      },
    ],
  },
  {
    id: "rf-stock",
    label: "Stock Alert",
    description: "Best-selling air freshener running low",
    icon: "📦",
    userMessage:
      "Our Lavender Dream air fresheners are running low again. Can you check stock and handle the reorder from Alibaba?",
    systemPrompt: RAINFRESH_SYSTEM_PROMPT,
    actions: [
      {
        id: "rf-s1",
        label: "Checked current stock levels",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          "Lavender Dream: 14 units remaining (below 20-unit reorder point). Wedding Favour Package: 19 units.",
        delayMs: 800,
      },
      {
        id: "rf-s2",
        label: "Placed Alibaba reorder",
        tool: "Alibaba",
        icon: "🌐",
        detail:
          "Reorder placed on Alibaba: 200 units Lavender Dream air freshener refills, 100 units essential oil. Supplier confirmed 5-7 day lead time.",
        delayMs: 1600,
      },
      {
        id: "rf-s3",
        label: "Updated TikTok Shop listing",
        tool: "TikTok Shop",
        icon: "🛍️",
        detail:
          'Product listing updated: Lavender Dream now shows "Limited Stock — order soon" badge to slow demand until restock arrives.',
        delayMs: 2400,
      },
      {
        id: "rf-s4",
        label: "Notified operations team",
        tool: "Slack",
        icon: "💬",
        detail:
          '#inventory: "Lavender Dream at 14 units — Alibaba reorder placed. Expected restock in 5-7 days. TikTok listing updated with low-stock badge."',
        delayMs: 3200,
      },
    ],
  },
  {
    id: "rf-social",
    label: "Social Post",
    description: "Auto-generate and schedule a product launch post",
    icon: "📱",
    userMessage:
      "Can you create a social media post for our new Sandalwood & Rose hand soap launch? We want it to feel premium and gift-worthy.",
    systemPrompt: RAINFRESH_SYSTEM_PROMPT,
    actions: [
      {
        id: "rf-sm1",
        label: "Generated caption & hashtags",
        tool: "AI Content Engine",
        icon: "✨",
        detail:
          '"Elevate everyday moments 🌹 Sandalwood & Rose Hand Soap — now on RainFresh. Premium botanicals, gift-ready packaging. #RainFreshSG #HomeFragrance #SingaporeMade #GiftIdeas"',
        delayMs: 800,
      },
      {
        id: "rf-sm2",
        label: "Scheduled Instagram post",
        tool: "Instagram",
        icon: "📸",
        detail:
          "Carousel post scheduled for Wednesday 12pm (peak engagement window). 3 slides: product hero, packaging detail, lifestyle shot.",
        delayMs: 1600,
      },
      {
        id: "rf-sm3",
        label: "Scheduled TikTok video",
        tool: "TikTok",
        icon: "🎬",
        detail:
          "Product demo video scheduled for Thursday 7pm. Unboxing + scent reveal format with trending audio. Link to TikTok Shop listing added.",
        delayMs: 2400,
      },
      {
        id: "rf-sm4",
        label: "Logged in content calendar",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          "Content calendar updated: 2 posts scheduled this week. Total weekly count: 7/7 posts planned. Hand soap launch added to product tracker.",
        delayMs: 3200,
      },
    ],
  },
  {
    id: "rf-inquiry",
    label: "Customer Inquiry",
    description: "Customer asking about custom corporate gift packages",
    icon: "🙋",
    userMessage:
      "Hi, I'm interested in ordering 50 custom corporate gift packages for my company's annual dinner. Can I customise the scents and branding?",
    systemPrompt: RAINFRESH_SYSTEM_PROMPT,
    actions: [
      {
        id: "rf-i1",
        label: "Pulled product catalogue",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          "Corporate package options: 3 tiers available (Standard $28, Premium $48, Luxe $78). All support custom scent selection and logo branding.",
        delayMs: 800,
      },
      {
        id: "rf-i2",
        label: "Sent personalised quote email",
        tool: "Gmail",
        icon: "✉️",
        detail:
          'Email sent: "Hi! Great news — we do custom corporate packages. For 50 units, Premium tier at $48/unit with your logo and scent choice. Sample box can be sent this week."',
        delayMs: 1600,
      },
      {
        id: "rf-i3",
        label: "Created CRM entry",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          "New lead: Corporate order inquiry — 50 units, Premium tier, custom branding. Follow-up scheduled for 3 days. Added to #corporate-leads.",
        delayMs: 2400,
      },
      {
        id: "rf-i4",
        label: "Notified sales team",
        tool: "Slack",
        icon: "💬",
        detail:
          '#corporate-leads: "New bulk enquiry — 50 custom packages, annual dinner. Premium tier interest. Quote sent via email. Follow up by Friday."',
        delayMs: 3200,
      },
    ],
  },
];

// RainFresh-specific tool connections — accurate to their actual stack
export const rainfreshTools = [
  { name: "TikTok Shop", icon: "🛍️", desc: "Order management & listing sync" },
  { name: "Gmail", icon: "✉️", desc: "Automated confirmations & quotes" },
  {
    name: "Google Sheets",
    icon: "📊",
    desc: "Inventory, CRM & content calendar",
  },
  { name: "Instagram", icon: "📸", desc: "Scheduled social media posts" },
  { name: "TikTok", icon: "🎬", desc: "Product videos & shop integration" },
  { name: "Alibaba", icon: "🌐", desc: "Supplier reorder & procurement" },
  { name: "Slack", icon: "💬", desc: "Team notifications & coordination" },
];

// RainFresh metrics (from case study — same real results, updated labels)
export const rainfreshMetrics = [
  {
    label: "Processing Time",
    before: "2-3 hrs/day",
    after: "<3 sec",
    change: "-99%",
    changeNum: 99,
    suffix: "%",
    prefix: "-",
  },
  {
    label: "Stockout Incidents",
    before: "3-4/month",
    after: "0",
    change: "-100%",
    changeNum: 100,
    suffix: "%",
    prefix: "-",
  },
  {
    label: "Social Posts/Week",
    before: "0",
    after: "7",
    change: "+7",
    changeNum: 7,
    suffix: "",
    prefix: "+",
  },
  {
    label: "Buyer Emails",
    before: "0%",
    after: "100%",
    change: "+100%",
    changeNum: 100,
    suffix: "%",
    prefix: "+",
  },
  {
    label: "Hours Saved/Week",
    before: "—",
    after: "14+",
    change: "1.75 days",
    changeNum: 0,
    suffix: "",
    prefix: "",
  },
  {
    label: "Order Errors",
    before: "2-3/week",
    after: "<1/month",
    change: "-94%",
    changeNum: 94,
    suffix: "%",
    prefix: "-",
  },
];

// ── Suggested follow-up prompts for RainFresh scenarios ──
export const RAINFOOD_FOLLOWUPS: Record<string, string[]> = {
  "rf-order": [
    "What if the customer wants to add more items?",
    "Can you handle returns and exchanges?",
    "Send them a loyalty discount code",
  ],
  "rf-stock": [
    "What happens when the reorder arrives?",
    "Can you forecast demand for next month?",
    "Set a minimum stock level alert",
  ],
  "rf-social": [
    "Can you create a TikTok version too?",
    "What about engagement captions?",
    "Schedule posts for the whole week",
  ],
  "rf-inquiry": [
    "What if they want a sample box?",
    "Can you offer volume discounts?",
    "Send them the full catalogue",
  ],
};
