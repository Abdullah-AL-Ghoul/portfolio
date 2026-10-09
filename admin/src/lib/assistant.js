import { SCHEMAS, slugify } from './schemas';

/**
 * Client-side "smart assistant" draft generator.
 * Turns a natural-language request (Arabic or English) into a complete,
 * schema-shaped row for the chosen collection — without needing an LLM key.
 * The UI can further refine the draft, but the base generator always works offline.
 */

const AR = /[\u0600-\u06FF]/;
const isArabic = (s) => AR.test(String(s || ''));

// Common tech keywords → friendly tags, so stack/related_projects get real content.
const TECH = new Map([
  ['python', 'Python'], ['javascript', 'JavaScript'], ['js', 'JavaScript'], ['typescript', 'TypeScript'],
  ['react', 'React'], ['html', 'HTML'], ['css', 'CSS'], ['nodejs', 'Node.js'], ['node', 'Node.js'],
  ['express', 'Express'], ['java', 'Java'], ['c++', 'C++'], ['sql', 'SQL'], ['postgres', 'PostgreSQL'],
  ['postgresql', 'PostgreSQL'], ['supabase', 'Supabase'], ['firebase', 'Firebase'], ['git', 'Git'],
  ['github', 'GitHub'], ['linux', 'Linux'], ['aws', 'AWS'], ['azure', 'Azure'], ['docker', 'Docker'],
  ['tailwind', 'Tailwind CSS'], ['bootstrap', 'Bootstrap'], ['django', 'Django'], ['flask', 'Flask'],
  ['oop', 'OOP'], ['cisco', 'Cisco'], ['vlan', 'VLAN'], ['dhcp', 'DHCP'], ['dns', 'DNS'], ['nat', 'NAT'],
  ['subnet', 'Subnetting'], ['rdp', 'RDP'], ['packet tracer', 'Packet Tracer'], ['machine learning', 'Machine Learning'],
  ['ml', 'Machine Learning'], ['ai', 'AI'], ['api', 'REST API'], ['rest', 'REST'], ['json', 'JSON'], ['c#', 'C#']
]);

function detectStack(text) {
  const t = String(text || '').toLowerCase();
  const found = [];
  for (const [k, label] of TECH) {
    if (t.includes(k)) found.push(label);
  }
  return found.slice(0, 6);
}

