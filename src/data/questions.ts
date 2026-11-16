import type { Question } from '../types';
import { official } from './official';
import { practiceA } from './practiceA';
import { practiceB } from './practiceB';
import { chapters } from './chapters';
import { shuffle } from '../lib/util';

export const allQuestions: Question[] = [...official, ...practiceA, ...practiceB];
export const questionById = new Map(allQuestions.map((q) => [q.id, q]));

/**
 * Build a 40-question mock exam that mirrors the official chapter distribution,
 * spreading picks across learning objectives so every LO tends to be represented.
 */
export function buildMockExam(pool: Question[] = allQuestions): Question[] {
  const picked: Question[] = [];
  for (const ch of chapters) {
    const inCh = shuffle(pool.filter((q) => q.chapter === ch.id));
    const byLo = new Map<string, Question[]>();
    inCh.forEach((q) => byLo.set(q.lo, [...(byLo.get(q.lo) ?? []), q]));
    const los = shuffle([...byLo.keys()]);
    const chosen: Question[] = [];
    let i = 0;
    while (chosen.length < ch.examQuestions && [...byLo.values()].some((v) => v.length)) {
      const list = byLo.get(los[i % los.length])!;
      if (list.length) chosen.push(list.shift()!);
      i++;
    }
    picked.push(...chosen);
  }
  return picked;
}

/** Shuffle option order for practice so you learn content, not letter positions. Keeps keys stable. */
export function withShuffledOptions(q: Question): Question {
  // Matching / ordered option sets ("1C, 2A…", "i and ii") are kept in original order
  if (q.list?.length) return q;
  return { ...q, options: shuffle(q.options) };
}
