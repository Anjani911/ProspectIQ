from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from urllib.parse import urlparse


def analyze_website(url: str):
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=30000
            )

            html = page.content()
            title = page.title()

            browser.close()

        soup = BeautifulSoup(html, "html.parser")

        meta_description = soup.find(
            "meta",
            attrs={"name": "description"}
        )

        images = soup.find_all("img")

        headings = {
            "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
            "h2": [h.get_text(strip=True) for h in soup.find_all("h2")],
            "h3": [h.get_text(strip=True) for h in soup.find_all("h3")]
        }

        text = soup.get_text(" ", strip=True)
        parsed_url = urlparse(url)

        return {
            "url": url,
            "title": title,
            "meta_description": (
                meta_description.get("content")
                if meta_description
                else None
            ),
            "has_https": parsed_url.scheme == "https",
            "image_count": len(images),
            "images_without_alt": sum(
                1 for img in images if not img.get("alt")
            ),
            "headings": headings,
            "text_length": len(text)
        }

    except Exception as e:
        return {
            "url": url,
            "error": str(e)
        }