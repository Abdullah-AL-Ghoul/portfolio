/*
 * Vercel serverless — GET /api/content
 * Returns all published portfolio content for the public site.
 * Uses the anon key — RLS guarantees only published, non-deleted rows.
 * Cached at the edge; degrades to { enabled: false } so the static
 * site keeps its built-in content when Supabase is not configured.
 */

const { json, sb, configured } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { enabled: false });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if (!configured()) return json(res, 200, { enabled: false });

  try {
    const [projects, skills, skill_categories, certifications, experiences, recommendations, social_links, about, settings] = await Promise.all([
      sb('projects?select=*&status=eq.published&deleted_at=is.null&order=featured_rank.asc,sort_order.asc', { role: 'anon' }),
      sb('skills?select=*&enabled=eq.true&deleted_at=is.null&order=category.asc,sort_order.asc', { role: 'anon' }),
      sb('skill_categories?select=*&order=sort_order.asc', { role: 'anon' }),
      sb('certifications?select=*&status=eq.published&deleted_at=is.null&order=sort_order.asc', { role: 'anon' }),
      sb('experiences?select=*&status=eq.published&deleted_at=is.null&order=sort_order.asc', { role: 'anon' }),
      sb('recommendations?select=*&status=eq.published&deleted_at=is.null&order=sort_order.asc', { role: 'anon' }),
      sb('social_links?select=*&enabled=eq.true&order=sort_order.asc', { role: 'anon' }),
      sb('about_profile?select=*&id=eq.1', { role: 'anon' }),
      sb('site_settings?select=*&id=eq.1', { role: 'anon' })
    ]);

    return json(res, 200, {
      enabled: true,
      projects: projects || [],
      skills: skills || [],
      skill_categories: skill_categories || [],
      certifications: certifications || [],
      experiences: experiences || [],
      recommendations: recommendations || [],
      social_links: social_links || [],
      about: (about && about[0]) || null,
      settings: (settings && settings[0]) || null,
      fetched_at: new Date().toISOString()
    });
  } catch (e) {
    return json(res, 200, { enabled: false });
  }
};
