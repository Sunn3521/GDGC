import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CrisisMate ErrorBoundary] Uncaught component error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="text-4xl animate-bounce">⚠️</div>
          <h1 className="text-2xl font-black text-white">Something Went Wrong</h1>
          <p className="text-sm text-gray-400 max-w-md">
            An unexpected application error occurred. Your personal safety is unaffected.
          </p>

          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Return to Safety / Home 🏠
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
