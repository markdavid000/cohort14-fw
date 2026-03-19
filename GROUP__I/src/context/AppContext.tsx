import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  AppContextType,
  ModalType,
  Property,
  PropertyImages,
  Toast,
  ViewMode,
} from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Fallback image pool ──────────────────────────────────────────────────────
export const FALLBACK_IMAGES: Record<
  number,
  { url: string; location: string; apy: string }
> = {
  1: {
    url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    location: "Monaco, FR",
    apy: "8.2%",
  },
  2: {
    url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    location: "Maldives, MV",
    apy: "12.4%",
  },
  3: {
    url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    location: "Amalfi Coast, IT",
    apy: "6.5%",
  },
  4: {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    location: "Malibu, CA",
    apy: "9.1%",
  },
  5: {
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    location: "Dubai, UAE",
    apy: "7.8%",
  },
  6: {
    url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    location: "Mykonos, GR",
    apy: "11.2%",
  },
};
export const DEFAULT_FALLBACK = {
  url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  location: "Global Asset",
  apy: "8.0%",
};

/** Returns the cover URL for a property — user-uploaded if available, else fallback */
export function getPropertyImage(
  id: number,
  userImages?: Record<number, PropertyImages>
) {
  const stored = userImages?.[id];
  if (stored && stored.images.length > 0) {
    const cover = stored.images[stored.coverIndex] ?? stored.images[0];
    return { url: cover.dataUrl, location: "Your Asset", apy: "—" };
  }
  return FALLBACK_IMAGES[((id - 1) % 6) + 1] || DEFAULT_FALLBACK;
}

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    price: BigInt("125000000000000000000000"),
    propType: "Villa",
    category: "Beachfront",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: false,
    isListed: true,
    warranty: "10 years structural warranty",
  },
  {
    id: 2,
    price: BigInt("840000000000000000000000"),
    propType: "Commercial",
    category: "Metropolitan",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: false,
    isListed: true,
    warranty: "5 years commercial warranty",
  },
  {
    id: 3,
    price: BigInt("45000000000000000000000"),
    propType: "Apartment",
    category: "Metropolitan",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: false,
    isListed: true,
    warranty: "7 years smart warranty",
  },
  {
    id: 4,
    price: BigInt("310000000000000000000000"),
    propType: "Villa",
    category: "Luxury Retreat",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: false,
    isListed: true,
    warranty: "15 years premium warranty",
  },
  {
    id: 5,
    price: BigInt("640000000000000000000000"),
    propType: "Villa",
    category: "Beachfront",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: false,
    isListed: true,
    warranty: "10 years ocean warranty",
  },
  {
    id: 6,
    price: BigInt("1200000000000000000000000"),
    propType: "Commercial",
    category: "Metropolitan",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: true,
    isListed: false,
    warranty: "8 years corporate warranty",
  },
  {
    id: 7,
    price: BigInt("220000000000000000000000"),
    propType: "Apartment",
    category: "Metropolitan",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: false,
    isListed: true,
    warranty: "6 years warranty",
  },
  {
    id: 8,
    price: BigInt("980000000000000000000000"),
    propType: "Hospitality",
    category: "Luxury Retreat",
    owner: "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B",
    isSold: false,
    isListed: false,
    warranty: "12 years warranty",
  },
];

// ── LocalStorage key ─────────────────────────────────────────────────────────
const LS_KEY = "ocean_property_images";

function loadStoredImages(): Record<number, PropertyImages> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredImages(data: Record<number, PropertyImages>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  // Wallet (wagmi wires into here)
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isOwner, setIsOwner] = useState(false);

  // --- DEMO toggle so you can test connected/disconnected state in UI ---
  // Remove this block and replace with real wagmi hooks when integrating
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "w") {
        setIsConnected((v) => {
          const next = !v;
          setAddress(
            next ? "0x71Cf5A6E5B0B2F97f0b4CDb38Ced48A49B61a49B" : undefined
          );
          setIsOwner(next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  useEffect(() => {
    setProperties(MOCK_PROPERTIES);
  }, []);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [propertyImages, setPropertyImages] =
    useState<Record<number, PropertyImages>>(loadStoredImages);
  const [marketplaceView, setMarketplaceView] = useState<ViewMode>("grid");
  const [dashboardView, setDashboardView] = useState<ViewMode>("grid");

  const listedProperties = properties.filter((p) => p.isListed && !p.isSold);

  const openModal = useCallback((m: ModalType) => setActiveModal(m), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      5000
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const savePropertyImages = useCallback((id: number, data: PropertyImages) => {
    setPropertyImages((prev) => {
      const next = { ...prev, [id]: data };
      saveStoredImages(next);
      return next;
    });
  }, []);

  const getPropertyImageData = useCallback(
    (id: number): PropertyImages | null => {
      return propertyImages[id] ?? null;
    },
    [propertyImages]
  );

  const refreshProperties = useCallback(() => {
    setIsLoadingProperties(true);
    setTimeout(() => setIsLoadingProperties(false), 800);
  }, []);

  const value: AppContextType = {
    isConnected,
    address,
    isOwner,
    properties,
    listedProperties,
    isLoadingProperties,
    selectedPropertyId,
    setSelectedPropertyId,
    activeModal,
    openModal,
    closeModal,
    toasts,
    addToast,
    removeToast,
    filterType,
    filterCategory,
    filterPrice,
    setFilterType,
    setFilterCategory,
    setFilterPrice,
    propertyImages,
    savePropertyImages,
    getPropertyImageData,
    marketplaceView,
    setMarketplaceView,
    dashboardView,
    setDashboardView,
    refreshProperties,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
