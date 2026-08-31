import { useState } from "react";
import Button from "./ui/Button.tsx";
import Field from "./ui/Field.tsx";
import { DIFFICULTIES } from "../data/patterns.ts";
import type { Difficulty } from "../data/patterns.ts";
import { slugFromUrl } from "../lib/format.ts";
import type { QuestionDraft, ResolvedPattern } from "../types.ts";

interface AddQuestionFormProps {
  patterns: ResolvedPattern[];
  initialPatternId: string | null;
  onCancel: () => void;
  onSubmit: (draft: QuestionDraft) => void;
}

/** The fields on screen; the slug is worked out on submit. */
interface FormState {
  patternId: string;
  title: string;
  url: string;
  difficulty: Difficulty;
}

export default function AddQuestionForm({
  patterns,
  initialPatternId,
  onCancel,
  onSubmit,
}: AddQuestionFormProps) {
  const [form, setForm] = useState<FormState>({
    patternId: initialPatternId || patterns[0]?.id || "",
    title: "",
    url: "",
    difficulty: "Medium",
  });
  const [error, setError] = useState("");

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = () => {
    const title = form.title.trim();
    if (!title) {
      setError("Give the question a title first.");
      return;
    }
    const slug = slugFromUrl(form.url, title);
    if (!slug) {
      setError("That title has no letters or numbers to build a slug from.");
      return;
    }
    onSubmit({ ...form, title, slug, url: form.url.trim() });
  };

  return (
    <div className="nb-panel p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl sm:text-2xl">Add your own question</h2>
        <Button size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="grid gap-3">
        <Field label="Question">
          <input
            className="nb-field"
            placeholder="Rotate Array"
            value={form.title}
            onChange={(event) => update({ title: event.target.value })}
          />
        </Field>

        <Field
          label="LeetCode link"
          hint="Optional. Paste the full URL and the slug is taken from it."
        >
          <input
            className="nb-field font-mono"
            placeholder="https://leetcode.com/problems/rotate-array/"
            value={form.url}
            onChange={(event) => update({ url: event.target.value })}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Pattern">
            <select
              className="nb-field"
              value={form.patternId}
              onChange={(event) => update({ patternId: event.target.value })}
            >
              {patterns.map((pattern) => (
                <option key={pattern.id} value={pattern.id}>
                  {pattern.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Difficulty">
            <select
              className="nb-field"
              value={form.difficulty}
              onChange={(event) => update({ difficulty: event.target.value as Difficulty })}
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty}>{difficulty}</option>
              ))}
            </select>
          </Field>
        </div>

        {error && <p className="nb-flat bg-blush p-2 text-sm font-semibold">{error}</p>}

        <Button
          size="lg"
          color="#B8F04B"
          className="w-full justify-center text-center sm:w-auto sm:justify-self-start"
          onClick={submit}
        >
          Add question
        </Button>
      </div>
    </div>
  );
}
