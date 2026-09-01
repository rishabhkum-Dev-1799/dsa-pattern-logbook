import Button from "./ui/Button.tsx";

const GITHUB_URL = "https://github.com/rishabhkum-Dev-1799/dsa-pattern-logbook";
const LINKEDIN_URL = "https://www.linkedin.com/in/rishabh-kumar-70a19b196/";

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M3.6 5.9H.9V16h2.7V5.9ZM2.25 0a1.57 1.57 0 1 0 0 3.13 1.57 1.57 0 0 0 0-3.13ZM16 10.3c0-3-1.6-4.6-3.75-4.6-1.6 0-2.32.9-2.72 1.53V5.9h-2.7c.04.85 0 10.1 0 10.1h2.7v-5.64c0-.25.02-.5.09-.67.2-.49.64-1 1.4-1 1 0 1.38.75 1.38 1.85V16H16v-5.7Z" />
    </svg>
  );
}

export default function AppFooter() {
  return (
    <footer className="nb-panel mt-3 bg-sky sm:mt-4">
      <div className="flex flex-col gap-3 p-3 sm:p-4 md:flex-row md:flex-wrap md:items-center">
        <div className="min-w-0 flex-1">
          <p className="break-words font-display text-base sm:text-lg md:text-xl">
            CRAFTED BY RISHABH KUMAR — FOR ALL THE DSA LOVERS
          </p>
          <p className="mt-1 text-xs font-semibold">
            Built by one pattern-chaser, for everyone still chasing them. Keep
            logging, keep solving.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Button
            as="a"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            color="#FFFDF7"
            className="inline-flex items-center justify-center gap-2 text-center"
          >
            <GithubIcon />
            GitHub
          </Button>
          <Button
            as="a"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer noopener"
            color="#FFC13B"
            className="inline-flex items-center justify-center gap-2 text-center"
          >
            <LinkedinIcon />
            LinkedIn
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t-3 border-ink bg-paper px-3 py-2 sm:gap-3 sm:px-4">
        <span className="min-w-0 flex-1 font-mono text-[11px] font-bold sm:text-xs">
          Local-first · your notes never leave this browser
        </span>
        <span className="shrink-0 font-mono text-[11px] font-bold sm:text-xs">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
