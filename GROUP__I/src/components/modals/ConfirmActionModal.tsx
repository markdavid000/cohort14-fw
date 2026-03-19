import { Modal } from "./Modal";
import { Button } from "../ui/Button";
import {
  useListProperty,
  useUnlistProperty,
  useDeleteProperty,
} from "../../hooks/contractHooks";
import { useApp } from "../../context/AppContext";

interface ActionConfig {
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: "primary" | "danger";
  icon: string;
  iconColor: string;
}

const ACTION_CONFIGS: Record<string, ActionConfig> = {
  listProperty: {
    title: "List Property",
    description:
      "This will make your property visible and available for purchase on the marketplace.",
    confirmLabel: "Confirm Listing",
    confirmVariant: "primary",
    icon: "storefront",
    iconColor: "text-primary",
  },
  unlistProperty: {
    title: "Unlist Property",
    description:
      "This will remove your property from the marketplace. You can re-list it at any time.",
    confirmLabel: "Confirm Unlist",
    confirmVariant: "primary",
    icon: "visibility_off",
    iconColor: "text-on-surface-variant",
  },
  deleteProperty: {
    title: "Delete Property",
    description:
      "This will permanently delete this property. Make sure it is unlisted before deleting. This action cannot be undone.",
    confirmLabel: "Delete Permanently",
    confirmVariant: "danger",
    icon: "delete_forever",
    iconColor: "text-error",
  },
};

export function ConfirmActionModal() {
  const {
    closeModal,
    addToast,
    refreshProperties,
    selectedPropertyId,
    activeModal,
  } = useApp();
  const { listProperty, isLoading: isListing } = useListProperty();
  const { unlistProperty, isLoading: isUnlisting } = useUnlistProperty();
  const { deleteProperty, isLoading: isDeleting } = useDeleteProperty();

  const config = activeModal ? ACTION_CONFIGS[activeModal] : null;
  if (!config || !selectedPropertyId) return null;

  const isLoading = isListing || isUnlisting || isDeleting;

  const handleConfirm = async () => {
    if (activeModal === "listProperty") {
      await listProperty(selectedPropertyId);
      addToast({
        type: "success",
        title: "Property Listed",
        message: `Property #${selectedPropertyId} is now live on the marketplace`,
      });
    } else if (activeModal === "unlistProperty") {
      await unlistProperty(selectedPropertyId);
      addToast({
        type: "info",
        title: "Property Unlisted",
        message: `Property #${selectedPropertyId} removed from marketplace`,
      });
    } else if (activeModal === "deleteProperty") {
      await deleteProperty(selectedPropertyId);
      addToast({
        type: "warning",
        title: "Property Deleted",
        message: `Property #${selectedPropertyId} has been permanently removed`,
      });
    }
    refreshProperties();
    closeModal();
  };

  return (
    <Modal title={config.title} size="sm">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div
            className={`w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center ${config.iconColor}`}
          >
            <span className="material-symbols-outlined text-4xl">
              {config.icon}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-body leading-relaxed max-w-sm">
            {config.description}
          </p>
          <div className="bg-surface-container-lowest rounded-lg px-4 py-2 text-sm font-label">
            Property ID:{" "}
            <span className="text-primary font-bold">
              #{selectedPropertyId}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="ghost" fullWidth onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant={config.confirmVariant}
            fullWidth
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            {config.confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
