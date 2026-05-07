#!/usr/bin/env python3
"""Post the RainFresh carousel (4 slides) to Instagram as a separate post.
Uses the /create/ flow which supports multiple files."""
import asyncio
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', buffering=1)
sys.stderr = os.fdopen(sys.stderr.fileno(), 'w', buffering=1)

DISPLAY = ":99"
BASE = Path(__file__).parent
IG_PROFILE = Path.home() / "Agency_HQ/.social_states/instagram_profile"

CAROUSEL_SLIDES = [
    str(BASE / "03_rainfresh_case_study/carousel/slide_1_glassmorphic.jpg"),
    str(BASE / "03_rainfresh_case_study/carousel/slide_2_glassmorphic.jpg"),
    str(BASE / "03_rainfresh_case_study/carousel/slide_3_glassmorphic.jpg"),
    str(BASE / "03_rainfresh_case_study/carousel/slide_4_glassmorphic.jpg"),
]

CAPTION = """REAL CLIENT. REAL RESULTS. 🌊

RainFresh came to us drowning in manual orders. Within weeks:
⚡ 70% faster order processing
📦 ZERO stockouts
💰 60% cost reduction

This isn't fantasy. This is what AI automation looks like.

Want results like this? DM us 'AUDIT' →

#casestudy #aiautomation #ecommerce #businessgrowth #rainfresh"""


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

        # Navigate to IG
        await page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(5)

        if "login" in page.url:
            print("❌ Not logged in!", flush=True)
            await browser.close()
            return

        print("✅ Logged in to Instagram", flush=True)

        # Strategy: Click the "New post" (+) button in the nav bar
        # This opens the native file picker which supports multiple files
        print("\n📱 Posting CAROUSEL (4 slides)", flush=True)

        # Click the +/New post button
        new_post_btn = None
        selectors = [
            'a[href="/create/"]',
            'svg[aria-label="New post"]',
            '[data-testid="new-post-button"]',
            'div[role="dialog"] a[href="/create/"]',
        ]
        for sel in selectors:
            new_post_btn = await page.query_selector(sel)
            if new_post_btn:
                break

        if new_post_btn:
            # Click to open create page
            await new_post_btn.click()
            await asyncio.sleep(3)
            print("  ✅ Opened create page via button", flush=True)
        else:
            # Direct navigation
            await page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(3)
            print("  ✅ Navigated to create page", flush=True)

        # Now find the file input - it should support multiple files on the create page
        # Try to find a file input that accepts multiple
        file_inputs = await page.query_selector_all('input[type="file"]')
        print(f"  Found {len(file_inputs)} file inputs", flush=True)

        for fi in file_inputs:
            multiple = await fi.get_attribute("multiple")
            accept = await fi.get_attribute("accept")
            print(f"  Input: multiple={multiple}, accept={accept}", flush=True)

        # Try each file input until we find one that works with multiple files
        uploaded = False
        for fi in file_inputs:
            try:
                await fi.set_input_files(CAROUSEL_SLIDES)
                print(f"  ✅ {len(CAROUSEL_SLIDES)} carousel images uploaded", flush=True)
                uploaded = True
                break
            except Exception as e:
                print(f"  ⚠️ Input rejected multiple files: {e}", flush=True)
                continue

        if not uploaded:
            # Fallback: try injecting multiple attribute
            print("  ⚠️ Trying to inject multiple attribute...", flush=True)
            for fi in file_inputs:
                await fi.evaluate("el => el.setAttribute('multiple', '')")
                try:
                    await fi.set_input_files(CAROUSEL_SLIDES)
                    print(f"  ✅ Carousel images uploaded after injecting multiple attr", flush=True)
                    uploaded = True
                    break
                except Exception as e:
                    print(f"  ⚠️ Still failed: {e}", flush=True)

        if not uploaded:
            print("  ❌ Could not upload carousel images", flush=True)
            await page.screenshot(path=f"{BASE}/debug_carousel_upload_fail.png")
            await browser.close()
            return

        await asyncio.sleep(4)

        # Check for carousel preview / multiple indicators
        await page.screenshot(path=f"{BASE}/debug_carousel_preview.png")

        # Click Next
        next_buttons = await page.query_selector_all('button')
        for btn in next_buttons:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
                await btn.click()
                print("  ✅ Clicked Next (select)", flush=True)
                break
        await asyncio.sleep(2)

        # Click Next again (skip edit)
        next_buttons2 = await page.query_selector_all('button')
        for btn in next_buttons2:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
                await btn.click()
                print("  ✅ Clicked Next (edit)", flush=True)
                break
        await asyncio.sleep(2)

        # Fill caption
        for sel in ['[aria-label="Write a caption..."]', 'textarea[placeholder="Write a caption..."]', '[contenteditable="true"]', 'textarea']:
            el = await page.query_selector(sel)
            if el:
                await el.click()
                await asyncio.sleep(0.3)
                await el.fill(CAPTION)
                print("  ✅ Caption filled", flush=True)
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
                    print("  ✅ Clicked Share", flush=True)
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
                    print("  ✅ Clicked Share button", flush=True)
                    break

        if share_clicked:
            await asyncio.sleep(8)
            print("  🎉 Carousel post published!", flush=True)
        else:
            print("  ❌ Could not find Share button", flush=True)
            await page.screenshot(path=f"{BASE}/debug_carousel_no_share.png")

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())