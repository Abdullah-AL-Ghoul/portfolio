/*
 * Abdullah Portfolio V2 — first-party, privacy-preserving analytics.
 * - Visitor ID: random UUID in localStorage (no cookies, no fingerprinting).
 * - Session ID: per-tab sessionStorage UUID.
 * - Sent to first-party /api/track in small batches (beacon or fetch).
 * - No raw IP, no fingerprinting, no third parties.
 * - Global Privacy Control is respected: if set, nothing is sent.
 */
(function () {
  'use strict';

  if (window.__pfAnalytics) return;
  window.__pfAnalytics = true;

  var enabled = true;
  try {
    if (navigator.globalPrivacyControl === true) enabled = false;
  } catch (e) {}

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  var visitorId, sessionId, isNewVisitor = false, isNewSession = false;
  try {
    visitorId = localStorage.getItem('pf_visitor_id');
    if (!visitorId) { visitorId = uuid(); localStorage.setItem('pf_visitor_id', visitorId); isNewVisitor = true; }
  } catch (e) { visitorId = 'anon-' + Date.now(); }

  try {
    sessionId = sessionStorage.getItem('pf_session_id');
    if (!sessionId) { sessionId = uuid(); sessionStorage.setItem('pf_session_id', sessionId); isNewSession = true; }
  } catch (e) { sessionId = 'sess-' + Date.now(); }

  var pageCount = 0;
  try { pageCount = Number(sessionStorage.getItem('pf_page_count') || 0); } catch (e) {}

  var queue = [];
  var sendTimer = null;

  function currentPath() { return location.pathname + location.search; }

  function utmParams() {
    var out = {};
    try {
      var qs = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
        var v = qs.get(k);
        if (v) out[k] = v.slice(0, 120);
      });
    } catch (e) {}
    return out;
  }

  function track(type, target) {
    if (!enabled) return;
    queue.push({ type: type, target: target || '', page_path: currentPath() });
    if (queue.length >= 8) send();
    else schedule();
  }

  function schedule() {
    if (sendTimer) return;
    sendTimer = setTimeout(function () { sendTimer = null; send(); }, 3000);
  }

  function send() {
    if (sendTimer) { clearTimeout(sendTimer); sendTimer = null; }
    if (!queue.length || !enabled) return;
    var payload = {
      visitor_id: visitorId,
      session_id: sessionId,
      is_new_visitor: isNewVisitor && isNewSession,
      session_count: Number(localStorage.getItem('pf_session_count') || '1'),
      page_count: pageCount,
      entry_page: location.pathname,
      exit_page: currentPath(),
      referrer: document.referrer || '',
      utm: utmParams(),
      events: queue
    };
    queue = [];
    try {
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      if (navigator.sendBeacon && navigator.sendBeacon('/api/track', blob)) return;
    } catch (e) { /* fall through to fetch */ }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function () { /* never surface analytics errors */ });
  }

  // ---------- automatic delegated hooks ----------
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0 || href.charAt(0) === '#') return;
    if (href === '/api/cv-download' || href.indexOf('Abdullah_ALGhoul_CV') !== -1) track('cv_download', href);
    else if (href.indexOf('github.com') !== -1) track('github_click', href);
    else if (/al-azher-it-hub\.vercel\.app/.test(href)) track('live_demo_click', href);
    else if (href.indexOf(location.host) === -1) track('outbound_click', href);
    else track('project_click', href);
  }, { passive: true });

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest && ev.target.closest('[data-case-open]');
    if (btn) track('project_view', btn.getAttribute('data-case-open') || '');
  });

  window.PFTrack = track;
  window.PFAnalytics = {
    track: track,
    flush: send,
    isEnabled: function () { return enabled; },
    getVisitorId: function () { return visitorId; }
  };

  // Boot: count this page view and fire session start.
  if (enabled) {
    pageCount += 1;
    try { sessionStorage.setItem('pf_page_count', String(pageCount)); } catch (e) {}
    if (isNewSession) {
      try {
        var sc = Number(localStorage.getItem('pf_session_count') || '0') + 1;
        localStorage.setItem('pf_session_count', String(sc));
      } catch (e) {}
      track('session_start');
    }
    track('page_view');
  }

  window.addEventListener('pagehide', send);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') send();
  });
})();
