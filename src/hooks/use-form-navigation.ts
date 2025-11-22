import { useState, useCallback } from "react";
import { scrollToTop } from "@/utils/form-utils";

export function useFormNavigation(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
        scrollToTop();
      }
    },
    [totalSteps]
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      scrollToTop();
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      scrollToTop();
    }
  }, [currentStep]);

  const resetNavigation = useCallback(() => {
    setCurrentStep(1);
    scrollToTop();
  }, []);

  return {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    resetNavigation,
    canGoNext: currentStep < totalSteps,
    canGoBack: currentStep > 1,
    progress: (currentStep / totalSteps) * 100,
  };
}
