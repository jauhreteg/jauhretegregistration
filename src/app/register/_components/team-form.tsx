"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";

import { TeamData } from "@/types/form-types";

interface TeamFormProps {
  teamData: TeamData;
  validationErrors: Record<string, string | undefined>;
  onFieldChange: (field: string, value: string | File | File[] | null) => void;
  onValidationError: (field: string, error: string | undefined) => void;
  isRequired?: (fieldName: string) => boolean;
  playerNames: {
    player1: string;
    player2: string;
    player3: string;
  };
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

export default function TeamForm({
  teamData,
  validationErrors,
  onFieldChange,
  onValidationError,
  isRequired = () => false,
  playerNames,
}: TeamFormProps) {
  // Enhanced field change handler
  const handleFieldChange = (
    field: keyof TeamData,
    value: string | File | File[] | null
  ) => {
    onFieldChange(field, value);

    // Clear validation errors when user starts typing
    onValidationError(field, undefined);
  };

  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-xl font-bold uppercase mb-6">Team Information</h2>

      {/* Team Name Section */}
      <div className="space-y-2">
        <Label htmlFor="teamName">
          Team Name{" "}
          <RequiredAsterisk fieldName="teamName" isRequired={isRequired} />
        </Label>
        <Input
          id="teamName"
          value={teamData.teamName}
          onChange={(e) => handleFieldChange("teamName", e.target.value)}
          placeholder="Enter team name"
          className={`h-10 ${
            false
              ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
              : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
          }`}
        />
      </div>

      {/* Team Leadership Section */}
      <div className="space-y-4">
        {/* Ustaad Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ustadName">
              Ustaad Name{" "}
              <RequiredAsterisk fieldName="ustadName" isRequired={isRequired} />
            </Label>
            <Input
              id="ustadName"
              value={teamData.ustadName}
              onChange={(e) => handleFieldChange("ustadName", e.target.value)}
              placeholder="Enter ustaad name"
              className={`h-10 ${
                false
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ustadEmail">
              Ustaad Email{" "}
              <RequiredAsterisk
                fieldName="ustadEmail"
                isRequired={isRequired}
              />
            </Label>
            <Input
              id="ustadEmail"
              type="email"
              value={teamData.ustadEmail || ""}
              onChange={(e) => handleFieldChange("ustadEmail", e.target.value)}
              placeholder="ustaad@example.com"
              className={`h-10 ${
                false
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Senior Gatkai Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seniorGatkaiName">
              Senior Gatkai Name{" "}
              <RequiredAsterisk
                fieldName="seniorGatkaiName"
                isRequired={isRequired}
              />
            </Label>
            <Input
              id="seniorGatkaiName"
              value={teamData.seniorGatkaiName}
              onChange={(e) =>
                handleFieldChange("seniorGatkaiName", e.target.value)
              }
              placeholder="Enter senior gatkai name (optional)"
              className={`h-10 ${
                false
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniorGatkaiEmail">
              Senior Gatkai Email{" "}
              <RequiredAsterisk
                fieldName="seniorGatkaiEmail"
                isRequired={isRequired}
              />
            </Label>
            <Input
              id="seniorGatkaiEmail"
              type="email"
              value={teamData.seniorGatkaiEmail || ""}
              onChange={(e) =>
                handleFieldChange("seniorGatkaiEmail", e.target.value)
              }
              placeholder="seniorgatkai@example.com (optional)"
              className={`h-10 ${
                false
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">
              City <RequiredAsterisk fieldName="city" isRequired={isRequired} />
            </Label>
            <Input
              id="city"
              value={teamData.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              placeholder="Enter city"
              className={`h-10 ${
                false
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">
              State{" "}
              <RequiredAsterisk fieldName="state" isRequired={isRequired} />
            </Label>
            <Input
              id="state"
              value={teamData.state}
              onChange={(e) => handleFieldChange("state", e.target.value)}
              placeholder="Enter state"
              className={`h-10 ${
                false
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">
              Country{" "}
              <RequiredAsterisk fieldName="country" isRequired={isRequired} />
            </Label>
            <Input
              id="country"
              value={teamData.country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              placeholder="Enter country"
              className={`h-10 ${
                false
                  ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Player Order Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">
          Player Default Order
        </h3>
        <p className="text-sm text-gray-500">
          Set the default order for your players. This can be changed during
          matches.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="playerOrder1">
              1st Position{" "}
              <RequiredAsterisk
                fieldName="playerOrder1"
                isRequired={isRequired}
              />
            </Label>
            <Select
              value={teamData.playerOrder1}
              onValueChange={(value) =>
                handleFieldChange("playerOrder1", value)
              }
            >
              <SelectTrigger
                className={`h-10 ${
                  false
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              >
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent
                className={`${
                  false
                    ? "bg-gray-900 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectItem value="Player 1">{playerNames.player1}</SelectItem>
                <SelectItem value="Player 2">{playerNames.player2}</SelectItem>
                <SelectItem value="Player 3">{playerNames.player3}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerOrder2">
              2nd Position{" "}
              <RequiredAsterisk
                fieldName="playerOrder2"
                isRequired={isRequired}
              />
            </Label>
            <Select
              value={teamData.playerOrder2}
              onValueChange={(value) =>
                handleFieldChange("playerOrder2", value)
              }
            >
              <SelectTrigger
                className={`h-10 ${
                  false
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              >
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent
                className={`${
                  false
                    ? "bg-gray-900 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectItem value="Player 1">{playerNames.player1}</SelectItem>
                <SelectItem value="Player 2">{playerNames.player2}</SelectItem>
                <SelectItem value="Player 3">{playerNames.player3}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerOrder3">
              3rd Position{" "}
              <RequiredAsterisk
                fieldName="playerOrder3"
                isRequired={isRequired}
              />
            </Label>
            <Select
              value={teamData.playerOrder3}
              onValueChange={(value) =>
                handleFieldChange("playerOrder3", value)
              }
            >
              <SelectTrigger
                className={`h-10 ${
                  false
                    ? "border-gray-600 bg-gray-800 text-white focus:border-gray-400"
                    : "border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                }`}
              >
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent
                className={`${
                  false
                    ? "bg-gray-900 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectItem value="Player 1">{playerNames.player1}</SelectItem>
                <SelectItem value="Player 2">{playerNames.player2}</SelectItem>
                <SelectItem value="Player 3">{playerNames.player3}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Team Photos Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-montserrat">Team Photos</h3>
        <div className="space-y-3">
          <div
            className={`p-4 rounded-lg ${
              false ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"
            }`}
          >
            <p className="text-sm leading-relaxed mb-2 font-montserrat">
              <strong>Photo Requirements:</strong>
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside font-montserrat">
              <li>
                Team pictures must be taken in bana with Ustad and all players
                in one picture
              </li>
              <li>NO collages - but you can upload multiple photos</li>
              <li>High resolution and clear visibility of all team members</li>
              <li>Acceptable formats: JPG, PNG, or PDF</li>
            </ul>
          </div>

          <FileUpload
            id="teamPhotos"
            label="Upload Team Photos"
            value={teamData.teamPhotos}
            onChange={(files) =>
              handleFieldChange("teamPhotos", files as File[])
            }
            accept="image/*,.pdf"
            multiple
            required={isRequired?.("teamPhotos")}
          />
        </div>
      </div>
    </div>
  );
}
