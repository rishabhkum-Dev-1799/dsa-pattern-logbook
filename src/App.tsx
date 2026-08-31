import { useCallback, useEffect, useState, type ReactNode } from "react";
import AppHeader from "./components/AppHeader.tsx";
import AppFooter from "./components/AppFooter.tsx";
import MobileTopBar from "./components/MobileTopBar.tsx";
import PatternRail from "./components/PatternRail.tsx";
import HomeView from "./components/HomeView.tsx";
import PatternView from "./components/PatternView.tsx";
import QuestionView from "./components/QuestionView.tsx";
import AddQuestionForm from "./components/AddQuestionForm.tsx";
import { useLogbook } from "./hooks/useLogbook.ts";
import type { Question, QuestionDraft } from "./types.ts";

const VIEW = {
  home: "home",
  pattern: "pattern",
  question: "question",
  addQuestion: "addQuestion",
} as const;

type ViewName = (typeof VIEW)[keyof typeof VIEW];

export default function App() {
  const logbook = useLogbook();
  const { patterns, allQuestions, questionsByKey, entries, getEntry, stats, actions, ready, storage } =
    logbook;

  const [view, setView] = useState<ViewName>(VIEW.home);
  const [activePatternId, setActivePatternId] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activePattern = patterns.find((pattern) => pattern.id === activePatternId) || null;
  const activeQuestion = activeKey ? questionsByKey[activeKey] : null;

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // The drawer belongs to small screens only. Closing it on Escape and on a
  // widen past the rail breakpoint keeps the scroll lock below from outliving
  // the overlay it was meant for.
  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    const onWiden = () => {
      if (desktop.matches) setDrawerOpen(false);
    };
    onWiden();
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onWiden);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onWiden);
    };
  }, [drawerOpen]);

  const openQuestion = useCallback(
    (question: Question) => {
      setActiveKey(question.key);
      setActivePatternId(question.patternId);
      setView(VIEW.question);
      setDrawerOpen(false);
    },
    []
  );

  const openPattern = useCallback((patternId: string) => {
    setActivePatternId(patternId);
    setView(VIEW.pattern);
  }, []);

  const togglePattern = useCallback((patternId: string) => {
    setExpanded((prev) => ({ ...prev, [patternId]: !prev[patternId] }));
  }, []);

  const handleAddQuestion = useCallback(
    (draft: QuestionDraft) => {
      const key = actions.addCustomQuestion({
        patternId: draft.patternId,
        slug: draft.slug,
        title: draft.title,
        difficulty: draft.difficulty,
        url: draft.url,
      });
      setExpanded((prev) => ({ ...prev, [draft.patternId]: true }));
      setActivePatternId(draft.patternId);
      setActiveKey(key);
      setView(VIEW.question);
    },
    [actions]
  );

  const goHome = useCallback(() => {
    setView(VIEW.home);
    setDrawerOpen(false);
  }, []);

  const goAddQuestion = useCallback(() => {
    setView(VIEW.addQuestion);
    setDrawerOpen(false);
  }, []);

  let main: ReactNode;
  if (!ready) {
    main = <div className="nb-panel p-6 font-display text-xl">Opening your logbook…</div>;
  } else if (view === VIEW.addQuestion) {
    main = (
      <AddQuestionForm
        patterns={patterns}
        initialPatternId={activePatternId}
        onCancel={() => setView(activePattern ? VIEW.pattern : VIEW.home)}
        onSubmit={handleAddQuestion}
      />
    );
  } else if (view === VIEW.question && activeQuestion) {
    main = (
      <QuestionView
        key={activeQuestion.key}
        question={activeQuestion}
        entry={getEntry(activeQuestion.key)}
        actions={actions}
        onBack={() => setView(VIEW.pattern)}
      />
    );
  } else if (view === VIEW.pattern && activePattern) {
    main = (
      <PatternView
        pattern={activePattern}
        getEntry={getEntry}
        onSelectQuestion={openQuestion}
        onAddQuestion={(patternId) => {
          setActivePatternId(patternId);
          setView(VIEW.addQuestion);
        }}
      />
    );
  } else {
    main = (
      <HomeView
        stats={stats}
        allQuestions={allQuestions}
        entries={entries}
        getEntry={getEntry}
        onSelectQuestion={openQuestion}
      />
    );
  }

  /** Shared by the desktop rail and the mobile drawer; only the chrome differs. */
  const railProps = {
    patterns,
    getEntry,
    activeKey,
    expanded,
    onTogglePattern: togglePattern,
    onSelectPattern: openPattern,
    onSelectQuestion: openQuestion,
  };

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-5">
      <MobileTopBar
        onOpenMenu={() => setDrawerOpen(true)}
        onHome={goHome}
        onAddQuestion={goAddQuestion}
        menuOpen={drawerOpen}
      />

      <div className="mx-auto max-w-[1200px]">
        <AppHeader
          stats={stats}
          storage={storage}
          actions={actions}
          onHome={goHome}
          onAddQuestion={goAddQuestion}
        />
      </div>

      <div className="mx-auto flex max-w-[1200px] items-start gap-4">
        {/* Permanent rail from 1024px up; below that it lives in the drawer. */}
        <div
          className={`sticky top-4 hidden shrink-0 grow-0 lg:block ${
            railCollapsed ? "basis-[54px]" : "basis-[280px]"
          }`}
        >
          <PatternRail
            {...railProps}
            collapsed={railCollapsed}
            onCollapsedChange={setRailCollapsed}
          />
        </div>

        <main className="min-w-0 flex-1">{main}</main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close patterns menu"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/60"
            onClick={closeDrawer}
          />
          <div
            id="pattern-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Patterns"
            className="nb-slide-in absolute inset-y-0 left-0 flex w-[min(86vw,330px)] flex-col border-r-3 border-ink bg-paper"
          >
            <PatternRail
              {...railProps}
              collapsed={false}
              onCollapsedChange={() => {}}
              variant="drawer"
              onClose={closeDrawer}
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1200px]">
        <AppFooter />
      </div>
    </div>
  );
}
