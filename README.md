# DSA Pattern Logbook

A local-first logbook for working through data-structures and algorithms by
pattern. The questions are already in the app — 128 of them across 17 patterns.
What you add is the approach in your own words and the code you wrote, in any
language LeetCode accepts.

Nothing is uploaded anywhere. Everything lives in your browser's IndexedDB.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

Node 18 or newer.

## What's where

```
src/
  main.tsx                 entry point, mounts App inside the error boundary
  App.tsx                  view routing and layout shell
  index.css                Tailwind layers plus the neobrutalist component classes
  types.ts                 shared types for entries, questions and the logbook
  data/
    patterns.ts            THE QUESTION CATALOG — edit this to add questions
    languages.ts           every LeetCode language, mapped to a Monaco grammar
  lib/
    db.ts                  IndexedDB access layer (the only file that talks to the DB)
    backup.ts              JSON export/import and file downloads
    format.ts              dates, slugs, colours, percentages
  hooks/
    useLogbook.ts          owns all persisted state and the actions over it
    useDebouncedEffect.ts  used for autosave
  components/
    AppHeader.tsx          title, counters, progress bar, storage controls
    PatternRail.tsx        the permanent left navigation
    HomeView.tsx           recently logged and next up
    PatternView.tsx        one pattern and its questions
    QuestionView.tsx       one question: metadata, approach, editor
    CodeEditor.tsx         Monaco wrapper with the app's light theme
    LanguagePicker.tsx     quick toggles plus the full language list
    AddQuestionForm.tsx    add a question of your own
    ErrorBoundary.tsx
    ui/                    Button, Tag, Field, ProgressBar, StatusDot
```

## Adding questions

Open `src/data/patterns.ts` and append to the `questions` array of the pattern
you want:

```ts
{ slug: "rotate-array", title: "Rotate Array", difficulty: "Medium" }
```

`slug` is the last segment of the LeetCode URL; the link is built from it. A new
pattern is a new object with `id`, `name`, `idea` and `questions`.

You can also add questions from inside the app. Those are stored in the `custom`
object store rather than in the source file, and are marked "your own".

Saved work is keyed by `patternId/slug`, so editing titles, reordering, or adding
questions never disturbs it. Changing an existing `slug` orphans its entry.

## Languages

`src/data/languages.ts` lists all 25 languages LeetCode accepts, each mapped to
a Monaco grammar, a file extension, and a starter snippet. Code is stored per
language, so one question can hold a Python solution and a C++ one side by side;
a dot in the picker marks languages that already have code saved.

Monaco is loaded from a CDN by default (see `loader.config` in
`CodeEditor.tsx`). To bundle it instead, install `monaco-editor` and drop that
call.

## Data

Two object stores in the `dsa-logbook` database:

- `entries` — keyed by `patternId/slug`: status, date, approach note, complexity,
  and a `solutions` map of language id to code.
- `custom` — questions you added yourself.

Notes and code autosave 600ms after you stop typing. Use **Export JSON** in the
header for a backup you can move to another browser or machine — IndexedDB is
tied to one browser profile and one origin, and clearing site data wipes it.
