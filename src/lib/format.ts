/** Small pure helpers shared across the UI. */

import type { Difficulty } from "../data/patterns.ts";

export const SWATCHES = [
  "#B8F04B",
  "#7FD1FF",
  "#FF8FB3",
  "#FFC13B",
  "#C4A5FF",
  "#5EE6C1",
  "#FF9E6B",
  "#9BB8FF",
];

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "#B8F04B",
  Medium: "#FFC13B",
  Hard: "#FF8FB3",
};

/** Stable colour per pattern name, so a pattern keeps its colour across views. */
export function swatchFor(name = ""): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  }
  return SWATCHES[hash % SWATCHES.length];
}

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function slugify(value = ""): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** Pull the slug out of a LeetCode URL, or fall back to slugifying the title. */
export function slugFromUrl(url = "", fallbackTitle = ""): string {
  const marker = "/problems/";
  if (url.includes(marker)) {
    const tail = url.split(marker)[1].split(/[/?#]/)[0];
    if (tail) return tail;
  }
  return slugify(fallbackTitle);
}

export const questionKey = (patternId: string, slug: string): string => `${patternId}/${slug}`;

export function percent(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

/** Anything can be thrown; this gets a sentence out of it for the UI. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
