#!/usr/bin/env python3
"""Post all 10 RizFlow infographic posts to Instagram via Playwright.
Uses domcontentloaded + explicit waits instead of networkidle for reliability."""
import asyncio
import os
import sys
import json
from pathlib import Path
from playwright.async_api import async_playwright

# Force unbuffered output
sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', buffering=1)
sys.stderr = os.fdopen(sys.stderr.fileno(), 'w', buffering=1)

DISPLAY = ":99"
BASE = Path(__file__).parent
IG_PROFILE = Path.home() / "Agency_HQ/.social_states/instagram_profile"

POSTS = [
    (BASE / "01_01_the_problem/infographic.jpg",
     "You didn't start your business to do THIS all day. 😤\n\nThe average SME owner spends 20+ hours a week on manual work that AI could handle in minutes.\n\nWhat if you could get those hours back? 🔄\n\nSlide to see what's really costing you →\n\n#aiautomation #entrepreneurlife #smallbusinessowner #futureofwork #bottleneck"),

    (BASE / "02_02_what_are_agents/infographic.jpg",
     "AI agents ≠ chatbots 🤖⚡\n\nChatbots answer questions. AI agents DO things.\n\nHandle customer intake. Track workflows. Send invoices. Manage comms. All 24/7.\n\nThis is the future of operations. And it's already here. →\n\n#aiagents #automationtools #aitools #digitaltransformation #techstartup"),

    (BASE / "03_03_rainfresh_case_study/infographic.jpg",
     "REAL CLIENT. REAL RESULTS. 🌊\n\nRainFresh came to us drowning in manual orders. Within weeks:\n⚡ 70% faster order processing\n📦 ZERO stockouts\n💰 60% cost reduction\n\nThis isn't fantasy. This is what AI automation looks like.\n\nWant results like this? DM us 'AUDIT' →\n\n#casestudy #aiautomation #ecommerce #businessgrowth #rainfresh"),

    (BASE / "04_04_ecommerce/infographic.jpg",
     "E-Commerce owners: You're losing sales to slow processes 🛒\n\nEvery minute on manual tasks = a minute your competitors win customers.\n\nAI agents handle it ALL: inventory, orders, customer replies, restocking.\n\nStop working IN your business. Start working ON it. →\n\n#ecommerce #aiautomation #onlinestore #shopifyseller #businessautomation"),

    (BASE / "05_05_how_it_works/infographic.jpg",
     "3 steps. That's it. 🎯\n\n1️⃣ DISCOVER — We map your workflows and find every time leak\n2️⃣ DEPLOY — Custom AI agents built for YOUR processes\n3️⃣ SCALE — Watch it run. Adjust. Grow.\n\nNo coding. No learning curve. Just results.\n\nDM 'AUDIT' to start →\n\n#howitworks #aiautomation #businessprocess #scaleyourbusiness #workflow"),

    (BASE / "06_06_professional_services/infographic.jpg",
     "Consultants, agencies, freelancers — you're billing hours but working more. 😤\n\nThe client work you love? Buried under admin you hate.\n\nAI agents handle lead intake, email, reports, and scheduling. You focus on high-value work.\n\n#consultantlife #agencyowner #aiautomation #productivityhacks #freelancer"),

    (BASE / "07_07_social_proof/infographic.jpg",
     "Numbers don't lie. 📊\n\n✅ 20+ hours saved per week\n✅ 70% faster workflows\n✅ 60% cost reduction\n✅ 3x growth after deployment\n\nThe question isn't IF you should automate — it's WHEN. The answer? Now.\n\nDM 'AUDIT' to start →\n\n#socialproof #aiagency #businessresults #automationagency #testimonials"),

    (BASE / "08_08_health_wellness/infographic.jpg",
     "Health & wellness businesses: Your front desk shouldn't be your bottleneck 🏥\n\nBooking, reminders, follow-ups, intake — AI agents handle ALL of it.\n\nMore appointments. Fewer no-shows. Happier clients.\n\nDM 'WELLNESS' to see how →\n\n#healthwellness #clinicautomation #aiautomation #patientcare #wellnessbusiness"),

    (BASE / "09_09_rizflow_demo/infographic.jpg",
     "This is what RizFlow actually looks like in action 🎬\n\nOur AI agents don't just suggest — they DO:\n1️⃣ Discover your workflows\n2️⃣ Map every bottleneck\n3️⃣ Deploy custom agents\n4️⃣ Monitor & optimize 24/7\n\nNo learning curve. No coding. We build it. We run it. You scale.\n\nDM 'DEMO' to try it →\n\n#rizflow #aidemo #businessautomation #saastool #demoday"),

    (BASE / "10_10_free_audit_cta/infographic.jpg",
     "You're still doing this manually? 🤔\n\nEvery week you wait = 20+ hours lost forever.\n\nOur free discovery audit takes 15 minutes and shows you EXACTLY which tasks AI can take off your plate.\n\nNo commitment. No pressure. Just clarity.\n\nDM 'AUDIT' → or visit rizflow.co\n\n#freeaudit #aiautomation #businessautomation #scaleyourbusiness #rizflow"),
]

