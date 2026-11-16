import { useEffect, useMemo, useRef, useState } from 'react';
import type { Question } from '../types';
import { allQuestions, withShuffledOptions } from '../data/questions';
import { official } from '../data/official';
import { chapters, chapterById } from '../data/chapters';
import { lessons, scenesFor } from '../data/lessons';
import { awardXP, recordAnswer, useStore, getState } from '../lib/store';
import { weakQuestions } from '../lib/progress';
import { go } from '../lib/router';
import { confetti, sameSet, sfx, shuffle } from '../lib/util';
import { OtherExplanations, QuestionView } from '../components/QuestionView';

/* --------------------------- Runner --------------------------- */
export function QuizRunner({ title, questions, onExit, keepOrder }: { title: string; questions: Question[]; onExit: () => void; keepOrder?: boolean }) {
  const [queue, setQueue] = useState(() => (keepOrder ? questions : questions.map(withShuffledOptions)));
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [combo, setCombo] = useState(0);
  const [results, setResults] = useState<{ q: Question; ok: boolean }[]>([]);
  const [xpEarned, setXp] = useState(0);
  const [shake, setShake] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  const q = queue[i];
  const finished = i >= queue.length;

  const toggle = (k: string) => {
    if (revealed) return;
    const need = q.correct.length;
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : need === 1 ? [k] : s.length < need ? [...s, k] : [...s.slice(1), k]));
  };

  const submit = () => {
    if (!q || revealed || sel.length !== q.correct.length) return;
    const ok = sameSet(sel, q.correct);
    const newCombo = ok ? combo + 1 : 0;
    setCombo(newCombo);
    setRevealed(true);
    recordAnswer(q.id, ok, newCombo);
    setResults((r) => [...r, { q, ok }]);
    if (ok) {
      sfx('good');
      const bonus = newCombo >= 3 ? Math.min(20, newCombo * 2) : 0;
      const xp = q.points * 10 + bonus;
      setXp((x) => x + xp);
      const rect = submitRef.current?.getBoundingClientRect();
      awardXP(xp, rect ? { x: rect.left + rect.width / 2 - 30, y: rect.top - 10 } : undefined);
      if (newCombo > 0 && newCombo % 5 === 0) confetti({ count: 90 });
    } else {
      sfx('bad'); setShake(true); setTimeout(() => setShake(false), 500);
      awardXP(1);
    }
  };
  const next = () => { setI((x) => x + 1); setSel([]); setRevealed(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished || !q) return;
      const idx = 'abcde'.indexOf(e.key.toLowerCase());
      const num = Number(e.key) - 1;
      const pick = idx >= 0 ? idx : num >= 0 && num < 5 ? num : -1;
      if (pick >= 0 && pick < q.options.length && !revealed) toggle(q.options[pick].key);
      if (e.key === 'Enter') { e.preventDefault(); revealed ? next() : submit(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  if (finished) {
    const right = results.filter((r) => r.ok).length;
    const missed = results.filter((r) => !r.ok).map((r) => r.q);
    const pc = Math.round((right / Math.max(1, results.length)) * 100);
    return (
      <div className="q-card">
        <div className="card center" style={{ padding: 32 }}>
          <div className="big-emoji">{pc >= 80 ? '🏆' : pc >= 65 ? '🎉' : pc >= 40 ? '💪' : '🌱'}</div>
          <h2 style={{ fontSize: 30, marginTop: 10 }}>{title} complete</h2>
          <div className="row" style={{ justifyContent: 'center', gap: 28, marginTop: 18 }}>
            <div><div className="stat-big" style={{ color: pc >= 65 ? 'var(--good)' : 'var(--bad)' }}>{pc}%</div><div className="small muted">{right}/{results.length} correct</div></div>
            <div><div className="stat-big gradient-text">+{xpEarned}</div><div className="small muted">XP earned</div></div>
          </div>
          <div className="row wrap" style={{ justifyContent: 'center', marginTop: 22 }}>
            {missed.length > 0 && <button className="btn hot" onClick={() => { setQueue(shuffle(missed).map(withShuffledOptions)); setI(0); setResults([]); setXp(0); setCombo(0); }}>🔁 Retry the {missed.length} missed</button>}
            <button className="btn primary" onClick={onExit}>Done</button>
          </div>
        </div>
        {missed.length > 0 && (
          <div className="card mt">
            <div className="section-title">🩹 Review what you missed</div>
            {missed.map((m) => (
              <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="small muted">{m.lo} · {chapterById(m.chapter).short}</div>
                <div style={{ fontWeight: 600 }}>{m.stem}</div>
                <div className="small" style={{ color: 'var(--good)', marginTop: 4 }}>✅ {m.correct.map((k) => m.options.find((o) => o.key === k)!.text).join(' + ')}</div>
                {m.hook && <div className="small muted">🪝 {m.hook}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const ok = revealed && sameSet(sel, q.correct);
  const lessonIdx = scenesFor(q.chapter).findIndex((s) => s.lo === q.lo);

  return (
    <div className="q-card">
      <div className="row wrap" style={{ marginBottom: 14 }}>
        <button className="btn ghost sm" onClick={onExit}>✕ Quit</button>
        <b>{title}</b>
        <span className="spacer" />
        {combo >= 2 && <span className="combo" key={combo}>🔥 {combo}x combo</span>}
        <span className="chip">{i + 1} / {queue.length}</span>
      </div>
      <div className="bar" style={{ marginBottom: 18 }}><i style={{ width: `${(i / queue.length) * 100}%` }} /></div>
      <div className={`card ${shake ? 'shake' : ''}`}>
        <QuestionView q={q} selected={sel} onToggle={toggle} revealed={revealed} />
        {revealed && (
          <div className={`feedback ${ok ? 'ok' : 'no'}`}>
            <b style={{ fontSize: 17 }}>{ok ? ['🎯 Nailed it!', '✅ Correct!', '🚀 Spot on!', '💯 Exactly!'][i % 4] : '❌ Not this time'}</b>
            {q.hook && <div className="hook" style={{ marginTop: 10 }}><span className="h-ico">🪝</span><div>{q.hook}</div></div>}
            <OtherExplanations q={q} selected={sel} />
            <div className="row wrap mt" style={{ gap: 8 }}>
              <span className="chip">📖 Syllabus § {q.ref}</span>
              {lessonIdx >= 0 && <button className="btn sm" onClick={() => go(`/learn/${q.chapter}/${lessonIdx}`)}>🎬 Open the visual lesson</button>}
            </div>
          </div>
        )}
        <div className="row mt">
          <span className="tiny faint">Keys: <kbd>A</kbd>–<kbd>E</kbd> / <kbd>1</kbd>–<kbd>5</kbd> select · <kbd>Enter</kbd> submit/next</span>
          <span className="spacer" />
          {!revealed
            ? <button ref={submitRef} className="btn primary" disabled={sel.length !== q.correct.length} onClick={submit}>Check answer</button>
            : <button className="btn primary" onClick={next}>{i === queue.length - 1 ? 'See results' : 'Next →'}</button>}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Setup --------------------------- */
function dailyTen(): Question[] {
  const s = getState();
  const weak = shuffle(weakQuestions(s)).slice(0, 4);
  const unseen = shuffle(allQuestions.filter((q) => !s.q[q.id])).slice(0, 4);
  const rest = shuffle(allQuestions.filter((q) => !weak.includes(q) && !unseen.includes(q)));
  return shuffle([...weak, ...unseen, ...rest].slice(0, 10));
}

export function Practice({ route }: { route: string[] }) {
  const s = useStore((s) => s);
  const [chs, setChs] = useState<number[]>(chapters.map((c) => c.id));
  const [src, setSrc] = useState<'all' | 'official' | 'practice'>('all');
  const [filter, setFilter] = useState<'all' | 'unseen' | 'wrong'>('all');
  const [count, setCount] = useState(15);
  const [run, setRun] = useState<{ title: string; qs: Question[] } | null>(null);

  // Deep-link presets
  const preset = route[1];
  const presetCh = Number(route[2]);
  const presetRun = useMemo(() => {
    if (preset === 'daily') return { title: '⚡ Daily 10', qs: dailyTen() };
    if (preset === 'weak') return { title: '🩹 Weak spots', qs: shuffle(weakQuestions(getState())).slice(0, 20) };
    if (preset === 'official') return { title: '📜 Official Sample Exam A (in order)', qs: official };
    if (preset === 'ch' && presetCh) return { title: `${chapterById(presetCh).emoji} Chapter ${presetCh} quiz`, qs: shuffle(allQuestions.filter((q) => q.chapter === presetCh)) };
    return null;
  }, [preset, presetCh]);

  const active = run ?? presetRun;
  if (active) {
    if (!active.qs.length) {
      return <div className="card center"><div className="big-emoji">🎉</div><h2>Nothing here yet!</h2><p className="muted">No questions match (e.g., no weak spots — great job).</p><button className="btn primary" onClick={() => { setRun(null); go('/practice'); }}>Back</button></div>;
    }
    return <QuizRunner key={active.title + active.qs.length} title={active.title} questions={active.qs} keepOrder={preset === 'official' && !run} onExit={() => { setRun(null); go('/practice'); }} />;
  }

  const pool = allQuestions.filter((q) => chs.includes(q.chapter) && (src === 'all' || q.source === src) && (filter === 'all' || (filter === 'unseen' ? !s.q[q.id] : s.q[q.id] && !s.q[q.id].last)));
  const weakN = weakQuestions(s).length;

  return (
    <div>
      <h1 className="page-title">🎯 Practice</h1>
      <p className="page-sub">{allQuestions.length} questions: the 40 official ISTQB sample questions + {allQuestions.length - 40} original exam-style questions covering every learning objective. Correct answers earn <b>10 XP × points</b>, with combo bonuses.</p>

      <div className="grid g4 mt2">
        {[
          { icon: '⚡', t: 'Daily 10', d: 'Mixed: weak + new + review', go: '/practice/daily', cls: 'hot' },
          { icon: '🩹', t: `Weak spots (${weakN})`, d: 'Questions you got wrong', go: '/practice/weak', cls: '' },
          { icon: '📜', t: 'Official sample', d: '40 ISTQB questions in order', go: '/practice/official', cls: '' },
          { icon: '🎓', t: 'Mock exam', d: '40 Qs · 90 min · scored', go: '/exam', cls: 'primary' },
        ].map((b) => (
          <div key={b.t} className="card hover" style={{ cursor: 'pointer' }} onClick={() => go(b.go)}>
            <div style={{ fontSize: 32 }}>{b.icon}</div><b style={{ fontFamily: 'var(--display)', fontSize: 17 }}>{b.t}</b><div className="small muted">{b.d}</div>
          </div>
        ))}
      </div>

      <div className="card mt2">
        <div className="section-title">🛠️ Build your own session</div>
        <div className="kicker">Chapters</div>
        <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
          {chapters.map((c) => (
            <button key={c.id} className={`chip click ${chs.includes(c.id) ? 'on' : ''}`} style={chs.includes(c.id) ? { background: c.color } : undefined}
              onClick={() => setChs((x) => (x.includes(c.id) ? x.filter((y) => y !== c.id) : [...x, c.id]))}>{c.emoji} {c.id}. {c.short}</button>
          ))}
          <button className="chip click" onClick={() => setChs(chs.length === 8 ? [] : chapters.map((c) => c.id))}>{chs.length === 8 ? 'none' : 'all'}</button>
        </div>
        <div className="row wrap mt" style={{ gap: 20 }}>
          <div><div className="kicker">Source</div><div className="pill-tabs" style={{ marginTop: 6 }}>{(['all', 'official', 'practice'] as const).map((x) => <button key={x} className={src === x ? 'on' : ''} onClick={() => setSrc(x)}>{x}</button>)}</div></div>
          <div><div className="kicker">Filter</div><div className="pill-tabs" style={{ marginTop: 6 }}>{(['all', 'unseen', 'wrong'] as const).map((x) => <button key={x} className={filter === x ? 'on' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div></div>
          <div><div className="kicker">How many</div><div className="pill-tabs" style={{ marginTop: 6 }}>{[10, 15, 25, 50].map((x) => <button key={x} className={count === x ? 'on' : ''} onClick={() => setCount(x)}>{x}</button>)}</div></div>
        </div>
        <div className="row mt2">
          <span className="muted small">{pool.length} questions match</span>
          <span className="spacer" />
          <button className="btn primary lg" disabled={!pool.length} onClick={() => setRun({ title: '🛠️ Custom session', qs: shuffle(pool).slice(0, count) })}>Start ▶</button>
        </div>
      </div>

      <div className="card mt2">
        <div className="section-title">🗂️ Question bank coverage</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cmp">
            <thead><tr><th>Learning objective</th><th>K</th><th>Questions</th><th>Seen</th><th>Last correct</th><th /></tr></thead>
            <tbody>
              {chapters.flatMap((c) => c.los).map((lo) => {
                const qs = allQuestions.filter((q) => q.lo === lo.id);
                const seen = qs.filter((q) => s.q[q.id]).length;
                const okN = qs.filter((q) => s.q[q.id]?.last).length;
                const ch = Number(lo.id.split('-')[1][0]);
                return (
                  <tr key={lo.id}>
                    <td><span style={{ color: chapterById(ch).color }}>●</span> <b>{lo.id}</b> <span className="small muted">{lo.text}</span></td>
                    <td>K{lo.k}</td><td>{qs.length}</td><td>{seen}</td>
                    <td><span style={{ color: seen ? (okN / seen >= 0.65 ? 'var(--good)' : 'var(--bad)') : undefined }}>{seen ? `${okN}/${seen}` : '—'}</span></td>
                    <td><button className="btn sm" onClick={() => setRun({ title: `🎯 ${lo.id}`, qs: shuffle(qs) })}>Drill</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="tiny faint mt">{lessons.length} lesson scenes link back from each question's feedback.</div>
      </div>
    </div>
  );
}
