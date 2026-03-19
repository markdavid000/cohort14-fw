import type { ViewMode } from "../../types";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant/20 p-1 gap-1">
      {(["grid", "list"] as ViewMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          title={`${mode} view`}
          className={`p-1.5 rounded transition-all ${
            value === mode
              ? "bg-surface-container-high text-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {mode === "grid" ? "grid_view" : "view_list"}
          </span>
        </button>
      ))}
    </div>
  );
}
