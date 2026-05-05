import type { ActionStep } from "@/data/demo-industries";

// ─── AI Response Action Extraction ──────────────────────────────────
// Instead of keyword-matching templates, we parse the AI's response
// to extract the actions it mentions. The system prompt tells the AI
// to explicitly state actions, so we can parse them out.

interface ExtractedAction {
  label: string;
  tool: string;
  detail: string;
}

// Parse bracket-wrapped actions from AI response:
// [ACTION: Checked availability via Google Calendar]
// or [ACTION: Sent confirmation email — Customer booking confirmed]
const ACTION_PATTERN = /\[ACTION:\s*(.+?)\]/gi;

// Fallback: parse "I've X" or "I X" sentences that describe actions
const ACTION_SENTENCE_PATTERNS = [
  /(?:I've|I have|I've just|I just) ([^.]+)/gi,
  /(?:A|An) (?:confirmation|notification|reminder|update|alert|report|invoice|quote|follow-up|message) (?:has been|is) ([^.]+)/gi,
];

// Map common action verbs to tool names
const ACTION_TOOL_MAP: Record<string, string> = {
  // Communication
  email: "Email",
  mail: "Email",
  sent: "Email",
  notification: "Email",
  whatsapp: "WhatsApp Business",
  sms: "Twilio",
  message: "Email",
  // Calendar/Scheduling
  calendar: "Google Calendar",
  appointment: "Google Calendar",
  booking: "Booking System",
  schedule: "Google Calendar",
  reservation: "Reservation System",
  // CRM
  crm: "CRM",
  lead: "CRM",
  profile: "CRM",
  customer: "CRM",
  client: "CRM",
  // Inventory
  inventory: "Inventory System",
  stock: "Inventory System",
  reorder: "Procurement",
  // Finance
  payment: "Payment Gateway",
  invoice: "Xero",
  refund: "Payment Gateway",
  quote: "Xero",
  // Social
  review: "Google Business",
  social: "Social Media",
  post: "Social Media",
  // Project
  task: "Asana",
  project: "Asana",
  board: "Asana",
  // Collaboration
  slack: "Slack",
  team: "Slack",
  flag: "Slack",
  // Documents
  report: "Google Docs",
  document: "Google Docs",
  brief: "Notion",
  // Other
  tracking: "Shipping API",
  shipment: "Shipping API",
  catalog: "Inventory System",
  automation: "Zapier",
  workflow: "Zapier",
};

function inferTool(actionText: string): string {
  const lower = actionText.toLowerCase();
  // Check each keyword, return first match
  for (const [keyword, tool] of Object.entries(ACTION_TOOL_MAP)) {
    if (lower.includes(keyword)) return tool;
  }
  return "Workflow";
}

const ACTION_ICONS: Record<string, string> = {
  Calendar: "📅",
  Booking: "📅",
  Reservation: "📅",
  Email: "📧",
  WhatsApp: "💬",
  Twilio: "📱",
  CRM: "👥",
  Inventory: "📦",
  Procurement: "📦",
  Payment: "💳",
  Xero: "🧾",
  "Google Business": "⭐",
  "Social Media": "📱",
  Asana: "📋",
  Notion: "🗂️",
  Slack: "🔔",
  "Google Docs": "📄",
  "Shipping API": "🚚",
  Zapier: "⚡",
  Workflow: "⚡",
};

function inferIcon(tool: string): string {
  for (const [key, icon] of Object.entries(ACTION_ICONS)) {
    if (tool.includes(key)) return icon;
  }
  return "⚡";
}

/**
 * Extract actions from AI response text.
 * First tries to parse [ACTION: ...] markers (structured format).
 * Falls back to sentence-level extraction.
 */
