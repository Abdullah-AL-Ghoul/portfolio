/* ============================================
   Abdullah AL-Ghoul · Portfolio
   i18n + Theme + Premium UX Interactions
   ============================================ */

/* Lightweight icon runtime for the inline SVG sprite in index.html.
   Renders <i data-lucide="name"> as <i data-icon="name"><svg class="lucide"><use href="#i-name"/></svg></i>.
   Keeping the <i> wrapper means every existing `X i { width/height }` sizing
   rule keeps applying, and the svg inherits its box via svg.lucide rules.
   Re-running createIcons() refreshes any i[data-icon] whose value changed
   (theme toggle, mobile menu, mic/speaker buttons). */
(function () {
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function renderPlaceholder(el) {
    var name = el.getAttribute('data-lucide');
    if (!name) return;
    el.setAttribute('data-icon', name);
    el.removeAttribute('data-lucide');
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'lucide');
    // Intrinsic 24×24 + stroke attrs, mirroring lucide's own output.
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    el.textContent = '';
    el.appendChild(svg);
  }
  window.lucide = {
    createIcons: function () {
      Array.prototype.forEach.call(document.querySelectorAll('i[data-lucide]'), renderPlaceholder);
      Array.prototype.forEach.call(document.querySelectorAll('i[data-icon]'), function (el) {
        var use = el.querySelector('use');
        var name = el.getAttribute('data-icon');
        if (use && name && use.getAttribute('href') !== '#i-' + name) {
          use.setAttribute('href', '#i-' + name);
        }
      });
    }
  };
})();

