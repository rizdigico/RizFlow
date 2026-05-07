#!/usr/bin/env python3
"""Delete existing posts and repost v3 infographics (TOP_PAD=150 fix)."""
import asyncio, os, sys, json
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', buffering=1)
sys.stderr = os.fdopen(sys.stderr.fileno(), 'w', buffering=1)

DISPLAY = ":99"
BASE = Path(__file__).parent
IG_PROFILE = Path.home() / "Agency_HQ/.social_states/instagram_profile"

with open(BASE / "posts_metadata_v2.json") as f:
    POSTS = json.load(f)


async def delete_all(page):
    """Delete all posts on the profile."""
    await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=60000)
    await asyncio.sleep(5)
    deleted = 0
    while True:
        post_links = await page.query_selector_all('a[href*="/p/"]')
        if not post_links:
            break
        try:
            await post_links[0].click()
            await asyncio.sleep(4)
            more_btn = await page.query_selector('svg[aria-label="More options"]')
            if not more_btn:
                more_btn = await page.query_selector('button:has(svg[aria-label="More options"])')
            if not more_btn:
                await page.keyboard.press("Escape")
                await asyncio.sleep(3)
                break
            await more_btn.click()
            await asyncio.sleep(2)
            delete_btn = await page.query_selector('text="Delete"')
            if delete_btn:
                await delete_btn.click()
                await asyncio.sleep(2)
                confirm = await page.query_selector('button:has-text("Delete")')
                if confirm:
                    await confirm.click()
                    deleted += 1
                    print(f"  Deleted {deleted}", flush=True)
                    await asyncio.sleep(8)
            await page.keyboard.press("Escape")
            await asyncio.sleep(2)
            await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(5)
            print(f"  Waiting 15s...", flush=True)
            await asyncio.sleep(15)
        except Exception as e:
            print(f"  Error: {e}", flush=True)
            try:
                await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=30000)
                await asyncio.sleep(5)
            except:
                break
    print(f"Deleted {deleted} posts total", flush=True)
    return deleted


async def post_single(page, image_path, caption, num):
    try:
        await page.goto("https://www.instagram.com/create/select/", wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(3)
        file_input = await page.query_selector('input[type="file"]')
        if not file_input:
            print(f"  No file input", flush=True)
            return False
        await file_input.set_input_files(str(image_path))
        print(f"  Uploaded", flush=True)
        await asyncio.sleep(4)

        for sel_text in ["next"]:
            btns = await page.query_selector_all('button')
            for btn in btns:
                text = await btn.text_content()
                if text and text.strip().lower() == sel_text:
                    await btn.click()
                    break
        await asyncio.sleep(2)

        for sel_text in ["next"]:
            btns = await page.query_selector_all('button')
            for btn in btns:
                text = await btn.text_content()
                if text and text.strip().lower() == sel_text:
                    await btn.click()
                    break
        await asyncio.sleep(2)

        for sel in ['[aria-label="Write a caption..."]', 'textarea[placeholder="Write a caption..."]', 'textarea']:
            el = await page.query_selector(sel)
            if el:
                await el.click()
                await asyncio.sleep(0.3)
                await el.fill(caption)
                break
        await asyncio.sleep(1)

        share_clicked = False
        for sel in ['button:has-text("Share")', 'button:has-text("Post")']:
            try:
                btn = await page.query_selector(sel)
                if btn:
                    await btn.click()
                    share_clicked = True
                    break
            except:
                continue
        if not share_clicked:
            btns = await page.query_selector_all('button')
            for btn in btns:
                text = await btn.text_content()
                if text and "share" in text.strip().lower():
                    await btn.click()
                    share_clicked = True
                    break
        if not share_clicked:
            print(f"  No Share button", flush=True)
            return False

        await asyncio.sleep(8)
        print(f"  Post #{num} done!", flush=True)
        return True
    except Exception as e:
        print(f"  Error: {e}", flush=True)
        return False


async def main():
    os.environ["DISPLAY"] = DISPLAY
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=str(IG_PROFILE),
            headless=False,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled", "--disable-infobars", "--window-size=1280,900"],
            viewport={"width": 1280, "height": 900},
        )
        page = await browser.new_page()
        await page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(5)

        if "login" in page.url:
            print("Not logged in!", flush=True)
            await browser.close()
            return

        print("Logged in", flush=True)

        # Delete existing posts
        await delete_all(page)

        # Post all 10
        print("\nPosting 10 infographics...", flush=True)
        results = []
        for i, post in enumerate(POSTS, 1):
            ok = await post_single(page, post["image_path"], post["caption"], i)
            results.append((i, ok))
            if i < len(POSTS):
                wait = 90 + (i * 15)
                print(f"  Waiting {wait}s...", flush=True)
                await asyncio.sleep(wait)

        print("\nRESULTS:", flush=True)
        for num, ok in results:
            print(f"  Post {num}: {'OK' if ok else 'FAIL'}", flush=True)

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())