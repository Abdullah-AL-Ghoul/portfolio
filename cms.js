/*
 * Abdullah Portfolio V2 — CMS binding.
 * Fetches published content from /api/content (Supabase, RLS-protected)
 * and applies it to the static DOM in place. The static HTML stays as the
 * offline/fallback source of truth: if the API is absent, disabled, or
 * fails, the site keeps exactly the content it ships with.
 *
 * Security: every CMS string is inserted with textContent / setAttribute
 * (never innerHTML), so stored content cannot inject markup.
 */
(function () {
  'use strict';

  var CACHE_KEY = 'pf_cms_cache';
  var CACHE_TTL = 5 * 60 * 1000;

  var state = { data: null, lang: document.documentElement.lang === 'ar' ? 'ar' : 'en' };

  function pickLocalized(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return String(value[lang] || value.en || '');
    return '';
  }

  function setText(el, text) {
    if (el && typeof text === 'string' && text.length) el.textContent = text;
  }

  function applyProjects(data, lang) {
    var cards = document.querySelectorAll('.project-card[data-project]');
    var byKey = {};
    (data.projects || []).forEach(function (p) {
      if (p.legacy_key) byKey[p.legacy_key] = p;
    });
    cards.forEach(function (card) {
      var key = card.getAttribute('data-project');
      var p = byKey[key];
      if (!p) return;
      setText(card.querySelector('h3'), lang === 'ar' ? p.title_ar : p.title_en);
      setText(card.querySelector('.project-tag'), lang === 'ar' ? p.badge_ar : p.badge_en);
      setText(card.querySelector('.project-body p'), lang === 'ar' ? p.summary_ar : p.summary_en);
      var tags = card.querySelector('.project-tags');
      if (tags && Array.isArray(p.stack) && p.stack.length) {
        tags.innerHTML = '';
        p.stack.forEach(function (t) {
          var s = document.createElement('span');
          s.textContent = t;
          tags.appendChild(s);
        });
      }
      var links = card.querySelector('.project-links');
      if (links && p.live_url) {
        var live = links.querySelector('a.btn-primary, a.btn-outline');
        if (live && live.href !== p.live_url) live.href = p.live_url;
      }
      card.classList.toggle('featured', !!p.is_featured);
      card.classList.toggle('featured-primary', Number(p.featured_rank) === 1);
    });
  }

  function applyCerts(data, lang) {
    document.querySelectorAll('.cert-card').forEach(function (card) {
      var title = card.getAttribute('data-cert-title');
      var match = (data.certifications || []).find(function (c) {
        return c.title_en === title;
      });
      if (!match) return;
      setText(card.querySelector('.cert-org'), lang === 'ar' ? (match.issuer_ar || match.issuer_en) : match.issuer_en);
      setText(card.querySelector('.cert-title'), lang === 'ar' ? (match.title_ar || match.title_en) : match.title_en);
      setText(card.querySelector('.cert-date'), translateDate(match.issued_on, lang));
      if (match.image_path) card.setAttribute('data-cert', match.image_path);
    });
  }

  function applyRecommendations(data, lang) {
    var cards = document.querySelectorAll('.testimonial');
    (data.recommendations || []).forEach(function (r, i) {
      var fig = cards[i];
      if (!fig) return;
      setText(fig.querySelector('blockquote'), (lang === 'ar' ? r.quote_ar : r.quote_en) || '');
      setText(fig.querySelector('.t-name'), r.person_name);
      setText(fig.querySelector('.t-role'), lang === 'ar' ? (r.role_ar || r.role_en) : r.role_en);
    });
  }

  function applyAbout(data, lang) {
    var about = data.about && data.about.data;
    if (!about) return;
    var get = function (k) {
      var v = about[k];
      return v ? String(v[lang] || v.en || '') : '';
    };
    setText(document.querySelector('[data-i18n="hero.status"]'), (about.status || {})[lang]);
    setText(document.querySelector('[data-i18n="hero.desc"]'), (about.desc || {})[lang]);
    setText(document.querySelector('[data-i18n="about.p1"]'), (about.paragraphs[0] || {})[lang]);
    setText(document.querySelector('[data-i18n="about.p2"]'), (about.paragraphs[1] || {})[lang]);
    setText(document.querySelector('[data-i18n="about.p3"]'), (about.paragraphs[2] || {})[lang]);
    setText(document.querySelector('[data-i18n="contact.desc"]'), (about.contact_desc || {})[lang]);
    setText(document.querySelector('[data-i18n="contact.avail"]'), (about.availability || {})[lang]);
  }

  function translateDate(d, lang) {
    if (!d) return '';
    if (lang !== 'ar') return d;
    var map = { Jan: 'يناير', Feb: 'فبراير', Mar: 'مارس', Mar2: 'مارس', Apr: 'أبريل', May: 'مايو', Jun: 'يونيو', Jul: 'يوليو', Aug: 'أغسطس', Sep: 'سبتمبر', Oct: 'أكتوبر', Nov: 'نوفمبر', Dec: 'ديسمبر' };
    return d.replace(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/g, function (m) { return map[m] || m; });
  }

  function exposeCases(data) {
    // Feed CMS case studies to the existing case-study modal.
    var cases = { en: {}, ar: {} };
    (data.projects || []).forEach(function (p) {
      var cs = p.case_study || {};
      var key = p.legacy_key || p.slug;
      ['en', 'ar'].forEach(function (l) {
        cases[l][key] = {
          tag: l === 'ar' ? (p.badge_ar || p.badge_en) : (p.badge_en || p.badge_ar),
          title: l === 'ar' ? p.title_ar : p.title_en,
          problem: (cs.problem || {})[l] || '',
          solution: (cs.approach || {})[l] || '',
          result: (cs.outcome || {})[l] || '',
          implementation: (cs.implementation || {})[l] || '',
          role: (cs.role || {})[l] || '',
          challenges: Array.isArray(cs.challenges)
            ? cs.challenges.map(function (c) { return (c || {})[l] || ''; }).filter(Boolean)
            : [],
          tech: Array.isArray(p.stack) ? p.stack : [],
          links: []
        };
      });
    });
    window.PF_CASES_OVERRIDE = cases;
  }

  function apply(data) {
    var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    if (!data || !data.enabled) return;
    applyProjects(data, lang);
    applyCerts(data, lang);
    applyRecommendations(data, lang);
    applyAbout(data, lang);
    exposeCases(data);
  }

  function fetchContent() {
    if (location.protocol === 'file:') return;
    fetch('/api/content', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.enabled) return;
        try { localStorage.setItem('pf_cms_cache', JSON.stringify({ at: Date.now(), data: data })); } catch (e) {}
        apply(data);
      })
      .catch(function () { /* static content stays */ });
  }

  // Apply from cache immediately (stale-while-revalidate), then refresh.
  try {
    var cached = JSON.parse(localStorage.getItem('pf_cms_cache') || 'null');
    if (cached && Date.now() - cached.at < CACHE_TTL) apply(cached.data);
  } catch (e) {}

  fetchContent();

  // Re-apply when the visitor switches language.
  document.addEventListener('pf:langchange', function () {
    try {
      var cached = JSON.parse(localStorage.getItem('pf_cms_cache') || 'null');
      if (cached) apply(cached.data);
    } catch (e) {}
  });

  window.PFCMS = { apply: apply };
})();
