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
      <svg viewBox="0 0 320 240" style={{ width: '100%', maxWidth: 420 }}>
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
            <text x="55" y="200" textAnchor="middle" fontSize="11" fill="#34d399" fontWeight="700">9 ADVANTAGES</text>
          </g>
          <g style={{ cursor: 'pointer' }} onClick={() => setSide('dis')}>
            <line x1="275" y1="124" x2="235" y2="170" stroke="var(--faint)" /><line x1="275" y1="124" x2="295" y2="170" stroke="var(--faint)" />
            <path d="M225 170 h80 a40 18 0 0 1 -80 0z" fill="rgba(251,113,133,0.25)" stroke="#fb7185" />
            <text x="265" y="168" textAnchor="middle" fontSize="20">⚠️</text>
            <text x="265" y="200" textAnchor="middle" fontSize="11" fill="#fb7185" fontWeight="700">6 DISADVANTAGES</text>
          </g>
        </g>
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
      <div className="grid g2 mt" style={{ alignItems: 'center' }}>
        {m === 'wf' && (
          <svg viewBox="0 0 340 220" style={{ width: '100%' }}>
            {['Requirements', 'Design', 'Implementation', 'Verification', 'Maintenance'].map((p, i) => (
              <g key={p}>
                <rect x={10 + i * 62} y={14 + i * 38} width="110" height="30" rx="8"
                  fill={i === 2 ? 'rgba(139,108,255,0.35)' : i === 3 ? 'rgba(52,211,153,0.3)' : 'var(--panel-2)'}
                  stroke={i === 2 ? '#8b6cff' : i === 3 ? '#34d399' : 'var(--border-strong)'} />
                <text x={65 + i * 62} y={34 + i * 38} textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="600">{p}</text>
                {i < 4 && <path d={`M${120 + i * 62} ${29 + i * 38} q 14 0 14 22`} fill="none" stroke="var(--faint)" markerEnd="" />}
              </g>
            ))}
            <text x="140" y="118" fontSize="10" fill="#8b6cff">🛠️ build automation (∥ or after)</text>
            <text x="200" y="156" fontSize="10" fill="#34d399">▶ run tests here</text>
          </svg>
        )}
        {m === 'v' && (
          <svg viewBox="0 0 340 220" style={{ width: '100%' }}>
            <path d="M20 20 L170 200 L320 20" fill="none" stroke="var(--border-strong)" strokeWidth="26" strokeLinejoin="round" opacity="0.5" />
            {[['Requirements', 'Acceptance'], ['System spec', 'System (integration)'], ['Architecture', 'Component integration'], ['Detailed design', 'Component']].map(([l, r], i) => (
              <g key={l}>
                <text x={40 + i * 36} y={30 + i * 44} fontSize="10" fill="var(--text)" fontWeight="600">{l}</text>
                <text x={300 - i * 36} y={30 + i * 44} fontSize="10" fill="#34d399" fontWeight="700" textAnchor="end">{r}</text>
                <line x1={110 + i * 36} y1={27 + i * 44} x2={230 - i * 36} y2={27 + i * 44} stroke="#8b6cff" strokeDasharray="3 3" opacity="0.7" />
                <text x="170" y={24 + i * 44} fontSize="9" fill="#8b6cff" textAnchor="middle">TAF</text>
              </g>
            ))}
            <text x="170" y="212" textAnchor="middle" fontSize="10" fill="var(--muted)">Code</text>
          </svg>
        )}
        {m === 'ag' && (
          <svg viewBox="0 0 340 220" style={{ width: '100%' }}>
            <circle cx="170" cy="110" r="80" fill="none" stroke="#22d3ee" strokeWidth="6" strokeDasharray="14 8" style={{ animation: 'spin 12s linear infinite', transformOrigin: '170px 110px' }} />
            <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
            <text x="170" y="104" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--text)">Sprint</text>
            <text x="170" y="124" textAnchor="middle" fontSize="11" fill="#22d3ee">in-sprint automation</text>
            {[['👥', 'No silos', 20, 40], ['🔍', 'Code reviews', 260, 40], ['🧑‍🤝‍🧑', 'Pair programming', 10, 195], ['🔁', 'Frequent runs', 250, 195]].map(([i, t, x, y]) => (
              <g key={t as string}><text x={x as number} y={y as number} fontSize="18">{i}</text><text x={(x as number) + 24} y={(y as number) - 4} fontSize="10" fill="var(--text)">{t}</text></g>
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
