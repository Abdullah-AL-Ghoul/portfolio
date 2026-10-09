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

  // Per-table try/catch: migration 0003 may not have run yet, so a missing
  // services / professional_profiles table must resolve to [] — never fail
  // the whole response. Column lists match the pinned data contract exactly.
  const safeFetch = async (fetchFn) => {
    try {
      return (await fetchFn()) || [];
    } catch {
      return [];
    }
  };

  try {
    const [projects, skills, skill_categories, certifications, experiences, recommendations, social_links, about, settings, services, professional_profiles] = await Promise.all([
      sb('projects?select=*&status=eq.published&deleted_at=is.null&order=featured_rank.asc,sort_order.asc', { role: 'anon' }),
      sb('skills?select=*&enabled=eq.true&deleted_at=is.null&order=category.asc,sort_order.asc', { role: 'anon' }),
      sb('skill_categories?select=*&order=sort_order.asc', { role: 'anon' }),
      sb('certifications?select=*&status=eq.published&deleted_at=is.null&order=sort_order.asc', { role: 'anon' }),
      sb('experiences?select=*&status=eq.published&deleted_at=is.null&order=sort_order.asc', { role: 'anon' }),
      sb('recommendations?select=*&status=eq.published&deleted_at=is.null&order=sort_order.asc', { role: 'anon' }),
      sb('social_links?select=*&enabled=eq.true&order=sort_order.asc', { role: 'anon' }),
      sb('about_profile?select=*&id=eq.1', { role: 'anon' }),
      sb('site_settings?select=*&id=eq.1', { role: 'anon' }),
      safeFetch(() =>
        sb('services?select=slug,title_en,title_ar,summary_en,summary_ar,features,technologies,related_project_keys,icon,cta_label_en,cta_label_ar,sort_order&status=eq.published&deleted_at=is.null&order=sort_order.asc', { role: 'anon' })
      ),
      safeFetch(() =>
        sb('professional_profiles?select=platform,display_name,username,profile_url,title_en,title_ar,description_en,description_ar,icon,is_featured,display_order&is_active=eq.true&deleted_at=is.null&profile_url=neq.&order=display_order.asc', { role: 'anon' })
      )
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
      services: services || [],
      professional_profiles: professional_profiles || [],
      fetched_at: new Date().toISOString()
    });
  } catch (e) {
    return json(res, 200, { enabled: false });
  }
};
