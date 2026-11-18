import { useEffect, useState } from 'react';
import { Secret, Tabs } from '../components/SceneKit';

/* ================= CI/CD pipeline with test levels ================= */
export function PipelineViz() {
  const [ap, setAp] = useState<'in' | 'sep'>('in');
  const Stage = ({ icon, title, tests, color, gate }: { icon: string; title: string; tests: string[]; color: string; gate?: boolean }) => (
    <div style={{ flex: 1, minWidth: 170, borderRadius: 16, border: `2px solid ${color}`, background: `${color}14`, padding: 12, position: 'relative' }}>
      <div className="row" style={{ gap: 8 }}><span style={{ fontSize: 22 }}>{icon}</span><b style={{ fontFamily: 'var(--display)' }}>{title}</b></div>
      <div className="col" style={{ gap: 4, marginTop: 8 }}>
        {tests.map((t) => <span key={t} className="small" style={{ padding: '4px 8px', borderRadius: 8, background: 'var(--panel-2)' }}><Secret>{t}</Secret></span>)}
      </div>
      {gate && <span className="chip good" style={{ position: 'absolute', top: -12, right: 10, background: 'var(--panel-solid)' }}>🚧 quality gate</span>}
    </div>
  );
  return (
    <div>
      <div className="row wrap pipe-row" style={{ alignItems: 'stretch', gap: 10 }}>
        <Stage icon="🏗️" title="BUILD phase (CI)" color="#8b6cff" gate tests={['TAF/TAS configuration tests (paths & files exist)', 'Component tests', 'Component integration tests']} />
        <div className="flow-arrow">➜</div>
        <Stage icon="🚚" title="DEPLOY phase" color="#22d3ee" gate={ap === 'in'} tests={ap === 'in' ? ['System integration / system / acceptance tests run INSIDE deployment'] : ['Deploy only', 'Few simple deployment checks (smoke)']} />
        <div className="flow-arrow">➜</div>
        <Stage icon="🧪" title={ap === 'in' ? 'Done ✅' : 'SEPARATE test pipeline'} color={ap === 'in' ? '#43c59e' : '#ffb703'} tests={ap === 'in' ? ['Deployment succeeded because the tests passed'] : ['Triggered by successful deployment', 'Different suites can run per deployment']} />
      </div>
      <div className="mt"><Tabs value={ap} onChange={setAp} tabs={[{ id: 'in', label: '① Tests inside the deployment phase' }, { id: 'sep', label: '② Separate pipeline after deployment' }]} /></div>
      <div className="grid g2 mt">
        {ap === 'in' ? <>
          <div className="vs-col" style={{ borderTop: '4px solid var(--good)' }}><b className="pro">✚ Benefits</b><ul><Secret as="li">Results can FAIL the deployment</Secret><Secret as="li">…and trigger an automatic ROLLBACK</Secret><Secret as="li">Tests act as a quality gate</Secret></ul></div>
          <div className="vs-col" style={{ borderTop: '4px solid var(--bad)' }}><b className="con">✖ Drawback</b><ul><Secret as="li">To RERUN tests you must REDEPLOY</Secret></ul></div>
        </> : <>
          <div className="vs-col" style={{ borderTop: '4px solid var(--good)' }}><b className="pro">✚ Benefits</b><ul><Secret as="li">Good when different test suites / automation code run on each deployment</Secret><Secret as="li">Rerun tests without redeploying</Secret></ul></div>
          <div className="vs-col" style={{ borderTop: '4px solid var(--bad)' }}><b className="con">✖ Drawbacks</b><ul><Secret as="li">Tests do NOT act as a quality gate</Secret><Secret as="li">Rollback needs other, usually MANUAL, actions</Secret><Secret as="li">Deployment checks only prove it's deployed — not broad functional suitability</Secret></ul></div>
        </>}
      </div>
      <div className="grid g2 mt">
        <div className="vs-col"><b>🔗 Where each level usually lives</b><ul className="small">
          <Secret as="li">Component tests → build step, quality gate of CI</Secret>
          <Secret as="li">Component integration → CI pipeline (with component tests)</Secret>
          <Secret as="li">System tests → continuous DEPLOYMENT pipeline, last quality gate</Secret>
          <Secret as="li">System integration tests → continuous DELIVERY pipeline quality gates</Secret>
        </ul></div>
        <div className="vs-col"><b>⏰ Other pipeline purposes</b><ul className="small">
          <Secret as="li">🌙 Nightly regression — clear picture of quality in the morning</Secret>
          <Secret as="li">⚡ Non-functional tests (e.g. performance efficiency) — in CD or periodically</Secret>
        </ul></div>
      </div>
    </div>
  );
}

