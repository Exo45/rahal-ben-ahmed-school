import type { Config } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

const SYSTEM_PROMPT = `أنت المساعد الرقمي للثانوية الإعدادية "الرحال بن أحمد" بمدينة إنزكان، المغرب.

معلومات عن المؤسسة يمكنك الاستناد إليها:
- الاسم: الثانوية الإعدادية الرحال بن أحمد.
- العنوان: حي الرمل تاراست، إنزكان، المغرب.
- صفحة فيسبوك: https://www.facebook.com/profile.php?id=100085186013592
- الأنشطة الموازية المتوفرة للتسجيل هذا الموسم (2026/2027): المعلوميات، التربية التشكيلية، الروبوتيك والبرمجة، نادي التفتح العلمي، النادي الصحي، نادي القراءة، التكنولوجيا، السينما والفنون.
- يمكن للزوار مشاهدة صور المؤسسة في قسم "معرض الصور"، ومتابعة آخر الإعلانات في قسم "الإعلانات".
- لا يتوفر رقم هاتف على الموقع حالياً. إذا سُئلت عن رقم الهاتف، وجّه السائل للتواصل عبر صفحة فيسبوك المؤسسة أو بزيارتها مباشرة.

أجب دوماً بالعربية بأسلوب ودود وبسيط (يمكن استخدام الدارجة المغربية)، وبإجابات قصيرة ومباشرة (لا تتجاوز 4 أسطر). إذا كان السؤال خارج نطاق معلومات المؤسسة، أخبر السائل بلطف أنك مخصص للإجابة عن أسئلة تتعلق بالمؤسسة فقط.`

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let question = ''
  try {
    const body = await req.json()
    question = String(body?.question ?? '').slice(0, 500)
  } catch {
    return Response.json({ error: 'invalid request' }, { status: 400 })
  }

  if (!question.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 })
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    const answer =
      textBlock && 'text' in textBlock
        ? textBlock.text
        : 'سمح ليا، ما قدرت نجاوب دابا. حاول مرة أخرى.'

    return Response.json({ answer })
  } catch (error) {
    console.error('chat function error', error)
    return Response.json(
      { answer: 'سمح ليا، كاين مشكل تقني دابا. حاول مرة أخرى بعد قليل.' },
      { status: 200 },
    )
  }
}

export const config: Config = {
  path: '/api/chat',
}
