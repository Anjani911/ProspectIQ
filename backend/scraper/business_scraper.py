import re
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


def normalize_url(url: str) -> str:
    url = url.strip()

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    return url


def extract_email(text: str) -> str | None:
    match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    match = re.search(
        r"(?:\+91[\s-]?)?[6-9]\d{9}",
        text
    )
    return match.group(0) if match else None


def scrape_business(url: str) -> dict:
    url = normalize_url(url)

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
        text = soup.get_text(" ", strip=True)

        parsed = urlparse(url)

        return {
            "name": title.strip() or parsed.netloc,
            "website_url": url,
            "email": extract_email(text),
            "phone": extract_phone(text),
            "domain": parsed.netloc,
            "text": text[:2000],
        }

    except Exception as e:
        return {
            "website_url": url,
            "error": str(e)
        }


if __name__ == "__main__":
    result = scrape_business("https://example.com")
    print(result)