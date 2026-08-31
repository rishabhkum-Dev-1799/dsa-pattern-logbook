import { useCallback, useMemo, useRef } from "react";
import Editor, { loader, type Monaco, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";
import { getLanguage } from "../data/languages.ts";
import type { LanguageId } from "../data/languages.ts";

/**
 * Monaco with a light theme that matches the rest of the app. The theme is
 * registered once, on the first mount, through the shared loader.
 */
const THEME = "logbook-light";

let themeRegistered = false;

function registerTheme(monaco: Monaco): void {
  if (themeRegistered) return;
  monaco.editor.defineTheme(THEME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6B665E", fontStyle: "italic" },
      { token: "keyword", foreground: "9C2BAD" },
      { token: "string", foreground: "1F7A4D" },
      { token: "number", foreground: "B14A00" },
      { token: "type", foreground: "1B4FBF" },
    ],
    colors: {
      "editor.background": "#EAF3FF",
      "editor.foreground": "#141210",
      "editorLineNumber.foreground": "#8FA9C7",
      "editorLineNumber.activeForeground": "#141210",
      "editor.selectionBackground": "#C9E2FF",
      "editor.lineHighlightBackground": "#DCEBFF",
      "editorCursor.foreground": "#141210",
      "editorIndentGuide.background1": "#CBDDF2",
    },
  });
  themeRegistered = true;
}

loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" } });

interface CodeEditorProps {
  value: string;
  onChange?: (next: string) => void;
  languageId: LanguageId;
  readOnly?: boolean;
  height?: number | string;
}

export default function CodeEditor({
  value,
  onChange,
  languageId,
  readOnly = false,
  height = 420,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const language = useMemo(() => getLanguage(languageId), [languageId]);
  // Sideways dragging inside an editor is miserable on a phone, so wrap there.
  const isNarrow = useMediaQuery("(max-width: 640px)");

  const handleMount = useCallback<OnMount>((mountedEditor, monaco) => {
    editorRef.current = mountedEditor;
    registerTheme(monaco);
    monaco.editor.setTheme(THEME);
  }, []);

  const options = useMemo<editor.IStandaloneEditorConstructionOptions>(
    () => ({
      readOnly,
      domReadOnly: readOnly,
      minimap: { enabled: false },
      fontSize: isNarrow ? 12 : 13,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontLigatures: false,
      lineNumbersMinChars: 3,
      scrollBeyondLastLine: false,
      renderLineHighlight: readOnly ? "none" : "line",
      tabSize: 4,
      insertSpaces: true,
      automaticLayout: true,
      padding: { top: 12, bottom: 12 },
      smoothScrolling: false,
      scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      wordWrap: isNarrow ? "on" : "off",
      bracketPairColorization: { enabled: true },
    }),
    [readOnly, isNarrow]
  );

  return (
    <div className="min-w-0" style={{ height }}>
      <Editor
        height="100%"
        theme={THEME}
        language={language.monaco}
        value={value}
        onChange={(next) => onChange?.(next ?? "")}
        onMount={handleMount}
        options={options}
        loading={<div className="p-4 font-mono text-xs">Loading editor…</div>}
      />
    </div>
  );
}
