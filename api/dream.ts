import { Redis } from '@upstash/redis'
import { OpenAIStream, OpenAIStreamPayload } from './_OpenAIStream'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export const config = {
  runtime: "edge"
}

export default async (req: Request): Promise<Response> => {
  console.log('/api/dream')
  
  const ip = req.headers.get('x-forwarded-for')
  const key = `${ip}`
  const prompt = await req.text()

  // const cookie = req.headers.get('cookie')?.match(/n=\d+/)?.[0]
  // const cookieUses = cookie?.replace('n=', '') || 0
  console.info({
    ip,
    prompt,
    // cookieUses
  })

  if (!prompt || prompt.length < 2 || prompt.length > 700) {
    return new Response(null, { status: 403 })
  }

  const uses = await redis.get(key) as number
  console.log('count: ', uses)

  if ((uses && uses >= 2 ) /* || <number>cookieUses >= 2 */) {
    return new Response(null, {
      status: 429
    })
  }

  await redis.incr(key)
  await redis.expire(key, 3 * 60 * 60) // Expire in 3 hours

  // return new Response() // for test

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {'role': 'system', 'content': 'You can interpret human dreams, figure out what the following dream could mean.'},
      {'role': 'user', "content": prompt}
    ],
    temperature: 0.2,
    max_tokens: 1000,
    stream: true
  }

  const stream = await OpenAIStream(payload)
  console.log('returned a stream response! -----------------------')

  return new Response(stream)

  // res.setHeader('Set-Cookie', 'n=0; Path=/; HttpOnly')
}
