import { useSyncExternalStore } from 'react';

/* ===================== Types ===================== */
export interface QStat {
  attempts: number;
  correct: number;
  last: boolean;
  lastAt: number;
  /** Leitner box 0..5 — used to pick "weak spots" */
  box: number;
}
export interface CardStat { box: number; due: number; reviews: number }
export interface ExamRecord {
  at: number;
  kind: 'mock' | 'official';
  points: number;
  max: number;
  correct: number;
  total: number;
  passed: boolean;
  seconds: number;
  perChapter: Record<number, [number, number]>; // chapter -> [pointsEarned, pointsMax]
}
export interface State {
  v: 1;
  xp: number;
  streak: { count: number; best: number; lastDay: string };
  daily: { day: string; xp: number };
  dailyGoal: number;
  q: Record<string, QStat>;
  scenes: Record<string, number>;
  cards: Record<string, CardStat>;
  badges: Record<string, number>;
  exams: ExamRecord[];
  games: Record<string, { best: number; plays: number; perfect: number }>;
  bestCombo: number;
  answered: number;
  answeredCorrect: number;
  cardReviews: number;
  theme: 'dark' | 'light';
  recallMode: boolean;
  visitedChapters: Record<number, number>;
}

const KEY = 'tae-quest-v1';
const today = () => new Date().toISOString().slice(0, 10);

const fresh = (): State => ({
  v: 1, xp: 0,
  streak: { count: 0, best: 0, lastDay: '' },
  daily: { day: today(), xp: 0 },
  dailyGoal: 60,
  q: {}, scenes: {}, cards: {}, badges: {}, exams: [], games: {},
  bestCombo: 0, answered: 0, answeredCorrect: 0, cardReviews: 0,
  theme: 'dark', recallMode: false, visitedChapters: {},
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return fresh();
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}
function set(mut: (s: State) => void) {
  const next: State = structuredClone(state);
  mut(next);
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => sel(state),
  );
}
export const getState = () => state;

/* ===================== Events (toasts, xp floats, level-ups) ===================== */
export type GameEvent =
  | { type: 'toast'; icon: string; title: string; body?: string }
  | { type: 'xp'; amount: number; x?: number; y?: number }
  | { type: 'levelup'; level: number }
  | { type: 'badge'; id: string };

const evListeners = new Set<(e: GameEvent) => void>();
export const onGameEvent = (fn: (e: GameEvent) => void) => { evListeners.add(fn); return () => { evListeners.delete(fn); }; };
export const emit = (e: GameEvent) => evListeners.forEach((l) => l(e));

/* ===================== Levels ===================== */
export const LEVELS = [
  { xp: 0, title: 'Manual Clicker', icon: '🖱️' },
  { xp: 100, title: 'Record & Replay Rookie', icon: '⏺️' },
  { xp: 250, title: 'Linear Scripter', icon: '📜' },
  { xp: 450, title: 'Structured Scripter', icon: '🧱' },
  { xp: 700, title: 'Data Driver', icon: '📊' },
  { xp: 1000, title: 'Keyword Crafter', icon: '🔑' },
  { xp: 1400, title: 'Page Object Pro', icon: '📄' },
  { xp: 1900, title: 'Flow Model Master', icon: '🌊' },
  { xp: 2500, title: 'Pipeline Pilot', icon: '🔁' },
  { xp: 3200, title: 'Framework Architect', icon: '🏗️' },
  { xp: 4000, title: 'Self-Healing Sage', icon: '🩹' },
  { xp: 5000, title: 'Automation Legend', icon: '👑' },
];
export function levelInfo(xp: number) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++;
  const cur = LEVELS[i];
  const next = LEVELS[i + 1];
  const pct = next ? (xp - cur.xp) / (next.xp - cur.xp) : 1;
  return { level: i + 1, ...cur, next, pct, toNext: next ? next.xp - xp : 0 };
}

/* ===================== Badges ===================== */
export interface BadgeDef { id: string; icon: string; name: string; desc: string; test: (s: State) => boolean }
const examPassed = (s: State) => s.exams.some((e) => e.passed);
const chapterScenesDone = (s: State, ch: number, total: number) =>
  Object.keys(s.scenes).filter((k) => k.startsWith(`${ch}-`)).length >= total;

