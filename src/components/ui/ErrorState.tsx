'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Failed to load data</h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}