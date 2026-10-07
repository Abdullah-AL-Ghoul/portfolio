-- ============================================================
-- Abdullah Portfolio V2 — Seed (verified content from the live
-- static site as of 2026-10-07). No invented data.
-- Run AFTER 0001_schema.sql.
-- ============================================================

-- ---------- settings ----------
insert into public.site_settings (id, site_title_en, site_title_ar, meta_description_en, meta_description_ar, footer_en, footer_ar, analytics_enabled, feature_flags)
values (1,
  'Abdullah Ayman AL-Ghoul · Computer Science Student',
  'عبد الله أيمن الغول · طالب علوم حاسوب',
  'Portfolio of Abdullah Ayman AL-Ghoul — Computer Science student at Al-Azhar University interested in software engineering, networking, and AI.',
  'معرض أعمال عبد الله أيمن الغول — طالب علوم حاسوب في جامعة الأزهر مهتم بهندسة البرمجيات والشبكات والذكاء الاصطناعي.',
  'Building with curiosity, learning with intent.',
  'نبني بفضول، ونتعلم بقصد.',
  true,
  '{"ai_assistant": true, "case_studies": true}'::jsonb)
on conflict (id) do nothing;

-- ---------- about ----------
insert into public.about_profile (id, data) values (1, '{
  "hero": {
    "status": {"en": "Open to opportunities", "ar": "متاح للفرص"},
    "greet": {"en": "Hi, I''m", "ar": "مرحبًا، أنا"},
    "role": {"en": "Computer Science Student", "ar": "طالب علوم حاسوب"},
    "desc": {"en": "CS student at Al-Azhar University, passionate about software engineering, networking, cybersecurity, and emerging technologies. I build practical solutions and never stop learning.",
             "ar": "طالب علوم حاسوب في جامعة الأزهر، شغوف بهندسة البرمجيات والشبكات والتقنيات الناشئة. أبني حلولًا عملية ولا أتوقف عن التعلم."},
    "location": {"en": "Gaza, Palestine", "ar": "غزة، فلسطين"},
    "university": "Al-Azhar University",
    "email": "abdallhalghoul200@gmail.com",
    "cv_path": "assets/Abdullah_ALGhoul_CV.pdf",
    "cta1": {"en": "View Projects", "ar": "شاهد المشاريع"},
    "cta2": {"en": "Contact Me", "ar": "تواصل معي"},
    "cta3": {"en": "Download CV", "ar": "تحميل السيرة"}
  },
  "paragraphs": [
    {"en": "I''m Abdullah Al-Ghoul, a Computer Science student who believes technology is one of the most powerful tools for solving real-world problems. I enjoy learning, experimenting, and building practical solutions that combine logic, creativity, and innovation.",
     "ar": "أنا عبدالله الغول، طالب علوم حاسوب أؤمن بأن التكنولوجيا من أقوى الأدوات لحل المشكلات الواقعية. أستمتع بالتعلم والتجريب وبناء حلول عملية تجمع بين المنطق والإبداع والابتكار."},
    {"en": "My interests span software engineering, networking, cybersecurity, and artificial intelligence. I constantly seek opportunities to improve my skills, explore new concepts, and contribute to meaningful technical projects.",
     "ar": "تمتد اهتماماتي عبر هندسة البرمجيات والشبكات والأمن السيبراني والذكاء الاصطناعي. أسعى باستمرار لتحسين مهاراتي واستكشاف مفاهيم جديدة والمساهمة في مشاريع تقنية ذات أثر."},
    {"en": "My long-term goal is to become a highly skilled Software Engineer with strong foundations in networking, cybersecurity, and modern software development practices.",
     "ar": "هدفي على المدى البعيد أن أصبح مهندس برمجيات متمكنًا بأساسيات قوية في الشبكات والأمن السيبراني وممارسات تطوير البرمجيات الحديثة."}
  ],
  "strengths": [
    {"en": "Problem Solving", "ar": "حل المشكلات"},
    {"en": "Teamwork", "ar": "العمل الجماعي"},
    {"en": "Communication", "ar": "التواصل"},
    {"en": "Self-Learning", "ar": "التعلم الذاتي"},
    {"en": "Critical Thinking", "ar": "التفكير النقدي"},
    {"en": "Public Speaking", "ar": "التحدث أمام الجمهور"}
  ],
  "education": {"degree": {"en": "B.Sc. Computer Science · Al-Azhar University", "ar": "بكالوريوس علوم الحاسوب · جامعة الأزهر"}, "period": {"en": "2023 – 2027/2028 (expected)", "ar": "2023 – 2027/2028 (متوقع)"}},
  "location": {"en": "Gaza, Palestine", "ar": "غزة، فلسطين"},
  "languages": [
    {"en": "Arabic — Native", "ar": "العربية — لغة أم"},
    {"en": "English — Professional", "ar": "الإنجليزية — مستوى مهني"}
  ],
  "focus": {"en": "Software · Networks · Security · AI", "ar": "برمجيات · شبكات · أمن · ذكاء اصطناعي"},
  "contact_desc": {"en": "Have an opportunity, scholarship, or a project to discuss? I''d love to hear from you.", "ar": "عندك فرصة أو منحة دراسية أو مشروع تحب تناقشه؟ يسعدني أسمع منك."},
  "availability": {"en": "Replies within 24 hours", "ar": "أرد خلال 24 ساعة"}
}'::jsonb)
on conflict (id) do nothing;

