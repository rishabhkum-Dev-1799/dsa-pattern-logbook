/**
 * The shapes that travel between the database, the logbook hook and the views.
 *
 * The catalog types (`Pattern`, `Difficulty`) live next to the catalog itself in
 * `data/patterns.ts`, and the language types in `data/languages.ts`. Everything
 * here describes state the user creates.
 */

import type { Difficulty } from "./data/patterns.ts";
import type { LanguageId } from "./data/languages.ts";

export type Status = "todo" | "solved" | "revisit";

/**
 * A question as the views see it: the catalog fields plus the pattern it sits
 * under and the `key` its entry is stored against.
 */
export interface Question {
  slug: string;
  title: string;
  difficulty: Difficulty;
  url: string;
  patternId: string;
  patternName: string;
  /** `"<patternId>/<slug>"` — the primary key in both object stores. */
  key: string;
  isCustom: boolean;
}

/** A pattern with its catalog questions and the user's own merged together. */
export interface ResolvedPattern {
  id: string;
  name: string;
  idea: string;
  questions: Question[];
}

/** A question the user added, exactly as it is held in the `custom` store. */
export interface CustomQuestion {
  patternId: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  url: string;
  isCustom: true;
  addedAt: number;
}

/** What the user writes for one question, as held in the `entries` store. */
export interface Entry {
  status: Status;
  /** ISO `YYYY-MM-DD`, or "" before anything is logged. */
  date: string;
  note: string;
  complexity: string;
  /** Code per language; a language is absent until you type in it. */
  solutions: Partial<Record<LanguageId, string>>;
  lastLanguage: LanguageId;
  updatedAt?: number;
}

export type EntryMap = Record<string, Entry>;
export type CustomQuestionMap = Record<string, CustomQuestion>;

export type StorageState = "connecting" | "saving" | "saved" | "error";

export interface StorageStatus {
  state: StorageState;
  /** Only meaningful while `state` is "error". */
  message: string;
}

export interface Stats {
  total: number;
  solved: number;
  revisit: number;
  /** Patterns with at least one question logged. */
  started: number;
  patterns: number;
}

/** What `AddQuestionForm` hands back once the slug has been worked out. */
export interface QuestionDraft {
  patternId: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  url: string;
}

/** The two object stores, as they travel through export and import. */
export interface BackupPayload {
  entries: EntryMap;
  custom: CustomQuestionMap;
}

export interface Backup extends BackupPayload {
  format: "dsa-logbook";
  version: number;
  exportedAt: string;
}

export interface LogbookActions {
  saveEntry: (key: string, patch: Partial<Entry>) => Entry;
  setStatus: (key: string, status: Status) => Entry;
  resetEntry: (key: string) => void;
  /** Returns the key of the new question, or of the existing one it matched. */
  addCustomQuestion: (draft: QuestionDraft) => string;
  removeCustomQuestion: (key: string) => void;
  importBackup: (payload: BackupPayload) => void;
  clearEverything: () => void;
  exportData: () => Backup;
}

export interface Logbook {
  /** False until the first read from IndexedDB has settled, either way. */
  ready: boolean;
  storage: StorageStatus;
  patterns: ResolvedPattern[];
  allQuestions: Question[];
  questionsByKey: Record<string, Question>;
  entries: EntryMap;
  getEntry: (key: string) => Entry;
  stats: Stats;
  actions: LogbookActions;
}
