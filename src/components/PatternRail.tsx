import { useMemo, useState } from "react";
import StatusDot from "./ui/StatusDot.tsx";
import Button from "./ui/Button.tsx";
import { swatchFor } from "../lib/format.ts";
import { STATUS } from "../hooks/useLogbook.ts";
import type { Entry, Question, ResolvedPattern } from "../types.ts";

interface PatternRailProps {
  patterns: ResolvedPattern[];
  getEntry: (key: string) => Entry;
  activeKey: string | null;
  /** Pattern id → whether its question list is open. */
  expanded: Record<string, boolean>;
  onTogglePattern: (patternId: string) => void;
  onSelectPattern: (patternId: string) => void;
  onSelectQuestion: (question: Question) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /** "rail" sits beside the content; "drawer" fills a slide-over on small screens. */
  variant?: "rail" | "drawer";
  onClose?: () => void;
}

/**
 * Every pattern, expandable to the questions filed under it. On wide screens it
 * is the permanent left rail and the « button shrinks it to a strip; on phones
 * and tablets the same list fills a drawer that closes as soon as you pick
 * something.
 */
export default function PatternRail({
  patterns,
  getEntry,
  activeKey,
  expanded,
  onTogglePattern,
  onSelectPattern,
  onSelectQuestion,
  collapsed,
  onCollapsedChange,
  variant = "rail",
  onClose,
}: PatternRailProps) {
  const [search, setSearch] = useState("");
  const [hideSolved, setHideSolved] = useState(false);

  const isDrawer = variant === "drawer";
  const term = search.trim().toLowerCase();

  const visible = useMemo(
    () =>
      patterns
        .map((pattern) => {
          const matchesPattern = pattern.name.toLowerCase().includes(term);
          const questions = pattern.questions.filter((question) => {
            if (hideSolved && getEntry(question.key).status === STATUS.solved) return false;
            if (!term) return true;
            return matchesPattern || question.title.toLowerCase().includes(term);
          });
          return { pattern, questions };
        })
        .filter(({ questions }) => !term || questions.length > 0),
    [patterns, term, hideSolved, getEntry]
  );

  if (collapsed && !isDrawer) {
    return (
      <Button
        className="w-full py-3 font-display"
        title="Show patterns"
        onClick={() => onCollapsedChange(false)}
      >
        »
      </Button>
    );
  }

  return (
    <nav
      className={
        isDrawer
          ? "flex h-full min-h-0 flex-col"
          : "nb-panel flex max-h-[calc(100vh-40px)] flex-col"
      }
    >
      <div className="shrink-0 border-ink p-3 pb-2">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-display text-base">PATTERNS</span>
          {isDrawer ? (
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          ) : (
            <Button
              size="sm"
              className="font-display"
              title="Collapse the rail"
              onClick={() => onCollapsedChange(true)}
            >
              «
            </Button>
          )}
        </div>

        <input
          className="nb-field mb-2"
          placeholder="Filter questions"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Filter questions"
        />
        <label className="flex items-center gap-2 text-xs font-semibold">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={hideSolved}
            onChange={(event) => setHideSolved(event.target.checked)}
          />
          Hide solved
        </label>
      </div>

      <div className="nb-scroll min-h-0 flex-1 px-3 pb-3 pt-1">
        <div className="grid gap-2">
          {visible.map(({ pattern, questions }) => {
            const open = Boolean(expanded[pattern.id]) || (Boolean(term) && questions.length > 0);
            const solved = pattern.questions.filter(
              (question) => getEntry(question.key).status === STATUS.solved
            ).length;

            return (
              <div key={pattern.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 border-3 border-ink px-2.5 py-2 text-left font-bold"
                  style={{ background: swatchFor(pattern.name) }}
                  aria-expanded={open}
                  onClick={() => {
                    onSelectPattern(pattern.id);
                    onTogglePattern(pattern.id);
                  }}
                >
                  <span aria-hidden="true">{open ? "▾" : "▸"}</span>
                  <span className="min-w-0 flex-1 break-words text-sm">{pattern.name}</span>
                  <span className="shrink-0 font-mono text-xs">
                    {solved}/{pattern.questions.length}
                  </span>
                </button>

                {open && (
                  <ul>
                    {questions.map((question) => {
                      const selected = activeKey === question.key;
                      return (
                        <li key={question.key}>
                          <button
                            type="button"
                            onClick={() => onSelectQuestion(question)}
                            className={`flex w-full items-center gap-2 border-x-3 border-b-2 border-ink px-2.5 py-2 text-left text-[13px] ${
                              selected ? "bg-amber font-bold" : "bg-paper hover:bg-[#F1EDE0]"
                            }`}
                            aria-current={selected ? "true" : undefined}
                          >
                            <StatusDot status={getEntry(question.key).status} />
                            <span className="min-w-0 flex-1 break-words">{question.title}</span>
                          </button>
                        </li>
                      );
                    })}
                    {questions.length === 0 && (
                      <li className="border-x-3 border-b-2 border-ink bg-paper px-2.5 py-1.5 text-[13px] text-ink/60">
                        nothing left here
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="mt-3 text-xs font-semibold">No question matches that search.</p>
        )}
      </div>
    </nav>
  );
}
