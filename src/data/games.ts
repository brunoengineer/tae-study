export interface SortGame {
  id: string;
  chapter: number;
  title: string;
  icon: string;
  prompt: string;
  buckets: { id: string; label: string; icon: string; color: string }[];
  items: { text: string; bucket: string }[];
}
export interface SeqGame {
  id: string;
  chapter: number;
  title: string;
  icon: string;
  prompt: string;
  steps: string[]; // correct order
}

export const sortGames: SortGame[] = [
  {
    id: 'adv-dis-lim', chapter: 1, title: 'Pros, Cons or Limits?', icon: '⚖️',
    prompt: 'Sort each statement into advantage, disadvantage or limitation of test automation.',
    buckets: [
      { id: 'a', label: 'Advantage', icon: '✅', color: '#34d399' },
      { id: 'd', label: 'Disadvantage', icon: '⚠️', color: '#fb7185' },
      { id: 'l', label: 'Limitation', icon: '🧱', color: '#fbbf24' },
    ],
    items: [
      { text: 'Quicker feedback on SUT quality', bucket: 'a' },
      { text: 'Tests impossible manually (real-time, remote, parallel)', bucket: 'a' },
      { text: 'Consistent execution across test cycles', bucket: 'a' },
      { text: 'Less subject to human error', bucket: 'a' },
      { text: 'Initial investment to set up a TAS', bucket: 'd' },
      { text: 'Rigid tests, less adaptable to SUT changes', bucket: 'd' },
      { text: 'Can introduce additional defects', bucket: 'd' },
      { text: 'Needs clear automation objectives', bucket: 'd' },
      { text: 'Not all manual tests can be automated', bucket: 'l' },
      { text: 'Only checks results verifiable by an automated oracle', bucket: 'l' },
      { text: 'Verifies only what it is programmed to', bucket: 'l' },
    ],
  },
  {
    id: 'envs', chapter: 2, title: 'Which environment?', icon: '🛤️',
    prompt: 'Drop each activity into the environment where the syllabus places it.',
    buckets: [
      { id: 'loc', label: 'Local dev', icon: '💻', color: '#8b6cff' },
      { id: 'bld', label: 'Build', icon: '🏗️', color: '#22d3ee' },
      { id: 'int', label: 'Integration', icon: '🔗', color: '#2ec4b6' },
      { id: 'pre', label: 'Preproduction', icon: '🎭', color: '#ffb703' },
      { id: 'prd', label: 'Production', icon: '🌍', color: '#f72585' },
    ],
    items: [
      { text: 'White-box testing in the IDE', bucket: 'loc' },
      { text: 'Component tests + static analysis on a CI agent, no deployment', bucket: 'bld' },
      { text: 'First full automated suite on a release candidate', bucket: 'int' },
      { text: 'First environment with monitoring', bucket: 'int' },
      { text: 'Black-box system integration testing only', bucket: 'int' },
      { text: 'Performance efficiency, closely resembling production', bucket: 'pre' },
      { text: 'User acceptance testing by business stakeholders', bucket: 'pre' },
      { text: 'Canary release & A/B testing', bucket: 'prd' },
      { text: 'Real users interacting in real time', bucket: 'prd' },
    ],
  },
  {
    id: 'testability', chapter: 2, title: 'Eye, Joystick or Glass box?', icon: '👁️',
    prompt: 'Classify each description into a testability aspect.',
    buckets: [
      { id: 'o', label: 'Observability', icon: '👁️', color: '#22d3ee' },
      { id: 'c', label: 'Controllability', icon: '🕹️', color: '#8b6cff' },
      { id: 't', label: 'Architecture transparency', icon: '🔍', color: '#ffb703' },
    ],
    items: [
      { text: 'Interfaces that give insight into the SUT', bucket: 'o' },
      { text: 'Read internal state to compare actual vs expected', bucket: 'o' },
      { text: 'Function calls that perform actions on the SUT', bucket: 'c' },
      { text: 'TCP/IP or USB commands driving the system', bucket: 'c' },
      { text: 'Electronic signals for physical/logical switches', bucket: 'c' },
      { text: 'Documentation with clear components & interfaces', bucket: 't' },
      { text: 'Gives observability/controllability at all test levels via docs', bucket: 't' },
    ],
  },
  {
    id: 'gtaa', chapter: 3, title: 'gTAA capability match', icon: '🏛️',
    prompt: 'Which gTAA capability provides each feature?',
    buckets: [
      { id: 'g', label: 'Generation', icon: '🧬', color: '#a78bfa' },
      { id: 'd', label: 'Definition', icon: '✍️', color: '#8b6cff' },
      { id: 'e', label: 'Execution', icon: '▶️', color: '#22d3ee' },
      { id: 'a', label: 'Adaptation', icon: '🔌', color: '#2ec4b6' },
    ],
    items: [
      { text: 'Automated design of tests from a test model', bucket: 'g' },
      { text: 'Optional capability using MBT tools', bucket: 'g' },
      { text: 'Implement test cases and test suites', bucket: 'd' },
      { text: 'Separate test definition from SUT and tools', bucket: 'd' },
      { text: 'Test logging and test reporting', bucket: 'e' },
      { text: 'Run selected tests automatically', bucket: 'e' },
      { text: 'Adaptors for APIs, protocols and services', bucket: 'a' },
      { text: 'Connect tests to various SUT interfaces', bucket: 'a' },
    ],
  },
  {
    id: 'layers', chapter: 3, title: 'Which TAF layer?', icon: '🥞',
    prompt: 'Place each artifact in the right TAF layer.',
    buckets: [
      { id: 's', label: 'Test scripts', icon: '📜', color: '#8b6cff' },
      { id: 'b', label: 'Business logic', icon: '🧠', color: '#ff7a59' },
      { id: 'c', label: 'Core libraries', icon: '⚙️', color: '#22d3ee' },
    ],
    items: [
      { text: 'Test suite annotations', bucket: 's' },
      { text: 'test_checkout_with_voucher()', bucket: 's' },
      { text: 'Connection config for the new Android app', bucket: 'b' },
      { text: 'ShopLoginFlow using core facades', bucket: 'b' },
      { text: 'SUT-dependent page models', bucket: 'b' },
      { text: 'Generic HTTP client wrapper', bucket: 'c' },
      { text: 'Reusable logging utility for any project', bucket: 'c' },
      { text: 'WebDriver singleton factory (stack-generic)', bucket: 'c' },
    ],
  },
  {
    id: 'approach', chapter: 3, title: 'Name that approach', icon: '🪜',
    prompt: 'Match each pro/con/description to its automation approach.',
    buckets: [
      { id: 'cp', label: 'Capture/playback', icon: '⏺️', color: '#fb7185' },
      { id: 'st', label: 'Structured', icon: '🧱', color: '#ffb703' },
      { id: 'dd', label: 'Data-driven', icon: '📊', color: '#43c59e' },
      { id: 'kd', label: 'Keyword-driven', icon: '🔑', color: '#22d3ee' },
      { id: 'bd', label: 'BDD', icon: '🗣️', color: '#8b6cff' },
    ],
    items: [
      { text: 'SUT must be available while recording', bucket: 'cp' },
      { text: 'No-code vs low-code variants', bucket: 'cp' },
      { text: 'Business logic separated from test scripts', bucket: 'st' },
      { text: 'Initial investment into TAF development', bucket: 'st' },
      { text: 'Same script, many .csv rows', bucket: 'dd' },
      { text: 'Test analysts specify tests by filling data files', bucket: 'dd' },
      { text: 'Usable for manual testing too (29119-5)', bucket: 'kd' },
      { text: 'Huge effort for smaller systems', bucket: 'kd' },
      { text: 'Given / When / Then in feature files', bucket: 'bd' },
      { text: 'Teams mistake it for "just natural-language tests"', bucket: 'bd' },
    ],
  },
  {
    id: 'patterns', chapter: 3, title: 'Pattern detective', icon: '🧩',
    prompt: 'Which design pattern is described?',
    buckets: [
      { id: 'f', label: 'Facade', icon: '🏠', color: '#8b6cff' },
      { id: 's', label: 'Singleton', icon: '☝️', color: '#22d3ee' },
      { id: 'p', label: 'Page object', icon: '📄', color: '#ff7a59' },
      { id: 'fl', label: 'Flow model', icon: '🌊', color: '#2ec4b6' },
    ],
    items: [
      { text: 'Hides implementation details, exposes only what testers need', bucket: 'f' },
      { text: 'Only one driver talks to the SUT', bucket: 's' },
      { text: 'Locator changes updated in one class per page', bucket: 'p' },
      { text: 'Double facade storing reusable user actions', bucket: 'fl' },
      { text: 'Best when the SUT structure changes frequently and flows are reused', bucket: 'fl' },
    ],
  },
  {
    id: 'risks', chapter: 4, title: 'Technical risk buckets', icon: '⚠️',
    prompt: 'Classify each issue into its technical deployment risk (PLTU).',
    buckets: [
      { id: 'p', label: 'Packaging', icon: '📦', color: '#f72585' },
      { id: 'l', label: 'Logging', icon: '📝', color: '#22d3ee' },
      { id: 't', label: 'Test structuring', icon: '🏗️', color: '#8b6cff' },
      { id: 'u', label: 'Updating', icon: '🔄', color: '#43c59e' },
    ],
    items: [
      { text: 'Testware not version-controlled or shared in a repository', bucket: 'p' },
      { text: 'Can\'t tell why a test failed from its output', bucket: 'l' },
      { text: 'No fixtures → tests are not repeatable or atomic', bucket: 't' },
      { text: 'Cannot group tests into suites with pre/postconditions', bucket: 't' },
      { text: 'Agent auto-updated overnight and broke the harness', bucket: 'u' },
      { text: 'Device OS version changed unexpectedly', bucket: 'u' },
    ],
  },
  {
    id: 'loglevels', chapter: 4, title: 'Pick the log level', icon: '📶',
    prompt: 'Which log level fits each message?',
    buckets: [
      { id: 'f', label: 'Fatal', icon: '💀', color: '#ff2d55' },
      { id: 'e', label: 'Error', icon: '❌', color: '#fb7185' },
      { id: 'w', label: 'Warn', icon: '⚠️', color: '#fbbf24' },
      { id: 'i', label: 'Info', icon: 'ℹ️', color: '#22d3ee' },
      { id: 'd', label: 'Debug/Trace', icon: '🔬', color: '#a78bfa' },
    ],
    items: [
      { text: 'Test DB unreachable — aborting the whole run', bucket: 'f' },
      { text: 'Assertion failed: total was 90, expected 100', bucket: 'e' },
      { text: 'Retry needed on a slow page, flow continued', bucket: 'w' },
      { text: 'Starting test case TC-042 "refund flow"', bucket: 'i' },
      { text: 'HTTP request headers and response body dump', bucket: 'd' },
    ],
  },
  {
    id: 'pipeline', chapter: 5, title: 'Pipeline placement', icon: '🔁',
    prompt: 'Where does each test level usually run?',
    buckets: [
      { id: 'b', label: 'Build phase (CI)', icon: '🏗️', color: '#8b6cff' },
      { id: 'cd', label: 'Continuous deployment', icon: '🚀', color: '#22d3ee' },
      { id: 'dl', label: 'Continuous delivery', icon: '🚚', color: '#2ec4b6' },
      { id: 'p', label: 'Periodic / scheduled', icon: '🌙', color: '#ffb703' },
    ],
    items: [
      { text: 'Component tests', bucket: 'b' },
      { text: 'Component integration tests', bucket: 'b' },
      { text: 'TAF configuration tests (files & paths exist)', bucket: 'b' },
      { text: 'System tests as the last quality gate', bucket: 'cd' },
      { text: 'System integration tests between components', bucket: 'dl' },
      { text: 'Nightly regression suite', bucket: 'p' },
    ],
  },
  {
    id: 'stakeholders', chapter: 6, title: 'Who gets which report?', icon: '📣',
    prompt: 'Classify each role / interest into a stakeholder group.',
    buckets: [
      { id: 'm', label: 'Management', icon: '👔', color: '#8b6cff' },
      { id: 'o', label: 'Operational', icon: '📦', color: '#ffb703' },
      { id: 't', label: 'Technical', icon: '🛠️', color: '#22d3ee' },
    ],
    items: [
      { text: 'Test manager', bucket: 'm' },
      { text: 'Solution architect', bucket: 'm' },
      { text: 'Pass/fail ratio trend since last run', bucket: 'm' },
      { text: 'Product owner', bucket: 'o' },
      { text: 'Business analyst', bucket: 'o' },
      { text: 'Product use related metrics', bucket: 'o' },
      { text: 'Test leader', bucket: 't' },
      { text: 'Scrum master', bucket: 't' },
      { text: 'Lower-level details of failures', bucket: 't' },
    ],
  },
  {
    id: 'improve', chapter: 8, title: 'Improvement toolbox', icon: '♻️',
    prompt: 'Which technique fits each problem?',
    buckets: [
      { id: 'h', label: 'Test histogram', icon: '📊', color: '#a3e635' },
      { id: 'ai', label: 'AI self-healing', icon: '🩹', color: '#22d3ee' },
      { id: 'sv', label: 'Schema validation', icon: '🧾', color: '#ffb703' },
      { id: 'w', label: 'Event/polling waits', icon: '📡', color: '#8b6cff' },
    ],
    items: [
      { text: 'Which tests fail intermittently across CI runs?', bucket: 'h' },
      { text: 'Devs keep renaming element IDs', bucket: 'ai' },
      { text: '6 mandatory string fields in an API response', bucket: 'sv' },
      { text: 'DB field types & value ranges', bucket: 'sv' },
      { text: 'Tests flaky due to sleep(5000)', bucket: 'w' },
    ],
  },
];

