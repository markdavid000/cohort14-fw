import { useApp } from "../../context/AppContext";
import { type Toast as ToastType } from "../../types";

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useApp();

  const icons = {
    success: "check_circle",
    error: "error",
    info: "info",
    warning: "warning",
  };

  const colors = {
    success: "border-secondary/30 bg-on-secondary-container/20 text-secondary",
    error: "border-error/30 bg-error-container/20 text-error",
    info: "border-primary/30 bg-primary-container/10 text-primary",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border glass-card animate-fadeInUp min-w-[320px] max-w-sm ${
        colors[toast.type]
      }`}
    >
      <span className="material-symbols-outlined filled text-xl shrink-0 mt-0.5">
        {icons[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm font-headline">{toast.title}</p>
        {toast.message && (
          <p className="text-xs opacity-80 mt-0.5 font-body">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