-- ---------- skill categories ----------
insert into public.skill_categories (key, label_en, label_ar, icon, sort_order) values
  ('programming', 'Programming',            'البرمجة',                    'code-2', 1),
  ('networking',  'Networking & Infra',     'الشبكات والبنية التحتية', 'network', 2),
  ('tools',       'Tools & Platforms',      'الأدوات والمنصات',        'wrench',  3),
  ('frontend',    'Frontend Development',   'تطوير الواجهات',          'layout',  4),
  ('ai',          'AI',                     'الذكاء الاصطناعي',         'brain',   5),
  ('learning',    'Currently Learning',     'أدرس حاليًا',              'book-open', 99)
on conflict (key) do nothing;

-- ---------- skills (tiers exactly as displayed on the current site) ----------
insert into public.skills (name, name_ar, category, tier, related_projects, enabled, sort_order) values
  ('Java',                  'جافا',            'programming', 4, '{task-manager,library-management-system}', true, 1),
  ('JavaScript',            'جافاسكربت',        'programming', 3, '{personal-portfolio-website}', true, 2),
  ('HTML5 / CSS3',          'HTML5 / CSS3',     'programming', 4, '{personal-portfolio-website}', true, 3),
  ('C',                     'لغة C',            'programming', 3, '{}', true, 4),
  ('Python',                'بايثون',           'programming', null, '{smarttimecoach}', true, 5),
  ('TCP/IP & Subnetting',   'TCP/IP وتقسيم الشبكات', 'networking', 4, '{enterprise-network-design}', true, 1),
  ('VLAN & Routing',        'VLAN والتجايز',    'networking',  3, '{enterprise-network-design}', true, 2),
  ('DHCP / DNS / NAT',      'DHCP / DNS / NAT', 'networking',  3, '{enterprise-network-design}', true, 3),
  ('Cisco Packet Tracer',   'Cisco Packet Tracer', 'networking', 3, '{enterprise-network-design}', true, 4),
  ('MikroTik',              'ميكروتك',          'networking',  null, '{}', true, 5),
  ('Git & GitHub',          'Git وGitHub',      'tools',       3, '{}', true, 1),
  ('AI Tools & Prompting',  'أدوات الذكاء الاصطناعي والهندسة الفورية', 'ai', 4, '{}', true, 1),
  ('Windows',               'ويندوز',           'tools',       3, '{}', true, 2),
  ('Linux (basics)',        'لينكس (أساسيات)',   'tools',       2, '{}', true, 2),
  ('React',                 'ريأكت',            'frontend',    null, '{al-azher-it-hub}', true, 1),
  ('Firebase',              'فايربيس',          'tools',       null, '{al-azher-it-hub}', true, 2),
  ('Frontend Development',  'تطوير الواجهات',   'learning',    null, '{}', true, 1),
  ('Java OOP',              'البرمجة الكائنية بـ Java', 'learning', null, '{}', true, 2),
  ('Data Structures',       'هياكل البيانات',   'learning',    null, '{}', true, 3),
  ('Algorithms',            'الخوارزميات',      'learning',    null, '{}', true, 3),
  ('Software Engineering Principles', 'مبادئ هندسة البرمجيات', 'learning', null, '{}', true, 3)
