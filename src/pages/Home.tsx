import { useStore, levelInfo } from '../lib/store';
import { chapters, EXAM } from '../data/chapters';
import { chapterStats, dueCards, nextScene, readiness, weakQuestions } from '../lib/progress';
import { go } from '../lib/router';
import { Ring } from '../components/Shell';
import { allQuestions } from '../data/questions';
import { lessons } from '../data/lessons';

const PTS: [number, number][] = [[70, 210], [190, 110], [320, 200], [450, 100], [580, 200], [710, 100], [840, 200], [950, 105]];

function MetroMap() {
  const s = useStore((s) => s);
  const d = PTS.map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `C${PTS[i - 1][0] + 60} ${PTS[i - 1][1]}, ${x - 60} ${y}, ${x} ${y}`)).join(' ');
  return (
    <svg viewBox="0 0 1020 305" className="metro">
      <defs>
        <linearGradient id="track" x1="0" x2="1">
          {chapters.map((c, i) => <stop key={c.id} offset={i / 7} stopColor={c.color} />)}
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="var(--panel-2)" strokeWidth="22" strokeLinecap="round" />
      <path d={d} fill="none" stroke="url(#track)" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 14" opacity="0.9" />
      {chapters.map((c, i) => {
        const [x, y] = PTS[i];
        const st = chapterStats(s, c.id);
        const r = 34;
        const circ = 2 * Math.PI * r;
        const below = y > 150;
        return (
          <g key={c.id} className="station" onClick={() => go(`/learn/${c.id}`)}>
            <circle className="outer" cx={x} cy={y} r={r + 9} fill="var(--bg)" stroke={c.color} strokeWidth="3" opacity="0.9" />
            <circle cx={x} cy={y} r={r} fill="none" stroke="var(--panel-2)" strokeWidth="6" />
            <circle cx={x} cy={y} r={r} fill="none" stroke={c.color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - st.mastery)} transform={`rotate(-90 ${x} ${y})`} style={{ transition: 'stroke-dashoffset 1s' }} />
            <text x={x} y={y + 10} textAnchor="middle" fontSize="28">{c.emoji}</text>
            <text x={x} y={below ? y + 66 : y - 74} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text)">{c.id}. {c.short}</text>
            <text x={x} y={below ? y + 84 : y - 56} textAnchor="middle" fontSize="12" fill="var(--muted)">{Math.round(st.mastery * 100)}% · {c.examPoints} pts</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Home() {
  const s = useStore((s) => s);
  const lv = levelInfo(s.xp);
  const rd = readiness(s);
  const due = dueCards(s).length;
  const weak = weakQuestions(s).length;
  const nxt = nextScene(s);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const attempted = Object.keys(s.q).length;
  const passColor = rd.pct >= EXAM.passPct ? 'var(--good)' : rd.pct >= 50 ? 'var(--warn)' : 'var(--bad)';

  return (
    <div className="col" style={{ gap: 22 }}>
      <div className="hero">
        <div className="row wrap" style={{ alignItems: 'center', gap: 24 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="kicker">{greet}, automation engineer {lv.icon}</div>
            <h1 style={{ marginTop: 8 }}>Ride the line to <span className="gradient-text">CTAL-TAE</span> 🚆</h1>
            <p className="muted" style={{ maxWidth: 560 }}>
              8 stations, {lessons.length} visual scenes, {allQuestions.length} exam-style questions. Learn it visually, then <b>prove it by recalling</b> — that's what makes it stick.
            </p>
            <div className="row wrap mt">
              {nxt ? <button className="btn primary lg" onClick={() => go(`/learn/${nxt.ch}/${nxt.idx}`)}>▶ Continue: Ch {nxt.ch}, scene {nxt.idx + 1}</button>
                : <button className="btn primary lg" onClick={() => go('/exam')}>🎓 Take a mock exam</button>}
              <button className="btn hot lg" onClick={() => go('/practice/daily')}>⚡ Daily 10</button>
            </div>
          </div>
          <div className="center">
            <Ring value={rd.pct / 100} size={150} stroke={12} color={passColor}>
              <div className="stat-big" style={{ color: passColor }}>{rd.pct}%</div>
              <div className="tiny muted">predicted score</div>
            </Ring>
            <div className="small muted mt">Pass line: {EXAM.passPct}% ({EXAM.passPoints}/{EXAM.maxPoints} pts)</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row"><div className="section-title" style={{ marginBottom: 0 }}>🗺️ Your journey</div><span className="spacer" /><span className="tiny muted">Ring = mastery (lessons + last answers). Click a station.</span></div>
        <div className="map-scroll"><MetroMap /></div>
      </div>

      <div className="grid g4">
        <div className="card hover" style={{ cursor: 'pointer' }} onClick={() => go('/cards')}>
          <div className="kicker">Flashcards due</div><div className="stat-big">{due}</div><div className="small muted">🃏 spaced repetition</div>
        </div>
        <div className="card hover" style={{ cursor: 'pointer' }} onClick={() => go('/practice/weak')}>
          <div className="kicker">Weak spots</div><div className="stat-big" style={{ color: weak ? 'var(--bad)' : undefined }}>{weak}</div><div className="small muted">🩹 questions to fix</div>
        </div>
        <div className="card hover" style={{ cursor: 'pointer' }} onClick={() => go('/practice')}>
          <div className="kicker">Questions seen</div><div className="stat-big">{attempted}<span className="muted" style={{ fontSize: 18 }}>/{allQuestions.length}</span></div><div className="small muted">🎯 {s.answered ? Math.round((s.answeredCorrect / s.answered) * 100) : 0}% accuracy overall</div>
        </div>
        <div className="card hover" style={{ cursor: 'pointer' }} onClick={() => go('/exam')}>
          <div className="kicker">Mock exams</div><div className="stat-big">{s.exams.length}</div><div className="small muted">🎓 best {s.exams.length ? Math.max(...s.exams.map((e) => Math.round((e.points / e.max) * 100))) : 0}%</div>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="section-title">📊 Readiness by chapter</div>
          <div className="col" style={{ gap: 10 }}>
            {chapters.map((c) => {
              const st = chapterStats(s, c.id);
              return (
                <div key={c.id} className="row" style={{ cursor: 'pointer' }} onClick={() => go(`/practice/ch/${c.id}`)}>
                  <span style={{ width: 26 }}>{c.emoji}</span>
                  <span className="small" style={{ width: 120 }}>{c.short}</span>
                  <div className="bar" style={{ flex: 1 }}><i style={{ width: `${st.attempted ? st.acc * 100 : 0}%`, background: c.color }} /></div>
                  <span className="small muted" style={{ width: 92, textAlign: 'right' }}>{st.attempted ? `${Math.round(st.acc * 100)}%` : '—'} · {c.examPoints}pt</span>
                </div>
              );
            })}
          </div>
          <div className="tiny faint mt">Accuracy is smoothed toward 25% (guessing) until you've answered enough. Weighted by each chapter's share of exam points.</div>
        </div>
        <div className="card">
          <div className="section-title">🧪 How this app makes it stick</div>
          <div className="col" style={{ gap: 10 }}>
            {[
              ['🖼️', 'Pictures + words (dual coding)', 'Every concept is a diagram you can poke at, with a short story — not a bullet list.'],
              ['🙈', 'Recall mode', 'Blur the details and try to remember before revealing. Retrieval beats re-reading.'],
              ['📅', 'Spaced repetition', 'Flashcards come back right before you forget them (Leitner boxes).'],
              ['🔀', 'Interleaving', 'Daily 10 and mock exams mix chapters — like the real exam.'],
              ['🪝', 'Memory hooks', 'Mnemonics and vivid images (Fat Elephants Wear Itchy Dotted Ties…).'],
            ].map(([i, t, d]) => (
              <div key={t} className="row" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22 }}>{i}</span><div><b>{t}</b><div className="small muted">{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card flat">
        <div className="section-title">📝 The exam at a glance</div>
        <div className="grid g4">
          <div><div className="stat-big">{EXAM.questions}</div><div className="small muted">multiple-choice questions</div></div>
          <div><div className="stat-big">{EXAM.maxPoints}</div><div className="small muted">points (K2=1, K3=2, K4=3 typically)</div></div>
          <div><div className="stat-big">{EXAM.passPoints}</div><div className="small muted">points to pass (65%)</div></div>
          <div><div className="stat-big">{EXAM.minutes}′</div><div className="small muted">minutes (+25% non-native language)</div></div>
        </div>
        <div className="tiny faint mt">Exam facts as per the ISTQB sample exam structure; confirm the details with your exam provider.</div>
      </div>
    </div>
  );
}