function extractActionsFromResponse(responseText: string): ExtractedAction[] {
  const actions: ExtractedAction[] = [];

  // Try structured [ACTION: ...] format first
  const structuredMatches = [...responseText.matchAll(ACTION_PATTERN)];
  if (structuredMatches.length > 0) {
    for (const match of structuredMatches) {
      const raw = match[1].trim();
      // Try to split on "—" or " - " for label + detail
      const parts = raw.split(/[—–]\s*|-{2}\s*/);
      const label = parts[0].trim();
      const detail =
        parts.length >= 2 ? parts.slice(1).join(" — ").trim() : raw;

      // Reject placeholder text (model referencing the template format itself)
      if (label === "Label" || detail === "Detail" || label.length < 3)
        continue;

      if (parts.length >= 2) {
        actions.push({
          label,
          tool: inferTool(raw),
          detail,
        });
      } else {
        // No detail separator — use whole thing as label, generate detail
        const shortLabel = raw.length > 50 ? raw.slice(0, 50) + "..." : raw;
        actions.push({
          label: shortLabel,
          tool: inferTool(raw),
          detail: raw,
        });
      }
    }
    // Only return if we got valid (non-placeholder) actions
    if (actions.length > 0) return actions;
  }

  // Fallback: extract "I've X" sentences
  for (const pattern of ACTION_SENTENCE_PATTERNS) {
    pattern.lastIndex = 0; // reset regex state
    const matches = [...responseText.matchAll(pattern)];
    for (const match of matches) {
      const text = match[1]?.trim();
      if (!text || text.length < 10) continue;

      // Keep it concise — truncate if too long
      const label = text.length > 45 ? text.slice(0, 45) + "..." : text;
      actions.push({
        label,
        tool: inferTool(text),
        detail: text,
      });
    }
  }

  return actions;
}

// ─── Industry-specific template fallbacks ─────────────────────────────
// When AI extraction yields nothing (API error, empty response),
// use industry-specific templates instead of generic name interpolation.

interface IndustryTemplate {
  scenarios: Record<string, ActionStep[]>;
  defaultActions: ActionStep[];
  metrics: { label: string; value: string; icon: string }[];
}

