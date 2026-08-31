import { useRef, type ChangeEvent } from "react";
import Button from "./ui/Button.tsx";
import ProgressBar from "./ui/ProgressBar.tsx";
import { errorMessage, percent } from "../lib/format.ts";
import { downloadJson, readBackupFile } from "../lib/backup.ts";
import type {
  LogbookActions,
  Stats,
  StorageState,
  StorageStatus,
} from "../types.ts";

const STORAGE_LABEL: Record<StorageState, string> = {
  connecting: "Opening the local database…",
  saving: "Saving to IndexedDB…",
  saved: "Everything is Saved in this browser ",
  error: "Not saving",
};

interface AppHeaderProps {
  stats: Stats;
  storage: StorageStatus;
  actions: LogbookActions;
  onHome: () => void;
  onAddQuestion: () => void;
}

type Tile = [label: string, value: string | number, background: string];

export default function AppHeader({
  stats,
  storage,
  actions,
  onHome,
  onAddQuestion,
}: AppHeaderProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const data = await readBackupFile(file);
      actions.importBackup(data);
    } catch (error) {
      window.alert(errorMessage(error));
    }
  };

  const tiles: Tile[] = [
    ["Solved", `${stats.solved}/${stats.total}`, "#FFFDF7"],
    ["Revisit", stats.revisit, "#FF8FB3"],
    ["Patterns started", `${stats.started}/${stats.patterns}`, "#C4A5FF"],
  ];

  return (
    <header className="nb-panel mb-3 bg-lime sm:mb-4">
      <div className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:flex-wrap lg:items-center">
        <button
          type="button"
          onClick={onHome}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl">DSA PATTERN LOGBOOK</h1>
          <p className="mt-1 text-[11px] font-semibold sm:text-xs">
            The questions are already here. You add the approach and the code.
          </p>
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="grid grid-cols-3 gap-2">
            {tiles.map(([label, value, background]) => (
              <div
                key={label}
                className="nb-flat px-2 py-1 text-center sm:px-3"
                style={{ background }}
              >
                <div className="font-display text-base sm:text-lg">{value}</div>
                <div className="text-[10px] font-semibold leading-tight sm:text-xs">{label}</div>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            color="#FFC13B"
            className="w-full justify-center sm:w-auto"
            onClick={onAddQuestion}
          >
            + Add your own
          </Button>
        </div>
      </div>

      <div className="px-3 pb-3 sm:px-4">
        <ProgressBar value={percent(stats.solved, stats.total)} label="Questions solved" />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t-3 border-ink bg-paper px-3 py-2 sm:gap-3 sm:px-4">
        <span className="basis-full break-words font-mono text-[11px] font-bold sm:min-w-0 sm:flex-1 sm:basis-auto sm:text-xs">
          {STORAGE_LABEL[storage.state]}
          {storage.state === "error" ? `: ${storage.message}` : ""}
        </span>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Button
            size="sm"
            className="flex-1 justify-center sm:flex-none"
            onClick={() => downloadJson(actions.exportData(), "dsa-logbook.json")}
          >
            Export JSON
          </Button>
          <Button
            size="sm"
            className="flex-1 justify-center sm:flex-none"
            onClick={() => fileInput.current?.click()}
          >
            Import JSON
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
          <Button
            size="sm"
            className="flex-1 justify-center sm:flex-none"
            onClick={() => {
              if (window.confirm("Delete every saved note and solution from this browser?")) {
                actions.clearEverything();
                onHome();
              }
            }}
          >
            Clear database
          </Button>
        </div>
      </div>
    </header>
  );
}
