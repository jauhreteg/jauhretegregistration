import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/contexts/theme-context";
import { ReactNode } from "react";

interface ModalSectionProps {
  title: string;
  content: ReactNode;
  agreementText: string;
  isAgreed: boolean;
  onAgreementChange: (agreed: boolean) => void;
  showFullContent?: boolean;
  onShowFullContent?: () => void;
  fullContentButtonText?: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: ModalSectionProps[];
  onProceed: () => void;
  requireBothAgreements?: boolean;
}

function ModalSection({
  title,
  content,
  agreementText,
  isAgreed,
  onAgreementChange,
  showFullContent,
  onShowFullContent,
  fullContentButtonText,
}: ModalSectionProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`space-y-3 p-4 border rounded-lg ${
        isDarkMode ? "border-gray-600 bg-black" : "border-gray-200 bg-gray-50"
      }`}
    >
      <h3 className="font-bold text-lg font-montserrat">{title}</h3>
      <div className="text-sm font-montserrat">{content}</div>

      {showFullContent && onShowFullContent && fullContentButtonText && (
        <button
          onClick={onShowFullContent}
          className={`text-sm hover:underline font-medium font-montserrat ${
            isDarkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {fullContentButtonText} →
        </button>
      )}

      <div className="flex items-start gap-3 mt-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <Checkbox
          id={`checkbox-${title.replace(/\s+/g, "-").toLowerCase()}`}
          checked={isAgreed}
          onCheckedChange={(checked) => onAgreementChange(checked as boolean)}
          className="mt-0.5"
        />
        <label
          htmlFor={`checkbox-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-sm font-medium leading-relaxed cursor-pointer font-montserrat flex-1 select-none"
        >
          {agreementText} <span className="text-red-600 font-bold">*</span>
        </label>
      </div>
    </div>
  );
}

export function RegistrationModal({
  isOpen,
  onClose,
  sections,
  onProceed,
  requireBothAgreements = true,
}: RegistrationModalProps) {
  const { isDarkMode } = useTheme();

  const canProceed = requireBothAgreements
    ? sections.every((section) => section.isAgreed)
    : sections.some((section) => section.isAgreed);

  const handleProceed = () => {
    if (canProceed) {
      onProceed();
    } else {
      const message = requireBothAgreements
        ? "You must agree to both terms to proceed."
        : "You must agree to at least one of the terms to proceed.";
      alert(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-2xl max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? "bg-black text-white border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-montserrat">
            Before You Register
          </DialogTitle>
          <DialogDescription
            className={`text-center font-montserrat ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Please review and agree to the following requirements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {sections.map((section, index) => (
            <ModalSection key={index} {...section} />
          ))}

          {/* Action Buttons */}
          <div
            className={`flex gap-4 justify-end pt-4 border-t ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}
          >
            <Button
              variant="outline"
              onClick={onClose}
              className={`uppercase font-montserrat border-red-500 text-red-500 hover:bg-red-500 hover:text-white ${
                isDarkMode
                  ? "border-red-400 text-red-400 hover:bg-red-400"
                  : "border-red-500 text-red-500 hover:bg-red-500"
              }`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceed}
              disabled={!canProceed}
              className={`uppercase font-montserrat transition-all duration-200 ${
                canProceed
                  ? `bg-[#F5A623] ${
                      isDarkMode
                        ? "text-black hover:bg-white hover:text-black"
                        : "text-white hover:bg-black hover:text-white"
                    }`
                  : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              Proceed to Registration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