const INDUSTRY_TEMPLATES: Record<string, IndustryTemplate> = {
  // F&B / Restaurant
  "fnb|restaurant|cafe|bakery|food|bar|catering|kitchen|bistro|bakehouse|eatery|diner":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Updated reservation",
            tool: "Reservation System",
            icon: "📅",
            detail: "Party size and time updated, confirmation sent via SMS",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Sent confirmation SMS",
            tool: "Twilio",
            icon: "📱",
            detail:
              "Booking confirmation with date, time, and party size sent to customer",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Flagged kitchen team",
            tool: "Slack",
            icon: "🔔",
            detail:
              "Kitchen notified of special requirements and updated prep quantities",
            delayMs: 2400,
          },
          {
            id: "t-4",
            label: "Logged customer preference",
            tool: "CRM",
            icon: "📝",
            detail:
              "Customer preference noted for future visits and personalized service",
            delayMs: 3200,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Confirmed reservation",
          tool: "Reservation System",
          icon: "📅",
          detail: "Booking details confirmed and customer notified via SMS",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent confirmation",
          tool: "Twilio",
          icon: "📱",
          detail: "Reservation confirmation with date, time, and party details",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Notified kitchen",
          tool: "Slack",
          icon: "🔔",
          detail: "Kitchen team alerted for upcoming service requirements",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Reservations handled", value: "847/mo", icon: "📅" },
        { label: "Avg response time", value: "23s", icon: "⚡" },
        { label: "Stock alerts caught", value: "23", icon: "📦" },
        { label: "Hours saved/week", value: "14+", icon: "🕐" },
      ],
    },
  // Real Estate
  "real estate|property|agent|broker|listing|condo|hdb|mortgage|realtor": {
    scenarios: {
      default: [
        {
          id: "t-1",
          label: "Created lead profile",
          tool: "HubSpot",
          icon: "👥",
          detail:
            "New lead added with budget, preferences, and timeline requirements",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Scheduled viewing",
          tool: "Google Calendar",
          icon: "📅",
          detail:
            "Property viewing booked, calendar invite sent to all parties",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Sent property pack",
          tool: "Email",
          icon: "📧",
          detail: "Property factsheet with floor plan and comparables emailed",
          delayMs: 2400,
        },
      ],
    },
    defaultActions: [
      {
        id: "t-1",
        label: "Added lead to CRM",
        tool: "HubSpot",
        icon: "👥",
        detail: "Lead profile created with requirements and budget tagged",
        delayMs: 800,
      },
      {
        id: "t-2",
        label: "Sent property details",
        tool: "Email",
        icon: "📧",
        detail: "Matching listings with photos and pricing sent to prospect",
        delayMs: 1600,
      },
      {
        id: "t-3",
        label: "Set follow-up sequence",
        tool: "CRM",
        icon: "🔄",
        detail: "Automated 24hr check-in + 7-day re-engagement scheduled",
        delayMs: 2400,
      },
    ],
    metrics: [
      { label: "Leads qualified", value: "312/mo", icon: "🎯" },
      { label: "Viewings scheduled", value: "89/mo", icon: "🏠" },
      { label: "Follow-ups sent", value: "456/mo", icon: "📧" },
      { label: "Hours saved/week", value: "18+", icon: "⚡" },
    ],
  },
  // E-Commerce
  "ecommerce|e-commerce|shop|store|retail|online shop|dropship|fashion|clothing|apparel":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Checked order status",
            tool: "Shopify",
            icon: "🔍",
            detail:
              "Order found and current status retrieved from fulfillment system",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Sent tracking update",
            tool: "Email",
            icon: "📧",
            detail:
              "Customer notified with tracking link and updated delivery estimate",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Applied courtesy credit",
            tool: "Stripe",
            icon: "💳",
            detail: "Store credit applied to account as goodwill gesture",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Pulled order details",
          tool: "Shopify",
          icon: "🔍",
          detail: "Order information retrieved from store system",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent customer update",
          tool: "Email",
          icon: "📧",
          detail: "Order status and next steps communicated to customer",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Updated inventory",
          tool: "Inventory System",
          icon: "📦",
          detail: "Stock levels adjusted based on current order",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Orders processed", value: "1,247/mo", icon: "📦" },
        { label: "Carts recovered", value: "23%", icon: "🛒" },
        { label: "Avg response time", value: "18s", icon: "⚡" },
        { label: "Hours saved/week", value: "22+", icon: "🕐" },
      ],
    },
  // Professional Services
  "professional|consulting|legal|law|accounting|accountant|agency|advisory|freelance|b2b|saas":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Created client profile",
            tool: "HubSpot",
            icon: "👥",
            detail: "New client intake completed with requirements and budget",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Scheduled discovery call",
            tool: "Google Calendar",
            icon: "📅",
            detail: "Consultation booked with calendar invite and agenda sent",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Sent intake form",
            tool: "Typeform",
            icon: "📋",
            detail:
              "Automated intake questionnaire sent for detailed requirements",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Logged client details",
          tool: "CRM",
          icon: "👥",
          detail: "Client information and requirements captured in system",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent follow-up email",
          tool: "Email",
          icon: "📧",
          detail: "Professional follow-up with next steps and timeline sent",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Set reminder",
          tool: "Google Calendar",
          icon: "📅",
          detail: "Follow-up reminder scheduled for 48 hours",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Clients onboarded", value: "34/mo", icon: "🤝" },
        { label: "Proposals drafted", value: "67/mo", icon: "📋" },
        { label: "Invoices followed up", value: "189/mo", icon: "💰" },
        { label: "Hours saved/week", value: "16+", icon: "⚡" },
      ],
    },
  // Construction / Trade
  "construction|trade|builder|renovation|contractor|plumbing|electric|carpenter|hdb|renovation|plaster|painting|tiling":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Generated quote",
            tool: "Xero",
            icon: "📋",
            detail: "Itemized quote created with cost breakdown and timeline",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Scheduled site visit",
            tool: "Google Calendar",
            icon: "📅",
            detail: "On-site measurement visit booked with project team",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Sent quote PDF",
            tool: "Email",
            icon: "📧",
            detail:
              "Formal quote document emailed with terms and validity period",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Created project entry",
          tool: "Asana",
          icon: "🗂️",
          detail: "Project pipeline entry created with scope and timeline",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent follow-up",
          tool: "Email",
          icon: "📧",
          detail: "Professional follow-up with quote and next steps sent",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Notified team",
          tool: "Slack",
          icon: "🔔",
          detail:
            "Project team alerted about new inquiry and potential timeline",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Quotes generated", value: "156/mo", icon: "📋" },
        { label: "Projects tracked", value: "23", icon: "🏗️" },
        { label: "Delays caught early", value: "89%", icon: "⚡" },
        { label: "Hours saved/week", value: "12+", icon: "🕐" },
      ],
    },
  // Salon & Beauty
  "salon|beauty|hair|nail|spa|barber|skincare|massage|wellness|grooming|stylist|cosmetic":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Checked availability",
            tool: "Booking System",
            icon: "📅",
            detail: "Stylist availability found for requested service and time",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Booked appointment",
            tool: "Booking System",
            icon: "📅",
            detail:
              "Appointment confirmed with stylist, service details, and SMS notification sent",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Sent prep instructions",
            tool: "WhatsApp Business",
            icon: "💬",
            detail:
              "Pre-appointment tips and preparation details sent to client",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Confirmed booking",
          tool: "Booking System",
          icon: "📅",
          detail: "Appointment details confirmed and client notified",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent reminder",
          tool: "WhatsApp Business",
          icon: "💬",
          detail: "24-hour appointment reminder queued with preparation tips",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Updated client profile",
          tool: "CRM",
          icon: "👥",
          detail:
            "Service preferences and history noted for personalized future visits",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Appointments/mo", value: "420", icon: "📅" },
        { label: "No-show reduction", value: "73%", icon: "📉" },
        { label: "Rebooking rate", value: "68%", icon: "🔄" },
        { label: "Hours saved/week", value: "11+", icon: "⚡" },
      ],
    },
  // Dental / Medical / Healthcare
  "dental|dentist|clinic|medical|doctor|physician|chiropractor|therapy|pharmacy|healthcare|hospital|physio|optometrist|vet|veterinary":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Checked appointment slots",
            tool: "Google Calendar",
            icon: "📅",
            detail: "Available time slots found for the requested service",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Booked patient appointment",
            tool: "Booking System",
            icon: "📅",
            detail:
              "Appointment confirmed with practitioner, SMS confirmation sent",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Sent pre-visit instructions",
            tool: "WhatsApp Business",
            icon: "💬",
            detail:
              "Pre-appointment guidelines and preparation details sent to patient",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Confirmed appointment",
          tool: "Booking System",
          icon: "📅",
          detail:
            "Patient appointment details confirmed with practitioner assignment",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent confirmation SMS",
          tool: "Twilio",
          icon: "📱",
          detail:
            "Appointment reminder with date, time, and preparation notes sent",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Updated patient record",
          tool: "CRM",
          icon: "📋",
          detail:
            "Patient history and preferences noted for continuity of care",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Appointments/mo", value: "560", icon: "📅" },
        { label: "No-show reduction", value: "81%", icon: "📉" },
        { label: "Patient follow-ups", value: "340/mo", icon: "📧" },
        { label: "Hours saved/week", value: "15+", icon: "⚡" },
      ],
    },
  // Fitness / Gym / Coaching
  "gym|fitness|coaching|trainer|yoga|pilates|crossfit|personal training|martial arts|boxing|dance studio":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Checked class availability",
            tool: "Booking System",
            icon: "📅",
            detail: "Available slots found for requested class type and time",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Booked session",
            tool: "Booking System",
            icon: "📅",
            detail:
              "Session confirmed with instructor, confirmation sent via app and SMS",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Sent welcome pack",
            tool: "Email",
            icon: "📧",
            detail:
              "New member info pack with schedule, guidelines, and first-visit tips sent",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Confirmed booking",
          tool: "Booking System",
          icon: "📅",
          detail: "Session details confirmed and member notified",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent reminder",
          tool: "WhatsApp Business",
          icon: "💬",
          detail: "24-hour session reminder with check-in instructions sent",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Updated member profile",
          tool: "CRM",
          icon: "👥",
          detail:
            "Fitness goals and preferences logged for personalized service",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Bookings/mo", value: "380", icon: "📅" },
        { label: "No-show reduction", value: "65%", icon: "📉" },
        { label: "Member retention", value: "+23%", icon: "🔄" },
        { label: "Hours saved/week", value: "10+", icon: "⚡" },
      ],
    },
  // Education / Tutoring
  "tutor|tuition|education|school|training|course|academy|learning|enrichment|preschool|childcare|music|language|driving":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Checked class schedule",
            tool: "Google Calendar",
            icon: "📅",
            detail:
              "Available time slots found for the requested subject and level",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Enrolled student",
            tool: "CRM",
            icon: "📋",
            detail:
              "Student enrollment confirmed with class assignment and welcome email sent",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Sent class materials",
            tool: "Email",
            icon: "📧",
            detail: "Pre-class materials and syllabus overview sent to student",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Confirmed enrollment",
          tool: "CRM",
          icon: "📋",
          detail: "Student details and class assignment confirmed in system",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Sent confirmation",
          tool: "Email",
          icon: "📧",
          detail:
            "Enrollment confirmation with schedule, location, and materials list sent",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Set attendance reminder",
          tool: "Google Calendar",
          icon: "📅",
          detail: "Class reminders scheduled for student and instructor",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Enrollments/mo", value: "120", icon: "📋" },
        { label: "Attendance rate", value: "94%", icon: "📅" },
        { label: "Parent follow-ups", value: "280/mo", icon: "📧" },
        { label: "Hours saved/week", value: "8+", icon: "⚡" },
      ],
    },
  // Landscaping / Gardening
  "landscaping|garden|lawn|tree service|irrigation|horticulture|landscape|nursery":
    {
      scenarios: {
        default: [
          {
            id: "t-1",
            label: "Created service quote",
            tool: "Xero",
            icon: "📋",
            detail:
              "Detailed quote with scope, materials, and timeline generated",
            delayMs: 800,
          },
          {
            id: "t-2",
            label: "Scheduled site visit",
            tool: "Google Calendar",
            icon: "📅",
            detail: "On-site assessment booked with crew assignment",
            delayMs: 1600,
          },
          {
            id: "t-3",
            label: "Sent quote email",
            tool: "Email",
            icon: "📧",
            detail:
              "Professional quote with terms, photos, and validity period sent",
            delayMs: 2400,
          },
        ],
      },
      defaultActions: [
        {
          id: "t-1",
          label: "Logged service request",
          tool: "CRM",
          icon: "📋",
          detail: "Client requirements and property details captured",
          delayMs: 800,
        },
        {
          id: "t-2",
          label: "Scheduled assessment",
          tool: "Google Calendar",
          icon: "📅",
          detail: "On-site visit booked with team assignment",
          delayMs: 1600,
        },
        {
          id: "t-3",
          label: "Sent follow-up",
          tool: "Email",
          icon: "📧",
          detail: "Service overview and next steps communicated to client",
          delayMs: 2400,
        },
      ],
      metrics: [
        { label: "Quotes/mo", value: "85", icon: "📋" },
        { label: "Jobs scheduled", value: "42/mo", icon: "📅" },
        { label: "Client retention", value: "78%", icon: "🔄" },
        { label: "Hours saved/week", value: "9+", icon: "⚡" },
      ],
    },
};

