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
              className={`pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl shadow-xl border backdrop-blur-xl transition-all duration-300 transform translate-y-0 opacity-100 ease-out max-w-xs sm:max-w-sm w-full text-slate-100 ${
                isSuccess 
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-950/30' :
                isError 
                  ? 'bg-slate-900/90 border-rose-500/40 shadow-rose-950/30' :
                isWarning 
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-amber-950/30' :
                  'bg-slate-900/90 border-blue-500/40 shadow-blue-950/30'
              }`}
            >
              <div className="shrink-0">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isError && <XCircle className="w-4 h-4 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-blue-400" />}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="text-[11px] font-bold text-white truncate">
                  {toast.title}
                </div>
                {toast.message && (
                  <p className="text-[10px] text-slate-300 line-clamp-1 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
