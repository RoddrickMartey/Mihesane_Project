import React, { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import Cropper from "react-easy-crop";
import Modal from "./Modal";
import Button from "./Button";
import getCroppedImg from "@/utils/cropImageHelper";

const aspectRatios = {
  square: 1,
  portrait: 3 / 4,
  landscape: 16 / 9,
};

export default function ImageSelector({ onSelect, label = "Select Image" }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rawUrl, setRawUrl] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(aspectRatios.square);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
    });

    const src = URL.createObjectURL(compressed);
    setRawUrl(src);
    setCropOpen(true);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    const croppedBlob = await getCroppedImg(rawUrl, croppedAreaPixels);
    const preview = URL.createObjectURL(croppedBlob);
    setPreviewUrl(preview);
    setCropOpen(false);
    if (onSelect) onSelect(croppedBlob);
  };

  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="w-full border border-border rounded overflow-hidden">
          <img
            src={previewUrl}
            alt="Selected"
            className="w-full object-cover"
          />
        </div>
      )}

      <label className="text-sm font-medium text-text-soft">{label}</label>
      <label className="relative inline-block w-full cursor-pointer">
        <div className="w-full px-4 py-2 bg-surface border border-border text-text-soft text-sm hover:bg-accent transition text-center">
          Click to select an image
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>

      {cropOpen && (
        <Modal isOpen={cropOpen} onClose={() => setCropOpen(false)}>
          <div className="relative w-full h-64 bg-black">
            <Cropper
              image={rawUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Aspect Ratio Buttons INSIDE Modal */}
          <div className="flex gap-2 mt-4">
            {Object.entries(aspectRatios).map(([key, ratio]) => (
              <button
                key={key}
                onClick={() => setAspect(ratio)}
                className={`px-2 py-1 text-sm border rounded transition ${
                  aspect === ratio
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-text-soft border-border hover:bg-accent"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCropOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCrop}>Crop & Use</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
