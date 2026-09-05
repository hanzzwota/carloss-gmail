import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  X, 
  Info,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveToastTicker: React.FC = () => {
  const { toasts, removeToast, liveEvent } = useApp();

  // Show at most the 2 most recent toasts to prevent clutter
  const visibleToasts = toasts.slice(-2);

  return (
    <>
      {/* Discreet, sleek non-intrusive floating toasts container */}
      <div 
        aria-live="polite" 
        className="fixed top-4 right-4 z-50 pointer-events-none flex flex-col gap-2 max-w-sm w-full sm:w-auto items-end"
      >
        {visibleToasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all duration-200 max-w-xs sm:max-w-sm w-full text-slate-900 ${
                isSuccess 
                  ? 'bg-emerald-300' :
                isError 
                  ? 'bg-rose-300' :
                isWarning 
                  ? 'bg-amber-300' :
                  'bg-sky-300'
              }`}
            >
              <div className="shrink-0 p-1 bg-white rounded-lg border-2 border-slate-900">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-800" />}
                {isError && <XCircle className="w-4 h-4 text-rose-800" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-800" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-sky-800" />}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="text-xs font-black text-slate-900 truncate">
                  {toast.title}
                </div>
                {toast.message && (
                  <p className="text-[11px] text-slate-800 font-medium line-clamp-1 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-900 hover:bg-slate-900/10 p-1 rounded-lg shrink-0 cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
