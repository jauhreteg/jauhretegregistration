"use client";

import * as React from "react";
import { X, Check, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", children, onClose, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return "border-green-200 bg-green-50 text-green-900";
        case "error":
          return "border-red-200 bg-red-50 text-red-900";
        case "warning":
          return "border-yellow-200 bg-yellow-50 text-yellow-900";
        case "info":
          return "border-blue-200 bg-blue-50 text-blue-900";
        default:
          return "border-gray-200 bg-white text-gray-900";
      }
    };

    const getIcon = () => {
      switch (variant) {
        case "success":
          return <Check className="h-5 w-5 text-green-600" />;
        case "error":
          return <AlertCircle className="h-5 w-5 text-red-600" />;
        case "warning":
          return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
        case "info":
          return <Info className="h-5 w-5 text-blue-600" />;
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-auto relative flex w-full items-center space-x-2 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
          getVariantStyles(),
          className
        )}
        {...props}
      >
        {getIcon()}
        <div className="flex-1 text-sm font-medium">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