(function () {
  'use strict';

  // ============== Constants ==============
  const SCROLL_THRESHOLD = 600;
  const NAV_SCROLL_THRESHOLD = 10;
  const STAGGER_DELAY_MS = 150;
  const ITEM_STAGGER_DELAY_MS = 200;
  const COUNTER_DURATION_MS = 1200;
  const TOAST_DURATION_MS = 5000;
  const TYPED_TYPE_MS = 80;
  const TYPED_DELETE_MS = 40;
  const TYPED_PAUSE_MS = 1600;
  // Mailto fallback (always works). Set to a real Formspree endpoint to enable direct submission.
  const FORMSPREE_ENDPOINT = '';
  const CONTACT_EMAIL = 'abdallhalghoul200@gmail.com';

  // Maps each certificate asset to its i18n key prefix ('certs.c1' etc.) so the
  // cert modal can show localized titles/orgs.
  const CERT_INDEX = {
    'assets/certs/google-ai-fundamentals.jpg': 'certs.c10',
    'assets/certs/fa03448a.jpg': 'certs.c11',
    'assets/certs/nvidia-ai.jpg': 'certs.c1',
    'assets/certs/openai-ai-foundations.jpg': 'certs.c2',
    'assets/certs/anthropic-claude101.png': 'certs.c3',
    'assets/certs/anthropic-claude-code-101.png': 'certs.c8',
    'assets/certs/claude-code-in-action.jpg': 'certs.c9',
    'assets/certs/saylor-cs101.jpg': 'certs.c4',
    'assets/certs/icdl.jpg': 'certs.c5',
    'assets/certs/hp-critical-thinking.jpg': 'certs.c6',
    'assets/certs/hp-data-science.jpg': 'certs.c7'
  };

  // Phrases the hero rotating-typed animation cycles through, per language.
  const TYPED_PHRASES = {
    en: [
      'Aspiring Software Engineer',
      'Network & Infrastructure',
      'AI Enthusiast',
      'Cybersecurity Curious',
      'Lifelong Learner'
    ],
    ar: [
      'مهندس برمجيات طموح',
      'شبكات وبنية تحتية',
      'شغوف بالذكاء الاصطناعي',
      'مهتم بالأمن السيبراني',
      'متعلم مدى الحياة'
    ]
  };

  // ============== Translations ==============
  const i18n = {
    en: {
      'meta.title': "Abdullah Ayman AL-Ghoul · Computer Science Student",
      'meta.desc': "Portfolio of Abdullah Ayman AL-Ghoul — Computer Science student at Al-Azhar University interested in software engineering, networking, and AI.",

      'brand': 'Abdullah',

      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.certs': 'Certifications',
      'nav.exp': 'Experience',
      'nav.experience': 'Experience',
      'nav.feedback': 'Feedback',
      'nav.contact': 'Contact',
      'nav.lang': 'Switch language',

      'hero.status': 'Open to opportunities',
      'hero.greet': "Hi, I'm",
      'hero.role': 'Computer Science Student',
      'hero.desc': "CS student at Al-Azhar University, passionate about software engineering, networking, and emerging technologies. I build practical solutions and never stop learning.",
      'hero.cta1': 'View Projects',
      'hero.cta2': 'Contact Me',
      'hero.cta3': 'Download CV',
      'hero.loc': 'Gaza, Palestine',
      'hero.uni': 'Al-Azhar University',

      'stats.certs': 'Certifications',
      'stats.years': 'Years Learning',
      'stats.projects': 'Projects',
      'stats.recs': 'Recommendation Letters',

      'about.eyebrow': '01 · About',
      'about.title': 'Who am I?',
      'about.p1': "I'm Abdullah Al-Ghoul, a Computer Science student who believes technology is one of the most powerful tools for solving real-world problems. I enjoy learning, experimenting, and building practical solutions that combine logic, creativity, and innovation.",
      'about.p2': 'My interests span software engineering, networking, cybersecurity, and artificial intelligence. I constantly seek opportunities to improve my skills, explore new concepts, and contribute to meaningful technical projects.',
      'about.p3': 'My long-term goal is to become a highly skilled Software Engineer with strong foundations in networking, cybersecurity, and modern software development practices.',
      'about.edu': 'Education',
      'about.school': 'B.Sc. Computer Science · Al-Azhar University',
      'about.year': '2023 – 2027/2028 (expected)',
      'about.loc': 'Location',
      'about.city': 'Gaza, Palestine',
      'about.langs': 'Languages',
      'about.ar': 'Arabic — Native',
      'about.en': 'English — Professional',
      'about.focus': 'Focus Areas',
      'about.focusv': 'Software · Networks · Security · AI',
      'about.s1': 'Problem Solving',
      'about.s2': 'Teamwork',
      'about.s3': 'Communication',
      'about.s4': 'Self-Learning',
      'about.s5': 'Critical Thinking',
      'about.s6': 'Public Speaking',

      'skills.eyebrow': '02 · Skills',
      'skills.title': 'Tech Stack',
      'skills.prog': 'Programming',
      'skills.net': 'Networking & Infra',
      'skills.tools': 'Tools & Platforms',
      'skills.meta.prog': '4 technologies',
      'skills.meta.net': '4 areas',
      'skills.meta.tools': '4 tools',
      'tier.expert': 'Expert',
      'tier.advanced': 'Advanced',
      'tier.intermediate': 'Intermediate',
      'skills.cur': 'Currently Learning',
      'skills.l1': 'Frontend Development',
      'skills.l2': 'Java OOP',
      'skills.l3': 'Data Structures',
      'skills.l4': 'Algorithms',
      'skills.l5': 'Software Engineering Principles',


      'proj.eyebrow': '03 · Projects',
      'proj.title': 'Featured Projects',
      'proj.p1tag': 'Live · This Site',
      'proj.p1t': 'Personal Portfolio Website',
      'proj.p1d': 'A responsive, modern, bilingual portfolio showcasing my skills, projects, and educational milestones. Built with semantic HTML, modern CSS, and vanilla JavaScript. Includes dark/light theme and full RTL support.',
      'proj.live': 'Live Site',
      'proj.case': 'Case Study',
      'proj.problem': 'The Problem',
      'proj.solution': 'The Solution',
      'proj.result': 'Result',
      'proj.nolinks': 'Details available on request.',
      'proj.p2tag': 'Completed',
      'proj.p2t': 'Enterprise Network Design',
      'proj.p2d': 'Designed and implemented a segmented business network using VLANs, DHCP, DNS, NAT, subnetting, and Router-on-a-Stick architecture in Cisco Packet Tracer.',
      'proj.diagram': 'Project Diagram',
      'proj.p3tag': 'Concept Proposal',
      'proj.p3t': 'Smart University Virtual Lab',
      'proj.p3d': 'Proposed cloud-based virtual desktop infrastructure enabling university students to access a full Windows workstation from mobile devices via RDP. Designed to help students without personal computers access programming environments remotely.',
      'proj.p3status': 'Proposal / future implementation',

      'proj.p4tag': 'Live',
      'proj.p4t': 'AL-Azher IT Hub',
      'proj.p4d': 'Bilingual educational platform for Al-Azhar University IT students — lectures, resources, and study materials, built with React, Tailwind CSS, and Firebase with PWA support for offline access.',

      'proj.p5tag': 'Team Project',
      'proj.p5t': 'Task Manager',
      'proj.p5d': 'Team task management application for organizing and tracking shared tasks with colleagues. Features task creation, assignment, status tracking, and deadline management.',

      'proj.p6tag': 'Completed',
      'proj.p6t': 'Library Management System',
      'proj.p6d': 'Java-based library management system for managing books, borrowers, and lending operations. Includes add, search, borrow, return functionality with data persistence.',

      'proj.p7tag': 'Personal Project',
      'proj.p7t': 'SmartTimeCoach',
      'proj.p7d': 'Python productivity assistant with automated reminders that helps manage tasks and study schedules more effectively.',

      'certs.eyebrow': '04 · Certifications',
      'certs.title': 'Verified Credentials',
      'certs.view': 'View certificate',
      'certs.download': 'Download',
      'certs.noimage': 'Certificate image not uploaded yet.',
      'certs.noimageHint': 'Drop the file into assets/certs/ and reload.',

      'exp.eyebrow': '05 · Experience',
      'exp.title': 'Experience & Milestones',
      'exp.techh': 'Technical Experience',
      'exp.milestone': 'Milestones',
      'exp.t1': 'Networking & IT Support Projects',
      'exp.t1per': '2023 – Present',
      'exp.t1a': 'LAN design & IP addressing plans',
      'exp.t1b': 'Router, DHCP, DNS, NAT configuration',
      'exp.t1c': 'Connectivity troubleshooting',
      'exp.t1d': 'Technical documentation & flowcharts',
      'exp.t1e': 'Community technical support',

      'exp.m1': '2026 · NVIDIA AI Certification',
      'exp.m1sub': 'Generative AI · NVIDIA Academy',
'exp.m1b': '2026 · OpenAI & Anthropic AI Tracks',
'exp.m1bsub': 'AI Foundations · Claude 101 · Claude Code 101 · Claude Code in Action',
      'exp.m2': '2025 · ICDL Certification',
      'exp.m2sub': 'Edraak · Word, Excel, Internet Security',
      'exp.m3': '2024 · Networking Projects',
      'exp.m3sub': 'VLAN, DHCP/NAT segments',
      'exp.m4': '2023 · CS Journey Begins',
      'exp.m4sub': 'Al-Azhar University',

      'test.eyebrow': '06 · Feedback',
      'test.title': 'Recommendations',
      'test.q1': '"Abdullah is one of the most passionate students I have taught. He demonstrates strong collaboration, presentation, time management, and problem-solving skills."',
      'test.n1': 'Mr. Abdelbaset R. Almasri',
      'test.r1': 'Lecturer of Computer Science · Al-Azhar University',
      'test.q2': '"Abdullah has been a remarkable student and an asset to our university. He is hardworking, reliable, and works exceptionally well in teams."',
      'test.n2': 'Dr. Adel A. Ahmed',
      'test.r2': 'Lecturer of Computer Science · Al-Azhar University',
      'test.q3': '"Abdullah is an exceptional team member who is collaborative, reliable, and a natural problem solver. A dedicated self-learner and a strong communicator who always elevates the quality of our projects."',
      'test.n3': 'Yazan W. Abo_Elqomboz',
      'test.r3': 'Project Team Member',

      'contact.eyebrow': '07 · Contact',
      'contact.title': "Let's Connect",
      'contact.desc': 'Have an opportunity, scholarship, or a project to discuss? I would love to hear from you.',
      'contact.avail': 'Replies within 24 hours',
      'contact.loc': 'Gaza, Palestine',

      'certs.badge': 'Verified',
      'certs.c1t': 'AI for All: From Basics to GenAI Practice',
      'certs.c1o': 'NVIDIA Academy',
      'certs.c1d': 'Mar 2026',
      'certs.c2t': 'AI Foundations',
      'certs.c2o': 'OpenAI Academy',
      'certs.c2d': 'Jul 2026',
      'certs.c3t': 'Claude 101',
      'certs.c3o': 'Anthropic',
      'certs.c3d': 'Jul 2026',
      'certs.c4t': 'CS101: Introduction to Programming I',
      'certs.c4o': 'Saylor Academy',
      'certs.c4d': 'Jan 2026',
      'certs.c5t': 'ICDL Base Certification',
      'certs.c5o': 'Edraak',
      'certs.c5d': 'Jan 2026',
      'certs.c6t': 'Critical Thinking in the Age of AI',
      'certs.c6o': 'HP LIFE',
      'certs.c6d': '2025',
      'certs.c7t': 'Data Science & Analytics',
      'certs.c7o': 'HP LIFE',
      'certs.c7d': '2025',
      'certs.c8t': 'Claude Code 101',
      'certs.c8o': 'Anthropic',
      'certs.c8d': 'Aug 2026',
      'certs.c9t': 'Claude Code in Action',
      'certs.c9o': 'Anthropic · Coursera',
      'certs.c9d': 'Aug 2026',
      'certs.c10t': 'AI Fundamentals',
      'certs.c10o': 'Google · Coursera',
      'certs.c10d': 'Aug 2026',
      'certs.c11t': 'Learn Git & GitHub',
      'certs.c11o': 'M3aarf Platform',
      'certs.c11d': 'Aug 2026',

      'form.name': 'Name',
      'form.email': 'Email',
      'form.subject': 'Subject',
      'form.message': 'Message',
      'form.send': 'Send Message',
      'form.sending': 'Opening email client…',
      'form.mailto': 'Your email client should now be open. Hit send to deliver the message.',
      'form.success': 'Thanks! Your message is on its way.',
      'form.error': 'Please fill in all fields with a valid email.',

      'recs.verified': 'Verified Recommendation',
      'recs.open': 'View recommendation',

      'footer.tag': 'Building with curiosity, learning with intent.',
      'footer.rights': 'All rights reserved',

      'preloader.loading': 'Loading portfolio…',

      'theme.label': 'Theme',
      'theme.dark': 'Dark',
      'theme.light': 'Light',
      'theme.cyberpunk': 'Cyberpunk',
      'theme.forest': 'Forest',
      'theme.sunset': 'Sunset',

      'ai.title': 'Portfolio Assistant',
      'ai.status': 'Online · ready to help',
      'ai.input': 'Ask the assistant',
      'ai.placeholder': 'Ask me anything about Abdullah’s work…',
      'ai.voice': 'Use voice input',
      'ai.speak': 'Read reply aloud',
      'ai.clear': 'Clear conversation',
      'ai.minimize': 'Minimize',
      'ai.send': 'Send message',
      'ai.suggest': 'Suggested questions'
    },

    ar: {
      'meta.title': 'عبدالله أيمن الغول · طالب علوم حاسوب',
      'meta.desc': 'موقع عبدالله أيمن الغول — طالب علوم حاسوب في جامعة الأزهر، مهتم بهندسة البرمجيات والشبكات والذكاء الاصطناعي.',

      'brand': 'عبدالله',

      'nav.home': 'الرئيسية',
      'nav.about': 'نبذة',
      'nav.skills': 'المهارات',
      'nav.projects': 'المشاريع',
      'nav.certs': 'الشهادات',
      'nav.exp': 'الخبرة',
      'nav.experience': 'الخبرة',
      'nav.feedback': 'التوصيات',
      'nav.contact': 'تواصل',
      'nav.lang': 'تبديل اللغة',

      'hero.status': 'متاح للفرص',
      'hero.greet': 'مرحبًا، أنا',
      'hero.role': 'طالب علوم حاسوب',
      'hero.desc': 'طالب علوم حاسوب في جامعة الأزهر، شغوف بهندسة البرمجيات والشبكات والتقنيات الناشئة. أبني حلولًا عملية ولا أتوقف عن التعلم.',
      'hero.cta1': 'شاهد المشاريع',
      'hero.cta2': 'تواصل معي',
      'hero.cta3': 'تحميل السيرة',
      'hero.loc': 'غزة، فلسطين',
      'hero.uni': 'جامعة الأزهر',

      'stats.certs': 'شهادة',
      'stats.years': 'سنوات تعلم',
      'stats.projects': 'مشاريع',
      'stats.recs': 'خطابات توصية',

      'about.eyebrow': '01 · نبذة',
      'about.title': 'من أنا؟',
      'about.p1': 'أنا عبدالله الغول، طالب علوم حاسوب أؤمن بأن التكنولوجيا من أقوى الأدوات لحل المشكلات الواقعية. أستمتع بالتعلم والتجريب وبناء حلول عملية تجمع بين المنطق والإبداع والابتكار.',
      'about.p2': 'تمتد اهتماماتي عبر هندسة البرمجيات والشبكات والأمن السيبراني والذكاء الاصطناعي. أسعى باستمرار لتحسين مهاراتي واستكشاف مفاهيم جديدة والمساهمة في مشاريع تقنية ذات أثر.',
      'about.p3': 'هدفي على المدى البعيد أن أصبح مهندس برمجيات متمكنًا بأساسيات قوية في الشبكات والأمن السيبراني وممارسات تطوير البرمجيات الحديثة.',
      'about.edu': 'التعليم',
      'about.school': 'بكالوريوس علوم الحاسوب · جامعة الأزهر',
      'about.year': '2023 – 2027/2028 (متوقع)',
      'about.loc': 'الموقع',
      'about.city': 'غزة، فلسطين',
      'about.langs': 'اللغات',
      'about.ar': 'العربية — لغة أم',
      'about.en': 'الإنجليزية — مستوى مهني',
      'about.focus': 'مجالات التركيز',
      'about.focusv': 'برمجيات · شبكات · أمن · ذكاء اصطناعي',
      'about.s1': 'حل المشكلات',
      'about.s2': 'العمل الجماعي',
      'about.s3': 'التواصل',
      'about.s4': 'التعلم الذاتي',
      'about.s5': 'التفكير النقدي',
      'about.s6': 'التحدث أمام الجمهور',

      'skills.eyebrow': '02 · المهارات',
      'skills.title': 'الحزمة التقنية',
      'skills.prog': 'البرمجة',
      'skills.net': 'الشبكات والبنية التحتية',
      'skills.tools': 'الأدوات والمنصات',
      'skills.meta.prog': '4 تقنيات',
      'skills.meta.net': '4 مجالات',
      'skills.meta.tools': '4 أدوات',
      'tier.expert': 'خبير',
      'tier.advanced': 'متقدم',
      'tier.intermediate': 'متوسط',
      'skills.cur': 'أدرس حاليًا',
      'skills.l1': 'تطوير الواجهات',
      'skills.l2': 'البرمجة الكائنية بـ Java',
      'skills.l3': 'هياكل البيانات',
      'skills.l4': 'الخوارزميات',
      'skills.l5': 'مبادئ هندسة البرمجيات',


      'proj.eyebrow': '03 · المشاريع',
      'proj.title': 'مشاريع مختارة',
      'proj.p1tag': 'مباشر · هذا الموقع',
      'proj.p1t': 'موقع التعريف الشخصي',
      'proj.p1d': 'موقع شخصي متجاوب وحديث وثنائي اللغة يعرض مهاراتي ومشاريعي وإنجازاتي التعليمية. مبني بـ HTML دلالي وCSS حديث وJavaScript نقي — بدون أي تبعيات خارجية. يتضمن وضع داكن/فاتح ودعم كامل للعربية.',
      'proj.live': 'الموقع مباشر',
      'proj.case': 'دراسة الحالة',
      'proj.problem': 'المشكلة',
      'proj.solution': 'الحل',
      'proj.result': 'النتيجة',
      'proj.nolinks': 'التفاصيل متاحة عند الطلب.',
      'proj.p2tag': 'مكتمل',
      'proj.p2t': 'تصميم شبكة مؤسسية',
      'proj.p2d': 'صممت ونفذت شبكة أعمال مقسّمة باستخدام VLANs وDHCP وDNS وNAT والعنونة الفرعية ومعمارية Router-on-a-Stick داخل Cisco Packet Tracer.',
      'proj.diagram': 'مخطط المشروع',
      'proj.p3tag': 'مقترح',
      'proj.p3t': 'المختبر الجامعي الافتراضي الذكي',
      'proj.p3d': 'مقترح لبنية سطح مكتب افتراضي سحابية تتيح لطلاب الجامعة الوصول إلى محطة عمل ويندوز كاملة من أجهزتهم المحمولة عبر RDP. صُمم لمساعدة الطلاب الذين لا يمتلكون أجهزة حاسوب شخصية.',
      'proj.p3status': 'مقترح / تنفيذ مستقبلي',

      'proj.p4tag': 'مباشر',
      'proj.p4t': 'AL-Azher IT Hub',
      'proj.p4d': 'منصة تعليمية ثنائية اللغة لطلبة تكنولوجيا المعلومات في جامعة الأزهر — محاضرات وموارد ومواد دراسية، مبنية بـ React وTailwind CSS وFirebase مع دعم PWA للوصول بدون إنترنت.',

      'proj.p5tag': 'مشروع جماعي',
      'proj.p5t': 'مدير المهام',
      'proj.p5d': 'تطبيق لإدارة المهام الجماعية مع الزملاء — يتضمن إنشاء المهام وتعيينها وتتبع حالتها وإدارة المواعيد النهائية.',

      'proj.p6tag': 'مكتمل',
      'proj.p6t': 'نظام إدارة المكتبة',
      'proj.p6d': 'نظام إدارة مكتبة مبني بلغة الجافا — لإدارة الكتب والمستعيرين وعمليات الإعارة مع إضافة وبحث وإعارة وإرجاع مع حفظ البيانات.',

      'proj.p7tag': 'مشروع شخصي',
      'proj.p7t': 'SmartTimeCoach',
      'proj.p7d': 'مساعد إنتاجية بلغة Python مع تذكيرات تلقائية يساعد على إدارة المهام وجداول الدراسة بشكل أكثر فعالية.',

      'certs.eyebrow': '04 · الشهادات',
      'certs.title': 'شهادات موثقة',
      'certs.view': 'عرض الشهادة',
      'certs.download': 'تحميل',
      'certs.noimage': 'لم يتم رفع صورة الشهادة بعد.',
      'certs.noimageHint': 'ضع الملف في assets/certs/ ثم أعد تحميل الصفحة.',

      'exp.eyebrow': '05 · الخبرة',
      'exp.title': 'الخبرة والإنجازات',
      'exp.techh': 'خبرة تقنية',
      'exp.milestone': 'الإنجازات',
      'exp.t1': 'مشاريع شبكات ودعم تقني',
      'exp.t1per': '2023 – الآن',
      'exp.t1a': 'تصميم LAN وخطط عنونة IP',
      'exp.t1b': 'إعداد الراوتر وDHCP وDNS وNAT',
      'exp.t1c': 'استكشاف أعطال الاتصال',
      'exp.t1d': 'توثيق تقني ومخططات انسياب',
      'exp.t1e': 'دعم تقني للمجتمع',

      'exp.m1': '2026 · شهادة NVIDIA في الذكاء الاصطناعي',
      'exp.m1sub': 'الذكاء الاصطناعي التوليدي · NVIDIA Academy',
'exp.m1b': '2026 · مسارات OpenAI و Anthropic للذكاء الاصطناعي',
'exp.m1bsub': 'أساسيات الذكاء الاصطناعي · Claude 101 · Claude Code 101 · Claude Code in Action',
      'exp.m2': '2025 · شهادة ICDL',
      'exp.m2sub': 'Edraak · Word, Excel, أمن الإنترنت',
      'exp.m3': '2024 · مشاريع الشبكات',
      'exp.m3sub': 'VLAN, DHCP/NAT segments',
      'exp.m4': '2023 · بداية رحلة علوم الحاسوب',
      'exp.m4sub': 'جامعة الأزهر',

      'test.eyebrow': '06 · التوصيات',
      'test.title': 'آراء وتوصيات',
      'test.q1': '"عبدالله من أكثر الطلاب شغفًا الذين درّستهم. يُظهر مهارات قوية في التعاون والعرض وإدارة الوقت وحل المشكلات."',
      'test.n1': 'أ. Abdelbaset R. Almasri',
      'test.r1': 'محاضر علوم الحاسوب · جامعة الأزهر',
      'test.q2': '"عبدالله طالب استثنائي وأصل ثمين لجامعةنا. مجتهد وموثوق ويعمل بشكل ممتاز في الفرق."',
      'test.n2': 'د. Adel A. Ahmed',
      'test.r2': 'محاضر علوم الحاسوب · جامعة الأزهر',
      'test.q3': '"عبدالله عضو فريق استثنائي، متعاون وموثوق، ومحل طبيعي للمشكلات. متعلم ذاتي مخلص ومتواصل قوي يرتقي دائمًا بجودة مشاريعنا."',
      'test.n3': 'Yazan W. Abo_Elqomboz',
      'test.r3': 'عضو فريق مشروع',

      'contact.eyebrow': '07 · تواصل',
      'contact.title': 'لنبني تواصلًا',
      'contact.desc': 'عندك فرصة أو منحة دراسية أو مشروع تحب تناقشه؟ يسعدني أسمع منك.',
      'contact.avail': 'أرد خلال 24 ساعة',
      'contact.loc': 'غزة، فلسطين',

      'form.name': 'الاسم',
      'form.email': 'البريد الإلكتروني',
      'form.subject': 'الموضوع',
      'form.message': 'الرسالة',
      'form.send': 'إرسال الرسالة',
      'form.sending': 'يتم فتح عميل البريد…',
      'form.mailto': 'تم فتح تطبيق البريد لديك. اضغط إرسال لإيصال الرسالة.',
      'form.success': 'شكرًا لك! رسالتك في طريقها.',
      'form.error': 'يرجى ملء جميع الحقول ببريد إلكتروني صحيح.',

      'recs.verified': 'توصية موثّقة',
      'recs.open': 'عرض التوصية',

      'certs.badge': 'موثّقة',
      'certs.c1t': 'AI for All: من الأساسيات إلى ممارسة GenAI',
      'certs.c1o': 'أكاديمية NVIDIA',
      'certs.c1d': 'مارس 2026',
      'certs.c2t': 'AI Foundations',
      'certs.c2o': 'أكاديمية OpenAI',
      'certs.c2d': 'يوليو 2026',
      'certs.c3t': 'Claude 101',
      'certs.c3o': 'Anthropic',
      'certs.c3d': 'يوليو 2026',
      'certs.c4t': 'CS101: مقدمة في البرمجة الأولى',
      'certs.c4o': 'أكاديمية Saylor',
      'certs.c4d': 'يناير 2026',
      'certs.c5t': 'شهادة ICDL الأساسية',
      'certs.c5o': 'إدراك',
      'certs.c5d': 'يناير 2026',
      'certs.c6t': 'التفكير النقدي في عصر الذكاء الاصطناعي',
      'certs.c6o': 'HP LIFE',
      'certs.c6d': '2025',
      'certs.c7t': 'علوم البيانات والتحليلات',
      'certs.c7o': 'HP LIFE',
      'certs.c7d': '2025',
      'certs.c8t': 'كود كلاود 101',
      'certs.c8o': 'Anthropic',
      'certs.c8d': 'أغسطس 2026',
      'certs.c9t': 'كود كلاود بالتطبيق',
      'certs.c9o': 'Anthropic · Coursera',
      'certs.c9d': 'أغسطس 2026',
      'certs.c10t': 'أساسيات الذكاء الاصطناعي',
      'certs.c10o': 'Google · Coursera',
      'certs.c10d': 'أغسطس 2026',
      'certs.c11t': 'تعلّم Git و GitHub',
      'certs.c11o': 'منصة معارف',
      'certs.c11d': 'أغسطس 2026',

      'footer.tag': 'أبني بفضول، أتعلم بإصرار.',
      'footer.rights': 'جميع الحقوق محفوظة',

      'preloader.loading': 'جاري تحميل الموقع…',

      'theme.label': 'المظهر',
      'theme.dark': 'داكن',
      'theme.light': 'فاتح',
      'theme.cyberpunk': 'سايبربانك',
      'theme.forest': 'غابة',
      'theme.sunset': 'غروب',

      'ai.title': 'المساعد الذكي',
      'ai.status': 'متصل · جاهز للمساعدة',
      'ai.input': 'اسأل المساعد',
      'ai.placeholder': 'اسألني أي شيء عن أعمال عبدالله…',
      'ai.voice': 'استخدم الإدخال الصوتي',
      'ai.speak': 'اقرأ الرد بصوت عالٍ',
      'ai.clear': 'مسح المحادثة',
      'ai.minimize': 'تصغير',
      'ai.send': 'إرسال',
      'ai.suggest': 'أسئلة مقترحة'
    }
  };

  // ============== State ==============
  const state = {
    lang: new URLSearchParams(location.search).get('lang') ||
      localStorage.getItem('lang') ||
      (navigator.language?.startsWith('ar') ? 'ar' : 'en'),
    theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  };

  // ============== Lifecycle hooks ==============
  // Language-aware UI effects (typed animation, radar chart, assistant chips,
  // voice) listen for the 'langchange' event that applyLang() dispatches.

  // ============== Helpers ==============

  /** @type {(sel: string, root?: ParentNode) => Element | null} */
  const $ = (sel, root = document) => root.querySelector(sel);

  /** @type {(sel: string, root?: ParentNode) => Element[]} */
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /**
   * Applies the selected language to the entire page.
   * Updates HTML lang/dir attributes, meta tags, and all [data-i18n] elements.
   * @param {string} lang - Language code ('en' or 'ar')
   * @returns {void}
   */
  function applyLang(lang) {
    state.lang = lang;
    const dict = i18n[lang];
    if (!dict) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update meta
    const titleEl = $('title');
    if (titleEl) titleEl.textContent = dict['meta.title'] || titleEl.textContent;
    const descEl = $('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', dict['meta.desc'] || descEl.getAttribute('content'));
    const ogDesc = $('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', dict['meta.desc'] || ogDesc.getAttribute('content'));
    const twDesc = $('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', dict['meta.desc'] || twDesc.getAttribute('content'));
    const ogLocale = $('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', lang === 'ar' ? 'ar_PS' : 'en_US');
    const ogLocaleAlt = $('meta[property="og:locale:alternate"]');
    if (ogLocaleAlt) ogLocaleAlt.setAttribute('content', lang === 'ar' ? 'en_US' : 'ar_PS');
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle && dict['meta.title']) ogTitle.setAttribute('content', dict['meta.title']);
    const twTitle = $('meta[name="twitter:title"]');
    if (twTitle && dict['meta.title']) twTitle.setAttribute('content', dict['meta.title']);

    // Update all i18n elements
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = dict[key];
      if (val !== undefined) el.textContent = val;
    });

    // Also support aria-label and title localization via data-i18n-aria / data-i18n-title
    $$('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const val = dict[key];
      if (val !== undefined) el.setAttribute('aria-label', val);
    });
    $$('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const val = dict[key];
      if (val !== undefined) el.setAttribute('title', val);
    });
    $$('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = dict[key];
      if (val !== undefined) el.setAttribute('placeholder', val);
    });

    // Update lang toggle label
    const langLabel = $('#lang-label');
    if (langLabel) langLabel.textContent = lang === 'en' ? 'AR' : 'EN';
    const langToggle = $('#lang-toggle');
    if (langToggle) langToggle.setAttribute('aria-pressed', lang === 'ar' ? 'true' : 'false');

    // Notify language-aware features (typed animation, radar chart, assistant
    // suggestions, voice) via a persistent event so they re-render on EVERY
    // language switch, not just the first.
    document.dispatchEvent(new CustomEvent('langchange'));

    localStorage.setItem('lang', lang);

    // Keep the ?lang= param in sync so shared links reflect the current language.
    const url = new URL(location.href);
    if (url.searchParams.get('lang') !== lang) {
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url.toString());
    }
  }

  /**
   * Applies the selected theme to the page.
   * Updates the data-theme attribute, icon, and persists to localStorage.
   * @param {string} theme - Theme name ('dark' | 'light' | 'cyberpunk' | 'forest' | 'sunset')
   * @returns {void}
   */
  const THEME_ICONS = { dark: 'moon', light: 'sun', cyberpunk: 'zap', forest: 'tree-pine', sunset: 'sunset' };
  const THEME_COLORS = { dark: '#06060e', light: '#f0f0f8', cyberpunk: '#0a0014', forest: '#0b1410', sunset: '#160c08' };
  const THEME_ORDER = ['dark', 'light', 'cyberpunk', 'forest', 'sunset'];
  function applyTheme(theme) {
    if (!THEME_ORDER.includes(theme)) theme = 'dark';
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || '#06060e');
    // Matches both the raw <i data-lucide> placeholder and the rendered
    // <i data-icon> sprite wrapper — applyTheme runs before first render too.
    const themeBtn = $('#theme-toggle [data-icon], #theme-toggle i[data-lucide]');
    if (themeBtn) {
      const isPlaceholder = themeBtn.hasAttribute('data-lucide');
      const name = THEME_ICONS[theme] || 'moon';
      if (isPlaceholder) themeBtn.setAttribute('data-lucide', name);
      else themeBtn.setAttribute('data-icon', name);
      if (window.lucide) window.lucide.createIcons();
    }
    localStorage.setItem('theme', theme);
  }

  /**
   * Sets up the theme picker popover: opens a menu of all themes, highlights
   * the active one, and closes on outside click / Escape.
   * @returns {void}
   */
  function setupThemePicker() {
    const toggle = $('#theme-toggle');
    const menu = $('#theme-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const syncChecks = () => {
      $$('[data-theme-choice]', menu).forEach((btn) => {
        btn.setAttribute('aria-checked', btn.dataset.themeChoice === state.theme ? 'true' : 'false');
      });
    };

    toggle.addEventListener('click', () => {
      setOpen(menu.hidden);
      syncChecks();
    });

    $$('[data-theme-choice]', menu).forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.themeChoice);
        setOpen(false);
        syncChecks();
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#theme-picker')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    syncChecks();
  }

  // ============== Typed (rotating typewriter) ==============

  /**
   * Runs a typewriter animation in the hero, cycling through a list of phrases.
   * Skipped entirely when the user prefers reduced motion.
   * Re-runs with the new language's phrase list when the user toggles languages.
   * @returns {() => void} cleanup function that stops the animation
   */
  function setupTyped() {
    const el = $('#typed');
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = (TYPED_PHRASES[state.lang] || TYPED_PHRASES.en)[0];
      return;
    }

    let phraseIdx = 0;
    let charIdx = 0;
    let mode = 'type'; // 'type' | 'pause' | 'delete'
    let timer = null;
    let stopped = false;

    function pickPhrases() {
      return TYPED_PHRASES[state.lang] || TYPED_PHRASES.en;
    }

    function tick() {
      if (stopped) return;
      const phrases = pickPhrases();
      const phrase = phrases[phraseIdx] || '';

      if (mode === 'type') {
        charIdx += 1;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx >= phrase.length) {
          mode = 'pause';
          timer = setTimeout(tick, TYPED_PAUSE_MS);
          return;
        }
        timer = setTimeout(tick, TYPED_TYPE_MS + Math.random() * 60);
      } else if (mode === 'pause') {
        mode = 'delete';
        timer = setTimeout(tick, TYPED_PAUSE_MS);
      } else {
        charIdx -= 1;
        el.textContent = phrase.slice(0, Math.max(charIdx, 0));
        if (charIdx <= 0) {
          mode = 'type';
          phraseIdx = (phraseIdx + 1) % phrases.length;
          timer = setTimeout(tick, 250);
          return;
        }
        timer = setTimeout(tick, TYPED_DELETE_MS);
      }
    }

    function start() {
      stopped = false;
      phraseIdx = 0;
      charIdx = 0;
      mode = 'type';
      el.textContent = '';
      if (timer) clearTimeout(timer);
      timer = setTimeout(tick, 600);
    }

    start();

    // When the language changes, restart the animation with the new phrase list.
    document.addEventListener('langchange', () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      start();
    });
  }

  // ============== Mobile menu ==============

  /**
   * Sets up the mobile hamburger menu toggle functionality.
   * Handles click events on the toggle button and nav links.
   * Updates aria-expanded and icon state on open/close.
   * @returns {void}
   */
  function setupMobileMenu() {
    const toggle = $('#nav-toggle');
    const links = $('.nav-links');
    const navbar = $('#navbar');
    if (!toggle || !links) return;

    function setOpen(open) {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      const icon = toggle.querySelector('[data-icon]');
      if (icon) {
        icon.setAttribute('data-icon', open ? 'x' : 'menu');
        if (window.lucide) window.lucide.createIcons();
      }
    }

    toggle.addEventListener('click', () => {
      setOpen(!links.classList.contains('open'));
    });

    // Close menu on link click (mobile)
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && links.classList.contains('open')) {
        setOpen(false);
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!links.classList.contains('open')) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close when a nav link activates a smooth scroll to a section
    if (navbar) {
      navbar.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && links.classList.contains('open')) {
          setOpen(false);
        }
      });
    }
  }

  // ============== Active link on scroll ==============

  /**
   * Sets up scroll spy to highlight the active nav link based on visible sections.
   * Uses IntersectionObserver for efficient scroll tracking.
   * @returns {void}
   */
  function setupScrollSpy() {
    const sections = $$('section[id]');
    const links = $$('.nav-links a');

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((l) => {
              const isActive = l.getAttribute('href') === `#${id}`;
              l.classList.toggle('active', isActive);
              if (isActive) l.setAttribute('aria-current', 'location');
              else l.removeAttribute('aria-current');
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // ============== Scroll Progress Bar ==============

  /**
   * Updates a thin progress bar at the top of the page to indicate scroll position.
   * Uses CSS transforms for performance; rAF-throttled to avoid layout thrash.
   * @returns {void}
   */
  function setupScrollProgress() {
    const bar = $('#scroll-progress');
    if (!bar) return;

    let rafId = null;
    let ticking = false;

    function update() {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        rafId = requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  // ============== Navbar shadow on scroll ==============

  /**
   * Adds a shadow effect to the navbar when the page is scrolled.
   * Uses passive scroll listener for performance.
   * @returns {void}
   */
  function setupNavScroll() {
    const nav = $('#navbar');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============== Form handler ==============

  /**
   * Validates form fields and returns true if all valid.
   * Marks invalid fields with .field-error class.
   * @param {HTMLFormElement} form
   * @param {string} name
   * @param {string} email
   * @param {string} subject
   * @param {string} message
   * @returns {boolean}
   */
  function validateForm(form, name, email, subject, message) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const valid = !!(name && emailValid && subject && message);
    if (!valid) {
      if (!name) form.querySelector('#name')?.closest('.field')?.classList.add('field-error');
      if (!emailValid) form.querySelector('#email')?.closest('.field')?.classList.add('field-error');
      if (!subject) form.querySelector('#subject')?.closest('.field')?.classList.add('field-error');
      if (!message) form.querySelector('#message')?.closest('.field')?.classList.add('field-error');
    }
    return valid;
  }

  /**
   * Submits the form via the configured endpoint, with mailto as a reliable fallback.
   * The Formspree path only runs when FORMSPREE_ENDPOINT is set to a real URL.
   * Otherwise (and on any error) we open the user's mail client with a pre-filled
   * message body — which is always available, requires no signup, and never silently fails.
   * @param {HTMLFormElement} form
   * @param {{name: string, email: string, subject: string, message: string}} payload
   * @returns {Promise<'sent' | 'mailto'>}
   */
  async function submitFormPayload(form, payload) {
    // If a real Formspree endpoint is configured, try it first.
    if (FORMSPREE_ENDPOINT && /^https?:\/\//.test(FORMSPREE_ENDPOINT)) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return 'sent';
      } catch (err) {
        // network failure or CORS — fall through to mailto
      }
    }
    // Mailto fallback — opens the visitor's email client.
    const body =
      `Name: ${payload.name}\n` +
      `Email: ${payload.email}\n\n` +
      `${payload.message}`;
    const href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(payload.subject)}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    return 'mailto';
  }

  /**
   * Handles the contact form submission.
   * Validates inputs, shows loading state, submits via Formspree (if configured)
   * or falls back to a mailto: link that opens the visitor's email client.
   * @param {HTMLFormElement} form - The contact form element
   * @returns {Promise<void>}
   */
  async function handleSubmit(form) {
    const status = $('#form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const subject = (data.get('subject') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    const dict = i18n[state.lang];

    form.querySelectorAll('.field').forEach(f => f.classList.remove('field-error'));

    if (!validateForm(form, name, email, subject, message)) {
      if (status) {
        status.textContent = dict['form.error'];
        status.className = 'form-note form-error';
        status.setAttribute('role', 'alert');
      }
      // Move focus to the first invalid field for keyboard users.
      const firstInvalid = form.querySelector('.field-error input, .field-error textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> <span>' + (dict['form.sending'] || 'Sending...') + '</span>';
    }
    if (status) {
      status.textContent = dict['form.sending'];
      status.className = 'form-note';
    }

    try {
      const result = await submitFormPayload(form, { name, email, subject, message });
      if (result === 'sent') {
        showToast(dict['form.success'] || 'Message sent successfully!', 'success');
        if (status) {
          status.textContent = dict['form.success'];
          status.className = 'form-note success';
        }
      } else {
        // mailto — message was handed to the OS email client
        showToast(dict['form.mailto'] || 'Your email client should open. Send from there to complete.', 'success');
        if (status) {
          status.textContent = dict['form.mailto'] || 'Email client opened. Hit send to finish.';
          status.className = 'form-note success';
        }
      }
      form.reset();
    } catch (err) {
      showToast(dict['form.error'] || 'Failed to send message. Please try again.', 'error');
      if (status) {
        status.textContent = dict['form.error'];
        status.className = 'form-note form-error';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="send"></i> <span data-i18n="form.send">' + (dict['form.send'] || 'Send Message') + '</span>';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  };

  // ============== Footer year ==============

  /**
   * Sets the current year in the footer copyright text.
   * @returns {void}
   */
  function setYear() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // ============== Section Transition (Active section accent + nav highlight) ==============

  /**
   * Tracks the section currently in view and:
   *  1. Toggles data-active on each <section> so CSS can apply per-section accents.
   *  2. Updates a per-section accent color CSS custom property (--section-accent).
   *  3. Highlights the matching nav link (in addition to scroll-spy).
   * Uses IntersectionObserver for performance. No library, no jank.
   * @returns {void}
   */
  function setupSectionTransitions() {
    const sections = $$('main section[id]');
    if (!sections.length) return;

    // Per-section accent colors used for cursor themes / glow accents
    const ACCENTS = {
      home: 'var(--accent)',
      about: '#7dcea0',
      skills: '#5dade2',
      projects: '#bb8fce',
      certs: '#f5b041',
      experience: '#ec7063',
      feedback: '#48c9b0',
      contact: '#5d6d7e'
    };

    const setActive = (id) => {
      sections.forEach((s) => {
        const isActive = s.id === id;
        s.classList.toggle('is-active', isActive);
        if (isActive) {
          const accent = ACCENTS[id] || 'var(--accent)';
          s.style.setProperty('--section-accent', accent);
        }
      });
    };

    if (!('IntersectionObserver' in window)) {
      setActive(sections[0]?.id || 'home');
      return;
    }

    // ratio 0..1 - we want the section with highest visibility ratio
    const visibility = new Map();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visibility.set(e.target.id, e.intersectionRatio));
        let bestId = null;
        let bestRatio = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });
        if (bestId && bestRatio > 0.05) setActive(bestId);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9] }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // ============== Cursor Themes per Section ==============

  /**
   * Changes the cursor blob color/size based on the active section.
   * Reads the active section's --section-accent CSS variable (set by
   * setupSectionTransitions) and applies it to the .cursor-blob element.
   * Also toggles a "label" tooltip showing the section name.
   * @returns {void}
   */
  function setupCursorThemes() {
    const blob = document.getElementById('cursor-follower');
    if (!blob) return;

    const label = document.createElement('div');
    label.className = 'cursor-label';
    label.setAttribute('aria-hidden', 'true');
    blob.appendChild(label);

    const LABELS = {
      home: { en: 'Home', ar: 'الرئيسية' },
      about: { en: 'About', ar: 'نبذة' },
      skills: { en: 'Skills', ar: 'مهارات' },
      projects: { en: 'Projects', ar: 'مشاريع' },
      certs: { en: 'Certifications', ar: 'شهادات' },
      experience: { en: 'Experience', ar: 'خبرة' },
      feedback: { en: 'Feedback', ar: 'آراء' },
      contact: { en: 'Contact', ar: 'تواصل' }
    };

    const applyFor = (id) => {
      const accent = getComputedStyle(document.getElementById(id) || document.body)
        .getPropertyValue('--section-accent').trim() || 'var(--accent)';
      blob.style.setProperty('--cursor-color', accent);
      const lang = document.documentElement.lang || 'en';
      const name = LABELS[id] ? LABELS[id][lang] || LABELS[id].en : '';
      label.textContent = name;
      label.dataset.text = name; // for CSS pseudo-element fallback
    };

    // Initial
    const initial = $('section.is-active')?.id || 'home';
    applyFor(initial);

    // Listen for changes via MutationObserver on <html class="is-active"> toggles
    const main = document.querySelector('main');
    if (!main) return;
    const obs = new MutationObserver(() => {
      const active = main.querySelector('section.is-active')?.id;
      if (active) applyFor(active);
    });
    sections_all().forEach((s) => obs.observe(s, { attributes: true, attributeFilter: ['class'] }));

    // Show label briefly on cursor move
    let labelTimer = 0;
    document.addEventListener('mousemove', (e) => {
      // Update label position offset to follow cursor inside blob
      const x = e.clientX, y = e.clientY;
      blob.style.setProperty('--cursor-x', `${x}px`);
      blob.style.setProperty('--cursor-y', `${y}px`);
      if (blob.classList.contains('active')) {
        label.classList.add('show');
        clearTimeout(labelTimer);
        labelTimer = setTimeout(() => label.classList.remove('show'), 1200);
      }
    });
  }

  // Helper: sections query (used in setupCursorThemes to avoid duplicate selector)
  function sections_all() {
    return $$('main section[id]');
  }

  // ============== Scroll Reveal (Premium Staggering) ==============

  /**
   * Sets up scroll-triggered reveal animations with staggered delays.
   * Uses IntersectionObserver for performance. Supports multiple reveal directions
   * (up, left, right, scale) and stagger containers for cascading child animations.
   * @returns {void}
   */
  function setupScrollReveal() {
    // Select all our animation classes
    const SELECTORS = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .section-head';
    const els = $$(SELECTORS);
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const parent = el.parentElement;

          // Smart Stagger: Find siblings in the same container with ANY reveal class
          let parentDelay = 0;
          if (parent) {
            const siblings = Array.from(parent.children).filter(c =>
              c.className.match(/reveal/)
            );
            const idx = siblings.indexOf(el);
            if (idx > -1) {
              parentDelay = idx * STAGGER_DELAY_MS;
              // Stagger delay multiplier for a smooth cascading effect
              el.style.transitionDelay = `${parentDelay}ms`;
            }
          }

          // Handle dynamic stagger for child items BEFORE revealing
          if (el.classList.contains('stagger-container')) {
            const items = el.querySelectorAll('.stagger-item');
            items.forEach((item, idx) => {
              item.style.transitionDelay = `${parentDelay + (idx * ITEM_STAGGER_DELAY_MS)}ms`;
            });
          }

          el.classList.add('revealed');
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

    els.forEach((el) => observer.observe(el));
  }

  // ============== Back to Top ==============

  /**
   * Sets up the back-to-top button visibility and scroll behavior.
   * Shows the button after scrolling past SCROLL_THRESHOLD pixels.
   * Smoothly scrolls to top on click.
   * @returns {void}
   */
  function setupBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    const onScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============== Keyboard shortcuts ==============

  /**
   * Adds a few quality-of-life keyboard shortcuts: Home scrolls to top, End
   * scrolls to the bottom. Skipped on form fields so it doesn't fight input.
   * @returns {void}
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    });
  }

  // ============== Focus Trap ==============

  /**
   * Creates a keyboard focus trap within a container element.
   * Prevents Tab from escaping the container (e.g., modal dialog).
   * @param {HTMLElement} container - The container to trap focus within
   * @returns {(() => void) | null} Cleanup function to remove the trap, or null if no focusable elements
   */
  function trapFocus(container) {
    const focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return null;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
  }

  // ============== Toast Notifications ==============

  /**
   * Displays a toast notification with auto-dismiss.
   * Removes any existing toast before showing a new one.
   * @param {string} message - The message to display
   * @param {'success' | 'error' | 'info'} type - The toast type (affects icon and color)
   * @returns {void}
   */
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    const icon = type === 'success' ? 'check-circle-2' : type === 'error' ? 'alert-circle' : 'info';
    toast.innerHTML = `
      <i data-lucide="${icon}"></i>
      <span>${message}</span>
      <button class="toast-close" aria-label="Dismiss" onclick="this.parentElement.remove()">
        <i data-lucide="x"></i>
      </button>
    `;

    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 300);
    }, TOAST_DURATION_MS);
  }

  // ============== Certificate Modal ==============

  /**
   * Sets up the certificate modal lightbox functionality.
   * Handles opening, closing, image loading, focus trap, and keyboard navigation.
   * Supports Escape key to close and click-outside to close.
   * @returns {void}
   */
  function setupCertModal() {
    const modal = $('#cert-modal');
    if (!modal) return;

    const img = $('#cert-modal-img');
    const fallback = $('#cert-modal-fallback');
    const titleEl = $('#cert-modal-title');
    const orgEl = $('#cert-modal-org');
    const dlBtn = $('#cert-modal-download');
    let lastFocused = null;
    let removeTrap = null;

    function open(src, title, org) {
      lastFocused = document.activeElement;
      const dict = i18n[state.lang];
      const idx = CERT_INDEX[src];
      const localized = idx
        ? { title: dict[idx + 't'], org: dict[idx + 'o'] }
        : null;
      titleEl.textContent = (localized && localized.title) || title || 'Certificate';
      orgEl.textContent = (localized && localized.org) || org || '';
      dlBtn.href = src;
      dlBtn.setAttribute('download', (title || 'certificate').replace(/[^\w\-]+/g, '_'));

      fallback.style.display = 'none';
      img.style.display = '';
      img.onload = () => {
        img.style.display = '';
        fallback.style.display = 'none';
      };
      img.onerror = () => {
        img.style.display = 'none';
        fallback.style.display = '';
      };
      img.src = src;
      dlBtn.style.display = '';

      modal.hidden = false;
      document.body.classList.add('no-scroll');

      removeTrap = trapFocus(modal);

      setTimeout(() => {
        const closeBtn = modal.querySelector('.cert-modal-close');
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove('no-scroll');
      if (removeTrap) { removeTrap(); removeTrap = null; }
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    $$('.cert-card[data-cert]').forEach((card) => {
      card.addEventListener('click', () => {
        open(card.dataset.cert, card.dataset.certTitle, card.dataset.certOrg);
      });
    });

    modal.addEventListener('click', (e) => {
      // Use closest() so clicks on the SVG icon inside the close button
      // (rendered by Lucide from <i data-lucide="x">) are also detected.
      if (e.target.closest('[data-close]')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  // ============== Testimonial Modal ==============

  function setupTestimonialModal() {
    const modal = $('#rec-modal');
    if (!modal) return;

    const titleEl = $('#rec-modal-title');
    const roleEl = $('#rec-modal-role');
    const quoteEl = $('#rec-modal-quote');
    const avatarEl = $('#rec-modal-avatar');
    const fallbackEl = $('#rec-modal-avatar-fallback');
    let lastFocused = null;
    let removeTrap = null;

    function open(card) {
      lastFocused = document.activeElement;
      const dict = i18n[state.lang];

      const blockquote = card.querySelector('blockquote');
      const nameEl = card.querySelector('.t-name');
      const roleElSrc = card.querySelector('.t-role');
      const imgEl = card.querySelector('.t-avatar img');
      const fallbackSrc = card.querySelector('.t-avatar-fallback');

      const name = nameEl ? (dict[nameEl.dataset.i18n] || nameEl.textContent) : '';
      const role = roleElSrc ? (dict[roleElSrc.dataset.i18n] || roleElSrc.textContent) : '';
      const quote = blockquote ? (dict[blockquote.dataset.i18n] || blockquote.textContent) : '';
      const initials = fallbackSrc ? fallbackSrc.textContent.trim() : name.split(' ').map(w => w[0]).join('').slice(0, 2);

      titleEl.textContent = name;
      roleEl.textContent = role;
      quoteEl.textContent = quote;

      const existingImg = avatarEl.querySelector('img');
      if (existingImg) existingImg.remove();
      fallbackEl.textContent = initials;

      if (imgEl && imgEl.src) {
        const newImg = document.createElement('img');
        newImg.alt = name;
        newImg.width = 72;
        newImg.height = 72;
        newImg.loading = 'lazy';
        newImg.decoding = 'async';
        newImg.style.display = 'none';
        newImg.onload = () => { newImg.style.display = ''; fallbackEl.style.display = 'none'; };
        newImg.onerror = () => { newImg.remove(); fallbackEl.style.display = ''; };
        newImg.src = imgEl.src;
        avatarEl.appendChild(newImg);
        fallbackEl.style.display = 'none';
      } else {
        fallbackEl.style.display = '';
      }

      modal.hidden = false;
      document.body.classList.add('no-scroll');
      removeTrap = trapFocus(modal);

      setTimeout(() => {
        const closeBtn = modal.querySelector('.rec-modal-close');
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove('no-scroll');
      if (removeTrap) { removeTrap(); removeTrap = null; }
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    $$('.testimonial').forEach((card) => {
      card.style.cursor = 'pointer';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', i18n[state.lang]['recs.open'] || 'View recommendation');

      card.addEventListener('click', () => open(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card);
        }
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-rec-close]')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  // ============== Custom Cursor ==============

  /**
   * Sets up the custom cursor with smooth following animation.
   * Disabled on touch devices, small screens, and reduced-motion preference.
   * Adds hover effect on interactive elements.
   * @returns {void}
   */
  function setupCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    if (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(max-width: 719px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isAnimating = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.classList.add('active');
      follower.classList.add('active');
      if (!isAnimating) {
        isAnimating = true;
        animateCursor();
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
      isAnimating = false;
    });

    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        cursorX = mouseX;
        cursorY = mouseY;
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;
        cursor.style.transform = `translate(${cursorX - 12}px, ${cursorY - 12}px)`;
        follower.style.transform = `translate(${followerX - 4}px, ${followerY - 4}px)`;
        isAnimating = false;
        return;
      }

      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      cursor.style.transform = `translate(${cursorX - 12}px, ${cursorY - 12}px)`;
      follower.style.transform = `translate(${followerX - 4}px, ${followerY - 4}px)`;

      requestAnimationFrame(animateCursor);
    }

    const hoverElements = document.querySelectorAll('a, button, .cert-card, .skill-card, .project-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ============== Animated Counters ==============

  /**
   * Sets up animated number counters for stats section.
   * Uses IntersectionObserver to trigger animation when visible.
   * Animates from 0 to target number with cubic easing.
   * @returns {void}
   */
  function setupCounters() {
    const stats = document.querySelectorAll('.stat-num');
    if (!stats.length) return;

    // Stash the original text and reset display to 0 so the actual number
    // is never visible before the counter animates into place.
    const prepared = [];
    stats.forEach((el) => {
      const text = el.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;
      prepared.push({
        el,
        target: parseInt(match[1], 10),
        suffix: text.replace(match[1], '')
      });
      el.textContent = '0' + text.replace(match[1], '');
    });

    if (!('IntersectionObserver' in window)) {
      // Reveal the real values if we can't animate.
      prepared.forEach(({ el, target, suffix }) => { el.textContent = target + suffix; });
      return;
    }

    const resumes = [];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const data = prepared.find((p) => p.el === entry.target);
        if (!data) return;

        const { el, target, suffix } = data;
        const duration = COUNTER_DURATION_MS;
        let startTime = null;
        let rafId = null;
        let cancelled = false;
        let hiddenAt = null;

        function tick(currentTime) {
          if (cancelled) return;
          if (document.hidden) {
            // Pause while the tab is hidden; visibilitychange resumes below.
            hiddenAt = performance.now();
            rafId = null;
            return;
          }
          if (startTime === null) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) rafId = requestAnimationFrame(tick);
        }

        // Resume mid-animation where we left off (shift startTime by the
        // hidden duration so the count doesn't jump ahead).
        resumes.push(() => {
          if (rafId !== null || cancelled) return;
          if (hiddenAt !== null) {
            startTime += performance.now() - hiddenAt;
            hiddenAt = null;
          }
          rafId = requestAnimationFrame(tick);
        });

        rafId = requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) resumes.forEach((resume) => resume());
    });

    prepared.forEach(({ el }) => observer.observe(el));
  }

  // ============== Magnetic Buttons ==============

  /**
   * Sets up magnetic hover effect on primary buttons and icon buttons.
   * Buttons subtly follow the mouse cursor on hover.
   * Disabled on touch devices, small screens, and reduced-motion preference.
   * @returns {void}
   */
  function setupMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(max-width: 719px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const buttons = document.querySelectorAll('.btn-primary, .icon-btn');
    buttons.forEach(btn => {
      let raf = null;
      btn.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
          raf = null;
        });
      });

      btn.addEventListener('mouseleave', () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        btn.style.transform = '';
      });
    });
  }

  // ============== Hero cursor glow ==============

  /**
   * Adds a soft purple glow that follows the cursor inside the hero section.
   * Disabled on touch devices, narrow viewports, and reduced-motion preference.
   * @returns {void}
   */
  function setupHeroCursorGlow() {
    const blob = $('#hero-cursor-glow');
    const hero = $('.hero');
    if (!blob || !hero) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(max-width: 719px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0, targetY = 0;
    let blobX = 0, blobY = 0;
    let rafId = null;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    hero.addEventListener('mouseleave', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    });

    function animate() {
      blobX += (targetX - blobX) * 0.12;
      blobY += (targetY - blobY) * 0.12;
      blob.style.left = blobX + 'px';
      blob.style.top = blobY + 'px';
      if (Math.abs(targetX - blobX) > 0.5 || Math.abs(targetY - blobY) > 0.5) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }
  }

  // ============== AI Portfolio Assistant ==============

  /**
   * Local, zero-deps portfolio assistant.
   * Smart intent matching + comprehensive knowledge base + bilingual responses.
   * Architecture: rule-based engine with weighted scoring + context awareness.
   * Knowledge is fully offline (no API calls, no third-party data).
   */

  const AI = {
    KB: {
      en: {
        who: {
          name: 'Abdullah Ayman AL-Ghoul',
          role: 'Computer Science student · Aspiring Software Engineer',
          uni: 'Al-Azhar University',
          city: 'Gaza, Palestine',
          email: 'abdallhalghoul200@gmail.com',
          linkedin: 'linkedin.com/in/abdullah-al-ghoul-a254763a6',
          status: 'Open to opportunities'
        },
        skills: {
          programming: [
            { name: 'Java', tier: 4, label: 'Expert' },
            { name: 'JavaScript', tier: 3, label: 'Advanced' },
            { name: 'HTML5 / CSS3', tier: 4, label: 'Expert' },
            { name: 'C', tier: 3, label: 'Advanced' }
          ],
          networking: [
            { name: 'TCP/IP', tier: 4, label: 'Expert' },
            { name: 'VLAN', tier: 3, label: 'Advanced' },
            { name: 'DHCP / DNS / NAT', tier: 3, label: 'Advanced' },
            { name: 'Cisco Packet Tracer', tier: 3, label: 'Advanced' }
          ],
          tools: [
            { name: 'Git & GitHub', tier: 3, label: 'Advanced' },
            { name: 'AI Tools & Prompting', tier: 4, label: 'Expert' },
            { name: 'Windows', tier: 3, label: 'Advanced' },
            { name: 'Linux (basics)', tier: 2, label: 'Intermediate' }
          ],
          learning: ['Frontend Development', 'Java OOP', 'Data Structures', 'Algorithms', 'Software Engineering Principles']
        },
        projects: [
          { name: 'Personal Portfolio Website', tag: 'Live · This Site', stack: 'HTML5, CSS3, JavaScript, i18n, RTL', desc: 'A responsive, modern, bilingual portfolio — this very site.' },
          { name: 'Enterprise Network Design', tag: 'Completed', stack: 'Cisco Packet Tracer, VLAN, DHCP, DNS, NAT, Routing', desc: 'Segmented business network using VLANs, DHCP, DNS, NAT, subnetting, and Router-on-a-Stick.' },
          { name: 'Smart University Virtual Lab', tag: 'Concept Proposal', stack: 'RDP, Windows, Azure, Cloud Infra, VPN', desc: 'Cloud-based virtual desktops for students without PCs to access programming environments via RDP.' },
          { name: 'AL-Azher IT Hub', tag: 'Live', stack: 'React, Tailwind CSS, Firebase, PWA', desc: 'Bilingual educational platform for Al-Azhar IT students — lectures, resources, and study materials, with offline PWA support.' },
          { name: 'Task Manager', tag: 'Team Project', stack: 'Java, OOP, File I/O', desc: 'Team task management app with creation, assignment, status tracking, and deadlines.' },
          { name: 'Library Management System', tag: 'Completed', stack: 'Java, OOP, Data Structures, File I/O', desc: 'Library system with add, search, borrow, return flows and data persistence.' },
          { name: 'SmartTimeCoach', tag: 'Personal Project', stack: 'Python, Automation, Scheduling', desc: 'Python productivity assistant with automated reminders for tasks and study schedules.' }
        ],
        certs: [
          { name: 'Learn Git & GitHub', org: 'M3aarf Platform', date: 'Aug 2026', detail: 'Hands-on Git & GitHub course — version control, branching, merging, pull requests, and collaborative workflows.' },
          { name: 'AI Fundamentals', org: 'Google · Coursera', date: 'Aug 2026', detail: "Google's AI Fundamentals course through Coursera — machine learning basics, responsible AI, and how AI products are built." },
          { name: 'AI for All: From Basics to GenAI Practice', org: 'NVIDIA Academy', date: 'Mar 2026', detail: 'A hands-on NVIDIA track covering generative AI fundamentals, prompt engineering, and practical GenAI workflows.' },
          { name: 'AI Foundations', org: 'OpenAI Academy', date: 'Jul 2026', detail: "OpenAI's foundation course on large language models — how GPT models work, prompting, and responsible AI use." },
          { name: 'Claude 101', org: 'Anthropic', date: 'Jul 2026', detail: 'Anthropic\u2019s introduction to Claude — model capabilities, effective prompt design, and building with Claude safely.' },
          { name: 'Claude Code 101', org: 'Anthropic', date: 'Aug 2026', detail: 'Introduction to Claude Code — using Claude for coding tasks, understanding code generation, and best practices.' },
          { name: 'Claude Code in Action', org: 'Anthropic · Coursera', date: 'Aug 2026', detail: 'Hands-on course on practical Claude Code applications — real-world coding projects and advanced techniques.' },
          { name: 'CS101: Introduction to Programming I', org: 'Saylor Academy', date: 'Jan 2026', detail: 'A self-paced intro to programming — variables, control flow, functions, and algorithmic thinking.' },
          { name: 'ICDL Base Certification', org: 'Edraak', date: 'Jan 2026', detail: 'Core digital skills certification covering essential computer use, document editing, and online collaboration.' },
          { name: 'Critical Thinking in the Age of AI', org: 'HP LIFE', date: '2025', detail: 'HP LIFE course on evaluating AI outputs, spotting bias, and applying critical thinking to modern information.' },
          { name: 'Data Science & Analytics', org: 'HP LIFE', date: '2025', detail: 'HP LIFE course introducing data analysis — collecting, interpreting, and presenting data to support decisions.' }
        ],
        experience: {
          technical: 'Networking & IT Support Projects (2023 – Present): LAN design, Router/DHCP/DNS/NAT config, connectivity troubleshooting, technical documentation, community support.',
          milestones: [
            '2026 · NVIDIA AI Certification (Generative AI)',
            '2026 · OpenAI & Anthropic AI Tracks (AI Foundations, Claude 101, Claude Code)',
            '2025 · ICDL Certification (Edraak)',
            '2024 · Networking Projects (VLAN, DHCP/NAT segments)',
            '2023 · CS Journey Begins (Al-Azhar University)'
          ]
        },
        recommendations: [
          { author: 'Mr. Abdelbaset R. Almasri', role: 'Lecturer of Computer Science · Al-Azhar University' },
          { author: 'Dr. Adel A. Ahmed', role: 'Lecturer of Computer Science · Al-Azhar University' },
          { author: 'Yazan W. Abo_Elqomboz', role: 'Project Team Member' }
        ]
      },
      ar: {
        who: {
          name: 'عبدالله أيمن الغول',
          role: 'طالب علوم حاسوب · مهندس برمجيات طموح',
          uni: 'جامعة الأزهر',
          city: 'غزة، فلسطين',
          email: 'abdallhalghoul200@gmail.com',
          linkedin: 'linkedin.com/in/abdullah-al-ghoul-a254763a6',
          status: 'متاح للفرص'
        },
        skills: {
          programming: [
            { name: 'Java', tier: 4, label: 'خبير' },
            { name: 'JavaScript', tier: 3, label: 'متقدم' },
            { name: 'HTML5 / CSS3', tier: 4, label: 'خبير' },
            { name: 'C', tier: 3, label: 'متقدم' }
          ],
          networking: [
            { name: 'TCP/IP', tier: 4, label: 'خبير' },
            { name: 'VLAN', tier: 3, label: 'متقدم' },
            { name: 'DHCP / DNS / NAT', tier: 3, label: 'متقدم' },
            { name: 'Cisco Packet Tracer', tier: 3, label: 'متقدم' }
          ],
          tools: [
            { name: 'Git & GitHub', tier: 3, label: 'متقدم' },
            { name: 'أدوات الذكاء الاصطناعي', tier: 4, label: 'خبير' },
            { name: 'Windows', tier: 3, label: 'متقدم' },
            { name: 'Linux (أساسيات)', tier: 2, label: 'متوسط' }
          ],
          learning: ['تطوير الواجهات', 'Java OOP', 'هياكل البيانات', 'الخوارزميات', 'مبادئ هندسة البرمجيات']
        },
        projects: [
          { name: 'موقع البورتفوليو الشخصي', tag: 'مباشر · هذا الموقع', stack: 'HTML5, CSS3, JavaScript, i18n, RTL', desc: 'موقع شخصي ثنائي اللغة، متجاوب وعصري — هذا الموقع بالذات.' },
          { name: 'تصميم شبكة مؤسسية', tag: 'مكتمل', stack: 'Cisco Packet Tracer, VLAN, DHCP, DNS, NAT, Routing', desc: 'شبكة أعمال مُجزّأة باستخدام VLAN و DHCP و DNS و NAT و Router-on-a-Stick.' },
          { name: 'مختبر جامعي افتراضي ذكي', tag: 'مقترح', stack: 'RDP, Windows, Azure, Cloud Infra, VPN', desc: 'بيئة سطح مكتب سحابية للطلاب الذين لا يملكون حواسيب للوصول إلى بيئات البرمجة عبر RDP.' },
          { name: 'مركز الأزهر لتقنية المعلومات', tag: 'مباشر', stack: 'React, Tailwind CSS, Firebase, PWA', desc: 'منصة تعليمية ثنائية اللغة لطلاب IT في الأزهر — محاضرات وموارد ومواد دراسية، مع دعم PWA بدون إنترنت.' },
          { name: 'مدير المهام', tag: 'مشروع جماعي', stack: 'Java, OOP, File I/O', desc: 'تطبيق إدارة مهام جماعي مع إنشاء، تعيين، تتبع الحالة، ومواعيد نهائية.' },
          { name: 'نظام إدارة مكتبة', tag: 'مكتمل', stack: 'Java, OOP, Data Structures, File I/O', desc: 'نظام مكتبة بعمليات الإضافة والبحث والاستعارة والإرجاع مع حفظ البيانات.' },
          { name: 'SmartTimeCoach', tag: 'مشروع شخصي', stack: 'Python, Automation, Scheduling', desc: 'مساعد إنتاجية بلغة Python مع تذكيرات تلقائية للمهام وجداول الدراسة.' }
        ],
        certs: [
          { name: 'تعلّم Git و GitHub', org: 'منصة معارف', date: 'أغسطس 2026', detail: 'دورة عملية على Git و GitHub — إدارة الإصدارات، التفريع والدمج، طلبات السحب، وسير العمل التعاوني.' },
          { name: 'أساسيات الذكاء الاصطناعي (AI Fundamentals)', org: 'Google · Coursera', date: 'أغسطس 2026', detail: 'دورة Google لأساسيات الذكاء الاصطناعي عبر Coursera — أساسيات تعلم الآلة، الذكاء الاصطناعي المسؤول، وكيف تُبنى منتجات الذكاء الاصطناعي.' },
          { name: 'AI for All: From Basics to GenAI Practice', org: 'أكاديمية NVIDIA', date: 'مارس 2026', detail: 'مسار عملي من NVIDIA يغطي أساسيات الذكاء الاصطناعي التوليدي وهندسة الأوامر (Prompting) وتطبيقات GenAI العملية.' },
          { name: 'AI Foundations', org: 'أكاديمية OpenAI', date: 'يوليو 2026', detail: 'دورة OpenAI التأسيسية عن نماذج اللغة الكبيرة — كيف تعمل نماذج GPT، والبرمجة بالأوامر، والاستخدام المسؤول للذكاء الاصطناعي.' },
          { name: 'Claude 101', org: 'Anthropic', date: 'يوليو 2026', detail: 'مقدمة من Anthropic إلى Claude — قدرات النموذج، تصميم الأوامر الفعّالة، والبناء مع Claude بأمان.' },
          { name: 'Claude Code 101', org: 'Anthropic', date: 'أغسطس 2026', detail: 'مقدمة إلى Claude Code — استخدام Claude في مهام البرمجة، وفهم توليد الكود، وأفضل الممارسات.' },
          { name: 'Claude Code in Action', org: 'Anthropic · Coursera', date: 'أغسطس 2026', detail: 'دورة عملية حول تطبيقات Claude Code الواقعية — مشاريع برمجية حقيقية وتقنيات متقدمة.' },
          { name: 'CS101: Introduction to Programming I', org: 'أكاديمية Saylor', date: 'يناير 2026', detail: 'مقدمة ذاتية التعلّم للبرمجة — المتغيرات، التحكم في التدفق، الدوال، والتفكير الخوارزمي.' },
          { name: 'ICDL Base Certification', org: 'إدراك', date: 'يناير 2026', detail: 'شهادة مهارات رقمية أساسية تغطي استخدام الحاسوب الأساسي وتحرير المستندات والتعاون عبر الإنترنت.' },
          { name: 'Critical Thinking in the Age of AI', org: 'HP LIFE', date: '2025', detail: 'دورة من HP LIFE عن تقييم مخرجات الذكاء الاصطناعي، واكتشاف التحيز، وتطبيق التفكير النقدي على المعلومات الحديثة.' },
          { name: 'Data Science & Analytics', org: 'HP LIFE', date: '2025', detail: 'دورة من HP LIFE مقدمة لتحليل البيانات — جمع البيانات وتفسيرها وعرضها لدعم القرارات.' }
        ],
        experience: {
          technical: 'مشاريع الشبكات ودعم IT (2023 – الآن): تصميم LAN، إعداد Router/DHCP/DNS/NAT، استكشاف أعطال الاتصال، التوثيق التقني، الدعم التقني للمجتمع.',
          milestones: [
            '2026 · شهادة NVIDIA للذكاء الاصطناعي',
            '2026 · مسارات OpenAI و Anthropic (AI Foundations, Claude 101, Claude Code)',
            '2025 · شهادة ICDL (إدراك)',
            '2024 · مشاريع الشبكات (VLAN, DHCP/NAT)',
            '2023 · بداية رحلة علوم الحاسوب (جامعة الأزهر)'
          ]
        },
        recommendations: [
          { author: 'أ. Abdelbaset R. Almasri', role: 'مدرس علوم الحاسوب · جامعة الأزهر' },
          { author: 'د. Adel A. Ahmed', role: 'مدرس علوم الحاسوب · جامعة الأزهر' },
          { author: 'Yazan W. Abo_Elqomboz', role: 'زميل مشروع' }
        ]
      }
    },

    // Intent patterns. Each pattern is {intent, score}.
    // Scoring: 1 = weak match, 2 = strong, 3 = definitive.
    PATTERNS: {
      greeting: [
        { re: /\b(hi|hello|hey|hiya|howdy|hola|salam|salut)\b/i, score: 2 },
        { re: /^(مرحبا|أهلا|اهلا|السلام|سلام|هلا|صباح|مساء)/i, score: 2 },
        { re: /\b(good\s*(morning|evening|afternoon))\b/i, score: 2 }
      ],
      who: [
        { re: /\b(who\s*(are|r)\s*(you|u)|your\s*name|tell\s*me\s*about\s*(yourself|you))\b/i, score: 2 },
        { re: /\b(about\s*(you|abdullah|him|portfolio))\b/i, score: 2 },
        { re: /^(من\s*(انت|أنت|أنتم)|عرفني|تعريف|مين)/i, score: 2 }
      ],
      skills: [
        { re: /\b(skills?|expertise|proficien|stack|technolog|what\s*do\s*(you|u|he)\s*know|language|frameworks?)\b/i, score: 2 },
        { re: /\b(what\s*(can\s*you|are\s*you\s*good\s*at)|strengths?)\b/i, score: 2 },
        { re: /(مهارات|تقنيات|خبرات|أعرف|يتقن|تقنية|تكنولوجيا|لغات\s*برمجة)/i, score: 2 }
      ],
      projects: [
        { re: /\b(projects?|portfolio\s*work|built|apps?|case\s*studies?)\b/i, score: 2 },
        { re: /\b(show|list|tell).*(project|work|app)/i, score: 2 },
        { re: /(مشاريع|أعمال|تطبيقات|ابني|طورت|مشروع)/i, score: 2 }
      ],
      certs: [
        { re: /\b(certificat|cert|credential|nvidia|openai|anthropic|saylor|icdl|hp\s*life)\b/i, score: 3 },
        { re: /(شهادات|شهادة|معتمدة|مؤهلات|دورات|دورة|اعتمادات)/i, score: 2 }
      ],
      experience: [
        { re: /\b(experience|work\s*history|background|journey|career|years|months|milestones?|achievements?|2026|2025)\b/i, score: 2 },
        { re: /\b(internship|job|worked\s*at|employed|projects?\s*at)\b/i, score: 1 },
        { re: /(خبرة|خبرات|عمل|وظيفة|مسيرة|سيرة|المسار|التاريخ\s*الوظيفي|إنجاز|إنجازات|محطات|2026|2025)/i, score: 2 }
      ],
      contact: [
        { re: /\b(contact|reach|email|mail|hire|recruit|opportunit|get\s*in\s*touch|collaborat)\b/i, score: 2 },
        { re: /\b(phone|whatsapp|telegram|message\s*me|write\s*to)\b/i, score: 2 },
        { re: /(تواصل|اتصال|ايميل|إيميل|بريد|راسل|توظيف|فرص|تعاون|واتس)/i, score: 2 }
      ],
      education: [
        { re: /\b(university|college|school|al[-\s]?azhar|degree|stud(y|ies|ying)|education|alma\s*mater)\b/i, score: 2 },
        { re: /(جامعة|كلية|معهد|دراسة|تعليم|بكالوريوس|تخصص|أزهر)/i, score: 2 }
      ],
      location: [
        { re: /\b(where\s*(are|r)\s*(you|u|he)|location|based\s*in|from\s*where|city|country|palestine|gaza)\b/i, score: 2 },
        { re: /(أين|وين|مدينة|بلد|فلسطين|غزة|الموقع\s*الجغرافي)/i, score: 2 }
      ],
      thanks: [
        { re: /\b(thanks|thank\s*you|thx|ty|appreciate|grateful|helpful)\b/i, score: 2 },
        { re: /(شكرا|شكراً|ممتن|يعطيك\s*العافية|يسلمو)/i, score: 2 }
      ],
      joke: [
        { re: /\b(joke|funny|make\s*me\s*laugh|humor)\b/i, score: 2 },
        { re: /(نكتة|نكت|مرح|ضحكني|فكاهة)/i, score: 2 }
      ],
      capabilities: [
        { re: /\b(what\s*can\s*you\s*do|your\s*abilities|help\s*me\s*with|features?)\b/i, score: 2 },
        { re: /(شو\s*بتقدر|ايش\s*تستطيع|إيش\s*تعرف|إيش\s*تقدر|وش\s*تعرف)/i, score: 2 }
      ],
      cv: [
        { re: /\b(cv|resume|curriculum\s*vitae)\b/i, score: 2 },
        { re: /(سيرة\s*ذاتية|سيرتي|السيرة)/i, score: 2 }
      ],
      feedback: [
        { re: /\b(recommendations?|references?|testimonials?|endors\w*|feedback|who\s+recommended|what\s+(did|do)\s+(professors?|teachers?)\s+say)\b/i, score: 3 },
        { re: /(توصية|توصيات|أوصى|أوصوا|الأساتذة|الاساتذة|المدرسين|قالوا عن|انطباع)/i, score: 3 }
      ]
    },

    // Response templates per intent, per language.
    // Each returns { text: '...', chips: [...], suggestions: [...] }
    RESPOND: {
      en: {
        greeting: (ctx) => {
          const time = new Date().getHours();
          const tod = time < 12 ? 'morning' : time < 18 ? 'afternoon' : 'evening';
          return {
            text: `Good ${tod}! 👋 I'm Abdullah's portfolio assistant — I know everything about his work, skills, and projects.\n\nAsk me anything, or pick a suggestion below.`,
            suggestions: ['What are his skills?', 'Show me his projects', 'How can I contact him?']
          };
        },
        who: (ctx) => {
          const k = ctx.kb.who;
          return {
            text: `**${k.name}** is a **${k.role}** at **${k.uni}**, based in **${k.city}**.\n\nHe's passionate about software engineering, networking, and AI, and is currently **${k.status}**.`,
            chips: [k.city, k.uni, 'CS Student'],
            suggestions: ['What are his skills?', 'Tell me about his projects', 'How do I contact him?']
          };
        },
        skills: (ctx) => {
          const s = ctx.kb.skills;
          const tierDot = (t) => '●'.repeat(t) + '○'.repeat(4 - t);
          const block = (title, items) => `**${title}**\n${items.map(i => `• ${i.name} — ${tierDot(i.tier)}  _(${i.label})_`).join('\n')}`;
          return {
            text:
              `Here's Abdullah's skill set, organized by domain:\n\n` +
              `${block('Programming', s.programming)}\n\n` +
              `${block('Networking & Infra', s.networking)}\n\n` +
              `${block('Tools & Platforms', s.tools)}\n\n` +
              `**Currently Learning:**\n${s.learning.map(l => `• ${l}`).join('\n')}\n\n` +
              `_Tier scale: ● = Beginner · ●● = Intermediate · ●●● = Advanced · ●●●● = Expert_`,
            suggestions: ['What is he best at?', 'Show me projects using these skills', 'Tell me about his networking experience']
          };
        },
        projects: (ctx) => {
          const list = ctx.kb.projects.map(p => `**${p.name}** _(${p.tag})_\n${p.desc}\n_Stack:_ ${p.stack}`).join('\n\n');
          return {
            text: `Abdullah has **${ctx.kb.projects.length}** projects across web, networking, cloud, and Java:\n\n${list}`,
            suggestions: ['Which is the biggest project?', 'Show me the live portfolio', 'What tech does he use?']
          };
        },
        certs: (ctx) => {
          const q = (ctx.query || '').toLowerCase();
          const aliases = [
            ['nvidia', 'AI for All'], ['ai for all', 'AI for All'], ['genai', 'AI for All'],
            ['git', 'Learn Git'], ['github', 'Learn Git'], ['m3aarf', 'Learn Git'],
            ['ai fundamentals', 'AI Fundamentals'], ['google', 'AI Fundamentals'],
            ['ai foundations', 'AI Foundations'], ['openai', 'AI Foundations'],
            ['claude', 'Claude 101'], ['anthropic', 'Claude 101'],
            ['cs101', 'CS101: Introduction to Programming I'], ['saylor', 'CS101: Introduction to Programming I'],
            ['icdl', 'ICDL Base Certification'], ['edraak', 'ICDL Base Certification'],
            ['critical thinking', 'Critical Thinking in the Age of AI'], ['hp life', 'HP LIFE'],
            ['data science', 'Data Science & Analytics']
          ];
          const match = aliases.find(([k]) => q.includes(k));
          if (match) {
            const c = ctx.kb.certs.find(x => x.name.toLowerCase().includes(match[1].toLowerCase()));
            if (c) {
              return {
                text: `**${c.name}** — ${c.org} _(${c.date})_\n\n${c.detail}`,
                suggestions: ['Show me the NVIDIA cert', 'Tell me about his learning path', 'What are all his certifications?']
              };
            }
          }
          const list = ctx.kb.certs.map(c => `• **${c.name}** — ${c.org} _(${c.date})_`).join('\n');
          return {
            text: `Abdullah holds **${ctx.kb.certs.length}** verified certifications:\n\n${list}\n\nNVIDIA, OpenAI, and Anthropic tracks lead the AI credentials.`,
            suggestions: ['Show me the NVIDIA cert', 'Tell me about his learning path', 'What does the AI Foundations cert cover?']
          };
        },
        experience: (ctx) => {
          const m = ctx.kb.experience.milestones.map(x => `• ${x}`).join('\n');
          return {
            text: `**Technical Experience**\n${ctx.kb.experience.technical}\n\n**Milestones:**\n${m}`,
            suggestions: ['Show me the networking project', 'Why is the 2026 NVIDIA cert important?', 'What is he doing now?']
          };
        },
        contact: (ctx) => {
          const k = ctx.kb.who;
          return {
            text: `You can reach Abdullah via:\n\n• **Email:** ${k.email}\n• **LinkedIn:** ${k.linkedin}\n\nHe's **${k.status}**, so feel free to reach out about internships, junior roles, or collaboration.`,
            chips: [k.email, 'LinkedIn', 'Open to opportunities'],
            suggestions: ['Where is he based?', 'Download his CV', 'Show me his best project']
          };
        },
        education: (ctx) => {
          return {
            text: `Abdullah is pursuing a **B.Sc. in Computer Science** at **${ctx.kb.who.uni}** (2023 – 2027/2028 expected), based in **${ctx.kb.who.city}**.`,
            suggestions: ['What does he study?', 'Show me his projects', 'How do I contact him?']
          };
        },
        location: (ctx) => {
          return {
            text: `Abdullah is based in **${ctx.kb.who.city}** and studies at **${ctx.kb.who.uni}**.`,
            suggestions: ['How can I contact him?', 'What is he working on?', 'Tell me about his projects']
          };
        },
        thanks: () => ({
          text: `You're very welcome! 😊 If you want to go further, the **Contact** section has direct email and LinkedIn. Happy to help with anything else.`,
          suggestions: ['Show me his best project', 'What are his top skills?', 'Where is he based?']
        }),
        joke: () => ({
          text: `Why do programmers prefer dark mode? — Because light attracts bugs. 🐛\n\n_(Ba-dum-tss.)_ Got more serious questions? Try the suggestions below.`,
          suggestions: ['What are his skills?', 'Show me projects', 'How do I contact him?']
        }),
        capabilities: () => ({
          text: `I can answer questions about:\n\n• Who Abdullah is and where he's based\n• His skills and tech stack\n• His projects (live + completed)\n• Certifications and learning path\n• Experience and milestones\n• How to get in touch\n• His CV and contact channels\n\nI'm a **local assistant** — everything I know is baked into this page, so I work offline and your questions stay private. 🔒`,
          suggestions: ['Show me his skills', 'List the projects', 'Contact info']
        }),
        cv: (ctx) => {
          return {
            text: `Abdullah's CV is available on this site. You can download it from the **hero section** (top of the page) — look for the **Download CV** button.`,
            suggestions: ['Show me his projects', 'What are his skills?', 'How do I contact him?']
          };
        },
        feedback: (ctx) => {
          const recs = ctx.kb.recommendations.map(r => `• **${r.author}** — _${r.role}_`).join('\n');
          return {
            text: `Here's what people who know Abdullah say about him:\n\n${recs}\n\nYou can read the full recommendations in the **Feedback** section.`,
            suggestions: ['What are his skills?', 'Show me his projects', 'How do I contact him?']
          };
        },
        fallback: (ctx) => {
          return {
            text: `Hmm, I'm not 100% sure what you mean. I can help with questions about **skills**, **projects**, **certifications**, **experience**, and **contact info**.\n\nTry one of these:`,
            suggestions: ['What are his skills?', 'Show me his projects', 'List his certifications', 'How do I contact him?']
          };
        }
      },
      ar: {
        greeting: (ctx) => {
          const time = new Date().getHours();
          const tod = time < 12 ? 'صباح الخير' : 'مساء الخير';
          return {
            text: `${tod}! 👋 أنا مساعد بورتفوليو عبدالله — أعرف كل شي عن أعماله ومهاراته ومشاريعه.\n\nاسألني أي شي، أو اختار سؤال من الاقتراحات تحت.`,
            suggestions: ['ما هي مهاراته؟', 'اعرض مشاريعه', 'كيف أتواصل معه؟']
          };
        },
        who: (ctx) => {
          const k = ctx.kb.who;
          return {
            text: `**${k.name}** — **${k.role}** في **${k.uni}**، يقيم في **${k.city}**.\n\nشغوف بهندسة البرمجيات والشبكات والذكاء الاصطناعي، وحالياً **${k.status}**.`,
            chips: [k.city, k.uni, 'طالب علوم حاسوب'],
            suggestions: ['ما هي مهاراته؟', 'حدثني عن مشاريعه', 'كيف أتواصل معه؟']
          };
        },
        skills: (ctx) => {
          const s = ctx.kb.skills;
          const tierDot = (t) => '●'.repeat(t) + '○'.repeat(4 - t);
          const block = (title, items) => `**${title}**\n${items.map(i => `• ${i.name} — ${tierDot(i.tier)}  _(${i.label})_`).join('\n')}`;
          return {
            text:
              `هذه مهارات عبدالله، مرتبة حسب المجال:\n\n` +
              `${block('البرمجة', s.programming)}\n\n` +
              `${block('الشبكات والبنية التحتية', s.networking)}\n\n` +
              `${block('الأدوات والمنصات', s.tools)}\n\n` +
              `**يتعلم حالياً:**\n${s.learning.map(l => `• ${l}`).join('\n')}\n\n` +
              `_مقياس المستوى: ● مبتدئ · ●● متوسط · ●●● متقدم · ●●●● خبير_`,
            suggestions: ['ما أقوى مهاراته؟', 'اعرض مشاريعه', 'حدثني عن خبرته في الشبكات']
          };
        },
        projects: (ctx) => {
          const list = ctx.kb.projects.map(p => `**${p.name}** _(${p.tag})_\n${p.desc}\n_التقنيات:_ ${p.stack}`).join('\n\n');
          return {
            text: `عبدالله عنده **${ctx.kb.projects.length}** مشاريع في الويب والشبكات والـ Cloud و Java:\n\n${list}`,
            suggestions: ['ما أكبر مشروع عنده؟', 'اعرض الموقع المباشر', 'شو التقنيات اللي يستخدمها؟']
          };
        },
        certs: (ctx) => {
          const q = (ctx.query || '').toLowerCase();
          const aliases = [
            ['nvidia', 'AI for All'], ['ai for all', 'AI for All'], ['genai', 'AI for All'],
            ['git', 'Learn Git'], ['github', 'Learn Git'], ['m3aarf', 'Learn Git'],
            ['ai fundamentals', 'AI Fundamentals'], ['google', 'AI Fundamentals'],
            ['ai foundations', 'AI Foundations'], ['openai', 'AI Foundations'],
            ['claude', 'Claude 101'], ['anthropic', 'Claude 101'],
            ['cs101', 'CS101: Introduction to Programming I'], ['saylor', 'CS101: Introduction to Programming I'],
            ['icdl', 'ICDL Base Certification'], ['edraak', 'ICDL Base Certification'],
            ['critical thinking', 'Critical Thinking in the Age of AI'], ['hp life', 'HP LIFE'],
            ['data science', 'Data Science & Analytics']
          ];
          const match = aliases.find(([k]) => q.includes(k));
          if (match) {
            const c = ctx.kb.certs.find(x => x.name.toLowerCase().includes(match[1].toLowerCase()));
            if (c) {
              return {
                text: `**${c.name}** — ${c.org} _(${c.date})_\n\n${c.detail}`,
                suggestions: ['وريني شهادة NVIDIA', 'حدثني عن مسار التعلم', 'شو كل شهاداته؟']
              };
            }
          }
          const list = ctx.kb.certs.map(c => `• **${c.name}** — ${c.org} _(${c.date})_`).join('\n');
          return {
            text: `عبدالله حاصل على **${ctx.kb.certs.length}** شهادات معتمدة:\n\n${list}\n\nمسارات NVIDIA و OpenAI و Anthropic هي القمة في شهادات الذكاء الاصطناعي.`,
            suggestions: ['وريني شهادة NVIDIA', 'حدثني عن مسار التعلم', 'شو تغطي شهادة AI Foundations؟']
          };
        },
        experience: (ctx) => {
          const m = ctx.kb.experience.milestones.map(x => `• ${x}`).join('\n');
          return {
            text: `**الخبرة التقنية**\n${ctx.kb.experience.technical}\n\n**الإنجازات:**\n${m}`,
            suggestions: ['وريني مشروع الشبكات', 'ليش شهادة NVIDIA 2026 مهمة؟', 'شو عم يشتغل هس؟']
          };
        },
        contact: (ctx) => {
          const k = ctx.kb.who;
          return {
            text: `تقدر تتواصل مع عبدالله عبر:\n\n• **الإيميل:** ${k.email}\n• **لينكدإن:** ${k.linkedin}\n\nهو **${k.status}**، فلا تتردد تتواصل معه للتدريب أو وظائف مبتدئة أو تعاون.`,
            chips: [k.email, 'LinkedIn', 'متاح للفرص'],
            suggestions: ['وين ساكن؟', 'حمّل سيرته الذاتية', 'وريني أفضل مشروع عنده']
          };
        },
        education: (ctx) => {
          return {
            text: `عبدالله يدرس **بكالوريوس علوم الحاسوب** في **${ctx.kb.who.uni}** (2023 – 2027/2028 متوقع)، ومقيم في **${ctx.kb.who.city}**.`,
            suggestions: ['شو يدرس؟', 'اعرض مشاريعه', 'كيف أتواصل معه؟']
          };
        },
        location: (ctx) => {
          return {
            text: `عبدالله مقيم في **${ctx.kb.who.city}** ويدرس في **${ctx.kb.who.uni}**.`,
            suggestions: ['كيف أتواصل معه؟', 'شو عم يشتغل؟', 'حدثني عن مشاريعه']
          };
        },
        thanks: () => ({
          text: `العفو! 😊 إذا بدك تكمل، قسم **التواصل** فيه الإيميل ولينكدإن مباشرة. وإذا عندك أسئلة ثانية، أنا هون.`,
          suggestions: ['وريني أفضل مشروع', 'شو أعلى مهاراته؟', 'وين ساكن؟']
        }),
        joke: () => ({
          text: `ليش المبرمجين بيحبوا الـ Dark Mode؟ — لأن الـ Light بيجذب الـ Bugs. 🐛\n\n_(دق على الطبل.)_ عندك أسئلة جدية؟ جرب الاقتراحات تحت.`,
          suggestions: ['ما هي مهاراته؟', 'اعرض مشاريعه', 'كيف أتواصل معه؟']
        }),
        capabilities: () => ({
          text: `أقدر أساعدك بأسئلة عن:\n\n• مين عبدالله وين ساكن\n• مهاراته والتقنيات اللي يعرفها\n• مشاريعه (المباشرة والمكتملة)\n• شهاداته ومسار التعلم\n• خبرته والإنجازات\n• كيف تتواصل معه\n• سيرته الذاتية وقنوات التواصل\n\nأنا **مساعد محلي** — كل المعلومات موجودة بالصفحة، فأنا أخدم بدون إنترنت وأسئلتك تبقى خاصة. 🔒`,
          suggestions: ['وريني مهاراته', 'اعرض المشاريع', 'معلومات التواصل']
        }),
        cv: (ctx) => {
          return {
            text: `سيرة عبدالله الذاتية موجودة على الموقع. تقدر تحمّلها من قسم **البطل** بأعلى الصفحة — دوّر على زر **Download CV**.`,
            suggestions: ['اعرض مشاريعه', 'ما هي مهاراته؟', 'كيف أتواصل معه؟']
          };
        },
        feedback: (ctx) => {
          const recs = ctx.kb.recommendations.map(r => `• **${r.author}** — _${r.role}_`).join('\n');
          return {
            text: `هذا اللي قالوه الأشخاص اللي يعرفون عبدالله:\n\n${recs}\n\nتقدر تقرأ التوصيات كاملة في قسم **الآراء**.`,
            suggestions: ['ما هي مهاراته؟', 'اعرض مشاريعه', 'كيف أتواصل معه؟']
          };
        },
        fallback: (ctx) => {
          return {
            text: `همم، ما فهمت قصدك بالضبط. أقدر أساعدك بأسئلة عن **المهارات** و **المشاريع** و **الشهادات** و **الخبرة** و **التواصل**.\n\nجرب واحد من هالاقتراحات:`,
            suggestions: ['ما هي مهاراته؟', 'اعرض مشاريعه', 'شهاداته', 'كيف أتواصل معه؟']
          };
        }
      }
    },

    /**
     * Classify user input to an intent using weighted pattern matching.
     * Returns the best-matching intent name and confidence score.
     */
    classify(text, lang) {
      if (!text) return { intent: 'fallback', confidence: 0 };
      const norm = text.trim().toLowerCase();
      const scores = {};
      Object.entries(this.PATTERNS).forEach(([intent, patterns]) => {
        let score = 0;
        patterns.forEach(p => { if (p.re.test(norm)) score += p.score; });
        if (score) scores[intent] = score;
      });
      const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      if (!entries.length) return { intent: 'fallback', confidence: 0 };
      const [topIntent, topScore] = entries[0];
      // Fallback if top score is too low
      if (topScore < 1) return { intent: 'fallback', confidence: topScore };
      return { intent: topIntent, confidence: topScore };
    },

    /**
     * Generate a response for the classified intent.
     * Returns { text, chips?, suggestions? }
     */
    respond(text, lang) {
      const kb = this.KB[lang] || this.KB.en;
      const { intent, confidence } = this.classify(text, lang);
      const tpl = this.RESPOND[lang] || this.RESPOND.en;
      const fn = tpl[intent] || tpl.fallback;
      try {
        return { ...fn({ kb, query: text }), intent, confidence };
      } catch (e) {
        return { ...tpl.fallback({ kb }), intent: 'fallback', confidence: 0 };
      }
    },

    /**
     * Build context-aware starter suggestions based on the section the
     * user is currently viewing (or generic if top-of-page).
     */
    sectionSuggestions(sectionId, lang) {
      const en = {
        home: ['Who is Abdullah?', 'What are his skills?', 'How do I contact him?'],
        about: ['Tell me about his education', 'What does he study?', 'What is he passionate about?'],
        skills: ['What is he best at?', 'What is he learning?', 'Show me projects using these skills'],
        projects: ['Which is the biggest project?', 'What tech does he use?', 'Show me the live portfolio'],
        certs: ['Tell me about the NVIDIA cert', 'Why AI certifications?', 'Show me the latest cert'],
        experience: ['What is his work experience?', 'Show me the 2026 milestones', 'What is he doing now?'],
        feedback: ['Read a recommendation', 'Who recommended him?', 'What do professors say?'],
        contact: ['How do I email him?', 'Is he open to opportunities?', 'Where is he based?']
      };
      const ar = {
        home: ['مين عبدالله؟', 'ما هي مهاراته؟', 'كيف أتواصل معه؟'],
        about: ['حدثني عن دراسته', 'شو تخصصه؟', 'شو شغوف فيه؟'],
        skills: ['شو أقوى مهاراته؟', 'شو عم يتعلم؟', 'وريني مشاريع بتستخدم هاي المهارات'],
        projects: ['شو أكبر مشروع؟', 'شو التقنيات؟', 'اعرض الموقع المباشر'],
        certs: ['حدثني عن شهادة NVIDIA', 'ليش شهادات AI؟', 'وريني آخر شهادة'],
        experience: ['شو خبرته العملية؟', 'وريني إنجازات 2026', 'شو عم يشتغل هس؟'],
        feedback: ['اقرأ توصية', 'مين أوصى فيه؟', 'شو قالوا الأساتذة؟'],
        contact: ['كيف أرسل له إيميل؟', 'هل متاح للفرص؟', 'وين ساكن؟']
      };
      const table = lang === 'ar' ? ar : en;
      return table[sectionId] || table.home;
    },

    /**
     * Try to detect which section is currently in view by reading the
     * scrollY against section offsets. Cheap and good-enough.
     */
    currentSection() {
      const sections = ['home', 'about', 'skills', 'projects', 'certs', 'experience', 'feedback', 'contact'];
      const scroll = window.scrollY + window.innerHeight * 0.35;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (scroll >= top && scroll < bottom) return id;
      }
      return 'home';
    }
  };

  // ============== Preloader ==============

  function setupPreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;

    function hide() {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
    }

    // Fallback: hide after 3s regardless
    setTimeout(hide, 3000);
  }

  // ============== Navigation Dots ==============

  function setupNavDots() {
    const sections = ['home', 'about', 'skills', 'projects', 'certs', 'experience', 'feedback', 'contact'];
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'nav-dots';
    dotsContainer.setAttribute('aria-label', 'Section navigation');

    const dotLabels = [];

    sections.forEach((id) => {
      const dot = document.createElement('button');
      dot.className = 'nav-dot';
      dot.setAttribute('data-section', id);
      dot.setAttribute('type', 'button');

      const label = document.createElement('span');
      label.className = 'nav-dot-label';
      dot.appendChild(label);
      dotLabels.push({ dot, label, id });

      dot.addEventListener('click', () => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });

      dotsContainer.appendChild(dot);
    });

    function localizeDotLabels() {
      const dict = i18n[state.lang];
      dotLabels.forEach(({ dot, label, id }) => {
        const text = dict['nav.' + id] || id;
        label.textContent = text;
        dot.setAttribute('aria-label', text);
      });
    }
    localizeDotLabels();
    document.addEventListener('langchange', localizeDotLabels);

    document.body.appendChild(dotsContainer);

    function updateActive() {
      const scroll = window.scrollY + window.innerHeight * 0.4;
      let activeId = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (scroll >= top && scroll < bottom) {
          activeId = id;
          break;
        }
      }
      dotsContainer.querySelectorAll('.nav-dot').forEach((dot) => {
        const isActive = dot.dataset.section === activeId;
        dot.classList.toggle('active', isActive);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /**
   * Setup the AI assistant UI, event handlers, and message flow.
   */
  function setupAssistant() {
    const root = document.getElementById('ai-assistant');
    if (!root) return;
    const fab = document.getElementById('ai-fab');
    const panel = document.getElementById('ai-panel');
    const list = document.getElementById('ai-messages');
    const form = document.getElementById('ai-form');
    const input = document.getElementById('ai-input');
    const send = document.getElementById('ai-send');
    const suggestions = document.getElementById('ai-suggestions');
    const clearBtn = document.getElementById('ai-clear');
    const minBtn = document.getElementById('ai-minimize');

    const isOpen = () => root.dataset.open === 'true';
    const setOpen = (v) => {
      root.dataset.open = v ? 'true' : 'false';
      panel.hidden = !v;
      fab.setAttribute('aria-expanded', v ? 'true' : 'false');
      fab.setAttribute('aria-label', v ? 'Close portfolio assistant' : 'Open portfolio assistant');
      if (v) {
        // Refresh Lucide icons inside the now-visible panel
        if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });
        setTimeout(() => input.focus({ preventScroll: true }), 100);
        // First-open greeting
        if (list.children.length === 0) {
          // Render any persisted memory before the live greeting
          const mem = loadAIMemory();
          if (mem.length) renderMemoryMessages(list, state.lang);
          sendUserMessage('');
        }
      }
    };

    fab.addEventListener('click', () => setOpen(!isOpen()));
    minBtn.addEventListener('click', () => setOpen(false));
    clearBtn.addEventListener('click', () => {
      list.innerHTML = '';
      renderSuggestions(AI.sectionSuggestions(AI.currentSection(), state.lang));
      sendUserMessage('');
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        fab.focus();
      }
    });

    // Quick-open shortcut: "/" or Ctrl/Cmd+K focuses the assistant input.
    // Ignored while the user is typing in any field or editing content.
    document.addEventListener('keydown', (e) => {
      const inField = !!(e.target && e.target.closest && e.target.closest('input, textarea, select, [contenteditable]'));
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!isOpen()) setOpen(true);
        setTimeout(() => input.focus({ preventScroll: true }), 50);
        return;
      }
      if (e.key === '/' && !inField) {
        e.preventDefault();
        if (!isOpen()) setOpen(true);
        setTimeout(() => input.focus({ preventScroll: true }), 50);
      }
    });

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function nl2br(s) {
      return escapeHtml(s).replace(/\n/g, '<br>');
    }
    function renderInlineMd(s) {
      // **bold**, _italic_, `code`, [text](url)
      let out = nl2br(s);
      out = out.replace(/`([^`]+)`/g, (_, x) => `<code>${x}</code>`);
      out = out.replace(/\*\*([^*]+)\*\*/g, (_, x) => `<strong>${x}</strong>`);
      out = out.replace(/_([^_]+)_/g, (_, x) => `<em>${x}</em>`);
      out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
        const safe = /^https?:|^mailto:|^#/.test(u) ? u : '#';
        return `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener">${t}</a>`;
      });
      return out;
    }

    function avatarSvg(role) {
      const isUser = role === 'user';
      const icon = isUser ? 'user' : 'bot';
      return `<div class="ai-msg-avatar" aria-hidden="true"><i data-lucide="${icon}"></i></div>`;
    }

    function addMessage(role, html) {
      const div = document.createElement('div');
      div.className = `ai-msg ${role}`;
      div.innerHTML = `${avatarSvg(role)}<div class="ai-msg-bubble">${html}</div>`;
      list.appendChild(div);
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide', attrs: {} });
      // Smooth scroll with requestAnimationFrame
      requestAnimationFrame(() => {
        list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
      });
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'ai-msg assistant ai-typing-msg';
      div.innerHTML = `${avatarSvg('assistant')}<div class="ai-typing" aria-label="Assistant is typing"><span></span><span></span><span></span></div>`;
      list.appendChild(div);
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });
      requestAnimationFrame(() => {
        list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
      });
      return div;
    }

    function removeTyping(node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }

    function renderChips(arr) {
      if (!arr || !arr.length) return '';
      return `<div class="ai-chips">${arr.map(c => `<span>${escapeHtml(c)}</span>`).join('')}</div>`;
    }

    function renderSuggestions(arr) {
      if (!suggestions) return;
      const fragment = document.createDocumentFragment();
      // Quick action chips (real actions, not queries)
      const qa = AI_QUICK_ACTIONS[state.lang] || AI_QUICK_ACTIONS.en;
      qa.forEach(q => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-suggestion ai-quick';
        btn.innerHTML = `<i data-lucide="${q.icon}"></i><span>${q.label}</span>`;
        btn.addEventListener('click', () => q.action());
        fragment.appendChild(btn);
      });
      // Divider
      if (arr && arr.length) {
        const sep = document.createElement('span');
        sep.className = 'ai-suggestion-sep';
        sep.textContent = '·';
        fragment.appendChild(sep);
      }
      // Q&A suggestion chips (typed text)
      (arr || []).forEach(s => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-suggestion';
        btn.textContent = s;
        btn.addEventListener('click', () => {
          input.value = s;
          form.requestSubmit();
        });
        fragment.appendChild(btn);
      });
      suggestions.innerHTML = '';
      suggestions.appendChild(fragment);
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });
    }

    function sendUserMessage(text) {
      const lang = state.lang;
      const kb = AI.KB[lang] || AI.KB.en;
      const userText = (text || '').trim();

      // If empty, show the greeting/section starter
      if (!userText) {
        const greet = AI.RESPOND[lang]?.greeting || AI.RESPOND.en.greeting;
        const section = AI.currentSection();
        const sectionStarters = AI.sectionSuggestions(section, lang);
        // Use greeting + section-specific tips
        const greetResp = greet({ kb });
        const text = greetResp.text + `\n\n_${lang === 'ar' ? 'بناءً على القسم اللي فيه:' : 'Based on the section you\'re in:'} **${section.toUpperCase()}**_${lang === 'ar' ? '، جرّب:' : ', try:'}`;
        addMessage('assistant', renderInlineMd(text));
        renderSuggestions(sectionStarters);
        return;
      }

      addMessage('user', renderInlineMd(userText));
      input.value = '';
      send.disabled = true;
      // Save user message to memory immediately
      const mem = loadAIMemory();
      mem.unshift({ role: 'user', text: userText, t: Date.now() });
      saveAIMemory(mem);
      const typing = showTyping();

      // Simulated "thinking" delay for natural feel (very short)
      const delay = 380 + Math.min(900, userText.length * 6);
      setTimeout(async () => {
        removeTyping(typing);
        // Try the optional LLM endpoint (same-origin /api/chat) first.
        // If it's missing, unconfigured, or fails, fall back to the built-in rules.
        let r = null;
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 6000);
          const resp = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText, lang }),
            signal: ctrl.signal
          });
          clearTimeout(timer);
          const data = await resp.json();
          if (data && !data.fallback && typeof data.text === 'string' && data.text.trim()) {
            r = { text: data.text.trim(), chips: [] };
          }
        } catch (e) { /* network / missing endpoint → rules */ }
        if (!r) r = AI.respond(userText, lang);

        const html = renderInlineMd(r.text) + renderChips(r.chips);
        addMessage('assistant', html);
        renderSuggestions(r.suggestions || AI.sectionSuggestions(AI.currentSection(), lang));
        send.disabled = false;
        input.focus({ preventScroll: true });
        // Save assistant reply to memory (truncate long replies)
        const mem2 = loadAIMemory();
        mem2.unshift({ role: 'assistant', text: r.text.length > 280 ? r.text.slice(0, 280) + '…' : r.text, t: Date.now() });
        saveAIMemory(mem2);
      }, delay);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = input.value;
      if (!t.trim()) return;
      sendUserMessage(t);
    });

    input.addEventListener('input', () => {
      send.disabled = !input.value.trim();
    });

    // Refresh suggestions when language changes
    document.addEventListener('langchange', () => {
      if (isOpen()) {
        renderSuggestions(AI.sectionSuggestions(AI.currentSection(), state.lang));
      }
    });

    // Refresh suggestions when scrolling between sections
    let lastSection = AI.currentSection();
    let scrollRaf = null;
    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const cur = AI.currentSection();
        if (cur !== lastSection) {
          lastSection = cur;
          // Debounce suggestion refresh to avoid rapid updates
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            if (isOpen()) {
              renderSuggestions(AI.sectionSuggestions(cur, state.lang));
            }
          }, 150);
        }
      });
    }, { passive: true });
  }

  // ============== 3D Parallax Project Covers ==============

  /**
   * Adds a soft 3D tilt to project covers on mouse move (desktop only).
   * The inner content (gradient, nodes, etc.) drifts slightly to enhance depth.
   * Respects prefers-reduced-motion and pointer: coarse.
   */
  function setupParallaxCovers() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const covers = $$('.project-cover');
    covers.forEach(cover => cover.classList.add('parallax'));

    let raf = null;
    let lastEvent = null;

    function apply() {
      raf = null;
      if (!lastEvent) return;
      const { cover, rect, x, y } = lastEvent;
      const px = (x - rect.left) / rect.width;       // 0..1
      const py = (y - rect.top) / rect.height;
      const rx = (0.5 - py) * 6;                     // -3..3 deg
      const ry = (px - 0.5) * 6;
      cover.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    }

    function onMove(e) {
      const cover = e.currentTarget;
      const rect = cover.getBoundingClientRect();
      lastEvent = { cover, rect, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave(e) {
      const cover = e.currentTarget;
      cover.style.transform = '';
    }

    covers.forEach(cover => {
      cover.addEventListener('mousemove', onMove, { passive: true });
      cover.addEventListener('mouseleave', onLeave, { passive: true });
    });
  }

  // ============== AI Conversation Memory ==============

  /**
   * Persists the last 5 user-assistant exchanges to localStorage so the
   * conversation is restored on the next visit. Sensitive data (raw email
   * addresses inside user messages) is lightly redacted.
   * Storage key: portfolio_ai_memory_v1
   */
  const AI_MEMORY_KEY = 'portfolio_ai_memory_v1';
  const AI_MEMORY_MAX = 5;

  function loadAIMemory() {
    try {
      const raw = localStorage.getItem(AI_MEMORY_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.slice(0, AI_MEMORY_MAX) : [];
    } catch (e) { return []; }
  }
  function saveAIMemory(messages) {
    try {
      // Redact sensitive text BEFORE persisting, not just at render time,
      // so raw emails/numbers never touch localStorage.
      const safe = messages.slice(0, AI_MEMORY_MAX).map((m) =>
        m.role === 'user' ? Object.assign({}, m, { text: redact(m.text) }) : m
      );
      localStorage.setItem(AI_MEMORY_KEY, JSON.stringify(safe));
    } catch (e) { /* quota / private mode — ignore */ }
  }
  function redact(text) {
    if (!text) return '';
    // Strip obvious email addresses and long digit runs
    return text
      .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
      .replace(/\b\d{6,}\b/g, '[number]');
  }

  /**
   * Renders the saved memory as initial messages (assistant label only,
   * no "online" header) so the user sees prior context on next visit.
   */
  function renderMemoryMessages(list, lang) {
    const memory = loadAIMemory();
    if (!memory.length) return;
    memory.forEach(({ role, text, t }) => {
      const div = document.createElement('div');
      div.className = `ai-msg ${role} ai-msg-memory`;
      const icon = role === 'user' ? 'user' : 'bot';
      const date = new Date(t);
      const dateStr = isNaN(date.getTime()) ? '' : date.toLocaleString(lang === 'ar' ? 'ar' : 'en', { month: 'short', day: 'numeric' });
      const safeText = role === 'user' ? redact(text) : text;
      const who = role === 'user'
        ? (lang === 'ar' ? 'أنت' : 'You')
        : (lang === 'ar' ? 'المساعد' : 'Assistant');
      div.innerHTML = `<div class="ai-msg-avatar" aria-hidden="true"><i data-lucide="${icon}"></i></div>` +
        `<div class="ai-msg-bubble">` +
          `<div class="ai-msg-meta">${who}${dateStr ? ' · ' + dateStr : ''}</div>` +
          `<div class="ai-msg-text">${safeText.replace(/[<>&]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</div>` +
        `</div>`;
      list.appendChild(div);
    });
    list.scrollTop = list.scrollHeight;
  }

  // ============== Quick Action Buttons (AI assistant) ==============

  /**
   * Quick actions inside the AI assistant: "Email me", "Download CV",
   * "View projects". These are smart shortcuts — they don't generate text,
   * they trigger real actions.
   */
  const AI_QUICK_ACTIONS = {
    en: [
      { id: 'email',   label: 'Email me',       icon: 'mail',           action: () => { window.location.href = 'mailto:abdallhalghoul200@gmail.com?subject=Hello%20Abdullah'; } },
      { id: 'cv',      label: 'Download CV',    icon: 'download',       action: () => { const a = document.createElement('a'); a.href = 'assets/Abdullah_ALGhoul_CV.pdf'; a.download = 'Abdullah_ALGhoul_CV.pdf'; document.body.appendChild(a); a.click(); a.remove(); } },
      { id: 'linkedin',label: 'LinkedIn',       icon: 'linkedin',       action: () => window.open('https://www.linkedin.com/in/abdullah-al-ghoul-a254763a6/', '_blank', 'noopener') },
      { id: 'projects',label: 'View projects',  icon: 'folder-git-2',   action: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); } },
      { id: 'top',     label: 'Back to top',    icon: 'arrow-up',       action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
    ],
    ar: [
      { id: 'email',   label: 'راسلني',          icon: 'mail',           action: () => { window.location.href = 'mailto:abdallhalghoul200@gmail.com?subject=مرحبا%20عبدالله'; } },
      { id: 'cv',      label: 'حمّل سيرتي',       icon: 'download',       action: () => { const a = document.createElement('a'); a.href = 'assets/Abdullah_ALGhoul_CV.pdf'; a.download = 'Abdullah_ALGhoul_CV.pdf'; document.body.appendChild(a); a.click(); a.remove(); } },
      { id: 'linkedin',label: 'لينكدإن',          icon: 'linkedin',       action: () => window.open('https://www.linkedin.com/in/abdullah-al-ghoul-a254763a6/', '_blank', 'noopener') },
      { id: 'projects',label: 'المشاريع',         icon: 'folder-git-2',   action: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); } },
      { id: 'top',     label: 'للأعلى',           icon: 'arrow-up',       action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
    ]
  };

  // ============== Project Case Studies ==============

  /**
   * Detailed case-study content per project (bilingual). Each entry:
   * { tag, title, problem, solution, result, tech[], links[] }
   * links items: { id, icon, label, href }
   */
  const PROJECT_CASES = {
    en: {
      p1: {
        tag: 'Live · This Site',
        title: 'Personal Portfolio Website',
        problem: 'As a CS student, I needed one fast, professional place to present my skills, projects, and certifications.',
        solution: 'Built a dependency-free portfolio with semantic HTML, modern CSS, and vanilla JavaScript — bilingual with full RTL support and PWA offline mode.',
        result: 'A fast, responsive site that loads instantly, works offline, and stays easy to maintain with no build step.',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'i18n', 'RTL', 'PWA'],
        links: [
          { id: 'live', icon: 'external-link', label: 'Live Site', href: 'https://abdullah-portfolio26.vercel.app/' }
        ]
      },
      p2: {
        tag: 'Completed',
        title: 'Enterprise Network Design',
        problem: 'A growing business needed a scalable network with no traffic segmentation between departments and no centralized services.',
        solution: 'Designed a segmented network with per-department VLANs, DHCP/DNS/NAT services, subnetting, and a Router-on-a-Stick architecture in Cisco Packet Tracer.',
        result: 'A scalable, documented topology with isolated broadcast domains and centralized services.',
        tech: ['Cisco Packet Tracer', 'VLAN', 'DHCP', 'DNS', 'NAT', 'Routing'],
        links: [
          { id: 'diagram', icon: 'file-text', label: 'Project Diagram', href: 'https://drive.google.com/drive/folders/18qSsF9Tf5nvHELcvJfpIqqO4rk7ipbp9?usp=sharing' }
        ]
      },
      p3: {
        tag: 'Concept Proposal',
        title: 'Smart University Virtual Lab',
        problem: 'Many students without personal computers cannot complete programming assignments or lab work, especially during remote learning.',
        solution: 'Proposed a cloud VDI where students sign in from any mobile device and get a full Windows workstation via RDP, covering Azure VMs, VPN access, and per-session provisioning.',
        result: 'A ready-to-implement blueprint that turns any smartphone into a full computer for university labs.',
        tech: ['RDP', 'Windows', 'Azure', 'Cloud Infra', 'VPN'],
        links: [
          { id: 'status', icon: 'info', label: 'Proposal / future implementation' }
        ]
      },
      p4: {
        tag: 'Live',
        title: 'AL-Azher IT Hub',
        problem: 'Students needed a centralized platform to organize lectures, resources, and study materials.',
        solution: 'Developed a bilingual educational platform using React, Tailwind CSS, and Firebase.',
        result: 'Created an accessible digital hub that improves students\' access to academic resources.',
        tech: ['React', 'Tailwind CSS', 'Firebase', 'PWA'],
        links: [
          { id: 'live', icon: 'external-link', label: 'Live Site', href: 'https://al-azher-it-hub.vercel.app/' }
        ]
      },
      p5: {
        tag: 'Team Project',
        title: 'Task Manager',
        problem: 'Our team had no reliable way to assign shared tasks, track their status, or respect deadlines.',
        solution: 'Built a Java task management app with OOP design — task creation, assignment, status tracking, and deadline management with file persistence.',
        result: 'A practical tool that kept the team organized and shipped as a graded team project.',
        tech: ['Java', 'OOP', 'File I/O', 'Team Collaboration'],
        links: []
      },
      p6: {
        tag: 'Completed',
        title: 'Library Management System',
        problem: 'Manual book tracking made searching titles, managing borrowers, and recording loans slow and unreliable.',
        solution: 'Built a Java library system covering add, search, borrow, and return flows, backed by data structures and file persistence.',
        result: 'A dependable system that streamlines cataloging and lending for a small library.',
        tech: ['Java', 'OOP', 'Data Structures', 'File I/O'],
        links: []
      },
      p7: {
        tag: 'Personal Project',
        title: 'SmartTimeCoach',
        problem: 'Students struggle with managing tasks and study schedules.',
        solution: 'Created a Python productivity assistant with automated reminders.',
        result: 'Improved personal task organization and time management.',
        tech: ['Python', 'Automation', 'Scheduling'],
        links: []
      }
    },
    ar: {
      p1: {
        tag: 'مباشر · هذا الموقع',
        title: 'موقع التعريف الشخصي',
        problem: 'كطالب علوم حاسوب، كنت بحاجة إلى مكان واحد سريع واحترافي أعرض فيه مهاراتي ومشاريعي وشهاداتي.',
        solution: 'بنيت موقعاً بلا تبعيات باستخدام HTML دلالي وCSS حديث وJavaScript نقي — ثنائي اللغة مع دعم RTL كامل وعمل دون اتصال (PWA).',
        result: 'موقع سريع ومتجاوب يُحمّل فوراً ويعمل دون اتصال ويسهل صيانته بلا خطوات بناء.',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'i18n', 'RTL', 'PWA'],
        links: [
          { id: 'live', icon: 'external-link', label: 'الموقع مباشر', href: 'https://abdullah-portfolio26.vercel.app/' }
        ]
      },
      p2: {
        tag: 'مكتمل',
        title: 'تصميم شبكة مؤسسية',
        problem: 'شركة متنامية تحتاج شبكة قابلة للتوسع، بلا فصل لحركة المرور بين الأقسام وبلا خدمات مركزية.',
        solution: 'صممت شبكة مقسّمة بـ VLAN لكل قسم وخدمات DHCP/DNS/NAT وعنونة فرعية ومعمارية Router-on-a-Stick في Cisco Packet Tracer.',
        result: 'بنية موثقة قابلة للتوسع مع نطاقات بث معزولة وخدمات مركزية.',
        tech: ['Cisco Packet Tracer', 'VLAN', 'DHCP', 'DNS', 'NAT', 'Routing'],
        links: [
          { id: 'diagram', icon: 'file-text', label: 'مخطط المشروع', href: 'https://drive.google.com/drive/folders/18qSsF9Tf5nvHELcvJfpIqqO4rk7ipbp9?usp=sharing' }
        ]
      },
      p3: {
        tag: 'مقترح',
        title: 'المختبر الجامعي الافتراضي الذكي',
        problem: 'كثير من الطلاب بلا حواسيب شخصية لا يستطيعون إنجاز الواجبات البرمجية والعمل المخبري، خصوصاً أثناء التعلم عن بُعد.',
        solution: 'اقترحت VDI سحابية يدخل منها الطالب من أي جهاز ويحصل على محطة ويندوز كاملة عبر RDP، مع أجهزة Azure الافتراضية والوصول عبر VPN وتجهيز الجلسات.',
        result: 'مخطط جاهز للتنفيذ يحوّل أي هاتف إلى حاسوب كامل للمختبرات الجامعية.',
        tech: ['RDP', 'Windows', 'Azure', 'Cloud Infra', 'VPN'],
        links: [
          { id: 'status', icon: 'info', label: 'مقترح / تنفيذ مستقبلي' }
        ]
      },
      p4: {
        tag: 'مباشر',
        title: 'مركز الأزهر لتقنية المعلومات',
        problem: 'احتاج الطلاب منصة مركزية لتنظيم المحاضرات والموارد والمواد الدراسية.',
        solution: 'طوّرت منصة تعليمية ثنائية اللغة باستخدام React وTailwind CSS وFirebase.',
        result: 'أنشأت مركزاً رقمياً سهل الوصول يحسّن وصول الطلاب إلى الموارد الأكاديمية.',
        tech: ['React', 'Tailwind CSS', 'Firebase', 'PWA'],
        links: [
          { id: 'live', icon: 'external-link', label: 'الموقع مباشر', href: 'https://al-azher-it-hub.vercel.app/' }
        ]
      },
      p5: {
        tag: 'مشروع جماعي',
        title: 'مدير المهام',
        problem: 'لم تكن لدينا وسيلة موثوقة لتعيين المهام المشتركة وتتبع حالتها واحترام المواعيد النهائية.',
        solution: 'طوّرت تطبيق إدارة مهام بلغة Java بتصميم كائني — إنشاء وتعيين وتتبع حالة وإدارة مواعيد مع حفظ البيانات في ملفات.',
        result: 'أداة عملية أبقت الفريق منظماً وسُلّمت كمشروع جماعي مقيّم.',
        tech: ['Java', 'OOP', 'File I/O', 'عمل جماعي'],
        links: []
      },
      p6: {
        tag: 'مكتمل',
        title: 'نظام إدارة المكتبة',
        problem: 'التتبع اليدوي للكتب جعل البحث عن العناوين وإدارة المستعيرين وتسجيل الإعارات بطيئاً وغير موثوق.',
        solution: 'بنيت نظام مكتبة بلغة Java يشمل الإضافة والبحث والاستعارة والإرجاع، مدعوماً بهياكل بيانات وحفظ في ملفات.',
        result: 'نظام موثوق يبسّط الفهرسة والإعارة في مكتبة صغيرة.',
        tech: ['Java', 'OOP', 'Data Structures', 'File I/O'],
        links: []
      },
      p7: {
        tag: 'مشروع شخصي',
        title: 'SmartTimeCoach',
        problem: 'يعاني الطلاب من إدارة المهام وجداول الدراسة.',
        solution: 'طوّرت مساعد إنتاجية بلغة Python مع تذكيرات تلقائية.',
        result: 'تحسين تنظيم المهام الشخصية وإدارة الوقت.',
        tech: ['Python', 'Automation', 'Scheduling'],
        links: []
      }
    }
  };

  /**
   * Sets up the project case-study modal: opens a detailed "problem →
   * solution → result" view per project, with focus trap and keyboard support.
   * @returns {void}
   */
  function setupProjectModals() {
    const modal = $('#case-modal');
    if (!modal) return;

    const body = $('#case-modal-body');
    const tagEl = $('#case-modal-tag');
    const titleEl = $('#case-modal-title');
    const stackEl = $('#case-modal-stack');
    const linksEl = $('#case-modal-links');
    let lastFocused = null;
    let removeTrap = null;

    const esc = (s) => String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    const block = (icon, label, text, isResult) => `
      <div class="case-block${isResult ? ' case-result' : ''}">
        <div class="case-block-label"><i data-lucide="${icon}"></i> ${esc(label)}</div>
        <p>${esc(text)}</p>
      </div>`;

    function open(id) {
      const lang = state.lang === 'ar' ? 'ar' : 'en';
      const dict = i18n[lang];
      const cases = PROJECT_CASES[lang];
      const data = cases && cases[id];
      if (!data) return;

      lastFocused = document.activeElement;

      tagEl.textContent = data.tag;
      titleEl.textContent = data.title;
      stackEl.innerHTML = data.tech.map((t) => `<span>${esc(t)}</span>`).join('');

      body.innerHTML =
        block('alert-circle', dict['proj.problem'], data.problem) +
        block('lightbulb', dict['proj.solution'], data.solution) +
        (data.result ? block('trending-up', dict['proj.result'], data.result, true) : '');

      const foot = [];
      data.links.forEach((l) => {
        if (l.href) {
          foot.push(`<a class="btn btn-sm btn-primary" href="${esc(l.href)}" target="_blank" rel="noopener"><i data-lucide="${l.icon}"></i> ${esc(l.label)}</a>`);
        } else {
          foot.push(`<span class="btn btn-sm btn-outline"><i data-lucide="${l.icon}"></i> ${esc(l.label)}</span>`);
        }
      });
      if (!foot.length) {
        foot.push(`<span class="case-modal-stack" style="background:none;padding:0;">${esc(dict['proj.nolinks'])}</span>`);
      }
      linksEl.innerHTML = foot.join('');

      modal.hidden = false;
      document.body.classList.add('no-scroll');
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });

      removeTrap = trapFocus(modal);
      setTimeout(() => {
        const closeBtn = modal.querySelector('.case-modal-close');
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove('no-scroll');
      if (removeTrap) { removeTrap(); removeTrap = null; }
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    $$('[data-case-open]').forEach((btn) => {
      btn.addEventListener('click', () => open(btn.dataset.caseOpen));
    });

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-case-close]')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  // ============== Interactive Milestones Timeline ==============

  /**
   * Expanded milestone details shown in a modal when a timeline entry is clicked.
   * { title, date, points[], link? }
   */
  const MILESTONES = {
    en: {
      m1: {
        title: '2026 · NVIDIA AI Certification',
        date: 'Generative AI · NVIDIA Academy',
        points: [
          'Completed the "AI for All: From Basics to GenAI Practice" track from NVIDIA Academy.',
          'Learned the fundamentals of generative AI, model workflows, and practical prompting.',
          'Hands-on practice with real GenAI tooling and use-case design.'
        ],
        link: { label: 'View certificate', href: 'assets/certs/nvidia-ai.jpg' }
      },
      m1b: {
        title: '2026 · OpenAI & Anthropic AI Tracks',
        date: 'AI Foundations · Claude 101 · Claude Code 101 · Claude Code in Action',
        points: [
          'Completed OpenAI Academy\'s AI Foundations curriculum.',
          'Finished Anthropic\'s Claude 101: safe, effective assistant design and prompt engineering.',
          'Completed Claude Code 101: introduction to using Claude for coding tasks.',
          'Completed Claude Code in Action: hands-on practical coding projects with Claude.'
        ],
        link: { label: 'View certificate', href: 'assets/certs/openai-ai-foundations.jpg' }
      },
      m2: {
        title: '2025 · ICDL Certification',
        date: 'Edraak · Word, Excel, Internet Security',
        points: [
          'Earned ICDL Base certification through Edraak.',
          'Proficiency in Word, Excel, and internet security fundamentals.',
          'Solid baseline in digital office and online-safety skills.'
        ],
        link: { label: 'View certificate', href: 'assets/certs/icdl.jpg' }
      },
      m3: {
        title: '2024 · Networking Projects',
        date: 'VLAN, DHCP/NAT segments',
        points: [
          'Designed segmented LAN topologies with VLANs and subnetting.',
          'Configured DHCP, DNS, and NAT across multiple segments.',
          'Documented addressing plans and routing logic for each network.'
        ],
        link: null
      },
      m4: {
        title: '2023 · CS Journey Begins',
        date: 'Al-Azhar University',
        points: [
          'Started the B.Sc. in Computer Science at Al-Azhar University.',
          'Built fundamentals in programming (C, Java), math, and problem solving.',
          'Kicked off the habit of continuous self-learning that still drives me today.'
        ],
        link: null
      }
    },
    ar: {
      m1: {
        title: '2026 · شهادة NVIDIA في الذكاء الاصطناعي',
        date: 'الذكاء الاصطناعي التوليدي · NVIDIA Academy',
        points: [
          'أكملت مسار "AI for All: From Basics to GenAI Practice" من أكاديمية NVIDIA.',
          'تعلمت أساسيات الذكاء الاصطناعي التوليدي وأدوات النماذج والـ Prompting العملي.',
          'تطبيق عملي مع أدوات GenAI حقيقية وتصميم حالات استخدام.'
        ],
        link: { label: 'عرض الشهادة', href: 'assets/certs/nvidia-ai.jpg' }
      },
      m1b: {
        title: '2026 · مسارات OpenAI و Anthropic للذكاء الاصطناعي',
        date: 'AI Foundations · Claude 101 · Claude Code 101 · Claude Code in Action',
        points: [
          'أكملت منهاج AI Foundations من أكاديمية OpenAI.',
          'أنهيت Claude 101 من Anthropic: تصميم مساعدين آمنين وهندسة الأوامر.',
          'أنهيت Claude Code 101: مقدمة لاستخدام Claude في مهام البرمجة.',
          'أنهيت Claude Code in Action: مشاريع برمجية عملية مع Claude.'
        ],
        link: { label: 'عرض الشهادة', href: 'assets/certs/openai-ai-foundations.jpg' }
      },
      m2: {
        title: '2025 · شهادة ICDL',
        date: 'Edraak · Word, Excel, أمن الإنترنت',
        points: [
          'حصلت على شهادة ICDL الأساسية عبر إدراك.',
          'إتقان Word وExcel وأساسيات أمن الإنترنت.',
          'قاعدة رقمية متينة في مهارات المكاتب والسلامة عبر الإنترنت.'
        ],
        link: { label: 'عرض الشهادة', href: 'assets/certs/icdl.jpg' }
      },
      m3: {
        title: '2024 · مشاريع الشبكات',
        date: 'VLAN, DHCP/NAT segments',
        points: [
          'صممت شبكات LAN مقسّمة باستخدام VLAN والعنونة الفرعية.',
          'أعددت DHCP وDNS وNAT عبر مقاطع متعددة.',
          'وثقت خطط العنونة ومنطق التوجيه لكل شبكة.'
        ],
        link: null
      },
      m4: {
        title: '2023 · بداية رحلة علوم الحاسوب',
        date: 'جامعة الأزهر',
        points: [
          'بدأت بكالوريوس علوم الحاسوب في جامعة الأزهر.',
          'بنيت أساسات البرمجة (C, Java) والرياضيات وحل المشكلات.',
          'أطلقت عادة التعلم الذاتي المستمر التي تقودني حتى اليوم.'
        ],
        link: null
      }
    }
  };

  /**
   * Sets up interactive timeline milestones: each entry opens a modal with
   * expanded details, focus trap, and keyboard/Escape support.
   * @returns {void}
   */
  function setupTimelineModals() {
    const modal = $('#tl-modal');
    if (!modal) return;

    const dateEl = $('#tl-modal-date');
    const titleEl = $('#tl-modal-title');
    const bodyEl = $('#tl-modal-body');
    const linksEl = $('#tl-modal-links');
    let lastFocused = null;
    let removeTrap = null;

    const esc = (s) => String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    function open(id) {
      const lang = state.lang === 'ar' ? 'ar' : 'en';
      const data = MILESTONES[lang] && MILESTONES[lang][id];
      if (!data) return;

      lastFocused = document.activeElement;
      dateEl.textContent = data.date || '';
      titleEl.textContent = data.title;
      bodyEl.innerHTML = `<ul class="tl-points">${data.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`;
      linksEl.innerHTML = data.link
        ? `<a class="btn btn-sm btn-primary" href="${esc(data.link.href)}" target="_blank" rel="noopener"><i data-lucide="badge-check"></i> ${esc(data.link.label)}</a>`
        : '';

      modal.hidden = false;
      document.body.classList.add('no-scroll');
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });

      removeTrap = trapFocus(modal);
      setTimeout(() => {
        const closeBtn = modal.querySelector('.tl-modal-close');
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove('no-scroll');
      if (removeTrap) { removeTrap(); removeTrap = null; }
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    $$('[data-tl-open]').forEach((btn) => {
      btn.addEventListener('click', () => open(btn.dataset.tlOpen));
    });

    // Click-anywhere convenience for mouse users. Keyboard/screen-reader users
    // use the real "View details" button inside each item — the item itself
    // stays a plain div to avoid nested interactive controls.
    $$('.t-item[data-milestone]').forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        open(item.dataset.milestone);
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-tl-close]')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  // ============== Skills Radar Chart ==============

  /**
   * Builds a zero-dependency SVG radar chart of proficiency across the four
   * skill domains. Values are derived from the existing data-tier attributes,
   * so editing the skills grid updates the chart automatically. Re-renders on
   * theme change (colors) and language change (labels), and animates into view.
   * @returns {void}
   */
  function setupRadarChart() {
    const svg = $('#skills-radar');
    if (!svg) return;

    const NS = 'http://www.w3.org/2000/svg';
    const CX = 170, CY = 170, R = 122, LABEL_R = 158, MAX = 4;
    const AXES = [
      { key: 'skills.prog',  angle: 0,   icon: 'code-2' },
      { key: 'skills.net',   angle: 90,  icon: 'network' },
      { key: 'skills.tools', angle: 180, icon: 'wrench' },
      { key: 'skills.cur',   angle: 270, icon: 'book-open', fixed: 3 }
    ];

    const pt = (angleDeg, r) => {
      const rad = (angleDeg - 90) * Math.PI / 180;
      return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
    };

    const readData = () => {
      const groups = $$('.skill-card');
      return AXES.map((axis, i) => {
        if (axis.fixed != null) return axis.fixed;
        const card = groups[i];
        if (!card) return 0;
        const rows = $$('.skill-row[data-tier]', card);
        if (!rows.length) return 0;
        const sum = rows.reduce((acc, r) => acc + parseInt(r.dataset.tier || '1', 10), 0);
        return sum / rows.length;
      });
    };

    const el = (tag, attrs) => {
      const node = document.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => {
        if (k === 'text') node.textContent = v;
        else node.setAttribute(k, v);
      });
      return node;
    };

    const polygonPoints = (vals) =>
      vals.map((v, i) => {
        const [x, y] = pt(AXES[i].angle, R * (v / MAX));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

    let revealed = false;

    function render() {
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue('--accent').trim() || '#06b6d4';
      const purple = cs.getPropertyValue('--accent-purple').trim() || '#a855f7';
      const border = cs.getPropertyValue('--border').trim() || 'rgba(255,255,255,0.1)';
      const dim = cs.getPropertyValue('--text-dim').trim() || '#9a9ab8';
      const vals = readData();
      const dir = document.documentElement.dir || 'ltr';

      svg.innerHTML = '';

      const defs = el('defs', {});
      const grad = el('linearGradient', { id: 'radar-grad', x1: '0', y1: '0', x2: '1', y2: '1' });
      grad.appendChild(el('stop', { offset: '0%', 'stop-color': accent, 'stop-opacity': '0.55' }));
      grad.appendChild(el('stop', { offset: '100%', 'stop-color': purple, 'stop-opacity': '0.45' }));
      defs.appendChild(grad);
      svg.appendChild(defs);

      const grid = el('g', { class: 'radar-grid' });
      for (let level = 1; level <= MAX; level++) {
        grid.appendChild(el('polygon', {
          points: polygonPoints(vals.map(() => level)),
          fill: 'none', stroke: border, 'stroke-width': '1'
        }));
      }
      AXES.forEach((a) => {
        const [x, y] = pt(a.angle, R);
        grid.appendChild(el('line', { x1: CX, y1: CY, x2: x.toFixed(1), y2: y.toFixed(1), stroke: border, 'stroke-width': '1' }));
      });
      svg.appendChild(grid);

      const dict = i18n[state.lang === 'ar' ? 'ar' : 'en'];
      AXES.forEach((a) => {
        const [x, y] = pt(a.angle, LABEL_R);
        const attrs = { x: x.toFixed(1), y: y.toFixed(1), class: 'radar-label', fill: dim, 'text-anchor': 'middle' };
        if (a.angle === 0) attrs.y = (y - 4).toFixed(1);
        else if (a.angle === 180) attrs.y = (y + 16).toFixed(1);
        else if (a.angle === 90) { attrs['text-anchor'] = dir === 'rtl' ? 'end' : 'start'; attrs.x = (x + 9).toFixed(1); }
        else if (a.angle === 270) { attrs['text-anchor'] = dir === 'rtl' ? 'start' : 'end'; attrs.x = (x - 9).toFixed(1); }
        svg.appendChild(el('text', { ...attrs, text: dict[a.key] || a.key }));
      });

      const dataG = el('g', { class: 'radar-data' });
      dataG.appendChild(el('polygon', { points: polygonPoints(vals), fill: 'url(#radar-grad)', stroke: accent, 'stroke-width': '2', 'stroke-linejoin': 'round' }));
      vals.forEach((v, i) => {
        const [x, y] = pt(AXES[i].angle, R * (v / MAX));
        dataG.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: '4', fill: accent }));
        const t = el('text', {
          x: x.toFixed(1), y: (y + (v === 0 ? -8 : 20)).toFixed(1),
          class: 'radar-value', fill: accent, 'text-anchor': 'middle', 'font-size': '11', 'font-weight': '700',
          text: (Math.round(v * 10) / 10).toString().replace(/\.0$/, '')
        });
        dataG.appendChild(t);
      });
      dataG.classList.add(revealed ? 'in' : 'pre');
      svg.appendChild(dataG);

      // Legend
      const legend = $('#skills-radar-legend');
      if (legend) {
        legend.innerHTML = AXES.map((a, i) => {
          const pct = Math.round((vals[i] / MAX) * 100);
          return `<div class="radar-legend-item">
            <i data-lucide="${a.icon}"></i>
            <span>${dict[a.key] || a.key}</span>
            <span class="r-bar" style="width:${pct}%"></span>
          </div>`;
        }).join('');
        if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });
      }
    }

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          revealed = true;
          const g = svg.querySelector('.radar-data');
          if (g) { g.classList.remove('pre'); g.classList.add('in'); }
        });
      }, { threshold: 0.4 });
      io.observe(svg);
    } else {
      revealed = true;
    }

    const themeObs = new MutationObserver(() => render());
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    document.addEventListener('langchange', () => render());

    render();
  }

  // ============== Voice (Input + Output) for Assistant ==============

  /**
   * Adds Web Speech API support to the AI assistant:
   *  - Microphone button (SpeechRecognition) fills the input from voice and sends it.
   *  - Speaker button (speechSynthesis) reads the last assistant reply aloud.
   * Both auto-disable when unsupported; speech follows the active language and
   * stops cleanly on language switch / panel close.
   * @returns {void}
   */
  function setupVoice() {
    const micBtn = $('#ai-voice-btn');
    const speakBtn = $('#ai-speak-btn');
    if (!micBtn && !speakBtn) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSR = !!SR;
    const hasSS = 'speechSynthesis' in window;

    // ---- Voice input (speech → text) ----
    let recognition = null;
    let listening = false;
    let aborted = false;
    let finalTranscript = '';

    if (micBtn && hasSR) {
      micBtn.disabled = false;
      micBtn.addEventListener('click', () => {
        if (listening) stopListening();
        else startListening();
      });
    }

    function startListening() {
      try {
        recognition = new SR();
      } catch (e) { return; }
      listening = true;
      aborted = false;
      finalTranscript = '';
      micBtn.classList.add('listening');
      micBtn.setAttribute('aria-pressed', 'true');
      const icon = micBtn.querySelector('[data-icon]');
      if (icon) icon.setAttribute('data-icon', 'mic-off');
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });

      recognition.lang = state.lang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      const input = $('#ai-input');
      recognition.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalTranscript += t;
          else interim += t;
        }
        if (input) input.value = (finalTranscript + interim).trim();
      };

      recognition.onerror = () => {
        aborted = true;
        setMicIdle();
      };

      recognition.onend = () => {
        setMicIdle();
        if (aborted) return;
        const form = $('#ai-form');
        if (finalTranscript && input && input.value.trim() && form) {
          form.requestSubmit();
        }
      };

      try { recognition.start(); } catch (e) { aborted = true; setMicIdle(); }
    }

    function setMicIdle() {
      listening = false;
      micBtn.classList.remove('listening');
      micBtn.setAttribute('aria-pressed', 'false');
      const icon = micBtn.querySelector('[data-icon]');
      if (icon) icon.setAttribute('data-icon', 'mic');
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });
    }

    function stopListening() {
      aborted = true;
      if (recognition) { try { recognition.abort(); } catch (e) { /* ignore */ } }
      setMicIdle();
    }

    // ---- Voice output (text → speech) ----
    if (speakBtn) {
      if (!hasSS) {
        speakBtn.disabled = true;
      } else {
        speakBtn.addEventListener('click', () => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
          }
          const last = lastAssistantText();
          if (!last) return;
          speakText(last);
        });
      }
    }

    function stripMarkdown(s) {
      return String(s || '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/(\*\*|__|`)/g, '')
        .replace(/_([^_]+)_/g, '$1')
        .replace(/[#>*-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function lastAssistantText() {
      const msgs = $$('#ai-messages .ai-msg.assistant .ai-msg-bubble');
      if (!msgs.length) return '';
      return stripMarkdown(msgs[msgs.length - 1].textContent);
    }

    function speakText(text) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = state.lang === 'ar' ? 'ar-SA' : 'en-US';
      const langPrefix = state.lang === 'ar' ? 'ar' : 'en';
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => (v.lang || '').toLowerCase().startsWith(langPrefix));
      if (match) u.voice = match;
      u.rate = 1;
      u.pitch = 1;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    }

    function setSpeaking(on) {
      if (!speakBtn) return;
      speakBtn.classList.toggle('ai-speak-active', on);
      speakBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const icon = speakBtn.querySelector('[data-icon]');
      if (icon) icon.setAttribute('data-icon', on ? 'square' : 'volume-2');
      if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide' });
    }

    if (hasSS) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => { /* voices load lazily */ };
      }
      if (typeof window.speechSynthesis.getVoices === 'function') window.speechSynthesis.getVoices();
    }

    document.addEventListener('langchange', () => {
      if (listening) stopListening();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeaking(false);
    });
  }

  // ============== Lightweight Accessibility Audit ==============

  /**
   * Dev-only accessibility audit (zero dependencies — no axe-core).
   * Open with Ctrl/Cmd+Shift+A or the ?a11y query param. Scans the live DOM
   * for common issues (alt text, labels, button names, heading order, contrast,
   * duplicate ids), lists them in a floating panel, and provides a focus
   * highlighting mode for keyboard navigation testing.
   * @returns {void}
   */
  function setupA11yAudit() {
    let panel = null;

    const openByParam = new URLSearchParams(location.search).has('a11y');

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.code === 'KeyA' || e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        toggle();
      }
    });

    if (openByParam) {
      setTimeout(() => toggle(), 400);
    }

    function toggle() {
      if (panel) { panel.remove(); panel = null; return; }
      build();
      const results = scan();
      render(results);
    }

    function build() {
      panel = document.createElement('div');
      panel.className = 'a11y-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Accessibility audit');
      panel.innerHTML = `
        <div class="a11y-head">
          <div>
            <strong>Accessibility Audit</strong>
            <span class="a11y-sub" data-a11y-count></span>
          </div>
          <div class="a11y-head-actions">
            <button type="button" data-a11y-focus>Focus highlight: OFF</button>
            <button type="button" data-a11y-close aria-label="Close audit">✕</button>
          </div>
        </div>
        <ul class="a11y-list" data-a11y-list></ul>`;
      document.body.appendChild(panel);

      panel.querySelector('[data-a11y-close]').addEventListener('click', () => {
        panel.remove();
        panel = null;
      });

      const focusBtn = panel.querySelector('[data-a11y-focus]');
      focusBtn.addEventListener('click', () => {
        const on = document.body.classList.toggle('a11y-focus');
        focusBtn.textContent = `Focus highlight: ${on ? 'ON' : 'OFF'}`;
      });
    }

    function parseColor(str) {
      if (!str) return null;
      let m = str.match(/rgba?\(([^)]+)\)/);
      if (m) {
        const parts = m[1].split(',').map((s) => parseFloat(s));
        if (parts.length >= 3) return [parts[0], parts[1], parts[2]];
      }
      m = str.match(/#([0-9a-f]{3})$/i) || str.match(/#([0-9a-f]{6})$/i);
      if (m) {
        const hex = m[1];
        if (hex.length === 3) return [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
        return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
      }
      return null;
    }

    function luminance(rgb) {
      const [r, g, b] = rgb.map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function findLabelFor(id) {
      return $$('label').some((l) => l.getAttribute('for') === id);
    }

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function scan() {
      const issues = [];
      const add = (severity, msg, el) => issues.push({ severity, msg, el });
      const html = document.documentElement;

      if (!html.lang || !html.lang.trim()) add('high', 'Missing <html lang> attribute', html);
      if (!html.dir) add('medium', 'Missing <html dir> attribute (RTL support)', html);

      $$('img').forEach((img) => {
        if (!img.hasAttribute('alt')) add('high', 'Image missing alt text', img);
      });

      $$('button').forEach((btn) => {
        if (btn.disabled || btn.hidden) return;
        const name = btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby') || (btn.textContent || '').trim();
        if (!name) add('high', 'Button without accessible name', btn);
      });

      $$('a[href]').forEach((a) => {
        const name = a.getAttribute('aria-label') || a.getAttribute('aria-labelledby') || (a.textContent || '').trim();
        if (!name) add('high', 'Link without accessible name', a);
      });

      $$('input, select, textarea').forEach((c) => {
        if (c.type === 'hidden') return;
        if (c.getAttribute('aria-label') || c.getAttribute('aria-labelledby')) return;
        if (c.closest('label')) return;
        if (c.id && findLabelFor(c.id)) return;
        add('high', `Form field without a label (${c.tagName.toLowerCase()})`, c);
      });

      const seen = {};
      $$('[id]').forEach((el) => {
        if (seen[el.id]) add('medium', `Duplicate id="${el.id}"`, el);
        else seen[el.id] = true;
      });

      let lastLevel = 0;
      $$('h1,h2,h3,h4,h5,h6').forEach((h) => {
        const level = parseInt(h.tagName[1], 10);
        if (lastLevel && level > lastLevel + 1) {
          add('medium', `Heading level jumps from h${lastLevel} to h${level}`, h);
        }
        lastLevel = level;
      });

      const bodyStyle = getComputedStyle(document.body);
      const bg = parseColor(bodyStyle.backgroundColor);
      const fg = parseColor(bodyStyle.color);
      if (bg && fg) {
        const l1 = luminance(bg);
        const l2 = luminance(fg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (ratio < 4.5) add('high', `Body text contrast too low (${ratio.toFixed(1)}:1)`, document.body);
      }

      return issues;
    }

    function render(results) {
      const countEl = panel.querySelector('[data-a11y-count]');
      const listEl = panel.querySelector('[data-a11y-list]');
      const total = results.length;
      countEl.textContent = `${total} issue${total === 1 ? '' : 's'} found`;

      if (!total) {
        listEl.innerHTML = '<li class="a11y-clean">✓ No issues detected. Nice!</li>';
        return;
      }

      listEl.innerHTML = results.map((r, i) => `
        <li class="a11y-item a11y-${r.severity}">
          <span class="a11y-sev">${r.severity === 'high' ? '▲' : '●'}</span>
          <div>
            <div>${esc(r.msg)}</div>
            <div class="a11y-el">${r.el.tagName.toLowerCase()}${r.el.id ? '#' + esc(r.el.id) : ''}${r.el.className && typeof r.el.className === 'string' ? '.' + esc(r.el.className.split(' ')[0]) : ''}</div>
          </div>
          <button type="button" data-a11y-go="${i}" aria-label="Scroll to element">↘</button>
        </li>`).join('');

      listEl.querySelectorAll('[data-a11y-go]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const el = results[parseInt(btn.dataset.a11yGo, 10)].el;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.setAttribute('data-a11y-flash', '');
            setTimeout(() => el.removeAttribute('data-a11y-flash'), 1600);
          }
        });
      });
    }
  }

  // ============== Init ==============

  /**
   * Initializes the entire portfolio application.
   * Called on DOMContentLoaded or immediately if DOM is already ready.
   * Sets up all features: theme, language, navigation, animations, and interactions.
   * @returns {void}
   */
  function init() {
    applyTheme(state.theme);
    applyLang(state.lang);
    setYear();
    setupMobileMenu();
    setupScrollSpy();
    setupNavScroll();
    setupScrollProgress();
    setupTyped();
    setupHeroCursorGlow();
    setupScrollReveal();
    setupBackToTop();
    setupKeyboardShortcuts();
    setupCertModal();
    setupTestimonialModal();
    setupCursor();
    setupSectionTransitions();
    setupCursorThemes();
    setupCounters();
    setupMagneticButtons();
    setupAssistant();
    setupParallaxCovers();
    setupRadarChart();
    setupTimelineModals();
    setupProjectModals();
    setupNavDots();
    setupPreloader();
    setupVoice();
    setupA11yAudit();

    // Form submit handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit(contactForm);
      });
    }

    const langBtn = $('#lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        applyLang(state.lang === 'en' ? 'ar' : 'en');
      });
    }

    setupThemePicker();

    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      window.addEventListener('load', () => window.lucide && window.lucide.createIcons());
    }

    // Service Worker — offline support (https / localhost only).
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();