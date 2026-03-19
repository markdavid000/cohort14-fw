import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Property } from "../../types";
import { formatPrice } from "../../utils/helpers";
import { Badge } from "../ui/Badge";
import { getPropertyImage } from "../../context/AppContext";
import { useApp } from "../../context/AppContext";

interface PropertyCardProps {
  property: Property;
  variant?: "marketplace" | "featured";
  animationDelay?: number;
  viewMode?: "grid" | "list";
}

export function PropertyCard({
  property,
  variant = "marketplace",
  animationDelay = 0,
  viewMode = "grid",
}: PropertyCardProps) {
  const navigate = useNavigate();
  const { propertyImages } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const { url, location, apy } = getPropertyImage(property.id, propertyImages);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const statusBadge = property.isSold ? (
    <Badge variant="sold">Sold</Badge>
  ) : property.isListed ? (
    <Badge variant="minting" pulse>
      Listed
    </Badge>
  ) : (
    <Badge variant="unlisted">Unlisted</Badge>
  );

  const goToDetail = () => navigate(`/property/${property.id}`);

  // ── LIST VIEW ────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div
        ref={cardRef}
        onClick={goToDetail}
        className="flex items-center gap-4 glass-card rounded-xl border border-outline-variant/10 hover:border-primary/30 p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,210,255,0.1)] hover:-translate-y-0.5"
        style={{
          opacity: 0,
          transform: "translateY(20px)",
          transition: `opacity .5s ease ${animationDelay}ms, transform .5s ease ${animationDelay}ms, box-shadow .2s, border-color .2s`,
        }}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0">
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1 flex-wrap">
            <span className="font-label text-xs text-primary uppercase tracking-widest">
              {property.propType}
            </span>
            {statusBadge}
          </div>
          <h3 className="font-headline text-base md:text-lg font-bold text-on-background truncate">
            {property.propType} #{property.id}
          </h3>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                location_on
              </span>
              {location}
            </span>
            <span className="hidden sm:flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                category
              </span>
              {property.category}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-headline text-base md:text-xl font-black text-primary-container">
            {formatPrice(property.price)}
          </p>
          {variant === "featured" && (
            <p className="text-xs text-secondary font-bold mt-0.5">APY {apy}</p>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetail();
            }}
            className="mt-2 px-3 py-1.5 bg-primary-container text-on-primary font-bold rounded-lg text-xs font-label hover:brightness-110 transition-all hidden sm:block"
          >
            View
          </button>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ────────────────────────────────────────────────────────────
  return (
    <div
      ref={cardRef}
      className="group glass-card rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)] cursor-pointer"
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        transition: `opacity .6s ease ${animationDelay}ms, transform .6s ease ${animationDelay}ms, box-shadow .3s, border-color .3s`,
      }}
      onClick={goToDetail}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={url}
          alt={`${property.propType} - ${property.category}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">{statusBadge}</div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div>
            <span className="font-label text-xs text-primary uppercase tracking-widest">
              {property.propType}
            </span>
            <h3 className="font-headline text-xl md:text-2xl font-bold text-on-background mt-1">
              {property.propType} #{property.id}
            </h3>
          </div>
          <div className="text-right">
            <span className="block font-headline text-lg md:text-xl font-black text-primary-container">
              {formatPrice(property.price)}
            </span>
            <span className="text-xs text-on-surface-variant uppercase font-label">
              Market Price
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5 md:mb-6">
          <div className="flex items-center gap-1 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-sm">
              location_on
            </span>
            <span className="font-body">{location}</span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-sm">category</span>
            <span className="font-body">{property.category}</span>
          </div>
        </div>

        {variant === "featured" && (
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label">
                Price
              </p>
              <p className="font-headline text-2xl font-extrabold text-primary">
                {formatPrice(property.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label">
                Est. APY
              </p>
              <p className="font-headline text-2xl font-extrabold text-secondary">
                {apy}
              </p>
            </div>
          </div>
        )}

        <button
          className="w-full bg-primary-container text-on-primary font-headline font-bold py-3 md:py-4 rounded-lg flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all hover:brightness-110 active:scale-[0.98]"
          onClick={(e) => {
            e.stopPropagation();
            goToDetail();
          }}
        >
          View Details
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
