import { LANGUAGE_GROUPS, LANGUAGES, getLanguage } from "../data/languages.ts";
import type { LanguageId } from "../data/languages.ts";
import Button from "./ui/Button.tsx";

const QUICK: LanguageId[] = ["python3", "cpp", "java", "javascript"];

interface LanguagePickerProps {
  value: LanguageId;
  onChange: (id: LanguageId) => void;
  /** Languages that already have code saved for this question. */
  savedLanguages?: LanguageId[];
}

/**
 * Quick toggles for the four languages people reach for most, plus a select
 * holding every language LeetCode accepts. A dot marks languages that already
 * have code saved for this question.
 */
export default function LanguagePicker({
  value,
  onChange,
  savedLanguages = [],
}: LanguagePickerProps) {
  const saved = new Set<LanguageId>(savedLanguages);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {QUICK.map((id) => {
        const language = getLanguage(id);
        const active = value === id;
        return (
          <Button
            key={id}
            size="sm"
            color={active ? "#FFC13B" : undefined}
            onClick={() => onChange(id)}
            aria-pressed={active}
          >
            {language.label}
            {saved.has(id) ? " •" : ""}
          </Button>
        );
      })}

      <select
        className="nb-field w-auto py-1 text-sm font-bold"
        value={value}
        onChange={(event) => onChange(event.target.value as LanguageId)}
        aria-label="Language"
      >
        {LANGUAGE_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.ids.map((id) => {
              const language = getLanguage(id);
              return (
                <option key={id} value={id}>
                  {language.label}
                  {saved.has(id) ? " •" : ""}
                </option>
              );
            })}
          </optgroup>
        ))}
        {LANGUAGES.filter(
          (language) => !LANGUAGE_GROUPS.some((group) => group.ids.includes(language.id))
        ).map((language) => (
          <option key={language.id} value={language.id}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}
