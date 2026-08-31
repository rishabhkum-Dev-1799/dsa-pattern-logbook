import type { CSSProperties, ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const SIZES = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export type ButtonSize = keyof typeof SIZES;

interface ButtonOwnProps<E extends ElementType> {
  /** Render as something else — "a" for the LeetCode link, for instance. */
  as?: E;
  size?: ButtonSize;
  /** Background colour; the flat look comes from the `nb-button` class. */
  color?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

type ButtonProps<E extends ElementType> = ButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

export default function Button<E extends ElementType = "button">({
  as,
  size = "md",
  color,
  className = "",
  style,
  children,
  ...rest
}: ButtonProps<E>) {
  const Tag = (as || "button") as ElementType;
  return (
    <Tag
      className={`nb-button ${SIZES[size]} ${className}`}
      style={color ? { backgroundColor: color, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
