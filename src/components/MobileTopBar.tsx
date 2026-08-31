import Button from "./ui/Button.tsx";

interface MobileTopBarProps {
  onOpenMenu: () => void;
  onHome: () => void;
  onAddQuestion: () => void;
  menuOpen: boolean;
}

/**
 * The phone and tablet navigation bar: it stays pinned to the top of the
 * viewport so the pattern list is one tap away no matter how far down a
 * question you have scrolled. Hidden from `lg` up, where the rail is on screen
 * permanently and a hamburger would be noise.
 */
export default function MobileTopBar({
  onOpenMenu,
  onHome,
  onAddQuestion,
  menuOpen,
}: MobileTopBarProps) {
  return (
    <div className="sticky top-0 z-40 -mx-3 -mt-3 mb-3 border-b-3 border-ink bg-lime px-3 py-2 sm:-mx-4 sm:-mt-4 sm:px-4 lg:hidden">
      <div className="mx-auto flex max-w-[1200px] items-center gap-2">
        <button
          type="button"
          className="nb-button flex h-10 w-10 shrink-0 items-center justify-center"
          onClick={onOpenMenu}
          aria-label="Open patterns menu"
          aria-expanded={menuOpen}
          aria-controls="pattern-drawer"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
            <rect x="2" y="4" width="16" height="2.6" fill="currentColor" />
            <rect x="2" y="8.7" width="16" height="2.6" fill="currentColor" />
            <rect x="2" y="13.4" width="16" height="2.6" fill="currentColor" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onHome}
          className="min-w-0 flex-1 truncate text-left font-display text-sm sm:text-base"
        >
          DSA LOGBOOK
        </button>

        <Button size="sm" color="#FFC13B" className="shrink-0" onClick={onAddQuestion}>
          + Add
        </Button>
      </div>
    </div>
  );
}