CAROUSEL_SLIDES = [
    str(BASE / "03_rainfresh_case_study/carousel/slide_1_glassmorphic.jpg"),
    str(BASE / "03_rainfresh_case_study/carousel/slide_2_glassmorphic.jpg"),
    str(BASE / "03_rainfresh_case_study/carousel/slide_3_glassmorphic.jpg"),
    str(BASE / "03_rainfresh_case_study/carousel/slide_4_glassmorphic.jpg"),
]

CAROUSEL_CAPTION = "REAL CLIENT. REAL RESULTS. 🌊\n\nRainFresh came to us drowning in manual orders. Within weeks:\n⚡ 70% faster order processing\n📦 ZERO stockouts\n💰 60% cost reduction\n\nThis isn't fantasy. This is what AI automation looks like.\n\nWant results like this? DM us 'AUDIT' →\n\n#casestudy #aiautomation #ecommerce #businessgrowth #rainfresh"


async def post_single(page, image_path, caption, post_num):
    """Post a single image to Instagram."""
    label = Path(image_path).parent.name
    print(f"\n📱 Posting #{post_num} (single): {label}", flush=True)

    try:
        # Navigate to create page
        await page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)

        # Find file input
        file_input = await page.query_selector('input[type="file"]')
        if not file_input:
            print(f"  ❌ No file input found", flush=True)
            await page.screenshot(path=f"{BASE}/debug_{post_num}_no_file_input.png")
            return False

        await file_input.set_input_files(str(image_path))
        print(f"  ✅ Image uploaded", flush=True)
        await asyncio.sleep(4)

        # Click Next after selecting image
        next_btns = await page.query_selector_all('button')
        for btn in next_btns:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
                await btn.click()
                print(f"  ✅ Clicked Next (select)", flush=True)
                break
        await asyncio.sleep(2)

        # Click Next to skip edit/filters
        next_btns2 = await page.query_selector_all('button')
        for btn in next_btns2:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
                await btn.click()
                print(f"  ✅ Clicked Next (edit)", flush=True)
                break
        await asyncio.sleep(2)

        # Fill caption
        caption_filled = False
        for sel in ['[aria-label="Write a caption..."]', 'textarea[placeholder="Write a caption..."]', '[contenteditable="true"]', 'textarea']:
            el = await page.query_selector(sel)
            if el:
                await el.click()
                await asyncio.sleep(0.3)
                await el.fill(caption)
                print(f"  ✅ Caption filled", flush=True)
                caption_filled = True
                break

        if not caption_filled:
            await page.keyboard.press("Tab")
            await asyncio.sleep(0.3)
            await page.keyboard.type(caption, delay=10)
            print(f"  ✅ Caption filled via keyboard", flush=True)

        await asyncio.sleep(1)

        # Click Share
        share_clicked = False
        for sel in ['button:has-text("Share")', 'button:has-text("Post")']:
            try:
                btn = await page.query_selector(sel)
                if btn:
                    await btn.click()
                    share_clicked = True
                    print(f"  ✅ Clicked Share", flush=True)
                    break
            except:
                continue

        if not share_clicked:
            buttons = await page.query_selector_all('button')
            for btn in buttons:
                text = await btn.text_content()
                if text and "share" in text.strip().lower():
                    await btn.click()
                    share_clicked = True
                    print(f"  ✅ Clicked Share button", flush=True)
                    break

        if not share_clicked:
            print(f"  ❌ Could not find Share button", flush=True)
            await page.screenshot(path=f"{BASE}/debug_{post_num}_no_share.png")
            return False

        await asyncio.sleep(8)
        print(f"  🎉 Post #{post_num} done!", flush=True)
        return True

    except Exception as e:
        print(f"  ❌ Error: {e}", flush=True)
        await page.screenshot(path=f"{BASE}/debug_{post_num}_error.png")
        return False


