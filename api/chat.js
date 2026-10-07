/*
 * Vercel serverless function — POST /api/chat
 *
 * Bridges the portfolio's rule-based assistant to an OpenAI-compatible API.
 * Configure via environment variables in Vercel project settings:
 *
 *   LLM_API_KEY  — required to enable live answers; without it the frontend
 *                  silently falls back to the built-in client-side rules.
 *   LLM_API_URL  — OpenAI-compatible endpoint (default: OpenAI chat completions).
 *   LLM_MODEL    — model id (default: gpt-4o-mini).
 *
 * The endpoint always returns 200 with { fallback: true } on any failure so the
 * frontend can degrade gracefully and never shows an error to the visitor.
 */

const SYSTEM_EN = `You are the assistant on Abdullah Ayman AL-Ghoul's personal portfolio website.
Facts about Abdullah:
- Computer Science student at Al-Azhar University, Gaza, Palestine.
- Interested in: Software Engineering, Web Development, Networking & IT Infrastructure, and Artificial Intelligence.
- Skills: Programming (Python, C, JavaScript, HTML/CSS), Networking & Infra (Cisco Packet Tracer, VLANs, DHCP, DNS, NAT, subnetting, Router-on-a-Stick), Tools & Platforms (Git/GitHub, Linux, VS Code), Currently learning: Data Structures & Algorithms, Machine Learning, Cloud.
- Projects: a bilingual portfolio website (this site, HTML/CSS/vanilla JS), an Enterprise Network Design (VLAN/DHCP/DNS/NAT in Cisco Packet Tracer), a Smart University Virtual Lab proposal, and more.
- Certifications: M3aarf Learn Git & GitHub, Google · Coursera AI Fundamentals, NVIDIA AI for All, OpenAI AI Foundations, Anthropic Claude 101 / Claude Code 101 / Claude Code in Action, Saylor CS101, ICDL, HP Critical Thinking, HP Data Science.
- Contact: Abdullah AL-Ghoul, email abdallhalghoul200@gmail.com.
Instructions:
- Answer in the same language the visitor uses (English or Arabic).
- Be friendly, concise, and helpful. Keep answers short unless detail is requested.
- You may answer questions about Abdullah, his skills, projects, certificates, education, and how to contact him.
- If asked something you don't know or that isn't in your knowledge, say so honestly instead of inventing facts.
- Use simple formatting: **bold** for emphasis, and newlines between paragraphs. Avoid excessive lists.`;

const SYSTEM_AR = `أنت المساعد على موقع عبد الله أيمن الغول الشخصي.
معلومات عن عبد الله:
- طالب علوم حاسوب في جامعة الأزهر، غزة، فلسطين.
- اهتماماته: هندسة البرمجيات، تطوير الويب، الشبكات والبنية التحتية، والذكاء الاصطناعي.
- المهارات: البرمجة (بايثون، C، جافاسكربت، HTML/CSS)، الشبكات والبنية التحتية (Cisco Packet Tracer، VLAN، DHCP، DNS، NAT، تقسيم الشبكات، Router-on-a-Stick)، الأدوات والمنصات (Git/GitHub، لينكس، VS Code)، يدرس حالياً: هياكل البيانات والخوارزميات، تعلّم الآلة، السحابة.
- المشاريع: موقع شخصي ثنائي اللغة (هذا الموقع، HTML/CSS/جافاسكربت خالص)، تصميم شبكة مؤسسات (VLAN/DHCP/DNS/NAT في Cisco Packet Tracer)، مقترح مختبر جامعي ذكي افتراضي، وغيرها.
- الشهادات: منصة معارف Learn Git & GitHub، Google · Coursera AI Fundamentals، NVIDIA AI for All، OpenAI AI Foundations، Anthropic Claude 101 و Claude Code 101 و Claude Code in Action، Saylor CS101، ICDL، HP التفكير الناقد، HP علوم البيانات.
- التواصل: عبد الله الغول، البريد abdallhalghoul200@gmail.com.
التعليمات:
- أجب بنفس لغة الزائر (عربية أو إنجليزية).
- كن ودوداً وموجزاً ومفيداً. أبقِ الإجابات قصيرة إلا إذا طُلب التفصيل.
- يمكنك الإجابة عن أسئلة تخص عبد الله ومهاراته ومشاريعه وشهاداته وتعليمه وطرق التواصل معه.
- إذا سُئلت عن شيء لا تعرفه، قُل ذلك بصراحة بدلاً من اختلاق معلومات.
- استخدم تنسيقاً بسيطاً: **عريض** للتأكيد، وأسطر جديدة بين الفقرات، وتجنّب القوائم المفرطة.`;

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ fallback: true });
  }

  let message = '';
  let lang = 'en';
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    message = String(body.message || '').trim();
    lang = body.lang === 'ar' ? 'ar' : 'en';
  } catch (e) { /* malformed body */ }

  if (!message || message.length > 1000) {
    return res.status(400).json({ fallback: true });
  }

  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '';
  if (!apiKey) {
    // No key configured — tell the frontend to use built-in rules.
    return res.status(200).json({ fallback: true });
  }

  const apiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  try {
    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 420,
        messages: [
          { role: 'system', content: lang === 'ar' ? SYSTEM_AR : SYSTEM_EN },
          { role: 'user', content: message }
        ]
      })
    });

    if (!upstream.ok) {
      return res.status(200).json({ fallback: true });
    }

    const data = await upstream.json();
    const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text || !String(text).trim()) {
      return res.status(200).json({ fallback: true });
    }

    return res.status(200).json({ fallback: false, text: String(text).trim() });
  } catch (e) {
    return res.status(200).json({ fallback: true });
  }
};
