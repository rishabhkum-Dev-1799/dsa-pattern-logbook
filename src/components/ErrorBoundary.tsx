import React, { type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Kept deliberately simple: no telemetry leaves the machine.
    console.error("Logbook crashed:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="p-6">
        <div className="nb-panel mx-auto max-w-xl p-6">
          <h1 className="font-display text-2xl">Something broke</h1>
          <p className="mt-2 text-sm">
            Your saved work is still in IndexedDB. Reload the page to carry on.
          </p>
          <pre className="mt-3 overflow-x-auto border-3 border-ink bg-ice p-3 font-mono text-xs">
            {String(this.state.error.message || this.state.error)}
          </pre>
          <button
            type="button"
            className="nb-button mt-4 px-4 py-2"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
