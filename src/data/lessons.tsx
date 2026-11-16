import type { ReactNode } from 'react';
import type { ChapterId } from '../types';
import { Flow, Stack, Hub, FlipGrid, Versus } from '../components/SceneKit';
import { ScaleBalance, SdlcModels, ToolMatrix } from '../diagrams/Ch12';
import { GtaaDiagram, TafLayers, ApproachLadder, PatternSim, LogLevels } from '../diagrams/Ch34';
import { PipelineViz, ContractHandshake, TraceId } from '../diagrams/Ch56';
import { StaticScan, Histogram, SelfHealing, SchemaValidation, WaitRace } from '../diagrams/Ch78';
import { SCENES_PER_CH, TOTAL_SCENES } from '../lib/store';

export interface Check { q: string; options: string[]; answer: number; why: string }
export interface Scene {
  chapter: ChapterId;
  title: string;
  icon: string;
  lo: string;
  ref: string;
  story: ReactNode;
  visual: () => ReactNode;
  hook?: ReactNode;
  trap?: ReactNode;
  check: Check;
}

const C = { 1: '#8b6cff', 2: '#22d3ee', 3: '#ff7a59', 4: '#f72585', 5: '#2ec4b6', 6: '#ffb703', 7: '#43c59e', 8: '#a3e635' } as const;

