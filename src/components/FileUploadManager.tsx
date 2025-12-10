"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePreview } from "@/components/FilePreview";
import { Upload, Trash2, Plus } from "lucide-react";
import { uploadFile } from "@/utils/file-storage";
import { supabase } from "@/lib/supabase";

interface FileUploadManagerProps {
  files: string[] | null;
  label: string;
  fileType:
    | "team_photo"
    | "player1_dob_proof"
    | "player2_dob_proof"
    | "player3_dob_proof"
    | "backup_dob_proof";
  registrationId: string;
  formToken: string;
  onFilesChange: (files: string[]) => void;
}

export function FileUploadManager({
  files,
  label,
  fileType,
  registrationId,
  formToken,
  onFilesChange,
}: FileUploadManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedFiles: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Use the existing file storage utility
        const { url, error } = await uploadFile(file, fileType, formToken);

        if (error || !url) {
          throw new Error(error || "Failed to upload file");
        }

        uploadedFiles.push(url);
      }

      // Update the files array
      const currentFiles = files || [];
      const newFiles = [...currentFiles, ...uploadedFiles];
      onFilesChange(newFiles);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleFileDelete = async (fileUrl: string, index: number) => {
    try {
      // Extract file path from the public URL
      // URL format: https://...supabase.co/storage/v1/object/public/jet-documents/path/to/file
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split("/");
      const bucketIndex = pathParts.indexOf("jet-documents");

      if (bucketIndex === -1) {
        throw new Error("Invalid file URL format");
      }

      // Get the file path relative to the bucket
      const filePath = pathParts.slice(bucketIndex + 1).join("/");

      // Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from("jet-documents")
        .remove([filePath]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        // Don't throw error for storage deletion failure, continue with array update
      }

      // Update the files array (remove from local state)
      const currentFiles = files || [];
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onFilesChange(newFiles);
    } catch (error) {
      console.error("Delete error:", error);
      setUploadError("Failed to delete file. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">{label}</h4>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id={`upload-${fileType}`}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              document.getElementById(`upload-${fileType}`)?.click()
            }
            disabled={isUploading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Add Files"}
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="text-sm text-red-600 mb-3 p-2 bg-red-50 rounded">
          {uploadError}
        </div>
      )}

      {files && files.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {files.map((fileUrl, index) => (
            <div key={index} className="relative group">
              <FilePreview url={fileUrl} index={index} label={label} />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleFileDelete(fileUrl, index)}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 p-4 border-2 border-dashed rounded-lg text-center">
          No files uploaded yet. Click "Add Files" to upload.
        </div>
      )}
    </div>
  );
}
