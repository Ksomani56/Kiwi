/**
 * Parses raw script text into structured beats.
 *
 * Tolerant of common formatting variations:
 *   [0-3s] HOOK
 *   Spoken: / VO: / Voiceover: text
 *   On-screen text: / On-screen: / Onscreen: text
 *   [SHOT: ...] or Shot: ...
 *   Note: / Delivery: delivery note
 *
 * Multi-line spoken/on-screen: lines after a Spoken: label that aren't
 * another label are appended to the current field.
 */
function parseScript(raw) {
  const beats = [];
  const beatHeaderRe = /^\[(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)s\]\s*(.+)/i;

  // Label patterns (order matters — check more specific first)
  const LABELS = [
    { re: /^(?:Spoken|VO|Voiceover|Voice-?over)\s*:\s*(.*)/i,         field: 'spoken' },
    { re: /^On-?screen\s*(?:text)?\s*:\s*(.*)/i,                      field: 'on_screen' },
    { re: /^\[SHOT\s*:\s*(.*)\]$/i,                                    field: 'shot' },
    { re: /^(?:SHOT|Shot)\s*:\s*(.*)/i,                                field: 'shot' },
    { re: /^(?:Note|Delivery\s*note?)\s*:\s*(.*)/i,                   field: 'delivery_note' },
  ];

  const lines = raw.split(/\r?\n/);
  let current = null;
  let lastField = null;   // track last parsed field for multi-line continuation

  const pushBeat = () => { if (current) beats.push(current); };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // ── Beat header ───────────────────────────────────────────────────
    const headerMatch = line.match(beatHeaderRe);
    if (headerMatch) {
      pushBeat();
      current = {
        start_sec: parseFloat(headerMatch[1]),
        end_sec:   parseFloat(headerMatch[2]),
        title:     headerMatch[3].trim(),
        spoken: null, on_screen: null, shot: null, delivery_note: null, wpm: 0,
      };
      lastField = null;
      continue;
    }

    if (!current) continue;
    if (!line) { lastField = null; continue; }

    // ── Named label ───────────────────────────────────────────────────
    let matched = false;
    for (const { re, field } of LABELS) {
      const m = line.match(re);
      if (m) {
        current[field] = m[1].trim() || null;
        lastField = field;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // ── Multi-line continuation (no label, not a header) ─────────────
    if (lastField && current[lastField] !== undefined) {
      current[lastField] = current[lastField]
        ? current[lastField] + ' ' + line
        : line;
    }
  }
  pushBeat();

  // WPM per beat
  beats.forEach(b => {
    if (b.spoken) {
      const words = b.spoken.trim().split(/\s+/).length;
      const dur   = b.end_sec - b.start_sec;
      b.wpm = dur > 0 ? Math.round((words / dur) * 60) : 0;
    }
  });

  return beats;
}

function calcAnalytics(beats) {
  const duration = beats.length ? beats[beats.length - 1].end_sec : 0;
  const spokenBeats = beats.filter(b => b.spoken);
  const wordCount = spokenBeats.reduce((s, b) => s + b.spoken.trim().split(/\s+/).length, 0);
  return {
    duration,
    beat_count: beats.length,
    spoken_count: spokenBeats.length,
    shot_count: beats.filter(b => b.shot).length,
    text_count: beats.filter(b => b.on_screen).length,
    word_count: wordCount,
    wpm: duration > 0 ? Math.round((wordCount / duration) * 60) : 0,
  };
}