/* ================= Contract testing ================= */
export function ContractHandshake() {
  const [mode, setMode] = useState<'cdc' | 'pdc'>('cdc');
  const cdc = mode === 'cdc';
  return (
    <div>
      <Tabs value={mode} onChange={setMode} tabs={[{ id: 'cdc', label: '📱 Consumer-driven' }, { id: 'pdc', label: '🖥️ Provider-driven' }]} />
      <svg viewBox="0 32 560 158" style={{ width: '100%', marginTop: 10 }}>
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#ffb703" /></marker>
        </defs>
        <rect x="4" y="50" width="126" height="90" rx="16" fill="rgba(139,108,255,0.18)" stroke="#8b6cff" strokeWidth={cdc ? 3 : 1} />
        <text x="67" y="88" textAnchor="middle" fontSize="28">📱</text>
        <text x="67" y="120" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--text)">Consumer</text>
        <rect x="430" y="50" width="126" height="90" rx="16" fill="rgba(34,211,238,0.18)" stroke="#22d3ee" strokeWidth={!cdc ? 3 : 1} />
        <text x="493" y="88" textAnchor="middle" fontSize="28">🖥️</text>
        <text x="493" y="120" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--text)">Provider</text>
        <rect x="226" y="40" width="108" height="110" rx="10" fill="rgba(255,183,3,0.15)" stroke="#ffb703" strokeDasharray="5 4" />
        <text x="280" y="80" textAnchor="middle" fontSize="30">📜</text>
        <text x="280" y="108" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffb703">CONTRACT</text>
        <text x="280" y="126" textAnchor="middle" fontSize="10" fill="var(--muted)">allowed interactions</text>
        {cdc
          ? <><line x1="130" y1="95" x2="222" y2="95" stroke="#ffb703" strokeWidth="3" markerEnd="url(#ah)" /><line x1="334" y1="95" x2="426" y2="95" stroke="#ffb703" strokeWidth="3" strokeDasharray="6 4" markerEnd="url(#ah)" />
            <text x="178" y="84" textAnchor="middle" fontSize="10" fill="var(--text)">writes</text><text x="382" y="84" textAnchor="middle" fontSize="10" fill="var(--text)">verified vs</text></>
          : <><line x1="430" y1="95" x2="338" y2="95" stroke="#ffb703" strokeWidth="3" markerEnd="url(#ah)" /><line x1="226" y1="95" x2="134" y2="95" stroke="#ffb703" strokeWidth="3" strokeDasharray="6 4" markerEnd="url(#ah)" />
            <text x="382" y="84" textAnchor="middle" fontSize="10" fill="var(--text)">writes</text><text x="178" y="84" textAnchor="middle" fontSize="10" fill="var(--text)">consumed by</text></>}
        <text x="280" y="178" textAnchor="middle" fontSize="12" fill="var(--muted)">{cdc ? 'Consumer sets its EXPECTATIONS of how the provider shall respond' : 'Provider creates the contract showing HOW its services operate'}</text>
      </svg>
      <div className="grid g2 mt">
        <div className="vs-col"><b>🤝 What it is</b><ul className="small">
          <Secret as="li">Integration testing that services can communicate & shared data follows agreed rules</Secret>
          <Secret as="li">Compatibility of two separate systems (e.g., two microservices)</Secret>
          <Secret as="li">Goes BEYOND schema validation: both parties agree on allowed interactions and can evolve over time</Secret>
          <Secret as="li">Interactions captured → stored in a contract → both sides verified against it</Secret>
        </ul></div>
        <div className="vs-col"><b>🏆 Why</b><ul className="small">
          <Secret as="li">Defects from underlying services found EARLIER in the SDLC</Secret>
          <Secret as="li">The source of those defects is easier to identify</Secret>
          <Secret as="li">Extends component integration & system integration testing (shift left)</Secret>
        </ul></div>
      </div>
    </div>
  );
}

/* ================= Trace / correlation ID ================= */
export function TraceId() {
  const hops = [['🌐', 'Browser'], ['🚪', 'API gateway'], ['🧩', 'Order service'], ['💳', 'Payment service'], ['🗄️', 'Database']];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % (hops.length + 2)), 900); return () => clearInterval(t); }, [hops.length]);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))', gap: 10, padding: '8px 0' }}>
        {hops.map(([ic, n], k) => (
          <div key={n} className="col" style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 30, width: 60, height: 60, borderRadius: 18, display: 'grid', placeItems: 'center', background: k <= i - 1 ? 'rgba(255,183,3,0.25)' : 'var(--panel-2)', border: `2px solid ${k === i - 1 ? '#ffb703' : 'var(--border)'}`, transition: 'all .3s' }}>{ic}</div>
            <b className="small">{n}</b>
            <code className="tiny" style={{ opacity: k <= i - 1 ? 1 : 0.35, color: '#ffb703', transition: 'opacity .3s' }}>trace-7f3a · {12 + k * 17}ms</code>
          </div>
        ))}
      </div>
      <div className="small muted center">One unique <b>correlation / trace ID</b> travels with every subsequent call — so the TAS can log it and you can trace behavior (and timings) end-to-end.</div>
    </div>
  );
}