// Match a business type string to the best template
function findIndustryTemplate(businessType: string): IndustryTemplate | null {
  const lower = businessType.toLowerCase();
  for (const [keyPattern, template] of Object.entries(INDUSTRY_TEMPLATES)) {
    const patterns = keyPattern.split("|");
    if (patterns.some((p) => lower.includes(p.trim()))) {
      return template;
    }
  }
  return null;
}

// ─── Smart defaults by business category ────────────────────────────

function getSmartDefaults(businessType: string): string[] {
  const biz = businessType.toLowerCase();

  if (
    biz.match(
      /clinic|dental|medical|salon|spa|barber|hair|gym|fitness|studio|tutor|tuition|yoga|pilates|massage|therapy|coaching|consulting|trainer|physician|chiropractor|acupuncture|nail|beauty|skincare|photography|childcare|preschool|driving|music|language/,
    )
  ) {
    return ["scheduling", "crm", "email"];
  }
  if (
    biz.match(
      /retail|shop|store|ecommerce|e-commerce|f&b|restaurant|cafe|bakery|grocery|supermarket|construction|hardware|manufacturing|warehouse|pharmacy|fashion|apparel|clothing|electronics|automotive|printing|florist|pet shop|book store|convenience|mini|mart|dispensary/,
    )
  ) {
    return ["inventory", "payment", "email"];
  }
  if (
    biz.match(
      /marketing|agency|brand|lifestyle|influencer|content|advertising|pr|event/,
    )
  ) {
    return ["social", "crm", "email"];
  }
  if (
    biz.match(
      /real estate|property|insurance|legal|mortgage|recruitment|staffing|accounting|wealth|advisory/,
    )
  ) {
    return ["crm", "scheduling", "email"];
  }

  return ["crm", "email", "notification"];
}

