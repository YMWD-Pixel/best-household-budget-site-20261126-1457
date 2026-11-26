#!/usr/bin/env python3
"""Screenshot Hearth & Ledger's views with headless Chromium (Playwright).

Serves nothing over the network: the sandboxed Chromium cannot reach
localhost, so the pages are opened straight from disk (file://), exactly
as the site's own files load one another.
"""
import sys
from playwright.sync_api import sync_playwright

ROOT = "/home/hatch/workspace/makefun/best-household-budget-site-20261126-1457"
OUT = ROOT + "/screenshots"
BASE = "file://" + ROOT + "/app/index.html"
VIEWS = [
    ("1-dashboard.jpg", "#/dashboard", 1280, 800),
    ("2-transactions.jpg", "#/transactions", 1280, 800),
    ("3-budgets.jpg", "#/budgets", 1280, 800),
    ("4-phone.jpg", "#/dashboard", 390, 844),
]

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/opt/hatch/bin/hatch-chromium-sandbox",
            args=["--no-sandbox", "--allow-file-access-from-files"],
        )
        for name, frag, w, h in VIEWS:
            page = browser.new_page(viewport={"width": w, "height": h})
            page.goto(BASE + frag)
            page.wait_for_timeout(1500)
            page.screenshot(path=f"{OUT}/{name}", type="jpeg", quality=85)
            print(name, "done")
            page.close()
        browser.close()
finally:
    pass
print("all screenshots taken")
