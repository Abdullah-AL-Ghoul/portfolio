import { supabase } from './supabase';

/* ---------- session ---------- */
export const getSession = () => supabase.auth.getSession();
export const onAuthChange = (cb) => {
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session));
  return () => data.subscription.unsubscribe();
};
export const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
export const signOut = () => supabase.auth.signOut();

/* ---------- audit ---------- */
export async function audit(action, entity, entityId, summary = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({
      actor_id: user?.id ?? null,
      actor_email: user?.email ?? '',
      action,
      entity,
      entity_id: String(entityId ?? ''),
      summary
    });
  } catch (e) { /* audit must never block the action */ }
}

/* ---------- generic CRUD helpers (RLS enforces admin-only writes) ---------- */
export async function list(table, { order = 'created_at', asc = false, filters = [] } = {}) {
  let q = supabase.from(table).select('*').is('deleted_at', null).order(order, { ascending: asc });
  filters.forEach(([col, op, val]) => { q = q.filter(col, op, val); });
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function listAll(table, { order = 'created_at', asc = false } = {}) {
  const { data, error } = await supabase.from(table).select('*').order(order, { ascending: asc });
  if (error) throw error;
  return data || [];
}

export async function create(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  await audit('create', table, data?.id, { title: row.title_en || row.name || row.person_name || '' });
  return data;
}

export async function update(table, id, patch) {
  const { data, error } = await supabase.from(table).update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  await audit('update', table, id, patch);
  return data;
}

export async function softDelete(table, id) {
  const { error } = await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
  await audit('delete', table, id, { soft: true });
}

export async function restore(table, id) {
  const { error } = await supabase.from(table).update({ deleted_at: null }).eq('id', id);
  if (error) throw error;
  await audit('restore', table, id);
}

export async function purge(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  await audit('purge', table, id);
}

export async function setStatus(table, id, status) {
  const { data, error } = await supabase.from(table).update({
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  }).eq('id', id).select().single();
  if (error) throw error;
  await audit(status, table, id);
  return data;
}