export const seqGames: SeqGame[] = [
  { id: 'envs', chapter: 2, title: 'Environment journey', icon: '🛤️', prompt: 'Order the environments from first to last.', steps: ['Local development', 'Build', 'Integration', 'Preproduction', 'Production'] },
  { id: 'tdd', chapter: 3, title: 'TDD cycle', icon: '🔴', prompt: 'Order one TDD iteration.', steps: ['Write one test that fails (red)', 'Develop functionality to pass it (green)', 'Refactor to clean code', 'Continue with the next test'] },
  { id: 'scripting', chapter: 3, title: 'Scripting evolution', icon: '🪜', prompt: 'Order from simplest to most sophisticated (as presented in 3.1.4 / 8.1.2).', steps: ['Capture/playback', 'Linear scripting', 'Structured scripting', 'Data-driven testing', 'Keyword-driven testing'] },
  { id: 'loglevels', chapter: 4, title: 'Log levels', icon: '📶', prompt: 'Order from most severe to most verbose.', steps: ['Fatal', 'Error', 'Warn', 'Info', 'Debug', 'Trace'] },
  { id: 'pilot', chapter: 4, title: 'Running a pilot', icon: '🚀', prompt: 'Order the pilot activities.', steps: ['Define the scope of validation', 'Evaluate language, tools, levels, test cases & approach', 'Build several prototypes and choose a path', 'Integrate into CI/CD and check progress periodically', 'TAEs & test managers evaluate success/failure and decide'] },
  { id: 'failure', chapter: 6, title: 'Failure analysis', icon: '🕵️', prompt: 'Order the 5 steps to analyze a test failure.', steps: ['Check if the same failure happened before', 'Identify the test case and what it tests', 'Find the failing test step', 'Analyze the SUT state vs expected results', 'Log a defect with justifying logs'] },
  { id: 'corelib', chapter: 8, title: 'Core library upgrade', icon: '📚', prompt: 'Order the steps to adopt a new core library version.', steps: ['Perform a pilot', 'Determine the impact (impact analysis)', 'Create an adoption plan', 'Update the dependencies'] },
  { id: 'restructure', chapter: 8, title: 'Restructure for SUT updates', icon: '🔧', prompt: 'Order the steps to safely change testware.', steps: ['Identify changes in test environment components', 'Make incremental (MVP) changes', 'Measure impact with a limited run of scripts', 'Implement changes fully once no side effects', 'Run a full regression and root-cause failures'] },
  { id: 'waits', chapter: 8, title: 'Wait mechanisms', icon: '⏱️', prompt: 'Order from least to most reliable.', steps: ['Hard-coded waits', 'Dynamic waiting by polling', 'Subscribing to SUT events'] },
];
