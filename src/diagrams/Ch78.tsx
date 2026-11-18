import { useEffect, useRef, useState } from 'react';
import { Secret, Tabs } from '../components/SceneKit';

/* ================= Static analysis scanner ================= */
const CODE = [
  { l: 'class LoginTest extends BaseTest {', s: null },
  { l: '  const user = "qa_admin";', s: null },
  { l: '  const password = "Sup3rS3cret!";', s: { sev: 'CRITICAL', c: '#ff2d55', msg: 'Plaintext password in test code (security violation)', fix: 'Read from a secret vault / env variable' } },
  { l: '  test("login works", async () => {', s: null },
  { l: '    for (var i = 0; i < items.length; i++) { … }', s: { sev: 'LOW', c: '#22d3ee', msg: 'Prefer a better looping structure', fix: 'for (const item of items) { … }' } },
  { l: '    await page.click("#login");', s: null },
  { l: '    const res = JSON.parse(body);', s: { sev: 'MEDIUM', c: '#fbbf24', msg: 'Unhandled exception risk', fix: 'Wrap in try/catch for resource handling' } },
  { l: '    // TODO', s: { sev: 'LOW', c: '#22d3ee', msg: 'Uncommented complex logic', fix: 'Add a meaningful comment' } },
  { l: '  });', s: null },
  { l: '}', s: null },
];
export function StaticScan() {
  const [line, setLine] = useState(-1);
  const [done, setDone] = useState(false);
  const run = () => {
    setDone(false); setLine(0);
    let k = 0;
    const t = setInterval(() => { k++; setLine(k); if (k >= CODE.length) { clearInterval(t); setDone(true); } }, 180);
  };
  return (
    <div className="grid g2" style={{ alignItems: 'start' }}>
      <div style={{ background: '#05060d', borderRadius: 14, padding: 14, fontFamily: 'var(--mono)', fontSize: 12.5, border: '1px solid var(--border)', position: 'relative', overflowX: 'auto', minWidth: 0 }}>
        {/* min-width: max-content keeps the line highlights full-width while the block scrolls on narrow screens */}
        <div style={{ minWidth: 'max-content' }}>
          {CODE.map((c, i) => (
            <div key={i} style={{ whiteSpace: 'pre', color: '#cbd5e1', background: line === i ? 'rgba(139,108,255,0.35)' : done && c.s ? `${c.s.c}22` : undefined, borderLeft: done && c.s ? `3px solid ${c.s.c}` : '3px solid transparent', paddingLeft: 6 }}>{c.l}</div>
          ))}
        </div>
      </div>
      <div className="col">
        <button className="btn primary" onClick={run}>🔍 Run static analysis</button>
        {done && CODE.filter((c) => c.s).map((c) => (
          <div key={c.l} className="row" style={{ alignItems: 'flex-start', padding: 10, borderRadius: 12, background: 'var(--panel-2)', borderLeft: `4px solid ${c.s!.c}` }}>
            <span className="chip" style={{ color: c.s!.c }}>{c.s!.sev}</span>
            <div className="small"><b>{c.s!.msg}</b><div className="muted">💡 Suggested fix: {c.s!.fix}</div></div>
          </div>
        ))}
        {!done && <div className="small muted">Severity buckets: <b>critical · high · medium · low</b> — so teams can prioritize. Many tools also suggest a code fix.</div>}
      </div>
    </div>
  );
}

