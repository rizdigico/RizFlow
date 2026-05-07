#!/usr/bin/env python3
"""Post remaining posts (#10 and carousel retry) to Instagram."""
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


async def post_single(page, image_path, caption, post_num):
    """Post a single image to Instagram."""
    label = Path(image_path).parent.name
    print(f"\n📱 Posting #{post_num} (single): {label}", flush=True)

    try:
        await page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)

        file_input = await page.query_selector('input[type="file"]')
        if not file_input:
            print(f"  ❌ No file input found", flush=True)
            return False

        await file_input.set_input_files(str(image_path))
        print(f"  ✅ Image uploaded", flush=True)
        await asyncio.sleep(4)

        for sel_text in ["next"]:
            btns = await page.query_selector_all('button')
            for btn in btns:
                text = await btn.text_content()
                if text and text.strip().lower() == sel_text:
                    await btn.click()
                    print(f"  ✅ Clicked Next ({sel_text})", flush=True)
                    break
        await asyncio.sleep(2)

        for sel_text in ["next"]:
            btns = await page.query_selector_all('button')
            for btn in btns:
                text = await btn.text_content()
                if text and text.strip().lower() == sel_text:
                    await btn.click()
                    print(f"  ✅ Clicked Next (edit)", flush=True)
                    break
        await asyncio.sleep(2)

        for sel in ['[aria-label="Write a caption..."]', 'textarea[placeholder="Write a caption..."]', '[contenteditable="true"]', 'textarea']:
            el = await page.query_selector(sel)
            if el:
                await el.click()
                await asyncio.sleep(0.3)
                await el.fill(caption)
                print(f"  ✅ Caption filled", flush=True)
                break

        await asyncio.sleep(1)

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
            return False

        await asyncio.sleep(8)
        print(f"  🎉 Post #{post_num} done!", flush=True)
        return True

    except Exception as e:
        print(f"  ❌ Error: {e}", flush=True)
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
        await page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(5)

        if "login" in page.url:
            print("❌ Not logged in!", flush=True)
            await browser.close()
            return

        print("✅ Logged in to Instagram", flush=True)

        # Post #10
        img_path = str(BASE / "10_10_free_audit_cta/infographic.jpg")
        caption = "You're still doing this manually? 🤔\n\nEvery week you wait = 20+ hours lost forever.\n\nOur free discovery audit takes 15 minutes and shows you EXACTLY which tasks AI can take off your plate.\n\nNo commitment. No pressure. Just clarity.\n\nDM 'AUDIT' → or visit rizflow.co\n\n#freeaudit #aiautomation #businessautomation #scaleyourbusiness #rizflow"

        ok = await post_single(page, img_path, caption, 10)
        print(f"\n{'✅' if ok else '❌'} Post #10: {'SUCCESS' if ok else 'FAILED'}", flush=True)

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())