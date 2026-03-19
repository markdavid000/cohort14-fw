export interface Property {
  id: number;
  price: bigint;
  propType: string;
  category: string;
  owner: string;
  isSold: boolean;
  isListed: boolean;
  warranty: string;
}

// Stored off-chain in localStorage keyed by propertyId
export interface PropertyImages {
  propertyId: number;
  coverIndex: number; // which image is the main card image
  images: PropertyImageEntry[];
}

export interface PropertyImageEntry {
  id: string;
  dataUrl: string; // base64 preview / objectURL
  file?: File;
  name: string;
}

export interface PropertyFormData {
  amount: string;
  propType: string;
  category: string;
  warranty: string;
  images: PropertyImageEntry[];
  coverIndex: number;
}

export type ModalType =
  | "createProperty"
  | "buyProperty"
  | "listProperty"
  | "unlistProperty"
  | "deleteProperty"
  | "approveToken"
  | null;

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export type ViewMode = "grid" | "list";

export interface AppContextType {
  isConnected: boolean;
  address: string | undefined;
  isOwner: boolean;

  properties: Property[];
  listedProperties: Property[];
  isLoadingProperties: boolean;

  selectedPropertyId: number | null;
  setSelectedPropertyId: (id: number | null) => void;

  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;

  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  filterType: string;
  filterCategory: string;
  filterPrice: string;
  setFilterType: (v: string) => void;
  setFilterCategory: (v: string) => void;
  setFilterPrice: (v: string) => void;

  // Image store (off-chain, localStorage)
  propertyImages: Record<number, PropertyImages>;
  savePropertyImages: (id: number, data: PropertyImages) => void;
  getPropertyImageData: (id: number) => PropertyImages | null;

  // View mode
  marketplaceView: ViewMode;
  setMarketplaceView: (v: ViewMode) => void;
  dashboardView: ViewMode;
  setDashboardView: (v: ViewMode) => void;

  refreshProperties: () => void;
}
