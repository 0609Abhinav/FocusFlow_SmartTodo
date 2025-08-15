from __future__ import annotations
from datetime import date, timedelta
from collections import Counter
import re, math
from textblob import TextBlob
from .client import LLMClient

def _extract_keywords(text: str) -> list[str]:
    words = re.findall(r"[A-Za-z]{3,}", text.lower())
    stop = {"the","and","for","with","this","that","you","your","from","have","will","just","into","http","https"}
    return [w for w in words if w not in stop]

def _sentiment(text: str) -> float:
    try:
        return TextBlob(text).sentiment.polarity
    except Exception:
        return 0.0

def _heuristic_priority(task: dict, contexts: list[dict]) -> float:
    score = 0.0
    t = (task.get("title","") + " " + task.get("description","")).lower()
    for kw, pts in [
        ("urgent", 20), ("asap", 20), ("today", 15), ("tomorrow", 10),
        ("deadline", 12), ("report", 6), ("invoice", 6), ("fix", 5), ("bug", 8),
        ("client", 7), ("meeting", 6), ("submission", 10)
    ]:
        if kw in t: score += pts
    for c in contexts:
        ctext = c.get("content","").lower()
        if any(k in ctext for k in ["due", "deadline", "follow up", "reminder"]):
            score += 5
        if (s:=_sentiment(ctext))>0: score += s*2
    score += min(10, len(t)//60)
    return round(min(100.0, score), 2)

def _suggest_deadline(task: dict, current_load: int | None) -> date:
    base_days = 2
    words = len(_extract_keywords(task.get("description","")))
    complexity = min(8, max(0, words // 50))
    load = (current_load or 0)
    days = base_days + complexity + (load+4)//5
    return date.today() + timedelta(days=days)

def _suggest_category_and_tags(task: dict, contexts: list[dict]):
    text = (task.get("title","") + " " + task.get("description","") + " " + " ".join(c.get("content","") for c in contexts)).lower()
    categories = {
        "Work": ["client","meeting","report","email","deploy","bug","project","deadline","presentation"],
        "Personal": ["shopping","groceries","birthday","family","health","vacation","fitness","doctor"],
        "Finance": ["invoice","payment","budget","tax","salary","expense","reimburse"],
        "Learning": ["course","learn","study","read","assignment","tutorial","exam"]
    }
    chosen, best = None, 0
    for cat, kws in categories.items():
        score = sum(1 for k in kws if k in text)
        if score > best:
            best = score; chosen = cat
    tags = list({kw for kw in _extract_keywords(text) if kw not in {"task","todo","list"}})[:8]
    return chosen, tags

def _enhance_description(task: dict, contexts: list[dict], llm: LLMClient) -> str:
    base = task.get("description","").strip()
    context_snips = "\n".join(f"- [{c.get('source','misc')}] {c.get('content','')[:160]}" for c in contexts[:5])
    prompt = (
        "Enhance this task with context-aware details. Provide a concise paragraph (<=90 words).\n"
        f"Task title: {task.get('title','')}\n"
        f"Current description: {base}\n"
        f"Context snippets:\n{context_snips}\n"
        "Include: concrete next step, expected outcome, and dependencies if any."
    )
    ai = llm.complete(prompt)
    if ai: return ai
    return base + "\nNext step: Define the first actionable step based on context. Expected outcome: Clear deliverable."

def analyze_context(contexts: list[dict]) -> dict:
    all_text = " ".join(c.get("content","") for c in contexts)
    keys = _extract_keywords(all_text)
    freq = Counter(keys).most_common(10)
    sent = sum(_sentiment(c.get("content","")) for c in contexts) / max(1, len(contexts))
    return {"top_keywords": freq, "avg_sentiment": round(sent,2)}

def generate_suggestions(task: dict, contexts: list[dict], user_preferences: dict, current_load: int | None):
    llm = LLMClient()
    priority = _heuristic_priority(task, contexts)
    deadline = _suggest_deadline(task, current_load)
    category, tags = _suggest_category_and_tags(task, contexts)
    enhanced = _enhance_description(task, contexts, llm)
    ctx_insights = analyze_context(contexts)
    return {
        "priority_score": priority,
        "deadline_suggestion": deadline.isoformat(),
        "suggested_category": category,
        "suggested_tags": tags,
        "enhanced_description": enhanced,
        "context_insights": ctx_insights,
    }
def generate_context_suggestion(content: str, source: str = "context") -> str:
    """
    Generate a short actionable suggestion based on a single context entry.
    """
    llm = LLMClient()
    prompt = (
        f"Source: {source}\n"
        f"Context: {content}\n\n"
        "Give one short, clear, actionable suggestion based on this context. "
        "If no action is needed, say 'No action required'."
    )
    ai = llm.complete(prompt)
    return ai.strip() if ai else "No suggestion available."
