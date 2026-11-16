import type { Flashcard } from '../types';

let n = 0;
const f = (chapter: Flashcard['chapter'], icon: string, front: string, back: string, keyword = false): Flashcard =>
  ({ id: `fc-${++n}`, chapter, icon, front, back, keyword });

export const flashcards: Flashcard[] = [
  // Acronyms
  f(1, '🎯', 'SUT', 'System Under Test — the system being tested.', true),
  f(1, '🧑‍💻', 'TAE', 'Test Automation Engineer — designs, develops, maintains test automation solutions.', true),
  f(3, '🧱', 'TAF', 'Test Automation Framework — foundation of a TAS: test harness (test runner), test libraries, test scripts, test suites.', true),
  f(3, '📦', 'TAS', 'Test Automation Solution — the implemented solution: tools + TAF + SUT-specific adaptors, built from functional, non-functional & technical requirements.', true),
  f(3, '📐', 'TAA', 'Test Automation Architecture — the technical design of the overall TAS.'),
  f(3, '🏛️', 'gTAA', 'generic Test Automation Architecture — high-level abstract view of communication between test automation and SUT, project mgmt, test mgmt, configuration mgmt + the capabilities to cover.', true),

  // Ch1
  f(1, '⚙️', 'Test automation (3 activities)', '1) Use tools to control & set up test suites  2) Execute tests automatically  3) Compare actual vs expected results.', true),
  f(1, '🧱', 'The 4 limitations of test automation', 'Not all manual tests can be automated · Verifies only what it is programmed to · Only machine-interpretable results · Only results verifiable by an automated test oracle.'),
  f(1, '⚠️', 'The 6 disadvantages', 'Extra costs (TAE, hardware, training) · Initial investment · Time to develop & maintain · Needs clear objectives · Rigid tests · Can introduce defects.'),
  f(1, '🪜', 'Waterfall & automation', 'Automation implemented in parallel to or after implementation; tests run in the verification phase.'),
  f(1, '✌️', 'V-model & automation', 'Each spec level ↔ a test level; providing a TAF for each test level is possible and recommended.'),
  f(1, '🔄', 'In-sprint automation', 'Agile goal reached by eliminating silos so all test levels get the right amount and depth of automation.'),

  // Ch2
  f(2, '🧪', 'Testability', 'Availability of software interfaces that support testing (control & observability). A non-functional requirement, designed in parallel by a software architect with TAE input.', true),
  f(2, '👁️', 'Observability', 'SUT interfaces that give insight into it, so tests can check actual = expected.'),
  f(2, '🕹️', 'Controllability', 'SUT interfaces used to perform actions on it: UI elements, function calls, TCP/IP, USB, electronic signals.'),
  f(2, '🔍', 'Architecture transparency', 'Architecture docs with clear components & interfaces giving observability and controllability at all test levels.'),
  f(2, '🖥️', 'GUI testing', 'Testing through the graphical user interface of the SUT.', true),
  f(2, '🔌', 'API testing', 'Testing through the application programming interface — no UI needed.', true),
  f(2, '🔗', 'Integration environment', 'Release candidate fully integrated; full automated UI/API suite; black-box only; FIRST environment with monitoring.'),
  f(2, '🎭', 'Preproduction environment', 'Resembles production; mostly non-functional (performance efficiency) + UAT; monitored.'),
  f(2, '🏗️', 'Build environment', 'Local or CI/CD agent: builds software; component & component integration tests + static analysis; no deployment.'),
  f(2, '🌍', 'Testing in production practices', 'Canary release, blue/green deployment, A/B testing — with monitoring.'),
  f(2, '📋', 'Tool comparison table layout', 'Tools in columns, requirements in rows, cells = properties & priorities. Then present to stakeholders for approval.'),

  // Ch3
  f(3, '🧬', 'Test generation (gTAA)', 'OPTIONAL capability: automated design of test cases from a test model (model-based testing).'),
  f(3, '✍️', 'Test definition (gTAA)', 'Define & implement test cases/suites; separates test definition from SUT and tools; high- and low-level tests.'),
  f(3, '▶️', 'Test execution (gTAA)', 'Runs selected tests automatically + test logging and test reporting.'),
  f(3, '🔌', 'Test adaptation (gTAA)', 'Adaptors connecting tests to SUT components/interfaces via APIs, protocols, services.', true),
  f(3, '🗂️', 'Test management interface', 'Mapping of test case definitions ↔ automated test cases.'),
  f(3, '🧰', 'Configuration management interface', 'Describes CI/CD pipelines, environments and testware.'),
  f(3, '🏃', 'Test harness', 'Also known as test runner — part of the TAF together with test fixtures.', true),
  f(3, '📜', 'Test scripts layer', 'Test case repository + suite annotations; calls business logic only — NEVER core libraries directly.', true),
  f(3, '🧠', 'Business logic layer', 'SUT-dependent libraries; inherits core classes or uses their facades; sets the TAF up to run against the SUT.'),
  f(3, '⚙️', 'Core libraries layer', 'SUT-independent libraries reusable by any project on the same development stack.'),
  f(3, '⏺️', 'Capture/playback', 'Record manual interactions → scripts. No-code (code hidden) / low-code (code exposed). Easy start; hard to maintain.', true),
  f(3, '📝', 'Linear scripting', 'Programming without custom TAE-made libraries; can modify recorded scripts. Easy start; hard to maintain/scale.', true),
  f(3, '🧱', 'Structured scripting', 'Adds test libraries with reusable elements, steps, user journeys. Maintainable; needs programming & initial investment.', true),
  f(3, '📊', 'Data-driven testing', 'Builds on structured scripting; same scripts fed by data files (.csv, .xlsx, DB dumps). Con: test data management.', true),
  f(3, '🔑', 'Keyword-driven testing', 'Tests = tables of keywords (user perspective) + data; often built upon DDT. Business analysts can join; complex to maintain keywords; heavy for small systems.', true),
  f(3, '🔴', 'Test-driven development', 'Red (failing test) → Green (make it pass) → Refactor. Cons: time to get used to; false confidence if done wrong.', true),
  f(3, '🗣️', 'Behavior-driven development', 'Given/When/Then acceptance criteria in feature files executed by a BDD tool. Needs business + dev involvement.', true),
  f(3, '🧪', 'Model-based testing', 'Using a test model to (automatically) generate test cases — the gTAA test generation capability.', true),
  f(3, '🧾', 'Testware', 'Work products produced for testing: scripts, data, configurations, libraries, etc.', true),
  f(3, '👣', 'Test step', 'A single action within a test case (e.g., click, call an API) — the unit TAS logs record.', true),
  f(3, '🏠', 'Facade pattern', 'Hides implementation details; exposes only what testers need in test cases.'),
  f(3, '☝️', 'Singleton pattern', 'Ensures only ONE driver communicates with the SUT.'),
  f(3, '📄', 'Page object model', 'A page model class per page; locator changes are updated in ONE place.'),
  f(3, '🌊', 'Flow model pattern', 'Extra facade over page objects storing user actions → double facade, reusable steps, better maintainability.'),
  f(3, 'S', 'SOLID', 'Single responsibility, Open-closed, Liskov substitution, Interface (substitution/segregation), Dependency inversion → readability, maintainability, scalability.'),

  // Ch4
  f(4, '🚀', 'Pilot: what to evaluate (technical)', 'Programming language(s), COTS/open-source tools, test levels, test cases selected, development approach.'),
  f(4, '🧑‍🤝‍🧑', 'Pilot: non-technical aspects', 'Team knowledge/experience, team structure, licensing & org rules, planned testing types & targeted levels.'),
  f(4, '📦', 'Technical deployment risks', 'PLTU: Packaging, Logging, Test structuring, Updating.'),
  f(4, '🔩', 'Test fixture', 'Things that must be available for tests to run; control environment & data, pre/postconditions → repeatable, atomic tests.', true),
  f(4, '⚠️', 'Risk (deployment examples)', 'Firewall openings, resource utilization (CPU, RAM), network connection & reliability.', true),
  f(4, '📶', 'Log levels (most → least severe)', 'Fatal · Error · Warn · Info · Debug · Trace — "Fat Elephants Wear Itchy Dotted Ties".'),
  f(4, '🚫', 'Avoid hardcoding by…', 'Data-driven testing (common data source) and constants for rarely changing values.'),

  // Ch5
  f(5, '🏗️', 'Build phase test levels', 'TAF configuration tests, component tests, component integration tests — quality gates of CI.'),
  f(5, '🚚', 'Tests inside deployment phase', 'Can fail the deployment and roll it back (quality gate); rerun requires redeploy.'),
  f(5, '🔓', 'Tests in a separate pipeline', 'Triggered by successful deployment; no quality gate; rollback manual; only deployment checks prove deployment.'),
  f(5, '🗄️', 'Configuration management in TA includes', 'Test environment configuration, test data, test suites/test cases.'),
  f(5, '🎚️', 'Feature toggle (testware)', 'Per release/environment configuration telling testware which suites to run.'),
  f(5, '🤝', 'Contract testing', 'Integration testing that services communicate per agreed rules; beyond schema validation; contract verifies both sides; finds defects earlier.', true),
  f(5, '📱', 'Consumer-driven contract', 'Consumer sets expectations of how the provider shall respond.'),
  f(5, '🖥️', 'Provider-driven contract', 'Provider creates the contract showing how its services operate.'),

  // Ch6
  f(6, '🧾', 'Test log', 'Detailed record of test execution: steps, actions, expected responses — source for analyzing TAS and SUT defects.', true),
  f(6, '📈', 'Test progress report', 'Concise report after a suite run: results, SUT info, environment docs; tailored per stakeholder; published (web, mail, chatbot, test mgmt tool).', true),
  f(6, '📏', 'Measurement vs metric', 'Measurement = assigning a value to an attribute; metric = the measurement scale/method used (e.g., pass rate trend).', true),
  f(6, '🚦', 'TAS failure status', 'Status for a failure whose defect is NOT in the SUT (e.g., in the TAS).'),
  f(6, '🧭', 'Correlation / trace ID', 'Unique ID added to an interaction and reused in every subsequent call — lets the TAS trace behavior.'),
  f(6, '🥇', 'Primary vs secondary data', 'TAS data is primary; SUT data is secondary for result analysis.'),
  f(6, '👔', 'Management stakeholders want…', 'Trends: tests added since last run, pass-fail ratio changes, reliability of TAS & SUT.'),

  // Ch7
  f(7, '🔁', 'Repeatability issue', 'Unreliable tests (race conditions) → move out of the active suite and analyze separately.'),
  f(7, '🩻', 'Intrusiveness', 'Tight TAS–SUT coupling can change SUT behavior/performance → failures not seen in production.'),
  f(7, '❔', 'Missing assertions', 'Lead to inconclusive test results.'),
  f(7, '🛡️', 'Static analysis', 'Finds vulnerabilities & defects in code (SUT and TAF) without executing it; severity critical/high/medium/low; DevSecOps.', true),

  // Ch8
  f(8, '📊', 'Test histogram', 'Visual report of test data across runs → identify fragile tests to refactor.', true),
  f(8, '🧾', 'Schema validation', 'Checks API/DB responses against a schema: mandatory elements present, types match — replaces many assertions.', true),
  f(8, '🩹', 'AI self-healing', 'ML + image recognition detect changed locators, fix the test, report the change.'),
  f(8, '⏱️', 'Best wait mechanism', 'Event subscription (with timeout) > dynamic polling (with timeout) > hard-coded waits.'),
  f(8, '📚', 'Core library upgrade order', 'Pilot → impact analysis → adoption plan → update dependencies.'),
  f(8, '🐣', 'Restructuring approach', 'Incremental MVP changes → limited run → full implementation → full regression run.'),
  f(8, '🎁', 'Other uses of test tools', 'Environment setup & control, data aging, screenshot & video generation.'),
];
