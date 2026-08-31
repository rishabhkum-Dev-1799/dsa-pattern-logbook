import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PATTERNS, leetcodeUrl } from "../data/patterns.ts";
import { DEFAULT_LANGUAGE } from "../data/languages.ts";
import { errorMessage, questionKey, todayIso } from "../lib/format.ts";
import * as db from "../lib/db.ts";
import { buildBackup } from "../lib/backup.ts";
import type {
  BackupPayload,
  CustomQuestion,
  CustomQuestionMap,
  Entry,
  EntryMap,
  Logbook,
  Question,
  QuestionDraft,
  ResolvedPattern,
  Stats,
  Status,
  StorageStatus,
} from "../types.ts";

/** `as const` so `STATUS.solved` narrows to "solved", not to the whole union. */
export const STATUS = {
  todo: "todo",
  solved: "solved",
  revisit: "revisit",
} as const satisfies Record<Status, Status>;

export const EMPTY_ENTRY: Entry = {
  status: STATUS.todo,
  date: "",
  note: "",
  complexity: "",
  solutions: {},
  lastLanguage: DEFAULT_LANGUAGE,
};

/**
 * Owns every piece of persisted state: the entries map, the questions the user
 * added, and the connection status of IndexedDB. Components read from here and
 * call the returned actions; nothing else touches the database.
 */
export function useLogbook(): Logbook {
  const [entries, setEntries] = useState<EntryMap>({});
  const [custom, setCustom] = useState<CustomQuestionMap>({});
  const [ready, setReady] = useState(false);
  const [storage, setStorage] = useState<StorageStatus>({ state: "connecting", message: "" });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const [savedEntries, savedCustom] = await Promise.all([
          db.readEntries(),
          db.readCustomQuestions(),
        ]);
        if (!mounted.current) return;
        setEntries(savedEntries);
        setCustom(savedCustom);
        setStorage({ state: "saved", message: "" });
      } catch (error) {
        if (!mounted.current) return;
        setStorage({ state: "error", message: errorMessage(error) });
      } finally {
        if (mounted.current) setReady(true);
      }
    })();
  }, []);

  /** Run a write, keeping the status indicator honest about what happened. */
  const persist = useCallback(async (work: () => Promise<unknown>) => {
    setStorage((prev) => (prev.state === "error" ? prev : { state: "saving", message: "" }));
    try {
      await work();
      if (mounted.current) setStorage({ state: "saved", message: "" });
    } catch (error) {
      if (mounted.current) setStorage({ state: "error", message: errorMessage(error) });
    }
  }, []);

  /* ---------------- questions ---------------- */

  const patterns = useMemo<ResolvedPattern[]>(() => {
    const extras = Object.values(custom);
    return PATTERNS.map((pattern) => {
      const own = extras
        .filter((question) => question.patternId === pattern.id)
        .sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
      const questions: Question[] = [...pattern.questions, ...own].map((question) => ({
        slug: question.slug,
        title: question.title,
        difficulty: question.difficulty,
        patternId: pattern.id,
        patternName: pattern.name,
        key: questionKey(pattern.id, question.slug),
        url: question.url || leetcodeUrl(question.slug),
        isCustom: "isCustom" in question && question.isCustom === true,
      }));
      return { ...pattern, questions };
    });
  }, [custom]);

  const allQuestions = useMemo(() => patterns.flatMap((p) => p.questions), [patterns]);

  const questionsByKey = useMemo(
    () => Object.fromEntries(allQuestions.map((q) => [q.key, q])) as Record<string, Question>,
    [allQuestions]
  );

  const getEntry = useCallback((key: string): Entry => entries[key] || EMPTY_ENTRY, [entries]);

  const stats = useMemo<Stats>(() => {
    const total = allQuestions.length;
    let solved = 0;
    let revisit = 0;
    allQuestions.forEach((q) => {
      const status = entries[q.key]?.status;
      if (status === STATUS.solved) solved += 1;
      if (status === STATUS.revisit) revisit += 1;
    });
    const started = patterns.filter((p) =>
      p.questions.some((q) => entries[q.key] && entries[q.key].status !== STATUS.todo)
    ).length;
    return { total, solved, revisit, started, patterns: patterns.length };
  }, [allQuestions, entries, patterns]);

  /* ---------------- actions ---------------- */

  const saveEntry = useCallback(
    (key: string, patch: Partial<Entry>): Entry => {
      const next: Entry = {
        ...EMPTY_ENTRY,
        ...entries[key],
        ...patch,
        updatedAt: Date.now(),
      };
      if (next.status === STATUS.todo) next.status = STATUS.solved;
      if (!next.date) next.date = todayIso();
      setEntries((prev) => ({ ...prev, [key]: next }));
      void persist(() => db.putEntry(key, next));
      return next;
    },
    [entries, persist]
  );

  const setStatus = useCallback(
    (key: string, status: Status) => saveEntry(key, { status }),
    [saveEntry]
  );

  const resetEntry = useCallback(
    (key: string) => {
      setEntries((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      void persist(() => db.deleteEntry(key));
    },
    [persist]
  );

  const addCustomQuestion = useCallback(
    ({ patternId, slug, title, difficulty, url }: QuestionDraft): string => {
      const key = questionKey(patternId, slug);
      if (questionsByKey[key]) return key;
      const record: CustomQuestion = {
        patternId,
        slug,
        title,
        difficulty,
        url: url || leetcodeUrl(slug),
        isCustom: true,
        addedAt: Date.now(),
      };
      setCustom((prev) => ({ ...prev, [key]: record }));
      void persist(() => db.putCustomQuestion(key, record));
      return key;
    },
    [questionsByKey, persist]
  );

  const removeCustomQuestion = useCallback(
    (key: string) => {
      setCustom((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setEntries((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      void persist(async () => {
        await db.deleteCustomQuestion(key);
        await db.deleteEntry(key);
      });
    },
    [persist]
  );

  const importBackup = useCallback(
    ({ entries: nextEntries, custom: nextCustom }: BackupPayload) => {
      setEntries(nextEntries);
      setCustom(nextCustom);
      void persist(() => db.replaceAll({ entries: nextEntries, custom: nextCustom }));
    },
    [persist]
  );

  const clearEverything = useCallback(() => {
    setEntries({});
    setCustom({});
    void persist(() => db.clearAll());
  }, [persist]);

  const exportData = useCallback(() => buildBackup({ entries, custom }), [entries, custom]);

  return {
    ready,
    storage,
    patterns,
    allQuestions,
    questionsByKey,
    entries,
    getEntry,
    stats,
    actions: {
      saveEntry,
      setStatus,
      resetEntry,
      addCustomQuestion,
      removeCustomQuestion,
      importBackup,
      clearEverything,
      exportData,
    },
  };
}
