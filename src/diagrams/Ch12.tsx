import { useState } from 'react';
import { Secret, Tabs } from '../components/SceneKit';

/* ================= Chapter 1: Balance scale ================= */
const ADV = [
  ['🔁', 'More tests per build than manual'],
  ['🦾', 'Tests impossible manually (real-time, remote, parallel)'],
  ['🧩', 'More complex tests than manual'],
  ['⚡', 'Executes faster'],
  ['🎯', 'Less subject to human error'],
  ['💰', 'More effective & efficient use of test resources'],
  ['📣', 'Quicker feedback on SUT quality'],
  ['🛡️', 'Improves system reliability (availability, recoverability)'],
  ['📏', 'Consistent execution across test cycles'],
];
const DIS = [
  ['💸', 'Additional costs: hire a TAE, new hardware, training'],
  ['🏦', 'Initial investment to set up a TAS'],
  ['⏳', 'Time to develop AND maintain the TAS'],
  ['🧭', 'Requires clear automation objectives to succeed'],
  ['🧊', 'Rigid tests, less adaptable to SUT changes'],
  ['🐛', 'Automation can introduce additional defects'],
];
const LIM = [
  ['✋', 'Not all manual tests can be automated'],
  ['🤖', 'Verifies only what it is programmed to verify'],
  ['🔢', 'Only machine-interpretable results → some quality characteristics not testable'],
  ['🔮', 'Only results verifiable by an automated test oracle'],
];

