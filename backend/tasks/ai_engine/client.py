import requests
from django.conf import settings

class LLMClient:
    def __init__(self):
        cfg = settings.AI_CONFIG
        self.provider = cfg.get("provider", "lmstudio")
        self.base_url = cfg.get("base_url")
        self.model = cfg.get("model")
        self.api_key = cfg.get("openai_api_key")

    def complete(self, prompt: str) -> str:
        if not self.model or not self.base_url:
            return ""
        headers = {"Content-Type": "application/json"}
        if self.provider == "openai" and self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        url = f"{self.base_url.rstrip('/')}/chat/completions"
        payload = {
            "model": self.model,
            "messages": [
                {"role":"system","content":"You are a helpful AI assistant for task management."},
                {"role":"user","content": prompt}
            ],
            "temperature": 0.2,
        }
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            return data.get("choices",[{}])[0].get("message",{}).get("content","").strip()
        except Exception:
            return ""
