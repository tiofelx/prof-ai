export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages, max_tokens = 4096 } = req.body;

  if (!messages || !system) {
    return res.status(400).json({ error: 'Missing system or messages' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'qwen/qwen3.6-plus:free',
        max_tokens,
        messages: [{ role: 'system', content: system }, ...messages],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(429).json({ error: data.error.message || 'Model rate limited', content: '' });
    }

    const raw = data.choices?.[0]?.message?.content || '';
    const clean = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    return res.status(200).json({ content: clean });
  } catch (err) {
    return res.status(500).json({ error: err.message, content: '' });
  }
}