export const BADGES: BadgeDef[] = [
  { id: 'first', icon: '🩸', name: 'First Blood', desc: 'Answer your first question correctly', test: (s) => s.answeredCorrect >= 1 },
  { id: 'combo5', icon: '🔥', name: 'On Fire', desc: 'Reach a 5x answer combo', test: (s) => s.bestCombo >= 5 },
  { id: 'combo10', icon: '☄️', name: 'Unstoppable', desc: 'Reach a 10x answer combo', test: (s) => s.bestCombo >= 10 },
  { id: 'q50', icon: '🎯', name: 'Sharpshooter', desc: 'Answer 50 questions correctly', test: (s) => s.answeredCorrect >= 50 },
  { id: 'q200', icon: '🏹', name: 'Marksman', desc: 'Answer 200 questions correctly', test: (s) => s.answeredCorrect >= 200 },
  { id: 'official', icon: '📜', name: 'By the Book', desc: 'Answer all 40 official sample questions correctly at least once', test: (s) => Array.from({ length: 40 }, (_, i) => s.q[`off-${i + 1}`]?.correct > 0).every(Boolean) },
  { id: 'mock', icon: '🎓', name: 'Exam Ready', desc: 'Pass a mock exam (≥65%)', test: examPassed },
  { id: 'mock80', icon: '🏆', name: 'Overachiever', desc: 'Score ≥80% on a mock exam', test: (s) => s.exams.some((e) => e.points / e.max >= 0.8) },
  { id: 'streak3', icon: '📅', name: 'Habit Builder', desc: '3-day study streak', test: (s) => s.streak.best >= 3 },
  { id: 'streak7', icon: '🗓️', name: 'Relentless', desc: '7-day study streak', test: (s) => s.streak.best >= 7 },
  { id: 'cards50', icon: '🃏', name: 'Card Shark', desc: 'Review 50 flashcards', test: (s) => s.cardReviews >= 50 },
  { id: 'cards200', icon: '🧠', name: 'Memory Palace', desc: 'Review 200 flashcards', test: (s) => s.cardReviews >= 200 },
  { id: 'explorer', icon: '🗺️', name: 'Explorer', desc: 'Open all 8 chapters', test: (s) => Object.keys(s.visitedChapters).length >= 8 },
  { id: 'scholar', icon: '📚', name: 'Scholar', desc: 'Complete every lesson scene', test: (s) => Object.keys(s.scenes).length >= TOTAL_SCENES.value && TOTAL_SCENES.value > 0 },
  { id: 'arch', icon: '🏛️', name: 'Architect', desc: 'Complete all Chapter 3 scenes', test: (s) => chapterScenesDone(s, 3, SCENES_PER_CH.value[3] ?? 99) },
  { id: 'sorter', icon: '🧺', name: 'Neat Freak', desc: 'Get a perfect score in a Sorting game', test: (s) => Object.entries(s.games).some(([k, g]) => k.startsWith('sort:') && g.perfect > 0) },
  { id: 'sequencer', icon: '🔢', name: 'In Order', desc: 'Get a perfect score in a Sequence game', test: (s) => Object.entries(s.games).some(([k, g]) => k.startsWith('seq:') && g.perfect > 0) },
  { id: 'arcade', icon: '🕹️', name: 'Arcade Champ', desc: 'Get perfect scores in 8 different games', test: (s) => Object.values(s.games).filter((g) => g.perfect > 0).length >= 8 },
  { id: 'lvl5', icon: '⭐', name: 'Data Driver', desc: 'Reach level 5', test: (s) => levelInfo(s.xp).level >= 5 },
  { id: 'lvl10', icon: '🌟', name: 'Framework Architect', desc: 'Reach level 10', test: (s) => levelInfo(s.xp).level >= 10 },
  { id: 'night', icon: '🦉', name: 'Nightly Regression', desc: 'Study after 22:00', test: () => new Date().getHours() >= 22 },
  { id: 'early', icon: '🌅', name: 'Morning Build', desc: 'Study before 07:00', test: () => new Date().getHours() < 7 },
];
// Filled in by lessons module to avoid circular imports
export const TOTAL_SCENES = { value: 0 };
export const SCENES_PER_CH: { value: Record<number, number> } = { value: {} };

function checkBadges() {
  const newly: string[] = [];
  for (const b of BADGES) {
    if (!state.badges[b.id] && b.test(state)) newly.push(b.id);
  }
  if (newly.length) {
    set((s) => { newly.forEach((id) => (s.badges[id] = Date.now())); });
    newly.forEach((id) => emit({ type: 'badge', id }));
  }
}

