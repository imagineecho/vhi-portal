import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  try {
    const { question, patientContext } = await request.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a clinical AI assistant embedded in a Vascular Health Intelligence portal for physicians. 
Answer concisely and clinically. Focus on actionable insights for the doctor.
Always note when something requires urgent attention.
Patient data: ${patientContext}`,
      messages: [{ role: 'user', content: question }]
    })

    return Response.json({ reply: message.content[0].text })
  } catch (error) {
    console.error('AI API error:', error)
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 })
  }
}
