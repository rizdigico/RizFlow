// Industry Demo Hub — configuration for all industry verticals

export interface ActionStep {
  id: string;
  label: string;
  tool: string; // e.g., "Google Calendar", "CRM", "Email"
  icon: string; // emoji
  detail: string; // What was done, shown on hover/expand
  delayMs: number; // Stagger delay in ms (simulates sequential actions)
}

export interface IndustryScenario {
  id: string;
  title: string;
  description: string;
  firstMessage: string; // What the "customer" says to kick off
  actions?: ActionStep[]; // Automated actions the agent takes after responding
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  color: string; // Tailwind text color class
  bgColor: string; // Tailwind bg color class
  borderColor: string; // Tailwind border color class
  gradientFrom: string; // CSS gradient from
  gradientTo: string; // CSS gradient to
  tagline: string;
  description: string;
  systemPrompt: string;
  scenarios: IndustryScenario[];
  metrics: { label: string; value: string; icon: string }[];
}

export const INDUSTRIES: Industry[] = [
  {
    id: "fnb",
    name: "F&B / Restaurant",
    icon: "🍽️",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    gradientFrom: "from-orange-500",
    gradientTo: "to-amber-500",
    tagline: "From reservation to restock — handled automatically",
    description:
      "AI agents that manage reservations, handle customer inquiries, track inventory, and respond to reviews — so your front-of-house can focus on the dining experience.",
    systemPrompt: `You are a RizFlow AI agent demo for the F&B / Restaurant industry. You are demonstrating how an AI agent handles restaurant operations. You are helpful, professional, and concise — respond in 2-4 short paragraphs max. Use realistic restaurant details (menu items, reservation times, table numbers). Be specific and actionable. You handle: reservations, customer inquiries, inventory alerts, review responses, and order status. If asked something outside F&B, politely redirect to restaurant operations. Always demonstrate how automation saves time compared to manual handling.`,
    scenarios: [
      {
        id: "reservation-change",
        title: "Reservation Change",
        description: "Customer wants to modify their booking",
        firstMessage:
          "Hi, I have a reservation for 7pm tonight for 4 people under Chen, but we now have 6 people coming. Can you change it to 6?",
        actions: [
          {
            id: "fnb-r1",
            label: "Updated reservation",
            tool: "Reservation System",
            icon: "📅",
            detail:
              "Chen party: 4 → 6 guests, 7pm tonight, Table 12 reassigned",
            delayMs: 800,
          },
          {
            id: "fnb-r2",
            label: "Sent confirmation SMS",
            tool: "Twilio",
            icon: "📱",
            detail:
              'SMS sent to +65 ****1234: "Your reservation for 6 is confirmed for 7pm tonight."',
            delayMs: 1600,
          },
          {
            id: "fnb-r3",
            label: "Flagged kitchen",
            tool: "Slack",
            icon: "🍽️",
            detail:
              '#kitchen-alerts: "Larger party at T12 tonight — adjust prep quantities."',
            delayMs: 2400,
          },
          {
            id: "fnb-r4",
            label: "Logged preference",
            tool: "CRM",
            icon: "📝",
            detail:
              "Customer note: Chen party often books for 4-6, prefers window seating",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "inventory-alert",
        title: "Low Stock Alert",
        description: "Daily inventory check flags 3 items running low",
        firstMessage:
          "Daily inventory check: Fresh salmon stock at 2 portions (reorder threshold: 10), Mozzarella at 500g (threshold: 2kg), House white wine at 3 bottles (threshold: 8). Please draft reorder emails to our suppliers.",
        actions: [
          {
            id: "fnb-i1",
            label: "Flagged low stock items",
            tool: "Inventory System",
            icon: "📦",
            detail:
              "3 items flagged: Salmon (2/10), Mozzarella (0.5/2kg), House White (3/8 bottles)",
            delayMs: 800,
          },
          {
            id: "fnb-i2",
            label: "Sent reorder to supplier",
            tool: "Email",
            icon: "📧",
            detail:
              "Reorder email sent to Pacific Seafood: 5kg fresh salmon, delivery requested by Thu",
            delayMs: 1600,
          },
          {
            id: "fnb-i3",
            label: "Updated menu specials",
            tool: "POS System",
            icon: "📋",
            detail:
              "Temporarily removed salmon dishes from today's specials until restock confirmed",
            delayMs: 2400,
          },
          {
            id: "fnb-i4",
            label: "Scheduled follow-up",
            tool: "Google Calendar",
            icon: "📅",
            detail:
              "Check-in reminder set for tomorrow 9am to verify supplier confirmation",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "review-response",
        title: "Negative Review Response",
        description: "Google review needs a professional reply",
        firstMessage:
          "We received a 2-star Google review: 'Waited 40 minutes for a table despite having a reservation. Food was good but the service was disappointing. Won't be rushing back.' Please draft a professional response.",
        actions: [
          {
            id: "fnb-rv1",
            label: "Drafted review response",
            tool: "Google Business",
            icon: "✍️",
            detail:
              "Professional response posted acknowledging wait time, offering to make it right",
            delayMs: 800,
          },
          {
            id: "fnb-rv2",
            label: "Logged service incident",
            tool: "CRM",
            icon: "📝",
            detail:
              "Incident logged: 40-min wait for reserved table, Saturday peak. Flagged for manager review.",
            delayMs: 1600,
          },
          {
            id: "fnb-rv3",
            label: "Sent goodwill voucher",
            tool: "Email",
            icon: "🎁",
            detail:
              "Complimentary dessert voucher sent to reviewer's email via Google profile",
            delayMs: 2400,
          },
          {
            id: "fnb-rv4",
            label: "Staff notification",
            tool: "Slack",
            icon: "🔔",
            detail:
              "#management: Negative review flagged. Saturday wait-time SOP review scheduled.",
            delayMs: 3200,
          },
        ],
      },
    ],
    metrics: [
      { label: "Reservations handled", value: "847/mo", icon: "📅" },
      { label: "Avg response time", value: "23s", icon: "⚡" },
      { label: "Stock alerts caught", value: "23", icon: "📦" },
      { label: "Hours saved/week", value: "14+", icon: "🕐" },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: "🏠",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-500",
    tagline: "From lead to listing — AI handles the groundwork",
    description:
      "AI agents that qualify leads, schedule viewings, draft property descriptions, follow up with prospects, and generate market reports — so agents can focus on closing deals.",
    systemPrompt: `You are a RizFlow AI agent demo for the Real Estate industry. You are demonstrating how an AI agent handles property management operations. You are helpful, professional, and concise — respond in 2-4 short paragraphs max. Use realistic property details (addresses, prices, square footage, bedrooms). Be specific and actionable. You handle: lead qualification, viewing scheduling, property descriptions, follow-up sequences, market reports, and tenant inquiries. If asked something outside real estate, politely redirect to property operations. Always demonstrate how automation saves time compared to manual handling.`,
    scenarios: [
      {
        id: "lead-inquiry",
        title: "New Lead Inquiry",
        description: "Prospect asks about a property listing",
        firstMessage:
          "Hi, I saw the 3-bedroom condo at 128 Tanjong Pagar Rd listed at $1.2M. Is it still available? We're a family of 4 looking to move in by August. Can we schedule a viewing this weekend?",
        actions: [
          {
            id: "re-l1",
            label: "Added lead to CRM",
            tool: "HubSpot",
            icon: "👥",
            detail:
              "New lead created: Family of 4, 3BR condo, $1.2M budget, move-in by Aug",
            delayMs: 800,
          },
          {
            id: "re-l2",
            label: "Scheduled viewing",
            tool: "Google Calendar",
            icon: "📅",
            detail:
              "Viewing booked: Sat 2pm, 128 Tanjong Pagar Rd. Confirmation sent to agent.",
            delayMs: 1600,
          },
          {
            id: "re-l3",
            label: "Sent property pack",
            tool: "Email",
            icon: "📧",
            detail:
              "Property factsheet with floor plan, recent sale comparables, and neighborhood info sent",
            delayMs: 2400,
          },
          {
            id: "re-l4",
            label: "Set follow-up",
            tool: "CRM",
            icon: "🔄",
            detail:
              "Automated follow-up: 24hr post-viewing check-in + 7-day re-engagement if no response",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "follow-up",
        title: "Cold Lead Follow-up",
        description: "Re-engage a lead who went quiet 2 weeks ago",
        firstMessage:
          "Lead: Marcus Tan, viewed the Clementi unit on Apr 15, expressed interest but hasn't responded to our last 2 emails. Phone: +65 9XXX XXXX. Budget: $800K-1M, looking for 3BR in west area. Please draft a personalized follow-up.",
        actions: [
          {
            id: "re-f1",
            label: "Re-engaged lead",
            tool: "CRM",
            icon: "👥",
            detail:
              "Marcus Tan status updated: Cold → Warm. Last activity refreshed.",
            delayMs: 800,
          },
          {
            id: "re-f2",
            label: "Sent personalized email",
            tool: "Email",
            icon: "📧",
            detail:
              "Follow-up email with 3 new west-area listings matching his budget sent",
            delayMs: 1600,
          },
          {
            id: "re-f3",
            label: "Sent WhatsApp reminder",
            tool: "WhatsApp Business",
            icon: "💬",
            detail:
              'Short WhatsApp message sent: "Hi Marcus, new listings in your area — mind if I share?"',
            delayMs: 2400,
          },
          {
            id: "re-f4",
            label: "Scheduled callback",
            tool: "Google Calendar",
            icon: "📅",
            detail:
              "Agent callback reminder set for Wed 10am if no response by then",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "market-report",
        title: "Area Market Report",
        description: "Generate a local market insights summary",
        firstMessage:
          "Can you generate a brief market report for the Bukit Timah area? Focus on: average transaction prices for 3BR condos in Q1, days on market, and rental yield trends. I need this for a client meeting tomorrow.",
        actions: [
          {
            id: "re-m1",
            label: "Compiled market data",
            tool: "Data API",
            icon: "📊",
            detail:
              "Pulled Q1 Bukit Timah data: 47 transactions, avg $1.35M, 28 DOM",
            delayMs: 800,
          },
          {
            id: "re-m2",
            label: "Generated report",
            tool: "Google Docs",
            icon: "📄",
            detail:
              "2-page market brief created with charts, comparables, and forecast",
            delayMs: 1600,
          },
          {
            id: "re-m3",
            label: "Attached to CRM",
            tool: "HubSpot",
            icon: "📎",
            detail: "Report linked to client record and shared with agent",
            delayMs: 2400,
          },
          {
            id: "re-m4",
            label: "Sent to client",
            tool: "Email",
            icon: "📧",
            detail:
              "Market report emailed to client with meeting agenda for tomorrow",
            delayMs: 3200,
          },
        ],
      },
    ],
    metrics: [
      { label: "Leads qualified", value: "312/mo", icon: "🎯" },
      { label: "Viewings scheduled", value: "89/mo", icon: "🏠" },
      { label: "Follow-ups sent", value: "456/mo", icon: "📧" },
      { label: "Hours saved/week", value: "18+", icon: "⚡" },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: "🛒",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-500",
    tagline: "From cart to customer — automated at every step",
    description:
      "AI agents that handle order inquiries, manage returns, send abandoned cart reminders, track shipments, and flag trending products — so your team can focus on growth.",
    systemPrompt: `You are a RizFlow AI agent demo for the E-Commerce industry. You are demonstrating how an AI agent handles online store operations. You are helpful, professional, and concise — respond in 2-4 short paragraphs max. Use realistic e-commerce details (order numbers, product names, prices, tracking numbers). Be specific and actionable. You handle: order status inquiries, return/refund requests, abandoned cart recovery, restock alerts, shipping updates, and product recommendations. If asked something outside e-commerce, politely redirect to store operations. Always demonstrate how automation saves time compared to manual handling.`,
    scenarios: [
      {
        id: "order-status",
        title: "Customer Order Inquiry",
        description: "Customer asks about their order status",
        firstMessage:
          "Hi, I placed order #RF-28491 last Tuesday and the tracking still says 'processing'. It's been 5 days. Can you check what's happening? I need it by this Saturday for a birthday gift.",
        actions: [
          {
            id: "ec-o1",
            label: "Checked order status",
            tool: "Shopify",
            icon: "🔍",
            detail:
              "Order #RF-28491: packed, awaiting courier pickup. Estimated delivery: Friday.",
            delayMs: 800,
          },
          {
            id: "ec-o2",
            label: "Requested expedited shipping",
            tool: "Shipping API",
            icon: "🚚",
            detail:
              "Upgraded to express shipping at no extra cost. New ETA: Friday by 2pm.",
            delayMs: 1600,
          },
          {
            id: "ec-o3",
            label: "Sent tracking update",
            tool: "Email",
            icon: "📧",
            detail:
              "Customer notified: tracking link + upgraded delivery timeline sent",
            delayMs: 2400,
          },
          {
            id: "ec-o4",
            label: "Added courtesy credit",
            tool: "Stripe",
            icon: "💳",
            detail: "$10 store credit applied to account for the inconvenience",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "abandoned-cart",
        title: "Abandoned Cart Recovery",
        description: "Draft personalized win-back messages",
        firstMessage:
          "Customer Sarah Lim added these to cart but didn't check out: Silk Blend Blazer ($189), Leather Tote ($129). She's bought from us twice before, last purchase was 6 weeks ago. Please draft an abandoned cart recovery message.",
        actions: [
          {
            id: "ec-c1",
            label: "Sent cart reminder",
            tool: "Klaviyo",
            icon: "📧",
            detail:
              'Personalized email sent: "Your blazer & tote are still waiting!" + 10% discount code',
            delayMs: 800,
          },
          {
            id: "ec-c2",
            label: "Triggered SMS follow-up",
            tool: "Twilio",
            icon: "📱",
            detail:
              'SMS sent 4hrs later: "Last chance — your items are almost gone!"',
            delayMs: 1600,
          },
          {
            id: "ec-c3",
            label: "Updated customer segment",
            tool: "CRM",
            icon: "👥",
            detail:
              'Sarah Lim moved to "Win-back Active" segment, product interest tagged',
            delayMs: 2400,
          },
          {
            id: "ec-c4",
            label: "Scheduled final push",
            tool: "CRM",
            icon: "🔄",
            detail:
              "Final 15% discount email scheduled for 48hrs if cart still abandoned",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "return-request",
        title: "Return & Exchange Request",
        description: "Customer wants to return an item",
        firstMessage:
          "I received my order #RF-28377 yesterday but the dress doesn't fit. It's a size M but I need a size L. Order total was $89. Can I exchange it? How do I start the return process?",
        actions: [
          {
            id: "ec-rt1",
            label: "Created return ticket",
            tool: "Zendesk",
            icon: "🎫",
            detail:
              "Return #RT-45231 created for order #RF-28377, reason: size exchange M→L",
            delayMs: 800,
          },
          {
            id: "ec-rt2",
            label: "Generated return label",
            tool: "Shipping API",
            icon: "🏷️",
            detail:
              "Prepaid return shipping label generated, emailed to customer",
            delayMs: 1600,
          },
          {
            id: "ec-rt3",
            label: "Reserved exchange stock",
            tool: "Shopify",
            icon: "📦",
            detail:
              "Size L reserved in warehouse, will ship upon return receipt",
            delayMs: 2400,
          },
          {
            id: "ec-rt4",
            label: "Sent return instructions",
            tool: "Email",
            icon: "📧",
            detail:
              "Step-by-step return guide sent: print label, drop off at nearest PopStation",
            delayMs: 3200,
          },
        ],
      },
    ],
    metrics: [
      { label: "Orders processed", value: "1,247/mo", icon: "📦" },
      { label: "Carts recovered", value: "23%", icon: "🛒" },
      { label: "Avg response time", value: "18s", icon: "⚡" },
      { label: "Hours saved/week", value: "22+", icon: "🕐" },
    ],
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: "💼",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-500",
    tagline: "From intake to invoice — your AI associate",
    description:
      "AI agents that handle client intake, draft proposals, manage project briefs, send invoice reminders, and schedule consultations — so professionals can focus on billable work.",
    systemPrompt: `You are a RizFlow AI agent demo for Professional Services (consulting, legal, accounting, design agencies). You are demonstrating how an AI agent handles professional services operations. You are helpful, professional, and concise — respond in 2-4 short paragraphs max. Use realistic details (client names, project scopes, invoice amounts, timelines). Be specific and actionable. You handle: client intake, project briefs, proposal drafting, invoice follow-ups, meeting scheduling, and contract questions. If asked something outside professional services, politely redirect to business operations. Always demonstrate how automation saves time compared to manual handling.`,
    scenarios: [
      {
        id: "client-intake",
        title: "New Client Intake",
        description: "Collect requirements from a new prospect",
        firstMessage:
          "Hi, I'm the founder of a SaaS startup. We need help with our go-to-market strategy. We've built a project management tool for construction firms but struggling with customer acquisition. Budget is around $15K. Can you walk me through how you'd approach this?",
        actions: [
          {
            id: "ps-c1",
            label: "Created client profile",
            tool: "HubSpot",
            icon: "👥",
            detail:
              "New client profile: SaaS startup, GTM strategy, $15K budget, construction vertical",
            delayMs: 800,
          },
          {
            id: "ps-c2",
            label: "Scheduled discovery call",
            tool: "Google Calendar",
            icon: "📅",
            detail:
              "45-min discovery call booked: Thu 3pm, calendar invite + Zoom link sent",
            delayMs: 1600,
          },
          {
            id: "ps-c3",
            label: "Sent intake form",
            tool: "Typeform",
            icon: "📋",
            detail:
              "Automated intake form sent: company size, current channels, target metrics, competitor analysis",
            delayMs: 2400,
          },
          {
            id: "ps-c4",
            label: "Created project workspace",
            tool: "Notion",
            icon: "🗂️",
            detail:
              "GTM Strategy workspace created with templates: market analysis, channel plan, KPIs",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "invoice-followup",
        title: "Invoice Follow-up",
        description: "Draft professional payment reminders",
        firstMessage:
          "Invoice #INV-2024-0891 for $4,500 was due 14 days ago. Client: Meridian Tech Pte Ltd, contact: David Ong. This is the second reminder — the first was sent 7 days ago. Please draft a professional but firm follow-up email.",
        actions: [
          {
            id: "ps-i1",
            label: "Sent follow-up email",
            tool: "Gmail",
            icon: "📧",
            detail:
              "Firm but professional reminder sent to David Ong with payment link and 7-day deadline",
            delayMs: 800,
          },
          {
            id: "ps-i2",
            label: "Updated invoice status",
            tool: "Xero",
            icon: "💰",
            detail:
              "Invoice #INV-2024-0891 status: Overdue → Second Reminder Sent. Aging flagged.",
            delayMs: 1600,
          },
          {
            id: "ps-i3",
            label: "Scheduled escalation",
            tool: "CRM",
            icon: "🔄",
            detail:
              "Auto-escalation set: if no payment in 7 days → send final notice + assign to accounts manager",
            delayMs: 2400,
          },
          {
            id: "ps-i4",
            label: "Logged activity",
            tool: "CRM",
            icon: "📝",
            detail:
              "Activity logged: Second reminder sent, client acknowledged receipt on first email",
            delayMs: 3200,
          },
        ],
      },
      {
        id: "project-brief",
        title: "Project Brief Generation",
        description: "Create a structured brief from client notes",
        firstMessage:
          "Client notes from our discovery call: They're a dental chain with 5 locations in Singapore. Need: centralized appointment booking, patient reminders, monthly reporting per clinic. Timeline: 3 months. Budget: $25-30K. Integration needed with their existing clinic management software. Please create a structured project brief.",
        actions: [
          {
            id: "ps-p1",
            label: "Created project brief",
            tool: "Notion",
            icon: "📄",
            detail:
              "Structured brief created: scope, deliverables, timeline, budget breakdown, integration specs",
            delayMs: 800,
          },
          {
            id: "ps-p2",
            label: "Sent for review",
            tool: "Email",
            icon: "📧",
            detail:
              "Brief emailed to client + internal team with 48hr review deadline",
            delayMs: 1600,
          },
          {
            id: "ps-p3",
            label: "Set up project board",
            tool: "Asana",
            icon: "📋",
            detail:
              "Asana project created with 3 phases, 14 milestones, and assigned team members",
            delayMs: 2400,
          },
          {
            id: "ps-p4",
            label: "Drafted proposal",
            tool: "Google Docs",
            icon: "✍️",
            detail:
              "Formal proposal drafted from brief — ready for partner review before sending to client",
            delayMs: 3200,
          },
        ],
      },
    ],
    metrics: [
      { label: "Clients onboarded", value: "34/mo", icon: "🤝" },
      { label: "Proposals drafted", value: "67/mo", icon: "📋" },
      { label: "Invoices followed up", value: "189/mo", icon: "💰" },
      { label: "Hours saved/week", value: "16+", icon: "⚡" },
    ],
  },
  {
    id: "construction",
    name: "Construction / Trade",
    icon: "🏗️",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-500",
    tagline: "From quote to completion — AI keeps projects on track",
    description:
      "AI agents that handle quote requests, schedule site visits, track material orders, send progress updates to clients, and flag delays — so builders can focus on the job site.",
    systemPrompt: `You are a RizFlow AI agent demo for the Construction / Trade Services industry. You are demonstrating how an AI agent handles construction and trade business operations. You are helpful, professional, and concise — respond in 2-4 short paragraphs max. Use realistic construction details (project names, materials, timelines, costs). Be specific and actionable. You handle: quote requests, site visit scheduling, material ordering, progress updates, delay notifications, and client communication. If asked something outside construction/trade, politely redirect to project operations. Always demonstrate how automation saves time compared to manual handling.`,
    scenarios: [
      {
        id: "quote-request",
        title: "Customer Quote Request",
        description: "Homeowner wants a renovation quote",
        firstMessage:
          "Hi, I'm looking to renovate my 4-room HDB flat in Sengkang. Scope: kitchen overhaul (new cabinets, tiles, hood), 2 bathroom retiles, and repaint entire unit. Can you give me an estimated quote and timeline? We're looking to start in about 2 months.",
        actions: [
          {
            id: "ct-q1",
            label: "Generated quote",
            tool: "Xero",
            icon: "📋",
            detail:
              "Itemized quote created: Kitchen $12K, Bathrooms $8K, Painting $3K. Total est: $23K + GST",
            delayMs: 800,
          },
          {
            id: "ct-q2",
            label: "Scheduled site visit",
            tool: "Google Calendar",
            icon: "📅",
            detail:
              "On-site measurement visit booked: Sat 10am, Sengkang HDB Block 228B",
            delayMs: 1600,
          },
          {
            id: "ct-q3",
            label: "Sent quote PDF",
            tool: "Email",
            icon: "📧",
            detail:
              "Formal quote PDF emailed with breakdown, terms, and 30-day validity",
            delayMs: 2400,
          },
          {
            id: "ct-q4",
            label: "Created project draft",
            tool: "Asana",
            icon: "🗂️",
            detail:
              'Project pipeline entry created: "Sengkang 4-Renovation" — pending client approval',
            delayMs: 3200,
          },
        ],
      },
      {
        id: "progress-update",
        title: "Project Progress Report",
        description: "Send a client their weekly update",
        firstMessage:
          "Project: Tan Residence Renovation (Contract #CR-2024-015). This week: Kitchen tiling completed, bathroom waterproofing done, electrical rough-in for kitchen started. Next week: Cabinet installation, bathroom tiling starts. One issue: tile delivery delayed by 2 days. Please draft a progress update for the client.",
        actions: [
          {
            id: "ct-p1",
            label: "Compiled progress report",
            tool: "Notion",
            icon: "📊",
            detail:
              "Weekly update created: 3 milestones completed, 1 delay flagged, 2 upcoming tasks",
            delayMs: 800,
          },
          {
            id: "ct-p2",
            label: "Sent client update",
            tool: "WhatsApp Business",
            icon: "💬",
            detail:
              "Progress update sent to Tan family with photos and timeline adjustment",
            delayMs: 1600,
          },
          {
            id: "ct-p3",
            label: "Updated project board",
            tool: "Asana",
            icon: "📋",
            detail:
              "Project board updated: tile delay flagged, new completion ETA adjusted",
            delayMs: 2400,
          },
          {
            id: "ct-p4",
            label: "Notified subcontractors",
            tool: "Slack",
            icon: "🔔",
            detail:
              '#tan-project: "Cabinet install confirmed for Monday. Tile delivery Wed — adjust schedule."',
            delayMs: 3200,
          },
        ],
      },
      {
        id: "material-shortage",
        title: "Material Shortage Alert",
        description: "Flag and find alternatives for a shortage",
        firstMessage:
          "Alert: The Italian marble tiles (Bianco Venatino, Lot #IV-2024-078) for the Ang Mo Kio project are out of stock with our supplier. We need 45 sqm by next week. Please suggest alternatives and draft a message to the client about the change.",
        actions: [
          {
            id: "ct-m1",
            label: "Searched alternatives",
            tool: "Supplier Database",
            icon: "🔍",
            detail:
              "Found 3 alternatives: Carrara Venato ($2/sqm less), Statuario Classic ($5/sqm more), Calacatta Gold (similar price)",
            delayMs: 800,
          },
          {
            id: "ct-m2",
            label: "Requested samples",
            tool: "Email",
            icon: "📦",
            detail:
              "Sample requests sent to 2 suppliers for next-day delivery to showroom",
            delayMs: 1600,
          },
          {
            id: "ct-m3",
            label: "Drafted client message",
            tool: "Email",
            icon: "📧",
            detail:
              "Client notified about shortage with 3 alternatives, photos attached, and price comparison",
            delayMs: 2400,
          },
          {
            id: "ct-m4",
            label: "Updated procurement",
            tool: "Asana",
            icon: "📋",
            detail:
              "Procurement task updated: original order cancelled, alternative selection pending client approval",
            delayMs: 3200,
          },
        ],
      },
    ],
    metrics: [
      { label: "Quotes generated", value: "156/mo", icon: "📋" },
      { label: "Projects tracked", value: "23", icon: "🏗️" },
      { label: "Delays caught early", value: "89%", icon: "⚡" },
      { label: "Hours saved/week", value: "12+", icon: "🕐" },
    ],
  },
];

export function getIndustry(id: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.id === id);
}

export function getScenario(
  industryId: string,
  scenarioId: string,
): IndustryScenario | undefined {
  const industry = getIndustry(industryId);
  return industry?.scenarios.find((s) => s.id === scenarioId);
}
