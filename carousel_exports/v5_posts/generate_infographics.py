"""
Generate 10 single detailed infographics for RizFlow Instagram posts.
Each post = 1 image (1080x1350), rich with data and visuals.
Post 3 (RainFresh case study) will also have a carousel variant for testing multi-slide posting.
"""
import sys, json, math, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.path.insert(0, "/home/rizflow/Agency_HQ/builds/design-systems")
from agency_themes import get_theme, THEMES, font as tfont, color as tcolor, hex_color as thex, FONTS_DIR
from make_carousel_v3 import (
    _apply_gradient_bg, _apply_scanlines, _apply_circuit_lines,
    _apply_particle_dots, _apply_retro_grid, _apply_hud_markers,
    _apply_sunset_gradient, _apply_neon_glow, _draw_glass_card,
    _draw_accent_bars
)

OUT = "/home/rizflow/Agency_HQ/RizFlow/carousel_exports/v5_posts"
IG = (1080, 1350)
HANDLE = "@rizflow.ai"

def _apply_all_bg(img, theme):
    _apply_gradient_bg(img, theme)
    fx = theme["effects"]
    if fx.get("sunset_gradient"):
        _apply_sunset_gradient(img, theme)
    if fx.get("retro_grid"):
        _apply_retro_grid(img, theme)
    _apply_circuit_lines(img, theme)
    _apply_particle_dots(img, theme)
    _apply_scanlines(img, theme)
    _apply_hud_markers(img, theme)

