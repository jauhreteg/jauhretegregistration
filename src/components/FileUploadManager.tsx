"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePreview } from "@/components/FilePreview";
import { Upload, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FileUploadManagerProps {
  files: string[] | null;
  label: string;
  fileType: string;
  registrationId: string;
  onFilesChange: (files: string[]) => void;
}

export function FileUploadManager({
  files,
  label,
  fileType,
  registrationId,
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
        const fileExtension = file.name.split(".").pop();
        const fileName = `${registrationId}-${fileType}-${Date.now()}-${i}.${fileExtension}`;
        const filePath = `${fileType}/${fileName}`;

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from("file_uploads")
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("file_uploads")
          .getPublicUrl(filePath);

        uploadedFiles.push(publicUrlData.publicUrl);

        // Update file_uploads table
        await supabase.from("file_uploads").insert({
          registration_id: registrationId,
          file_type: fileType as any,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        });
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
      // Extract file path from URL
      const urlParts = fileUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${fileType}/${fileName}`;

      // Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from("file_uploads")
        .remove([filePath]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
      }

      // Delete from file_uploads table
      await supabase
        .from("file_uploads")
        .delete()
        .eq("registration_id", registrationId)
        .eq("file_path", filePath);

      // Update the files array
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
