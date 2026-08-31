import type { ReactNode } from "react";

interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}

export default function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint ? <span className="text-xs text-ink/70">{hint}</span> : null}
    </label>
  );
}
