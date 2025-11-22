import { AlertCircle } from "lucide-react";

interface ValidationErrorDisplayProps {
  isVisible: boolean;
  missingFields: string[];
}

export function ValidationErrorDisplay({
  isVisible,
  missingFields,
}: ValidationErrorDisplayProps) {
  if (!isVisible || missingFields.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-900 mb-2 font-montserrat">
            Please complete the following required fields:
          </p>
          <ul className="text-sm text-red-800 space-y-1 font-montserrat">
            {missingFields.map((field, index) => (
              <li key={index}>• {field}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
