/**
 * Notes are stored as one HTML string in the `note` field, which is what the
 * TipTap editor in `components/NoteEditor.tsx` reads and writes.
 *
 * Notes written before the rich editor existed are plain text, so everything
 * that reads a note goes through `noteToHtml` (for the editor) or `noteToText`
 * (for previews and search) rather than touching the field directly. Nothing is
 * rewritten in IndexedDB until you next edit the note, so an untouched logbook
 * keeps its plain-text entries exactly as they were.
 */

/** A tag we would recognise on the way back in — enough to tell HTML from prose. */
const HTML_TAG = /<(p|h[1-6]|ul|ol|li|pre|code|blockquote|br|hr|strong|em|s|u|a)\b[^>]*>/i;

/** Blocks the preview reads one line from. `li` covers both list flavours. */
const BLOCK_SELECTOR = "p, h1, h2, h3, h4, h5, h6, blockquote, pre, li";

export function isHtmlNote(note: string): boolean {
  return HTML_TAG.test(note);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The note as the editor wants it. A legacy plain-text note becomes one
 * paragraph per blank-line-separated block, with single newlines kept as
 * breaks, so nothing anyone wrote gets collapsed.
 */
export function noteToHtml(note: string): string {
  if (!note.trim()) return "";
  if (isHtmlNote(note)) return note;
  return note
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/**
 * The note as flat text, for the pattern-list preview. Blocks are joined with
 * a middot so a list of steps still reads as separate steps on one line.
 *
 * Only blocks that hold no other block contribute, which keeps a `<li><p>…`
 * (how TipTap writes list items) and nested lists from counting twice.
 */
export function noteToText(note: string): string {
  if (!isHtmlNote(note)) return note;
  const body = new DOMParser().parseFromString(note, "text/html").body;
  const lines: string[] = [];
  body.querySelectorAll(BLOCK_SELECTOR).forEach((element) => {
    if (element.querySelector(BLOCK_SELECTOR)) return;
    const text = element.textContent?.replace(/\s+/g, " ").trim();
    if (text) lines.push(text);
  });
  return lines.join(" · ");
}

/** A one-line, plain-text summary of a note, for the question list. */
export function notePreview(note: string, max = 140): string {
  // Legacy notes keep their line breaks, which a one-line preview cannot show.
  const text = noteToText(note).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