on conflict do nothing;

-- ---------- projects ----------
insert into public.projects (slug, legacy_key, title_en, title_ar, badge_en, badge_ar, summary_en, summary_ar, stack, tags, cover_path, live_url, repo_url, extra_url, extra_url_label_en, extra_url_label_ar, case_study, status, is_featured, featured_rank, sort_order, published_at) values
('al-azher-it-hub', 'p4', 'AL-Azher IT Hub', 'AL-Azher IT Hub', 'Live', 'مباشر',
 'Bilingual educational platform for Al-Azhar University IT students — lectures, resources, and study materials. Built with React, Tailwind CSS, and Firebase, with PWA support for offline access.',
 'منصة تعليمية ثنائية اللغة لطلبة تكنولوجيا المعلومات في جامعة الأزهر — محاضرات وموارد ومواد دراسية، مبنية بـ React وTailwind CSS وFirebase مع دعم PWA للوصول بدون إنترنت.',
 array['React','Tailwind CSS','Firebase','PWA'], '{education}',
 null, 'https://al-azher-it-hub.vercel.app/', null, null, '', '',
 '{"problem":{"en":"Students needed a centralized platform to organize lectures, resources, and study materials.","ar":"احتاج الطلاب منصة مركزية لتنظيم المحاضرات والموارد والمواد الدراسية."},"approach":{"en":"Developed a bilingual educational platform using React, Tailwind CSS, and Firebase.","ar":"طوّرت منصة تعليمية ثنائية اللغة باستخدام React وTailwind CSS وFirebase."},"outcome":{"en":"Created an accessible digital hub that improves students'' access to academic resources.","ar":"أنشأت مركزاً رقمياً سهل الوصول يحسّن وصول الطلاب إلى الموارد الأكاديمية."}}',
 'published', true, 1, 1, now()),

 ('personal-portfolio-website', 'p1', 'Personal Portfolio Website', 'موقع التعريف الشخصي', 'Live · This Site', 'مباشر · هذا الموقع',
 'A responsive, modern, bilingual portfolio showcasing my skills, projects, and educational milestones. Built with semantic HTML, modern CSS, and vanilla JavaScript. Includes dark/light theme and full RTL support.',
 'موقع شخصي متجاوب وحديث وثنائي اللغة يعرض مهاراتي ومشاريعي وإنجازاتي التعليمية. مبني بـ HTML دلالي وCSS حديث وJavaScript نقي — بدون أي تبعيات خارجية. يتضمن وضع داكن/فاتح ودعم كامل للعربية.',
 array['HTML5','CSS3','JavaScript','i18n','RTL'], '{}',
 null, 'https://abdullah-portfolio26.vercel.app/', null, null, '', '',
 '{"problem":{"en":"As a CS student, I needed one fast, professional place to present my skills, projects, and certifications.","ar":"كطالب علوم حاسوب، كنت بحاجة إلى مكان واحد سريع واحترافي أعرض فيه مهاراتي ومشاريعي وشهاداتي."},"approach":{"en":"Built a dependency-free portfolio with semantic HTML, modern CSS, and vanilla JavaScript — bilingual with full RTL support and PWA offline mode.","ar":"بنيت موقعاً بلا تبعيات باستخدام HTML دلالي وCSS حديث وJavaScript نقي — ثنائي اللغة مع دعم RTL كامل وعمل دون اتصال (PWA)."},"outcome":{"en":"A fast, responsive site that loads instantly, works offline, and stays easy to maintain with no build step.","ar":"موقع سريع ومتجاوب يُحمّل فوراً ويعمل دون اتصال ويسهل صيانته بلا خطوات بناء."}}',
 'published', true, 2, 2, now()),

 ('enterprise-network-design', 'p2', 'Enterprise Network Design', 'تصميم شبكة مؤسسية', 'Completed', 'مكتمل',
 'Designed and implemented a segmented business network using VLANs, DHCP, DNS, NAT, subnetting, and Router-on-a-Stick architecture in Cisco Packet Tracer.',
 'صممت ونفذت شبكة أعمال مقسّمة باستخدام VLANs وDHCP وDNS وNAT والعنونة الفرعية ومعمارية Router-on-a-Stick داخل Cisco Packet Tracer.',
 array['Cisco Packet Tracer','VLAN','DHCP','DNS','NAT','Routing'], '{}',
 null, null, null, 'https://drive.google.com/drive/folders/18qSsF9Tf5nvHELcvJfpIqqO4rk7ipbp9?usp=sharing',
 'Project Diagram', 'مخطط المشروع',
 '{"problem":{"en":"A growing business needed a scalable network with no traffic segmentation between departments and no centralized services.","ar":"شركة متنامية تحتاج شبكة قابلة للتوسع، بلا فصل لحركة المرور بين الأقسام وبلا خدمات مركزية."},"approach":{"en":"Designed a segmented network with per-department VLANs, DHCP/DNS/NAT services, subnetting, and a Router-on-a-Stick architecture in Cisco Packet Tracer.","ar":"صممت شبكة مقسّمة بـ VLAN لكل قسم وخدمات DHCP/DNS/NAT وعنونة فرعية ومعمارية Router-on-a-Stick في Cisco Packet Tracer."},"outcome":{"en":"A scalable, documented topology with isolated broadcast domains and centralized services.","ar":"بنية موثقة قابلة للتوسع مع نطاقات بث معزولة وخدمات مركزية."}}',
 'published', false, 0, 2, now()),

 ('smart-university-virtual-lab', 'p3', 'Smart University Virtual Lab', 'المختبر الجامعي الافتراضي الذكي', 'Concept Proposal', 'مقترح',
 'Proposed cloud-based virtual desktop infrastructure enabling university students to access a full Windows workstation from mobile devices via RDP. Designed to help students without personal computers access programming environments remotely.',
 'مقترح لبنية سطح مكتب افتراضي سحابية تتيح لطلاب الجامعة الوصول إلى محطة عمل ويندوز كاملة من أجهزتهم المحمولة عبر RDP. صُمم لمساعدة الطلاب الذين لا يمتلكون أجهزة حاسوب شخصية.',
 array['RDP','Windows','Azure','Cloud Infra','VPN'], '{}',
 null, null, null, null, '', '',
 '{"problem":{"en":"Many students without personal computers cannot complete programming assignments or lab work, especially during remote learning.","ar":"كثير من الطلاب بلا حواسيب شخصية لا يستطيعون إنجاز الواجبات البرمجية والعمل المخبري، خصوصاً أثناء التعلم عن بُعد."},"approach":{"en":"Proposed a cloud VDI where students sign in from any mobile device and get a full Windows workstation via RDP, covering Azure VMs, VPN access, and per-session provisioning.","ar":"اقترحت VDI سحابية يدخل منها الطالب من أي جهاز ويحصل على محطة ويندوز كاملة عبر RDP، مع أجهزة Azure الافتراضية والوصول عبر VPN وتجهيز الجلسات."},"outcome":{"en":"A ready-to-implement blueprint that turns any smartphone into a full computer for university labs.","ar":"مخطط جاهز للتنفيذ يحوّل أي هاتف إلى حاسوب كامل للمختبرات الجامعية."},"status_note":{"en":"Proposal / future implementation","ar":"مقترح / تنفيذ مستقبلي"}}',
 'published', false, 0, 3, now()),

 ('task-manager', 'p5', 'Task Manager', 'مدير المهام', 'Team Project', 'مشروع جماعي',
 'Team task management application for organizing and tracking shared tasks with colleagues. Features task creation, assignment, status tracking, and deadline management.',
 'تطبيق لإدارة المهام الجماعية مع الزملاء — يتضمن إنشاء المهام وتعيينها وتتبع حالتها وإدارة المواعيد النهائية.',
 array['Java','OOP','File I/O','Team Collaboration'], '{}',
 null, null, null, null, '', '',
 '{"problem":{"en":"Our team had no reliable way to assign shared tasks, track their status, or respect deadlines.","ar":"لم تكن لدينا وسيلة موثوقة لتعيين المهام المشتركة وتتبع حالتها واحترام المواعيد النهائية."},"approach":{"en":"Built a Java task management app with OOP design — task creation, assignment, status tracking, and deadline management with file persistence.","ar":"طوّرت تطبيق إدارة مهام بلغة Java بتصميم كائني — إنشاء وتعيين وتتبع حالة وإدارة مواعيد مع حفظ البيانات في ملفات."},"outcome":{"en":"A practical tool that kept the team organized and shipped as a graded team project.","ar":"أداة عملية أبقت الفريق منظماً وسُلّمت كمشروع جماعي مقيّم."}}',
 'published', false, 0, 4, now()),

 ('library-management-system', 'p6', 'Library Management System', 'نظام إدارة المكتبة', 'Completed', 'مكتمل',
 'Java-based library management system for managing books, borrowers, and lending operations. Includes add, search, borrow, return functionality with data persistence.',
 'نظام إدارة مكتبة مبني بلغة الجافا — لإدارة الكتب والمستعيرين وعمليات الإعارة مع إضافة وبحث وإعارة وإرجاع مع حفظ البيانات.',
 array['Java','OOP','Data Structures','File I/O'], '{}',
 null, null, null, null, '', '',
 '{"problem":{"en":"Manual book tracking made searching titles, managing borrowers, and recording loans slow and unreliable.","ar":"التتبع اليدوي للكتب جعل البحث عن العناوين وإدارة المستعيرين وتسجيل الإعارات بطيئاً وغير موثوق."},"approach":{"en":"Built a Java library system covering add, search, borrow, and return flows, backed by data structures and file persistence.","ar":"بنيت نظام مكتبة بلغة Java يشمل الإضافة والبحث والاستعارة والإرجاع، مدعوماً بهياكل بيانات وحفظ في ملفات."},"outcome":{"en":"A dependable system that streamlines cataloging and lending for a small library.","ar":"نظام موثوق يبسّط الفهرسة والإعارة في مكتبة صغيرة."}}',
 'published', false, 0, 4, now()),

 ('smarttimecoach', 'p7', 'SmartTimeCoach', 'SmartTimeCoach', 'Personal Project', 'مشروع شخصي',
 'Python productivity assistant with automated reminders that helps manage tasks and study schedules more effectively.',
 'مساعد إنتاجية بلغة Python مع تذكيرات تلقائية يساعد على إدارة المهام وجداول الدراسة بشكل أكثر فعالية.',
 array['Python','Automation','Scheduling'], '{}',
 null, null, null, null, '', '',
 '{"problem":{"en":"Students struggle with managing tasks and study schedules.","ar":"يعاني الطلاب من إدارة المهام وجداول الدراسة."},"approach":{"en":"Created a Python productivity assistant with automated reminders.","ar":"طوّرت مساعد إنتاجية بلغة Python مع تذكيرات تلقائية."},"outcome":{"en":"Improved personal task organization and time management.","ar":"تحسين تنظيم المهام الشخصية وإدارة الوقت."}}',
 'published', false, 0, 5, now())
