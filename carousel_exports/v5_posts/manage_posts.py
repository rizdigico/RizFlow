#!/usr/bin/env python3
"""Carefully delete remaining old posts one at a time with longer delays.
Instagram is sensitive to rapid deletions - use 15-20s delays."""
import asyncio
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', buffering=1)
sys.stderr = os.fdopen(sys.stderr.fileno(), 'w', buffering=1)

DISPLAY = ":99"
IG_PROFILE = Path.home() / "Agency_HQ/.social_states/instagram_profile"
HOW_MANY = int(sys.argv[1]) if len(sys.argv) > 1 else 5


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
        await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(5)

        if "login" in page.url:
            print("❌ Not logged in!", flush=True)
            await browser.close()
            return

        print(f"✅ Logged in — deleting {HOW_MANY} posts", flush=True)

        deleted = 0
        for attempt in range(HOW_MANY):
            try:
                # Go to profile
                await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=30000)
                await asyncio.sleep(5)

                post_links = await page.query_selector_all('a[href*="/p/"]')
                if not post_links:
                    print(f"  ⚠️ No more posts found", flush=True)
                    break

                href = await post_links[0].get_attribute("href")
                print(f"  🗑️ Deleting post {attempt+1}: {href}", flush=True)

                # Click the post
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
                    await asyncio.sleep(3)
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
                        print(f"  ✅ Deleted {deleted}/{HOW_MANY}", flush=True)
                        await asyncio.sleep(8)
                    else:
                        print(f"  ⚠️ No confirm button", flush=True)
                else:
                    print(f"  ⚠️ No delete option in menu", flush=True)
                    await page.keyboard.press("Escape")
                    await asyncio.sleep(3)

                # Close modal
                await page.keyboard.press("Escape")
                await asyncio.sleep(2)

                # Extra delay between deletions
                print(f"  ⏳ Waiting 15s...", flush=True)
                await asyncio.sleep(15)

            except Exception as e:
                print(f"  ⚠️ Error: {e}", flush=True)
                try:
                    await page.keyboard.press("Escape")
                    await asyncio.sleep(3)
                except:
                    pass
                # Try to recover
                try:
                    await page.goto("https://www.instagram.com/rizflow.ai/", wait_until="domcontentloaded", timeout=30000)
                    await asyncio.sleep(5)
                except:
                    print(f"  ❌ Browser session lost, stopping", flush=True)
                    break

        print(f"\n🗑️ Deleted {deleted} posts", flush=True)
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())