// ─── Context-aware template actions (fallback when AI extraction fails) ──

function getTemplateActions(
  businessType: string,
  message: string,
): ActionStep[] {
  const template = findIndustryTemplate(businessType);
  if (template) {
    // Use industry-specific default actions (which are already context-aware)
    return [...template.defaultActions];
  }

  // Generic fallback: use keyword scoring with better detail text
  const ctx: ActionContext = {
    businessType: businessType.toLowerCase(),
    messageSnippet: message.slice(0, 60),
  };

  const defaults = getSmartDefaults(businessType);
  const actions: ActionStep[] = [];
  let delay = 800;

  for (const category of defaults) {
    if (actions.length >= 3) break;
    const pool = TEMPLATES[category];
    if (!pool) continue;

    // Pick a context-relevant action from the pool
    const action = pool[0]; // First action in each pool is most representative
    actions.push({
      id: `fb-${actions.length + 1}`,
      label: action.label,
      tool: action.tool,
      icon: action.icon,
      detail: action.detailFn(ctx),
      delayMs: delay,
    });
    delay += 800;
  }

  return actions.length >= 3 ? actions : actions;
}

// ─── Context type for detail functions ──────────────────────────────

interface ActionContext {
  businessType: string;
  messageSnippet: string;
}

interface ActionTemplate {
  label: string;
  tool: string;
  icon: string;
  detailFn: (ctx: ActionContext) => string;
}

