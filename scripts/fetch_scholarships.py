import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/",
    "Connection": "keep-alive",
}

def fetch_page(url):
    response = requests.get(url, headers=HEADERS, timeout=10)
    response.raise_for_status()
    return response.text


def scrape_scholarships(url):
    html = fetch_page(url)
    soup = BeautifulSoup(html, "lxml")

    scholarships = []

    cards = soup.select(".scholarship-item, .listing, article")

    for card in cards:
        title = card.select_one("h2, h3")
        deadline = card.select_one(".deadline, .date")
        description = card.select_one("p")
        link = card.select_one("a")

        scholarships.append({
            "title": title.get_text(strip=True) if title else None,
            "deadline": deadline.get_text(strip=True) if deadline else None,
            "description": description.get_text(strip=True) if description else None,
            "link": link["href"] if link and link.has_attr("href") else None
        })

    return scholarships


def save_data(data, filename="scholarships.csv"):
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False)
    print(f"Saved {len(df)} scholarships to {filename}")


if __name__ == "__main__":
    URL = "https://scholarships365.info/"  # replace
    data = scrape_scholarships(URL)
    save_data(data)
