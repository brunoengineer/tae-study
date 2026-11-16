export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type KLevel = 2 | 3 | 4;

export interface Option {
  key: string; // 'a' | 'b' | 'c' | 'd' | 'e'
  text: string;
}

export interface Question {
  /** Unique id. Official: "off-1".."off-40". Practice: "p<chapter>-<nn>", e.g. "p3-07" */
  id: string;
  source: 'official' | 'practice';
  chapter: ChapterId;
  /** Learning objective, e.g. "TAE-3.1.4" */
  lo: string;
  k: KLevel;
  /** Exam points: K2 -> 1, K3 -> 2, K4 -> 3 (official exam may differ slightly) */
  points: 1 | 2 | 3;
  /** Optional scenario / context paragraph shown above the stem */
  scenario?: string;
  /** Optional numbered list (e.g. items to match, roman numerals) rendered under the scenario */
  list?: string[];
  stem: string;
  options: Option[];
  /** Correct option keys. Length 1 = "Select ONE option", 2 = "Select TWO options" */
  correct: string[];
  /** Why each option is right or wrong, keyed by option key */
  explanations: Record<string, string>;
  /** Syllabus section, e.g. "3.1.4" */
  ref: string;
  /** Optional short memory hook shown after answering */
  hook?: string;
}

export interface Flashcard {
  id: string;
  chapter: ChapterId;
  front: string;
  back: string;
  icon?: string;
  keyword?: boolean;
}
