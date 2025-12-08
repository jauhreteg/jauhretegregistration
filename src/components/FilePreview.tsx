"use client";

import { useState, useEffect } from "react";

interface FilePreviewProps {
  url: string;
  index: number;
  label: string;
  className?: string;
}

export function FilePreview({
  url,
  index,
  label,
  className = "",
}: FilePreviewProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const isImageFile = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts[parts.length - 1]?.toUpperCase() || "FILE";
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "Unknown file";
  };

  const handleClick = () => {
    if (isImageFile(url)) {
      setFullscreenImage(url);
    } else {
      // For documents, open in new tab to download
      window.open(url, "_blank");
    }
  };

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreenImage(null);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const isImage = isImageFile(url);
  const fileExt = getFileExtension(url);

  return (
    <>
      <div
        onClick={handleClick}
        className={`group border rounded-lg p-3 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white shadow-sm cursor-pointer w-80 h-20 flex items-center gap-3 ${className}`}
      >
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isImage ? "bg-green-100" : "bg-blue-100"
          }`}
        >
          <span
            className={`text-sm font-bold ${
              isImage ? "text-green-600" : "text-blue-600"
            }`}
          >
            {fileExt}
          </span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* File name - smaller and wrappable */}
          <div className="text-xs font-medium text-gray-900 leading-tight break-words mb-1">
            {getFileName(url)}
          </div>

          {/* File information - compact */}
          <div className="text-xs text-gray-500">
            {label} {index + 1}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-8"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Full size view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(null);
              }}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 text-xl font-bold"
              title="Close (ESC)"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
