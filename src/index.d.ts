export interface HskLevels { hsk2?: number; hsk3?: number; hsk3_2025?: number; }
export type HskData = Record<string, HskLevels>;
export interface Sentence { text: string; id?: string | number; }
export interface Grade extends Sentence {
  normalized: string;
  tokens: { word: string; level: number | null }[];
  counts: Record<string, number>;
  level: number | null;
  highestKnownLevel: number | null;
  coverage: number;
  unlisted: string[];
}
export type CompactGrade = Pick<Grade, 'level' | 'highestKnownLevel' | 'coverage' | 'unlisted'>;
export function levelLabel(level: number): string;
export function parseSentences(input: string): Sentence[];
export function createGrader(hsk: HskData, simplify?: (text: string) => string, version?: keyof HskLevels): (sentence: Sentence) => Grade;
export function createDualGrader(hsk: HskData, simplify?: (text: string) => string): (sentence: Sentence) => { hsk3_2025: Grade; hsk2: Grade };
export function compactGrade(grade: Grade): CompactGrade;
