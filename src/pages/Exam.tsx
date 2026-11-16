import { useEffect, useMemo, useState } from 'react';
import type { Question } from '../types';
import { buildMockExam, allQuestions } from '../data/questions';
import { official } from '../data/official';
import { chapters, chapterById, EXAM } from '../data/chapters';
import { recordAnswer, recordExam, useStore } from '../lib/store';
import { confetti, fmtTime, sameSet, sfx } from '../lib/util';
import { OtherExplanations, QuestionView } from '../components/QuestionView';
import { go } from '../lib/router';

type Phase = 'setup' | 'running' | 'results';

export function Exam() {
  const exams = useStore((s) => s.exams);
  const [phase, setPhase] = useState<Phase>('setup');
  const [kind, setKind] = useState<'mock' | 'official'>('mock');
  const [timed, setTimed] = useState(true);
  const [extra, setExtra] = useState(false);
  const [qs, setQs] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [cur, setCur] = useState(0);
  const [left, setLeft] = useState(0);
  const [startAt, setStartAt] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [review, setReview] = useState<number | null>(null);

  const start = () => {
    setQs(kind === 'mock' ? buildMockExam() : official);
    setAnswers({}); setFlags({}); setCur(0); setReview(null);
    setLeft((EXAM.minutes + (extra ? EXAM.extraMinutesNonNative : 0)) * 60);
    setStartAt(Date.now());
    setPhase('running');
  };

  const finish = () => {
    setConfirm(false);
    const perChapter: Record<number, [number, number]> = {};
    let points = 0, max = 0, correct = 0;
    for (const q of qs) {
      const ok = sameSet(answers[q.id] ?? [], q.correct);
      perChapter[q.chapter] ??= [0, 0];
      perChapter[q.chapter][1] += q.points;
      max += q.points;
      if (ok) { points += q.points; correct++; perChapter[q.chapter][0] += q.points; }
      if (answers[q.id]?.length) recordAnswer(q.id, ok, 0);
    }
    const passed = points / max >= EXAM.passPct / 100;
    recordExam({ at: Date.now(), kind, points, max, correct, total: qs.length, passed, seconds: Math.round((Date.now() - startAt) / 1000), perChapter });
    setPhase('results');
    window.scrollTo({ top: 0 });
    if (passed) { sfx('level'); confetti({ count: 260 }); } else sfx('bad');
  };

  useEffect(() => {
    if (phase !== 'running' || !timed) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timed]);
  useEffect(() => { if (phase === 'running' && timed && left <= 0) finish(); });

  if (phase === 'setup') {
    return (
      <div>
        <h1 className="page-title">🎓 Mock Exam</h1>
        <p className="page-sub">The boss battle. Simulates the real exam: {EXAM.questions} questions, {EXAM.maxPoints} points, pass at {EXAM.passPct}% ({EXAM.passPoints} pts), {EXAM.minutes} minutes. No feedback until you submit — just like the real thing.</p>
        <div className="grid g2 mt2">
          {[
            { id: 'mock' as const, icon: '🎲', t: 'Randomized mock exam', d: `Drawn from all ${allQuestions.length} questions with the official chapter distribution (3·5·6·4·6·4·6·6), spread across learning objectives.` },
            { id: 'official' as const, icon: '📜', t: 'Official Sample Exam A', d: 'The 40 ISTQB sample questions (v2.4) in their original order.' },
          ].map((o) => (
            <div key={o.id} className="card hover" style={{ cursor: 'pointer', borderColor: kind === o.id ? 'var(--accent)' : undefined, boxShadow: kind === o.id ? '0 0 0 2px var(--accent)' : undefined }} onClick={() => setKind(o.id)}>
              <div style={{ fontSize: 36 }}>{o.icon}</div><h3>{o.t}</h3><div className="small muted mt">{o.d}</div>
            </div>
          ))}
        </div>
        <div className="card mt">
          <label className="row" style={{ cursor: 'pointer' }}><input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> ⏱️ Timed ({EXAM.minutes} min)</label>
          <label className="row mt" style={{ cursor: 'pointer' }}><input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} /> 🌍 Taking the exam in a non-native language (+25% time)</label>
          <div className="row mt2"><span className="small muted">Passing earns 150+ XP and the 🎓 badge.</span><span className="spacer" /><button className="btn hot lg" onClick={start}>⚔️ Start exam</button></div>
        </div>
        {exams.length > 0 && (
          <div className="card mt">
            <div className="section-title">📈 Your history</div>
            <svg viewBox={`0 0 ${Math.max(300, exams.length * 50)} 140`} style={{ width: '100%', maxHeight: 180 }}>
              <line x1="0" x2="100%" y1={130 - 1.2 * EXAM.passPct} y2={130 - 1.2 * EXAM.passPct} stroke="var(--warn)" strokeDasharray="4 4" />
              <text x="4" y={126 - 1.2 * EXAM.passPct} fontSize="10" fill="var(--warn)">pass {EXAM.passPct}%</text>
              {exams.map((e, i) => {
                const p = (e.points / e.max) * 100;
                return (
                  <g key={e.at}>
                    <rect x={20 + i * 50} y={130 - 1.2 * p} width="30" height={1.2 * p} rx="6" fill={e.passed ? '#34d399' : '#fb7185'} opacity="0.85" />
                    <text x={35 + i * 50} y={124 - 1.2 * p} textAnchor="middle" fontSize="11" fill="var(--text)">{Math.round(p)}%</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'results') {
    const last = exams[exams.length - 1];
    const pc = Math.round((last.points / last.max) * 100);
    if (review !== null) {
      const q = qs[review];
      const a = answers[q.id] ?? [];
      return (
        <div className="q-card">
          <div className="row" style={{ marginBottom: 12 }}>
            <button className="btn ghost sm" onClick={() => setReview(null)}>← Results</button><span className="spacer" />
            <button className="btn sm" disabled={review === 0} onClick={() => setReview(review - 1)}>←</button>
            <span className="chip">{review + 1}/{qs.length}</span>
            <button className="btn sm" disabled={review === qs.length - 1} onClick={() => setReview(review + 1)}>→</button>
          </div>
          <div className="card">
            <QuestionView q={q} selected={a} onToggle={() => {}} revealed />
            {!a.length && <div className="feedback no">⏭️ You left this one blank.</div>}
            {q.hook && <div className="hook mt"><span className="h-ico">🪝</span><div>{q.hook}</div></div>}
            <OtherExplanations q={q} selected={a} />
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="card center" style={{ padding: 32 }}>
          <div className="big-emoji">{last.passed ? '🎓' : '📚'}</div>
          <h1 style={{ fontSize: 36, marginTop: 10 }} className={last.passed ? 'gradient-text' : undefined}>{last.passed ? 'PASSED!' : 'Not yet — keep training'}</h1>
          <div className="row" style={{ justifyContent: 'center', gap: 34, marginTop: 18 }}>
            <div><div className="stat-big" style={{ color: last.passed ? 'var(--good)' : 'var(--bad)' }}>{pc}%</div><div className="small muted">{last.points}/{last.max} points</div></div>
            <div><div className="stat-big">{last.correct}/{last.total}</div><div className="small muted">questions correct</div></div>
            <div><div className="stat-big">{fmtTime(last.seconds)}</div><div className="small muted">time used</div></div>
          </div>
        </div>
        <div className="grid g2 mt">
          <div className="card">
            <div className="section-title">📊 By chapter</div>
            {chapters.map((c) => {
              const [p, m] = last.perChapter[c.id] ?? [0, 0];
              if (!m) return null;
              const r = p / m;
              return (
                <div key={c.id} className="row" style={{ marginBottom: 8 }}>
                  <span style={{ width: 24 }}>{c.emoji}</span><span className="small" style={{ width: 110 }}>{c.short}</span>
                  <div className="bar" style={{ flex: 1 }}><i style={{ width: `${r * 100}%`, background: r >= 0.65 ? 'var(--good)' : r >= 0.4 ? 'var(--warn)' : 'var(--bad)' }} /></div>
                  <span className="small muted" style={{ width: 54, textAlign: 'right' }}>{p}/{m}</span>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="section-title">🔍 Review answers</div>
            <div className="exam-nav">
              {qs.map((q, i) => {
                const ok = sameSet(answers[q.id] ?? [], q.correct);
                return <button key={q.id} className={ok ? 'r-ok' : 'r-no'} onClick={() => setReview(i)}>{i + 1}</button>;
              })}
            </div>
            <div className="row wrap mt2">
              <button className="btn primary" onClick={() => setPhase('setup')}>🔁 Another exam</button>
              <button className="btn" onClick={() => go('/practice/weak')}>🩹 Train weak spots</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* running */
  const q = qs[cur];
  const sel = answers[q.id] ?? [];
  const answeredN = qs.filter((x) => answers[x.id]?.length === x.correct.length).length;
  return (
    <ExamRunning
      q={q} cur={cur} total={qs.length} sel={sel} flagged={!!flags[q.id]} left={left} timed={timed} answeredN={answeredN}
      qs={qs} answers={answers} flags={flags}
      onToggle={(k) => setAnswers((a) => {
        const s0 = a[q.id] ?? [];
        const need = q.correct.length;
        const next = s0.includes(k) ? s0.filter((x) => x !== k) : need === 1 ? [k] : s0.length < need ? [...s0, k] : [...s0.slice(1), k];
        return { ...a, [q.id]: next };
      })}
      onFlag={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
      setCur={setCur}
      onSubmit={() => setConfirm(true)}
      confirm={confirm} setConfirm={setConfirm} finish={finish}
    />
  );
}

function ExamRunning(p: {
  q: Question; cur: number; total: number; sel: string[]; flagged: boolean; left: number; timed: boolean; answeredN: number;
  qs: Question[]; answers: Record<string, string[]>; flags: Record<string, boolean>;
  onToggle: (k: string) => void; onFlag: () => void; setCur: (n: number) => void; onSubmit: () => void;
  confirm: boolean; setConfirm: (b: boolean) => void; finish: () => void;
}) {
  const ch = chapterById(p.q.chapter);
  const unanswered = p.total - p.answeredN;
  const flaggedN = useMemo(() => Object.values(p.flags).filter(Boolean).length, [p.flags]);
  return (
    <div className="grid exam-grid">
      <div className="card">
        <div className="row">
          <b style={{ fontFamily: 'var(--display)' }}>Question {p.cur + 1}</b>
          <span className="chip">{p.q.points} pt{p.q.points > 1 ? 's' : ''}</span>
          <span className="spacer" />
          <button className={`btn sm ${p.flagged ? 'hot' : ''}`} onClick={p.onFlag}>🚩 {p.flagged ? 'Flagged' : 'Flag'}</button>
        </div>
        <QuestionView q={p.q} selected={p.sel} onToggle={p.onToggle} revealed={false} showMeta={false} />
        <div className="row mt2">
          <button className="btn" disabled={p.cur === 0} onClick={() => p.setCur(p.cur - 1)}>← Prev</button>
          <span className="spacer" />
          <span className="tiny faint" title="Chapter hidden in the real exam">{ch.emoji}</span>
          <span className="spacer" />
          {p.cur < p.total - 1 ? <button className="btn primary" onClick={() => p.setCur(p.cur + 1)}>Next →</button> : <button className="btn hot" onClick={p.onSubmit}>Submit exam</button>}
        </div>
      </div>
      <div className="card" style={{ position: 'sticky', top: 90 }}>
        {p.timed && <div className={`timer center ${p.left < 300 ? 'low' : ''}`}>⏱️ {fmtTime(Math.max(0, p.left))}</div>}
        <div className="small muted center">{p.answeredN}/{p.total} answered · {flaggedN} flagged</div>
        <div className="exam-nav mt" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {p.qs.map((x, i) => (
            <button key={x.id} className={`${p.answers[x.id]?.length === x.correct.length ? 'ans' : ''} ${p.flags[x.id] ? 'flag' : ''} ${i === p.cur ? 'cur' : ''}`} onClick={() => p.setCur(i)}>{i + 1}</button>
          ))}
        </div>
        <button className="btn hot mt" style={{ width: '100%' }} onClick={p.onSubmit}>Submit exam</button>
      </div>
      {p.confirm && (
        <div className="modal-back" onClick={() => p.setConfirm(false)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <div className="big-emoji">📝</div>
            <h2 style={{ marginTop: 10 }}>Submit your exam?</h2>
            <p className="muted">{unanswered > 0 ? `⚠️ ${unanswered} question(s) unanswered. ` : ''}{flaggedN > 0 ? `🚩 ${flaggedN} flagged. ` : ''}There's no penalty for guessing — answer everything!</p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={() => p.setConfirm(false)}>Keep working</button>
              <button className="btn hot" onClick={p.finish}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
