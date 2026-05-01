import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function aiComplete(req, res) {
  try {
    const { prompt, context } = req.body

    // SSE lets the client render tokens as they arrive instead of waiting for
    // the full completion, which can take several seconds on longer documents.
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1024,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'You are an AI writing assistant inside a document editor. Return only the text to insert — no explanations, no markdown code blocks, just clean prose.',
        },
        {
          role: 'user',
          content: `Command: ${prompt}\n\nDocument context:\n${context}`,
        },
      ],
    })

    // forward each token chunk to the client as it arrives from Groq
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || ''
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    // [DONE] signals the client reader loop to stop consuming the stream
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('aiComplete error:', error)
    res.status(500).json({ message: 'AI completion failed' })
  }
}