export const lessons: Scene[] = [
  /* ============================ CHAPTER 1 ============================ */
  {
    chapter: 1, title: 'What test automation actually is', icon: '⚙️', lo: 'TAE-1.1.1', ref: '1.1.1',
    story: <>Forget "robots clicking buttons". The syllabus defines test automation (including automated <b>execution</b> and <b>reporting</b>) as one or more of three gears turning together. It covers SUTs with a UI, without a UI, mobile apps, network protocols and connections.</>,
    visual: () => <Flow color={C[1]} items={[
      { icon: '🛠️', title: 'Control & set up', sub: 'purpose-built tools', note: 'Using purpose-built software tools to control and set up test suites for test execution.' },
      { icon: '▶️', title: 'Execute', sub: 'automatically', note: 'Executing tests in an automated way.' },
      { icon: '⚖️', title: 'Compare', sub: 'actual vs expected', note: 'Comparing actual results to expected results (the automated test oracle).' },
    ]} />,
    hook: <>⚙️⚙️⚙️ Three gears: <b>SET UP → RUN → COMPARE</b>.</>,
    check: { q: 'Which is NOT one of the activities in the syllabus definition of test automation?', options: ['Using tools to control and set up test suites', 'Executing tests in an automated way', 'Comparing actual and expected results', 'Writing the requirements for the SUT'], answer: 3, why: 'The three activities are set up/control, execute, compare.' },
  },
  {
    chapter: 1, title: 'The balance scale: pros, cons & the glass ceiling', icon: '⚖️', lo: 'TAE-1.1.1', ref: '1.1.1',
    story: <>Picture a scale. On the left: <b>9 advantages</b> (speed, more tests, consistency…). On the right: <b>6 disadvantages</b> (cost, investment, maintenance…). Above it all, a <b>glass ceiling of 4 limitations</b> no amount of money removes. Click the pans and the ceiling.</>,
    visual: () => <ScaleBalance />,
    hook: <>Limitations all start with <b>"Only…"</b> or <b>"Not all…"</b>: not all tests, only what's programmed, only machine-readable, only oracle-verifiable.</>,
    trap: <>Disadvantages are things you can <i>pay/plan</i> for (cost, time, objectives, rigidity, new defects). Limitations are <i>hard walls</i>. The exam loves asking "which is a LIMITATION?".</>,
    check: { q: '"Test automation can introduce additional defects" is a…', options: ['Limitation', 'Disadvantage', 'Advantage', 'Not in the syllabus'], answer: 1, why: 'It is listed under potential disadvantages.' },
  },
  {
    chapter: 1, title: 'Automation across SDLC models', icon: '🗺️', lo: 'TAE-1.2.1', ref: '1.2.1',
    story: <>Each lifecycle shapes <i>when</i> automation is built and run. Waterfall waits; the V-model mirrors each spec with a test level (and a TAF per level); Agile lets automation live inside the sprint.</>,
    visual: () => <SdlcModels />,
    hook: <>🪜 Waterfall = <b>run late</b> (verification). ✌️ V = <b>a TAF per level</b>. 🔄 Agile = <b>in-sprint automation</b> by killing silos.</>,
    trap: <>In Agile, automated <b>component</b> tests outnumber automated acceptance tests (test pyramid) — the official sample exam relies on this.</>,
    check: { q: 'In the V-model, what does the syllabus say about test automation frameworks?', options: ['Only one TAF for system testing is allowed', 'A TAF for each test level is possible and recommended', 'TAFs are built only after acceptance testing', 'TAFs are not used in the V-model'], answer: 1, why: '"Providing a TAF for each test level is possible and recommended."' },
  },
  {
    chapter: 1, title: 'Choosing tools for a given SUT', icon: '🧰', lo: 'TAE-1.2.2', ref: '1.2.2',
    story: <>Tool choice is a three-step compass. <b>First analyze the SUT</b> to get the requirements baseline (UI vs web services need different features). <b>Then look at the team</b>. <b>Always weigh cost</b>: commercial off-the-shelf vs custom open-source.</>,
    visual: () => <Flow color={C[1]} items={[
      { icon: '🔬', title: 'Analyze the SUT', sub: 'requirements = baseline', points: ['Identify project requirements as the baseline for tool selection', 'UI software vs web services need different tool features', 'Understand what the project wants to achieve over time'] },
      { icon: '👥', title: 'Team skills', sub: 'composition & experience', points: ['Little/no programming experience → low-code or no-code may be viable', 'Technical testers → choose a tool whose LANGUAGE MATCHES THE SUT', 'Benefit: debug automation defects with devs + cross-training between teams'] },
      { icon: '💰', title: 'Costs', sub: 'always considered', points: ['No limit to number of tools/features — but costs must always be considered', 'COTS tool vs custom solution on open source — can be complex'] },
    ]} />,
    hook: <>🧭 <b>S-T-C</b>: <b>S</b>UT first, <b>T</b>eam second, <b>C</b>ost always.</>,
    trap: <>"Quality of the SUT requirements" is NOT a tool selection factor (official Q3).</>,
    check: { q: 'Your testers are strong programmers. What extra benefit comes from a tool in the same language as the SUT?', options: ['Licenses become free', 'Easier debugging with developers and cross-training between teams', 'No need for test data', 'It removes the need for a TAF'], answer: 1, why: 'Matching languages lets TAEs debug automation defects with developers and cross-train.' },
  },

  /* ============================ CHAPTER 2 ============================ */
  {
    chapter: 2, title: 'Testability: the Eye, the Joystick & the Glass box', icon: '👁️', lo: 'TAE-2.1.1', ref: '2.1.1',
    story: <>Testability is a <b>non-functional requirement</b>, designed <b>in parallel</b> with the other SUT features, usually by a <b>software architect</b> with a TAE pointing at improvement areas. It has three faces.</>,
    visual: () => <Hub color={C[2]} center={{ icon: '🧪', title: 'Testability', points: ['Designed & implemented in parallel with other features', 'Generally done by a software architect (non-functional requirement)', 'TAE involved to identify specific improvement areas'] }} items={[
      { icon: '👁️', title: 'Observability', sub: 'insight OUT', color: '#22d3ee', note: 'The SUT provides interfaces that give insight into it, so tests can check actual results = expected results.' },
      { icon: '🕹️', title: 'Controllability', sub: 'actions IN', color: '#8b6cff', note: 'Interfaces to PERFORM ACTIONS on the SUT: UI elements, function calls, communication (TCP/IP, USB), electronic signals for physical/logical switches.' },
      { icon: '🔍', title: 'Architecture transparency', sub: 'clear docs', color: '#ffb703', note: 'Architecture documentation gives clear, understandable components and interfaces → observability & controllability at ALL test levels.' },
    ]} />,
    hook: <>👁️ <b>Observe</b> = read OUT. 🕹️ <b>Control</b> = push IN. 🔍 <b>Transparency</b> = see the map.</>,
    trap: <>"TAF can access interfaces to perform actions" = <b>Controllability</b>, not observability.</>,
    check: { q: 'A TAF reads application state through a diagnostic endpoint to verify results. Which testability aspect is this?', options: ['Controllability', 'Observability', 'Architecture transparency', 'Interoperability'], answer: 1, why: 'Getting insight out of the SUT to compare with expected results = observability.' },
  },
  {
    chapter: 2, title: 'Configuration enablers for testability', icon: '🔧', lo: 'TAE-2.1.1', ref: '2.1.1',
    story: <>Three practical knobs make an SUT easier to automate. Flip each card and say what it does before you look.</>,
    visual: () => <FlipGrid color={C[2]} items={[
      { icon: '🏷️', title: 'Accessibility identifiers', note: 'Stable IDs for elements — generated automatically by development frameworks or set manually by developers.' },
      { icon: '🌍', title: 'System environment variables', note: 'Certain application parameters can be changed to enable easier testing through administration.' },
      { icon: '🚀', title: 'Deployment variables', note: 'Similar to system variables, but can be set BEFORE starting deployment.' },
    ]} />,
    hook: <>🏷️ IDs to <b>find</b> things · 🌍 env vars to <b>tweak</b> at runtime · 🚀 deploy vars to <b>tweak before</b> deploying.</>,
    check: { q: 'Which enabler can be set before deployment starts?', options: ['Accessibility identifiers', 'System environment variables', 'Deployment variables', 'Locators'], answer: 2, why: 'Deployment variables are like system variables but set before starting deployment.' },
  },
  {
    chapter: 2, title: 'The environment journey', icon: '🛤️', lo: 'TAE-2.1.2', ref: '2.1.2',
    story: <>Ride the train from a developer's laptop to production. Watch two switches: <b>white-box testing stops</b> after build, and <b>monitoring starts</b> at integration. Environments can be built from containers, virtualization and other approaches.</>,
    visual: () => <Flow color={C[2]} items={[
      { icon: '💻', title: 'Local dev', sub: 'white-box ✓', points: ['Software created; components tested to verify functional suitability', 'Component, GUI and API testing', 'IDE enables white-box testing → find poor coding early'] },
      { icon: '🏗️', title: 'Build', sub: 'low-level + static', points: ['Builds the software and checks the resulting build (DevOps)', 'Local machine OR a CI/CD agent', 'Component & component integration tests + static analysis', 'No deployment to other environments'] },
      { icon: '🔗', title: 'Integration', sub: 'first full suite 📡', points: ['Release candidate fully integrated with other systems', 'FULLY automated UI or API suite executed', 'Black-box only (system integration / acceptance)', 'FIRST environment with MONITORING'] },
      { icon: '🎭', title: 'Preproduction', sub: 'like prod 📡', points: ['Mostly non-functional (e.g., performance efficiency)', 'Resembles production as closely as possible', 'UAT by business stakeholders; can rerun existing suite', 'Monitored'] },
      { icon: '🌍', title: 'Production', sub: 'real users 📡', points: ['Functional & non-functional in real time with real users', 'Monitoring + practices: canary release, blue/green deployment, A/B testing'] },
    ]} />,
    hook: <>💻→🏗️→🔗→🎭→🌍 "<b>L</b>azy <b>B</b>ears <b>I</b>nvade <b>P</b>icnic <b>P</b>arks". Monitoring 📡 switches on at <b>I</b>ntegration.</>,
    trap: <>Fully automated suite against a release candidate for the first time = <b>Integration</b>. Performance + UAT = <b>Preproduction</b>.</>,
    check: { q: 'Where should monitoring FIRST be present?', options: ['Local development', 'Build', 'Integration', 'Production only'], answer: 2, why: '"This is the first environment where monitoring should be present."' },
  },
  {
    chapter: 2, title: 'Analyzing the SUT → TAS requirements', icon: '🔬', lo: 'TAE-2.2.1', ref: '2.2.1',
    story: <>Every SUT is different (web service, mobile, web…). Gather requirements <b>with other stakeholders</b> (manual testers, business, BAs) to surface as many risks & mitigations as possible. Eight questions shape the approach and architecture.</>,
    visual: () => <FlipGrid color={C[2]} min={170} items={[
      { icon: '🔄', title: 'Which test process activities?', note: 'e.g., test management, test design, test generation, test execution.' },
      { icon: '📶', title: 'Which test levels?', note: 'Component, integration, system, acceptance…' },
      { icon: '🧪', title: 'Which test types?', note: 'Functional, performance, security…' },
      { icon: '🧑‍💻', title: 'Which roles & skill sets?', note: 'Who will write/run the automation (developers, test analysts, TAEs…)?' },
      { icon: '📦', title: 'Which products / lines / families?', note: 'Defines the span and lifetime of the TAS.' },
      { icon: '🔌', title: 'Which kinds of SUT?', note: 'Which SUTs must be compatible with the TAS.' },
      { icon: '🗃️', title: 'Test data', note: 'Availability of test data and its quality.' },
      { icon: '🎭', title: 'Unreachable cases', note: 'Ways to emulate them, e.g. 3rd-party applications involved.' },
    ]} />,
    hook: <>Ask like a journalist: <b>WHAT</b> activities, levels, types · <b>WHO</b> roles · <b>WHICH</b> products & SUTs · <b>WITH WHAT</b> data & emulation.</>,
    trap: <>K4 scenario tip: only pick requirements that belong to <b>your</b> organization's scope (e.g., in official Q7, multi-car testing belongs to the integrator, not you).</>,
    check: { q: 'Which is a requirement consideration for a test automation approach?', options: ['The marketing budget of the product', 'Which test roles and skill sets should be supported', 'The number of developers on vacation', 'The color scheme of the GUI'], answer: 1, why: 'Roles and skill sets is one of the eight listed considerations.' },
  },
  {
    chapter: 2, title: 'Tool evaluation: the comparison table', icon: '📋', lo: 'TAE-2.2.2', ref: '2.2.2',
    story: <>After collecting requirements, capture findings in a <b>comparison table</b>: <b>tools in columns, requirements in rows</b>, cells show each tool's properties and priorities. Change priorities and watch the winner change. Then present the proposal to stakeholders for <b>approval</b>.</>,
    visual: () => <ToolMatrix />,
    hook: <>📋 <b>Columns = Contenders</b>, <b>Rows = Requirements</b>.</>,
    trap: <>If a tool fails a key requirement in the PoC (e.g., far too slow), recommend <b>not selecting it</b> — never migrate the SUT or disable logging to make a tool fit.</>,
    check: { q: 'In the tool comparison table, what goes in the rows?', options: ['Tools', 'Requirements', 'Test cases', 'Stakeholders'], answer: 1, why: 'Tools in columns, requirements in rows.' },
  },

  /* ============================ CHAPTER 3 ============================ */
  {
    chapter: 3, title: 'gTAA: capabilities & interfaces', icon: '🏛️', lo: 'TAE-3.1.1', ref: '3.1.1',
    story: <>The <b>generic Test Automation Architecture</b> is a high-level, abstract view of how test automation communicates with the SUT, project management, test management and configuration management — and the <b>capabilities</b> you must cover when designing a TAA. Click every box.</>,
    visual: () => <GtaaDiagram />,
    hook: <>Capabilities top-down: <b>G-D-E-A</b> — "<b>G</b>ood <b>D</b>esign <b>E</b>nables <b>A</b>utomation". Only <b>G</b>eneration is optional.</>,
    trap: <>Test <b>logging & reporting</b> belong to <b>Execution</b>. Adaptors to APIs/protocols/services = <b>Adaptation</b>. Test management interface = <b>mapping</b> test definitions ↔ automated tests.</>,
    check: { q: 'Which gTAA capability is optional?', options: ['Test definition', 'Test execution', 'Test generation', 'Test adaptation'], answer: 2, why: '"Test generation is an optional capability."' },
  },
  {
    chapter: 3, title: 'Designing a TAS', icon: '📐', lo: 'TAE-3.1.2', ref: '3.1.2',
    story: <>A <b>TAS</b> comes from understanding the SUT's functional, non-functional and technical requirements plus the tools needed. It's built with commercial or open-source tools and <b>may need SUT-specific adaptors</b>. The <b>TAA</b> is its technical design and must address five things.</>,
    visual: () => <Stack color={C[3]} items={[
      { icon: '🧰', title: 'Select tools & tool-specific libraries', note: 'Selecting test automation tools and tool specific libraries.' },
      { icon: '🧩', title: 'Develop plugins / components', note: 'Developing plugins and/or components.' },
      { icon: '🔥', title: 'Connectivity & interfaces', points: ['Firewalls', 'Databases', 'URLs / connections', 'Mocks / stubs', 'Message queues', 'Protocols'] },
      { icon: '🗂️', title: 'Connect test & defect management tools', note: 'Connecting to the test management and defect management tools.' },
      { icon: '🌿', title: 'Version control & repositories', note: 'Utilizing a version control system and repositories.' },
    ]} />,
    hook: <>TAA checklist = "<b>T</b>ools, <b>P</b>lugins, <b>C</b>onnections, <b>M</b>anagement tools, <b>V</b>ersion control" → "<b>T</b>ests <b>P</b>ass <b>C</b>ause <b>M</b>aintainers <b>V</b>erify".</>,
    trap: <>Test results can't be translated back from SUT output? → missing <b>SUT-specific adaptors</b> (official Q10).</>,
    check: { q: 'Which is NOT something the TAA should address?', options: ['Selecting tools and libraries', 'Connectivity requirements like firewalls and mocks', 'Connecting to test and defect management tools', 'Defining the product marketing roadmap'], answer: 3, why: 'The five TAA concerns are tools, plugins, connectivity, management tools, version control.' },
  },
  {
    chapter: 3, title: 'TAF layering', icon: '🥞', lo: 'TAE-3.1.3', ref: '3.1.3',
    story: <>The <b>TAF</b> is the foundation of a TAS: test harness (aka <b>test runner</b>), test libraries, scripts and suites. It's organized in layers. The golden rule: <b>scripts never call core libraries directly</b>. Try it, then see how core libraries scale across teams.</>,
    visual: () => <TafLayers />,
    hook: <>🥞 Pancake stack: <b>Scripts</b> (what to test) on <b>Business logic</b> (knows the app) on <b>Core</b> (knows nothing about the app).</>,
    trap: <>New app, reuse framework → configure the connection to the new app in the <b>business logic</b> layer (official Q11).</>,
    check: { q: 'Where do SUT-independent, reusable libraries belong?', options: ['Test scripts layer', 'Business logic layer', 'Core libraries layer', 'Feature files'], answer: 2, why: 'Core libraries = independent of any SUT, reusable across projects with the same stack.' },
  },
  {
    chapter: 3, title: 'Approaches for automating test cases', icon: '🪜', lo: 'TAE-3.1.4', ref: '3.1.4',
    story: <>Climb the ladder from "just record it" to libraries, data and keywords — plus two dev methodologies (TDD, BDD) that <i>produce</i> automated tests if followed correctly. Click each step; in recall mode guess the pros/cons first.</>,
    visual: () => <ApproachLadder />,
    hook: <>⏺️ Record → 📜 Edit → 🧱 Reuse → 📊 Feed data → 🔑 Speak keywords. <b>DDT builds on structured</b>, <b>KDT often builds on DDT</b>.</>,
    trap: <>Short timescale + record manual tests directly = <b>capture/playback</b>. Huge existing test data with many variations = <b>DDT</b>. BDD requires business involvement.</>,
    check: { q: 'Testers already have 10–20 data variations per scenario and you need results quickly. Best approach?', options: ['Capture/playback', 'Data-driven testing', 'Linear scripting', 'Behavior-driven development'], answer: 1, why: 'DDT allows quick expansion through data feeds using existing data.' },
  },
  {
    chapter: 3, title: 'Design principles: OOP & SOLID', icon: '🧬', lo: 'TAE-3.1.5', ref: '3.1.5',
    story: <>Test automation <b>is</b> software development — so design principles matter as much for a TAE as for a developer. Flip the cards.</>,
    visual: () => <FlipGrid color={C[3]} min={140} items={[
      { icon: '💊', title: 'Encapsulation', sub: 'OOP', note: 'Bundle data + behavior, hide internals.' },
      { icon: '🌫️', title: 'Abstraction', sub: 'OOP', note: 'Expose only what matters, hide complexity.' },
      { icon: '🧬', title: 'Inheritance', sub: 'OOP', note: 'Business-logic classes can inherit core library classes.' },
      { icon: '🎭', title: 'Polymorphism', sub: 'OOP', note: 'One interface, many implementations.' },
      { icon: 'S', title: 'Single responsibility', sub: 'SOLID', note: 'A class has one reason to change.' },
      { icon: 'O', title: 'Open-closed', sub: 'SOLID', note: 'Open for extension, closed for modification.' },
      { icon: 'L', title: 'Liskov substitution', sub: 'SOLID', note: 'Subtypes must be usable in place of their base types.' },
      { icon: 'I', title: 'Interface segregation', sub: 'SOLID', note: 'The syllabus literally writes "interface substitution" — standard name: interface segregation (small, specific interfaces).' },
      { icon: 'D', title: 'Dependency inversion', sub: 'SOLID', note: 'Depend on abstractions, not concrete classes.' },
    ]} />,
    hook: <>OOP = "<b>A PIE</b>": Abstraction, Polymorphism, Inheritance, Encapsulation. SOLID improves <b>readability, maintainability, scalability</b>.</>,
    check: { q: 'According to the syllabus, SOLID principles improve…', options: ['Execution speed and parallelism', 'Readability, maintainability and scalability', 'Security and compliance', 'Test coverage'], answer: 1, why: '"These principles improve code readability, maintainability, and scalability."' },
  },
  {
    chapter: 3, title: 'Design patterns that save you', icon: '🧩', lo: 'TAE-3.1.5', ref: '3.1.5',
    story: <>Three patterns matter most to a TAE: <b>facade</b> (hide details, expose what testers need), <b>singleton</b> (exactly one driver talking to the SUT) and <b>page object model</b>. The <b>flow model</b> adds a second facade of user actions on top of page objects. Press the 💥 button in each mode.</>,
    visual: () => <PatternSim />,
    hook: <>🏠 <b>Facade</b> = a nice house front hiding the plumbing. ☝️ <b>Singleton</b> = one driver. 📄 <b>Page</b> = WHERE things are. 🌊 <b>Flow</b> = WHAT users do.</>,
    trap: <>Frequently changing GUI + reusable user flows → <b>flow model</b>: elements in page models, user actions in flow models (official Q14).</>,
    check: { q: 'Which pattern ensures only one driver communicates with the SUT?', options: ['Facade', 'Singleton', 'Page object model', 'Flow model'], answer: 1, why: 'The singleton pattern is often used to make sure there is only one driver.' },
  },

  /* ============================ CHAPTER 4 ============================ */
  {
    chapter: 4, title: 'Launching a pilot', icon: '🚀', lo: 'TAE-4.1.1', ref: '4.1.1',
    story: <>A pilot is short but can steer the whole project. <b>Define the scope of validation</b>, evaluate technical choices, build several prototypes to compare, set timelines with periodic check-ins, and <b>integrate into CI/CD early</b>. Don't forget the non-technical checks. At the end, <b>TAEs + test managers</b> assess success/failure and decide.</>,
    visual: () => <Versus cols={[
      { icon: '🔧', title: 'Technical evaluation', color: C[4], points: ['Programming language(s)', 'Suitable COTS / open-source tools', 'Test levels to cover', 'Test cases selected', 'Test case development approach'] },
      { icon: '🧑‍🤝‍🧑', title: 'Non-technical evaluation', color: '#ffb703', points: ['Knowledge & experience of team members', 'Team structure', 'Licensing & organization rules', 'Type of planned testing & targeted test levels'] },
      { icon: '🗓️', title: 'Run it well', color: '#22d3ee', points: ['Several prototypes → show pros/cons → choose a path', 'Define timelines; check progress periodically → spot & mitigate risks', 'Integrate into CI/CD during the pilot → expose issues early', 'As tests grow, change CI/CD to run them differently / at different times', 'End: TAEs + test managers evaluate & decide'] },
    ]} />,
    hook: <>🚀 Pilot = "<b>Prototype, Pace, Pipeline</b>" — several prototypes, periodic checks, CI/CD early.</>,
    trap: <>Valid pilot objectives: evaluate licensing/org rules, select COTS/open-source tools. NOT: document the SUT, define production monitoring (official Q15).</>,
    check: { q: 'Who should evaluate the pilot once it is complete?', options: ['Only developers', 'TAEs and test managers', 'Business analysts only', 'The tool vendor'], answer: 1, why: '"The effort should be evaluated by TAEs and test managers."' },
  },
  {
    chapter: 4, title: 'Deployment risks & mitigations', icon: '⚠️', lo: 'TAE-4.2.1', ref: '4.2.1',
    story: <>The TAF↔SUT interface is part of the architecture; then pick packaging, logging and harness tools. Two families of risk surface in a pilot. Example: real mobile devices must be on, charged, networked and able to reach the SUT.</>,
    visual: () => <Versus cols={[
      { icon: '🌐', title: 'Environment / infra risks', color: '#ffb703', points: ['Firewall openings', 'Resource utilization (CPU, RAM)', 'Network connection & reliability'], foot: 'Not strictly test automation — but TAEs must ensure conditions for reliable quality gates.' },
      { icon: '📦', title: 'Packaging', color: C[4], points: ['Version control testware like the SUT', 'Upload to a repository to share (on-prem or cloud)'] },
      { icon: '📝', title: 'Logging', color: '#22d3ee', points: ['Gives most info about results', 'Levels: Fatal, Error, Warn, Info, Debug, Trace'] },
      { icon: '🏗️', title: 'Test structuring', color: '#8b6cff', points: ['Harness + test FIXTURES = most important part of TAS', 'Control environment & data, pre/postconditions, group into suites', 'Fixtures → repeatable & atomic tests'] },
      { icon: '🔄', title: 'Updating', color: '#43c59e', points: ['Automatic updates on harnesses (agents) & device version changes', 'Mitigate: adequate power, proper network, device configuration plans'] },
    ]} />,
    hook: <>Technical risks = "<b>PLTU</b>" → "<b>P</b>lease <b>L</b>og <b>T</b>he <b>U</b>pdates": Packaging, Logging, Test structuring, Updating.</>,
    trap: <>"Only the full suite can be run" → harness & fixtures. "Tests not triggered by build" → CI/CD integration. "Hard to troubleshoot" → detailed logging (official Q16).</>,
    check: { q: 'Automatic agent updates break your device lab overnight. Which technical risk category is this?', options: ['Packaging', 'Logging', 'Test structuring', 'Updating'], answer: 3, why: 'Automatic updates on harnesses/agents and device version changes = Updating.' },
  },
  {
    chapter: 4, title: 'Log levels', icon: '📶', lo: 'TAE-4.2.1', ref: '4.2.1',
    story: <>Six logging levels, from "the test run is dying" to "every tiny detail". Slide the threshold and watch the console fill up.</>,
    visual: () => <LogLevels />,
    hook: <>"<b>F</b>at <b>E</b>lephants <b>W</b>ear <b>I</b>tchy <b>D</b>otted <b>T</b>ies" = Fatal, Error, Warn, Info, Debug, Trace.</>,
    trap: <>ERROR fails the <b>test case</b>; FATAL may <b>abort the execution</b>; WARN = unexpected but the flow continues.</>,
    check: { q: 'A cookie banner unexpectedly appears but the test continues. Which level?', options: ['Fatal', 'Error', 'Warn', 'Trace'], answer: 2, why: 'Warn = unexpected condition that does not break the test flow.' },
  },
  {
    chapter: 4, title: 'Maintainable automation code', icon: '🧹', lo: 'TAE-4.3.1', ref: '4.3.1',
    story: <>Maintainability is shaped by <b>programming standards</b> and TAEs' expectations of each other. The golden rule: Robert C. Martin's <b>clean code</b>. Flip each card.</>,
    visual: () => <FlipGrid color={C[4]} min={150} items={[
      { icon: '🏷️', title: 'Common naming', note: 'Meaningful names via a common convention: loginButton, resetPasswordButton.' },
      { icon: '🗂️', title: 'Logical structure', note: 'A logical and common project structure.' },
      { icon: '🚫', title: 'No hardcoding', note: 'Use data-driven testing for data; constants for rarely changing values. Hardcoding saves dev time but costs maintenance.' },
      { icon: '🎚️', title: 'Few parameters', note: 'Avoid too many input parameters for methods.' },
      { icon: '✂️', title: 'Short methods', note: 'Avoid long and complex methods.' },
      { icon: '📝', title: 'Use logging', note: 'Logging is a clean code principle here.' },
      { icon: '🧩', title: 'Design patterns', note: 'Use them where beneficial and required (see 3.1.5).' },
      { icon: '🧪', title: 'Focus on testability', note: 'Design code that is easy to test.' },
      { icon: '🔍', title: 'Static analyzers & formatters', note: 'Static analyzers ensure high-quality automation code; IDE code formatters improve readability.' },
      { icon: '🌿', title: 'Branching strategy', note: 'Agreed branching: feature, release and defect-fix branches.' },
    ]} />,
    hook: <>🧹 Clean code = <b>N</b>ames, <b>S</b>tructure, <b>H</b>ardcode-free, <b>P</b>arams few, <b>S</b>hort, <b>L</b>ogs, <b>P</b>atterns, <b>T</b>estable.</>,
    trap: <>"Let developers uniquely name variables" ✖ (use a COMMON convention). "Generic functions with all the parameters" ✖ (avoid many params).</>,
    check: { q: 'Which practice best reduces maintenance of test automation code?', options: ['Hardcode values for readability', 'Apply design patterns', 'Keep code out of version control', 'Rewrite scripts from scratch regularly'], answer: 1, why: 'Design patterns structure code for reuse and maintainability.' },
  },

  /* ============================ CHAPTER 5 ============================ */
  {
    chapter: 5, title: 'Test levels inside pipelines', icon: '🔁', lo: 'TAE-5.1.1', ref: '5.1.1',
    story: <>Automated tests run <b>unattended</b> — perfect for pipelines. Low-level tests gate the <b>build</b>; then the SUT is deployed; higher-level tests run either <b>inside</b> the deployment phase or in a <b>separate pipeline</b>. Toggle the two approaches.</>,
    visual: () => <PipelineViz />,
    hook: <>① Inside = 🚧 <b>gate + rollback</b>, but rerun = redeploy. ② Separate = 🔓 <b>no gate</b>, manual rollback, flexible suites.</>,
    trap: <>TAF <b>configuration tests</b> (paths & files exist) = a subspecies of component tests run during the build of the automation project.</>,
    check: { q: 'Tests run in a separate pipeline triggered by successful deployment. What is true?', options: ['They act as a quality gate', 'They automatically roll back the deployment', 'They do not act as a quality gate; rollback needs other, usually manual, actions', 'They require redeployment to rerun'], answer: 2, why: 'In the separate-pipeline approach tests are not a quality gate.' },
  },
  {
    chapter: 5, title: 'Configuration management for testware', icon: '🗄️', lo: 'TAE-5.1.2', ref: '5.1.2',
    story: <>Automation runs on many environments and SUT versions, so configuration management is integral. Three drawers to manage, and two ways to match tests to a release.</>,
    visual: () => <>
      <Versus cols={[
        { icon: '🌍', title: 'Test environment configuration', color: C[5], points: ['Different URLs, credentials per environment', 'Usually stored WITH the testware', 'Multi-project / multi-TAF → part of the common core library or a shared repository'] },
        { icon: '🗃️', title: 'Test data', color: '#ffb703', points: ['Specific to the environment or to the release/feature set', 'Usually stored with smaller TAFs', 'Or managed by test data management systems'] },
        { icon: '🧺', title: 'Test suites / test cases', color: '#8b6cff', points: ['Suites by purpose: smoke, regression…', 'Often run at separate levels, pipelines & environments'] },
      ]} />
      <div className="mt" />
      <Versus cols={[
        { icon: '🎚️', title: 'Feature toggles', color: '#43c59e', points: ['Toggle config per release or environment', 'Testware uses the toggle to decide which suites to run'] },
        { icon: '🏷️', title: 'Release testware with the SUT', color: '#f72585', points: ['Same release version as the SUT → exact match', 'Implemented with CM tags or branches'] },
      ]} />
    </>,
    hook: <>🗄️ Three drawers: <b>E</b>nvironment, <b>D</b>ata, <b>S</b>uites → "<b>EDS</b>". Release matching: 🎚️ toggle or 🏷️ tag.</>,
    trap: <>The environment configuration can be <b>part of</b> the common core library — the core library is NOT part of the environment configuration (official Q22).</>,
    check: { q: 'How can testware exactly match the SUT version it tests?', options: ['Run all tests always', 'Release the testware with the same version using tags/branches', 'Store testware in a spreadsheet', 'Use only production data'], answer: 1, why: 'Releasing testware with the SUT version (tags/branches) gives an exact match.' },
  },
  {
    chapter: 5, title: 'API dependencies & contract testing', icon: '🤝', lo: 'TAE-5.1.3', ref: '5.1.3',
    story: <>For API automation you need two things about dependencies: <b>API connections</b> (business logic & relationships between APIs) and <b>API documentation</b> (parameters, headers, request/response types). With shift-left, testing is divided across levels — and <b>contract testing</b> extends integration testing.</>,
    visual: () => <ContractHandshake />,
    hook: <>🤝 Contract testing = a <b>handshake between services</b>, not a lawyer. 📱 Consumer-driven = "<b>here's what I expect</b>". 🖥️ Provider-driven = "<b>here's how I work</b>".</>,
    trap: <>Contract testing does NOT verify contractual (legal) requirements. And it goes <b>beyond</b> schema validation.</>,
    check: { q: 'In consumer-driven contract testing…', options: ['The provider documents how its services operate', 'The consumer sets expectations of how the provider shall respond', 'A lawyer approves the API', 'Only schema validation is done'], answer: 1, why: 'Consumer-driven: the consumer sets its expectations.' },
  },

  /* ============================ CHAPTER 6 ============================ */
  {
    chapter: 6, title: 'Where data comes from', icon: '📡', lo: 'TAE-6.1.1', ref: '6.1.1',
    story: <>Data for analysis and reporting flows in from many pipes. Because testware is at the core of a TAS, you can <b>enhance the underlying testware</b> once (e.g., record start/end time) and every higher-level script benefits.</>,
    visual: () => <Hub color={C[6]} center={{ icon: '📊', title: 'Analysis & reports', points: ['Enhance underlying testware once → all scripts get it', 'Report trends across runs (e.g., success rate)', 'Assertions decide pass/fail; failures need extra info (screenshots)', 'Tools can ignore expected differences (dates, times)'] }} items={[
      { icon: '🎯', title: 'SUT logs', note: 'Web/mobile UI, APIs, applications, web servers, database servers.' },
      { icon: '🧾', title: 'TAF logs', note: 'Provide an audit trail.' },
      { icon: '🏗️', title: 'Build logs', note: 'From the build.' },
      { icon: '🚚', title: 'Deployment logs', note: 'From deployments.' },
      { icon: '🌍', title: 'Production logs', note: 'Monitoring data: performance monitoring for trend analysis; performance test logs (load, stress, spike).' },
      { icon: '📸', title: 'Screenshots & recordings', note: 'Native to the automation tool or 3rd party.' },
    ]} />,
    hook: <>Six pipes: <b>SUT, TAF, Build, Deploy, Prod, Pictures</b>.</>,
    trap: <>Screenshot comparison fails everywhere but looks the same? Mask the dynamic bits: <b>dates, session IDs</b> (official Q25).</>,
    check: { q: 'Management wants to see whether the success rate improves over runs. What is needed?', options: ['A traffic light for the last run', 'An analysis feature comparing previous runs and highlighting trends', 'More screenshots', 'Debug-level logs'], answer: 1, why: 'Reporting across runs needs an analysis feature to highlight trends.' },
  },
  {
    chapter: 6, title: 'What a great TAS log contains', icon: '🧾', lo: 'TAE-6.1.1', ref: '6.1.1',
    story: <>Test logs are the go-to source for finding defects in both TAS and SUT. Flip each card: what must be logged, and why?</>,
    visual: () => <FlipGrid color={C[6]} min={165} items={[
      { icon: '🏁', title: 'Which test + start/end', note: 'Which test case is executing, including start and end time.' },
      { icon: '🚦', title: 'Status', note: 'Passed, failed, or TAS failure (defect NOT in the SUT). Inconclusive happens — define clear statuses. Report via a dashboard.' },
      { icon: '👣', title: 'Steps + timing', note: 'Low-level details: significant test steps including timing.' },
      { icon: '💧', title: 'Dynamic SUT info', note: 'E.g., memory leaks found with third-party tools; log actual results & failures with the suite.' },
      { icon: '🔢', title: 'Counter', note: 'For reliability/stress testing with many cycles — how many times tests ran.' },
      { icon: '🎲', title: 'Random values', note: 'Log random parameters/choices so the run can be analyzed and reproduced.' },
      { icon: '⏯️', title: 'Replayable actions', note: 'Log all actions so the log can be played back with the same steps and timing — reproduce failures (even customer ones).' },
      { icon: '📸', title: 'Screenshots', note: 'Save during execution for root cause analysis.' },
      { icon: '💥', title: 'Crash dumps & stack traces', note: 'Keep everything needed to analyze; save logs that can be overwritten (cyclic buffers).' },
      { icon: '🎨', title: 'Color', note: 'E.g., defects in red, progress in green.' },
    ]} />,
    hook: <>SUT side: log defect info with <b>timestamps</b>, log <b>configuration at startup</b>, keep logs <b>searchable & time-synchronized</b> with the TAS log.</>,
    trap: <>Web service with no UI? Screenshots are useless — log request/response pairs (official Q26).</>,
    check: { q: 'A test uses random parameters. What should the TAS log?', options: ['Nothing — randomness cannot be logged', 'The random numbers/choices used', 'Only the final status', 'Only screenshots'], answer: 1, why: 'Random elements must be logged to analyze and reproduce.' },
  },
  {
    chapter: 6, title: 'Analyzing a failure: the 5-step detective', icon: '🕵️', lo: 'TAE-6.1.2', ref: '6.1.2',
    story: <>After a run, analyze for failures in both SUT and TAS. Data from the <b>TAS is primary</b>, SUT data is <b>secondary</b>. Follow the detective's path.</>,
    visual: () => <>
      <Flow vertical color={C[6]} items={[
        { icon: '🗓️', title: '1. Seen before?', sub: 'known defect?', note: 'Check if the same failure happened in previous runs — might be a known SUT or TAS defect. Log historical results to help.' },
        { icon: '🆔', title: '2. Identify the test', sub: 'what does it test?', note: 'Self-explanatory, or look it up in the test management system via the ID logged with the run.' },
        { icon: '👣', title: '3. Which step failed?', sub: 'the TAS logs this', note: 'Find the test step where the failure happened.' },
        { icon: '📸', title: '4. Check SUT state', sub: 'screenshots, API & network logs', note: 'Does the state of the SUT match expected results?' },
        { icon: '🐞', title: '5. Log the defect', sub: 'with evidence', note: 'If the SUT state is wrong, log a defect with all necessary information and the justifying logs.' },
      ]} />
      <div className="mt" />
      <Versus cols={[
        { icon: '🤔', title: 'Actual = expected, still failed?', color: '#8b6cff', points: ['Most likely a defect in the TAS', '…or an invisible mismatch'] },
        { icon: '🌩️', title: 'Everything failed?', color: '#fb7185', points: ['Test environment (partly) unavailable', 'Check SUT logs for outages at run time'] },
        { icon: '🧭', title: 'Correlation / trace ID', color: '#ffb703', points: ['Audit logs give each interaction a unique ID, reused in every subsequent call', 'TAS logs it → trace behavior back'] },
      ]} />
    </>,
    hook: <>"<b>S</b>een it? <b>I</b>dentify, <b>S</b>tep, <b>S</b>tate, <b>S</b>ubmit" → <b>SISSS</b> 🐍.</>,
    check: { q: 'For analyzing test results, which data is primary?', options: ['SUT data', 'TAS data', 'Production data', 'Marketing data'], answer: 1, why: '"The data collected from the TAS is primary and the data collected from the SUT is secondary."' },
  },
  {
    chapter: 6, title: 'Trace IDs across the stack', icon: '🧭', lo: 'TAE-6.1.2', ref: '6.1.2',
    story: <>Measuring each transaction across browser, microservices and database? Populate a <b>trace ID</b> across components and associate measured times with it. Also analyze environment data for <b>sizing</b> (clusters, CPU, RAM, single vs cross-browser), compare with previous runs, and use web logs to monitor software usage.</>,
    visual: () => <TraceId />,
    hook: <>🧭 Trace ID = a <b>GPS tag</b> riding with one request through every layer.</>,
    check: { q: 'You must correlate performance data across front end, microservices and DB. Best approach?', options: ['Gather data manually', 'Third-party agents logging to a DB without correlation', 'Populate trace IDs across components and associate timings with them', 'Only measure in the browser'], answer: 2, why: 'Trace IDs correlate data across all architectural components (official Q27).' },
  },
  {
    chapter: 6, title: 'Progress reports & stakeholders', icon: '📣', lo: 'TAE-6.1.3', ref: '6.1.3',
    story: <>Logs give detail but no overview. After a suite runs, create & publish a concise <b>test progress report</b> (a report generator helps): test results, SUT info, test environment docs — formatted for each stakeholder. Also used to diagnose TAF component failures. Publish via website, cloud, mailing list, chatbot or test management tool; keep a history for trend analysis.</>,
    visual: () => <Versus cols={[
      { icon: '👔', title: 'Management', color: '#8b6cff', points: ['Solution/enterprise architect, project/delivery manager, program manager, test manager, test director', 'Cares about TRENDS: tests added since last run, pass/fail ratio changes, TAS & SUT reliability'] },
      { icon: '📦', title: 'Operational', color: '#ffb703', points: ['Product owner/manager, business representative, business analyst', 'Cares about PRODUCT USE metrics'] },
      { icon: '🛠️', title: 'Technical', color: '#22d3ee', points: ['Team leader, scrum master, web admin, DB dev/admin, test leader, TAE, tester, developer', 'Cares about LOWER-LEVEL details'] },
    ]} />,
    hook: <>👔 Suits see <b>trends</b>, 📦 product people see <b>usage</b>, 🛠️ builders see <b>details</b>. Dashboards + AI/ML log analysis help everyone.</>,
    trap: <>Test <b>manager</b> = management stakeholder; test <b>leader</b> = technical stakeholder.</>,
    check: { q: 'A product owner is which type of stakeholder?', options: ['Management', 'Operational', 'Technical', 'External'], answer: 1, why: 'Product owner/manager is listed as an operational stakeholder.' },
  },

  /* ============================ CHAPTER 7 ============================ */
  {
    chapter: 7, title: 'Verifying the automation environment', icon: '🧰', lo: 'TAE-7.1.1', ref: '7.1.1',
    story: <>Who tests the tests? Before starting automation, verify every component of the test automation environment. Four checks.</>,
    visual: () => <Flow color={C[7]} items={[
      { icon: '📥', title: 'Tool install & config', sub: 'repo + scripts', points: ['TAS = executables, function libraries, data & config files', 'Tools have service packs and add-ins for SUT compatibility', 'Automated installation / copying from a repository → same TAS version & config everywhere', 'Upgrade via the repository, same process as standard dev tools'] },
      { icon: '🔁', title: 'Repeatable setup/teardown', sub: 'no discernible difference', points: ['Systematic loading/unloading of the TAS on any environment', 'Rebuilding gives no discernible difference across environments', 'Configuration management makes a configuration dependable', 'Document TAS components → know what changes when the SUT env changes'] },
      { icon: '🔌', title: 'Connectivity', sub: 'internal & external', points: ['Preconditions/checks before using the SUT', 'Log into servers, launch tools, verify tool → SUT access', 'Inspect config settings manually', 'Permissions for logging & reporting between systems'] },
      { icon: '🧪', title: 'TAF component testing', sub: 'test the framework', points: ['Test TAF components individually: functional & non-functional', 'E.g., GUI object verification across many object classes', 'Logs/reports must be accurate', 'Watch performance degradation, memory leaks, interoperability'] },
    ]} />,
    hook: <>"<b>I</b>nstall, <b>R</b>epeat, <b>C</b>onnect, <b>C</b>omponent-test" → "<b>I R</b>eally <b>C</b>heck <b>C</b>arefully".</>,
    trap: <>Old/mismatched TAS versions & false positives in new environments → <b>automated install script</b> + <b>central repository</b> (official Q30).</>,
    check: { q: 'What guarantees the same TAS version and configuration across environments?', options: ['Manual copying by each tester', 'Automated installation or copying from a repository', 'Skipping TAF component tests', 'Using only one environment'], answer: 1, why: 'Automated installation/copying from a repository guarantees the same version and config.' },
  },
  {
    chapter: 7, title: 'Verifying the automated test suite', icon: '🧺', lo: 'TAE-7.1.2', ref: '7.1.2',
    story: <>Suites must be complete, consistent and behave correctly. Four checks — and one rule you will see on the exam: <b>flaky tests get quarantined</b>.</>,
    visual: () => <FlipGrid color={C[7]} min={180} items={[
      { icon: '🧩', title: 'Composition', note: 'Completeness: all tests have expected results, test data is present; correct versions of the TAF and the SUT.' },
      { icon: '🆕', title: 'New TAF features', note: 'The first time a new TAF feature is used in tests, verify and monitor it closely.' },
      { icon: '🔁', title: 'Repeatability', note: 'Same result every time. Unreliable tests (e.g., race conditions) → move OUT of the active suite and analyze separately to find root cause.' },
      { icon: '🩻', title: 'Intrusiveness', note: 'Tight TAS–SUT coupling can change SUT behavior/performance vs. manual use → failures not seen in production → confidence drops. Devs may ask to reproduce manually.' },
    ]} />,
    hook: <>🚑 Flaky test = <b>quarantine</b>, then investigate. Never "take no action", never "replace with ones that pass".</>,
    check: { q: 'Two tests sometimes fail due to race conditions. What should you do?', options: ['Ignore them since they sometimes pass', 'Remove them from the active suite and analyze separately', 'Delete them permanently', 'Rerun until they pass'], answer: 1, why: 'Move unreliable tests out of the active suite and find the root cause.' },
  },
  {
    chapter: 7, title: 'Unexpected results → root cause analysis', icon: '🔎', lo: 'TAE-7.1.3', ref: '7.1.3',
    story: <>A test fails — or <i>passes</i> — unexpectedly? Do root cause analysis: inspect <b>test logs, performance data, setup & teardown</b>. Run a few <b>isolated</b> tests. Intermittent failures are harder. Monitor system resources, analyze TC/SUT/TAF logs, debug, and get help from test analysts, BAs, devs or system engineers.</>,
    visual: () => <Hub color={C[7]} center={{ icon: '❓', title: 'Where is the defect?', note: 'It can be in the test case, the SUT, the TAF, the hardware or the network — analyze before blaming the SUT.' }} items={[
      { icon: '📝', title: 'Test case', note: 'Wrong steps, data or expected results.' },
      { icon: '🎯', title: 'SUT', note: 'A real product defect.' },
      { icon: '⚙️', title: 'TAF', note: 'A bug in the framework itself.' },
      { icon: '🖥️', title: 'Hardware', note: 'Monitoring system resources may give clues.' },
      { icon: '🌐', title: 'Network', note: 'Connectivity or latency issues.' },
      { icon: '❔', title: 'Missing assertions', note: 'Verify all assertions are in place — missing assertions → INCONCLUSIVE results.' },
    ]} />,
    hook: <>🔎 "<b>The Silly Tester Has No Assertions</b>" = Test case, SUT, TAF, Hardware, Network, Assertions.</>,
    trap: <>Manual run passed, automated run failed? First <b>analyze log files</b> — don't open an SUT defect yet (official Q33).</>,
    check: { q: 'What can missing assertions lead to?', options: ['Faster tests', 'Inconclusive test results', 'Better coverage', 'Fatal logs'], answer: 1, why: '"Missing assertions may result in inconclusive test results."' },
  },
  {
    chapter: 7, title: 'Static analysis for automation code', icon: '🛡️', lo: 'TAE-7.1.4', ref: '7.1.4',
    story: <>Static code analysis finds vulnerabilities and defects in code — SUT <b>or TAF</b>. Automated scans run early via pipelines (proactive detection, key in <b>DevSecOps</b>). Automation code is code: a plaintext password in a test script is a real vulnerability even if test code isn't deployed. Run the scanner.</>,
    visual: () => <StaticScan />,
    hook: <>🔑🔍 <b>Scan the test code like production code.</b> Severity: critical · high · medium · low.</>,
    trap: <>Security-critical app → verify automation code with a <b>static analysis tool</b>, not by searching logs or running slowly (official Q34).</>,
    check: { q: 'How are static analysis findings usually categorized?', options: ['Fatal/Error/Warn', 'Critical/High/Medium/Low', 'Red/Green/Refactor', 'Pass/Fail/Inconclusive'], answer: 1, why: 'Defects are categorized as critical, high, medium or low severity.' },
  },

  /* ============================ CHAPTER 8 ============================ */
  {
    chapter: 8, title: 'Test histogram: find the fragile ones', icon: '📊', lo: 'TAE-8.1.1', ref: '8.1.1',
    story: <>Many CI/CD and reporting tools show results across runs with their data (exception logs, error messages, screenshots). A <b>test histogram</b> reveals trends and lets TAEs pick <b>fragile</b> tests to refactor or re-implement.</>,
    visual: () => <Histogram />,
    hook: <>📊 Histogram = a <b>heat-map of flakiness</b>.</>,
    trap: <>A histogram <b>identifies</b> fragile tests; it doesn't <b>fix</b> broken locators (that's AI self-healing).</>,
    check: { q: 'What does a test histogram help TAEs do?', options: ['Generate test data', 'Identify fragile test cases to refactor', 'Validate API schemas', 'Heal locators automatically'], answer: 1, why: 'It lets TAEs identify and select fragile tests.' },
  },
  {
    chapter: 8, title: 'AI self-healing locators', icon: '🩹', lo: 'TAE-8.1.1', ref: '8.1.1',
    story: <>In UI tests, locator values are data too. Cutting-edge tools use <b>ML and image recognition</b> to detect a changed locator, find the new one, <b>self-heal</b> the test and include the change in the report.</>,
    visual: () => <SelfHealing />,
    hook: <>🩹🤖 Developers keep changing IDs → <b>AI self-healing</b>.</>,
    check: { q: 'Developers often change UI element IDs, causing heavy maintenance. Best improvement?', options: ['Schema validation on the GUI', 'AI-based self-healing of locators', 'More screenshots', 'Longer hard-coded waits'], answer: 1, why: 'AI self-healing identifies new selectors and fixes tests (official Q35).' },
  },
  {
    chapter: 8, title: 'Schema validation', icon: '🧾', lo: 'TAE-8.1.1', ref: '8.1.1',
    story: <>For <b>APIs</b> (properties from endpoints) and <b>databases</b> (allowed types, ranges), schema validation checks a response against the business specification: mandatory elements present, types correct. Break a field and compare 12 assertions vs 1 line.</>,
    visual: () => <SchemaValidation />,
    hook: <>🧾 One schema replaces a <b>wall of assertions</b>.</>,
    trap: <>Schema validation is for <b>API & database</b> analysis — not GUI checks.</>,
    check: { q: 'Where does the syllabus apply schema validation?', options: ['GUI layout checks', 'API data analysis and database analysis', 'Static code analysis', 'Log level filtering'], answer: 1, why: 'API data analysis (endpoints) and database analysis (field rules).' },
  },
  {
    chapter: 8, title: 'Wait mechanisms: the race', icon: '⏱️', lo: 'TAE-8.1.2', ref: '8.1.2',
    story: <>Part of improving <b>scripting</b>. Three ways to wait for the SUT — race them. Also in scripting: consolidate overlapping steps into reusable library functions (parameterize similar ones — typical of KDT) and set up a <b>failure recovery</b> process for TAS & SUT (e.g., reboot the SUT, continue with the next test).</>,
    visual: () => <WaitRace />,
    hook: <>😴 Sleep &lt; 🔄 Poll &lt; 📡 Subscribe. Poll & subscribe <b>both need a timeout</b> ⏰.</>,
    check: { q: 'Which wait mechanism is the most reliable, if supported?', options: ['Hard-coded waits', 'Dynamic polling', 'Subscribing to SUT events', 'Manual waits'], answer: 2, why: 'Event subscription is the most reliable but needs language & SUT support plus a timeout.' },
  },
  {
    chapter: 8, title: 'Improvement areas of a deployed TAS', icon: '🛠️', lo: 'TAE-8.1.2', ref: '8.1.2',
    story: <>Beyond keeping the TAS in sync, improve it for efficiency, ease of use, capabilities and better support. Value decides. Flip through the areas.</>,
    visual: () => <FlipGrid color={C[8]} min={170} items={[
      { icon: '📜', title: 'Scripting', note: 'Upgrade technique (linear → DDT → KDT) for new tests; retrofit to high-maintenance ones. Consolidate overlap, failure recovery, better waits.' },
      { icon: '🏃', title: 'Test execution', note: 'Too long? Run concurrently on different envs if possible. Single expensive system? SPLIT the suite (e.g., per night). Remove DUPLICATION. Parallel batch jobs in CI/CD; schedule pipelines.' },
      { icon: '✅', title: 'Verification', note: 'Adopt standard verification methods for all tests; parameterize similar ones.' },
      { icon: '🏛️', title: 'TAA', note: 'Change it to support SUT testability improvements (e.g., SUT adds test APIs → refactor TAS). Expensive late — think early.' },
      { icon: '📚', title: 'TAF core libs', note: 'New major versions: Pilot → Impact analysis → Adoption plan → Update dependencies (all teams together via core build file, or each team in its business logic layer).' },
      { icon: '🔁', title: 'Setup & teardown', note: 'Move repeated actions into setup/teardown; e.g., web service calls for UI test preconditions (register/cleanup users).' },
      { icon: '📖', title: 'Documentation', note: 'Automation docs, TAS user docs, reports and logs.' },
      { icon: '✨', title: 'TAS features', note: 'Add reporting, logs, integrations — ONLY features that will be used. Unused features add complexity and reduce reliability & maintainability.' },
      { icon: '⬆️', title: 'TAF updates', note: 'New versions bring functions & fixes but may break tests → run representative sample tests (SUTs, test types, environments) before rollout.' },
    ]} />,
    hook: <>Core library upgrade = "<b>P-I-A-U</b>" → "<b>P</b>lease <b>I</b>nspect <b>A</b>ll <b>U</b>pgrades".</>,
    trap: <>Suite too long on a single expensive box: <b>split across nights</b> + <b>remove duplicates</b>. Never just delete tests or claim KDT runs faster (official Q37).</>,
    check: { q: 'Correct order for adopting a new core library version?', options: ['Update deps → pilot → impact → plan', 'Pilot → impact analysis → adoption plan → update dependencies', 'Plan → impact → update → pilot', 'Impact → update → plan → pilot'], answer: 1, why: 'Pilot and impact analysis first, then adoption plan, then update dependencies.' },
  },
  {
    chapter: 8, title: 'Restructuring testware for SUT updates', icon: '🔧', lo: 'TAE-8.1.3', ref: '8.1.3',
    story: <>Any SUT change — however trivial — can hit TAS reliability and performance. Change in <b>small, measured steps</b>, then do a full regression and root-cause any failures.</>,
    visual: () => <>
      <Flow color={C[8]} items={[
        { icon: '🔍', title: 'Identify changes', sub: 'testware? libs? OS?', note: 'Evaluate what changes are needed in testware, custom function libraries or the operating system.' },
        { icon: '🐣', title: 'Incremental (MVP)', sub: 'limited run', note: 'Change incrementally with a minimum viable product mindset; measure impact via a limited run of scripts.' },
        { icon: '✅', title: 'No side effects?', sub: 'implement fully', note: 'Once no side effect exists, implement changes fully.' },
        { icon: '🔁', title: 'Full regression', sub: 'last step', note: 'Full regression run; root-cause failures (reports, logs, data) to ensure they are not from the improvement itself.' },
      ]} />
      <div className="mt" />
      <FlipGrid color={C[8]} min={170} items={[
        { icon: '⚡', title: 'Optimize core libraries', note: 'Put new, more efficient techniques (optimized code, newer OS libraries) into core function libraries for current & future projects.' },
        { icon: '🎛️', title: 'Consolidate control functions', note: 'Many functions acting on the same control type (dropdown, checkbox…)? Consolidate into fewer, more general ones → less maintenance.' },
        { icon: '🏛️', title: 'Refactor the TAA', note: 'Evolve the TAA with the SUT — no "bolt-on" features; analyze and change the architecture.' },
        { icon: '🏷️', title: 'Naming conventions', note: 'New code and libraries must follow previously defined standards.' },
        { icon: '🗑️', title: 'Revise / eliminate scripts', note: 'Decompose complex, slow tests into smaller ones; eliminate tests that run rarely or never.' },
      ]} />
    </>,
    hook: <>🐣 <b>Small step → measure → full regression.</b></>,
    check: { q: 'What is the LAST step to verify a testware change did not hurt the automated scripts?', options: ['A limited run', 'A full regression run', 'Static analysis', 'A pilot'], answer: 1, why: '"A full regression run is the last step."' },
  },
  {
    chapter: 8, title: 'Bonus uses of automation tools', icon: '🎁', lo: 'TAE-8.1.4', ref: '8.1.4',
    story: <>Automation tools help beyond testing. Three opportunities to remember.</>,
    visual: () => <FlipGrid color={C[8]} min={200} items={[
      { icon: '🌱', title: 'Environment setup & control', note: 'Scripts create test data in new environments — e.g., call a web service endpoint to register users with multiple profiles; clean up logs and testware automatically (housekeeping).' },
      { icon: '📅', title: 'Data aging', note: 'Manipulate test data, e.g., keep database date fields up to date from a year perspective.' },
      { icon: '🎬', title: 'Screenshots & video', note: 'Built-in capture on conditions → actual usage screenshots/videos for release documentation or marketing.' },
    ]} />,
    hook: <>🎁 "<b>Set up, Age, Film</b>".</>,
    trap: <>Need diverse users for a performance test? Use automation to call a <b>web service API</b> that creates them — not the production DB, not manual GUI registration (official Q40).</>,
    check: { q: 'Keeping DB date fields up to date year over year with automation is called…', options: ['Data masking', 'Data aging', 'Schema validation', 'Data-driven testing'], answer: 1, why: 'That is data aging.' },
  },
];

export const scenesFor = (ch: number) => lessons.filter((s) => s.chapter === ch);
export const sceneKey = (ch: number, idx: number) => `${ch}-${idx}`;

TOTAL_SCENES.value = lessons.length;
SCENES_PER_CH.value = lessons.reduce<Record<number, number>>((acc, s) => { acc[s.chapter] = (acc[s.chapter] ?? 0) + 1; return acc; }, {});
