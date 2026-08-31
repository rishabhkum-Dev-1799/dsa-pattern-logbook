/**
 * Every language LeetCode currently accepts, mapped to the Monaco language id
 * that gives it syntax highlighting, plus a file extension used when you export
 * a single solution and a starter snippet shown in an empty editor.
 *
 * `monaco` falls back to "plaintext" where Monaco ships no grammar (Erlang).
 */

export interface Language {
  id: string;
  label: string;
  /** Monaco grammar id; "plaintext" where Monaco ships no grammar. */
  monaco: string;
  /** File extension used when you export a single solution. */
  ext: string;
  /** Starter shown in an empty editor; empty string where none makes sense. */
  snippet: string;
}

export const LANGUAGES = [
  { id: "cpp", label: "C++", monaco: "cpp", ext: "cpp", snippet: "class Solution {\npublic:\n    \n};\n" },
  { id: "java", label: "Java", monaco: "java", ext: "java", snippet: "class Solution {\n    \n}\n" },
  { id: "python", label: "Python", monaco: "python", ext: "py", snippet: "class Solution(object):\n    pass\n" },
  { id: "python3", label: "Python3", monaco: "python", ext: "py", snippet: "class Solution:\n    pass\n" },
  { id: "c", label: "C", monaco: "c", ext: "c", snippet: "" },
  { id: "csharp", label: "C#", monaco: "csharp", ext: "cs", snippet: "public class Solution {\n    \n}\n" },
  { id: "javascript", label: "JavaScript", monaco: "javascript", ext: "js", snippet: "" },
  { id: "typescript", label: "TypeScript", monaco: "typescript", ext: "ts", snippet: "" },
  { id: "php", label: "PHP", monaco: "php", ext: "php", snippet: "<?php\nclass Solution {\n\n}\n" },
  { id: "swift", label: "Swift", monaco: "swift", ext: "swift", snippet: "class Solution {\n    \n}\n" },
  { id: "kotlin", label: "Kotlin", monaco: "kotlin", ext: "kt", snippet: "class Solution {\n    \n}\n" },
  { id: "dart", label: "Dart", monaco: "dart", ext: "dart", snippet: "class Solution {\n  \n}\n" },
  { id: "golang", label: "Go", monaco: "go", ext: "go", snippet: "" },
  { id: "ruby", label: "Ruby", monaco: "ruby", ext: "rb", snippet: "" },
  { id: "scala", label: "Scala", monaco: "scala", ext: "scala", snippet: "object Solution {\n    \n}\n" },
  { id: "rust", label: "Rust", monaco: "rust", ext: "rs", snippet: "impl Solution {\n    \n}\n" },
  { id: "racket", label: "Racket", monaco: "scheme", ext: "rkt", snippet: "" },
  { id: "erlang", label: "Erlang", monaco: "plaintext", ext: "erl", snippet: "" },
  { id: "elixir", label: "Elixir", monaco: "elixir", ext: "ex", snippet: "defmodule Solution do\n  \nend\n" },
  { id: "bash", label: "Bash", monaco: "shell", ext: "sh", snippet: "#!/bin/bash\n" },
  { id: "mysql", label: "MySQL", monaco: "mysql", ext: "sql", snippet: "-- Write your MySQL query statement below\n" },
  { id: "mssql", label: "MS SQL Server", monaco: "sql", ext: "sql", snippet: "/* Write your T-SQL query statement below */\n" },
  { id: "oraclesql", label: "Oracle", monaco: "sql", ext: "sql", snippet: "/* Write your PL/SQL query statement below */\n" },
  { id: "postgresql", label: "PostgreSQL", monaco: "pgsql", ext: "sql", snippet: "-- Write your PostgreSQL query statement below\n" },
  { id: "pandas", label: "Pandas", monaco: "python", ext: "py", snippet: "import pandas as pd\n\n" },
] as const satisfies readonly Language[];

/** The id of any language the app knows about, narrowed to the list above. */
export type LanguageId = (typeof LANGUAGES)[number]["id"];

export const DEFAULT_LANGUAGE: LanguageId = "python3";

const BY_ID = Object.fromEntries(
  LANGUAGES.map((language) => [language.id, language])
) as Record<string, Language>;

/** Falls back to the default language, so an unknown id never breaks the editor. */
export function getLanguage(id: string | undefined): Language {
  return (id ? BY_ID[id] : undefined) || BY_ID[DEFAULT_LANGUAGE];
}

/** Languages grouped for the picker, so the SQL dialects do not crowd the top. */
export interface LanguageGroup {
  label: string;
  ids: readonly LanguageId[];
}

export const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    label: "Popular",
    ids: ["python3", "cpp", "java", "javascript", "typescript", "golang", "c", "csharp"],
  },
  {
    label: "Other languages",
    ids: ["python", "php", "swift", "kotlin", "dart", "ruby", "scala", "rust", "racket", "erlang", "elixir", "bash"],
  },
  {
    label: "Database",
    ids: ["mysql", "mssql", "oraclesql", "postgresql", "pandas"],
  },
];
