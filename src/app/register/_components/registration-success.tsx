"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface RegistrationSuccessProps {
  registrationToken: string;
  onComplete: () => void;
}

export function RegistrationSuccess({
  registrationToken,
  onComplete,
}: RegistrationSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(registrationToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = registrationToken;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="text-center space-y-6 font-montserrat">
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-[#F5A623] rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Thank You Message */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-montserrat text-[#F5A623]">
          Registration Complete!
        </h1>

        <p className="text-lg font-montserrat max-w-2xl mx-auto text-gray-600">
          Your registration has been successfully submitted and will be reviewed
          by the Jauhr-E-Teg team and the Ustad whose name was provided in your
          registration. We may contact you for additional information or
          corrections if needed, and will get back to you soon.
        </p>
      </div>

      {/* Registration Token Section */}
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold font-montserrat text-gray-800">
          Your Registration Token
        </h2>

        <div className="p-6 rounded-lg border-2 border-dashed border-[#F5A623] bg-[#F5A623]/5">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[#F5A623] text-2xl">
              {registrationToken}
            </span>
            <Button
              onClick={handleCopyToken}
              variant="ghost"
              size="sm"
              className="ml-4 text-[#F5A623] hover:text-[#F5A623] hover:bg-[#F5A623]/10"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        <p className="text-sm font-montserrat text-gray-500">
          Please save this token - you'll need it to make changes to your
          registration later.
        </p>
      </div>
    </div>
  );
}
