export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages, max_tokens = 1024, temperature = 0.7 } = req.body;

  if (!messages || !system) {
    return res.status(400).json({ error: 'Missing system or messages' });
  }

  try {
    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
    const reqBody = {
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      max_tokens,
      messages: [
        { role: 'system', content: system },
        ...messages
      ],
      temperature: Number(temperature),
    };

    let response = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(reqBody),
    });

    // SISTEMA DE FALLBACK INVISÍVEL PARA DRIBLAR RATE LIMIT (429)
    if (response.status === 429) {
      reqBody.model = 'llama3-8b-8192';
      response = await fetch(groqUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }, body: JSON.stringify(reqBody) });
      
      if (response.status === 429) {
        reqBody.model = 'gemma2-9b-it';
        response = await fetch(groqUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }, body: JSON.stringify(reqBody) });
      }
    }

    const data = await response.json();

    if (data.error) {
      console.error('Groq API Error:', data.error);
      return res.status(429).json({ 
        error: data.error.message || 'API Error', 
        content: '' 
      });
    }

    const content = data.choices?.[0]?.message?.content || '';
    
    // Remove thinking tags se existirem (para modelos de raciocínio)
    const clean = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    return res.status(200).json({ content: clean });
    
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ 
      error: 'Erro interno do servidor', 
      content: '' 
    });
  }
}