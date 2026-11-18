import { useState } from 'react';
import { Secret, Tabs } from '../components/SceneKit';

/* ================= gTAA ================= */
type GKey = 'gen' | 'def' | 'exe' | 'ada' | 'sut' | 'pm' | 'tm' | 'cm';
const G: Record<GKey, { icon: string; title: string; text: string; color: string }> = {
  gen: { icon: '🧬', title: 'Test Generation (optional)', color: '#a78bfa', text: 'Automated DESIGN of test cases from a test model. Model-based testing tools can be leveraged. It is the only OPTIONAL capability.' },
  def: { icon: '✍️', title: 'Test Definition', color: '#8b6cff', text: 'Definition & implementation of test cases / suites (optionally derived from a model). Separates test definition from the SUT and tools. Holds high- & low-level tests via test data, test cases and test library components.' },
  exe: { icon: '▶️', title: 'Test Execution', color: '#22d3ee', text: 'Runs the selected tests automatically AND handles test logging + test reporting.' },
  ada: { icon: '🔌', title: 'Test Adaptation', color: '#2ec4b6', text: 'Adapts the automated tests to the SUT\'s components/interfaces: adaptors that connect via APIs, protocols and services.' },
  sut: { icon: '🎯', title: 'SUT interface', color: '#ff7a59', text: 'Describes the connection between the SUT and the TAF.' },
  pm: { icon: '📅', title: 'Project management interface', color: '#ffb703', text: 'Describes the test automation DEVELOPMENT PROGRESS.' },
  tm: { icon: '🗂️', title: 'Test management interface', color: '#f72585', text: 'Describes the MAPPING of test case definitions ↔ automated test cases.' },
  cm: { icon: '🧰', title: 'Configuration management interface', color: '#43c59e', text: 'Describes the CI/CD pipelines, environments and testware.' },
};

export function GtaaDiagram() {
  const [k, setK] = useState<GKey>('def');
  const Box = ({ id, big }: { id: GKey; big?: boolean }) => (
    <div className={`node ${k === id ? 'sel' : ''}`} style={{ ['--c' as string]: G[id].color, padding: big ? 14 : 10, borderStyle: id === 'gen' ? 'dashed' : 'solid' }} onClick={() => setK(id)}>
      <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: big ? 24 : 20 }}>{G[id].icon}</span>
        <span className="n-title" style={{ marginTop: 0, fontSize: big ? 15 : 13 }}>{G[id].title.replace(' interface', '')}</span>
      </div>
    </div>
  );
  return (
    <div>
      <div className="gtaa-grid">
        <div className="col"><Box id="pm" /><div className="tiny faint center">interface ↔</div></div>
        <div style={{ border: '2px solid var(--border-strong)', borderRadius: 20, padding: 12, background: 'var(--panel-2)' }}>
          <div className="kicker center" style={{ marginBottom: 8 }}>Test Automation Framework · capabilities</div>
          <div className="col" style={{ gap: 8 }}>
            <Box id="gen" big /><Box id="def" big /><Box id="exe" big /><Box id="ada" big />
          </div>
        </div>
        <div className="col"><Box id="tm" /><Box id="cm" /><div className="tiny faint center">↔ interfaces</div></div>
      </div>
      <div className="center" style={{ fontSize: 22, color: 'var(--faint)' }}>⇅</div>
      <div style={{ maxWidth: 300, margin: '0 auto' }}><Box id="sut" big /></div>
      <div className="detail" style={{ ['--c' as string]: G[k].color }}>
        <h4>{G[k].icon} {G[k].title}</h4>
        <Secret>{G[k].text}</Secret>
      </div>
    </div>
  );
}

