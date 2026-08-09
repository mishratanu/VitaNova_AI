import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white rounded-3xl border border-red-100 shadow-sm">
          <AlertTriangle size={48} className="text-severity-red mb-4" />
          <h2 className="text-xl font-heading font-bold text-ink mb-2">Something went wrong.</h2>
          <p className="text-ink-muted mb-6">Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-2"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
