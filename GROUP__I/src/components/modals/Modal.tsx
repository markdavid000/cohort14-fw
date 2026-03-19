import { useEffect, type ReactNode } from "react";
import { useApp } from "../../context/AppContext";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  size?: "sm" | "md" | "lg";
}

export function Modal({ title, children, onClose, size = "md" }: ModalProps) {
  const { closeModal } = useApp();

  const handleClose = () => {
    onClose?.();
    closeModal();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizes[size]} bg-surface-container-high rounded-xl shadow-2xl overflow-hidden border border-outline-variant/20 animate-scaleIn`}
        style={{ animation: "scaleIn 0.3s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 md:px-8 py-5 md:py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-highest/20">
          <h3 className="font-headline font-extrabold text-xl md:text-2xl tracking-tight">
            {title}
          </h3>
          <button
            className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
            onClick={handleClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