/* ================= TAF layers ================= */
export function TafLayers() {
  const [view, setView] = useState<'layers' | 'scale'>('layers');
  const [call, setCall] = useState<'ok' | 'bad' | null>(null);
  const L = [
    { icon: '📜', name: 'Test scripts', c: '#8b6cff', d: 'Test case repository + test suite annotations. Calls ONLY the business logic layer (test steps, user flows, API calls).' },
    { icon: '🧠', name: 'Business logic', c: '#ff7a59', d: 'All SUT-DEPENDENT libraries. Inherit core classes or use their facades. Sets up the TAF to run against the SUT + additional configuration.' },
    { icon: '⚙️', name: 'Core libraries', c: '#22d3ee', d: 'All SUT-INDEPENDENT libraries. Reusable in any project sharing the same development stack.' },
  ];
  return (
    <div>
      <Tabs value={view} onChange={setView} tabs={[{ id: 'layers', label: '🥞 The 3 layers' }, { id: 'scale', label: '📈 Scaling with core libraries' }]} />
      {view === 'layers' ? (
        <div className="grid g2 mt" style={{ alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            {L.map((l, i) => (
              <div key={l.name} className="node" style={{ ['--c' as string]: l.c, textAlign: 'left', marginBottom: 10, marginLeft: i * 18, marginRight: (2 - i) * 18, borderLeft: `5px solid ${l.c}`,
                boxShadow: call === 'bad' && i !== 1 ? '0 0 0 2px var(--bad)' : call === 'ok' && i < 2 ? '0 0 0 2px var(--good)' : undefined }}>
                <div className="row"><span style={{ fontSize: 26 }}>{l.icon}</span><b style={{ fontFamily: 'var(--display)' }}>{l.name}</b></div>
                <div className="small muted" style={{ marginTop: 4 }}><Secret>{l.d}</Secret></div>
              </div>
            ))}
          </div>
          <div className="col">
            <b>Try a call from a test script:</b>
            <div className="row wrap">
              <button className="btn sm" onClick={() => setCall('ok')}>📜 → 🧠 Business logic</button>
              <button className="btn sm" onClick={() => setCall('bad')}>📜 → ⚙️ Core directly</button>
            </div>
            {call === 'ok' && <div className="feedback ok">✅ Correct layering. Scripts talk to business logic; business logic uses core libraries.</div>}
            {call === 'bad' && <div className="feedback no shake">⛔ Not allowed! "No direct calls should be made to the core libraries from test scripts."</div>}
            <div className="small muted">Layers = distinct borders of classes with similar purposes. Too many layers make the design complicated → <b>keep the number of TAF layers low</b>.</div>
          </div>
        </div>
      ) : (
        <svg viewBox="0 0 520 230" style={{ width: '100%', marginTop: 12 }}>
          <rect x="10" y="170" width="500" height="44" rx="12" fill="rgba(34,211,238,0.18)" stroke="#22d3ee" />
          <text x="260" y="197" textAnchor="middle" fill="var(--text)" fontWeight="700" fontSize="14">⚙️ Core libraries (shared, SUT-independent)</text>
          {[['TAF #1', 'App #1', 20, '#8b6cff'], ['TAF #2', 'App #2', 185, '#8b6cff'], ['TAF #3', 'App #3', 350, '#f72585']].map(([t, a, x, c]) => (
            <g key={t as string}>
              <rect x={x as number} y="60" width="150" height="90" rx="12" fill="var(--panel-2)" stroke={c as string} />
              <text x={(x as number) + 75} y="90" textAnchor="middle" fill="var(--text)" fontWeight="700" fontSize="14">{t}</text>
              <text x={(x as number) + 75} y="112" textAnchor="middle" fill="var(--muted)" fontSize="11">scripts + business logic</text>
              <text x={(x as number) + 75} y="132" textAnchor="middle" fill={c as string} fontSize="12">🎯 {a}</text>
              <line x1={(x as number) + 75} y1="150" x2={(x as number) + 75} y2="170" stroke={c as string} strokeWidth="2" />
            </g>
          ))}
          <rect x="12" y="20" width="320" height="26" rx="8" fill="rgba(139,108,255,0.15)" />
          <text x="172" y="38" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="700">Project #1 — TAE 1</text>
          <rect x="345" y="20" width="160" height="26" rx="8" fill="rgba(247,37,133,0.15)" />
          <text x="425" y="38" textAnchor="middle" fill="#f72585" fontSize="12" fontWeight="700">Project #2 — TAE 2</text>
        </svg>
      )}
    </div>
  );
}

/* ================= Approaches evolution ================= */
const APPROACHES = [
  { id: 'cp', icon: '⏺️', name: 'Capture / playback', c: '#fb7185',
    what: 'Record manual interactions with the SUT → generated scripts. No code exposed = no-code; code exposed = low-code.',
    pros: ['Initially easy to set up and use'],
    cons: ['Hard to maintain, scale and evolve', 'SUT must be available while capturing', 'Only for small scope & a rarely changing SUT', 'Capture depends highly on the SUT version recorded', 'Recording each test instead of reusing building blocks is time consuming'] },
  { id: 'lin', icon: '📜', name: 'Linear scripting', c: '#ff9f1c',
    what: 'Programming without custom test libraries made by a TAE. Can start from recorded scripts and modify them.',
    pros: ['Easy to set up and start writing scripts', 'Scripts easier to modify than capture/playback'],
    cons: ['Hard to maintain, scale and evolve', 'SUT must be available while capturing', 'Only for small scope & a rarely changing SUT', 'Some programming knowledge needed'] },
  { id: 'str', icon: '🧱', name: 'Structured scripting', c: '#ffb703',
    what: 'Introduces test LIBRARIES with reusable elements, test steps and/or user journeys.',
    pros: ['Easy to maintain, scale, port, adapt and evolve', 'Business logic separated from test scripts'],
    cons: ['Programming knowledge necessary', 'Initial investment in TAF development & testware is time consuming'] },
  { id: 'ddt', icon: '📊', name: 'Data-driven (DDT)', c: '#43c59e',
    what: 'Builds on structured scripting. Same script runs many times fed by data (.csv, .xlsx, DB dumps).',
    pros: ['Quick & easy test expansion through data feeds', 'Cost of adding new tests significantly reduced', 'Test analysts specify tests by filling data files — less dependency on technical test analysts'],
    cons: ['Proper test data management may be necessary'] },
  { id: 'kdt', icon: '🔑', name: 'Keyword-driven (KDT)', c: '#22d3ee',
    what: 'Tests = table of steps made of keywords (user perspective) + data. Often built upon DDT.',
    pros: ['Test analysts & business analysts can create automated tests', 'KDT can also be used for MANUAL testing (ISO/IEC/IEEE 29119-5)'],
    cons: ['Implementing & maintaining keywords is complex as scope grows', 'Huge effort for smaller systems'] },
  { id: 'tdd', icon: '🔴', name: 'Test-driven dev (TDD)', c: '#f72585',
    what: 'Dev methodology → automated tests as a result. Write a failing test (red), make it pass (green), refactor. Repeat.',
    pros: ['Simplifies component-level test development', 'Improves code quality & structure', 'Improves testability', 'Easier to reach desired code coverage', 'Reduces defect propagation to higher levels', 'Improves dev/business/tester communication', 'Stories not verified by GUI/API tests reach exit criteria quickly'],
    cons: ['Takes time to get accustomed to', 'Not following TDD properly → false confidence in code quality'] },
  { id: 'bdd', icon: '🗣️', name: 'Behavior-driven dev (BDD)', c: '#8b6cff',
    what: 'Acceptance criteria in natural language (Given / When / Then) stored in feature files; a BDD tool executes them.',
    pros: ['Improves dev/business/tester communication', 'Scenarios act as test cases → coverage of specifications', 'Usable for multiple test types across the test pyramid'],
    cons: ['Negative tests & edge cases still need defining (test analyst / TAE)', 'Teams confuse BDD with "just writing tests in natural language" and skip business & devs', 'Implementing & maintaining NL steps is complex', 'Overly complex steps → difficult, costly debugging'] },
];

export function ApproachLadder() {
  const [sel, setSel] = useState('cp');
  const a = APPROACHES.find((x) => x.id === sel)!;
  return (
    <div>
      <div className="row wrap" style={{ gap: 6 }}>
        {APPROACHES.slice(0, 5).map((x, i) => (
          <div key={x.id} className="row" style={{ gap: 6 }}>
            {i > 0 && <span className="faint" title={i === 3 ? 'builds on' : i === 4 ? 'often builds on' : 'evolves to'}>{i >= 3 ? '⇢' : '→'}</span>}
            <button className={`chip click ${sel === x.id ? 'on' : ''}`} style={sel === x.id ? { background: x.c } : undefined} onClick={() => setSel(x.id)}>{x.icon} {x.name}</button>
          </div>
        ))}
        {/* kept as one unit so the label never gets separated from its chips when the row wraps */}
        <div className="row wrap" style={{ gap: 6, marginLeft: 8, paddingLeft: 10, borderLeft: '1px solid var(--border-strong)' }}>
          <span className="tiny muted">dev methodologies →</span>
          {APPROACHES.slice(5).map((x) => (
            <button key={x.id} className={`chip click ${sel === x.id ? 'on' : ''}`} style={sel === x.id ? { background: x.c } : undefined} onClick={() => setSel(x.id)}>{x.icon} {x.name}</button>
          ))}
        </div>
      </div>
      <div className="detail" style={{ ['--c' as string]: a.c }}>
        <h4 style={{ fontSize: 18 }}>{a.icon} {a.name}</h4>
        <div className="muted"><Secret>{a.what}</Secret></div>
        <div className="grid g2 mt">
          <div><b className="pro">✚ Pros</b><ul>{a.pros.map((p) => <Secret as="li" key={p}>{p}</Secret>)}</ul></div>
          <div><b className="con">✖ Cons</b><ul>{a.cons.map((p) => <Secret as="li" key={p}>{p}</Secret>)}</ul></div>
        </div>
        {sel === 'tdd' && (
          <div className="row mt" style={{ justifyContent: 'center', gap: 14, fontFamily: 'var(--display)', fontWeight: 700 }}>
            <span style={{ color: '#fb7185' }}>🔴 RED: failing test</span>→<span style={{ color: '#34d399' }}>🟢 GREEN: make it pass</span>→<span style={{ color: '#22d3ee' }}>🔵 REFACTOR: clean code</span>↺
          </div>
        )}
        {sel === 'bdd' && (
          <pre style={{ background: 'var(--panel-solid)', padding: 14, borderRadius: 12, fontSize: 13, overflowX: 'auto' }}>
{`Feature: Checkout
  Scenario: Registered user pays by card
    Given a logged-in customer with 2 items in the cart
    When they pay with a valid card
    Then the order is confirmed`}
          </pre>
        )}
        {sel === 'kdt' && (
          <table className="cmp mt"><thead><tr><th>Keyword</th><th>Arg 1</th><th>Arg 2</th></tr></thead>
            <tbody><tr><td>Open App</td><td>shop.test</td><td /></tr><tr><td>Login</td><td>alice</td><td>●●●●</td></tr><tr><td>Add To Cart</td><td>SKU-42</td><td>2</td></tr><tr><td>Verify Total</td><td>€84.00</td><td /></tr></tbody></table>
        )}
        {sel === 'ddt' && (
          <table className="cmp mt"><thead><tr><th>user</th><th>password</th><th>expected</th></tr></thead>
            <tbody><tr><td>alice</td><td>ok123</td><td>✅ dashboard</td></tr><tr><td>bob</td><td>wrong</td><td>❌ error msg</td></tr><tr><td>""</td><td>""</td><td>❌ required</td></tr></tbody></table>
        )}
      </div>
    </div>
  );
}

/* ================= Design patterns simulator ================= */
export function PatternSim() {
  const [mode, setMode] = useState<'none' | 'pom' | 'flow'>('none');
  const [changed, setChanged] = useState(false);
  const tests = Array.from({ length: 12 }, (_, i) => `test_${i + 1}`);
  const edits = !changed ? 0 : mode === 'none' ? 12 : 1;
  return (
    <div>
      <div className="row wrap">
        <Tabs value={mode} onChange={(m) => { setMode(m); setChanged(false); }} tabs={[{ id: 'none', label: '🍝 No pattern' }, { id: 'pom', label: '📄 Page Object Model' }, { id: 'flow', label: '🌊 Flow Model' }]} />
        <button className="btn hot sm" onClick={() => setChanged(true)}>💥 Dev renamed the login button ID!</button>
      </div>
      <div className="grid g2 mt" style={{ alignItems: 'start' }}>
        <div>
          <div className="kicker">Test scripts</div>
          <div className="row wrap mt" style={{ gap: 6 }}>
            {tests.map((t) => (
              <span key={t} className="token" style={{ cursor: 'default', borderColor: changed && mode === 'none' ? 'var(--bad)' : undefined, background: changed && mode === 'none' ? 'rgba(251,113,133,.2)' : undefined }}>
                {t}{mode === 'none' && <span className="faint tiny"> #loginBtn</span>}
              </span>
            ))}
          </div>
          {mode === 'flow' && (
            <div className="mt">
              <div className="kicker">Flow models (user actions — facade #2)</div>
              <div className="row wrap mt" style={{ gap: 6 }}>
                {['LoginFlow.loginAs()', 'CheckoutFlow.pay()', 'AccountFlow.setAddress()'].map((f) => <span key={f} className="token" style={{ cursor: 'default', borderColor: '#2ec4b6' }}>🌊 {f}</span>)}
              </div>
            </div>
          )}
          {mode !== 'none' && (
            <div className="mt">
              <div className="kicker">Page models (locators — facade #1)</div>
              <div className="row wrap mt" style={{ gap: 6 }}>
                {['LoginPage', 'CartPage', 'AccountPage'].map((p) => (
                  <span key={p} className="token" style={{ cursor: 'default', borderColor: changed && p === 'LoginPage' ? 'var(--bad)' : '#8b6cff', background: changed && p === 'LoginPage' ? 'rgba(251,113,133,.2)' : undefined }}>
                    📄 {p}{p === 'LoginPage' && <span className="faint tiny"> #loginBtn</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="card flat" style={{ textAlign: 'center' }}>
          <div className="kicker">Places to edit</div>
          <div className="stat-big" style={{ color: edits > 1 ? 'var(--bad)' : edits === 1 ? 'var(--good)' : undefined }}>{changed ? edits : '—'}</div>
          <div className="small muted">
            {mode === 'none' && 'Locators copy-pasted in every test → every test breaks.'}
            {mode === 'pom' && 'Locator lives in ONE place: the page model.'}
            {mode === 'flow' && 'Double facade: pages hold locators, flows hold reusable user actions. Best when the SUT structure/UI changes frequently.'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Log levels ================= */
const LEVELS = [
  { n: 'FATAL', c: '#ff2d55', d: 'Error events that may ABORT the test execution', ex: 'Browser driver crashed — aborting suite' },
  { n: 'ERROR', c: '#fb7185', d: 'A condition/interaction fails → the TEST CASE FAILS', ex: 'Expected "Paid" but got "Pending"' },
  { n: 'WARN', c: '#fbbf24', d: 'Unexpected condition, but the test FLOW is not broken', ex: 'Cookie banner appeared unexpectedly — dismissed' },
  { n: 'INFO', c: '#22d3ee', d: 'BASIC info about the test case and what happens', ex: 'Starting test: checkout_with_card' },
  { n: 'DEBUG', c: '#a78bfa', d: 'Execution-specific details useful when INVESTIGATING a failure', ex: 'POST /api/cart → 201 in 84ms' },
  { n: 'TRACE', c: '#94a3b8', d: 'Like DEBUG but with EVEN MORE information', ex: 'Locator #pay resolved after 3 polls, DOM snapshot saved' },
];
export function LogLevels() {
  const [th, setTh] = useState(3);
  return (
    <div className="grid g2" style={{ alignItems: 'start' }}>
      <div>
        <div className="kicker mb">Most severe ⬆ — least severe ⬇</div>
        {LEVELS.map((l, i) => (
          <div key={l.n} onClick={() => setTh(i)} className="row" style={{ cursor: 'pointer', padding: '8px 12px', marginBottom: 6, borderRadius: 12, background: i <= th ? `${l.c}22` : 'var(--panel-2)', border: `1px solid ${i === th ? l.c : 'var(--border)'}`, transition: 'all .2s' }}>
            <b style={{ color: l.c, width: 64, fontFamily: 'var(--mono)' }}>{l.n}</b>
            <span className="small"><Secret>{l.d}</Secret></span>
          </div>
        ))}
        <div className="tiny muted">Click a level to set the log threshold →</div>
      </div>
      <div>
        <div className="kicker mb">Console at threshold: <span style={{ color: LEVELS[th].c }}>{LEVELS[th].n}</span></div>
        <div style={{ background: '#05060d', borderRadius: 14, padding: 14, fontFamily: 'var(--mono)', fontSize: 12.5, minHeight: 230, border: '1px solid var(--border)' }}>
          {LEVELS.slice(0, th + 1).map((l) => (
            <div key={l.n} style={{ color: l.c, animation: 'sceneIn .3s' }}>[{l.n.padEnd(5)}] {l.ex}</div>
          ))}
        </div>
        <div className="small muted mt">"All of them are useful in test automation for various reasons."</div>
      </div>
    </div>
  );
}
