import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { PropertyRow } from "../components/dashboard/PropertyRow";
import { DashboardStatCard } from "../components/ui/StatCard";
import { SkeletonRow } from "../components/ui/Loader";
// import { CreatePropertyModal } from '../components/modals/CreatePropertyModal';
import { ConfirmActionModal } from "../components/modals/ConfirmActionModal";
import { useApp } from "../context/AppContext";
// import { formatPrice } from '../utils/helpers';
// import { type ModalType } from '../types';

export function DashboardPage() {
  const {
    properties,
    listedProperties,
    isLoadingProperties,
    activeModal,
    openModal,
    setSelectedPropertyId,
    // addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtered properties for table
  const filteredProperties = properties.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.propType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.id).includes(searchQuery)
    );
  });

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

  const handleCreateClick = () => setShowCreateModal(true);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible")
        ),
      { threshold: 0.05 }
    );
    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-background page-enter">
      {/* Sidebar */}
      <Sidebar onCreateClick={handleCreateClick} />

      {/* Main Content */}
      <main className="md:ml-64 flex-1 min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <header className="px-6 md:px-12 pt-24 md:pt-8 pb-6 md:pb-8 flex flex-col md:flex-row md:items-end gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface tracking-tight">
              Property Management
            </h2>
            <p className="text-on-surface-variant font-label text-sm mt-1">
              Monitor and manage your high-liquidity real estate portfolio.
            </p>
          </div>
          <div className="md:ml-auto">
            <button
              onClick={handleCreateClick}
              className="bg-primary-container text-on-primary px-5 md:px-6 py-2.5 rounded-lg font-bold font-label flex items-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:scale-105 transition-transform duration-200 text-sm"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create New Property
            </button>
          </div>
        </header>

        <div className="px-6 md:px-12 py-4 md:py-8 space-y-8 md:space-y-12">
          {/* ─── Stats Grid ─── */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 scroll-reveal">
            <DashboardStatCard
              label="Total Assets"
              value={String(properties.length)}
              color="text-primary"
            />
            <DashboardStatCard
              label="Portfolio Value"
              value={`${(totalValue / 1000).toFixed(1)}K OP`}
              color="text-primary"
            />
            <DashboardStatCard
              label="Active Listings"
              value={String(listedProperties.length).padStart(2, "0")}
              color="text-secondary"
            />
            <DashboardStatCard
              label="Vault Status"
              icon={
                <span className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_#4edea3] inline-block" />
              }
              value="Secured"
              color="text-on-surface"
            />
          </section>

          {/* ─── Property Table ─── */}
          <section className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 scroll-reveal">
            <div className="p-4 md:p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="font-headline font-bold text-lg md:text-xl">
                My Properties
              </h3>
              <div className="flex gap-2 items-center">
                {/* Search */}
                <div className="relative flex-1 sm:flex-none">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface placeholder-on-surface-variant/40 focus:ring-1 focus:ring-primary outline-none font-body w-full sm:w-48 transition-all"
                  />
                </div>
                <button className="p-2 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-base">
                    filter_list
                  </span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-surface-container-lowest text-on-surface-variant font-label text-xs uppercase tracking-widest">
                    <th className="px-4 md:px-6 py-4 font-semibold">
                      Property Details
                    </th>
                    <th className="hidden md:table-cell px-6 py-4 font-semibold">
                      Type / Category
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 font-semibold">
                      Valuation
                    </th>
                    <th className="px-4 md:px-6 py-4 font-semibold">Status</th>
                    <th className="px-4 md:px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {isLoadingProperties ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <PropertyRow
                        key={property.id}
                        property={property}
                        onList={handleList}
                        onUnlist={handleUnlist}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20">
                        <div className="flex flex-col items-center justify-center gap-6">
                          <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                              domain_disabled
                            </span>
                          </div>
                          <div className="text-center">
                            <h4 className="text-xl md:text-2xl font-headline font-bold mb-2">
                              {searchQuery
                                ? "No matching properties"
                                : "No properties minted yet"}
                            </h4>
                            <p className="text-on-surface-variant max-w-sm text-center text-sm mb-6 font-body">
                              {searchQuery
                                ? "Try a different search term."
                                : "Start your journey by adding your first real estate asset to the high-liquidity Ocean ecosystem."}
                            </p>
                            {!searchQuery && (
                              <button
                                onClick={handleCreateClick}
                                className="bg-primary text-on-primary px-6 md:px-8 py-3 rounded-lg font-bold font-label flex items-center gap-2 hover:brightness-110 transition-all mx-auto"
                              >
                                <span className="material-symbols-outlined text-base">
                                  rocket_launch
                                </span>
                                Start Your First Listing
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ─── Quick Stats / Portfolio ─── */}
          {properties.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 scroll-reveal">
              <div className="md:col-span-2 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h3 className="font-headline font-bold text-lg mb-4">
                  Portfolio Overview
                </h3>
                <div className="space-y-3">
                  {["Villa", "Commercial", "Apartment"].map((type) => {
                    const count = properties.filter(
                      (p) => p.propType === type
                    ).length;
                    const pct =
                      properties.length > 0
                        ? (count / properties.length) * 100
                        : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
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
                  })}
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h3 className="font-headline font-bold text-lg mb-4">
                  Listing Health
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant font-body">
                      Listed
                    </span>
                    <span className="text-secondary font-bold font-headline">
                      {listedProperties.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant font-body">
                      Vaulted
                    </span>
                    <span className="text-on-surface-variant font-bold font-headline">
                      {
                        properties.filter((p) => !p.isListed && !p.isSold)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant font-body">
                      Sold
                    </span>
                    <span className="text-error font-bold font-headline">
                      {soldCount}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface font-bold font-label">
                        Total
                      </span>
                      <span className="text-primary font-bold font-headline">
                        {properties.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="w-full py-8 md:py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant/15 gap-4 mt-8">
          <div>
            <p className="text-base md:text-lg font-bold text-primary-container font-headline">
              Ocean Properties
            </p>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 mt-1">
              © 2024 Ocean Properties. High-Liquidity Real Estate.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            {["Marketplace", "Governance", "Smart Contracts", "Privacy"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  className="font-label text-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
                >
                  {l}
                </a>
              )
            )}
          </div>
        </footer>
      </main>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9998]">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <div
              className="w-full max-w-2xl bg-surface-container-high rounded-xl shadow-2xl overflow-hidden border border-outline-variant/20 animate-scaleIn"
              style={{ animation: "scaleIn 0.3s ease-out forwards" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 md:px-8 py-5 md:py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-highest/20">
                <h3 className="font-headline font-extrabold text-xl md:text-2xl tracking-tight">
                  Create New Property
                </h3>
                <button
                  className="p-2 hover:bg-surface-container-highest rounded-full transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <InlineCreateForm onClose={() => setShowCreateModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Confirm modals via manager */}
      {(activeModal === "listProperty" ||
        activeModal === "unlistProperty" ||
        activeModal === "deleteProperty") && <ConfirmActionModal />}
    </div>
  );
}

// Inline create form component for dashboard
function InlineCreateForm({ onClose }: { onClose: () => void }) {
  const { addToast, refreshProperties } = useApp();
  const [form, setForm] = useState({
    amount: "",
    propType: "Villa",
    category: "Beachfront",
    warranty: "10 years",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: "success",
      title: "Property Created",
      message: "Asset initialized successfully",
    });
    refreshProperties();
    onClose();
  };

  const typeOpts = [
    "Villa",
    "Apartment",
    "Commercial",
    "Hospitality",
    "Residential",
  ];
  const catOpts = [
    "Beachfront",
    "Metropolitan",
    "Luxury Retreat",
    "Ultra-Luxury",
  ];
  const warOpts = ["5 years", "7 years", "10 years", "15 years", "20 years"];

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      <div className="col-span-2">
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 font-label">
          Price (Token Units)
        </label>
        <input
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-on-surface text-sm font-body"
          placeholder="e.g. 500000"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 font-label">
          Property Type
        </label>
        <div className="relative">
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface text-sm font-body appearance-none"
            value={form.propType}
            onChange={(e) => setForm({ ...form, propType: e.target.value })}
          >
            {typeOpts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
            expand_more
          </span>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 font-label">
          Category
        </label>
        <div className="relative">
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface text-sm font-body appearance-none"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {catOpts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
            expand_more
          </span>
        </div>
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 font-label">
          Warranty Duration
        </label>
        <div className="relative">
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface text-sm font-body appearance-none"
            value={form.warranty}
            onChange={(e) => setForm({ ...form, warranty: e.target.value })}
          >
            {warOpts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
            expand_more
          </span>
        </div>
      </div>
      <div className="col-span-2 pt-4 flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-6 rounded-lg border border-outline-variant/20 font-bold font-label hover:bg-surface-container-highest transition-colors text-on-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 rounded-lg bg-primary-container text-on-primary font-bold font-label shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all luminous-button"
        >
          Initialize Asset
        </button>
      </div>
    </form>
  );
}
