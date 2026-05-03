export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { messages, industry } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://rizflow.co",
          "X-Title": "RizFlow Demo",
        },
        body: JSON.stringify({
          // Primary: Llama 4 Maverick (fast, good quality)
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      },
    );

    if (!response.ok) {
      // Try fallback model if primary fails
      const errBody = await response.text();
      console.error("OpenRouter primary error:", response.status, errBody);

      // Fallback to Llama 4 Maverick
      const fallback = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://rizflow.co",
            "X-Title": "RizFlow Demo",
          },
          body: JSON.stringify({
            model: "google/gemma-3-27b-it:free",
            messages,
            max_tokens: 500,
            temperature: 0.7,
          }),
        },
      );

      if (!fallback.ok) {
        const fallbackErr = await fallback.text();
        console.error(
          "OpenRouter fallback error:",
          fallback.status,
          fallbackErr,
        );
        return res
          .status(502)
          .json({ error: "AI service temporarily unavailable" });
      }

      const fallbackData = await fallback.json();
      const reply =
        fallbackData.choices?.[0]?.message?.content ||
        "I apologize, I was unable to process that. Please try again.";
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({ reply, model: fallbackData.model });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I apologize, I was unable to process that. Please try again.";
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ reply, model: data.model });
  } catch (err) {
    console.error("Demo chat API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
