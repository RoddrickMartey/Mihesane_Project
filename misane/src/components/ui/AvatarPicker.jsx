import React, { useState, useEffect, useCallback } from "react";
import imageCompression from "browser-image-compression";
import Cropper from "react-easy-crop";
import Modal from "./Modal";
import Button from "./Button";
import { getCroppedImg } from "@/utils/cropImage";

function AvatarPicker({ imageUrl, onChange, disabled = false }) {
  const [preview, setPreview] = useState(imageUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawUrl, setRawUrl] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  const handleFileChange = (e) => {
    if (disabled) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setRawUrl(url);
    setCropOpen(true);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(rawUrl, croppedAreaPixels);

      const compressed = await imageCompression(croppedBlob, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });

      const compressedPreview = URL.createObjectURL(compressed);
      setPreview(compressedPreview);
      setCropOpen(false);

      if (onChange) onChange(compressed);
    } catch (err) {
      console.error("Cropping failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-40 h-40 rounded-full overflow-hidden border border-border bg-surface">
        <img
          src={preview || "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <label
        className={`text-sm cursor-pointer hover:underline ${
          disabled ? "text-gray-400 cursor-not-allowed" : "text-primary"
        }`}
      >
        Change Avatar
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {cropOpen && (
        <Modal isOpen={cropOpen} onClose={() => setCropOpen(false)}>
          <div className="relative w-full h-64 bg-black">
            <Cropper
              image={rawUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setCropOpen(false)}
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button onClick={handleCrop} disabled={disabled}>
              Crop & Use
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AvatarPicker;
