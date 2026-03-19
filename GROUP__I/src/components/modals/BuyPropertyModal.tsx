import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../ui/Button";
import { useBuyerApprove, useBuyProperty } from "../../hooks/contractHooks";
import { useApp } from "../../context/AppContext";
import { formatPrice } from "../../utils/helpers";
import { getPropertyImage } from "../../context/AppContext";

export function BuyPropertyModal() {
  const {
    closeModal,
    addToast,
    refreshProperties,
    selectedPropertyId,
    properties,
  } = useApp();
  const { buyerApprove, isLoading: isApproving } = useBuyerApprove();
  const { buyProperty, isLoading: isBuying } = useBuyProperty();

  const [step, setStep] = useState<1 | 2>(1);

  const property = properties.find((p) => p.id === selectedPropertyId);
  if (!property) return null;

  const { url, location } = getPropertyImage(property.id);

  const handleApprove = async () => {
    await buyerApprove(property.price);
    addToast({
      type: "success",
      title: "Approval Granted",
      message: "Tokens approved for spending",
    });
    setStep(2);
  };

  const handleBuy = async () => {
    await buyProperty(property.id);
    addToast({
      type: "success",
      title: "Property Acquired!",
      message: `You now own property #${property.id}`,
    });
    refreshProperties();
    closeModal();
  };

  return (
    <Modal title="Purchase Portal" size="sm">
      <div className="space-y-6">
        {/* Property preview */}
        <div className="relative h-40 rounded-xl overflow-hidden">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="font-headline font-bold text-on-surface">
              {property.propType} #{property.id}
            </p>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                location_on
              </span>
              {location}
            </p>
          </div>
        </div>

        {/* Wallet overview */}
        <div className="bg-surface-container-lowest p-5 rounded-xl">
          <div className="flex justify-between items-center mb-4">
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
          <div
            className={`flex items-center gap-3 ${
              step === 1 ? "" : "opacity-60"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                step >= 1 ? "border-primary" : "border-outline"
              }`}
            >
              {step > 1 ? (
                <span className="material-symbols-outlined filled text-secondary text-sm">
                  check_circle
                </span>
              ) : (
                <span className="text-xs font-bold text-primary">1</span>
              )}
            </div>
            <span className="text-on-surface font-medium font-body text-sm">
              Approve Token Spend
            </span>
          </div>
          <div
            className={`flex items-center gap-3 ${
              step === 2 ? "" : "opacity-40"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                step === 2 ? "border-primary" : "border-outline"
              }`}
            >
              <span className="text-xs font-bold text-outline">2</span>
            </div>
            <span className="text-on-surface font-medium font-body text-sm">
              Execute Acquisition
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            isLoading={isApproving}
            disabled={step !== 1}
            onClick={handleApprove}
          >
            {step > 1 ? "✓ Approved" : "Approve Contract"}
          </Button>
          <Button
            variant="outline"
            fullWidth
            isLoading={isBuying}
            disabled={step !== 2}
            onClick={handleBuy}
          >
            Confirm &amp; Buy
          </Button>
        </div>

        <p className="text-center text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
          Gas estimates will be calculated in the next step.
        </p>
      </div>
    </Modal>
  );
}
