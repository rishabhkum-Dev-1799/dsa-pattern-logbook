import type { ReactNode } from "react";

interface TagProps {
  color?: string;
  children: ReactNode;
  className?: string;
}

export default function Tag({ color, children, className = "" }: TagProps) {
  return (
    <span className={`nb-tag ${className}`} style={color ? { backgroundColor: color } : undefined}>
      {children}
    </span>
  );
}
