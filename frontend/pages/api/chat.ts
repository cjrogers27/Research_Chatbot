// frontend/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

type ChatPayload = {
  sender?: string;
  message?: string;
  // Allow extra metadata without blowing up:
  [k: string]: any;
};

// Important: use service name "rasa" so it resolves inside Docker
const RASA_BASE = process.env.RASA_BASE_URL || "http://rasa:5005";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sender, ...rest } = (req.body ?? {}) as ChatPayload;

    const r = await fetch(`${RASA_BASE}/webhooks/rest/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: sender || "web-user",
        message: message || "",
        metadata: rest?.metadata ?? rest,
      }),
    });

    // Rasa REST returns an array of messages (objects with "text", etc.)
    const data = await r.json().catch(() => []);
    const safe = Array.isArray(data) ? data : [];
    return res.status(200).json(safe);
  } catch (err) {
    console.error("Rasa proxy failed:", err);
    return res.status(200).json([{ text: "Backend is not reachable right now." }]);
  }
}
