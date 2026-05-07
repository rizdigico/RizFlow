#!/usr/bin/env python3
"""Delete remaining old posts and repost v2 infographics.
Batched approach with longer delays to avoid IG session kills."""
import asyncio
import os
import sys
import json
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', buffering=1)
sys.stderr = os.fdopen(sys.stderr.fileno(), 'w', buffering=1)

DISPLAY = ":99"
BASE = Path(__file__).parent
IG_PROFILE = Path.home() / "Agency_HQ/.social_states/instagram_profile"

with open(BASE / "posts_metadata_v2.json") as f:
    POSTS = json.load(f)

MODE = sys.argv[1] if len(sys.argv) > 1 else "delete"  # "delete" or "post"


async def delete_posts(page, count=5):
    """Delete the most recent posts."""
    print(f"\n🗑️ Deleting up to {count} most recent posts...", flush=True)

    await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=60000)
    await asyncio.sleep(5)

    deleted = 0
    for attempt in range(count):
        try:
            post_links = await page.query_selector_all('a[href*="/p/"]')
            if not post_links:
                print(f"  ⚠️ No more posts found", flush=True)
                break

            await post_links[0].click()
            await asyncio.sleep(4)

            # Click three-dot menu
            more_btn = await page.query_selector('svg[aria-label="More options"]')
            if not more_btn:
                more_btn = await page.query_selector('button:has(svg[aria-label="More options"])')

            if more_btn:
                await more_btn.click()
                await asyncio.sleep(2)
            else:
                print(f"  ⚠️ No more options button", flush=True)
                await page.keyboard.press("Escape")
                await asyncio.sleep(2)
                continue

            # Click Delete
            delete_btn = await page.query_selector('text="Delete"')
            if delete_btn:
                await delete_btn.click()
                await asyncio.sleep(2)

                # Confirm
                confirm_btn = await page.query_selector('button:has-text("Delete")')
                if confirm_btn:
                    await confirm_btn.click()
                    deleted += 1
                    print(f"  ✅ Deleted post {deleted}/{count}", flush=True)
                    await asyncio.sleep(5)
                else:
                    print(f"  ⚠️ No confirm button", flush=True)
            else:
                print(f"  ⚠️ No delete option", flush=True)

            # Go back to profile
            await page.keyboard.press("Escape")
            await asyncio.sleep(2)
            await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(5)

        except Exception as e:
            print(f"  ⚠️ Error deleting post {attempt+1}: {e}", flush=True)
            try:
                await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=30000)
                await asyncio.sleep(5)
            except:
                print(f"  ❌ Browser session lost", flush=True)
                break

    print(f"\n🗑️ Deleted {deleted} posts total", flush=True)
    return deleted


async def post_single(page, image_path, caption, post_num):
    """Post a single image to Instagram."""
    label = Path(image_path).parent.name
    print(f"\n📱 Posting #{post_num}: {label}", flush=True)

    try:
        await page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)

        file_input = await page.query_selector('input[type="file"]')
        if not file_input:
            print(f"  ❌ No file input", flush=True)
            return False

        await file_input.set_input_files(str(image_path))
        print(f"  ✅ Image uploaded", flush=True)
        await asyncio.sleep(4)

        btns = await page.query_selector_all('button')
        for btn in btns:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
                await btn.click()
                print(f"  ✅ Clicked Next (select)", flush=True)
                break
        await asyncio.sleep(2)

        btns = await page.query_selector_all('button')
        for btn in btns:
            text = await btn.text_content()
            if text and text.strip().lower() == "next":
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

        if MODE == "delete":
            # Delete remaining posts (5 already deleted)
            await delete_posts(page, count=10)

        elif MODE == "post":
            # Post all 10 v2 infographics
            results = []
            for i, post in enumerate(POSTS, 1):
                img_path = post["image_path"]
                caption = post["caption"]

                ok = await post_single(page, img_path, caption, i)
                results.append((i, "single", ok))

                if i < len(POSTS):
                    wait = 60 + (i * 15)  # Longer delays
                    print(f"  ⏳ Waiting {wait}s before next post...", flush=True)
                    await asyncio.sleep(wait)

            print("\n" + "=" * 50, flush=True)
            print("REPOSTING RESULTS", flush=True)
            print("=" * 50, flush=True)
            for num, ptype, ok in results:
                status = "✅ SUCCESS" if ok else "❌ FAILED"
                print(f"  Post {num} ({ptype}): {status}", flush=True)

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())