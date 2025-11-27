"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DivisionSelectionProps {
  value: string;
  onValueChange: (value: string) => void;
  isRequired?: (fieldName: string) => boolean;
}

const RequiredAsterisk = ({
  fieldName,
  isRequired,
}: {
  fieldName: string;
  isRequired?: (fieldName: string) => boolean;
}) => {
  return isRequired?.(fieldName) ? (
    <span className="text-red-600">*</span>
  ) : null;
};

export function DivisionSelection({
  value,
  onValueChange,
  isRequired = () => false,
}: DivisionSelectionProps) {
  return (
    <div className="space-y-6 font-montserrat">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold uppercase mb-6 font-montserrat">
          Select Your Division
        </h2>
        <p className="text-lg text-gray-600">
          Choose the division your team will compete in. This will determine the
          requirements for your registration.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          <div className="text-center">
            <Label htmlFor="division" className="text-lg font-medium">
              Competition Division{" "}
              <RequiredAsterisk fieldName="division" isRequired={isRequired} />
            </Label>
          </div>
          <div className="flex justify-center">
            <Select value={value} onValueChange={onValueChange}>
              <SelectTrigger
                className={`h-12 text-base w-full ${
                  false
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              >
                <SelectValue placeholder="Select your division" />
              </SelectTrigger>
              <SelectContent
                className={`${
                  false
                    ? "bg-gray-900 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectItem value="Junior Kaurs">Junior Kaurs</SelectItem>
                <SelectItem value="Junior Singhs">Junior Singhs</SelectItem>
                <SelectItem value="Open Kaurs">Open Kaurs</SelectItem>
                <SelectItem value="Open Singhs">Open Singhs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {value && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Selected:</strong> {value}
              {(value === "Open Kaurs" || value === "Open Singhs") && (
                <div className="mt-2">
                  <em>
                    Note: Proof of age documents will not be required for Open
                    divisions.
                  </em>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