async def post_carousel(page, image_paths, caption, post_num):
    """Post a multi-slide carousel to Instagram."""
    print(f"\n📱 Posting #{post_num} (CAROUSEL, {len(image_paths)} slides)", flush=True)

    try:
        await page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)

        file_input = await page.query_selector('input[type="file"]')
        if not file_input:
            print(f"  ❌ No file input found", flush=True)
            return False

        await file_input.set_input_files(image_paths)
        print(f"  ✅ {len(image_paths)} carousel images uploaded", flush=True)
        await asyncio.sleep(5)

        # Click Next
        next_btns = await page.query_selector_all('button')
        for btn in next_btns:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
                await btn.click()
                print(f"  ✅ Clicked Next (select)", flush=True)
                break
        await asyncio.sleep(2)

        # Click Next to skip edit
        next_btns2 = await page.query_selector_all('button')
        for btn in next_btns2:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
                await btn.click()
                print(f"  ✅ Clicked Next (edit)", flush=True)
                break
        await asyncio.sleep(2)

        # Fill caption
        for sel in ['[aria-label="Write a caption..."]', 'textarea[placeholder="Write a caption..."]', '[contenteditable="true"]', 'textarea']:
            el = await page.query_selector(sel)
            if el:
                await el.click()
                await asyncio.sleep(0.3)
                await el.fill(caption)
                print(f"  ✅ Caption filled", flush=True)
                break

        await asyncio.sleep(1)

        # Click Share
        share_clicked = False
        for sel in ['button:has-text("Share")', 'button:has-text("Post")']:
            try:
                btn = await page.query_selector(sel)
                if btn:
                    await btn.click()
                    share_clicked = True
                    print(f"  ✅ Clicked Share", flush=True)
                    break
            except:
                continue

        if not share_clicked:
            buttons = await page.query_selector_all('button')
            for btn in buttons:
                text = await btn.text_content()
                if text and "share" in text.strip().lower():
                    await btn.click()
                    share_clicked = True
                    print(f"  ✅ Clicked Share button", flush=True)
                    break

        if not share_clicked:
            print(f"  ❌ Could not find Share button for carousel", flush=True)
            await page.screenshot(path=f"{BASE}/debug_{post_num}_carousel_no_share.png")
            return False

        await asyncio.sleep(8)
        print(f"  🎉 Carousel post #{post_num} done!", flush=True)
        return True

    except Exception as e:
        print(f"  ❌ Carousel error: {e}", flush=True)
        await page.screenshot(path=f"{BASE}/debug_{post_num}_carousel_error.png")
        return False


async def main():
    os.environ["DISPLAY"] = DISPLAY

    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=str(IG_PROFILE),
            headless=False,
            args=[
                "--no-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--window-size=1280,900",
            ],
            viewport={"width": 1280, "height": 900},
        )

        page = await browser.new_page()

        # Navigate and verify login
        await page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(5)

        url = page.url
        if "login" in url:
            print("❌ Not logged in to Instagram!", flush=True)
            await page.screenshot(path=f"{BASE}/debug_login_required.png")
            await browser.close()
            return

        print("✅ Logged in to Instagram", flush=True)

        results = []
        for i, (img_path, caption) in enumerate(POSTS, 1):
            # Post 3: try carousel first
            if i == 3:
                print(f"\n🔄 Post 3: Attempting CAROUSEL first...", flush=True)
                carousel_ok = await post_carousel(page, CAROUSEL_SLIDES, CAROUSEL_CAPTION, i)
                if carousel_ok:
                    results.append((3, "carousel", True))
                else:
                    print("  ⚠️ Carousel failed, falling back to single image...", flush=True)
                    ok = await post_single(page, img_path, caption, i)
                    results.append((3, "single_fallback", ok))
            else:
                ok = await post_single(page, img_path, caption, i)
                results.append((i, "single", ok))

            # Increasing wait between posts to avoid rate limiting
            if i < len(POSTS):
                wait = 45 + (i * 10)
                print(f"  ⏳ Waiting {wait}s before next post...", flush=True)
                await asyncio.sleep(wait)

        # Print results
        print("\n" + "=" * 50, flush=True)
        print("POSTING RESULTS", flush=True)
        print("=" * 50, flush=True)
        for num, ptype, ok in results:
            status = "✅ SUCCESS" if ok else "❌ FAILED"
            print(f"  Post {num} ({ptype}): {status}", flush=True)

        # Save results
        results_file = BASE / "posting_results.json"
        with open(results_file, "w") as f:
            json.dump([{"post": n, "type": t, "success": s} for n, t, s in results], f, indent=2)
        print(f"\nResults saved to {results_file}", flush=True)

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())