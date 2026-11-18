import { useState } from 'react';
import { chapters, chapterById } from '../data/chapters';
import { scenesFor, sceneKey } from '../data/lessons';
import { useStore } from '../lib/store';
import { go } from '../lib/router';

const W = 1100, H = 840, CX = W / 2, CY = H / 2;

function wrap(text: string, max = 18): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function MindMap() {
  const s = useStore((s) => s);
  const [focus, setFocus] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  if (focus) {
    const c = chapterById(focus);
    const scenes = scenesFor(focus);
    const n = scenes.length;
    const R = 280;
    return (
      <div>
        <div className="row wrap">
          <button className="btn ghost sm" onClick={() => setFocus(null)}>← Whole syllabus</button>
          <h1 className="page-title" style={{ fontSize: 26 }}>{c.emoji} Chapter {c.id}: {c.title}</h1>
        </div>
        <p className="page-sub">Each branch is a lesson scene. Before clicking, try to explain the branch out loud — that's retrieval practice on a map.</p>
        <div className="mindmap-wrap mt">
          <svg viewBox={`0 0 ${W} ${H}`} className="mindmap" style={{ width: '100%', display: 'block', minWidth: 'var(--map-min, 0px)' }}>
            {/* connectors first so they never cross over another scene's box */}
            {scenes.map((_, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2;
              const x = CX + Math.cos(a) * R * 1.35, y = CY + Math.sin(a) * R;
              const done = !!s.scenes[sceneKey(focus, i)];
              return <path key={i} d={`M${CX} ${CY} Q ${(CX + x) / 2 + Math.sin(a) * 40} ${(CY + y) / 2 - Math.cos(a) * 40} ${x} ${y}`} fill="none" stroke={c.color} strokeWidth={done ? 5 : 3} opacity={done ? 0.9 : 0.45} style={{ animation: `sceneIn .4s ${i * 0.06}s both` }} />;
            })}
            {scenes.map((sc, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2;
              const x = CX + Math.cos(a) * R * 1.35, y = CY + Math.sin(a) * R;
              const done = !!s.scenes[sceneKey(focus, i)];
              return (
                <g key={i} className="mm-node" onClick={() => go(`/learn/${focus}/${i}`)} style={{ animation: `sceneIn .4s ${i * 0.06}s both` }}>
                  <rect x={x - 110} y={y - 50} width="220" height="100" rx="22" fill="var(--panel-solid)" stroke={c.color} strokeWidth={done ? 3 : 1.5} />
                  <text x={x} y={y - 14} textAnchor="middle" fontSize="28">{sc.icon}</text>
                  {wrap(sc.title, 24).map((l, k) => <text key={k} x={x} y={y + 14 + k * 17} textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--text)">{l}</text>)}
                  {done && <text x={x + 92} y={y - 30} fontSize="18">✅</text>}
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r="100" fill={c.color} opacity="0.22" />
            <circle cx={CX} cy={CY} r="84" fill="var(--panel-solid)" stroke={c.color} strokeWidth="4" />
            <text x={CX} y={CY - 8} textAnchor="middle" fontSize="44">{c.emoji}</text>
            <text x={CX} y={CY + 30} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--text)">{c.short}</text>
          </svg>
        </div>
        <div className="card mt">
          <div className="section-title">🎯 Learning objectives</div>
          {c.los.map((lo) => <div key={lo.id} className="small" style={{ margin: '6px 0' }}><span className="chip">{lo.id}</span> <span className="chip">K{lo.k}</span> {lo.text}</div>)}
        </div>
      </div>
    );
  }

  const maxPts = Math.max(...chapters.map((c) => c.examPoints));
  return (
    <div>
      <h1 className="page-title">🧠 Syllabus Mind Map</h1>
      <p className="page-sub">The whole CTAL-TAE syllabus on one screen. <b>Bubble size = exam weight</b> (points in the official sample). Click a chapter to zoom into its concepts.</p>
      <div className="mindmap-wrap mt">
        <svg viewBox={`0 0 ${W} ${H}`} className="mindmap" style={{ width: '100%', display: 'block', minWidth: 'var(--map-min, 0px)' }}>
          {/* all connectors first, so no line is painted over another chapter's bubble or label */}
          {chapters.map((c, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const x = CX + Math.cos(a) * 400, y = CY + Math.sin(a) * 280;
            const dim = hover !== null && hover !== c.id;
            return <path key={c.id} className={`mm-node ${dim ? 'mm-dim' : ''}`} d={`M${CX} ${CY} Q ${(CX + x) / 2} ${(CY + y) / 2 + 30} ${x} ${y}`} fill="none" stroke={c.color} strokeWidth="4" opacity="0.6" />;
          })}
          {chapters.map((c, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const x = CX + Math.cos(a) * 400, y = CY + Math.sin(a) * 280;
            const r = 44 + (c.examPoints / maxPts) * 40;
            const dim = hover !== null && hover !== c.id;
            return (
              <g key={c.id} className={`mm-node ${dim ? 'mm-dim' : ''}`} onClick={() => setFocus(c.id)} onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}>
                <circle cx={x} cy={y} r={r + 8} fill={c.color} opacity="0.18" />
                <circle cx={x} cy={y} r={r} fill="var(--panel-solid)" stroke={c.color} strokeWidth="3" />
                <text x={x} y={y - 4} textAnchor="middle" fontSize={r * 0.55}>{c.emoji}</text>
                <text x={x} y={y + r * 0.42} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">{c.examPoints} pts</text>
                <text x={x} y={y + r + 26} textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--text)" className="mm-halo">{c.id}. {c.short}</text>
                <text x={x} y={y + r + 44} textAnchor="middle" fontSize="12" fill="var(--muted)" className="mm-halo">{scenesFor(c.id).length} concepts · K{c.maxK}</text>
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r="96" fill="url(#cg)" />
          <defs><radialGradient id="cg"><stop offset="0" stopColor="#8b6cff" /><stop offset="1" stopColor="#22d3ee" /></radialGradient></defs>
          <text x={CX} y={CY - 12} textAnchor="middle" fontSize="40">🤖</text>
          <text x={CX} y={CY + 26} textAnchor="middle" fontSize="22" fontWeight="800" fill="white">CTAL-TAE</text>
          <text x={CX} y={CY + 46} textAnchor="middle" fontSize="12" fill="white" opacity="0.85">v2.0 · 21 h</text>
        </svg>
      </div>
    </div>
  );
}
