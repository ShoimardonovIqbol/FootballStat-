import asyncio
import xml.etree.ElementTree as ET
from datetime import timezone
from email.utils import parsedate_to_datetime

import httpx
from fastapi import APIRouter

from cache import cache

router = APIRouter(tags=["News"])

FEEDS = [
    {"url": "http://feeds.bbci.co.uk/sport/football/rss.xml", "source": "BBC Sport"},
    {"url": "https://www.skysports.com/rss/11095", "source": "Sky Sports"},
]

MEDIA_NS = {"media": "http://search.yahoo.com/mrss/"}


def _parse_pub_date(raw: str | None) -> str | None:
    if not raw:
        return None
    try:
        return parsedate_to_datetime(raw).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError):
        return raw


def _parse_feed(xml_text: str, source: str) -> list[dict]:
    root = ET.fromstring(xml_text)
    articles = []

    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        description = (item.findtext("description") or "").strip()
        if not title or not link:
            continue

        image = None
        thumb = item.find("media:thumbnail", MEDIA_NS)
        if thumb is not None:
            image = thumb.get("url")
        if image is None:
            enclosure = item.find("enclosure")
            if enclosure is not None and (enclosure.get("type") or "").startswith("image"):
                image = enclosure.get("url")

        articles.append({
            "title": title,
            "link": link,
            "description": description,
            "image": image,
            "pubDate": _parse_pub_date(item.findtext("pubDate")),
            "source": source,
        })

    return articles


async def _fetch_feed(client: httpx.AsyncClient, feed: dict) -> list[dict]:
    try:
        response = await client.get(feed["url"], headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        return _parse_feed(response.text, feed["source"])
    except (httpx.HTTPError, ET.ParseError):
        return []


@router.get("", summary="Latest football news (BBC Sport + Sky Sports RSS)")
async def get_news():
    cache_key = "news|all"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    async with httpx.AsyncClient(timeout=10.0) as client:
        results = await asyncio.gather(*(_fetch_feed(client, feed) for feed in FEEDS))

    articles = [article for group in results for article in group]
    articles.sort(key=lambda a: a["pubDate"] or "", reverse=True)

    data = {"articles": articles, "count": len(articles)}
    cache.set(cache_key, data, ttl=600)
    return data