on conflict (slug) do nothing;

-- ---------- certifications (11, exactly as on the live site) ----------
insert into public.certifications (title_en, title_ar, issuer_en, issuer_ar, issued_on, image_path, icon, sort_order, status) values
  ('AI Fundamentals', 'أساسيات الذكاء الاصطناعي', 'Google · Coursera', 'Google · Coursera', 'Aug 2026', 'assets/certs/google-ai-fundamentals.jpg', 'brain', 1, 'published'),
  ('Learn Git & GitHub', 'تعلّم Git و GitHub', 'M3aarf Platform', 'منصة معارف', 'Aug 2026', 'assets/certs/fa03448a.jpg', 'folder-git-2', 2, 'published'),
  ('AI for All: From Basics to GenAI Practice', 'AI for All: من الأساسيات إلى ممارسة GenAI', 'NVIDIA Academy', 'أكاديمية NVIDIA', 'Mar 2026', 'assets/certs/nvidia-ai.jpg', 'cpu', 3, 'published'),
  ('AI Foundations', 'AI Foundations', 'OpenAI Academy', 'أكاديمية OpenAI', 'Jul 2026', 'assets/certs/openai-ai-foundations.jpg', 'sparkles', 4, 'published'),
  ('Claude Code in Action', 'كود كلاود بالتطبيق', 'Anthropic · Coursera', 'Anthropic · Coursera', 'Aug 2026', 'assets/certs/claude-code-in-action.jpg', 'brain-circuit', 5, 'published'),
  ('Claude Code 101', 'كود كلاود 101', 'Anthropic', 'Anthropic', 'Aug 2026', 'assets/certs/anthropic-claude-code-101.png', 'brain-circuit', 5, 'published'),
  ('Claude 101', 'Claude 101', 'Anthropic', 'Anthropic', 'Jul 2026', 'assets/certs/anthropic-claude101.png', 'brain-circuit', 6, 'published'),
  ('CS101: Introduction to Programming I', 'CS101: مقدمة في البرمجة الأولى', 'Saylor Academy', 'أكاديمية Saylor', 'Jan 2026', 'assets/certs/saylor-cs101.jpg', 'graduation-cap', 6, 'published'),
  ('ICDL Base Certification', 'شهادة ICDL الأساسية', 'Edraak', 'إدراك', 'Jan 2026', 'assets/certs/icdl.jpg', 'monitor-check', 6, 'published'),
  ('Data Science & Analytics', 'علوم البيانات والتحليلات', 'HP LIFE', 'HP LIFE', '2025', 'assets/certs/hp-data-science.jpg', 'bar-chart-3', 7, 'published'),
  ('Critical Thinking in the Age of AI', 'التفكير النقدي في عصر الذكاء الاصطناعي', 'HP LIFE', 'HP LIFE', '2025', 'assets/certs/hp-critical-thinking.jpg', 'lightbulb', 8, 'published')
