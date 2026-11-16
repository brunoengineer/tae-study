import type { ChapterId, KLevel } from '../types';

export interface LearningObjective {
  id: string;
  k: KLevel;
  text: string;
}

export interface Chapter {
  id: ChapterId;
  title: string;
  short: string;
  emoji: string;
  color: string;
  minutes: number;
  maxK: KLevel;
  keywords: string[];
  los: LearningObjective[];
  /** Number of questions / points this chapter had in the official sample exam (≈ real exam weight) */
  examQuestions: number;
  examPoints: number;
  tagline: string;
}

export const chapters: Chapter[] = [
  {
    id: 1, title: 'Introduction and Objectives for Test Automation', short: 'Why Automate?', emoji: '🎯', color: '#8b6cff',
    minutes: 45, maxK: 2, examQuestions: 3, examPoints: 3,
    tagline: 'Pros, cons, limits — and how automation fits each lifecycle.',
    keywords: ['system under test', 'test automation', 'test automation engineer'],
    los: [
      { id: 'TAE-1.1.1', k: 2, text: 'Explain the advantages and disadvantages of test automation' },
      { id: 'TAE-1.2.1', k: 2, text: 'Explain how test automation is applied across different SDLC models' },
      { id: 'TAE-1.2.2', k: 2, text: 'Select suitable test automation tools for a given system under test' },
    ],
  },
  {
    id: 2, title: 'Preparing for Test Automation', short: 'Get Ready', emoji: '🧭', color: '#22d3ee',
    minutes: 180, maxK: 4, examQuestions: 5, examPoints: 9,
    tagline: 'Testability, environments, and choosing the right tools.',
    keywords: ['API testing', 'GUI testing', 'testability'],
    los: [
      { id: 'TAE-2.1.1', k: 2, text: 'Describe the configuration needs of an infrastructure that enable implementation of test automation' },
      { id: 'TAE-2.1.2', k: 2, text: 'Explain how test automation is leveraged within different environments' },
      { id: 'TAE-2.2.1', k: 4, text: 'Analyze a system under test to determine the appropriate test automation solution' },
      { id: 'TAE-2.2.2', k: 4, text: 'Illustrate the technical findings of a tool evaluation' },
    ],
  },
  {
    id: 3, title: 'Test Automation Architecture', short: 'Architecture', emoji: '🏗️', color: '#ff7a59',
    minutes: 210, maxK: 3, examQuestions: 6, examPoints: 10,
    tagline: 'gTAA, TAF layers, scripting approaches and design patterns.',
    keywords: ['behavior-driven development', 'capture/playback', 'data-driven testing', 'generic test automation architecture', 'keyword-driven testing', 'linear scripting', 'model-based testing', 'structured scripting', 'test adaptation layer', 'test automation framework', 'test automation solution', 'test harness', 'test script', 'testware', 'test step', 'test-driven development'],
    los: [
      { id: 'TAE-3.1.1', k: 2, text: 'Explain the major capabilities in a test automation architecture' },
      { id: 'TAE-3.1.2', k: 2, text: 'Explain how to design a test automation solution' },
      { id: 'TAE-3.1.3', k: 3, text: 'Apply layering of test automation frameworks' },
      { id: 'TAE-3.1.4', k: 3, text: 'Apply different approaches for automating test cases' },
      { id: 'TAE-3.1.5', k: 3, text: 'Apply design principles and design patterns in test automation' },
    ],
  },
  {
    id: 4, title: 'Implementing Test Automation', short: 'Implement', emoji: '🚀', color: '#f72585',
    minutes: 150, maxK: 4, examQuestions: 4, examPoints: 7,
    tagline: 'Pilots, deployment risks and maintainable automation code.',
    keywords: ['risk', 'test fixture'],
    los: [
      { id: 'TAE-4.1.1', k: 3, text: 'Apply guidelines that support effective test automation pilot and deployment activities' },
      { id: 'TAE-4.2.1', k: 4, text: 'Analyze deployment risks and plan mitigation strategies for test automation' },
      { id: 'TAE-4.3.1', k: 2, text: 'Explain which factors support and affect test automation solution maintainability' },
    ],
  },
  {
    id: 5, title: 'Implementation and Deployment Strategies', short: 'CI/CD', emoji: '🔁', color: '#2ec4b6',
    minutes: 90, maxK: 3, examQuestions: 6, examPoints: 8,
    tagline: 'Test levels in pipelines, config management, contract testing.',
    keywords: ['contract testing'],
    los: [
      { id: 'TAE-5.1.1', k: 3, text: 'Apply test automation at different test levels within pipelines' },
      { id: 'TAE-5.1.2', k: 2, text: 'Explain configuration management for testware' },
      { id: 'TAE-5.1.3', k: 2, text: 'Explain test automation dependencies for an API infrastructure' },
    ],
  },
  {
    id: 6, title: 'Test Automation Reporting and Metrics', short: 'Reporting', emoji: '📊', color: '#ffb703',
    minutes: 150, maxK: 4, examQuestions: 4, examPoints: 8,
    tagline: 'Collect, analyze and report — logs, trace IDs, dashboards.',
    keywords: ['measurement', 'metric', 'test log', 'test progress report', 'test step'],
    los: [
      { id: 'TAE-6.1.1', k: 3, text: 'Apply data collection methods from the TAS and the SUT' },
      { id: 'TAE-6.1.2', k: 4, text: 'Analyze data from the TAS and the SUT to better understand test results' },
      { id: 'TAE-6.1.3', k: 2, text: 'Explain how a test progress report is constructed and published' },
    ],
  },
  {
    id: 7, title: 'Verifying the Test Automation Solution', short: 'Verify the TAS', emoji: '✅', color: '#43c59e',
    minutes: 135, maxK: 3, examQuestions: 6, examPoints: 8,
    tagline: 'Who tests the tests? Environment, suites, RCA, static analysis.',
    keywords: ['static analysis'],
    los: [
      { id: 'TAE-7.1.1', k: 3, text: 'Plan to verify the test automation environment including test tool setup' },
      { id: 'TAE-7.1.2', k: 2, text: 'Explain the correct behavior for a given automated test script and/or test suite' },
      { id: 'TAE-7.1.3', k: 2, text: 'Identify where test automation produces unexpected results' },
      { id: 'TAE-7.1.4', k: 2, text: 'Explain how static analysis can aid test automation code quality' },
    ],
  },
  {
    id: 8, title: 'Continuous Improvement', short: 'Improve', emoji: '♻️', color: '#a3e635',
    minutes: 210, maxK: 4, examQuestions: 6, examPoints: 13,
    tagline: 'Histograms, AI self-healing, schema validation, smarter waits.',
    keywords: ['schema validation', 'test histogram'],
    los: [
      { id: 'TAE-8.1.1', k: 3, text: 'Discover opportunities for improving test cases through data collection and analysis' },
      { id: 'TAE-8.1.2', k: 4, text: 'Analyze the technical aspects of a deployed TAS and provide recommendations for improvement' },
      { id: 'TAE-8.1.3', k: 3, text: 'Restructure the automated testware to align with SUT updates' },
      { id: 'TAE-8.1.4', k: 2, text: 'Summarize opportunities for use of test automation tools' },
    ],
  },
];

export const chapterById = (id: number) => chapters.find((c) => c.id === id)!;

export const EXAM = {
  questions: 40,
  maxPoints: 66,
  passPoints: 43,
  passPct: 65,
  minutes: 90,
  extraMinutesNonNative: 23,
};