// Minimal template pools (only used as last resort for completely unknown industries)
const TEMPLATES: Record<string, ActionTemplate[]> = {
  scheduling: [
    {
      label: "Checked availability",
      tool: "Google Calendar",
      icon: "📅",
      detailFn: (c: ActionContext) =>
        `Scanned calendar for open slots matching your request`,
    },
    {
      label: "Booked appointment",
      tool: "Calendar API",
      icon: "📅",
      detailFn: (c: ActionContext) =>
        `Appointment confirmed with notification sent`,
    },
    {
      label: "Sent reminder",
      tool: "Email",
      icon: "📧",
      detailFn: (c: ActionContext) =>
        `Automated reminder queued for the upcoming appointment`,
    },
  ],
  crm: [
    {
      label: "Updated customer record",
      tool: "CRM",
      icon: "👤",
      detailFn: (c: ActionContext) =>
        `Customer details and interaction history updated`,
    },
    {
      label: "Created lead",
      tool: "CRM",
      icon: "🎯",
      detailFn: (c: ActionContext) =>
        `New lead added to pipeline with source tagging`,
    },
    {
      label: "Set follow-up",
      tool: "CRM",
      icon: "🔄",
      detailFn: (c: ActionContext) =>
        `Automated follow-up sequence: 24hr check-in + 7-day re-engagement`,
    },
  ],
  email: [
    {
      label: "Sent confirmation email",
      tool: "Email",
      icon: "📧",
      detailFn: (c: ActionContext) => `Confirmation email with details sent`,
    },
    {
      label: "Sent WhatsApp message",
      tool: "WhatsApp Business",
      icon: "💬",
      detailFn: (c: ActionContext) =>
        `Quick update sent via WhatsApp for faster response`,
    },
    {
      label: "Sent SMS notification",
      tool: "Twilio",
      icon: "📱",
      detailFn: (c: ActionContext) => `SMS confirmation sent`,
    },
  ],
  inventory: [
    {
      label: "Checked stock levels",
      tool: "Inventory System",
      icon: "📦",
      detailFn: (c: ActionContext) =>
        `Current inventory checked for availability`,
    },
    {
      label: "Created reorder",
      tool: "Procurement",
      icon: "📦",
      detailFn: (c: ActionContext) =>
        `Purchase order generated for low-stock items`,
    },
  ],
  payment: [
    {
      label: "Processed payment",
      tool: "Payment Gateway",
      icon: "💳",
      detailFn: (c: ActionContext) => `Payment initiated and confirmed`,
    },
    {
      label: "Generated invoice",
      tool: "Xero",
      icon: "🧾",
      detailFn: (c: ActionContext) => `Invoice created and sent`,
    },
  ],
  notification: [
    {
      label: "Sent team alert",
      tool: "Slack",
      icon: "🔔",
      detailFn: (c: ActionContext) =>
        `Team notified about update requiring attention`,
    },
    {
      label: "Logged in system",
      tool: "Database",
      icon: "📝",
      detailFn: (c: ActionContext) =>
        `Event logged for audit trail and reporting`,
    },
    {
      label: "Triggered automation",
      tool: "Zapier",
      icon: "⚡",
      detailFn: (c: ActionContext) =>
        `Workflow triggered for process automation`,
    },
  ],
};

