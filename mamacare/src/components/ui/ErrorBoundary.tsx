"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
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
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-100 text-rose-600 shadow-inner">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Something went wrong</h2>
          <p className="max-w-md text-slate-500 mb-8 leading-relaxed">
            The application encountered an unexpected error. Don't worry, your offline data is still safe in your browser.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <RefreshCcw className="h-5 w-5" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
