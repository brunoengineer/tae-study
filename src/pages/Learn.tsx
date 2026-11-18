import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { chapters, chapterById } from '../data/chapters';
import { scenesFor, sceneKey, type Check } from '../data/lessons';
import { markScene, setRecallMode, useStore, visitChapter } from '../lib/store';
import { go } from '../lib/router';
import { chapterStats } from '../lib/progress';
import { Ring } from '../components/Shell';
import { sfx, shuffle } from '../lib/util';

export function LearnIndex() {
  const s = useStore((s) => s);
  return (
    <div>
      <h1 className="page-title">📖 Learn visually</h1>
      <p className="page-sub">Each chapter is a short series of interactive scenes. Poke the diagrams, read the story, lock it in with the memory hook, then answer the recall check to complete the scene (+5 XP).</p>
      {/* auto-fit: two columns only when each card gets enough room (not on tablets beside the sidebar) */}
      <div className="grid mt2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
        {chapters.map((c) => {
          const st = chapterStats(s, c.id);
          return (
            <div key={c.id} className="card hover chapter-card" onClick={() => go(`/learn/${c.id}`)} style={{ borderTop: `4px solid ${c.color}` }}>
              <div className="ch-num" style={{ color: c.color }}>{c.id}</div>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <div className="ch-emoji">{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="kicker" style={{ color: c.color }}>Chapter {c.id} · {c.minutes} min · up to K{c.maxK}</div>
                  <h3 style={{ marginTop: 4 }}>{c.title}</h3>
                  <div className="small muted" style={{ marginTop: 4 }}>{c.tagline}</div>
                  <div className="row wrap mt" style={{ gap: 6 }}>
                    <span className="chip">🎬 {st.scenesDone}/{st.scenes} scenes</span>
                    <span className="chip">🎯 {st.attempted}/{st.total} questions</span>
                    <span className="chip">📝 ~{c.examQuestions} exam Qs · {c.examPoints} pts</span>
                  </div>
                </div>
                <Ring value={st.mastery} size={58} color={c.color}><span className="tiny" style={{ fontWeight: 800 }}>{Math.round(st.mastery * 100)}%</span></Ring>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecallCheck({ check, done, onCorrect }: { check: Check; done: boolean; onCorrect: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => setPick(null), [check]);
  const answered = pick !== null;
  const right = pick === check.answer;
  // Shuffle display order so the correct answer isn't always in the same position
  const order = useMemo(() => shuffle(check.options.map((_, i) => i)), [check]);
  return (
    <div className="card flat" style={{ background: 'var(--panel-2)' }}>
      <div className="row"><span style={{ fontSize: 22 }}>🧠</span><b>Recall check</b>{done && <span className="chip good">✓ completed</span>}</div>
      <div style={{ marginTop: 8, fontWeight: 600 }}>{check.q}</div>
      <div className="options" style={{ marginTop: 10 }}>
        {order.map((i, pos) => {
          const o = check.options[i];
          let cls = 'opt';
          if (answered) { if (i === check.answer) cls += ' right'; else if (i === pick) cls += ' wrong'; }
          return (
            <button key={o} className={cls} disabled={answered && right} onClick={() => {
              setPick(i);
              if (i === check.answer) { sfx('good'); onCorrect(); } else sfx('bad');
            }}>
              <span className="letter">{'abcd'[pos]}</span><span>{o}</span>
            </button>
          );
        })}
      </div>
      {answered && <div className={`feedback ${right ? 'ok' : 'no'}`}>{right ? '✅ ' : '❌ Not quite — try again. '}{check.why}</div>}
    </div>
  );
}

export function ChapterView({ ch, idx }: { ch: number; idx: number }) {
  const s = useStore((s) => s);
  const chapter = chapterById(ch);
  const scenes = scenesFor(ch);
  const i = Math.min(Math.max(0, idx), scenes.length - 1);
  const scene = scenes[i];
  const key = sceneKey(ch, i);
  const done = !!s.scenes[key];
  const [showLos, setShowLos] = useState(false);

  useEffect(() => { visitChapter(ch); }, [ch]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' && i < scenes.length - 1) go(`/learn/${ch}/${i + 1}`);
      if (e.key === 'ArrowLeft' && i > 0) go(`/learn/${ch}/${i - 1}`);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [ch, i, scenes.length]);

  const style = { '--ch': chapter.color } as CSSProperties;
  const nextCh = chapters.find((c) => c.id === ch + 1);

  return (
    <div style={style}>
      <div className="row wrap">
        <button className="btn ghost sm" onClick={() => go('/learn')}>← Chapters</button>
        <span className="spacer" />
        <label className="row small" style={{ gap: 8, cursor: 'pointer' }} title="Blur details so you must recall them first; click a blurred item to reveal it.">
          <input type="checkbox" checked={s.recallMode} onChange={(e) => setRecallMode(e.target.checked)} />
          🙈 Recall mode
        </label>
        <button className="btn sm" onClick={() => go(`/practice/ch/${ch}`)}>🎯 Practice this chapter</button>
      </div>

      <div className="row mt" style={{ alignItems: 'flex-start' }}>
        <div style={{ fontSize: 46 }}>{chapter.emoji}</div>
        <div style={{ flex: 1 }}>
          <div className="kicker" style={{ color: chapter.color }}>Chapter {ch} · {chapter.minutes} min · ~{chapter.examQuestions} exam questions</div>
          <h1 className="page-title" style={{ fontSize: 28 }}>{chapter.title}</h1>
          <button className="btn ghost sm" style={{ paddingLeft: 0 }} onClick={() => setShowLos((v) => !v)}>{showLos ? '▾' : '▸'} Learning objectives & keywords</button>
          {showLos && (
            <div className="card flat" style={{ marginTop: 6 }}>
              {chapter.los.map((lo) => <div key={lo.id} className="small" style={{ margin: '4px 0' }}><span className="chip">{lo.id}</span> <span className="chip">K{lo.k}</span> {lo.text}</div>)}
              <div className="row wrap mt" style={{ gap: 6 }}>{chapter.keywords.map((k) => <span key={k} className="chip" style={{ color: chapter.color }}>🔑 {k}</span>)}</div>
              <div className="tiny faint mt">Keywords must be remembered even if not in an LO.</div>
            </div>
          )}
        </div>
      </div>

      <div className="scene-nav mt">
        {scenes.map((sc, k) => (
          <button key={k} className={`scene-dot ${k === i ? 'on' : ''} ${s.scenes[sceneKey(ch, k)] ? 'done' : ''}`} onClick={() => go(`/learn/${ch}/${k}`)} title={sc.title}>
            {sc.icon} {k + 1}
          </button>
        ))}
      </div>

      <div className="scene mt" key={key}>
        <div className="card">
          <div className="row wrap">
            <h2 style={{ fontSize: 24 }}>{scene.icon} {scene.title}</h2>
            <span className="spacer" />
            <span className="row" style={{ gap: 6 }}><span className="chip">{scene.lo}</span><span className="chip">§ {scene.ref}</span></span>
          </div>
          <div className="story mt">{scene.story}</div>
          <div className={`mt2 ${s.recallMode ? 'recall' : ''}`}>{scene.visual()}</div>
          {s.recallMode && <div className="tiny faint center mt">🙈 Recall mode: say each blurred detail out loud, then click it to check yourself.</div>}
        </div>

        {/* only split into two columns when there is both a hook and a trap */}
        <div className={`grid mt ${scene.hook && scene.trap ? 'g2' : ''}`}>
          {scene.hook && <div className="hook"><span className="h-ico">🪝</span><div><b>Memory hook</b><div>{scene.hook}</div></div></div>}
          {scene.trap && <div className="trap"><span style={{ fontSize: 24 }}>🚨</span><div><b>Exam trap</b><div className="small">{scene.trap}</div></div></div>}
        </div>

        <div className="mt">
          <RecallCheck check={scene.check} done={done} onCorrect={() => markScene(key)} />
        </div>

        <div className="row mt2">
          <button className="btn" disabled={i === 0} onClick={() => go(`/learn/${ch}/${i - 1}`)}>← Previous</button>
          <span className="spacer" />
          <span className="tiny faint hide-sm">Tip: use ← → keys</span>
          <span className="spacer" />
          {i < scenes.length - 1
            ? <button className="btn primary" onClick={() => go(`/learn/${ch}/${i + 1}`)}>Next scene →</button>
            : nextCh
              ? <button className="btn primary" onClick={() => go(`/practice/ch/${ch}`)}>🎯 Chapter quiz</button>
              : <button className="btn primary" onClick={() => go('/exam')}>🎓 Mock exam</button>}
        </div>
        {i === scenes.length - 1 && nextCh && (
          <div className="center mt"><button className="btn ghost sm" onClick={() => go(`/learn/${nextCh.id}`)}>or continue to Chapter {nextCh.id}: {nextCh.emoji} {nextCh.short} →</button></div>
        )}
      </div>
    </div>
  );
}
