interface ProgressBarProps {
  /** 0–100; anything outside is clamped. */
  value: number;
  label: string;
  className?: string;
}

export default function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-3.5 border-3 border-ink bg-paper ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-full bg-lime" style={{ width: `${clamped}%` }} />
    </div>
  );
}
