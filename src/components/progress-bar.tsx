interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    label: string;
    completed: boolean;
  }[];
}

export function ProgressBar({
  currentStep,
  totalSteps,
  steps,
}: ProgressBarProps) {
  // Manual progress values for each step to align perfectly with step labels
  // The values chosen are based on visual estimation for better alignment
  const progressValues: { [key: number]: number } = {
    1: 4, // DIVISION - 4%
    2: 21, // PLAYER 1 - 21%
    3: 38, // PLAYER 2 - 37%
    4: 55, // PLAYER 3 - 55%
    5: 75, // BACKUP PLAYER - 75%
    6: 96, // TEAM INFO - 96%
  };

  // For success page (currentStep > totalSteps), show 100% completion
  const progress =
    currentStep > totalSteps ? 100 : progressValues[currentStep] || 0;

  return (
    <div className="mb-8 font-montserrat">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <span
            key={step.label}
            className={`text-xs font-medium font-montserrat ${
              currentStep > totalSteps || currentStep >= index + 1
                ? "text-[#F5A623]"
                : "text-gray-400"
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#F5A623] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
