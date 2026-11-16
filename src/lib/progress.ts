import type { State } from './store';
import { chapters, EXAM } from '../data/chapters';
import { allQuestions } from '../data/questions';
import { scenesFor, sceneKey } from '../data/lessons';
import { flashcards } from '../data/flashcards';

export function chapterStats(s: State, ch: number) {
  const qs = allQuestions.filter((q) => q.chapter === ch);
  const attempted = qs.filter((q) => s.q[q.id]);
  const lastRight = attempted.filter((q) => s.q[q.id].last).length;
  const scenes = scenesFor(ch);
  const scenesDone = scenes.filter((_, i) => s.scenes[sceneKey(ch, i)]).length;
  // Bayesian-smoothed accuracy: start from 25% (random guess) with weight 3
  const prior = 3;
  const acc = (lastRight + 0.25 * prior) / (attempted.length + prior);
  const mastery = 0.3 * (scenesDone / scenes.length) + 0.7 * (lastRight / qs.length);
  return { total: qs.length, attempted: attempted.length, lastRight, acc, scenes: scenes.length, scenesDone, mastery };
}

export function readiness(s: State) {
  let pts = 0;
  for (const c of chapters) pts += c.examPoints * chapterStats(s, c.id).acc;
  const pct = Math.round((pts / EXAM.maxPoints) * 100);
  return { predictedPoints: Math.round(pts), pct };
}

export function weakQuestions(s: State) {
  return allQuestions.filter((q) => s.q[q.id] && (!s.q[q.id].last || s.q[q.id].box < 2));
}

export function dueCards(s: State) {
  const now = Date.now();
  return flashcards.filter((c) => !s.cards[c.id] || s.cards[c.id].due <= now);
}

export function nextScene(s: State): { ch: number; idx: number } | null {
  for (const c of chapters) {
    const sc = scenesFor(c.id);
    for (let i = 0; i < sc.length; i++) if (!s.scenes[sceneKey(c.id, i)]) return { ch: c.id, idx: i };
  }
  return null;
}
