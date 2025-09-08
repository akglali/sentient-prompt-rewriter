import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());              // loosen later if you want to lock origins
app.use(express.json());

const PORT = process.env.PORT || 8787;
const MODEL_ID = process.env.MODEL_ID || "accounts/fireworks/models/dobby-70b-instruct";
const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

app.post("/rewrite", async (req, res) => {
  try {
    const { text, tone = "clear, concise, direct" } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' string." });
    }
    const body = {
      model: MODEL_ID,
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        { role: "system", content: "Rewrite into a precise, compact, AI-ready prompt. Keep key details. Output only the rewritten prompt." },
        { role: "user", content: `Rewrite for ${tone} AI prompt quality:\n\n${text}` }
      ]
    };
    const r = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIREWORKS_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: "Upstream error", detail: data });
    }
    const rewritten = data?.choices?.[0]?.message?.content?.trim?.() || "";
    res.json({ rewritten });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`proxy listening on :${PORT}`));
