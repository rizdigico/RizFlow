import type { ActionStep } from "./demo-industries";

export interface BrewedIdentityScenario {
  id: string;
  label: string;
  description: string;
  icon: string;
  userMessage: string;
  systemPrompt: string;
  actions: ActionStep[];
}

// System prompt for Brewed Identity's POD coffee-themed apparel context
const BREWED_IDENTITY_SYSTEM_PROMPT = `You are a RizFlow AI agent working for Brewed Identity, a Singapore-based print-on-demand Etsy shop selling coffee-themed sports dad/mom T-shirts (Comfort Colors® garment-dyed tees). Products include "Soccer Dad Fueled By Coffee", "Hockey Dad Fueled by Coffee", "Football Mom Coffee", and similar designs combining vintage-style coffee cup graphics with sport icons. You handle Etsy listings, customer messages, order processing, social media, and inventory automatically. You're professional, efficient, and always reference the specific tools connected (Etsy, Printify, Gmail, Google Sheets, Instagram, Pinterest). Keep responses concise (2-3 sentences max). Use casual, friendly tone appropriate for a lifestyle apparel brand.`;

export const brewedIdentityScenarios: BrewedIdentityScenario[] = [
  {
    id: "bi-order",
    label: "New Order",
    description: "Customer orders a custom Dad tee on Etsy",
    icon: "🛒",
    userMessage:
      "Hey! I just ordered the Soccer Dad Fueled By Coffee tee in size L. Can I get it in navy blue instead of the default?",
    systemPrompt: BREWED_IDENTITY_SYSTEM_PROMPT,
    actions: [
      {
        id: "bi-o1",
        label: "Confirmed order details",
        tool: "Etsy",
        icon: "🛍️",
        detail:
          "Order #BI-1128 synced: 1x Soccer Dad Fueled By Coffee Tee, Size L, Navy Blue. Customer note: colour change requested.",
        delayMs: 800,
      },
      {
        id: "bi-o2",
        label: "Sent confirmation email",
        tool: "Gmail",
        icon: "✉️",
        detail:
          'Confirmation sent: "Your Brewed Identity order #BI-1128 is confirmed! Navy Blue — great choice. We\'ll update you when it ships via USPS."',
        delayMs: 1600,
      },
      {
        id: "bi-o3",
        label: "Routed to Printify",
        tool: "Printify",
        icon: "🖨️",
        detail:
          "Print-on-demand order sent to Printify: Soccer Dad design, Comfort Colors® L, Navy. Production estimated 3-5 business days.",
        delayMs: 2400,
      },
      {
        id: "bi-o4",
        label: "Updated tracking sheet",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          "Order tracker updated: BI-1128 → Printify production queue. Customer preference (Navy) flagged for quality check before dispatch.",
        delayMs: 3200,
      },
    ],
  },
  {
    id: "bi-listing",
    label: "New Listing",
    description: "Auto-generate and publish a new design listing",
    icon: "🏷️",
    userMessage:
      "Can you create a new listing for a 'Golf Dad Fueled By Coffee' tee? Make sure the SEO is solid and it goes live with a launch discount.",
    systemPrompt: BREWED_IDENTITY_SYSTEM_PROMPT,
    actions: [
      {
        id: "bi-l1",
        label: "Generated listing content",
        tool: "AI Content Engine",
        icon: "✨",
        detail:
          '"Golf Dad Fueled By Coffee T-Shirt | Vintage Golf Dad Tee — Perfect gift for the golf-loving dad who runs on coffee. Comfort Colors® garment-dyed tee with vintage coffee cup + golf ball graphic. Available in 8 colours, sizes S-3XL." — 13 SEO keywords, long-tail tags generated.',
        delayMs: 800,
      },
      {
        id: "bi-l2",
        label: "Published on Etsy",
        tool: "Etsy",
        icon: "🛍️",
        detail:
          'Listing published: "Golf Dad Fueled By Coffee T-Shirt | Vintage Golf Dad Tee" — $24.99 USD, 20% launch discount auto-applied (was $31.24). Category: Men\'s Clothing > T-Shirts. 13 tags, free shipping badge enabled.',
        delayMs: 1600,
      },
      {
        id: "bi-l3",
        label: "Created Printify product",
        tool: "Printify",
        icon: "🖨️",
        detail:
          "Printify product created: Golf Dad Fueled By Coffee design mapped to Comfort Colors® 1716 tee. 8 colour variants, S-3XL. Print area verified, mockups generated.",
        delayMs: 2400,
      },
      {
        id: "bi-l4",
        label: "Scheduled social launch",
        tool: "Instagram",
        icon: "📸",
        detail:
          "Launch post scheduled for tomorrow 11am EST: carousel with product mockup, close-up design detail, and lifestyle shot. Pinterest pin also queued for search visibility.",
        delayMs: 3200,
      },
    ],
  },
  {
    id: "bi-social",
    label: "Social Campaign",
    description: "Run a Father's Day marketing campaign across platforms",
    icon: "📱",
    userMessage:
      "Father's Day is coming up. Can you set up a marketing campaign across our social platforms? We need gift guide posts and a promo code.",
    systemPrompt: BREWED_IDENTITY_SYSTEM_PROMPT,
    actions: [
      {
        id: "bi-s1",
        label: "Created promo code",
        tool: "Etsy",
        icon: "🛍️",
        detail:
          'Etsy coupon created: "DADSDAY25" — 25% off all Dad tees, valid June 1-15. Auto-applied to listings in the "Dad Collection" category.',
        delayMs: 800,
      },
      {
        id: "bi-s2",
        label: "Generated content calendar",
        tool: "AI Content Engine",
        icon: "✨",
        detail:
          "Father's Day content calendar: 12 posts across 14 days — 6 Instagram (3 carousels, 2 reels, 1 story highlight), 4 Pinterest pins (gift guide boards), 2 Etsy updates (sale banner + listing refresh). All with #CoffeeDad #FueledByCoffee #FathersDayGift hashtags.",
        delayMs: 1600,
      },
      {
        id: "bi-s3",
        label: "Scheduled Instagram posts",
        tool: "Instagram",
        icon: "📸",
        detail:
          '6 posts scheduled: "The Golf Dad Who Runs on Coffee" carousel (Mon), "5 Tees Every Coffee Dad Needs" gift guide (Wed), behind-the-scenes print process reel (Fri), plus 3 more across the campaign window.',
        delayMs: 2400,
      },
      {
        id: "bi-s4",
        label: "Launched Pinterest campaign",
        tool: "Pinterest",
        icon: "📌",
        detail:
          '4 Pinterest pins published to "Father\'s Day Gift Ideas" and "Coffee Lover Gifts" boards. Rich pins enabled, targeting dads 35-55, US market. "DADSDAY25" promo code in pin descriptions.',
        delayMs: 3200,
      },
    ],
  },
  {
    id: "bi-inquiry",
    label: "Customer Inquiry",
    description: "Customer asking about sizing and customisation",
    icon: "🙋",
    userMessage:
      "Hi! I want to order the Hockey Dad tee for my husband but I'm not sure about sizing. He's usually a Large in Nike — will the Comfort Colors L fit the same? Also can you add his name on the back?",
    systemPrompt: BREWED_IDENTITY_SYSTEM_PROMPT,
    actions: [
      {
        id: "bi-i1",
        label: "Checked sizing data",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          'Comfort Colors® sizing reference: L fits chest 42-44", length 29". Compared to Nike L (chest 42-44", length 29") — true-to-size fit. Recommendation: order Large.',
        delayMs: 800,
      },
      {
        id: "bi-i2",
        label: "Sent personalised response",
        tool: "Gmail",
        icon: "✉️",
        detail:
          'Email sent: "Great choice! The Comfort Colors® Large fits true to size — same as Nike L, so you\'re good to go. For custom name on the back, we can add that for +$5. Want me to set up a custom listing for you?"',
        delayMs: 1600,
      },
      {
        id: "bi-i3",
        label: "Created custom listing",
        tool: "Etsy",
        icon: "🛍️",
        detail:
          'Custom listing created: "Hockey Dad Fueled By Coffee T-Shirt — Personalised Name on Back" — $29.99 ($24.99 + $5 personalisation). Customer-specific, 7-day expiry. Variation: Navy, Size L, Name: [pending].',
        delayMs: 2400,
      },
      {
        id: "bi-i4",
        label: "Logged customer interaction",
        tool: "Google Sheets",
        icon: "📊",
        detail:
          'CRM updated: New lead — size inquiry + personalisation request. Tagged "high-intent" (specific product, sizing, custom request). Follow-up scheduled for 48 hours if no purchase.',
        delayMs: 3200,
      },
    ],
  },
];

