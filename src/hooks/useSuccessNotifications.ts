"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/toast-provider";

export function useSuccessNotifications() {
  const { addToast } = useToast();

  const showUpdateSuccess = useCallback(
    (formToken: string, teamName: string, fieldName?: string) => {
      const message = fieldName
        ? `${formToken} ${teamName}: ${fieldName} updated successfully`
        : `${formToken} ${teamName}: Registration updated successfully`;

      addToast({
        variant: "success",
        title: "Update Successful",
        description: message,
        duration: 3000,
      });
    },
    [addToast]
  );

  const showSaveSuccess = useCallback(
    (formToken: string, teamName: string) => {
      addToast({
        variant: "success",
        title: "Changes Saved",
        description: `${formToken} ${teamName}: All changes saved successfully`,
        duration: 3000,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string) => {
      addToast({
        variant: "error",
        title: "Error",
        description: message,
        duration: 4000,
      });
    },
    [addToast]
  );

  return {
    showUpdateSuccess,
    showSaveSuccess,
    showError,
  };
}