on conflict do nothing;

-- ---------- experiences ----------
insert into public.experiences (kind, title_en, title_ar, org_en, org_ar, period_en, period_ar, summary_en, summary_ar, details_en, details_ar, sort_order, status) values
  ('independent', 'Networking & IT Support Projects', 'مشاريع شبكات ودعم تقني', '', '', '2023 – Present', '2023 – الآن',
   '', '',
   array['LAN design & IP addressing plans','Router, DHCP, DNS, NAT configuration','Connectivity troubleshooting','Technical documentation & flowcharts','Community technical support'],
   array['تصميم LAN وخطط عنونة IP','إعداد الراوتر وDHCP وDNS وNAT','استكشاف أعطال الاتصال','توثيق تقني ومخططات انسيابية','دعم تقني للمجتمع'],
   1, 'published'),
  ('academic', 'CS Journey Begins', 'بداية رحلة علوم الحاسوب', 'Al-Azhar University', 'جامعة الأزهر', '2023', '2023', '', '', '{}', '{}', 2, 'published'),
  ('academic', 'Networking Projects', 'مشاريع الشبكات', '', '', '2024', '2024', '', '', '{}', '{}', 2, 'published'),
  ('academic', 'ICDL Certification', 'شهادة ICDL', 'Edraak', 'إدراك', '2025', '2025', '', '', '{}', '{}', 2, 'published'),
  ('academic', 'OpenAI & Anthropic AI Tracks', 'مسارات OpenAI و Anthropic للذكاء الاصطناعي', '', '', '2026', '2026', '', '', '{}', '{}', 2, 'published'),
  ('academic', 'NVIDIA AI Certification', 'شهادة NVIDIA في الذكاء الاصطناعي', 'NVIDIA Academy', 'أكاديمية NVIDIA', '2026', '2026', '', '', '{}', '{}', 2, 'published');

