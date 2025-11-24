import { useTheme } from "@/contexts/theme-context";
import ThemeSelector from "@/components/theme-selector";
import { PageHeader } from "@/components/page-header";
import { ProgressBar } from "@/components/progress-bar";
import { ValidationErrorDisplay } from "@/components/validation-error-display";
import { FormNavigation } from "@/components/form-navigation";
import { ReactNode } from "react";

interface FormLayoutProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  steps: Array<{ label: string; completed: boolean }>;
  validationError?: {
    isVisible: boolean;
    missingFields: string[];
  };
  navigation: {
    canGoBack: boolean;
    canGoNext: boolean;
    isLastStep: boolean;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    hideStepCounter?: boolean;
    customSubmitText?: string;
  };
  children: ReactNode;
}

export function FormLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  steps,
  validationError,
  navigation,
  children,
}: FormLayoutProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen p-4 md:p-8 font-montserrat ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Theme Selector - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeSelector />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <PageHeader title={title} />

        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />

        {/* Required Fields Notice - Only show during form steps, not on success */}
        {currentStep <= totalSteps && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All Fields Marked With <span className="text-red-600">*</span> Are
              Required
            </p>
          </div>
        )}

        {/* Validation Errors */}
        <ValidationErrorDisplay
          isVisible={validationError?.isVisible || false}
          missingFields={validationError?.missingFields || []}
        />

        {/* Form Content */}
        <div
          className={`border rounded-lg p-6 md:p-8 mb-6 ${
            isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {children}
        </div>

        {/* Navigation */}
        <FormNavigation
          {...navigation}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </div>
    </div>
  );
}