/* ================= Test histogram ================= */
const RUNS = 14;
const TESTS: [string, number][] = [
  ['login_valid', 0], ['login_locked_user', 0.05], ['cart_add_item', 0], ['checkout_card', 0.45],
  ['checkout_paypal', 0.1], ['search_filters', 0.6], ['profile_update', 0], ['logout', 0.02],
];
export function Histogram() {
  const [seed] = useState(() => TESTS.map(([, p]) => Array.from({ length: RUNS }, () => Math.random() < p)));
  const [show, setShow] = useState(false);
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 3, fontSize: 12 }}>
          <thead><tr><th style={{ textAlign: 'left' }} className="muted">test \ run →</th>{Array.from({ length: RUNS }, (_, i) => <th key={i} className="faint">{i + 1}</th>)}<th className="muted">fail %</th></tr></thead>
          <tbody>
            {TESTS.map(([n], ti) => {
              const fails = seed[ti].filter(Boolean).length;
              const fragile = fails / RUNS > 0.2;
              return (
                <tr key={n} style={{ outline: show && fragile ? '2px solid var(--warn)' : undefined, borderRadius: 6 }}>
                  <td style={{ fontFamily: 'var(--mono)', paddingRight: 10 }}>{show && fragile ? '⚠️ ' : ''}{n}</td>
                  {seed[ti].map((f, i) => <td key={i} style={{ width: 18, height: 18, borderRadius: 4, background: f ? '#fb7185' : '#34d399', opacity: f ? 1 : 0.55 }} title={f ? 'failed' : 'passed'} />)}
                  <td><b style={{ color: fragile ? 'var(--warn)' : 'var(--muted)' }}>{Math.round((fails / RUNS) * 100)}%</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="btn sm mt" onClick={() => setShow((s) => !s)}>{show ? 'Hide' : '🔎 Spot the fragile tests'}</button>
      <div className="small muted mt">A visual <b>test histogram</b> across CI runs (with exception logs, error messages, screenshots) shows trends → pick the <b>fragile</b> tests and refactor or rethink them.</div>
    </div>
  );
}

/* ================= AI self-healing locator ================= */
export function SelfHealing() {
  const [stage, setStage] = useState(0);
  const timers = useRef<number[]>([]);
  const play = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setStage(1);
    timers.current = [2, 3, 4].map((s, i) => window.setTimeout(() => setStage(s), 1100 * (i + 1)));
  };
  const steps = [
    ['🧪', 'Test runs: click(#btn-pay)'],
    ['💥', 'Locator #btn-pay NOT found (dev renamed it)'],
    ['🤖', 'ML + image recognition: "this button looks/behaves like the old Pay button" → #checkout-pay'],
    ['🩹', 'Self-heals the test & continues ✅'],
    ['📝', 'Reports the changed locator → speeds up version control & maintenance'],
  ];
  return (
    <div className="grid g2" style={{ alignItems: 'center' }}>
      <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 18, background: 'var(--panel-2)', textAlign: 'center' }}>
        <div className="tiny muted">🛒 Checkout page</div>
        <button className="btn mt" style={{ borderColor: stage === 2 ? 'var(--bad)' : stage >= 3 ? 'var(--good)' : undefined, boxShadow: stage === 3 ? '0 0 0 6px rgba(52,211,153,.25)' : undefined, transition: 'all .3s' }}>
          💳 Pay now
        </button>
        <div className="mt" style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
          id = <span style={{ textDecoration: stage >= 2 ? 'line-through' : undefined, color: stage >= 2 ? 'var(--bad)' : undefined }}>"btn-pay"</span>
          {stage >= 2 && <span style={{ color: 'var(--good)' }}> "checkout-pay"</span>}
        </div>
        <button className="btn primary sm mt" onClick={play}>▶ Simulate</button>
      </div>
      <div className="col" style={{ gap: 6 }}>
        {steps.map(([i, t], k) => (
          <div key={t} className="row" style={{ padding: '8px 12px', borderRadius: 12, background: k < stage + 1 && stage > 0 ? 'var(--panel-2)' : 'transparent', opacity: stage === 0 || k <= stage ? 1 : 0.25, transition: 'all .3s' }}>
            <span style={{ fontSize: 22 }}>{i}</span><span className="small">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Schema validation ================= */
export function SchemaValidation() {
  const [broken, setBroken] = useState<string | null>(null);
  const fields = ['id', 'firstName', 'lastName', 'email', 'country', 'status'];
  const val = (f: string) => (broken === f ? (f === 'email' ? 'null' : '42') : `"${f === 'id' ? 'c-1093' : f === 'email' ? 'ana@x.io' : f === 'status' ? 'ACTIVE' : f === 'country' ? 'SE' : f === 'firstName' ? 'Ana' : 'Silva'}"`);
  return (
    <div className="grid g2" style={{ alignItems: 'start' }}>
      <div>
        <div className="kicker mb">API response — click a field to break it</div>
        <div style={{ background: '#05060d', borderRadius: 14, padding: 14, fontFamily: 'var(--mono)', fontSize: 13, border: '1px solid var(--border)' }}>
          <div>{'{'}</div>
          {fields.map((f) => (
            <div key={f} onClick={() => setBroken(broken === f ? null : f)} style={{ cursor: 'pointer', paddingLeft: 16, color: broken === f ? '#fb7185' : '#cbd5e1' }}>
              "{f}": {val(f)},
            </div>
          ))}
          <div>{'}'}</div>
        </div>
      </div>
      <div className="col">
        <Tabs value="x" onChange={() => {}} tabs={[{ id: 'x', label: '6 mandatory string fields' }]} />
        <div className="grid g2">
          <div className="vs-col"><b>😩 Without</b><div className="tiny muted mt" style={{ fontFamily: 'var(--mono)' }}>{fields.map((f) => <div key={f}>assert typeof {f} == string<br />assert {f} != null</div>)}</div><div className="small mt">12 assertions</div></div>
          <div className="vs-col"><b>😎 With schema</b><div className="tiny muted mt" style={{ fontFamily: 'var(--mono)', overflowWrap: 'anywhere' }}>validate(res, customerSchema)</div><div className="small mt">1 line — shorter code, more efficient defect detection</div></div>
        </div>
        <div className={`feedback ${broken ? 'no' : 'ok'}`}>
          {broken ? <>❌ Schema broken: <code>{broken}</code> expected <b>string</b>, got <b>{broken === 'email' ? 'null' : 'number'}</b> — the validator returns the actual failure → root cause fast.</> : '✅ Response matches the business specification (mandatory elements present, types match).'}
        </div>
        <div className="small muted"><Secret>Applies to API data analysis (endpoints) and database analysis (allowed types, value ranges). NOT to GUIs.</Secret></div>
      </div>
    </div>
  );
}

/* ================= Wait mechanisms race ================= */
export function WaitRace() {
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const READY = 2.3; // seconds when the SUT is actually ready
  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => { const s = (performance.now() - start) / 1000; setT(s); if (s < 5.2) raf = requestAnimationFrame(tick); else setRunning(false); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  const lanes = [
    { icon: '😴', name: 'Hard-coded wait  sleep(5000)', done: 5.0, c: '#fb7185', note: 'Always waits 5 s. Too short on a slow day = flaky failure; too long = wasted time. A root cause of many automation defects.' },
    { icon: '🔄', name: 'Dynamic polling  waitUntil(visible)', done: Math.ceil(READY / 0.5) * 0.5, c: '#fbbf24', note: 'Checks every 0.5 s → waits only as long as needed. MUST have a timeout or it may wait forever on a defect.' },
    { icon: '📡', name: 'Event subscription  on("ready")', done: READY + 0.02, c: '#34d399', note: 'Most reliable: SUT notifies the TAS. Needs language support for events + SUT must offer them. Also needs a timeout.' },
  ];
  return (
    <div>
      <div className="row"><button className="btn primary sm" onClick={() => { setT(0); setRunning(true); }}>🏁 Start race</button><span className="small muted">SUT becomes ready at <b>{READY}s</b> · clock: <code>{t.toFixed(1)}s</code></span></div>
      <div className="col mt" style={{ gap: 14 }}>
        {lanes.map((l) => {
          const p = Math.min(1, t / l.done);
          const fin = t >= l.done;
          return (
            <div key={l.name}>
              <div className="row small"><b style={{ fontFamily: 'var(--mono)' }}>{l.name}</b><span className="spacer" />{fin && <span className="chip" style={{ color: l.c }}>done at {l.done.toFixed(1)}s</span>}</div>
              <div style={{ position: 'relative', height: 34, borderRadius: 10, background: 'var(--panel-2)', marginTop: 4, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: `${(READY / 5.2) * 100}%`, top: 0, bottom: 0, borderLeft: '2px dashed var(--good)' }} />
                <div style={{ position: 'absolute', left: `max(2px, calc(${p * (l.done / 5.2) * 100}% - 30px))`, top: 2, fontSize: 24 }}>{l.icon}</div>
              </div>
              <div className="tiny muted" style={{ marginTop: 4 }}><Secret>{l.note}</Secret></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
