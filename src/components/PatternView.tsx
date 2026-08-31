import Button from "./ui/Button.tsx";
import Tag from "./ui/Tag.tsx";
import StatusDot from "./ui/StatusDot.tsx";
import ProgressBar from "./ui/ProgressBar.tsx";
import { DIFFICULTY_COLORS, formatDate, percent, swatchFor } from "../lib/format.ts";
import { STATUS } from "../hooks/useLogbook.ts";
import type { Entry, Question, ResolvedPattern } from "../types.ts";

interface PatternViewProps {
  pattern: ResolvedPattern;
  getEntry: (key: string) => Entry;
  onSelectQuestion: (question: Question) => void;
  onAddQuestion: (patternId: string) => void;
}

export default function PatternView({
  pattern,
  getEntry,
  onSelectQuestion,
  onAddQuestion,
}: PatternViewProps) {
  const solved = pattern.questions.filter(
    (question) => getEntry(question.key).status === STATUS.solved
  ).length;

  return (
    <div className="grid gap-4">
      <section className="nb-panel p-4 sm:p-5" style={{ background: swatchFor(pattern.name) }}>
        <h2 className="mb-2 break-words font-display text-2xl sm:text-3xl">{pattern.name}</h2>
        <p className="mb-3 max-w-[60ch] text-sm">{pattern.idea}</p>
        <ProgressBar
          value={percent(solved, pattern.questions.length)}
          label={`${pattern.name} progress`}
          className="w-full max-w-xs"
        />
        <p className="mt-2 text-xs font-semibold">
          {solved} of {pattern.questions.length} solved
        </p>
      </section>

      <ul className="grid gap-3">
        {pattern.questions.map((question) => {
          const entry = getEntry(question.key);
          return (
            <li key={question.key}>
              <button
                type="button"
                className="nb-panel w-full p-3 text-left sm:p-4"
                onClick={() => onSelectQuestion(question)}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <StatusDot status={entry.status} />
                  <Tag color={DIFFICULTY_COLORS[question.difficulty]}>{question.difficulty}</Tag>
                  {entry.status === STATUS.solved && (
                    <span className="font-mono text-xs font-bold">{formatDate(entry.date)}</span>
                  )}
                  {entry.status === STATUS.revisit && <Tag color="#FF8FB3">revisit</Tag>}
                  {entry.status === STATUS.todo && (
                    <span className="font-mono text-xs font-bold text-ink/60">not logged</span>
                  )}
                  {question.isCustom && <Tag color="#9BB8FF">your own</Tag>}
                </div>
                <div className="break-words font-display text-base sm:text-lg">{question.title}</div>
                {entry.note && (
                  <p className="mt-1 text-sm text-ink/75">
                    {entry.note.slice(0, 140)}
                    {entry.note.length > 140 ? "…" : ""}
                  </p>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <Button
        className="w-full justify-center text-center sm:w-auto sm:justify-self-start"
        color="#FFC13B"
        onClick={() => onAddQuestion(pattern.id)}
      >
        + Add a question to this pattern
      </Button>
    </div>
  );
}
