// api/generate.js
// Vercel serverless function (Node.js runtime) — proxies the Claude streaming API
// so the key never reaches the browser bundle.

import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end("Method not allowed");
    return;
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).end("Missing prompt");
    return;
  }

  if (prompt.length > 8000) {
    res.status(400).end("Prompt too long");
    return;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const messageStream = client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    messageStream.on("text", (chunk) => {
      res.write(chunk);
    });

    await messageStream.finalMessage();
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).end(err.message ?? "Internal server error");
    } else {
      res.end();
    }
  }
}
