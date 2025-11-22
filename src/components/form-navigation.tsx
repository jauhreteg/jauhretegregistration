import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  hideStepCounter?: boolean;
  customSubmitText?: string;
}

export function FormNavigation({
  currentStep,
  totalSteps,
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  hideStepCounter = false,
  customSubmitText,
}: FormNavigationProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
        {!hideStepCounter && (
          <span>
            Step {currentStep} of {totalSteps}
          </span>
        )}
      </div>

      <div className="flex gap-4">
        {canGoBack && (
          <Button
            onClick={onBack}
            variant="outline"
            disabled={isSubmitting}
            className={`px-8 uppercase font-montserrat ${
              isDarkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            BACK
          </Button>
        )}

        {!isLastStep && canGoNext && (
          <Button
            onClick={onNext}
            disabled={isSubmitting}
            className={`px-8 uppercase font-montserrat transition-all duration-200 ${
              isDarkMode
                ? "bg-[#F5A623] text-black hover:bg-white hover:text-black"
                : "bg-[#F5A623] text-white hover:bg-black hover:text-white"
            }`}
          >
            NEXT
          </Button>
        )}

        {isLastStep && (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`px-8 uppercase font-montserrat transition-all duration-200 ${
              isDarkMode
                ? "bg-[#F5A623] text-black hover:bg-white hover:text-black"
                : "bg-[#F5A623] text-white hover:bg-black hover:text-white"
            }`}
          >
            {isSubmitting ? "SUBMITTING..." : customSubmitText || "SUBMIT"}
          </Button>
        )}
      </div>
    </div>
  );
}
