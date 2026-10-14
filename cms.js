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
  var CACHE_TTL = 30 * 1000; // 30s TTL so dashboard updates reflect quickly

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
    var grid = document.querySelector('.projects-grid');

    // Dynamic cards from a previous apply are rebuilt from scratch each time
    // so removals/unpublish and language switches stay consistent.
    if (grid) {
      Array.prototype.slice.call(grid.querySelectorAll('.project-card[data-dynamic]')).forEach(function (c) {
        c.remove();
      });
    }

    var byKey = {};
    (data.projects || []).forEach(function (p) {
      if (p.legacy_key) byKey[p.legacy_key] = p;
    });
    document.querySelectorAll('.project-card[data-project]').forEach(function (card) {
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

    // Projects published from the dashboard that have no static card are
    // rendered here, so "add in dashboard → appears on the site" actually works.
    if (!grid) return;
    var present = {};
    document.querySelectorAll('.project-card[data-project]').forEach(function (c) {
      present[c.getAttribute('data-project')] = true;
    });
    var added = 0;
    (data.projects || []).forEach(function (p) {
      var key = p.legacy_key || p.slug;
      if (!key || present[key]) return;
      present[key] = true;
      grid.appendChild(buildProjectCard(p, key, lang));
      added++;
    });
    if (added && window.lucide) window.lucide.createIcons();
  }

  // Keyword-based cover variant / icon selection for dashboard-added projects.
  function pickCoverIcon(p) {
    var hay = ((p.title_en || '') + ' ' + (p.title_ar || '') + ' ' +
      (Array.isArray(p.stack) ? p.stack.join(' ') : '')).toLowerCase();
    if (/network|cisco|vlan|dns|dhcp|router|switch|شبك/.test(hay)) return { cover: 'network', icon: 'network' };
    if (/cloud|azure|aws|rdp|vdi|سحاب/.test(hay)) return { cover: 'cloud', icon: 'cloud' };
    if (/library|book|مكتب/.test(hay)) return { cover: 'library', icon: 'book-marked' };
    if (/task|todo|coach|timer|pomodoro|مهم|مؤقت/.test(hay)) return { cover: 'tasks', icon: 'alarm-clock' };
    if (/school|university|course|تعليم|جامع/.test(hay)) return { cover: 'edu', icon: 'graduation-cap' };
    if (/ai|machine learning|ذكاء|bot/.test(hay)) return { cover: 'portfolio', icon: 'brain-circuit' };
    return { cover: 'portfolio', icon: 'folder-git-2' };
  }

  function buildCover(p, lang) {
    var wrap = document.createElement('div');
    wrap.className = 'project-cover';
    if (p.cover_path) {
      // Media-library path: real image wins over decorative variants.
      var img = document.createElement('img');
      img.src = p.cover_path;
      img.alt = '';
      img.loading = 'lazy';
      wrap.appendChild(img);
      return wrap;
    }
    var pick = pickCoverIcon(p);
    wrap.setAttribute('data-cover', pick.cover);
    var inner = document.createElement('div');
    inner.className = 'project-cover-' + pick.cover;
    if (pick.cover === 'portfolio') {
      wrap.appendChild(inner);
      var glow = document.createElement('div');
      glow.className = 'project-cover-glow';
      wrap.appendChild(glow);
      return wrap;
    }
    if (pick.cover === 'network' || pick.cover === 'tasks' || pick.cover === 'library') {
      var n = pick.cover === 'tasks' ? 4 : 6;
      for (var i = 0; i < n; i++) inner.appendChild(document.createElement('span'));
      wrap.appendChild(inner);
      return wrap;
    }
    if (pick.cover === 'timer') {
      var dial = document.createElement('span');
      dial.className = 'timer-dial';
      inner.appendChild(dial);
    }
    wrap.appendChild(inner);
    return wrap;
  }

  function buildProjectCard(p, key, lang) {
    var article = document.createElement('article');
    article.className = 'project-card';
    // No reveal classes: the IntersectionObserver only observes markup present
    // at load, so dynamically added cards must be visible immediately.
    article.setAttribute('data-project', key);
    article.setAttribute('data-dynamic', '1');

    article.appendChild(buildCover(p, lang));

    var body = document.createElement('div');
    body.className = 'project-body';

    var tag = document.createElement('div');
    tag.className = 'project-tag';
    tag.textContent = (lang === 'ar' ? p.badge_ar : p.badge_en) || (lang === 'ar' ? 'مشروع' : 'Project');
    body.appendChild(tag);

    var iconWrap = document.createElement('div');
    iconWrap.className = 'project-icon';
    var icon = document.createElement('i');
    icon.setAttribute('data-lucide', pickCoverIcon(p).icon);
    icon.setAttribute('aria-hidden', 'true');
    iconWrap.appendChild(icon);
    body.appendChild(iconWrap);

    var h3 = document.createElement('h3');
    h3.textContent = (lang === 'ar' ? (p.title_ar || p.title_en) : p.title_en) || p.title_en || key;
    body.appendChild(h3);

    var summary = document.createElement('p');
    summary.textContent = (lang === 'ar' ? (p.summary_ar || p.summary_en) : p.summary_en) || '';
    body.appendChild(summary);

    if (Array.isArray(p.stack) && p.stack.length) {
      var tags = document.createElement('div');
      tags.className = 'project-tags';
      p.stack.forEach(function (t) {
        var s = document.createElement('span');
        s.textContent = t;
        tags.appendChild(s);
      });
      body.appendChild(tags);
    }

    var links = document.createElement('div');
    links.className = 'project-links';
    if (p.live_url) {
      var a = document.createElement('a');
      a.className = 'btn btn-sm btn-primary';
      a.href = p.live_url;
      a.target = '_blank';
      a.rel = 'noopener';
      var ai = document.createElement('i');
      ai.setAttribute('data-lucide', 'external-link');
      var al = document.createElement('span');
      al.setAttribute('data-i18n', 'proj.live');
      al.textContent = lang === 'ar' ? 'الموقع مباشر' : 'Live Site';
      a.appendChild(ai);
      a.appendChild(al);
      links.appendChild(a);
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-ghost';
    btn.setAttribute('data-case-open', key);
    var bi = document.createElement('i');
    bi.setAttribute('data-lucide', 'book-open');
    var bl = document.createElement('span');
    bl.setAttribute('data-i18n', 'proj.case');
    bl.textContent = lang === 'ar' ? 'دراسة الحالة' : 'Case Study';
    btn.appendChild(bi);
    btn.appendChild(bl);
    links.appendChild(btn);
    body.appendChild(links);

    article.appendChild(body);
    return article;
  }

  // ===== Services ("What I Build") =====
  // Rendered from data.services; the whole section stays hidden while the
  // array is empty (section starts hidden in the static markup too).
  function applyServices(data, lang) {
    var section = document.getElementById('services');
    var grid = document.getElementById('services-grid');
    if (!section || !grid) return;
    var rows = Array.isArray(data.services) ? data.services : [];
    section.hidden = rows.length === 0;
    var navServices = document.getElementById('nav-services');
    if (navServices) navServices.hidden = rows.length === 0;

    // Idempotent rebuild: clear previous render, then re-create every card so
    // removals, unpublish and language switches stay consistent.
    grid.textContent = '';

    if (!rows.length) return;

    // Keys of every project card currently on the page (static + dynamic),
    // used to decide whether a related-project link has a real target.
    var present = {};
    document.querySelectorAll('.project-card[data-project]').forEach(function (c) {
      var key = c.getAttribute('data-project');
      if (key) present[key] = true;
    });

    rows.forEach(function (s) {
      grid.appendChild(buildServiceCard(s, lang, present));
    });
    if (window.lucide) window.lucide.createIcons();
    // Analytics: let script.js observe the freshly rendered cards for
    // service_view. Guarded + try/catch — tracking must never break rendering.
    try { if (window.PFServiceTracking) window.PFServiceTracking.observe(); } catch (e) {}
  }

  function buildServiceCard(s, lang, projectKeys) {
    var article = document.createElement('article');
    article.className = 'service-card';
    article.setAttribute('data-service', s.slug || '');

    // Icon (CMS-picked lucide name, safe fallback).
    var iconWrap = document.createElement('div');
    iconWrap.className = 'service-icon';
    var icon = document.createElement('i');
    icon.setAttribute('data-lucide', s.icon || 'code-2');
    icon.setAttribute('aria-hidden', 'true');
    iconWrap.appendChild(icon);
    article.appendChild(iconWrap);

    var h3 = document.createElement('h3');
    h3.textContent = (lang === 'ar' ? (s.title_ar || s.title_en) : s.title_en) || s.title_en || s.slug || '';
    article.appendChild(h3);

    var summary = document.createElement('p');
    summary.className = 'service-summary';
    summary.textContent = (lang === 'ar' ? (s.summary_ar || s.summary_en) : s.summary_en) || '';
    article.appendChild(summary);

    // features: jsonb array of {en, ar}
    if (Array.isArray(s.features) && s.features.length) {
      var feats = document.createElement('ul');
      feats.className = 'service-features';
      s.features.forEach(function (f) {
        var li = document.createElement('li');
        li.textContent = pickLocalized(f, lang);
        if (li.textContent) feats.appendChild(li);
      });
      if (feats.children.length) article.appendChild(feats);
    }

    // technologies: text[] → chips
    if (Array.isArray(s.technologies) && s.technologies.length) {
      var tags = document.createElement('div');
      tags.className = 'service-tags';
      s.technologies.forEach(function (t) {
        var span = document.createElement('span');
        span.textContent = t;
        tags.appendChild(span);
      });
      article.appendChild(tags);
    }

    // Related-project link: only when a related key matches a card on the page.
    if (Array.isArray(s.related_project_keys)) {
      var related = s.related_project_keys.find(function (k) { return k && projectKeys[k]; });
      if (related) {
        var rel = document.createElement('a');
        rel.className = 'service-related';
        rel.href = '#projects';
        var relLabel = document.createElement('span');
        relLabel.setAttribute('data-i18n', 'services.related');
        relLabel.textContent = lang === 'ar' ? 'مشروع مرتبط' : 'Related project';
        rel.appendChild(relLabel);
        var relArrow = document.createElement('i');
        relArrow.setAttribute('data-lucide', 'chevron-right');
        relArrow.setAttribute('aria-hidden', 'true');
        rel.appendChild(relArrow);
        article.appendChild(rel);
      }
    }

    // CTA → contact. Label comes from the CMS row, i18n fallback otherwise.
    var cta = document.createElement('a');
    cta.className = 'btn btn-sm btn-primary service-cta';
    cta.href = '#contact';
    cta.setAttribute('data-service-cta', s.slug || '');
    var ctaLabel = document.createElement('span');
    var label = (lang === 'ar' ? s.cta_label_ar : s.cta_label_en);
    if (label) {
      ctaLabel.textContent = label;
    } else {
      ctaLabel.setAttribute('data-i18n', 'services.cta');
      ctaLabel.textContent = lang === 'ar' ? 'اطلب مشروعاً' : 'Discuss a project';
    }
    cta.appendChild(ctaLabel);
    article.appendChild(cta);

    return article;
  }

  // ===== Professional profiles ("Work with me") =====
  function applyProfiles(data, lang) {
    var section = document.getElementById('freelance');
    var grid = document.getElementById('profiles-grid');
    if (!section || !grid) return;
    var rows = Array.isArray(data.professional_profiles) ? data.professional_profiles : [];
    // profile_url='' rows are excluded server-side; guard here anyway.
    var usable = rows.filter(function (p) { return p && p.profile_url; });
    section.hidden = usable.length === 0;

    grid.textContent = '';
    if (!usable.length) return;
    usable.forEach(function (p) {
      grid.appendChild(buildProfileCard(p, lang));
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function buildProfileCard(p, lang) {
    var card = document.createElement('a');
    card.className = 'profile-card';
    card.setAttribute('data-profile', p.platform || '');
    card.href = p.profile_url;
    card.target = '_blank';
    card.rel = 'noopener';

    var iconWrap = document.createElement('div');
    iconWrap.className = 'profile-icon';
    var icon = document.createElement('i');
    icon.setAttribute('data-lucide', p.icon || 'globe');
    icon.setAttribute('aria-hidden', 'true');
    iconWrap.appendChild(icon);

    var platform = document.createElement('span');
    platform.className = 'profile-platform';
    platform.textContent = p.platform || '';
    iconWrap.appendChild(platform);
    card.appendChild(iconWrap);

    var h3 = document.createElement('h3');
    h3.className = 'profile-name';
    h3.textContent = p.display_name || p.username || p.platform || '';
    card.appendChild(h3);

    if (p.username) {
      var user = document.createElement('span');
      user.className = 'profile-user';
      user.textContent = p.username.indexOf('@') === 0 ? p.username : '@' + p.username;
      card.appendChild(user);
    }

    var title = document.createElement('p');
    title.className = 'profile-title';
    title.textContent = (lang === 'ar' ? (p.title_ar || p.title_en) : p.title_en) || '';
    card.appendChild(title);

    var desc = document.createElement('p');
    desc.className = 'profile-desc';
    desc.textContent = (lang === 'ar' ? (p.description_ar || p.description_en) : p.description_en) || '';
    card.appendChild(desc);

    var view = document.createElement('span');
    view.className = 'profile-cta';
    var vi = document.createElement('i');
    vi.setAttribute('data-lucide', 'external-link');
    vi.setAttribute('aria-hidden', 'true');
    var vl = document.createElement('span');
    vl.setAttribute('data-i18n', 'freelance.view');
    vl.textContent = lang === 'ar' ? 'عرض الملف' : 'View profile';
    view.appendChild(vi);
    view.appendChild(vl);
    card.appendChild(view);

    if (p.is_featured) card.classList.add('featured');
    return card;
  }

  function guessCertCategory(c) {
    var text = ((c.title_en || '') + ' ' + (c.issuer_en || '') + ' ' + (c.relevance_en || '')).toLowerCase();
    var cats = [];
    if (/ai|artificial|intelligence|machine|learning|gpt|claude|generative|deep|model|prompt|python|data/.test(text)) {
      cats.push('ai');
    }
    if (/software|programming|code|cs|developer|java|python|git|algorithm|c\+\+|c#|front|web/.test(text)) {
      cats.push('software');
    }
    if (/tool|github|git|icdl|office|cloud|infra|network|foundations|critical|analytics/.test(text)) {
      cats.push('tools');
    }
    if (!cats.length) cats.push('ai', 'software', 'tools');
    return cats.join(' ');
  }

  function buildCertCard(c, lang, data) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cert-card revealed';
    btn.setAttribute('data-dynamic', 'true');
    btn.setAttribute('data-category', guessCertCategory(c));

    var certImg = c.image_path || '';
    if (certImg && !certImg.startsWith('http') && !certImg.startsWith('assets/')) {
      var baseUrl = (data && data.media_base_url) || 'https://ihfwldtovqrntuqhrhev.supabase.co/storage/v1/object/public/media/';
      if (!baseUrl.endsWith('/')) baseUrl += '/';
      certImg = baseUrl + certImg.replace(/^media\//, '');
    }
    btn.setAttribute('data-cert', certImg);
    btn.setAttribute('data-cert-title', (c.title_en || c.title_ar || '').trim());
    btn.setAttribute('data-cert-org', ((lang === 'ar' ? (c.issuer_ar || c.issuer_en) : c.issuer_en) || '').trim());

    var iconSpan = document.createElement('span');
    iconSpan.className = 'cert-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    var icon = document.createElement('i');
    icon.setAttribute('data-lucide', c.icon || 'badge-check');
    iconSpan.appendChild(icon);
    btn.appendChild(iconSpan);

    var dateDiv = document.createElement('div');
    dateDiv.className = 'cert-date';
    dateDiv.textContent = translateDate(c.issued_on, lang);
    btn.appendChild(dateDiv);

    var orgDiv = document.createElement('div');
    orgDiv.className = 'cert-org';
    orgDiv.textContent = (lang === 'ar' ? (c.issuer_ar || c.issuer_en) : c.issuer_en) || '';
    btn.appendChild(orgDiv);

    var titleSpan = document.createElement('span');
    titleSpan.className = 'cert-title';
    titleSpan.textContent = (lang === 'ar' ? (c.title_ar || c.title_en) : c.title_en) || '';
    btn.appendChild(titleSpan);

    var badgeSpan = document.createElement('span');
    badgeSpan.className = 'cert-badge';
    var badgeIcon = document.createElement('i');
    badgeIcon.setAttribute('data-lucide', 'badge-check');
    badgeSpan.appendChild(badgeIcon);
    var badgeText = document.createElement('span');
    badgeText.textContent = lang === 'ar' ? 'معتمدة' : 'Verified';
    badgeSpan.appendChild(badgeText);
    btn.appendChild(badgeSpan);

    var viewHint = document.createElement('span');
    viewHint.className = 'cert-view-hint';
    var viewIcon = document.createElement('i');
    viewIcon.setAttribute('data-lucide', 'maximize-2');
    viewHint.appendChild(viewIcon);
    var viewText = document.createElement('span');
    viewText.textContent = lang === 'ar' ? 'عرض الشهادة' : 'View certificate';
    viewHint.appendChild(viewText);
    btn.appendChild(viewHint);

    return btn;
  }

  function applyCerts(data, lang) {
    var grid = document.querySelector('.certs-grid');
    if (!grid) return;

    var certs = (data.certifications || []).filter(function (c) {
      return c && c.status === 'published' && !c.deleted_at;
    });
    if (!certs.length) return;

    // Clear and render all published certs in exact sort_order
    grid.innerHTML = '';
    certs.forEach(function (c) {
      grid.appendChild(buildCertCard(c, lang, data));
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function applySkills(data, lang) {
    if (!Array.isArray(data.skills) || !data.skills.length) return;
    var cards = document.querySelectorAll('.skills-grid .skill-card');
    if (!cards.length) return;

    var byCat = {};
    data.skills.forEach(function (s) {
      if (!s || s.enabled === false || s.deleted_at) return;
      var cat = s.category || 'programming';
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(s);
    });

    var catMap = {
      0: 'programming',
      1: 'networking',
      2: 'tools'
    };

    cards.forEach(function (card, idx) {
      var catKey = catMap[idx];
      if (!catKey || !byCat[catKey]) return;
      var list = card.querySelector('.skill-list');
      if (!list) return;

      var tierLabels = {
        1: { en: 'Beginner', ar: 'مبتدئ' },
        2: { en: 'Intermediate', ar: 'متوسط' },
        3: { en: 'Advanced', ar: 'متقدم' },
        4: { en: 'Expert', ar: 'خبير' }
      };

      list.innerHTML = '';
      byCat[catKey].forEach(function (s) {
        var li = document.createElement('li');
        li.className = 'skill-row';
        var tier = s.tier || 3;
        li.setAttribute('data-tier', tier);

        var nameSpan = document.createElement('span');
        nameSpan.className = 'skill-name';
        nameSpan.textContent = lang === 'ar' ? (s.name_ar || s.name) : s.name;
        li.appendChild(nameSpan);

        var tierSpan = document.createElement('span');
        tierSpan.className = 'skill-tier';
        var tInfo = tierLabels[tier] || tierLabels[3];
        tierSpan.setAttribute('aria-label', lang === 'ar' ? tInfo.ar : tInfo.en);
        for (var i = 0; i < 4; i++) tierSpan.appendChild(document.createElement('i'));
        li.appendChild(tierSpan);

        list.appendChild(li);
      });

      var meta = card.querySelector('.skill-meta');
      if (meta) {
        var count = byCat[catKey].length;
        meta.textContent = lang === 'ar' ? (count + ' مهارات') : (count + (catKey === 'networking' ? ' areas' : ' technologies'));
      }
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
          links: (function () {
            var linksList = [];
            if (p.live_url) {
              linksList.push({
                id: 'live',
                icon: 'external-link',
                label: l === 'ar' ? 'الموقع مباشر' : 'Live Site',
                href: p.live_url
              });
            }
            if (p.repo_url) {
              linksList.push({
                id: 'repo',
                icon: 'folder-git-2',
                label: l === 'ar' ? 'المستودع البرمجي' : 'GitHub Repo',
                href: p.repo_url
              });
            }
            if (p.extra_url) {
              linksList.push({
                id: 'extra',
                icon: 'file-text',
                label: l === 'ar' ? (p.extra_url_label_ar || 'تفاصيل إضافية') : (p.extra_url_label_en || 'Extra Info'),
                href: p.extra_url
              });
            }
            return linksList;
          })()
        };
      });
    });
    window.PF_CASES_OVERRIDE = cases;
  }

  function apply(data) {
    if (!data || !data.enabled) return;
    state.data = data;
    var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    applyProjects(data, lang);
    applyServices(data, lang);
    applySkills(data, lang);
    applyCerts(data, lang);
    applyRecommendations(data, lang);
    applyProfiles(data, lang);
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

  // Re-apply when the visitor switches language. Prefer the data applied most
  // recently (covers direct PFCMS.apply callers); fall back to the cache.
  document.addEventListener('pf:langchange', function () {
    if (state.data) { apply(state.data); return; }
    try {
      var cached = JSON.parse(localStorage.getItem('pf_cms_cache') || 'null');
      if (cached) apply(cached.data);
    } catch (e) {}
  });

  window.PFCMS = { apply: apply };
})();