function guessCategory(text) {
  const t = String(text || '').toLowerCase();
  if (/(شبكة|شبكات|network|cisco|vlan|dhcp|dns|nat|routing|infra|routers|switch)/.test(t)) return 'networking';
  if (/(ذكاء|اي|ai|ml|model|learning|عصب|machine learning|лава|data|بيانات)/.test(t)) return 'ai';
  if (/(frontend|واجهة|react|web design|تصميم|tailwind|ui|front)/.test(t)) return 'frontend';
  if (/(java|c\+\+|c#|python|oop|برمجة|code|algorithm|خوارزمیات|كود)/.test(t)) return 'programming';
  if (/(tool|git|github|linux|اداة|أداة|docker|cli)/.test(t)) return 'tools';
  return 'learning';
}

function guessKind(text) {
  const t = String(text || '').toLowerCase();
  if (/(intern|تدريب|متدرب)/.test(t)) return 'internship';
  if (/(volunteer|تطوع)/.test(t)) return 'volunteer';
  if (/(academic|جامعة|مشروع جامعي|student project|study)/.test(t)) return 'academic';
  if (/(freelance|self|مستقل|independent)/.test(t)) return 'independent';
  return 'employment';
}

const AR2EN = {
  'مشروع': 'Project', 'موقع': 'Website', 'تطبيق': 'Application', 'نظام': 'System',
  'إدارة': 'Management', 'مهام': 'Tasks', 'مكتبة': 'Library', 'منصة': 'Platform',
  'تصميم': 'Design', 'شبكة': 'Network', 'شبكات': 'Networks', 'تعلم': 'Learning',
  'معرض': 'Portfolio', 'بيانات': 'Data', 'افتراضي': 'Virtual', 'جامعة': 'University',
  'ذكاء': 'Intelligence', 'تتبع': 'Tracking', 'مشاركة': 'Sharing', 'مختبر': 'Lab'
};

const EN2AR = Object.fromEntries(Object.entries(AR2EN).map(([a, e]) => [e.toLowerCase(), a]));

function enHeading(s) {
  const t = String(s || '').trim();
  if (!t) return '';
  const lower = t.toLowerCase();
  let out = t;
  for (const [k, labelEn] of TECH) {
    if (lower === k) return labelEn;
  }
  // strip leading noise like "I want to add", "أضف", "add a/an"
  out = out.replace(/^(i want to (add|create|make|build) |please |add an? |create an? |make an? |build an? )/i, '');
  out = out.replace(/^(عايز\s+|بدي\s+|أضف\s+|اضيف\s+|إضافة\s+|عمِل\s+|من فضلك\s+|لو سمحت\s+)/, '');
  return out.trim().charAt(0).toUpperCase() + out.trim().slice(1);
}

export function buildDraft(schemaKey, requestText) {
  const entry = SCHEMAS[schemaKey];
  if (!entry) throw new Error(`Unknown content type "${schemaKey}"`);
  const schema = entry.schema;
  const text = String(requestText || '').trim();
  const ar = isArabic(text);
  const enTitle = enHeading(text);
  const stack = detectStack(text);

  const draft = { status: 'draft' };

  schema.fields.forEach((f) => {
    if (f.key === 'status') return;
    const d = f.default;
    const defaultVal = (d !== undefined && d !== null) ? (typeof d === 'function' ? d() : d)
      : f.type === 'checkbox' ? false : f.type === 'tags' ? [] : f.type === 'number' ? 0 : f.type === 'json' ? {} : '';
    draft[f.key] = defaultVal;

    switch (f.key) {
      case 'slug': draft[f.key] = slugify(enTitle) || ''; break;
      case 'title_en':
        draft[f.key] = ar ? translateFallbackEn(text) : (enTitle || 'New ' + entry.singular);
        break;
      case 'title_ar':
        draft[f.key] = ar ? (enTitle || 'عنوان جديد').slice(0, 120) : translateFallbackAr(text);
        break;
      case 'name':
        draft[f.key] = ar ? (enTitle || 'Skill') : (enTitle || 'Skill');
        break;
      case 'name_ar':
        draft[f.key] = ar ? (enTitle || '') : translateFallbackAr(text);
        break;
      case 'category': draft[f.key] = guessCategory(text); break;
      case 'kind': draft[f.key] = guessKind(text); break;
      case 'stack': draft[f.key] = stack; break;
      case 'technologies': draft[f.key] = stack; break;
      case 'related_projects': draft[f.key] = []; break;
      case 'related_project_keys': draft[f.key] = []; break;
      case 'features': draft[f.key] = [{ en: ar ? '' : text, ar: ar ? text : '' }]; break;
      case 'tags': draft[f.key] = stack; break;
      case 'summary_en': draft[f.key] = ar ? '' : text; break;
      case 'summary_ar': draft[f.key] = ar ? text : ''; break;
      case 'quote_en': draft[f.key] = ar ? '' : text; break;
      case 'quote_ar': draft[f.key] = ar ? text : ''; break;
      case 'details_en': draft[f.key] = []; break;
      case 'details_ar': draft[f.key] = []; break;
      case 'enabled': draft[f.key] = true; break;
      case 'is_featured': draft[f.key] = false; break;
      case 'sort_order': draft[f.key] = 0; break;
      case 'featured_rank': draft[f.key] = 0; break;
      case 'tier': draft[f.key] = null; break;
      case 'case_study': draft[f.key] = {}; break;
      case 'icon': draft[f.key] = 'badge-check'; break;
      default: break;
    }
  });

  return { schema, entry, draft, stack, language: ar ? 'ar' : 'en' };
}

function translateFallbackEn(t) {
  const clean = String(t || '').replace(AR, ' ').replace(/\s+/g, ' ').trim();
  // map known arabic words to english
  let out = clean;
  for (const [a, e] of Object.entries(AR2EN)) {
    if (clean.includes(a)) { out = e; break; }
  }
  return out || 'New entry';
}

function translateFallbackAr(t) {
  const lower = String(t || '').toLowerCase();
  for (const [a, e] of Object.entries(EN2AR)) {
    if (lower.includes(a)) return e;
  }
  return '';
}
