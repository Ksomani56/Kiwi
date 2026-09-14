// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  session: null,
  projects: [],
  currentProject: null,
  scripts: [],
  currentScript: null,
  filter: 'all',
  searchQuery: '',
  chart: null,
};

// ─── Card colour palette ──────────────────────────────────────────────────────
const COLORS = [
  { bg: '#f0fdf4', border: '#84cc16', accent: '#65a30d' }, // green
  { bg: '#f0f9ff', border: '#38bdf8', accent: '#0284c7' }, // sky
  { bg: '#f5f3ff', border: '#a78bfa', accent: '#7c3aed' }, // violet
  { bg: '#fffbeb', border: '#fbbf24', accent: '#d97706' }, // amber
  { bg: '#fff1f2', border: '#fb7185', accent: '#e11d48' }, // rose
  { bg: '#f0fdfa', border: '#2dd4bf', accent: '#0d9488' }, // teal
  { bg: '#fff7ed', border: '#fb923c', accent: '#ea580c' }, // orange
  { bg: '#eef2ff', border: '#818cf8', accent: '#4f46e5' }, // indigo
];
let colorIndex = 0;
function nextColor() { return COLORS[colorIndex++ % COLORS.length]; }

// ─── Router ───────────────────────────────────────────────────────────────────
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// ─── Login ────────────────────────────────────────────────────────────────────
async function initLogin() {
  showView('view-login');
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    btn.textContent = 'Signing in…';
    btn.disabled = true;
    try {
      await signIn(
        document.getElementById('email').value.trim(),
        document.getElementById('password').value
      );
      await initApp();
    } catch (err) {
      document.getElementById('login-error').textContent = err.message;
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  };
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
async function initDashboard() {
  showView('view-dashboard');
  colorIndex = 0;
  try {
    state.projects = await fetchProjects();
    renderProjects();
  } catch (e) { showToast(e.message, 'error'); }
}

function renderProjects() {
  const grid = document.getElementById('project-grid');
  const empty = document.getElementById('projects-empty');
  if (!state.projects.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = state.projects.map(p => {
    const c = COLORS[state.projects.indexOf(p) % COLORS.length];
    return `<div class="project-card" style="border-color:${c.border};background:${c.bg}" onclick="openProject('${p.id}','${escHtml(p.name)}')">
      <div class="project-card-accent" style="background:${c.border}"></div>
      <div class="project-card-body">
        <h3 class="project-card-name">${escHtml(p.name)}</h3>
        <span class="project-card-meta">Tap to view scripts →</span>
      </div>
    </div>`;
  }).join('');
}

async function openProject(id, name) {
  state.currentProject = { id, name };
  document.getElementById('project-title').textContent = name;
  showView('view-project');
  state.scripts = [];
  state.searchQuery = '';
  document.getElementById('script-search').value = '';
  try {
    state.scripts = await fetchScripts(id);
    renderScripts();
  } catch (e) { showToast(e.message, 'error'); }
}

function renderScripts() {
  const list = document.getElementById('script-list');
  const empty = document.getElementById('scripts-empty');
  const q = state.searchQuery.toLowerCase();
  const filtered = state.scripts.filter(s =>
    !q || s.title.toLowerCase().includes(q) || s.short_title?.toLowerCase().includes(q) || s.raw_content?.toLowerCase().includes(q)
  );
  if (!filtered.length) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = filtered.map(s => {
    const c = s.color ? JSON.parse(s.color) : COLORS[0];
    const dur = s.duration ? formatDuration(s.duration) : '—';
    return `<div class="script-card" style="border-left-color:${c.border};background:${c.bg}" onclick="openScript('${s.id}')">
      <div class="script-card-inner">
        <div>
          <span class="script-short" style="color:${c.accent}">${escHtml(s.short_title || '')}</span>
          <h3 class="script-title">${escHtml(s.title)}</h3>
        </div>
        <span class="script-dur" style="color:${c.accent}">${dur}</span>
      </div>
    </div>`;
  }).join('');
}

// ─── Script Viewer ────────────────────────────────────────────────────────────
async function openScript(id) {
  showView('view-script');
  document.getElementById('script-beats').innerHTML = '<p class="loading-text">Loading…</p>';
  try {
    state.currentScript = await fetchScript(id);
    state.filter = 'all';
    renderScriptView();
  } catch (e) { showToast(e.message, 'error'); }
}

function renderScriptView() {
  const s = state.currentScript;
  const c = s.color ? JSON.parse(s.color) : COLORS[0];

  // ── Coloured header card ──────────────────────────────────────────────
  const dur = s.duration ? formatDuration(s.duration) : '';
  document.getElementById('script-header-card').innerHTML = `
    <div class="script-hero" style="background:${c.border}">
      <div class="script-hero-meta">
        <span class="script-hero-badge" style="color:${c.border};background:rgba(255,255,255,0.15)">${escHtml(s.short_title || 'Script')}</span>
        ${dur ? `<span class="script-hero-dur">Duration: ${dur}</span>` : ''}
      </div>
      <h1 class="script-hero-title">${escHtml(s.title)}</h1>
      ${s.description ? `<p class="script-hero-desc">${escHtml(s.description)}</p>` : ''}
    </div>`;

  // ── Filter buttons active state ───────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === state.filter);
  });

  const beats = s.script_beats || [];
  const q = state.searchQuery.toLowerCase();

  const filtered = beats.filter(b => {
    if (state.filter === 'spoken' && !b.spoken) return false;
    if (state.filter === 'text'   && !b.on_screen) return false;
    if (state.filter === 'shots'  && !b.shot) return false;
    if (q) {
      const text = [b.title, b.spoken, b.on_screen, b.shot, b.delivery_note].filter(Boolean).join(' ').toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  document.getElementById('script-beats').innerHTML = filtered.length
    ? filtered.map(beatCard).join('')
    : '<p class="empty-text">No beats match this filter.</p>';

  renderAnalytics(beats);
}


function beatCard(b) {
  const time = b.start_sec != null ? `[${b.start_sec}s – ${b.end_sec}s]` : '';
  let wpmBadge = '';
  if (b.wpm > 0) {
    if (b.wpm < 130)       wpmBadge = `<span class="wpm-badge wpm-slow">${b.wpm} WPM (Slow)</span>`;
    else if (b.wpm <= 160) wpmBadge = `<span class="wpm-badge wpm-ok">${b.wpm} WPM (Ideal)</span>`;
    else                   wpmBadge = `<span class="wpm-badge wpm-fast">${b.wpm} WPM (Fast)</span>`;
  }
  // Strip any existing surrounding quotes from spoken so we don't double-wrap
  const spokenClean = b.spoken ? b.spoken.replace(/^["'"'"]+|["'"'"]+$/g, '').trim() : '';
  return `<div class="beat-card">
    <div class="beat-header">
      <div class="beat-header-left">
        <span class="beat-time">${escHtml(time)}</span>
        <span class="beat-title">${escHtml(b.title || '')}</span>
      </div>
      ${wpmBadge}
    </div>
    ${b.delivery_note ? `<div class="beat-note"><em>Note: ${escHtml(b.delivery_note)}</em></div>` : ''}
    ${b.on_screen ? `<div class="beat-onscreen"><span class="beat-label text-label">ON-SCREEN TEXT</span><p class="beat-text mono">${escHtml(b.on_screen)}</p></div>` : ''}
    ${spokenClean ? `<div class="beat-spoken"><span class="beat-label spoken-label">SPOKEN DIALOG</span><p class="beat-text spoken-text">&ldquo;${escHtml(spokenClean)}&rdquo;</p></div>` : ''}
    ${b.shot ? `<div class="beat-shot"><span class="beat-label shot-label">VISUAL / SHOT NOTE</span><p class="beat-text-shot">[SHOT: ${escHtml(b.shot)}]</p></div>` : ''}
  </div>`;
}


function renderAnalytics(beats) {
  const panel = document.getElementById('analytics-panel');

  const beatRows = beats.map(b => {
    const dur = ((b.end_sec || 0) - (b.start_sec || 0));
    const time = b.start_sec != null ? `[${b.start_sec}s-${b.end_sec}s]` : '';
    return `<div class="analytics-beat-row">
      <span class="analytics-beat-name">${escHtml(b.title || '')} <span class="analytics-beat-time">${time}</span></span>
      <span class="analytics-beat-dur">${dur}s</span>
    </div>`;
  }).join('');

  panel.innerHTML = `
    <h3 class="analytics-heading">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:-2px;margin-right:6px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
      Script Analytics
    </h3>
    <div class="analytics-beat-list">${beatRows}</div>
    <h4 class="analytics-sub">Time Distribution</h4>
    <p class="analytics-chart-desc">Duration per beat (seconds)</p>
    <canvas id="beat-chart" height="220"></canvas>`;
  drawChart(beats);
}


function drawChart(beats) {
  if (state.chart) { state.chart.destroy(); state.chart = null; }
  const ctx = document.getElementById('beat-chart')?.getContext('2d');
  if (!ctx || !beats.length) return;
  state.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: beats.map(b => b.title || `Beat ${b.sequence + 1}`),
      datasets: [{ label: 'Duration (s)', data: beats.map(b => (b.end_sec - b.start_sec).toFixed(1)), backgroundColor: '#38bdf8', borderRadius: 4 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// ─── Add Script Modal ─────────────────────────────────────────────────────────
function openAddScript() {
  document.getElementById('modal-add-script').classList.remove('hidden');
  document.getElementById('add-script-form').reset();
  document.getElementById('add-script-error').textContent = '';
}
function closeAddScript() { document.getElementById('modal-add-script').classList.add('hidden'); }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-script-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-script-btn');
    btn.textContent = 'Saving…'; btn.disabled = true;
    try {
      const title = document.getElementById('as-title').value.trim();
      const shortTitle = document.getElementById('as-short').value.trim();
      const raw = document.getElementById('as-raw').value.trim();
      if (!title || !raw) throw new Error('Title and script content are required.');

      const beats = parseScript(raw);
      const analytics = calcAnalytics(beats);
      const color = JSON.stringify(nextColor());

      await saveScript({
        title, short_title: shortTitle, raw_content: raw,
        project_id: state.currentProject.id,
        duration: analytics.duration,
        word_count: analytics.word_count,
        color,
      }, beats);

      closeAddScript();
      state.scripts = await fetchScripts(state.currentProject.id);
      renderScripts();
      showToast('Script saved!');
    } catch (err) {
      document.getElementById('add-script-error').textContent = err.message;
    } finally { btn.textContent = 'Save Script'; btn.disabled = false; }
  };

  // File upload
  document.getElementById('as-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('as-raw').value = ev.target.result;
      if (!document.getElementById('as-title').value) {
        document.getElementById('as-title').value = file.name.replace(/\.[^.]+$/, '');
      }
    };
    reader.readAsText(file);
  });
});

// ─── Add Project Modal ────────────────────────────────────────────────────────
function openAddProject() {
  document.getElementById('modal-add-project').classList.remove('hidden');
  document.getElementById('add-project-form').reset();
  document.getElementById('add-project-error').textContent = '';
}
function closeAddProject() { document.getElementById('modal-add-project').classList.add('hidden'); }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-project-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-project-btn');
    btn.textContent = 'Creating…'; btn.disabled = true;
    try {
      const name = document.getElementById('ap-name').value.trim();
      if (!name) throw new Error('Project name is required.');
      await createProject(name);
      closeAddProject();
      state.projects = await fetchProjects();
      renderProjects();
      showToast('Project created!');
    } catch (err) {
      document.getElementById('add-project-error').textContent = err.message;
    } finally { btn.textContent = 'Create'; btn.disabled = false; }
  };
});

// ─── Sidebar / Menu ───────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('hidden');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatDuration(s) {
  if (s >= 60) return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
  return `${Math.round(s)}s`;
}
function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function initApp() {
  try {
    state.session = await getSession();
    if (!state.session) { initLogin(); return; }
    await initDashboard();
  } catch (e) {
    console.error('Init error:', e);
    showView('view-login');
  }
}

db.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') { state.session = null; initLogin(); }
  if (event === 'SIGNED_IN') { state.session = session; }
});

window.addEventListener('DOMContentLoaded', initApp);
