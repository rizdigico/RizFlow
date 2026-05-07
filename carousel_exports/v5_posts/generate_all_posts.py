"""
Generate 10 Instagram carousel posts for RizFlow marketing campaign.
Content mix: case study, AI industries, demo/CTA, problem-solution, social proof.
"""
import sys
sys.path.insert(0, "/home/rizflow/Agency_HQ/builds/design-systems")

from make_carousel_v3 import generate_carousel, IG_PORTRAIT
from agency_themes import get_theme, THEMES
import json

OUT = "/home/rizflow/Agency_HQ/RizFlow/carousel_exports/v5_posts"
HANDLE = "@rizflow.ai"

# 10 posts in order — strategic content sequence
posts = [
    # ━━━ POST 1: Hook — The Problem ━━━
    {
        "id": "01_the_problem",
        "theme": "cyberpunk",
        "caption": """You didn't start your business to do THIS all day. 😤

Repetitive tasks, endless follow-ups, manual data entry — it's draining your time, energy, and revenue.

The average SME owner spends 20+ hours a week on work that an AI agent could do in minutes.

What if you could get those hours back? 🔄

Slide to see what's really costing you →""",
        "hashtags": ["#aiautomation", "#entrepreneurlife", "#smallbusinessowner", "#futureofwork", "#bottleneck"],
        "config": {
            "headline": "THE HIDDEN DRAIN",
            "subtitle": "20+ hours/week lost to manual work",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "stat_cards", "title": "The Real Cost", "stats": [
                    {"value": "20h", "label": "HOURS/WEEK", "desc": "Lost to manual tasks"},
                    {"value": "$47K", "label": "PER YEAR", "desc": "Cost of wasted time"},
                    {"value": "68%", "label": "OF OWNERS", "desc": "Feel overwhelmed daily"},
                    {"value": "3x", "label": "GROWTH RATE", "desc": "When automation kicks in"},
                ]},
                {"type": "numbered_list", "title": "What's Eating Your Time", "items": [
                    {"title": "Customer Intake", "desc": "Manual forms, copy-paste, follow-ups"},
                    {"title": "Workflow Tracking", "desc": "Spreadsheets, status updates, reminders"},
                    {"title": "Invoicing & Billing", "desc": "Creating, sending, chasing payments"},
                    {"title": "Communications", "desc": "Email, DMs, replies across platforms"},
                ]},
                {"type": "cta", "headline": "GET THOSE HOURS BACK", "subtitle": "AI agents that run your business", "button": "DM 'AUDIT'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 2: Solution — What Are AI Agents ━━━
    {
        "id": "02_what_are_agents",
        "theme": "hud",
        "caption": """AI agents ≠ chatbots 🤖⚡

Chatbots answer questions. AI agents DO things.

An AI agent can:
✅ Handle customer intake automatically
✅ Track your workflows end-to-end
✅ Send invoices and follow up on payments
✅ Manage communications across channels

They work 24/7, never call in sick, and learn your processes in days.

This is the future of operations. And it's already here. →""",
        "hashtags": ["#aiagents", "#automationtools", "#aitools", "#digitaltransformation", "#techstartup"],
        "config": {
            "headline": "AI AGENTS EXPLAINED",
            "subtitle": "Not chatbots. Autonomous workers.",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "numbered_list", "title": "What AI Agents Actually Do", "items": [
                    {"title": "Autonomous Execution", "desc": "They complete tasks, not just suggest them"},
                    {"title": "24/7 Availability", "desc": "No breaks, no sick days, always online"},
                    {"title": "Process Learning", "desc": "They adapt to YOUR workflows in days"},
                    {"title": "Multi-Channel Action", "desc": "Email, DMs, CRM — all connected"},
                ]},
                {"type": "stat_cards", "title": "Agents vs. Chatbots", "stats": [
                    {"value": "DO", "label": "AGENTS", "desc": "Execute & complete tasks"},
                    {"value": "SAY", "label": "CHATBOTS", "desc": "Respond to questions only"},
                    {"value": "24/7", "label": "UPTIME", "desc": "Agents never stop working"},
                    {"value": "10x", "label": "SPEED BOOST", "desc": "vs. manual processes"},
                ]},
                {"type": "cta", "headline": "SEE AGENTS IN ACTION", "subtitle": "Book your free discovery audit", "button": "DM 'DEMO'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 3: Case Study — RainFresh ━━━
    {
        "id": "03_rainfresh_case_study",
        "theme": "glassmorphic",
        "caption": """REAL CLIENT. REAL RESULTS. 🌊

RainFresh came to us drowning in manual orders, stockouts, and wasted hours.

Within weeks, our AI agents:
⚡ 70% faster order processing
📦 ZERO stockouts
💰 60% cost reduction

This isn't a fantasy. This is what happens when you let AI handle the grunt work.

Want results like this? DM us 'AUDIT' →""",
        "hashtags": ["#casestudy", "#aiautomation", "#ecommerce", "#businessgrowth", "#rainfresh"],
        "config": {
            "headline": "CASE STUDY: RAINFRESH",
            "subtitle": "E-Commerce Brand — Real Results",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "stat_cards", "title": "RainFresh Results", "stats": [
                    {"value": "70%", "label": "FASTER PROCESSING", "desc": "Orders handled in minutes"},
                    {"value": "ZERO", "label": "STOCKOUTS", "desc": "Inventory always synced"},
                    {"value": "60%", "label": "COST REDUCTION", "desc": "Less manual overhead"},
                    {"value": "3x", "label": "GROWTH RATE", "desc": "After agent deployment"},
                ]},
                {"type": "numbered_list", "title": "What We Automated", "items": [
                    {"title": "Order Processing", "desc": "AI agents handle intake → fulfillment"},
                    {"title": "Inventory Sync", "desc": "Real-time stock tracking across channels"},
                    {"title": "Customer Comms", "desc": "Auto-replies, updates, follow-ups"},
                    {"title": "Invoicing", "desc": "Generate, send, and track payments"},
                ]},
                {"type": "cta", "headline": "GET YOUR FREE AUDIT", "subtitle": "See what we can automate for you", "button": "DM 'AUDIT'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 4: Industry — E-Commerce ━━━
    {
        "id": "04_ecommerce",
        "theme": "outrun",
        "caption": """E-Commerce owners: You're losing sales to slow processes 🛒

Every minute spent on manual inventory, order tracking, and customer replies is a minute your competitors are winning customers.

AI agents can handle ALL of this automatically:
📦 Real-time inventory sync
🛍️ Instant order processing
💬 24/7 customer responses
📊 Smart restock alerts

Stop working IN your business. Start working ON it. →""",
        "hashtags": ["#ecommerce", "#aiautomation", "#onlinestore", "#shopifyseller", "#businessautomation"],
        "config": {
            "headline": "AI FOR E-COMMERCE",
            "subtitle": "Automate. Scale. Dominate.",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "numbered_list", "title": "E-Commerce Pain Points", "items": [
                    {"title": "Manual Inventory", "desc": "Hours wasted updating stock levels"},
                    {"title": "Slow Order Handling", "desc": "Bottlenecks from intake to shipping"},
                    {"title": "Missed Messages", "desc": "Customers left waiting for replies"},
                    {"title": "Stockout Losses", "desc": "Revenue gone when items go MIA"},
                ]},
                {"type": "stat_cards", "title": "What AI Agents Deliver", "stats": [
                    {"value": "70%", "label": "FASTER ORDERS", "desc": "From click to fulfillment"},
                    {"value": "24/7", "label": "CUSTOMER SUPPORT", "desc": "Instant responses always"},
                    {"value": "ZERO", "label": "STOCKOUTS", "desc": "AI tracks & reorders"},
                    {"value": "3x", "label": "REVENUE GROWTH", "desc": "When processes scale"},
                ]},
                {"type": "cta", "headline": "AUTOMATE YOUR STORE", "subtitle": "Free audit for e-commerce brands", "button": "DM 'ECOM'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 5: How It Works ━━━
    {
        "id": "05_how_it_works",
        "theme": "agency_core",
        "caption": """3 steps. That's it. 🎯

Most agencies make AI sound complicated. We make it simple:

1️⃣ DISCOVERY — We map your workflows and find every time leak
2️⃣ DEPLOY — Custom AI agents built for YOUR processes
3️⃣ SCALE — Watch it run. Adjust. Grow.

No coding required. No learning curve. Just results.

Ready to start? DM 'AUDIT' →""",
        "hashtags": ["#howitworks", "#aiautomation", "#businessprocess", "#scaleyourbusiness", "#workflow"],
        "config": {
            "headline": "HOW IT WORKS",
            "subtitle": "3 steps to autonomous operations",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "numbered_list", "title": "The RizFlow Process", "items": [
                    {"title": "DISCOVERY", "desc": "We audit your workflows, find every leak"},
                    {"title": "DEPLOY", "desc": "Custom AI agents built for your processes"},
                    {"title": "SCALE", "desc": "Monitor, adjust, and grow without limits"},
                ]},
                {"type": "stat_cards", "title": "What Happens After", "stats": [
                    {"value": "1 WK", "label": "TO DEPLOY", "desc": "Agents live in under a week"},
                    {"value": "20+", "label": "HRS SAVED", "desc": "Every single week"},
                    {"value": "0", "label": "CODING NEEDED", "desc": "We handle everything"},
                ]},
                {"type": "cta", "headline": "START WITH A FREE AUDIT", "subtitle": "Find out what AI can automate for you", "button": "DM 'AUDIT'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 6: Industry — Professional Services ━━━
    {
        "id": "06_professional_services",
        "theme": "cyberpunk",
        "caption": """Consultants, agencies, freelancers — you're billing hours but working more.

The client work you love? Buried under admin you hate.

AI agents can take over:
📋 Lead qualification & intake
📧 Email management & follow-ups
📊 Report generation & delivery
🗓️ Scheduling & calendar management

Focus on high-value work. Let AI handle the rest. →""",
        "hashtags": ["#consultantlife", "#agencyowner", "#aiautomation", "#productivityhacks", "#freelancer"],
        "config": {
            "headline": "AI FOR PRO SERVICES",
            "subtitle": "Less admin. More billable hours.",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "numbered_list", "title": "Admin Eating Your Day?", "items": [
                    {"title": "Lead Intake", "desc": "Qualify, respond, schedule automatically"},
                    {"title": "Email Triage", "desc": "AI sorts, drafts, and follows up"},
                    {"title": "Report Generation", "desc": "Auto-compile data into client reports"},
                    {"title": "Scheduling", "desc": "AI manages your calendar end-to-end"},
                ]},
                {"type": "stat_cards", "title": "The Numbers Don't Lie", "stats": [
                    {"value": "40%", "label": "TIME SAVED", "desc": "On admin & coordination"},
                    {"value": "3x", "label": "MORE CLIENTS", "desc": "When onboarding is instant"},
                    {"value": "Zero", "label": "MISSED FOLLOW-UPS", "desc": "AI never forgets"},
                    {"value": "24/7", "label": "AVAILABILITY", "desc": "Always responding"},
                ]},
                {"type": "cta", "headline": "RECLAIM YOUR TIME", "subtitle": "Book a free workflow audit", "button": "DM 'AUDIT'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 7: Social Proof — Testimonial Stats ━━━
    {
        "id": "07_social_proof",
        "theme": "glassmorphic",
        "caption": """Numbers don't lie. 📊

We've helped businesses across industries automate their operations and reclaim their time.

Here's what our clients experience:
✅ 20+ hours saved per week
✅ 70% faster workflows
✅ 60% cost reduction
✅ 3x growth after deployment

The question isn't IF you should automate — it's WHEN.

The answer? Now. DM 'AUDIT' to start →""",
        "hashtags": ["#socialproof", "#aiagency", "#businessresults", "#automationagency", "#testimonials"],
        "config": {
            "headline": "THE PROOF IS IN THE DATA",
            "subtitle": "Real results from real businesses",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "stat_cards", "title": "Client Results", "stats": [
                    {"value": "20+", "label": "HRS SAVED/WEEK", "desc": "Average time reclaimed"},
                    {"value": "70%", "label": "FASTER WORKFLOWS", "desc": "Speed increase after deploy"},
                    {"value": "60%", "label": "COST REDUCTION", "desc": "Less manual overhead"},
                    {"value": "3x", "label": "GROWTH RATE", "desc": "Revenue boost post-automation"},
                ]},
                {"type": "numbered_list", "title": "What Clients Say", "items": [
                    {"title": "\"Game Changer\"", "desc": "RainFresh — e-commerce brand"},
                    {"title": "\"Can't Go Back\"", "desc": "Professional services client"},
                    {"title": "\"Wish We Did This Sooner\"", "desc": "Health & wellness business"},
                    {"title": "\"Like Adding a Team\"", "desc": "Digital marketing agency owner"},
                ]},
                {"type": "cta", "headline": "JOIN THE RESULTS", "subtitle": "Free discovery audit — no strings", "button": "DM 'AUDIT'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 8: Industry — Health & Wellness ━━━
    {
        "id": "08_health_wellness",
        "theme": "outrun",
        "caption": """Health & wellness businesses: Your front desk shouldn't be your bottleneck 🏥

Booking, reminders, follow-ups, intake forms — AI agents handle ALL of it.

Your staff focuses on patients. Your AI handles the paperwork.

The result? More appointments, fewer no-shows, happier clients.

DM 'WELLNESS' to see how →""",
        "hashtags": ["#healthwellness", "#clinicautomation", "#aiautomation", "#patientcare", "#wellnessbusiness"],
        "config": {
            "headline": "AI FOR WELLNESS",
            "subtitle": "Your front desk, automated.",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "numbered_list", "title": "Wellness Bottlenecks", "items": [
                    {"title": "Manual Booking", "desc": "Phone tag, no-shows, double bookings"},
                    {"title": "Intake Paperwork", "desc": "Forms, follow-ups, data entry"},
                    {"title": "Reminders", "desc": "Staff texting clients one by one"},
                    {"title": "Payment Chasing", "desc": "Invoices, late payments, tracking"},
                ]},
                {"type": "stat_cards", "title": "What AI Agents Fix", "stats": [
                    {"value": "90%", "label": "NO-SHOW DROP", "desc": "AI reminders work"},
                    {"value": "24/7", "label": "BOOKING", "desc": "Clients book anytime"},
                    {"value": "50%", "label": "LESS ADMIN", "desc": "Staff focuses on care"},
                    {"value": "2x", "label": "APPOINTMENTS", "desc": "More slots filled"},
                ]},
                {"type": "cta", "headline": "AUTOMATE YOUR CLINIC", "subtitle": "Free audit for wellness businesses", "button": "DM 'WELLNESS'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 9: RizFlow Demo ━━━
    {
        "id": "09_rizflow_demo",
        "theme": "hud",
        "caption": """This is what RizFlow actually looks like in action 🎬

Our AI agents don't just suggest — they DO:
1️⃣ Discover your workflows
2️⃣ Map every bottleneck
3️⃣ Deploy custom agents
4️⃣ Monitor & optimize 24/7

You don't need to learn anything. You don't need to code anything.

We build it. We run it. You scale.

See it for yourself →""",
        "hashtags": ["#rizflow", "#aidemo", "#businessautomation", "#saastool", "#demoday"],
        "config": {
            "headline": "MEET RIZFLOW",
            "subtitle": "AI agents that run your business",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "numbered_list", "title": "How RizFlow Works", "items": [
                    {"title": "DISCOVER", "desc": "We map your workflows & find leaks"},
                    {"title": "DEPLOY", "desc": "Custom AI agents go live in days"},
                    {"title": "AUTOMATE", "desc": "Tasks handled 24/7 — zero coding"},
                    {"title": "SCALE", "desc": "More clients, more revenue, same team"},
                ]},
                {"type": "stat_cards", "title": "Why RizFlow", "stats": [
                    {"value": "1 WK", "label": "DEPLOY TIME", "desc": "From audit to live agents"},
                    {"value": "20+", "label": "HRS/WEEK SAVED", "desc": "Average time reclaimed"},
                    {"value": "0", "label": "CODING REQUIRED", "desc": "We handle everything"},
                    {"value": "∞", "label": "SCALE POTENTIAL", "desc": "No human bottlenecks"},
                ]},
                {"type": "cta", "headline": "TRY RIZFLOW FREE", "subtitle": "Book your discovery audit today", "button": "DM 'DEMO'", "handle": HANDLE},
            ]
        }
    },

    # ━━━ POST 10: Final CTA — Free Audit ━━━
    {
        "id": "10_free_audit_cta",
        "theme": "agency_core",
        "caption": """You're still doing this manually? 🤔

Every week you wait = 20+ hours lost forever.

Our free discovery audit takes 15 minutes and shows you EXACTLY which tasks AI can take off your plate.

No commitment. No pressure. Just clarity.

DM 'AUDIT' and let's find your bottlenecks →

🔗 Or visit rizflow.co""",
        "hashtags": ["#freeaudit", "#aiautomation", "#businessautomation", "#scaleyourbusiness", "#rizflow"],
        "config": {
            "headline": "GET YOUR FREE AUDIT",
            "subtitle": "15 min = 20+ hrs/week saved",
            "handle": HANDLE,
            "slides": [
                {"type": "cover"},
                {"type": "stat_cards", "title": "What You're Losing", "stats": [
                    {"value": "20+", "label": "HRS/WEEK", "desc": "Lost to manual tasks"},
                    {"value": "$47K", "label": "PER YEAR", "desc": "Cost of wasted time"},
                    {"value": "3x", "label": "GROWTH POTENTIAL", "desc": "With AI automation"},
                    {"value": "15 MIN", "label": "AUDIT TAKES", "desc": "That's all we need"},
                ]},
                {"type": "numbered_list", "title": "What The Audit Covers", "items": [
                    {"title": "Workflow Mapping", "desc": "We document every process you run"},
                    {"title": "Bottleneck ID", "desc": "Find exactly where time & money leak"},
                    {"title": "AI Match", "desc": "See which agents fit your needs"},
                    {"title": "ROI Projection", "desc": "Know the savings before you commit"},
                ]},
                {"type": "cta", "headline": "DM 'AUDIT' TO START", "subtitle": "Or visit rizflow.co", "button": "FREE AUDIT", "handle": HANDLE},
            ]
        }
    },
]

# Generate all posts
results = []
for i, post in enumerate(posts):
    theme = get_theme(post["theme"])
    out_dir = f"{OUT}/{i+1:02d}_{post['id']}"

    paths = generate_carousel(
        config=post["config"],
        theme=theme,
        out_dir=out_dir,
        size=IG_PORTRAIT,
        format="jpg",
        quality=95
    )

    # Save metadata
    meta = {
        "post_num": i + 1,
        "id": post["id"],
        "theme": post["theme"],
        "caption": post["caption"],
        "hashtags": post["hashtags"],
        "slides": paths,
        "hashtag_string": " ".join(post["hashtags"]),
    }

    import json
    with open(f"{out_dir}/metadata.json", "w") as f:
        json.dump(meta, f, indent=2)

    results.append(meta)
    print(f"✅ Post {i+1}: {post['id']} — {len(paths)} slides — theme: {post['theme']}")

print(f"\n🎉 Generated {len(results)} posts with {sum(len(r['slides']) for r in results)} total slides")