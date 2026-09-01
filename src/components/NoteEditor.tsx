import { useEffect, useRef } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { noteToHtml } from "../lib/richtext.ts";

interface NoteEditorProps {
  /** HTML, or plain text from a note written before this editor existed. */
  value: string;
  /** Called with HTML, or "" once the document is empty again. */
  onChange: (html: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  /** Any CSS length; the editor grows past it as you write. */
  minHeight?: string;
}

/**
 * The approach editor: a TipTap (ProseMirror) surface with lists, headings and
 * inline code, styled to match the rest of the notebook.
 *
 * Most of the point is that you never have to reach for the toolbar. Typing
 * `1. ` starts a numbered list, `- ` a bulleted one, `[] ` a checklist, `# ` a
 * heading, `> ` a quote and ``` a code block; `**bold**`, `*italic*` and
 * `` `code` `` close themselves as you type. Enter continues a list, Tab nests
 * it, and Enter on an empty item ends it.
 */
export default function NoteEditor({
  value,
  onChange,
  placeholder,
  ariaLabel,
  minHeight = "10rem",
}: NoteEditorProps) {
  // Held in a ref so the editor is never rebuilt just because the parent
  // re-rendered with a fresh callback — that would drop the cursor.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Notes sit inside an h3 panel, so the document starts one level down.
        heading: { levels: [3, 4] },
        codeBlock: { HTMLAttributes: { class: "nb-code" } },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noreferrer" } },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: noteToHtml(value),
    editorProps: {
      attributes: {
        class: "nb-prose px-3 py-2 focus:outline-none",
        style: `min-height:${minHeight}`,
        role: "textbox",
        "aria-multiline": "true",
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChangeRef.current(instance.isEmpty ? "" : instance.getHTML());
    },
  });

  // Pull in changes that came from outside the editor — opening a different
  // question, or the Reset button wiping the note.
  useEffect(() => {
    if (!editor) return;
    const incoming = noteToHtml(value);
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (incoming === current) return;
    editor.commands.setContent(incoming, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="border-3 border-ink bg-paper focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[#2b4cff]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

/** What the toolbar needs to know about the selection, in one subscription. */
function useToolbarState(editor: Editor | null) {
  return useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      if (!instance) return null;
      return {
        bold: instance.isActive("bold"),
        italic: instance.isActive("italic"),
        strike: instance.isActive("strike"),
        code: instance.isActive("code"),
        heading: instance.isActive("heading", { level: 3 }),
        orderedList: instance.isActive("orderedList"),
        bulletList: instance.isActive("bulletList"),
        taskList: instance.isActive("taskList"),
        blockquote: instance.isActive("blockquote"),
        codeBlock: instance.isActive("codeBlock"),
        canUndo: instance.can().undo(),
        canRedo: instance.can().redo(),
      };
    },
  });
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const state = useToolbarState(editor);
  if (!editor || !state) return null;

  const chain = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b-3 border-ink bg-frost px-2 py-1.5">
      <ToolButton active={state.heading} label="Heading" onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        H
      </ToolButton>
      <ToolButton active={state.bold} label="Bold" onClick={() => chain().toggleBold().run()}>
        <span className="font-black">B</span>
      </ToolButton>
      <ToolButton active={state.italic} label="Italic" onClick={() => chain().toggleItalic().run()}>
        <span className="italic">I</span>
      </ToolButton>
      <ToolButton active={state.strike} label="Strikethrough" onClick={() => chain().toggleStrike().run()}>
        <span className="line-through">S</span>
      </ToolButton>
      <ToolButton active={state.code} label="Inline code" onClick={() => chain().toggleCode().run()}>
        <span className="font-mono">{"`"}</span>
      </ToolButton>

      <Separator />

      <ToolButton
        active={state.orderedList}
        label="Numbered list"
        onClick={() => chain().toggleOrderedList().run()}
      >
        1.
      </ToolButton>
      <ToolButton
        active={state.bulletList}
        label="Bulleted list"
        onClick={() => chain().toggleBulletList().run()}
      >
        •
      </ToolButton>
      <ToolButton active={state.taskList} label="Checklist" onClick={() => chain().toggleTaskList().run()}>
        ☑
      </ToolButton>

      <Separator />

      <ToolButton active={state.blockquote} label="Quote" onClick={() => chain().toggleBlockquote().run()}>
        ❝
      </ToolButton>
      <ToolButton
        active={state.codeBlock}
        label="Code block"
        onClick={() => chain().toggleCodeBlock().run()}
      >
        <span className="font-mono">{"{}"}</span>
      </ToolButton>
      <ToolButton label="Divider" onClick={() => chain().setHorizontalRule().run()}>
        —
      </ToolButton>

      <span className="hidden flex-1 sm:block" />

      <ToolButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        ↶
      </ToolButton>
      <ToolButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        ↷
      </ToolButton>
    </div>
  );
}

interface ToolButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolButton({ label, active = false, disabled = false, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      // Keep the caret where it is: the toolbar acts on the live selection.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`h-7 min-w-7 border-2 border-ink px-1.5 text-xs font-bold leading-none ${
        active ? "bg-ink text-paper" : "bg-paper text-ink"
      } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-lime"}`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <span aria-hidden className="mx-0.5 h-5 w-0.5 bg-ink/30" />;
}
