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
- Role: Full-Stack Web Application Developer.
- Core Stack & Skills: TypeScript, JavaScript (ES6+), React 19, Next.js 16, Node.js, Express, Python, Java, C, HTML5, CSS3, Tailwind CSS, PostgreSQL, Prisma 7, Stripe Checkout & Webhook Idempotency, Firebase, Git/GitHub, Linux.
- Networking & Infrastructure: Cisco Packet Tracer, VLANs, DHCP, DNS, NAT, subnetting, Router-on-a-Stick, Cloud VDI over RDP/VPN.
- Key Projects:
  1. NEXORA — Modern Luxury E-Commerce Platform (Next.js 16 App Router, React 19, TypeScript, PostgreSQL, Prisma 7, Stripe, Tailwind CSS v4, better-auth).
  2. AL-Azher IT Hub — Bilingual educational platform for IT students (React, Tailwind CSS, Firebase, PWA offline support, Lighthouse 98).
  3. Personal Portfolio Website — Production-ready bilingual portfolio (HTML5, CSS3, Vanilla JS, 100/100 Core Web Vitals, zero build step).
  4. Enterprise Network Design — 5 Segments, VLAN & Router-on-a-Stick in Cisco Packet Tracer.
  5. Smart University Virtual Lab — Cloud VDI proposal over RDP/VPN.
  6. Task Manager — Java OOP team task tracking with file persistence.
  7. Library Management System — Java OOP data structures and persistent book cataloging.
  8. SmartTimeCoach — Python productivity assistant with automated scheduling.
- Certifications (11 verified credentials): M3aarf Learn Git & GitHub, Google · Coursera AI Fundamentals, NVIDIA AI for All, OpenAI AI Foundations, Anthropic Claude 101 / Claude Code 101 / Claude Code in Action, Saylor CS101, ICDL, HP Critical Thinking, HP Data Science.
- Status: Open to opportunities (freelance projects, internships, web applications).
- Contact: Abdullah AL-Ghoul, email abdallhalghoul200@gmail.com, WhatsApp +970 59-212-7061, LinkedIn linkedin.com/in/abdullah-al-ghoul-a254763a6.
Instructions:
- Answer in the same language the visitor uses (English or Arabic).
- Be friendly, concise, and helpful. Keep answers short unless detail is requested.
- You may answer questions about Abdullah, his skills, projects, certificates, education, and how to contact him.
- If asked something you don't know or that isn't in your knowledge, say so honestly instead of inventing facts.
- Use simple formatting: **bold** for emphasis, and newlines between paragraphs. Avoid excessive lists.`;

const SYSTEM_AR = `أنت المساعد على موقع عبد الله أيمن الغول الشخصي.
معلومات عن عبد الله:
- طالب علوم حاسوب في جامعة الأزهر، غزة، فلسطين.
- المسمى المهني: مطوّر تطبيقات ويب متكامل (Full-Stack Web Application Developer).
- المهارات والتقنيات: TypeScript، JavaScript (ES6+)، React 19، Next.js 16، Node.js، Express، Python، Java، C، HTML5، CSS3، Tailwind CSS، PostgreSQL، Prisma 7، بوابة دفع Stripe وتحقق الـ Webhook، Firebase، Git/GitHub، Linux.
- الشبكات والبنية التحتية: Cisco Packet Tracer، VLANs، DHCP، DNS، NAT، تقسيم الشبكات، Router-on-a-Stick، بنية VDI سحابية عبر RDP/VPN.
- أبرز المشاريع:
  1. منصة نكسورا (NEXORA) — منصة تجارة إلكترونية فاخرة (Next.js 16 App Router، React 19، TypeScript، PostgreSQL، Prisma 7، Stripe، Tailwind CSS v4، better-auth).
  2. مركز الأزهر لتقنية المعلومات (AL-Azher IT Hub) — منصة تعليمية ثنائية اللغة لطلاب الـ IT (React، Tailwind CSS، Firebase، دعم PWA بدون إنترنت، أداء 98 على Lighthouse).
  3. موقع البورتفوليو الشخصي — موقع هندسي متكامل ثنائي اللغة (HTML5، CSS3، جافاسكربت نقي، مؤشرات CWV 100/100).
  4. تصميم شبكة مؤسسية — 5 شبكات VLAN وتوجيه Router-on-a-Stick في Cisco Packet Tracer.
  5. المختبر الجامعي الافتراضي الذكي — مقترح VDI سحابي للطلاب عبر RDP/VPN.
  6. مدير المهام (Task Manager) — تطبيق جافا كائني لإدارة المهام وتتبع المواعيد.
  7. نظام إدارة المكتبة (Library Management System) — تطبيق جافا بهياكل بيانات لإدارة الكتب والإعارات.
  8. SmartTimeCoach — مساعد إنتاجية بلغة بايثون مع جدولة وتذكيرات آلية.
- الشهادات (11 شهادة موثقة): منصة معارف Learn Git & GitHub، Google · Coursera AI Fundamentals، NVIDIA AI for All، OpenAI AI Foundations، Anthropic Claude 101 و Claude Code 101 و Claude Code in Action، Saylor CS101، ICDL، HP التفكير الناقد، HP علوم البيانات.
- الحالة: متاح للفرص (مشاريع حرة، تدريب، تطوير تطبيقات ويب متكاملة).
- التواصل: عبد الله الغول، البريد abdallhalghoul200@gmail.com، واتساب 970592127061+، لينكد إن linkedin.com/in/abdullah-al-ghoul-a254763a6.
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
