import React, { useCallback, useState, useRef } from "react";
import { type PropertyImageEntry } from "../../types";

interface ImageUploaderProps {
  images: PropertyImageEntry[];
  coverIndex: number;
  onChange: (images: PropertyImageEntry[], coverIndex: number) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  coverIndex,
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFiles = async (files: FileList) => {
    const results: PropertyImageEntry[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(file);
      });
      results.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        dataUrl,
        name: file.name,
      });
    }
    const next = [...images, ...results].slice(0, maxImages);
    onChange(next, coverIndex >= next.length ? 0 : coverIndex);
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files) readFiles(e.dataTransfer.files);
    },
    [images, coverIndex]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    const newCover =
      idx === coverIndex ? 0 : coverIndex > idx ? coverIndex - 1 : coverIndex;
    onChange(next, Math.min(newCover, Math.max(0, next.length - 1)));
  };

  const setCover = (idx: number) => onChange(images, idx);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragging
              ? "border-primary bg-primary/10"
              : "border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-2">
            cloud_upload
          </span>
          <p className="text-sm font-body text-on-surface-variant">
            Drag &amp; drop images or{" "}
            <span className="text-primary font-bold">browse</span>
          </p>
          <p className="text-xs text-on-surface-variant/50 mt-1">
            JPG, PNG, WEBP — up to {maxImages} images
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && readFiles(e.target.files)}
          />
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`relative group rounded-lg overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                idx === coverIndex
                  ? "border-primary shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                  : "border-outline-variant/20 hover:border-primary/40"
              }`}
              onClick={() => setCover(idx)}
            >
              <img
                src={img.dataUrl}
                alt={img.name}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {idx === coverIndex && (
                <div className="absolute top-1 left-1 bg-primary-container text-on-primary text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-label">
                  Cover
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-error-container/80 text-error rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-[12px]">
                  close
                </span>
              </button>

              {/* Overlay hint */}
              {idx !== coverIndex && (
                <div className="absolute inset-0 bg-surface/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-on-surface font-label">
                    Set Cover
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-on-surface-variant font-body">
          Tap an image to set it as the cover photo shown on the property card.
          {images.length}/{maxImages} uploaded.
        </p>
      )}
    </div>
  );
}