// ─── Public API ────────────────────────────────────────────────────

/**
 * Generate automated action steps.
 *
 * PRIMARY: Parse actions from the AI model's response (most context-aware).
 * FALLBACK: Use industry-specific templates (better than generic name interpolation).
 * LAST RESORT: Use keyword-scored templates with generic detail text.
 */
export function generateActions(
  businessType: string,
  message: string,
  aiResponse?: string,
): ActionStep[] {
  // ── Strategy 1: Extract actions from AI response ────────────────
  if (aiResponse && aiResponse.length > 20) {
    const extracted = extractActionsFromResponse(aiResponse);
    if (extracted.length >= 2) {
      // Convert extracted actions to ActionStep format
      let delay = 800;
      return extracted.slice(0, 4).map((action, idx) => ({
        id: `ai-${idx + 1}`,
        label: action.label,
        tool: action.tool,
        icon: inferIcon(action.tool),
        detail: action.detail,
        delayMs: delay + idx * 800,
      }));
    }
  }

  // ── Strategy 2: Industry-specific templates ─────────────────────
  const industryTemplate = findIndustryTemplate(businessType);
  if (industryTemplate) {
    // Try to find a scenario match based on message keywords
    const lower = message.toLowerCase();
    const scenarioActions = Object.entries(industryTemplate.scenarios);
    // For now, always use default actions from industry template
    return [...industryTemplate.defaultActions];
  }

  // ── Strategy 3: Keyword-scored templates (last resort) ──────────
  return getTemplateActions(businessType, message);
}

/**
 * Get industry-specific metrics for a business type.
 * Returns matching industry metrics or generates reasonable defaults.
 */
export function getIndustryMetrics(
  businessType: string,
): { label: string; value: string; icon: string }[] {
  const template = findIndustryTemplate(businessType);
  if (template) {
    return template.metrics;
  }

  // Generate context-aware defaults based on business type
  const lower = businessType.toLowerCase();

  if (
    lower.match(
      /clinic|dental|medical|physician|therapy|pharmacy|health|chiropractor|vet/,
    )
  ) {
    return [
      { label: "Appointments/mo", value: "560", icon: "📅" },
      { label: "No-show reduction", value: "81%", icon: "📉" },
      { label: "Patient follow-ups", value: "340/mo", icon: "📧" },
      { label: "Hours saved/week", value: "15+", icon: "⚡" },
    ];
  }
  if (
    lower.match(
      /gym|fitness|coach|yoga|pilates|personal training|martial|dance|boxing/,
    )
  ) {
    return [
      { label: "Bookings/mo", value: "380", icon: "📅" },
      { label: "No-show reduction", value: "65%", icon: "📉" },
      { label: "Member retention", value: "+23%", icon: "🔄" },
      { label: "Hours saved/week", value: "10+", icon: "⚡" },
    ];
  }
  if (
    lower.match(
      /tutor|tuition|education|school|training|course|academy|learning|enrichment|preschool|childcare|music|language|driving/,
    )
  ) {
    return [
      { label: "Enrollments/mo", value: "120", icon: "📋" },
      { label: "Attendance rate", value: "94%", icon: "📅" },
      { label: "Parent follow-ups", value: "280/mo", icon: "📧" },
      { label: "Hours saved/week", value: "8+", icon: "⚡" },
    ];
  }
  if (lower.match(/landscape|garden|lawn|tree|irrigation|nursery/)) {
    return [
      { label: "Quotes/mo", value: "85", icon: "📋" },
      { label: "Jobs scheduled", value: "42/mo", icon: "📅" },
      { label: "Client retention", value: "78%", icon: "🔄" },
      { label: "Hours saved/week", value: "9+", icon: "⚡" },
    ];
  }

  // Generic defaults
  return [
    { label: "Tasks automated", value: "50+", icon: "⚡" },
    { label: "Response time", value: "<5s", icon: "⏱️" },
    { label: "Hours saved/wk", value: "10+", icon: "🕐" },
    { label: "Accuracy", value: "99%", icon: "✓" },
  ];
}
