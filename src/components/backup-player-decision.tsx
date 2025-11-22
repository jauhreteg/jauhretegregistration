import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/theme-context";

interface BackupPlayerDecisionProps {
  value: boolean | null;
  onValueChange: (value: boolean | null) => void;
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

export function BackupPlayerDecision({
  value,
  onValueChange,
  isRequired = () => false,
}: BackupPlayerDecisionProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold uppercase mb-6 font-montserrat">
        Backup Player
      </h2>

      <div className="space-y-4">
        <Label className="text-base font-medium font-montserrat">
          Will your team have a backup player?{" "}
          <RequiredAsterisk
            fieldName="hasBackupPlayer"
            isRequired={isRequired}
          />
        </Label>

        <div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          <p className="text-sm leading-relaxed mb-2 font-montserrat">
            <strong>Backup Player Rules:</strong>
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside font-montserrat">
            <li>
              A backup player can substitute for any of the 3 main players
              during the tournament
            </li>
            <li>
              The backup player must be registered before the tournament begins
            </li>
            <li>
              Once substituted, the original player cannot return for that match
            </li>
            <li>
              The backup player follows the same age and eligibility
              requirements
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <Select
            value={value === null ? "" : value.toString()}
            onValueChange={(newValue) => {
              if (newValue === "") {
                onValueChange(null);
              } else {
                onValueChange(newValue === "true");
              }
            }}
          >
            <SelectTrigger
              className={`w-full ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent
              className={`${
                isDarkMode
                  ? "bg-gray-900 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <SelectItem value="true">
                Yes, we will have a backup player
              </SelectItem>
              <SelectItem value="false">
                No, we will not have a backup player
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
