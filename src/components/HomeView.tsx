import { useMemo } from "react";
import Tag from "./ui/Tag.tsx";
import StatusDot from "./ui/StatusDot.tsx";
import { DIFFICULTY_COLORS, formatDate, swatchFor } from "../lib/format.ts";
import { STATUS } from "../hooks/useLogbook.ts";
import type { Entry, EntryMap, Question, Stats } from "../types.ts";

interface HomeViewProps {
  stats: Stats;
  allQuestions: Question[];
  entries: EntryMap;
  getEntry: (key: string) => Entry;
  onSelectQuestion: (question: Question) => void;
}

export default function HomeView({
  stats,
  allQuestions,
  entries,
  getEntry,
  onSelectQuestion,
}: HomeViewProps) {
  const recent = useMemo(
    () =>
      Object.entries(entries)
        .filter(([, entry]) => entry.status !== STATUS.todo)
        .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0))
        .slice(0, 6)
        .map(([key]) => allQuestions.find((question) => question.key === key))
        .filter((question): question is Question => Boolean(question)),
    [entries, allQuestions]
  );

  const nextUp = useMemo(
    () => allQuestions.filter((question) => getEntry(question.key).status === STATUS.todo).slice(0, 6),
    [allQuestions, getEntry]
  );

  return (
    <div className="grid gap-4">
      <section className="nb-panel bg-lilac p-5 sm:p-6">
        <h2 className="mb-3 font-display text-2xl sm:text-3xl md:text-4xl">
          {stats.solved} DOWN,
          <br />
          {stats.total - stats.solved} TO GO
        </h2>
        <p className="max-w-[58ch] text-sm">
          Open a pattern in the left rail, pick a question, and write the approach in your own
          words before pasting the code. Notes and code save themselves; nothing leaves this
          browser.
        </p>
      </section>

      {recent.length > 0 && (
        <section className="nb-panel p-4 sm:p-5">
          <h3 className="mb-3 font-display text-lg">Recently logged</h3>
          <ul className="grid gap-2">
            {recent.map((question) => (
              <li key={question.key}>
                <button
                  type="button"
                  className="nb-flat flex w-full flex-wrap items-center gap-2 p-3 text-left"
                  onClick={() => onSelectQuestion(question)}
                >
                  <StatusDot status={getEntry(question.key).status} />
                  <span className="min-w-0 flex-1 break-words text-sm font-semibold">
                    {question.title}
                  </span>
                  <span className="font-mono text-xs">{formatDate(getEntry(question.key).date)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {nextUp.length > 0 && (
        <section className="nb-panel p-4 sm:p-5">
          <h3 className="mb-3 font-display text-lg">Next up</h3>
          <ul className="grid gap-2">
            {nextUp.map((question) => (
              <li key={question.key}>
                <button
                  type="button"
                  className="nb-flat flex w-full flex-wrap items-center gap-2 p-3 text-left"
                  onClick={() => onSelectQuestion(question)}
                >
                  <Tag color={swatchFor(question.patternName)}>{question.patternName}</Tag>
                  <span className="min-w-0 flex-1 basis-full break-words text-sm font-semibold sm:basis-auto">
                    {question.title}
                  </span>
                  <Tag color={DIFFICULTY_COLORS[question.difficulty]}>{question.difficulty}</Tag>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
