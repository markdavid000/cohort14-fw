import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { PropertyRow } from "../components/dashboard/PropertyRow";
import { PropertyCard } from "../components/property/PropertyCard";
import { SkeletonRow } from "../components/ui/Loader";
import { ConfirmActionModal } from "../components/modals/ConfirmActionModal";
import { Pagination } from "../components/ui/Pagination";
import { ViewToggle } from "../components/ui/ViewToggle";
import { AnimatedDashStat } from "../components/ui/AnimatedStat";
import { useApp } from "../context/AppContext";
// import { formatPrice } from "../utils/helpers";

const ITEMS_PER_PAGE = 5;

export function DashboardPage() {
  const {
    properties,
    listedProperties,
    isLoadingProperties,
    activeModal,
    openModal,
    setSelectedPropertyId,
    isConnected,
    address,
    dashboardView,
    setDashboardView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties = properties.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.propType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.id).includes(searchQuery)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  );
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalValue = properties.reduce(
    (sum, p) => sum + Number(p.price) / 1e18,
    0
  );
  const soldCount = properties.filter((p) => p.isSold).length;

  const handleList = (id: number) => {
    setSelectedPropertyId(id);
    openModal("listProperty");
  };
  const handleUnlist = (id: number) => {
    setSelectedPropertyId(id);
    openModal("unlistProperty");
  };
  const handleDelete = (id: number) => {
    setSelectedPropertyId(id);
    openModal("deleteProperty");
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible")
        ),
      { threshold: 0.05 }
    );
    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isConnected]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ── Not-connected wall (#7, #8) ───────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="flex min-h-screen bg-background page-enter">
        <Sidebar onCreateClick={() => {}} />
        <main className="md:ml-64 flex-1 flex items-center justify-center px-6 pb-20 md:pb-0 pt-24 md:pt-0">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto animate-float">
              <span className="material-symbols-outlined text-primary text-4xl">
                account_balance_wallet
              </span>
            </div>
            <div>
              <h2 className="font-headline text-3xl font-extrabold mb-3">
                Connect Your Wallet
              </h2>
              <p className="text-on-surface-variant font-body leading-relaxed">
                Your portfolio, properties, and management tools are tied to
                your wallet address. Connect to access the Owner Portal.
              </p>
            </div>
            {/* Wallet connect button — wire to wagmi useConnect() */}
            <button className="w-full py-4 bg-primary-container text-on-primary font-bold rounded-xl luminous-button hover:brightness-110 transition-all font-headline text-lg">
              Connect Wallet
            </button>
            <p className="text-xs text-on-surface-variant font-body opacity-60">
              Press{" "}
              <kbd className="bg-surface-container-high px-1.5 py-0.5 rounded font-mono text-xs">
                Alt+W
              </kbd>{" "}
              to simulate wallet connection in demo mode.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                {
                  icon: "security",
                  title: "Non-Custodial",
                  desc: "You retain full ownership",
                },
                {
                  icon: "flash_on",
                  title: "Instant Access",
                  desc: "Your assets load immediately",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-low rounded-xl p-4 text-left border border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-primary text-2xl mb-2 block">
                    {item.icon}
                  </span>
                  <p className="font-headline font-bold text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface-variant font-body mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Connected dashboard ───────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background page-enter">
      <Sidebar onCreateClick={() => setShowCreateModal(true)} />

      <main className="md:ml-64 flex-1 min-h-screen pb-24 md:pb-0">
        {/* Header */}
        <header className="px-6 md:px-12 pt-24 md:pt-8 pb-6 md:pb-8 flex flex-col md:flex-row md:items-end gap-4 border-b border-outline-variant/10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface tracking-tight">
              Property Management
            </h2>
            <p className="text-on-surface-variant font-label text-sm mt-1">
              {address ? `${address.slice(0, 10)}...${address.slice(-6)}` : ""}
            </p>
          </div>
          <div className="md:ml-auto">
            {/* #8 — shows Connect Wallet if disconnected (handled above), here shows Create */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-container text-on-primary px-5 md:px-6 py-2.5 rounded-lg font-bold font-label flex items-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:scale-105 transition-transform text-sm luminous-button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create New Property
            </button>
          </div>
        </header>

        <div className="px-6 md:px-12 py-6 md:py-8 space-y-8">
          {/* ── Stats — count on scroll (#9 & #10) ── */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-reveal">
            {[
              {
                label: "Total Assets",
                value: properties.length,
                suffix: "",
                color: "text-primary",
              },
              {
                label: "Portfolio Value",
                value: Math.round(totalValue / 1000),
                suffix: "K OP",
                color: "text-primary",
              },
              {
                label: "Active Listings",
                value: listedProperties.length,
                suffix: "",
                color: "text-secondary",
              },
              {
                label: "Sold",
                value: soldCount,
                suffix: "",
                color: "text-error",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/10"
              >
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-label">
                  {stat.label}
                </p>
                <AnimatedDashStat
                  value={stat.value}
                  suffix={stat.suffix}
                  className={`text-3xl font-bold font-headline ${stat.color}`}
                />
              </div>
            ))}
          </section>

          {/* ── Property table/grid (#10, #11) ── */}
          <section className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 scroll-reveal">
            <div className="p-4 md:p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="font-headline font-bold text-lg md:text-xl">
                  My Properties
                </h3>
                <p className="text-xs text-on-surface-variant font-label mt-0.5">
                  {filteredProperties.length} assets · Page {currentPage}/
                  {totalPages}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1 sm:flex-none">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant/40 focus:ring-1 focus:ring-primary outline-none w-full sm:w-44 font-body"
                  />
                </div>
                <ViewToggle value={dashboardView} onChange={setDashboardView} />
              </div>
            </div>

            {isLoadingProperties ? (
              <div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-5 px-4">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                    domain_disabled
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-headline font-bold mb-2">
                    {searchQuery ? "No matches found" : "No properties yet"}
                  </h4>
                  <p className="text-on-surface-variant text-sm font-body mb-5 max-w-xs mx-auto">
                    {searchQuery
                      ? "Try a different search."
                      : "Start by creating your first real estate asset."}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-primary-container text-on-primary px-6 py-3 rounded-lg font-bold font-label flex items-center gap-2 mx-auto hover:brightness-110 transition-all luminous-button"
                    >
                      <span className="material-symbols-outlined text-base">
                        rocket_launch
                      </span>
                      Start First Listing
                    </button>
                  )}
                </div>
              </div>
            ) : dashboardView === "list" ? (
              /* LIST view — table */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-surface-container-lowest text-on-surface-variant font-label text-xs uppercase tracking-widest">
                      <th className="px-4 md:px-6 py-4 font-semibold">
                        Property
                      </th>
                      <th className="hidden md:table-cell px-6 py-4 font-semibold">
                        Type
                      </th>
                      <th className="hidden sm:table-cell px-6 py-4 font-semibold">
                        Value
                      </th>
                      <th className="px-4 md:px-6 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {paginatedProperties.map((p) => (
                      <PropertyRow
                        key={p.id}
                        property={p}
                        onList={handleList}
                        onUnlist={handleUnlist}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* GRID view */
              <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedProperties.map((p, i) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    viewMode="grid"
                    animationDelay={i * 60}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Pagination (#10) */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />

          {/* Portfolio breakdown */}
          {properties.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 scroll-reveal">
              <div className="md:col-span-2 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h3 className="font-headline font-bold text-lg mb-5">
                  Portfolio Breakdown
                </h3>
                <div className="space-y-4">
                  {["Villa", "Commercial", "Apartment", "Hospitality"].map(
                    (type) => {
                      const count = properties.filter(
                        (p) => p.propType === type
                      ).length;
                      const pct =
                        properties.length > 0
                          ? (count / properties.length) * 100
                          : 0;
                      if (count === 0) return null;
                      return (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-body text-on-surface-variant">
                              {type}
                            </span>
                            <span className="font-label font-bold text-primary">
                              {count}
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                            <div
                              className="bg-primary-container h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h3 className="font-headline font-bold text-lg mb-5">
                  Listing Health
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Listed",
                      value: listedProperties.length,
                      color: "text-secondary",
                    },
                    {
                      label: "Vaulted",
                      value: properties.filter((p) => !p.isListed && !p.isSold)
                        .length,
                      color: "text-on-surface-variant",
                    },
                    { label: "Sold", value: soldCount, color: "text-error" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-on-surface-variant font-body">
                        {row.label}
                      </span>
                      <span className={`font-bold font-headline ${row.color}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-outline-variant/10 flex justify-between items-center">
                    <span className="text-sm text-on-surface font-bold font-label">
                      Total
                    </span>
                    <span className="text-primary font-bold font-headline">
                      {properties.length}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant/15 gap-4 mt-4">
          <p className="text-base font-bold text-primary-container font-headline">
            Ocean Properties
          </p>
          <div className="flex flex-wrap gap-4 md:gap-8">
            {["Marketplace", "Governance", "Smart Contracts", "Privacy"].map(
              (l) => (
                <Link
                  key={l}
                  to={l === "Marketplace" ? "/marketplace" : "/"}
                  className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                >
                  {l}
                </Link>
              )
            )}
          </div>
        </footer>
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateModalWrapper onClose={() => setShowCreateModal(false)} />
      )}
      {(activeModal === "listProperty" ||
        activeModal === "unlistProperty" ||
        activeModal === "deleteProperty") && <ConfirmActionModal />}
    </div>
  );
}

// ── Inline create wrapper (avoids double import of CreatePropertyModal which uses Modal already)
import { CreatePropertyModal } from "../components/modals/CreatePropertyModal";

function CreateModalWrapper({ onClose }: { onClose: () => void }) {
  // const { closeModal } = useApp();
  // temporarily set activeModal so CreatePropertyModal's close works
  useEffect(() => {
    return () => {};
  }, []);

  // Override close to also run onClose
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <CreatePropertyModal />
    </div>
  );
}