def _wrap_text(text, font, max_w, draw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if draw.textbbox((0,0), test, font=font)[2] > max_w and cur:
            lines.append(cur)
            cur = w
        else:
            cur = test
    if cur:
        lines.append(cur)
    return lines

def make_infographic(config, theme, size=IG, out_path=None):
    w, h = size
    img = Image.new("RGB", size, tcolor(theme, "bg")[:3])
    _apply_all_bg(img, theme)
    draw = ImageDraw.Draw(img)
    _draw_accent_bars(draw, w, theme, top=True, bottom=True)

    primary = tcolor(theme, "primary")[:3]
    secondary = tcolor(theme, "secondary")[:3]
    accent = tcolor(theme, "accent")[:3]
    success = tcolor(theme, "success")[:3]
    text_pri = tcolor(theme, "text_primary")[:3]
    text_sec = tcolor(theme, "text_secondary")[:3]
    text_dim = tcolor(theme, "text_dim")[:3]
    cta_c = tcolor(theme, "cta")[:3]

    h_font = tfont(theme, "heading", 44)
    sub_font = tfont(theme, "subhead", 26)
    body_font = tfont(theme, "body", 20)
    label_font = tfont(theme, "label", 17)
    mono_font = tfont(theme, "mono", 16)
    big_num_font = tfont(theme, "heading", 52)
    med_num_font = tfont(theme, "heading", 36)
    small_num_font = tfont(theme, "heading", 28)

    fx = theme["effects"]

    # ── HEADER ──
    # Instagram clips ~70-80px from top with UI overlay; add top padding
    TOP_PAD = 80
    headline = config["headline"]
    subtitle = config.get("subtitle", "")

    # Neon glow headline
    header_y = 80 + TOP_PAD
    if fx.get("neon_glow"):
        _apply_neon_glow(img, 60, header_y, headline, h_font, primary,
                         fx.get("glow_radius", 12), fx.get("glow_layers", 3))
        draw = ImageDraw.Draw(img)
    else:
        draw.text((60, header_y), headline, fill=primary, font=h_font)

    # Accent line under headline
    line_y = header_y + len(_wrap_text(headline, h_font, w - 120, draw)) * 56 + 10
    c1, c2 = primary, secondary
    for x in range(60, 360):
        t = (x - 60) / 300
        draw.line([(x, line_y), (x, line_y + 4)],
                  fill=(int(c1[0]+(c2[0]-c1[0])*t), int(c1[1]+(c2[1]-c1[1])*t), int(c1[2]+(c2[2]-c1[2])*t)))

    if subtitle:
        draw.text((60, line_y + 14), subtitle, fill=text_sec, font=sub_font)

    # ── STAT ROWS ──
    y_pos = line_y + 60
    stats = config.get("stats", [])
    if stats:
        # 2-column stat grid
        cols = 2
        stat_w = (w - 160) // cols
        stat_h = 150
        stat_colors = [primary, secondary, accent, success]

        for i, stat in enumerate(stats):
            col = i % cols
            row = i // cols
            sx = 60 + col * (stat_w + 20)
            sy = y_pos + row * (stat_h + 16)

            if sy + stat_h > h - 80:
                break

            card_box = (sx, sy, sx + stat_w, sy + stat_h)
            _draw_glass_card(draw, card_box, theme)

            sc = stat_colors[i % len(stat_colors)]
            value = stat.get("value", "")
            label = stat.get("label", "")
            desc = stat.get("desc", "")

            draw.text((sx + 20, sy + 15), str(value), fill=sc, font=big_num_font)
            draw.text((sx + 20, sy + 75), label, fill=text_pri, font=label_font)
            draw.text((sx + 20, sy + 100), desc, fill=text_sec, font=body_font)
            draw.rectangle([sx + 10, sy, sx + stat_w - 10, sy + 3], fill=sc)

        y_pos += len(stats) // cols * (stat_h + 16) + 40

    # ── LIST ITEMS ──
    items = config.get("items", [])
    if items:
        section_title = config.get("list_title", "")
        if section_title:
            draw.text((60, y_pos), section_title, fill=text_pri, font=sub_font)
            y_pos += 38

        for i, item in enumerate(items):
            if y_pos + 80 > h - 80:
                break
            # Number circle
            circle_r = 18
            cx_num = 90
            cy_num = y_pos + 28
            draw.ellipse([cx_num - circle_r, cy_num - circle_r, cx_num + circle_r, cy_num + circle_r], fill=primary)
            num_text = str(i + 1)
            bbox = draw.textbbox((0,0), num_text, font=small_num_font)
            draw.text((cx_num - (bbox[2]-bbox[0])//2, cy_num - 16), num_text, fill=(0,0,0), font=small_num_font)

            title = item.get("title", "") if isinstance(item, dict) else str(item)
            desc = item.get("desc", "") if isinstance(item, dict) else ""

            draw.text((130, y_pos + 8), title, fill=text_pri, font=label_font)
            if desc:
                lines = _wrap_text(desc, body_font, w - 220, draw)
                for j, line in enumerate(lines[:2]):
                    draw.text((130, y_pos + 32 + j * 24), line, fill=text_sec, font=body_font)

            # Right accent
            draw.rectangle([w - 60, y_pos + 8, w - 56, y_pos + 52], fill=primary)

            y_pos += 68

    # ── CTA BAR ──
    cta_y = h - 100
    draw.rectangle([0, cta_y, w, h], fill=(*tcolor(theme, "bg")[:3], 200))
    _draw_accent_bars(draw, w, theme, top=False, bottom=True)

    cta_text = config.get("cta", "DM 'AUDIT' for yours →")
    draw.text((60, cta_y + 10), cta_text, fill=cta_c, font=sub_font)
    draw.text((w - 200, cta_y + 14), HANDLE, fill=text_dim, font=mono_font)

    if out_path:
        img.save(out_path, "JPEG", quality=95, optimize=True)
    return img


# ─── 10 POSTS ───
posts = [
    {
        "id": "01_the_problem",
        "theme": "cyberpunk",
        "headline": "THE HIDDEN DRAIN",
        "subtitle": "20+ hours/week lost to manual work",
        "stats": [
            {"value": "20h", "label": "HRS/WEEK LOST", "desc": "Average time on manual tasks"},
            {"value": "$47K", "label": "ANNUAL COST", "desc": "Value of wasted time"},
            {"value": "68%", "label": "OWNERS OVERWHELMED", "desc": "Feel stuck in the grind"},
            {"value": "3x", "label": "GROWTH POTENTIAL", "desc": "When automation kicks in"},
        ],
        "list_title": "What's Eating Your Time",
        "items": [
            {"title": "Customer Intake", "desc": "Manual forms, copy-paste, follow-ups"},
            {"title": "Workflow Tracking", "desc": "Spreadsheets, status updates, reminders"},
            {"title": "Invoicing & Billing", "desc": "Creating, sending, chasing payments"},
        ],
        "cta": "DM 'AUDIT' → Get your hours back",
        "caption": """You didn't start your business to do THIS all day. 😤

The average SME owner spends 20+ hours a week on manual work that AI could handle in minutes.

What if you could get those hours back? 🔄

Slide to see what's really costing you →

#aiautomation #entrepreneurlife #smallbusinessowner #futureofwork #bottleneck""",
        "hashtags": ["#aiautomation", "#entrepreneurlife", "#smallbusinessowner", "#futureofwork", "#bottleneck"],
    },
    {
        "id": "02_what_are_agents",
        "theme": "hud",
        "headline": "AI AGENTS ≠ CHATBOTS",
        "subtitle": "They DO things. Not just talk.",
        "stats": [
            {"value": "DO", "label": "AGENTS", "desc": "Execute & complete tasks"},
            {"value": "SAY", "label": "CHATBOTS", "desc": "Respond to questions only"},
            {"value": "24/7", "label": "UPTIME", "desc": "Agents never stop working"},
            {"value": "10x", "label": "SPEED BOOST", "desc": "vs. manual processes"},
        ],
        "list_title": "What AI Agents Actually Do",
        "items": [
            {"title": "Autonomous Execution", "desc": "Complete tasks, not just suggest them"},
            {"title": "Process Learning", "desc": "Adapt to YOUR workflows in days"},
            {"title": "Multi-Channel Action", "desc": "Email, DMs, CRM — all connected"},
        ],
        "cta": "DM 'DEMO' → See agents in action",
        "caption": """AI agents ≠ chatbots 🤖⚡

Chatbots answer questions. AI agents DO things.

Handle customer intake. Track workflows. Send invoices. Manage comms. All 24/7.

This is the future of operations. And it's already here. →

#aiagents #automationtools #aitools #digitaltransformation #techstartup""",
        "hashtags": ["#aiagents", "#automationtools", "#aitools", "#digitaltransformation", "#techstartup"],
    },
    {
        "id": "03_rainfresh_case_study",
        "theme": "glassmorphic",
        "headline": "CASE STUDY: RAINFRESH",
        "subtitle": "E-Commerce Brand — Real Results",
        "stats": [
            {"value": "70%", "label": "FASTER PROCESSING", "desc": "Orders in minutes, not hours"},
            {"value": "ZERO", "label": "STOCKOUTS", "desc": "Inventory always synced"},
            {"value": "60%", "label": "COST REDUCTION", "desc": "Less manual overhead"},
            {"value": "3x", "label": "GROWTH RATE", "desc": "After agent deployment"},
        ],
        "list_title": "What We Automated",
        "items": [
            {"title": "Order Processing", "desc": "AI agents handle intake → fulfillment"},
            {"title": "Inventory Sync", "desc": "Real-time stock tracking across channels"},
            {"title": "Customer Comms", "desc": "Auto-replies, updates, follow-ups"},
        ],
        "cta": "DM 'AUDIT' → Get results like this",
        "caption": """REAL CLIENT. REAL RESULTS. 🌊

RainFresh came to us drowning in manual orders. Within weeks:
⚡ 70% faster order processing
📦 ZERO stockouts
💰 60% cost reduction

This isn't fantasy. This is what AI automation looks like.

Want results like this? DM us 'AUDIT' →

#casestudy #aiautomation #ecommerce #businessgrowth #rainfresh""",
        "hashtags": ["#casestudy", "#aiautomation", "#ecommerce", "#businessgrowth", "#rainfresh"],
    },
    {
        "id": "04_ecommerce",
        "theme": "outrun",
        "headline": "AI FOR E-COMMERCE",
        "subtitle": "Automate. Scale. Dominate.",
        "stats": [
            {"value": "70%", "label": "FASTER ORDERS", "desc": "From click to fulfillment"},
            {"value": "24/7", "label": "CUSTOMER SUPPORT", "desc": "Instant responses always"},
            {"value": "ZERO", "label": "STOCKOUTS", "desc": "AI tracks & reorders"},
            {"value": "3x", "label": "REVENUE GROWTH", "desc": "When processes scale"},
        ],
        "list_title": "E-Commerce Pain Points → Solved",
        "items": [
            {"title": "Manual Inventory", "desc": "Hours wasted updating stock levels → Auto-synced"},
            {"title": "Slow Order Handling", "desc": "Bottlenecks from intake to ship → Instant processing"},
            {"title": "Missed Messages", "desc": "Customers left waiting → 24/7 AI replies"},
        ],
        "cta": "DM 'ECOM' → Automate your store",
        "caption": """E-Commerce owners: You're losing sales to slow processes 🛒

Every minute on manual tasks = a minute your competitors win customers.

AI agents handle it ALL: inventory, orders, customer replies, restocking.

Stop working IN your business. Start working ON it. →

#ecommerce #aiautomation #onlinestore #shopifyseller #businessautomation""",
        "hashtags": ["#ecommerce", "#aiautomation", "#onlinestore", "#shopifyseller", "#businessautomation"],
    },
    {
        "id": "05_how_it_works",
        "theme": "agency_core",
        "headline": "HOW RIZFLOW WORKS",
        "subtitle": "3 steps to autonomous operations",
        "stats": [
            {"value": "1 WK", "label": "TO DEPLOY", "desc": "From audit to live agents"},
            {"value": "20+", "label": "HRS SAVED", "desc": "Every single week"},
            {"value": "0", "label": "CODING NEEDED", "desc": "We handle everything"},
        ],
        "list_title": "The RizFlow Process",
        "items": [
            {"title": "1. DISCOVER", "desc": "We audit your workflows, find every time leak"},
            {"title": "2. DEPLOY", "desc": "Custom AI agents built for YOUR processes"},
            {"title": "3. SCALE", "desc": "Monitor, adjust, grow without limits"},
            {"title": "Result: 20+ hrs/wk saved", "desc": "On autopilot, 24/7"},
        ],
        "cta": "DM 'AUDIT' → Start your journey",
        "caption": """3 steps. That's it. 🎯

1️⃣ DISCOVER — We map your workflows and find every time leak
2️⃣ DEPLOY — Custom AI agents built for YOUR processes
3️⃣ SCALE — Watch it run. Adjust. Grow.

No coding. No learning curve. Just results.

DM 'AUDIT' to start →

#howitworks #aiautomation #businessprocess #scaleyourbusiness #workflow""",
        "hashtags": ["#howitworks", "#aiautomation", "#businessprocess", "#scaleyourbusiness", "#workflow"],
    },
    {
        "id": "06_professional_services",
        "theme": "cyberpunk",
        "headline": "AI FOR PRO SERVICES",
        "subtitle": "Less admin. More billable hours.",
        "stats": [
            {"value": "40%", "label": "TIME SAVED", "desc": "On admin & coordination"},
            {"value": "3x", "label": "MORE CLIENTS", "desc": "When onboarding is instant"},
            {"value": "ZERO", "label": "MISSED FOLLOW-UPS", "desc": "AI never forgets"},
            {"value": "24/7", "label": "AVAILABILITY", "desc": "Always responding"},
        ],
        "list_title": "Admin Eating Your Day?",
        "items": [
            {"title": "Lead Intake", "desc": "Qualify, respond, schedule automatically"},
            {"title": "Email Triage", "desc": "AI sorts, drafts, and follows up"},
            {"title": "Report Generation", "desc": "Auto-compile data into client reports"},
        ],
        "cta": "DM 'AUDIT' → Reclaim your time",
        "caption": """Consultants, agencies, freelancers — you're billing hours but working more. 😤

The client work you love? Buried under admin you hate.

AI agents handle lead intake, email, reports, and scheduling. You focus on high-value work.

#consultantlife #agencyowner #aiautomation #productivityhacks #freelancer""",
        "hashtags": ["#consultantlife", "#agencyowner", "#aiautomation", "#productivityhacks", "#freelancer"],
    },
    {
        "id": "07_social_proof",
        "theme": "glassmorphic",
        "headline": "THE PROOF IS IN THE DATA",
        "subtitle": "Real results from real businesses",
        "stats": [
            {"value": "20+", "label": "HRS SAVED/WEEK", "desc": "Average time reclaimed"},
            {"value": "70%", "label": "FASTER WORKFLOWS", "desc": "Speed increase after deploy"},
            {"value": "60%", "label": "COST REDUCTION", "desc": "Less manual overhead"},
            {"value": "3x", "label": "GROWTH RATE", "desc": "Revenue boost post-automation"},
        ],
        "list_title": "What Clients Say",
        "items": [
            {"title": "\"Game Changer\"", "desc": "RainFresh — e-commerce brand"},
            {"title": "\"Can't Go Back\"", "desc": "Professional services client"},
            {"title": "\"Wish We Did This Sooner\"", "desc": "Health & wellness business"},
        ],
        "cta": "DM 'AUDIT' → Join the results",
        "caption": """Numbers don't lie. 📊

✅ 20+ hours saved per week
✅ 70% faster workflows
✅ 60% cost reduction
✅ 3x growth after deployment

The question isn't IF you should automate — it's WHEN. The answer? Now.

DM 'AUDIT' to start →

#socialproof #aiagency #businessresults #automationagency #testimonials""",
        "hashtags": ["#socialproof", "#aiagency", "#businessresults", "#automationagency", "#testimonials"],
    },
    {
        "id": "08_health_wellness",
        "theme": "outrun",
        "headline": "AI FOR WELLNESS",
        "subtitle": "Your front desk, automated.",
        "stats": [
            {"value": "90%", "label": "NO-SHOW DROP", "desc": "AI reminders work"},
            {"value": "24/7", "label": "BOOKING AVAILABILITY", "desc": "Clients book anytime"},
            {"value": "50%", "label": "LESS ADMIN WORK", "desc": "Staff focuses on care"},
            {"value": "2x", "label": "APPOINTMENTS FILLED", "desc": "More slots, more revenue"},
        ],
        "list_title": "Wellness Bottlenecks → Solved",
        "items": [
            {"title": "Manual Booking", "desc": "Phone tag, no-shows → AI booking 24/7"},
            {"title": "Intake Paperwork", "desc": "Forms & data entry → Auto-filled digitally"},
            {"title": "Reminders & Follow-ups", "desc": "Staff texting one by one → AI auto-sends"},
        ],
        "cta": "DM 'WELLNESS' → Automate your clinic",
        "caption": """Health & wellness businesses: Your front desk shouldn't be your bottleneck 🏥

Booking, reminders, follow-ups, intake — AI agents handle ALL of it.

More appointments. Fewer no-shows. Happier clients.

DM 'WELLNESS' to see how →

#healthwellness #clinicautomation #aiautomation #patientcare #wellnessbusiness""",
        "hashtags": ["#healthwellness", "#clinicautomation", "#aiautomation", "#patientcare", "#wellnessbusiness"],
    },
    {
        "id": "09_rizflow_demo",
        "theme": "hud",
        "headline": "MEET RIZFLOW",
        "subtitle": "AI agents that run your business",
        "stats": [
            {"value": "1 WK", "label": "DEPLOY TIME", "desc": "From audit to live agents"},
            {"value": "20+", "label": "HRS/WEEK SAVED", "desc": "Average time reclaimed"},
            {"value": "0", "label": "CODING REQUIRED", "desc": "We handle everything"},
            {"value": "∞", "label": "SCALE POTENTIAL", "desc": "No human bottlenecks"},
        ],
        "list_title": "What RizFlow Agents Do",
        "items": [
            {"title": "DISCOVER", "desc": "Map your workflows & find every leak"},
            {"title": "DEPLOY", "desc": "Custom agents go live in under a week"},
            {"title": "AUTOMATE", "desc": "Tasks handled 24/7 — zero coding needed"},
            {"title": "SCALE", "desc": "More clients, more revenue, same team"},
        ],
        "cta": "DM 'DEMO' → Try RizFlow free",
        "caption": """This is what RizFlow actually looks like in action 🎬

Our AI agents don't just suggest — they DO:
1️⃣ Discover your workflows
2️⃣ Map every bottleneck
3️⃣ Deploy custom agents
4️⃣ Monitor & optimize 24/7

No learning curve. No coding. We build it. We run it. You scale.

DM 'DEMO' to try it →

#rizflow #aidemo #businessautomation #saastool #demoday""",
        "hashtags": ["#rizflow", "#aidemo", "#businessautomation", "#saastool", "#demoday"],
    },
    {
        "id": "10_free_audit_cta",
        "theme": "agency_core",
        "headline": "GET YOUR FREE AUDIT",
        "subtitle": "15 min = 20+ hrs/week saved",
        "stats": [
            {"value": "20+", "label": "HRS/WEEK LOST", "desc": "To manual tasks right now"},
            {"value": "$47K", "label": "ANNUAL COST", "desc": "Value of your wasted time"},
            {"value": "3x", "label": "GROWTH POTENTIAL", "desc": "With AI automation"},
            {"value": "15 MIN", "label": "AUDIT TAKES", "desc": "That's all we need"},
        ],
        "list_title": "What The Audit Covers",
        "items": [
            {"title": "Workflow Mapping", "desc": "We document every process you run"},
            {"title": "Bottleneck ID", "desc": "Find exactly where time & money leak"},
            {"title": "AI Match", "desc": "See which agents fit your needs"},
            {"title": "ROI Projection", "desc": "Know the savings before you commit"},
        ],
        "cta": "DM 'AUDIT' → Start now, free",
        "caption": """You're still doing this manually? 🤔

Every week you wait = 20+ hours lost forever.

Our free discovery audit takes 15 minutes and shows you EXACTLY which tasks AI can take off your plate.

No commitment. No pressure. Just clarity.

DM 'AUDIT' → or visit rizflow.co

#freeaudit #aiautomation #businessautomation #scaleyourbusiness #rizflow""",
        "hashtags": ["#freeaudit", "#aiautomation", "#businessautomation", "#scaleyourbusiness", "#rizflow"],
    },
]

# Generate all
results = []
for i, post in enumerate(posts):
    theme = get_theme(post["theme"])
    out_dir = f"{OUT}/{i+1:02d}_{post['id']}"
    Path(out_dir).mkdir(parents=True, exist_ok=True)

    img = make_infographic(
        config=post,
        theme=theme,
        size=IG,
        out_path=f"{out_dir}/infographic.jpg"
    )

    meta = {
        "post_num": i + 1,
        "id": post["id"],
        "theme": post["theme"],
        "caption": post["caption"].strip(),
        "hashtags": post["hashtags"],
        "hashtag_string": " ".join(post["hashtags"]),
        "image": f"{out_dir}/infographic.jpg",
    }
    with open(f"{out_dir}/metadata.json", "w") as f:
        json.dump(meta, f, indent=2)

    results.append(meta)
    print(f"✅ Post {i+1}: {post['id']} — theme: {post['theme']}")

# Also generate carousel slides for post 3 (RainFresh) for multi-slide test
from make_carousel_v3 import generate_carousel
carousel_config = {
    "headline": "CASE STUDY: RAINFRESH",
    "subtitle": "E-Commerce Brand — Real Results",
    "handle": HANDLE,
    "slides": [
        {"type": "cover"},
        {"type": "stat_cards", "title": "RainFresh Results", "stats": [
            {"value": "70%", "label": "FASTER PROCESSING", "desc": "Orders in minutes"},
            {"value": "ZERO", "label": "STOCKOUTS", "desc": "Always synced"},
            {"value": "60%", "label": "COST REDUCTION", "desc": "Less overhead"},
            {"value": "3x", "label": "GROWTH", "desc": "After deployment"},
        ]},
        {"type": "numbered_list", "title": "What We Automated", "items": [
            {"title": "Order Processing", "desc": "AI agents: intake → fulfillment"},
            {"title": "Inventory Sync", "desc": "Real-time across channels"},
            {"title": "Customer Comms", "desc": "Auto-replies, follow-ups"},
            {"title": "Invoicing", "desc": "Generate, send, track"},
        ]},
        {"type": "cta", "headline": "GET YOUR FREE AUDIT", "subtitle": "See what we can automate for you", "button": "DM 'AUDIT'", "handle": HANDLE},
    ]
}

carousel_dir = f"{OUT}/03_rainfresh_case_study/carousel"
carousel_paths = generate_carousel(
    config=carousel_config,
    theme=get_theme("glassmorphic"),
    out_dir=carousel_dir,
    size=IG,
    format="jpg",
    quality=95
)

print(f"\n✅ Carousel for post 3: {len(carousel_paths)} slides")
print(f"🎉 Generated {len(results)} infographic posts + 1 carousel test")