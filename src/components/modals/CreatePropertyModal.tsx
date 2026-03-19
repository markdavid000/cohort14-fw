import React, { useState } from "react";
import { Modal } from "./Modal";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";
import { ImageUploader } from "../ui/ImageUploader";
import { useCreateProperty } from "../../hooks/contractHooks";
import { useApp } from "../../context/AppContext";
import type { PropertyFormData, PropertyImageEntry } from "../../types";
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_CATEGORY_OPTIONS,
  WARRANTY_OPTIONS,
} from "../../utils/helpers";

export function CreatePropertyModal() {
  const {
    closeModal,
    addToast,
    refreshProperties,
    savePropertyImages,
    properties,
  } = useApp();
  const { createProperty, isLoading } = useCreateProperty();

  const [form, setForm] = useState<
    Omit<PropertyFormData, "images" | "coverIndex">
  >({
    amount: "",
    propType: "Villa",
    category: "Beachfront",
    warranty: "10 years",
  });
  const [images, setImages] = useState<PropertyImageEntry[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const [step, setStep] = useState<1 | 2>(1);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.amount || Number(form.amount) <= 0)
      errs.amount = "Price must be > 0";
    if (!form.propType) errs.propType = "Required";
    if (!form.category) errs.category = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProperty({ ...form, images, coverIndex });

    // Determine next property ID (mock — replace with real tx receipt id)
    const nextId = Math.max(...properties.map((p) => p.id), 0) + 1;

    // Save images off-chain (localStorage)
    if (images.length > 0) {
      savePropertyImages(nextId, { propertyId: nextId, coverIndex, images });
    }

    addToast({
      type: "success",
      title: "Property Created",
      message: "Asset initialized on-chain",
    });
    refreshProperties();
    closeModal();
  };

  const handleImagesChange = (imgs: PropertyImageEntry[], cover: number) => {
    setImages(imgs);
    setCoverIndex(cover);
  };

  const typeOptions = PROPERTY_TYPE_OPTIONS.slice(1).map((v) => ({
    value: v,
    label: v,
  }));
  const catOptions = PROPERTY_CATEGORY_OPTIONS.slice(1).map((v) => ({
    value: v,
    label: v,
  }));
  const warOptions = WARRANTY_OPTIONS.map((v) => ({ value: v, label: v }));

  return (
    <Modal title="Create New Property" size="md">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center gap-2 ${
                step === s
                  ? "text-primary"
                  : step > s
                  ? "text-secondary"
                  : "text-on-surface-variant opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  step === s
                    ? "border-primary bg-primary/10"
                    : step > s
                    ? "border-secondary bg-secondary/10"
                    : "border-current"
                }`}
              >
                {step > s ? (
                  <span className="material-symbols-outlined filled text-sm">
                    check
                  </span>
                ) : (
                  s
                )}
              </div>
              <span className="text-xs font-label font-bold uppercase tracking-wide hidden sm:inline">
                {s === 1 ? "Asset Details" : "Property Images"}
              </span>
            </div>
            {s < 2 && (
              <div
                className={`flex-1 h-px ${
                  step > 1 ? "bg-secondary/40" : "bg-outline-variant/20"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="col-span-2">
              <Input
                label="Price (Token Units)"
                type="number"
                placeholder="e.g. 500000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                error={errors.amount}
              />
            </div>
            <Select
              label="Property Type"
              options={typeOptions}
              value={form.propType}
              onChange={(e) => setForm({ ...form, propType: e.target.value })}
              error={errors.propType}
            />
            <Select
              label="Category"
              options={catOptions}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              error={errors.category}
            />
            <div className="col-span-2">
              <Select
                label="Warranty"
                options={warOptions}
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
              />
            </div>
            {/* Info */}
            <div className="col-span-2 bg-primary-container/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">
                  info
                </span>
                <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                  After creating, you'll upload images for this property. Images
                  are stored locally and tied to the property ID — the contract
                  stores asset data on-chain.
                </p>
              </div>
            </div>
            <div className="col-span-2 flex gap-4 pt-2">
              <Button
                variant="ghost"
                fullWidth
                type="button"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                type="button"
                onClick={handleNext}
              >
                Next: Add Images
                <span className="material-symbols-outlined text-base ml-1">
                  arrow_forward
                </span>
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm text-on-surface-variant font-body mb-1 leading-relaxed">
                Upload images for your property. The image you mark as{" "}
                <span className="text-primary font-bold">Cover</span> will be
                shown on property cards. All others appear in the detail
                gallery.
              </p>
              <p className="text-xs text-on-surface-variant/60 font-body">
                Images are stored in your browser's local storage and tied to
                this property ID. When you integrate with IPFS/Arweave, replace
                this with on-chain URI storage.
              </p>
            </div>

            <ImageUploader
              images={images}
              coverIndex={coverIndex}
              onChange={handleImagesChange}
            />

            {images.length === 0 && (
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded-lg px-4 py-3 border border-outline-variant/20">
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  info
                </span>
                <p className="text-xs text-on-surface-variant font-body">
                  You can skip image upload and add them later from the
                  dashboard.
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Button
                variant="ghost"
                fullWidth
                type="button"
                onClick={() => setStep(1)}
              >
                <span className="material-symbols-outlined text-base mr-1">
                  arrow_back
                </span>
                Back
              </Button>
              <Button
                variant="primary"
                fullWidth
                type="submit"
                isLoading={isLoading}
              >
                {images.length > 0 ? "Create with Images" : "Create Property"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
