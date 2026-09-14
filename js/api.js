// ─── Auth ────────────────────────────────────────────────────────────────────
async function signIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  await db.auth.signOut();
}

async function getSession() {
  const { data } = await db.auth.getSession();
  return data.session;
}

// ─── Projects ────────────────────────────────────────────────────────────────
async function fetchProjects() {
  const { data, error } = await db.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function createProject(name) {
  const { data: { user } } = await db.auth.getUser();
  const { data, error } = await db.from('projects').insert({ name, created_by: user.id }).select().single();
  if (error) throw error;
  return data;
}

// ─── Scripts ─────────────────────────────────────────────────────────────────
async function fetchScripts(projectId) {
  const { data, error } = await db.from('scripts').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function fetchScript(id) {
  const { data, error } = await db.from('scripts').select('*, script_beats(*)').eq('id', id).single();
  if (error) throw error;
  data.script_beats.sort((a, b) => a.sequence - b.sequence);
  return data;
}

async function saveScript(scriptData, beats) {
  const { data: { user } } = await db.auth.getUser();
  const { data: script, error } = await db.from('scripts')
    .insert({ ...scriptData, created_by: user.id })
    .select().single();
  if (error) throw error;

  if (beats.length > 0) {
    const beatRows = beats.map((b, i) => ({ ...b, script_id: script.id, sequence: i }));
    const { error: beatError } = await db.from('script_beats').insert(beatRows);
    if (beatError) throw beatError;
  }
  return script;
}
