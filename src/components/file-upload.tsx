"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  id: string;
  label: string;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  placeholder?: string;
  description?: string;
  maxFiles?: number;
  className?: string;
}

const RequiredAsterisk = ({ required }: { required?: boolean }) => {
  return required ? <span className="text-red-600">*</span> : null;
};

export function FileUpload({
  id,
  label,
  value,
  onChange,
  accept = "image/*,.pdf",
  multiple = false,
  required = false,
  placeholder,
  description,
  maxFiles,
  className = "",
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  // Convert value to array for consistent handling
  const fileArray = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (multiple) {
      const updatedFiles = [...fileArray, ...selectedFiles];
      const finalFiles = maxFiles
        ? updatedFiles.slice(0, maxFiles)
        : updatedFiles;
      onChange(finalFiles);
    } else {
      onChange(selectedFiles[0]);
    }

    // Reset input value to allow re-selecting the same file
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    if (multiple) {
      const updatedFiles = fileArray.filter((_, i) => i !== index);
      onChange(updatedFiles.length > 0 ? updatedFiles : null);
    } else {
      onChange(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    if (multiple) {
      const updatedFiles = [...fileArray, ...droppedFiles];
      const finalFiles = maxFiles
        ? updatedFiles.slice(0, maxFiles)
        : updatedFiles;
      onChange(finalFiles);
    } else {
      onChange(droppedFiles[0]);
    }
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;

    if (fileArray.length > 0) {
      if (multiple) {
        const remaining = maxFiles ? maxFiles - fileArray.length : 0;
        if (remaining > 0) {
          return `${fileArray.length} file(s) selected. Click to add ${remaining} more.`;
        }
        return `${fileArray.length} file(s) selected. Click to add more.`;
      }
      return fileArray[0].name;
    }

    return multiple
      ? "Click to upload files or drag and drop"
      : "Click to upload file or drag and drop";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="font-montserrat">
        {label} <RequiredAsterisk required={required} />
      </Label>

      {description && (
        <p className="text-sm text-gray-600 font-montserrat">{description}</p>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragOver
            ? "border-gray-400 bg-gray-100"
            : "border-gray-300 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={id}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-8 h-8 mb-2 text-gray-400" />
          <span className="text-sm text-gray-500 text-center font-montserrat">
            {getPlaceholderText()}
          </span>
          {maxFiles && multiple && (
            <span className="text-xs text-gray-400 mt-1 font-montserrat">
              Maximum {maxFiles} files
            </span>
          )}
        </label>
      </div>

      {/* Display selected files */}
      {fileArray.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium font-montserrat">
            Selected File{fileArray.length > 1 ? "s" : ""}:
          </p>
          <div className="space-y-1">
            {fileArray.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={`flex items-center justify-between p-2 rounded-md ${
                  false
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-sm font-montserrat truncate flex-1">
                  {file.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 font-montserrat">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