// Brewed Identity-specific tool connections
export const brewedIdentityTools = [
  { name: "Etsy", icon: "🛍️", desc: "Listings, orders & customer messages" },
  {
    name: "Printify",
    icon: "🖨️",
    desc: "Print-on-demand production & fulfilment",
  },
  { name: "Gmail", icon: "✉️", desc: "Order confirmations & customer support" },
  {
    name: "Google Sheets",
    icon: "📊",
    desc: "Inventory, CRM & content calendar",
  },
  {
    name: "Instagram",
    icon: "📸",
    desc: "Scheduled posts & gift guide campaigns",
  },
  { name: "Pinterest", icon: "📌", desc: "Pin campaigns & search visibility" },
  {
    name: "AI Content Engine",
    icon: "✨",
    desc: "SEO descriptions, tags & captions",
  },
];

// Brewed Identity metrics
export const brewedIdentityMetrics = [
  {
    label: "Listing Time",
    before: "45 min/listing",
    after: "<3 min/listing",
    change: "-93%",
    changeNum: 93,
    suffix: "%",
    prefix: "-",
  },
  {
    label: "Customer Response",
    before: "2-4 hrs",
    after: "<30 sec",
    change: "-99%",
    changeNum: 99,
    suffix: "%",
    prefix: "-",
  },
  {
    label: "Social Posts/Week",
    before: "0",
    after: "5",
    change: "+5",
    changeNum: 5,
    suffix: "",
    prefix: "+",
  },
  {
    label: "SEO Optimised Listings",
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
    after: "10+",
    change: "1.25 days",
    changeNum: 0,
    suffix: "",
    prefix: "",
  },
  {
    label: "Missed Messages",
    before: "8-10/week",
    after: "0",
    change: "-100%",
    changeNum: 100,
    suffix: "%",
    prefix: "-",
  },
];

// Suggested follow-up prompts for Brewed Identity scenarios
export const BREWED_IDENTITY_FOLLOWUPS: Record<string, string[]> = {
  "bi-order": [
    "What if they want a different colour at checkout?",
    "Can you handle returns and exchanges?",
    "Send them a repeat customer discount code",
  ],
  "bi-listing": [
    "Can you create a Mom version too?",
    "What about seasonal designs like Christmas?",
    "Optimise the listing for Google Shopping",
  ],
  "bi-social": [
    "Can you create TikTok content too?",
    "Schedule a giveaway post for engagement",
    "Create an email campaign for the sale",
  ],
  "bi-inquiry": [
    "What about bulk orders for team events?",
    "Add customisation options to the listing",
    "Send them a sizing chart infographic",
  ],
};
