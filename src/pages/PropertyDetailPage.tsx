import { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../utils/helpers";
import { getPropertyImage } from "../context/AppContext";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { shortenAddress } from "../utils/helpers";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80",
  "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=600&q=80",
];

const MOCK_HISTORY = [
  {
    event: "Minted",
    value: "Original Creation",
    address: "0x71C...a49B",
    time: "2 days ago",
    icon: "mintmark",
    iconColor: "text-secondary",
  },
  {
    event: "Listed",
    value: null,
    address: "0x71C...a49B",
    time: "1 day ago",
    icon: "list_alt",
    iconColor: "text-primary-container",
  },
  {
    event: "Offer Received",
    value: null,
    address: "0x12d...F45c",
    time: "4 hours ago",
    icon: "swap_horiz",
    iconColor: "text-tertiary",
  },
];

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    properties,
    openModal,
    setSelectedPropertyId,
    isConnected,
    isOwner,
    addToast,
  } = useApp();
  const mainRef = useRef<HTMLDivElement>(null);

  const property = properties.find((p) => p.id === Number(id));
  const {
    url: mainImage,
    location,
    apy,
  } = property
    ? getPropertyImage(property.id)
    : { url: GALLERY_IMAGES[0], location: "Unknown", apy: "0%" };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible")
        ),
      { threshold: 0.1 }
    );
    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 pt-20">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">
            domain_disabled
          </span>
        </div>
        <h2 className="text-2xl font-headline font-bold">Property not found</h2>
        <Button variant="primary" onClick={() => navigate("/marketplace")}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const handleBuy = () => {
    setSelectedPropertyId(property.id);
    openModal("buyProperty");
  };

  const handleList = () => {
    setSelectedPropertyId(property.id);
    openModal("listProperty");
  };

  const handleUnlist = () => {
    setSelectedPropertyId(property.id);
    openModal("unlistProperty");
  };

  const handleDelete = () => {
    setSelectedPropertyId(property.id);
    openModal("deleteProperty");
  };

  const statusBadge = property.isSold ? (
    <Badge variant="sold">Sold</Badge>
  ) : property.isListed ? (
    <Badge variant="minting" pulse>
      Live on Market
    </Badge>
  ) : (
    <Badge variant="unlisted">Unlisted</Badge>
  );

  return (
    <div
      ref={mainRef}
      className="pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-6 lg:px-12 max-w-[1600px] mx-auto page-enter"
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant font-label">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link
          to="/marketplace"
          className="hover:text-primary transition-colors"
        >
          Marketplace
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Property #{property.id}</span>
      </nav>

      {/* ─── Hero Gallery ─── */}
      <section className="mb-10 md:mb-16">
        <div className="grid grid-cols-12 gap-3 md:gap-4 h-64 md:h-[600px]">
          {/* Main image */}
          <div className="col-span-12 md:col-span-8 rounded-xl overflow-hidden relative group">
            <img
              src={mainImage}
              alt="Property main view"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent opacity-60" />
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
              <h1 className="text-3xl md:text-5xl font-extrabold font-headline text-primary tracking-tight mb-1 md:mb-2">
                {property.propType} #{property.id}
              </h1>
              <p className="text-on-surface-variant flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-primary-container text-base">
                  location_on
                </span>
                {location} • Sector {String(property.id).padStart(2, "0")}-A
              </p>
            </div>
          </div>

          {/* Side images - desktop only */}
          <div className="hidden md:grid col-span-4 grid-rows-2 gap-4">
            <div className="rounded-xl overflow-hidden relative group">
              <img
                src={GALLERY_IMAGES[1]}
                alt="Interior view"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="rounded-xl overflow-hidden relative group cursor-pointer">
              <img
                src={GALLERY_IMAGES[2]}
                alt="Additional view"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-surface-container-highest/40 flex items-center justify-center backdrop-blur-sm hover:bg-surface-container-highest/20 transition-all">
                <span className="font-headline font-bold text-xl">
                  + 8 Photos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* ── Left: Specs ── */}
        <div className="md:col-span-7 lg:col-span-8 space-y-10 md:space-y-12">
          {/* Status badges */}
          <section className="scroll-reveal">
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-8">
              {statusBadge}
              <Badge variant="verified">
                <span className="material-symbols-outlined filled text-[12px]">
                  verified
                </span>
                Contract Verified
              </Badge>
              <span className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase font-label">
                ID: OP-{String(property.id).padStart(4, "0")}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary-fixed mb-6 md:mb-8">
              Asset Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  label: "Asset Identifier",
                  value: `OP-${String(property.id).padStart(
                    4,
                    "0"
                  )}-${property.category.slice(0, 2).toUpperCase()}`,
                },
                {
                  label: "Market Valuation",
                  value: formatPrice(property.price),
                  highlight: true,
                },
                { label: "Asset Type", value: property.propType },
                { label: "Category", value: property.category },
                {
                  label: "Owner Address",
                  value: shortenAddress(property.owner),
                },
                {
                  label: "Status",
                  value: property.isSold
                    ? "Sold"
                    : property.isListed
                    ? "Listed"
                    : "Unlisted",
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-surface-container-low p-5 md:p-6 rounded-xl"
                >
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2 font-label">
                    {spec.label}
                  </p>
                  <p
                    className={`font-headline text-base md:text-lg font-bold ${
                      spec.highlight
                        ? "text-primary-container"
                        : "text-on-surface"
                    }`}
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Warranty */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/15 scroll-reveal">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined filled text-primary p-3 bg-primary/10 rounded-lg text-2xl shrink-0">
                verified_user
              </span>
              <div>
                <h3 className="font-headline font-bold text-lg md:text-xl mb-2">
                  Smart Warranty Coverage
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                  {property.warranty}. This property is covered by Ocean
                  Properties' structural warranty, fully collateralized by the
                  OP Governance Treasury. Includes smart-contract-enforced
                  maintenance escrow.
                </p>
              </div>
            </div>
          </section>

          {/* Owner actions */}
          {isOwner && (
            <section className="scroll-reveal">
              <h3 className="font-headline font-bold text-xl mb-4">
                Owner Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                {!property.isSold && !property.isListed && (
                  <Button
                    variant="primary"
                    onClick={handleList}
                    icon={
                      <span className="material-symbols-outlined text-base">
                        storefront
                      </span>
                    }
                  >
                    List Property
                  </Button>
                )}
                {!property.isSold && property.isListed && (
                  <Button
                    variant="secondary"
                    onClick={handleUnlist}
                    icon={
                      <span className="material-symbols-outlined text-base">
                        visibility_off
                      </span>
                    }
                  >
                    Unlist Property
                  </Button>
                )}
                {!property.isSold && !property.isListed && (
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    icon={
                      <span className="material-symbols-outlined text-base">
                        delete
                      </span>
                    }
                  >
                    Delete Property
                  </Button>
                )}
              </div>
            </section>
          )}
        </div>

        {/* ── Right: Purchase Portal ── */}
        <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-28">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-outline-variant/15 shadow-2xl scroll-reveal">
            <h2 className="text-xl md:text-2xl font-headline font-bold mb-6 md:mb-8 text-on-surface">
              Purchase Portal
            </h2>

            <div className="space-y-5 md:space-y-6">
              {/* Wallet overview */}
              <div className="bg-surface-container-lowest p-4 md:p-5 rounded-xl">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <span className="text-on-surface-variant text-xs uppercase tracking-widest font-label">
                    Your Balance
                  </span>
                  <span className="text-primary-container text-xs font-bold font-label">
                    0.00 OP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-xs uppercase tracking-widest font-label">
                    Property Price
                  </span>
                  <span className="text-on-surface text-lg font-bold font-headline">
                    {formatPrice(property.price)}
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <span className="text-on-surface font-medium font-body text-sm">
                    Approve Liquidity
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <div className="w-8 h-8 rounded-full border-2 border-outline flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-outline">2</span>
                  </div>
                  <span className="text-on-surface font-medium font-body text-sm">
                    Execute Acquisition
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 md:pt-4 space-y-3">
                {property.isSold ? (
                  <div className="w-full py-4 text-center bg-surface-container-high rounded-lg text-on-surface-variant font-bold font-label">
                    Property Sold
                  </div>
                ) : !property.isListed ? (
                  <div className="w-full py-4 text-center bg-surface-container-high rounded-lg text-on-surface-variant font-bold font-label">
                    Not Listed for Sale
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleBuy}
                      className="w-full py-3 md:py-4 bg-primary-container text-on-primary font-bold rounded-lg luminous-button transition-all hover:brightness-110 active:scale-[0.98] font-label"
                    >
                      Approve Contract
                    </button>
                    <button
                      disabled
                      className="w-full py-3 md:py-4 bg-transparent border border-outline-variant/30 text-outline font-bold rounded-lg cursor-not-allowed opacity-50 font-label"
                    >
                      Confirm &amp; Buy
                    </button>
                  </>
                )}
              </div>

              <p className="text-center text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
                Gas estimates will be calculated in the next step.
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-6 md:mt-8 flex justify-center gap-6 md:gap-8">
            <div className="text-center">
              <p className="text-xs text-on-surface-variant font-label uppercase mb-1">
                Est. APY
              </p>
              <p className="font-headline font-bold text-secondary">{apy}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-on-surface-variant font-label uppercase mb-1">
                Type
              </p>
              <p className="font-headline font-bold">{property.propType}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-on-surface-variant font-label uppercase mb-1">
                Status
              </p>
              <p className="font-headline font-bold">
                {property.isSold
                  ? "Sold"
                  : property.isListed
                  ? "Live"
                  : "Vaulted"}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Transaction History ─── */}
      <section className="mt-16 md:mt-24 scroll-reveal">
        <h2 className="text-xl md:text-2xl font-headline font-bold mb-6 md:mb-8">
          Transaction &amp; Event History
        </h2>
        <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-xs uppercase tracking-widest font-label">
                  <th className="px-4 md:px-8 py-4 md:py-5 font-semibold">
                    Event Type
                  </th>
                  <th className="px-4 md:px-8 py-4 md:py-5 font-semibold">
                    Value
                  </th>
                  <th className="px-4 md:px-8 py-4 md:py-5 font-semibold">
                    Address
                  </th>
                  <th className="px-4 md:px-8 py-4 md:py-5 text-right font-semibold">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {MOCK_HISTORY.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-surface-container-high transition-colors"
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined filled ${row.iconColor} text-xl`}
                        >
                          {row.icon}
                        </span>
                        <span className="text-on-surface font-medium font-body text-sm">
                          {row.event}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-primary text-sm font-body">
                      {row.value ?? formatPrice(property.price)}
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 font-mono text-xs md:text-sm text-on-surface-variant">
                      {row.address}
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right text-on-surface-variant text-sm font-body">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
