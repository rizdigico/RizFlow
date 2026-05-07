"""
Generate 10 IMPROVED single detailed infographics for RizFlow Instagram posts.
v2: Better top/bottom padding for Instagram UI overlap, larger fonts, more spacing,
    cleaner cards, mobile-friendly sizing.
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

# Instagram UI overlay margins
TOP_PAD = 150  # Extra padding at top for IG profile bar + username
BOTTOM_PAD = 120  # Extra padding at bottom for IG action bar (like/comment/share)

def _apply_all_bg(img, theme, skip_sunset_circle=False):
    _apply_gradient_bg(img, theme)
    fx = theme["effects"]
    if fx.get("sunset_gradient"):
        # Push sunset lower (88%) so it doesn't interfere with content/Instagram bottom UI
        _apply_sunset_gradient(img, theme, skip_circle=skip_sunset_circle, start_ratio=0.88)
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

def _brighter_card(draw, box, theme):
    """Draw a glass card for better text contrast. Handles RGBA card colors properly."""
    x1, y1, x2, y2 = box
    card_raw = tcolor(theme, "card")
    # Glassmorphic uses (255,255,255,18) — alpha gets stripped to solid white.
    # Use a dark translucent card instead for dark themes.
    if len(card_raw) == 4 and card_raw[3] < 80:
        # Alpha is too low for RGB — blend with bg to get proper dark card
        bg = tcolor(theme, "bg")[:3]
        alpha = card_raw[3] / 255
        card_bg = tuple(int(bg[i] * (1 - alpha) + card_raw[i] * alpha) for i in range(3))
    else:
        card_bg = card_raw[:3]
        if sum(card_bg) < 120:
            card_bg = tuple(min(c + 25, 255) for c in card_bg)
    border_bg = tcolor(theme, "card_border")[:3]
    radius = theme["effects"].get("card_radius", 14)
    draw.rounded_rectangle(box, radius=radius, fill=card_bg)
    border_w = theme["effects"].get("card_border_width", 1)
    if border_w > 0 and theme["effects"].get("card_style") != "minimal":
        draw.rounded_rectangle(box, radius=radius, outline=border_bg, width=border_w)


def make_infographic(config, theme, size=IG, out_path=None):
    w, h = size
    img = Image.new("RGB", size, tcolor(theme, "bg")[:3])
    _apply_all_bg(img, theme, skip_sunset_circle=True)
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

    # LARGER fonts for mobile readability
    h_font = tfont(theme, "heading", 48)       # was 44
    sub_font = tfont(theme, "subhead", 28)      # was 26
    body_font = tfont(theme, "body", 22)        # was 20
    label_font = tfont(theme, "label", 19)       # was 17
    mono_font = tfont(theme, "mono", 17)        # was 16
    big_num_font = tfont(theme, "heading", 56)   # was 52
    med_num_font = tfont(theme, "heading", 38)   # was 36
    small_num_font = tfont(theme, "heading", 28)

    fx = theme["effects"]

    # ── HEADER ──
    # Start below Instagram's top UI overlay
    header_y = TOP_PAD
    headline = config["headline"]
    subtitle = config.get("subtitle", "")

    # Neon glow headline (bigger glow for visibility)
    glow_radius = max(fx.get("glow_radius", 12), 16)
    glow_layers = max(fx.get("glow_layers", 3), 4)
    if fx.get("neon_glow"):
        _apply_neon_glow(img, 60, header_y, headline, h_font, primary,
                         glow_radius, glow_layers)
        draw = ImageDraw.Draw(img)
    else:
        draw.text((60, header_y), headline, fill=primary, font=h_font)

    # Accent line under headline
    headline_lines = _wrap_text(headline, h_font, w - 120, draw)
    line_y = header_y + len(headline_lines) * 60 + 14  # 60px line height
    c1, c2 = primary, secondary
    for x in range(60, 400):  # Wider accent line
        t = (x - 60) / 340
        draw.line([(x, line_y), (x, line_y + 5)],  # Thicker line (5px vs 4px)
                  fill=(int(c1[0]+(c2[0]-c1[0])*t), int(c1[1]+(c2[1]-c1[1])*t), int(c1[2]+(c2[2]-c1[2])*t)))

    if subtitle:
        draw.text((60, line_y + 16), subtitle, fill=text_sec, font=sub_font)

    # ── STAT ROWS ──
    y_pos = line_y + 70  # More spacing after subtitle
    stats = config.get("stats", [])
    if stats:
        cols = 2
        stat_w = (w - 160) // cols
        stat_h = 145  # Slightly shorter cards for better fit
        stat_colors = [primary, secondary, accent, success]

        for i, stat in enumerate(stats):
            col = i % cols
            row = i // cols
            sx = 60 + col * (stat_w + 20)
            sy = y_pos + row * (stat_h + 20)  # More gap between rows

            if sy + stat_h > h - BOTTOM_PAD - 60:
                break

            card_box = (sx, sy, sx + stat_w, sy + stat_h)
            _brighter_card(draw, card_box, theme)

            sc = stat_colors[i % len(stat_colors)]
            value = stat.get("value", "")
            label = stat.get("label", "")
            desc = stat.get("desc", "")

            # Bigger stat value
            draw.text((sx + 20, sy + 12), str(value), fill=sc, font=big_num_font)
            draw.text((sx + 20, sy + 72), label, fill=text_pri, font=label_font)
            # Wrap description — check ACTUAL rendered card brightness (handles alpha-blended cards)
            card_raw = tcolor(theme, "card")
            if len(card_raw) == 4 and card_raw[3] < 80:
                bg = tcolor(theme, "bg")[:3]
                alpha = card_raw[3] / 255
                effective_card = tuple(int(bg[i] * (1 - alpha) + card_raw[i] * alpha) for i in range(3))
            else:
                effective_card = card_raw[:3]
            card_is_dark = sum(effective_card) < 150
            card_text_color = text_pri if card_is_dark else text_sec
            desc_lines = _wrap_text(desc, body_font, stat_w - 50, draw)
            for j, dline in enumerate(desc_lines[:2]):
                draw.text((sx + 20, sy + 97 + j * 24), dline, fill=card_text_color, font=body_font)
            # Top accent bar on card
            draw.rectangle([sx + 10, sy, sx + stat_w - 10, sy + 3], fill=sc)

        y_pos += (len(stats) + 1) // cols * (stat_h + 20) + 30

    # ── LIST ITEMS ──
    items = config.get("items", [])
    if items:
        section_title = config.get("list_title", "")
        if section_title:
            draw.text((60, y_pos), section_title, fill=text_pri, font=sub_font)
            y_pos += 44

        for i, item in enumerate(items):
            if y_pos + 75 > h - BOTTOM_PAD - 40:
                break
            # Number circle (bigger)
            circle_r = 20
            cx_num = 90
            cy_num = y_pos + 30
            draw.ellipse([cx_num - circle_r, cy_num - circle_r, cx_num + circle_r, cy_num + circle_r], fill=primary)
            num_text = str(i + 1)
            bbox = draw.textbbox((0,0), num_text, font=small_num_font)
            draw.text((cx_num - (bbox[2]-bbox[0])//2, cy_num - 16), num_text, fill=(0,0,0), font=small_num_font)

            title = item.get("title", "") if isinstance(item, dict) else str(item)
            desc = item.get("desc", "") if isinstance(item, dict) else ""

            draw.text((130, y_pos + 8), title, fill=text_pri, font=label_font)
            if desc:
                # Check actual rendered card brightness (handles alpha-blended cards)
                card_raw = tcolor(theme, "card")
                if len(card_raw) == 4 and card_raw[3] < 80:
                    bg = tcolor(theme, "bg")[:3]
                    alpha = card_raw[3] / 255
                    effective_card = tuple(int(bg[i] * (1 - alpha) + card_raw[i] * alpha) for i in range(3))
                else:
                    effective_card = card_raw[:3]
                card_is_dark = sum(effective_card) < 150
                desc_color = text_pri if card_is_dark else text_sec
                lines = _wrap_text(desc, body_font, w - 220, draw)
                for j, line in enumerate(lines[:2]):
                    draw.text((130, y_pos + 34 + j * 26), line, fill=desc_color, font=body_font)

            # Right accent bar
            draw.rectangle([w - 60, y_pos + 8, w - 54, y_pos + 55], fill=primary)

            y_pos += 74  # More spacing between items

    # ── CTA BAR ──
    # Positioned well above Instagram's bottom action bar
    cta_y = h - BOTTOM_PAD + 10
    # For outrun (sunset gradient), blend CTA area smoothly instead of hard rectangle
    if theme.get("name", "") == "Outrun Retrowave":
        bg = tcolor(theme, "bg")[:3]
        # Sample the sunset color at the CTA line
        sunset_c = img.getpixel((w // 2, cta_y))[:3]
        # Draw a 40px gradient fade from sunset color to bg color
        fade_h = 40
        for fy in range(fade_h):
            t = fy / fade_h
            blend_y = cta_y - fade_h + fy
            r = int(sunset_c[0] * (1 - t) + bg[0] * t)
            g = int(sunset_c[1] * (1 - t) + bg[1] * t)
            b = int(sunset_c[2] * (1 - t) + bg[2] * t)
            draw.line([(0, blend_y), (w, blend_y)], fill=(r, g, b))
        draw.rectangle([0, cta_y, w, h], fill=bg)
    else:
        draw.rectangle([0, cta_y, w, h], fill=tcolor(theme, "bg")[:3])
    _draw_accent_bars(draw, w, theme, top=False, bottom=True)

    cta_text = config.get("cta", "DM 'AUDIT' for yours →")
    draw.text((60, cta_y + 14), cta_text, fill=cta_c, font=sub_font)
    draw.text((w - 220, cta_y + 18), HANDLE, fill=text_dim, font=mono_font)

    if out_path:
        Path(out_path).parent.mkdir(parents=True, exist_ok=True)
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
            {"title": "Manual Inventory", "desc": "Hours updating stock → Auto-synced"},
            {"title": "Slow Order Handling", "desc": "Bottlenecks → Instant processing"},
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
            {"title": '"Game Changer"', "desc": "RainFresh — e-commerce brand"},
            {"title": '"Can\'t Go Back"', "desc": "Professional services client"},
            {"title": '"Wish We Did This Sooner"', "desc": "Health & wellness business"},
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
        "image_path": f"{out_dir}/infographic.jpg",
        "caption": post["caption"].strip(),
        "hashtags": post["hashtags"],
        "hashtag_string": " ".join(post["hashtags"]),
    }
    results.append(meta)
    print(f"✅ Post {i+1}: {post['id']} — theme: {post['theme']}")

# Also generate carousel variant for post 3
from make_carousel_v3 import make_carousel
carousel_dir = f"{OUT}/03_rainfresh_case_study/carousel"
Path(carousel_dir).mkdir(parents=True, exist_ok=True)

carousel_config = {
    "headline": "CASE STUDY: RAINFRESH",
    "subtitle": "Real results, real business",
    "slides": [
        {"type": "cover", "title": "CASE STUDY", "subtitle": "RainFresh E-Commerce"},
        {"type": "numbered_list", "title": "What We Automated",
         "items": ["Order intake & processing", "Inventory sync across channels", "Customer communications & follow-ups"]},
        {"type": "stat_cards", "title": "The Results",
         "stats": [{"value": "70%", "label": "FASTER"}, {"value": "ZERO", "label": "STOCKOUTS"}, {"value": "60%", "label": "COST ↓"}]},
        {"type": "cta", "title": "DM 'AUDIT'", "subtitle": "Get your free discovery audit"},
    ],
}

theme = get_theme("glassmorphic")
slides = make_carousel(config=carousel_config, theme=theme, size=IG, out_dir=carousel_dir)
print(f"\n✅ Carousel for post 3: {len(slides)} slides")

# Save metadata
import json
with open(f"{OUT}/posts_metadata_v2.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"🎉 Generated {len(results)} infographic posts (v2) + carousel")