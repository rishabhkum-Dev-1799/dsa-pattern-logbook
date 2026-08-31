import { STATUS } from "../../hooks/useLogbook.ts";
import type { Status } from "../../types.ts";

const FILL: Record<Status, string> = {
  [STATUS.solved]: "#B8F04B",
  [STATUS.revisit]: "#FF8FB3",
  [STATUS.todo]: "#FFFDF7",
};

const LABEL: Record<Status, string> = {
  [STATUS.solved]: "Solved",
  [STATUS.revisit]: "Marked for revisit",
  [STATUS.todo]: "Not logged",
};

interface StatusDotProps {
  status?: Status;
}

export default function StatusDot({ status = STATUS.todo }: StatusDotProps) {
  return (
    <span
      className="h-3 w-3 shrink-0 border-2 border-ink"
      style={{ backgroundColor: FILL[status] }}
      title={LABEL[status]}
      aria-label={LABEL[status]}
    />
  );
}
