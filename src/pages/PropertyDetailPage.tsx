import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../utils/helpers";
import { getPropertyImage } from "../context/AppContext";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80",
  "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
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
  {
    event: "Price Updated",
    value: null,
    address: "0x71C...a49B",
    time: "2 hours ago",
    icon: "sell",
    iconColor: "text-primary",
  },
  {
    event: "View",
    value: "—",
    address: "0xAbc...D12E",
    time: "1 hour ago",
    icon: "visibility",
    iconColor: "text-on-surface-variant",
  },
];

const HISTORY_PER_PAGE = 3;

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    properties,
    openModal,
    setSelectedPropertyId,
    isConnected,
    isOwner,
    propertyImages,
    addToast,
  } = useApp();

  const [historyPage, setHistoryPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const property = properties.find((p) => p.id === Number(id));

  // Determine gallery images: user-uploaded first, then fallbacks
  const imgData = property ? propertyImages[property.id] : null;
  const galleryImages: string[] =
    imgData && imgData.images.length > 0
      ? imgData.images.map((i) => i.dataUrl)
      : FALLBACK_GALLERY;

  const mainImage = galleryImages[galleryIndex] ?? galleryImages[0];
  const { location, apy } = property
    ? getPropertyImage(property.id, propertyImages)
    : { location: "Unknown", apy: "—" };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible")
        ),
      { threshold: 0.1 }
    );
    document
      .querySelectorAll(".scroll-reveal")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [id]);

  const copyAddress = () => {
    if (!property) return;
    navigator.clipboard.writeText(property.owner).then(() => {
      setCopied(true);
      addToast({
        type: "success",
        title: "Copied!",
        message: "Owner address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

  // History pagination
  const historyTotalPages = Math.ceil(MOCK_HISTORY.length / HISTORY_PER_PAGE);
  const paginatedHistory = MOCK_HISTORY.slice(
    (historyPage - 1) * HISTORY_PER_PAGE,
    historyPage * HISTORY_PER_PAGE
  );

  return (
    <div className="pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-6 lg:px-12 max-w-[1600px] mx-auto page-enter">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant font-label flex-wrap">
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

      {/* ── Gallery ───────────────────────────── */}
      <section className="mb-10 md:mb-16">
        <div className="grid grid-cols-12 gap-3 md:gap-4 h-64 md:h-[560px]">
          {/* Main */}
          <div className="col-span-12 md:col-span-8 rounded-xl overflow-hidden relative group cursor-pointer">
            <img
              src={mainImage}
              alt="Main view"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent opacity-70" />
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

          {/* Side thumbnails — desktop */}
          <div className="hidden md:grid col-span-4 grid-rows-2 gap-4">
            {galleryImages.slice(1, 3).map((src, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden relative group cursor-pointer"
                onClick={() => setGalleryIndex(i + 1)}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {i === 1 && galleryImages.length > 3 && (
                  <div className="absolute inset-0 bg-surface-container-highest/40 flex items-center justify-center backdrop-blur-sm hover:bg-surface-container-highest/20 transition-all">
                    <span className="font-headline font-bold text-xl">
                      +{galleryImages.length - 3} Photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile gallery thumbnails */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 md:hidden no-scrollbar">
            {galleryImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  i === galleryIndex ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Main Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left: Specs */}
        <div className="md:col-span-7 lg:col-span-8 space-y-10 scroll-reveal">
          <section>
            <div className="flex flex-wrap items-center gap-3 mb-6">
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

            <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary-fixed mb-6">
              Asset Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Asset ID",
                  value: `OP-${String(property.id).padStart(
                    4,
                    "0"
                  )}-${property.category.slice(0, 2).toUpperCase()}`,
                },
                {
                  label: "Valuation",
                  value: formatPrice(property.price),
                  highlight: true,
                },
                { label: "Type", value: property.propType },
                { label: "Category", value: property.category },
                {
                  label: "Status",
                  value: property.isSold
                    ? "Sold"
                    : property.isListed
                    ? "Listed"
                    : "Unlisted",
                },
                { label: "Warranty", value: property.warranty },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-surface-container-low p-5 rounded-xl"
                >
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1.5 font-label">
                    {spec.label}
                  </p>
                  <p
                    className={`font-headline text-base font-bold ${
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

            {/* ── Copyable owner address ── (#4) */}
            <div className="mt-4 bg-surface-container-low p-5 rounded-xl">
              <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1.5 font-label">
                Owner Address
              </p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-on-surface break-all">
                  {property.owner}
                </span>
                <button
                  onClick={copyAddress}
                  title="Copy address"
                  className={`shrink-0 p-1.5 rounded-lg border transition-all ${
                    copied
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {copied ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Warranty box */}
          <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined filled text-primary p-3 bg-primary/10 rounded-lg text-2xl shrink-0">
                verified_user
              </span>
              <div>
                <h3 className="font-headline font-bold text-lg mb-2">
                  Smart Warranty Coverage
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                  {property.warranty}. Covered by Ocean Properties' structural
                  warranty, fully collateralized by the OP Governance Treasury.
                  Includes smart-contract-enforced maintenance escrow.
                </p>
              </div>
            </div>
          </section>

          {/* Owner actions */}
          {isOwner && (
            <section>
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

        {/* Right: Purchase Portal */}
        <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-28">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-outline-variant/15 shadow-2xl scroll-reveal">
            <h2 className="text-xl md:text-2xl font-headline font-bold mb-6 text-on-surface">
              Purchase Portal
            </h2>

            {/* ── NOT CONNECTED state (#5) ── */}
            {!isConnected ? (
              <div className="space-y-5">
                <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col items-center gap-4 text-center border border-outline-variant/10">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      account_balance_wallet
                    </span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-base mb-1">
                      Wallet Not Connected
                    </p>
                    <p className="text-on-surface-variant text-xs font-body leading-relaxed">
                      Connect your wallet to view your balance and purchase this
                      property.
                    </p>
                  </div>
                  <button className="w-full py-3 bg-primary-container text-on-primary font-bold rounded-lg luminous-button transition-all hover:brightness-110 font-label">
                    Connect Wallet
                  </button>
                </div>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-on-surface-variant font-label uppercase mb-1">
                      Price
                    </p>
                    <p className="font-headline font-bold text-primary-container">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-on-surface-variant font-label uppercase mb-1">
                      Est. APY
                    </p>
                    <p className="font-headline font-bold text-secondary">
                      {apy}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Connected state */
              <div className="space-y-5">
                <div className="bg-surface-container-lowest p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
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

                <div className="space-y-3">
                  {[
                    { step: 1, label: "Approve Liquidity", active: true },
                    { step: 2, label: "Execute Acquisition", active: false },
                  ].map(({ step, label, active }) => (
                    <div
                      key={step}
                      className={`flex items-center gap-3 ${
                        active ? "" : "opacity-40"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          active ? "border-primary" : "border-outline"
                        }`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            active ? "text-primary" : "text-outline"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      <span className="text-on-surface font-medium font-body text-sm">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-3">
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
                        className="w-full py-3 bg-primary-container text-on-primary font-bold rounded-lg luminous-button transition-all hover:brightness-110 active:scale-[0.98] font-label"
                      >
                        Approve Contract
                      </button>
                      <button
                        disabled
                        className="w-full py-3 bg-transparent border border-outline-variant/30 text-outline font-bold rounded-lg cursor-not-allowed opacity-50 font-label"
                      >
                        Confirm &amp; Buy
                      </button>
                    </>
                  )}
                </div>
                <p className="text-center text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
                  Gas estimates calculated in the next step.
                </p>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="mt-6 flex justify-center gap-6 md:gap-8">
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

      {/* ── Transaction History with pagination (#6) ── */}
      <section className="mt-16 scroll-reveal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-headline font-bold">
            Transaction &amp; Event History
          </h2>
          <span className="text-xs text-on-surface-variant font-label">
            {MOCK_HISTORY.length} events
          </span>
        </div>
        <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-xs uppercase tracking-widest font-label">
                  <th className="px-4 md:px-8 py-4 font-semibold">Event</th>
                  <th className="px-4 md:px-8 py-4 font-semibold">Value</th>
                  <th className="px-4 md:px-8 py-4 font-semibold">Address</th>
                  <th className="px-4 md:px-8 py-4 text-right font-semibold">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {paginatedHistory.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-surface-container-high transition-colors"
                  >
                    <td className="px-4 md:px-8 py-4">
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
                    <td className="px-4 md:px-8 py-4 text-primary text-sm">
                      {row.value ?? formatPrice(property.price)}
                    </td>
                    <td className="px-4 md:px-8 py-4 font-mono text-xs text-on-surface-variant">
                      {row.address}
                    </td>
                    <td className="px-4 md:px-8 py-4 text-right text-on-surface-variant text-sm">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={historyPage}
          totalPages={historyTotalPages}
          onChange={setHistoryPage}
        />
      </section>
    </div>
  );
}
