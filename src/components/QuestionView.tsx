import { useEffect, useMemo, useState } from "react";
import CodeEditor from "./CodeEditor.tsx";
import LanguagePicker from "./LanguagePicker.tsx";
import Button from "./ui/Button.tsx";
import Tag from "./ui/Tag.tsx";
import Field from "./ui/Field.tsx";
import { DIFFICULTY_COLORS, formatDate, swatchFor, todayIso } from "../lib/format.ts";
import { getLanguage, DEFAULT_LANGUAGE } from "../data/languages.ts";
import type { LanguageId } from "../data/languages.ts";
import { STATUS } from "../hooks/useLogbook.ts";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect.ts";
import { downloadText } from "../lib/backup.ts";
import type { Entry, LogbookActions, Question } from "../types.ts";

interface QuestionViewProps {
  question: Question;
  entry: Entry;
  actions: LogbookActions;
  onBack: () => void;
}

/**
 * Everything about one question: the prompt metadata, the approach you wrote,
 * and a Monaco editor per language. Notes and code autosave 600ms after you
 * stop typing, so there is no save button to forget.
 */
export default function QuestionView({ question, entry, actions, onBack }: QuestionViewProps) {
  const [note, setNote] = useState(entry.note);
  const [complexity, setComplexity] = useState(entry.complexity);
  const [date, setDate] = useState(entry.date || todayIso());
  const [language, setLanguage] = useState<LanguageId>(entry.lastLanguage || DEFAULT_LANGUAGE);
  const [solutions, setSolutions] = useState<Entry["solutions"]>(entry.solutions || {});
  const [copied, setCopied] = useState(false);

  // Reset local state whenever a different question is opened.
  useEffect(() => {
    setNote(entry.note);
    setComplexity(entry.complexity);
    setDate(entry.date || todayIso());
    setLanguage(entry.lastLanguage || DEFAULT_LANGUAGE);
    setSolutions(entry.solutions || {});
    setCopied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.key]);

  const languageMeta = useMemo(() => getLanguage(language), [language]);
  const code = solutions[language] ?? "";
  const savedLanguages = useMemo(
    () =>
      (Object.keys(solutions) as LanguageId[]).filter(
        (id) => (solutions[id] || "").trim().length > 0
      ),
    [solutions]
  );

  const dirty =
    note !== entry.note ||
    complexity !== entry.complexity ||
    date !== (entry.date || todayIso()) ||
    language !== (entry.lastLanguage || DEFAULT_LANGUAGE) ||
    JSON.stringify(solutions) !== JSON.stringify(entry.solutions || {});

  useDebouncedEffect(
    () => {
      if (!dirty) return;
      actions.saveEntry(question.key, {
        note,
        complexity,
        date,
        solutions,
        lastLanguage: language,
      });
    },
    [note, complexity, date, solutions, language, dirty, question.key],
    600
  );

  const setCode = (next: string) => setSolutions((prev) => ({ ...prev, [language]: next }));

  const useSnippet = () => setCode(languageMeta.snippet || "");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-4">
      <section className="nb-panel p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Tag color={swatchFor(question.patternName)}>{question.patternName}</Tag>
          <Tag color={DIFFICULTY_COLORS[question.difficulty]}>{question.difficulty}</Tag>
          {entry.status !== STATUS.todo && entry.date && (
            <span className="font-mono text-xs font-bold">logged {formatDate(entry.date)}</span>
          )}
          {question.isCustom && <Tag color="#9BB8FF">your own</Tag>}
        </div>

        <h2 className="mb-3 break-words font-display text-2xl sm:text-3xl">{question.title}</h2>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button
            as="a"
            href={question.url}
            target="_blank"
            rel="noreferrer"
            color="#FFC13B"
            className="justify-center text-center no-underline"
          >
            Open on LeetCode
          </Button>
          <Button
            className="justify-center text-center"
            color={entry.status === STATUS.solved ? "#B8F04B" : undefined}
            onClick={() => actions.setStatus(question.key, STATUS.solved)}
          >
            {entry.status === STATUS.solved ? "Solved" : "Mark solved"}
          </Button>
          <Button
            className="justify-center text-center"
            color={entry.status === STATUS.revisit ? "#FF8FB3" : undefined}
            onClick={() => actions.setStatus(question.key, STATUS.revisit)}
          >
            {entry.status === STATUS.revisit ? "Flagged for revisit" : "Flag for revisit"}
          </Button>
          {entry.status !== STATUS.todo && (
            <Button
              className="justify-center text-center"
              onClick={() => {
                if (window.confirm("Delete your notes and code for this question?")) {
                  actions.resetEntry(question.key);
                  setNote("");
                  setComplexity("");
                  setSolutions({});
                }
              }}
            >
              Reset
            </Button>
          )}
          {question.isCustom && (
            <Button
              className="justify-center text-center"
              onClick={() => {
                if (window.confirm("Remove this question from the pattern?")) {
                  actions.removeCustomQuestion(question.key);
                  onBack();
                }
              }}
            >
              Remove question
            </Button>
          )}
        </div>
      </section>

      <section className="nb-panel bg-cream p-4 sm:p-5">
        <h3 className="mb-3 font-display text-lg">My approach</h3>
        <div className="grid gap-3">
          <textarea
            className="nb-field"
            rows={6}
            placeholder="Expand right, shrink left when a duplicate shows up. Keep the last-seen index in a map so left jumps instead of crawling."
            value={note}
            onChange={(event) => setNote(event.target.value)}
            aria-label="Approach"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Field label="Time & space">
                <input
                  className="nb-field font-mono"
                  placeholder="O(n) time, O(1) space"
                  value={complexity}
                  onChange={(event) => setComplexity(event.target.value)}
                />
              </Field>
            </div>
            <Field label="Date">
              <input
                type="date"
                className="nb-field"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="nb-panel bg-ice">
        <div className="flex flex-col gap-2 border-b-3 border-ink bg-frost px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:px-4">
          <span className="font-display text-sm">My solution</span>
          <span className="hidden flex-1 sm:block" />
          <LanguagePicker value={language} onChange={setLanguage} savedLanguages={savedLanguages} />
        </div>

        <CodeEditor
          value={code}
          onChange={setCode}
          languageId={language}
          height="clamp(300px, 55vh, 440px)"
        />

        <div className="flex flex-wrap items-center gap-2 border-t-3 border-ink px-3 py-2 sm:px-4">
          <span className="basis-full font-mono text-[11px] font-bold sm:basis-auto sm:text-xs">
            {dirty ? "unsaved…" : "saved"} · {savedLanguages.length} language
            {savedLanguages.length === 1 ? "" : "s"} stored
          </span>
          <span className="hidden flex-1 sm:block" />
          <Button
            size="sm"
            className="flex-1 justify-center sm:flex-none"
            onClick={useSnippet}
            disabled={!languageMeta.snippet}
          >
            Insert starter
          </Button>
          <Button
            size="sm"
            className="flex-1 justify-center sm:flex-none"
            onClick={copyCode}
            disabled={!code}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            size="sm"
            className="flex-1 justify-center sm:flex-none"
            disabled={!code}
            onClick={() => downloadText(code, `${question.slug}.${languageMeta.ext}`)}
          >
            Download file
          </Button>
        </div>
      </section>
    </div>
  );
}
