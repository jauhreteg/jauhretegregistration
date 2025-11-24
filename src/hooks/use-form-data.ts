import { useState, useCallback } from "react";
import { FormData } from "@/types/form-types";
import { getInitialFormData } from "@/data/initial-form-data";

export function useFormData() {
  const [formData, setFormData] = useState<FormData>(getInitialFormData());

  const updateField = useCallback(
    (field: keyof FormData, value: string | File | File[] | null | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateMultipleFields = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
  }, []);

  return {
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
  };
}
