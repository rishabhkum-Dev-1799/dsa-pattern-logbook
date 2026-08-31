/** Export and import the whole logbook as a JSON file. */

import type { Backup, BackupPayload, CustomQuestionMap, EntryMap } from "../types.ts";

export const BACKUP_VERSION = 1;

export function buildBackup({ entries, custom }: BackupPayload): Backup {
  return {
    format: "dsa-logbook",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    entries,
    custom,
  };
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, filename);
}

export function downloadText(text: string, filename: string, type = "text/plain"): void {
  downloadBlob(new Blob([text], { type }), filename);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Parse a file the user picked. Only the envelope is checked; the two maps are
 * taken on trust, exactly as the ones read back from IndexedDB are.
 */
export function readBackupFile(file: File): Promise<BackupPayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result));
        if (!isRecord(parsed) || parsed.format !== "dsa-logbook") {
          reject(new Error("That file is not a logbook export"));
          return;
        }
        resolve({
          entries: isRecord(parsed.entries) ? (parsed.entries as EntryMap) : {},
          custom: isRecord(parsed.custom) ? (parsed.custom as CustomQuestionMap) : {},
        });
      } catch {
        reject(new Error("That file is not valid JSON"));
      }
    };
    reader.readAsText(file);
  });
}
