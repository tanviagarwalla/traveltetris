// api/photo.js
// Vercel serverless function (Node.js runtime) — proxies Pexels image search
// so the key never reaches the browser bundle.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).end("Method not allowed");
    return;
  }

  const { query } = req.query;

  if (!query) {
    res.status(400).end("Missing query param");
    return;
  }

  try {
    const pexelsRes = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );

    if (!pexelsRes.ok) {
      res.status(pexelsRes.status).end(`Pexels error: ${pexelsRes.statusText}`);
      return;
    }

    const data = await pexelsRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).end(err.message ?? "Internal server error");
  }
}