export function ScaleBalance() {
  const [side, setSide] = useState<'adv' | 'dis' | 'lim'>('adv');
  const tilt = side === 'adv' ? -8 : side === 'dis' ? 8 : 0;
  const list = side === 'adv' ? ADV : side === 'dis' ? DIS : LIM;
  const color = side === 'adv' ? 'var(--good)' : side === 'dis' ? 'var(--bad)' : 'var(--warn)';
  return (
    <div className="grid g2" style={{ alignItems: 'center' }}>
      <svg viewBox="0 0 320 246" style={{ width: '100%', maxWidth: 420, justifySelf: 'center' }}>
        <defs>
          <linearGradient id="beam" x1="0" x2="1"><stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#fb7185" /></linearGradient>
        </defs>
        {/* glass ceiling = limitations */}
        <g opacity={side === 'lim' ? 1 : 0.35} style={{ cursor: 'pointer', transition: 'opacity .3s' }} onClick={() => setSide('lim')}>
          <rect x="20" y="8" width="280" height="22" rx="6" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeDasharray="5 4" />
          <text x="160" y="24" textAnchor="middle" fontSize="12" fill="#fbbf24" fontWeight="700">🧱 LIMITATIONS — the glass ceiling</text>
        </g>
        <polygon points="160,120 145,215 175,215" fill="var(--panel-2)" stroke="var(--border-strong)" />
        <rect x="120" y="212" width="80" height="10" rx="4" fill="var(--border-strong)" />
        <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '160px 120px', transition: 'transform .6s cubic-bezier(.3,1.6,.5,1)' }}>
          <rect x="30" y="116" width="260" height="8" rx="4" fill="url(#beam)" />
          <circle cx="160" cy="120" r="8" fill="var(--text)" />
          <g style={{ cursor: 'pointer' }} onClick={() => setSide('adv')}>
            <line x1="45" y1="124" x2="25" y2="170" stroke="var(--faint)" /><line x1="45" y1="124" x2="85" y2="170" stroke="var(--faint)" />
            <path d="M15 170 h80 a40 18 0 0 1 -80 0z" fill="rgba(52,211,153,0.25)" stroke="#34d399" />
            <text x="55" y="168" textAnchor="middle" fontSize="20">✅</text>
          </g>
          <g style={{ cursor: 'pointer' }} onClick={() => setSide('dis')}>
            <line x1="275" y1="124" x2="235" y2="170" stroke="var(--faint)" /><line x1="275" y1="124" x2="295" y2="170" stroke="var(--faint)" />
            <path d="M225 170 h80 a40 18 0 0 1 -80 0z" fill="rgba(251,113,133,0.25)" stroke="#fb7185" />
            <text x="265" y="168" textAnchor="middle" fontSize="20">⚠️</text>
          </g>
        </g>
        {/* labels stay level (outside the tilting beam) so they never rotate out of the frame */}
        <text x="55" y="238" textAnchor="middle" fontSize="11" fill="#34d399" fontWeight="700" style={{ cursor: 'pointer' }} onClick={() => setSide('adv')}>9 ADVANTAGES</text>
        <text x="265" y="238" textAnchor="middle" fontSize="11" fill="#fb7185" fontWeight="700" style={{ cursor: 'pointer' }} onClick={() => setSide('dis')}>6 DISADVANTAGES</text>
      </svg>
      <div>
        <Tabs value={side} onChange={setSide} tabs={[{ id: 'adv', label: '✅ Advantages' }, { id: 'dis', label: '⚠️ Disadvantages' }, { id: 'lim', label: '🧱 Limitations' }]} />
        <div className="col mt" style={{ gap: 8 }}>
          {list.map(([i, t]) => (
            <div key={t} className="row" style={{ padding: '8px 12px', borderRadius: 12, background: 'var(--panel-2)', borderLeft: `3px solid ${color}` }}>
              <span style={{ fontSize: 22 }}>{i}</span><Secret>{t}</Secret>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Chapter 1: SDLC models ================= */
export function SdlcModels() {
  const [m, setM] = useState<'wf' | 'v' | 'ag'>('wf');
  return (
    <div>
      <Tabs value={m} onChange={setM} tabs={[{ id: 'wf', label: '🪜 Waterfall' }, { id: 'v', label: '✌️ V-model' }, { id: 'ag', label: '🔄 Agile' }]} />
      <div className="grid g2 sdlc-grid mt" style={{ alignItems: 'center' }}>
        {m === 'wf' && (
          <svg viewBox="0 0 400 248" style={{ width: '100%' }} role="img" aria-label="Waterfall model: five sequential phases">
            <defs>
              <marker id="wf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10z" fill="var(--faint)" />
              </marker>
            </defs>
            {['Requirements', 'Design', 'Implementation', 'Verification', 'Maintenance'].map((p, i) => {
              const x = 8 + i * 56, y = 8 + i * 44;
              return (
                <g key={p}>
                  {i < 4 && <path d={`M${x + 118} ${y + 16} h 14 v 26`} fill="none" stroke="var(--faint)" strokeWidth="1.5" markerEnd="url(#wf-arrow)" />}
                  <rect x={x} y={y} width="118" height="32" rx="8"
                    fill={i === 2 ? 'rgba(139,108,255,0.3)' : i === 3 ? 'rgba(52,211,153,0.25)' : 'var(--panel-2)'}
                    stroke={i === 2 ? '#8b6cff' : i === 3 ? '#34d399' : 'var(--border-strong)'} strokeWidth="1.5" />
                  <text x={x + 59} y={y + 20} textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="700">{p}</text>
                </g>
              );
            })}
            {/* annotations sit to the right of their phase, clear of the connectors */}
            <text x="260" y="112" fontSize="10" fill="#a78bfa" fontWeight="700">🛠️ build automation</text>
            <text x="260" y="125" fontSize="10" fill="#a78bfa">in parallel or after</text>
            <text x="316" y="156" fontSize="10" fill="#34d399" fontWeight="700">▶ tests run</text>
            <text x="316" y="169" fontSize="10" fill="#34d399">here (late)</text>
            <text x="8" y="242" fontSize="9.5" fill="var(--muted)">📄 each phase ends with approved documentation</text>
          </svg>
        )}
        {m === 'v' && (
          <svg viewBox="0 0 420 246" style={{ width: '100%' }} role="img" aria-label="V-model: each specification level pairs with a test level and its own TAF">
            {/* the V itself, drawn behind the boxes */}
            <path d="M74 25 L122 163 L210 216 L298 163 L346 25" fill="none" stroke="var(--border-strong)" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" opacity="0.35" />
            {[['Requirements', 'Acceptance'], ['System spec', 'System (integration)'], ['Architecture', 'Component integration'], ['Detailed design', 'Component']].map(([l, r], i) => {
              const y = 10 + i * 46, lx = 8 + i * 16, rx = 280 - i * 16, w = 132;
              return (
                <g key={l}>
                  <line x1={lx + w} y1={y + 15} x2={rx} y2={y + 15} stroke="#8b6cff" strokeDasharray="3 3" strokeWidth="1.2" />
                  <rect x={lx} y={y} width={w} height="30" rx="8" fill="var(--panel-solid)" stroke="var(--border-strong)" strokeWidth="1.5" />
                  <text x={lx + w / 2} y={y + 19} textAnchor="middle" fontSize="10.5" fill="var(--text)" fontWeight="700">{l}</text>
                  <rect x={rx} y={y} width={w} height="30" rx="8" fill="var(--panel-solid)" stroke="#34d399" strokeWidth="1.5" />
                  <text x={rx + w / 2} y={y + 19} textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="700">{r}</text>
                  <rect x="194" y={y + 7} width="32" height="16" rx="8" fill="var(--panel-solid)" stroke="#8b6cff" />
                  <text x="210" y={y + 18.5} textAnchor="middle" fontSize="8.5" fill="#a78bfa" fontWeight="800">TAF</text>
                </g>
              );
            })}
            <rect x="170" y="200" width="80" height="30" rx="8" fill="var(--panel-solid)" stroke="var(--border-strong)" strokeWidth="1.5" />
            <text x="210" y="219" textAnchor="middle" fontSize="10.5" fill="var(--muted)" fontWeight="700">Code</text>
            <text x="8" y="242" fontSize="9" fill="var(--muted)">⬇ specify</text>
            <text x="412" y="242" fontSize="9" fill="var(--muted)" textAnchor="end">test ⬆</text>
          </svg>
        )}
        {m === 'ag' && (
          <svg viewBox="0 0 400 250" style={{ width: '100%' }} role="img" aria-label="Agile: in-sprint automation surrounded by four practices">
            <style>{'@keyframes sdlc-spin{to{transform:rotate(360deg)}}'}</style>
            {[[138, 42, 152, 72], [262, 42, 248, 72], [138, 208, 152, 178], [262, 208, 248, 178]].map(([x1, y1, x2, y2], k) => (
              <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-strong)" strokeDasharray="3 3" />
            ))}
            <circle cx="200" cy="125" r="72" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="6" strokeDasharray="14 8"
              style={{ animation: 'sdlc-spin 12s linear infinite', transformOrigin: '200px 125px' }} />
            <text x="200" y="121" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--text)">Sprint</text>
            <text x="200" y="140" textAnchor="middle" fontSize="10.5" fill="#22d3ee" fontWeight="600">in-sprint automation</text>
            {([['👥', 'No silos', 4, 12], ['🔍', 'Code reviews', 262, 12], ['🧑‍🤝‍🧑', 'Pair programming', 4, 208], ['🔁', 'Frequent runs', 262, 208]] as const).map(([i, t, x, y]) => (
              <g key={t}>
                <rect x={x} y={y} width="134" height="30" rx="15" fill="var(--panel-2)" stroke="var(--border-strong)" strokeWidth="1.5" />
                <text x={x + 12} y={y + 20} fontSize="13">{i}</text>
                <text x={x + 32} y={y + 19} fontSize="10.5" fill="var(--text)" fontWeight="600">{t}</text>
              </g>
            ))}
          </svg>
        )}
        <div className="col">
          {m === 'wf' && <>
            <b>Linear & sequential</b>
            <Secret>Distinct phases, each ends with documentation that must be approved.</Secret>
            <Secret>Automation is implemented in parallel to or after the implementation phase.</Secret>
            <Secret>Test runs usually happen in the verification phase — components aren't ready before.</Secret>
          </>}
          {m === 'v' && <>
            <b>Sequential, each spec level ↔ a test level</b>
            <Secret>Traditional test levels come from here: component, component integration, system, system integration, acceptance.</Secret>
            <Secret>Providing a TAF for EACH test level is possible and recommended.</Secret>
          </>}
          {m === 'ag' && <>
            <b>Countless possibilities</b>
            <Secret>TAEs + business representatives decide on roadmap, timeline and planned test delivery.</Secret>
            <Secret>Best practices: code reviews, pair programming, frequent automated test execution.</Secret>
            <Secret>Eliminating silos lets teams cover all test levels → goal: in-sprint automation.</Secret>
          </>}
        </div>
      </div>
    </div>
  );
}

/* ================= Chapter 2: Tool comparison table ================= */
const CRITERIA = [
  'Language / technology & IDE',
  'Configurability (environments, run configs, static/dynamic values)',
  'Test data management (version-controlled repo)',
  'Fit for the needed test types',
  'Reporting capability',
  'Integration (CI/CD, task tracking, test mgmt)',
  'Scalability, maintainability, compatibility, reliability',
];
const SCORES = [
  [2, 1, 2], [2, 2, 1], [1, 2, 0], [2, 1, 2], [0, 2, 2], [2, 2, 1], [1, 2, 1],
];
const PRI = ['Must', 'Should', 'Could'] as const;
const W = { Must: 3, Should: 2, Could: 1 };

export function ToolMatrix() {
  const [pri, setPri] = useState<(typeof PRI[number])[]>(['Must', 'Should', 'Should', 'Must', 'Could', 'Must', 'Should']);
  const totals = [0, 1, 2].map((t) => SCORES.reduce((sum, row, i) => sum + row[t] * W[pri[i]], 0));
  const best = Math.max(...totals);
  const mark = (v: number) => (v === 2 ? '🟢' : v === 1 ? '🟡' : '🔴');
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="cmp">
        <thead>
          <tr><th>Requirement (rows)</th><th>Priority</th><th>🔧 Tool A</th><th>🛠️ Tool B</th><th>⚙️ Tool C</th></tr>
        </thead>
        <tbody>
          {CRITERIA.map((c, i) => (
            <tr key={c}>
              <td>{c}</td>
              <td>
                <button className="chip click" onClick={() => setPri((p) => p.map((x, j) => (j === i ? PRI[(PRI.indexOf(x) + 1) % 3] : x)))}>
                  {pri[i]}
                </button>
              </td>
              {SCORES[i].map((v, t) => <td key={t}>{mark(v)}</td>)}
            </tr>
          ))}
          <tr>
            <td><b>Weighted score</b></td><td className="tiny muted">click priorities ↑</td>
            {totals.map((t, i) => <td key={i}><b style={{ color: t === best ? 'var(--good)' : undefined }}>{t}{t === best ? ' 🏆' : ''}</b></td>)}
          </tr>
        </tbody>
      </table>
      <div className="small muted mt">Tools in <b>columns</b>, requirements in <b>rows</b>, cells = how each tool meets each requirement + priorities. Then <b>demonstrate the proposal to stakeholders for approval</b>. Note: there may be <b>no single tool</b> that fits every requirement.</div>
    </div>
  );
}
