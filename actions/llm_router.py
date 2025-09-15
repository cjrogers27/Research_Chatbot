# backend/actions/llm_router.py
# Offline stub: no external calls, no OpenAI. Safe for human-participant studies.

from pathlib import Path
from typing import List, Tuple, Dict, Any

def _read(path: str) -> str:
    p = Path(path)
    try:
        return p.read_text(encoding="utf-8")
    except Exception:
        return ""

def llm_answer(system_path: str, style_path: str, context_chunks: List[str], user_msg: str) -> Tuple[str, Dict[str, Any]]:
    """
    Deterministic, local-only responder that formats a reply from local prompt files.
    No external API calls. No personal data leaves the container.
    """
    system = _read(system_path).strip()
    style = _read(style_path).strip()
    context = "\n\n".join([c for c in context_chunks if c]).strip()

    # Very simple ruley output, predictable & safe
    pieces = []
    if system:
        pieces.append(f"[system]\n{system}")
    if style:
        pieces.append(f"[style]\n{style}")
    if context:
        pieces.append(f"[context]\n{context[:1200]}")  # cap to avoid noisy output
    pieces.append(f"[user]\n{user_msg}")
    pieces.append("[answer]\nI’ll keep responses concise and safety-oriented. Based on your message, here are next steps:\n"
                  "• I can provide general guidance and options.\n"
                  "• I won’t collect or store sensitive data beyond this chat.\n"
                  "• Tell me your state, budget range, and household size to tailor suggestions.")

    content = "\n\n".join(pieces)
    meta = {"model": "offline-stub", "temperature": 0.0, "top_p": 1.0, "attempt": 0}
    return content, meta
