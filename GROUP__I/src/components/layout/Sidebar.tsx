import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onCreateClick: () => void;
}

export function Sidebar({ onCreateClick }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: "dashboard", label: "Overview", to: "/dashboard" },
    { icon: "add_circle", label: "List Property", action: onCreateClick },
    { icon: "storefront", label: "Marketplace", to: "/marketplace" },
  ];

  const isActive = (to?: string) => (to ? location.pathname === to : false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen py-8 bg-surface-container-low fixed left-0 top-0 z-40 transition-all duration-300 border-r border-outline-variant/10 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={`px-6 mb-12 ${collapsed ? "px-4" : ""}`}>
          {!collapsed && (
            <>
              <Link to="/" className="block">
                <h1 className="text-xl font-black text-primary-container font-headline tracking-tighter">
                  Ocean Properties
                </h1>
              </Link>
              <div className="mt-6">
                <p className="text-sm font-bold text-primary font-headline">
                  Owner Portal
                </p>
                <p className="text-xs text-on-surface-variant opacity-60">
                  Verified Liquid Assets
                </p>
              </div>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-primary-container text-base">
                waves
              </span>
            </div>
          )}
        </div>

        <nav className="flex-grow flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const commonClasses = `group flex items-center py-4 font-medium font-label text-sm transition-all cursor-pointer ${
              collapsed ? "px-4 justify-center" : "px-8"
            } ${
              active
                ? "text-primary font-bold border-r-4 border-primary-container bg-surface-container-high"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all duration-300"
            }`;

            const content = (
              <>
                <span
                  className={`material-symbols-outlined ${
                    collapsed ? "" : "mr-4"
                  } ${active ? "filled" : ""} text-xl`}
                >
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </>
            );

            if (item.action) {
              return (
                <button
                  key={item.label}
                  className={`${commonClasses} w-full text-left`}
                  onClick={item.action}
                >
                  {content}
                </button>
              );
            }
            return (
              <Link key={item.to} to={item.to!} className={commonClasses}>
                {content}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-auto ${collapsed ? "px-4" : "px-8"}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-outline-variant/20 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all text-xs font-label mb-4"
          >
            <span className="material-symbols-outlined text-base">
              {collapsed ? "chevron_right" : "chevron_left"}
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>

          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant/20 rounded text-on-surface-variant hover:bg-surface-container-high transition-all font-label text-sm">
            <span className="material-symbols-outlined text-sm">logout</span>
            {!collapsed && <span>Disconnect</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-outline-variant/10 flex justify-around py-2">
        {navItems.slice(0, 4).map((item) => {
          const active = isActive(item.to);
          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center gap-1 p-2 text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-xl">
                  {item.icon}
                </span>
                <span className="text-[10px] font-label">{item.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={item.to}
              to={item.to!}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                active ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  active ? "filled" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