-- ---------- recommendations ----------
insert into public.recommendations (person_name, role_en, role_ar, org_en, org_ar, relationship, quote_en, quote_ar, avatar_path, is_featured, sort_order, status) values
  ('Mr. Abdelbaset R. Almasri', 'Lecturer of Computer Science · Al-Azhar University', 'محاضر علوم الحاسوب · جامعة الأزهر', 'Al-Azhar University', 'جامعة الأزهر', 'Lecturer',
   'Abdullah is one of the most passionate students I have taught. He demonstrates strong collaboration, presentation, time management, and problem-solving skills.',
   'عبدالله من أكثر الطلاب شغفًا الذين درّستهم. يُظهر مهارات قوية في التعاون والعرض وإدارة الوقت وحل المشكلات.',
   'assets/dr-almasri.jpg', true, 1, 'published'),
  ('Dr. Adel A. Ahmed', 'Lecturer of Computer Science · Al-Azhar University', 'محاضر علوم الحاسوب · جامعة الأزهر', 'Al-Azhar University', 'جامعة الأزهر', 'Lecturer',
   'Abdullah has been a remarkable student and an asset to our university. He is hardworking, reliable, and works exceptionally well in teams.',
   'عبدالله طالب استثنائي وأصل ثمين لجامعتنا. مجتهد وموثوق ويعمل بشكل ممتاز في الفرق.',
   'assets/dr-ahmed.jpg', false, 2, 'published'),
  ('Yazan W. Abo_Elqomboz', 'Project Team Member', 'عضو فريق مشروع', '—', '—', 'Teammate',
   'Abdullah is an exceptional team member who is collaborative, reliable, and a natural problem solver. A dedicated self-learner and a strong communicator who always elevates the quality of our projects.',
   'عبدالله عضو فريق استثنائي، متعاون وموثوق، ومحل طبيعي للمشكلات. متعلم ذاتي مخلص ومتواصل قوي يرتقي دائمًا بجودة مشاريعنا.',
   'assets/yazan.jpg', false, 3, 'published')
on conflict do nothing;

-- ---------- social links ----------
insert into public.social_links (platform, url, label_en, label_ar, icon, sort_order) values
  ('email',    'mailto:abdallhalghoul200@gmail.com', 'Email', 'البريد الإلكتروني', 'mail', 1),
  ('linkedin', 'https://www.linkedin.com/in/abdullah-al-ghoul-a254763a6/', 'LinkedIn', 'لينكدإن', 'linkedin', 2),
  ('github',   'https://github.com/abdallah-al-ghoul', 'GitHub', 'جيت هاب', 'globe', 3)
on conflict do nothing;

-- ---------- cv ----------
insert into public.cv_versions (storage_path, version_label, is_active, is_published, notes)
values ('cv/Abdullah_ALGhoul_CV.pdf', 'Initial', true, true, 'Bundled with the static site at deploy time; migrate to Storage when the dashboard is live.')
on conflict do nothing;
