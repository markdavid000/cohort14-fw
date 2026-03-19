import { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { PropertyCard } from "../components/property/PropertyCard";
import { SkeletonCard } from "../components/ui/Loader";
import { Pagination } from "../components/ui/Pagination";
import { ViewToggle } from "../components/ui/ViewToggle";
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_CATEGORY_OPTIONS,
  PRICE_RANGE_OPTIONS,
} from "../utils/helpers";

const ITEMS_PER_PAGE = 6;

export function MarketplacePage() {
  const {
    listedProperties,
    isLoadingProperties,
    filterType,
    filterCategory,
    filterPrice,
    setFilterType,
    setFilterCategory,
    setFilterPrice,
    marketplaceView,
    setMarketplaceView,
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties = useMemo(() => {
    return listedProperties.filter((p) => {
      const typeMatch =
        !filterType || filterType === "All Types" || p.propType === filterType;
      const catMatch =
        !filterCategory ||
        filterCategory === "All Categories" ||
        p.category === filterCategory;
      const price = Number(p.price) / 1e18;
      let priceMatch = true;
      if (filterPrice === "0 - 50K") priceMatch = price <= 50000;
      else if (filterPrice === "50K - 250K")
        priceMatch = price > 50000 && price <= 250000;
      else if (filterPrice === "250K+") priceMatch = price > 250000;
      return typeMatch && catMatch && priceMatch;
    });
  }, [listedProperties, filterType, filterCategory, filterPrice]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  );
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterCategory, filterPrice]);

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
  }, [paginatedProperties]);

  const clearFilters = () => {
    setFilterType("");
    setFilterCategory("");
    setFilterPrice("");
    setCurrentPage(1);
  };
  const hasFilters = filterType || filterCategory || filterPrice;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-8 bg-deep-radial page-enter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 md:mb-16 scroll-reveal">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter mb-4">
            Marketplace
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-light text-base md:text-lg font-body">
            Curated digital real estate assets with high liquidity and verified
            chain history.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-end scroll-reveal">
          {[
            {
              label: "Property Type",
              value: filterType,
              setter: setFilterType,
              opts: PROPERTY_TYPE_OPTIONS,
            },
            {
              label: "Price Range (Tokens)",
              value: filterPrice,
              setter: setFilterPrice,
              opts: PRICE_RANGE_OPTIONS,
            },
            {
              label: "Category",
              value: filterCategory,
              setter: setFilterCategory,
              opts: PROPERTY_CATEGORY_OPTIONS,
            },
          ].map(({ label, value, setter, opts }) => (
            <div key={label} className="flex-1 w-full space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                {label}
              </label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-lowest border-none text-on-surface rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary appearance-none outline-none font-body text-sm"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                >
                  {opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>
          ))}
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-surface-container-high text-primary border border-outline-variant/20 px-6 md:px-8 py-3 rounded-lg hover:bg-surface-container-highest transition-colors font-headline font-semibold whitespace-nowrap w-full md:w-auto"
          >
            Apply Filters
          </button>
        </div>

        {/* Results bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-on-surface-variant text-sm font-body">
            <span className="text-primary font-bold">
              {filteredProperties.length}
            </span>{" "}
            properties found
            {totalPages > 1 && (
              <span className="ml-2 opacity-60">
                · Page {currentPage} of {totalPages}
              </span>
            )}
          </p>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-primary text-sm font-label hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Clear
              </button>
            )}
            <ViewToggle value={marketplaceView} onChange={setMarketplaceView} />
          </div>
        </div>

        {/* Grid / List */}
        {isLoadingProperties ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : paginatedProperties.length > 0 ? (
          marketplaceView === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedProperties.map((p, i) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  viewMode="grid"
                  animationDelay={i * 80}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginatedProperties.map((p, i) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  viewMode="list"
                  animationDelay={i * 60}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                domain_disabled
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-headline font-bold mb-2">
                No properties found
              </h3>
              <p className="text-on-surface-variant text-sm font-body">
                Try adjusting your filters
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
