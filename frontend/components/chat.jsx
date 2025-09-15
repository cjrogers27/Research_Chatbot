// frontend/components/chat.jsx
import { useRef, useState } from "react";

// Resolve a stable participant ID to use as Rasa's `sender_id`.
// Priority: URL ?workerId / ?worker_id / ?assignmentId / ?assignment_id
// Fallback: localStorage("workerId") -> persisted
// Last resort: anon_XXXXXXXX
function resolveWorkerId() {
  try {
    // Guard SSR / non-browser environments
    if (typeof window === "undefined") {
      return "anon_srv";
    }
    const params = new URLSearchParams(window.location.search);
    const raw =
      params.get("workerId") ||
      params.get("worker_id") ||
      params.get("assignmentId") ||
      params.get("assignment_id");

    const sanitize = (s) =>
      String(s)
        .trim()
        .slice(0, 64)
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    if (raw) {
      const id = sanitize(raw);
      window.localStorage.setItem("workerId", id);
      return id;
    }
    const stored = window.localStorage.getItem("workerId");
    if (stored) return sanitize(stored);

    const anon = "anon_" + Math.random().toString(36).slice(2, 10);
    window.localStorage.setItem("workerId", anon);
    return anon;
  } catch {
    // Extremely defensive: if anything goes wrong, give them an anon ID.
    return "anon_" + Math.random().toString(36).slice(2, 10);
  }
}

export default function Chat({ placeholder = "Type a message…" }) {
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! Ask me something to get started." },
  ]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const inputRef = useRef(null);

  async function send() {
    const text = (inputRef.current?.value || "").trim();
    if (!text || busy) return;

    // show user message
    setMsgs((m) => [...m, { from: "user", text }]);
    inputRef.current.value = "";
    setBusy(true);
    setErr(null);

    // Resolve workerId at send-time (avoids SSR/window issues)
    const sender = resolveWorkerId();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender, // <-- becomes Rasa's sender_id in Postgres
          message: text,
          // optional metadata – safe to remove if you don’t use it on the backend
          metadata: { domain: "health", privacy: "on", literacy: "low" },
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`API ${res.status}: ${body}`);
      }

      // Rasa REST returns an ARRAY like: [{ text: "..." }, { image: "..." }, ...]
      const data = await res.json();
      const botText =
        Array.isArray(data) && data.length
          ? data
              .map((d) =>
                (d && (d.text || d.image || (typeof d === "string" ? d : ""))) ||
                ""
              )
              .filter(Boolean)
              .join("\n")
          : "(no reply)";

      setMsgs((m) => [...m, { from: "bot", text: botText }]);
    } catch (e) {
      console.error(e);
      setErr(e && e.message ? e.message : "Backend not reachable");
      setMsgs((m) => [
        ...m,
        { from: "bot", text: "Sorry—backend is unreachable." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12, maxWidth: 640 }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
        Chat status: {busy ? "thinking…" : "ready"}
      </div>

      <div
        style={{
          height: 320,
          overflowY: "auto",
          padding: 8,
          background: "#fafafa",
          borderRadius: 4,
          marginBottom: 8,
        }}
      >
        {msgs.map((m, i) => (
          <div key={i} style={{ margin: "6px 0", textAlign: m.from === "user" ? "right" : "left" }}>
            <span
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 6,
                background: m.from === "user" ? "#e6f0ff" : "#eef7ea",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {err && <div style={{ color: "red", fontSize: 12, marginBottom: 8 }}>Error: {err}</div>}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          onKeyDown={onKey}
          placeholder={placeholder}
          style={{ flex: 1, padding: "8px 10px", border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button onClick={send} disabled={busy} style={{ padding: "8px 12px" }}>
          Send
        </button>
      </div>
    </div>
