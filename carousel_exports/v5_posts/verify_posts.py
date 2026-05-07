#!/usr/bin/env python3
"""Verify all 10 Instagram posts by visiting the profile and screenshotting each one."""
import asyncio
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', buffering=1)

DISPLAY = ":99"
BASE = Path(__file__).parent
IG_PROFILE = Path.home() / "Agency_HQ/.social_states/instagram_profile"
VERIFY_DIR = BASE / "verify_screenshots"
VERIFY_DIR.mkdir(exist_ok=True)


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

        # Go to RizFlow profile
        profile_url = "https://www.instagram.com/rizflow.ai/"
        await page.goto(profile_url, wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(5)

        if "login" in page.url:
            print("❌ Not logged in!", flush=True)
            await browser.close()
            return

        print("✅ Logged in — on profile page", flush=True)

        # Screenshot the profile grid
        await page.screenshot(path=str(VERIFY_DIR / "profile_grid.png"), full_page=False)
        print("📸 Screenshot: profile_grid.png", flush=True)

        # Find all post links in the grid
        post_links = await page.query_selector_all('a[href*="/p/"]')
        print(f"Found {len(post_links)} posts on profile", flush=True)

        # Click into each post and screenshot it
        for i in range(min(len(post_links), 10)):
            # Re-query links each time since DOM changes
            post_links = await page.query_selector_all('a[href*="/p/"]')
            if i >= len(post_links):
                break

            link = post_links[i]
            href = await link.get_attribute("href")
            print(f"\n📱 Post {i+1}: {href}", flush=True)

            # Click the post
            await link.click()
            await asyncio.sleep(3)

            # Screenshot the post modal
            await page.screenshot(path=str(VERIFY_DIR / f"post_{i+1:02d}.png"))
            print(f"  📸 Screenshot: post_{i+1:02d}.png", flush=True)

            # Close the modal (press Escape)
            await page.keyboard.press("Escape")
            await asyncio.sleep(2)

        await browser.close()
        print(f"\n✅ Done — {len(list(VERIFY_DIR.glob('*.png')))} screenshots in {VERIFY_DIR}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())