/* ===================== Actions ===================== */
function touchStreak(s: State) {
  const d = today();
  if (s.streak.lastDay === d) return;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  s.streak.count = s.streak.lastDay === y ? s.streak.count + 1 : 1;
  s.streak.best = Math.max(s.streak.best, s.streak.count);
  s.streak.lastDay = d;
}

export function awardXP(amount: number, pos?: { x: number; y: number }) {
  if (amount <= 0) return;
  const before = levelInfo(state.xp).level;
  set((s) => {
    touchStreak(s);
    if (s.daily.day !== today()) s.daily = { day: today(), xp: 0 };
    const wasBelow = s.daily.xp < s.dailyGoal;
    s.xp += amount;
    s.daily.xp += amount;
    if (wasBelow && s.daily.xp >= s.dailyGoal) {
      queueMicrotask(() => emit({ type: 'toast', icon: '🎯', title: 'Daily goal reached!', body: `${s.dailyGoal} XP today — streak secured.` }));
    }
  });
  emit({ type: 'xp', amount, x: pos?.x, y: pos?.y });
  const after = levelInfo(state.xp).level;
  if (after > before) emit({ type: 'levelup', level: after });
  checkBadges();
}

export function recordAnswer(qid: string, ok: boolean, combo: number) {
  set((s) => {
    const st = s.q[qid] ?? { attempts: 0, correct: 0, last: false, lastAt: 0, box: 0 };
    st.attempts++;
    if (ok) st.correct++;
    st.last = ok;
    st.lastAt = Date.now();
    st.box = ok ? Math.min(5, st.box + 1) : 0;
    s.q[qid] = st;
    s.answered++;
    if (ok) s.answeredCorrect++;
    s.bestCombo = Math.max(s.bestCombo, combo);
    touchStreak(s);
  });
  checkBadges();
}

export function markScene(key: string) {
  if (state.scenes[key]) return false;
  set((s) => { s.scenes[key] = Date.now(); });
  awardXP(5);
  return true;
}

export function visitChapter(ch: number) {
  if (state.visitedChapters[ch]) return;
  set((s) => { s.visitedChapters[ch] = Date.now(); });
  checkBadges();
}

/** Leitner intervals in days for boxes 0..5 */
const INTERVALS = [0, 1, 2, 4, 8, 16];
export function reviewCard(id: string, grade: 'again' | 'hard' | 'good' | 'easy') {
  set((s) => {
    const c = s.cards[id] ?? { box: 0, due: 0, reviews: 0 };
    if (grade === 'again') c.box = 0;
    else if (grade === 'hard') c.box = Math.max(1, c.box);
    else if (grade === 'good') c.box = Math.min(5, c.box + 1);
    else c.box = Math.min(5, c.box + 2);
    const days = grade === 'again' ? 0 : INTERVALS[c.box];
    c.due = Date.now() + (grade === 'again' ? 60_000 : days * 86400000);
    c.reviews++;
    s.cards[id] = c;
    s.cardReviews++;
  });
  awardXP(grade === 'again' ? 1 : 2);
}

export function recordExam(rec: ExamRecord) {
  set((s) => { s.exams.push(rec); });
  awardXP(rec.passed ? 150 + Math.round(rec.points) : 40);
}

export function recordGame(id: string, score: number, perfect: boolean) {
  set((s) => {
    const g = s.games[id] ?? { best: 0, plays: 0, perfect: 0 };
    g.plays++;
    g.best = Math.max(g.best, score);
    if (perfect) g.perfect++;
    s.games[id] = g;
  });
  checkBadges();
}

export function setTheme(t: 'dark' | 'light') { set((s) => { s.theme = t; }); }
export function setRecallMode(v: boolean) { set((s) => { s.recallMode = v; }); }
export function setDailyGoal(v: number) { set((s) => { s.dailyGoal = v; }); }
export function resetAll() { state = fresh(); persist(); listeners.forEach((l) => l()); }
export function exportState() { return JSON.stringify(state, null, 2); }
export function importState(json: string) {
  const parsed = JSON.parse(json);
  if (parsed?.v !== 1) throw new Error('Not a TAE Quest save file');
  state = { ...fresh(), ...parsed }; persist(); listeners.forEach((l) => l());
}
export function bootCheck() { checkBadges(); }
