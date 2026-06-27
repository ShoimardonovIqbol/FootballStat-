import hashlib
import json
import os
import time
from typing import Any, Optional

_CACHE_DIR = os.path.join(os.path.dirname(__file__), '.cache')
os.makedirs(_CACHE_DIR, exist_ok=True)


class FileCache:
    """Persistent file-based cache — survives server restarts."""

    def __init__(self, default_ttl: int = 300) -> None:
        self.default_ttl = default_ttl

    def _path(self, key: str) -> str:
        h = hashlib.md5(key.encode()).hexdigest()
        return os.path.join(_CACHE_DIR, f"{h}.json")

    def get(self, key: str) -> Optional[Any]:
        path = self._path(key)
        if not os.path.exists(path):
            return None
        try:
            with open(path, 'r', encoding='utf-8') as f:
                entry = json.load(f)
            if time.time() > entry['expires_at']:
                try:
                    os.remove(path)
                except OSError:
                    pass
                return None
            return entry['value']
        except Exception:
            return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        path = self._path(key)
        entry = {
            'value': value,
            'expires_at': time.time() + (ttl if ttl is not None else self.default_ttl),
        }
        try:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(entry, f, ensure_ascii=False)
        except Exception:
            pass

    def delete(self, key: str) -> None:
        try:
            os.remove(self._path(key))
        except OSError:
            pass

    def clear(self) -> None:
        for fname in os.listdir(_CACHE_DIR):
            if fname.endswith('.json'):
                try:
                    os.remove(os.path.join(_CACHE_DIR, fname))
                except OSError:
                    pass

    def stats(self) -> dict[str, int]:
        now = time.time()
        total = active = 0
        for fname in os.listdir(_CACHE_DIR):
            if fname.endswith('.json'):
                total += 1
                try:
                    with open(os.path.join(_CACHE_DIR, fname), 'r') as f:
                        entry = json.load(f)
                    if entry['expires_at'] > now:
                        active += 1
                except Exception:
                    pass
        return {'total_entries': total, 'active_entries': active}


cache = FileCache(default_ttl=300)
