"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  HelpCircle,
  Archive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RegistrationService } from "@/services/registrationService";
import { Registration, StatusType } from "@/types/database";
import { FilePreview } from "@/components/FilePreview";

// StatusBadge component matching the registrations table implementation
const StatusBadge = ({ status }: { status: StatusType }) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "new submission":
        return {
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
          icon: <FileText className="h-3 w-3" />,
          label: "New Submission",
        };
      case "in review":
        return {
          className:
            "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
          icon: <Eye className="h-3 w-3" />,
          label: "In Review",
        };
      case "information requested":
        return {
          className:
            "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
          icon: <HelpCircle className="h-3 w-3" />,
          label: "Info Requested",
        };
      case "approved":
        return {
          className:
            "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Approved",
        };
      case "denied":
        return {
          className:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
          icon: <XCircle className="h-3 w-3" />,
          label: "Denied",
        };
      case "dropped":
        return {
          className:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
          icon: <Archive className="h-3 w-3" />,
          label: "Dropped",
        };
      default:
        return {
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
          icon: <FileText className="h-3 w-3" />,
          label:
            String(status).charAt(0).toUpperCase() + String(status).slice(1),
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={`${config.className} flex items-center gap-1 font-medium text-xs px-2 py-1 hover:bg-inherit hover:text-inherit hover:border-inherit pointer-events-none`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default function ViewRegistrationPage() {
  const router = useRouter();
  const [formToken, setFormToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<Registration | null>(null);

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formToken.trim()) {
      setError("Please enter your registration token");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await RegistrationService.getRegistrationByToken(
        formToken.trim()
      );

      if (result.error) {
        setError(
          "Registration not found. Please check your token and try again."
        );
      } else if (result.data) {
        setRegistration(result.data);
      } else {
        setError(
          "Registration not found. Please check your token and try again."
        );
      }
    } catch (err) {
      console.error("Error fetching registration:", err);
      setError(
        "An error occurred while searching for your registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleEditRegistration = () => {
    // TODO: Implement edit functionality later
    console.log("Edit functionality will be implemented later");
  };

  if (registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToHome}
                  className="flex items-center gap-2 bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  onClick={handleEditRegistration}
                  className="bg-black text-white hover:bg-[#F5A623] hover:text-white transition-colors duration-300"
                >
                  Edit Registration
                </Button>
              </div>
              <h1 className="text-2xl font-bold font-montserrat">
                Registration Details
              </h1>
            </div>

            {/* Registration Info Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{registration.team_name || "Team Registration"}</span>
                  <div className="flex gap-2">
                    <StatusBadge status={registration.status} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Form Token:</span>{" "}
                    {registration.form_token}
                  </div>
                  <div>
                    <span className="font-medium">Division:</span>{" "}
                    {registration.division}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date(
                      registration.submission_date_time
                    ).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {registration.team_location}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Ustad Name</Label>
                    <p className="text-sm text-gray-600">
                      {registration.ustad_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Ustad Email</Label>
                    <p className="text-sm text-gray-600">
                      {registration.ustad_email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Senior Gatkai Coach</Label>
                    <p className="text-sm text-gray-600">
                      {registration.coach_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">
                      Senior Gatkai Coach Email
                    </Label>
                    <p className="text-sm text-gray-600">
                      {registration.coach_email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Team Location</Label>
                    <p className="text-sm text-gray-600">
                      {registration.team_location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Has Backup Player</Label>
                    <p className="text-sm text-gray-600">
                      {registration.backup_player ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Player Order</Label>
                  <p className="text-sm text-gray-600">
                    {registration.player_order || "N/A"}
                  </p>
                </div>

                {/* Team Photos */}
                <div>
                  <Label className="font-medium">Team Photos</Label>
                  {registration.team_photo &&
                  registration.team_photo.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-6">
                      {registration.team_photo.map(
                        (photoUrl: string, index: number) => (
                          <FilePreview
                            key={index}
                            url={photoUrl}
                            index={index}
                            label="Team Photo"
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      No team photos uploaded
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Players Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Players Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Player 1 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-lg mb-2">Player 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {registration.player1_name}
                      </div>
                      <div>
                        <span className="font-medium">Singh/Kaur:</span>{" "}
                        {registration.player1_singh_kaur}
                      </div>
                      <div>
                        <span className="font-medium">DOB:</span>{" "}
                        {registration.player1_dob || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {registration.player1_phone_number}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {registration.player1_email}
                      </div>
                      <div>
                        <span className="font-medium">City:</span>{" "}
                        {registration.player1_city || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Emergency Contact:</span>{" "}
                        {registration.player1_emergency_contact_name}
                      </div>
                      <div>
                        <span className="font-medium">Emergency Phone:</span>{" "}
                        {registration.player1_emergency_contact_phone}
                      </div>
                      <div>
                        <span className="font-medium">Father's Name:</span>{" "}
                        {registration.player1_father_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Mother's Name:</span>{" "}
                        {registration.player1_mother_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Gatka Experience:</span>{" "}
                        {registration.player1_gatka_experience}
                      </div>
                    </div>
                    {/* Player 1 DOB Proof */}
                    <div className="mt-3">
                      <span className="font-medium text-sm">DOB Proof:</span>
                      {registration.player1_dob_proof &&
                      registration.player1_dob_proof.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-6">
                          {registration.player1_dob_proof.map(
                            (proofUrl: string, index: number) => (
                              <FilePreview
                                key={index}
                                url={proofUrl}
                                index={index}
                                label="Player 1 DOB Document"
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {" "}
                          No proof uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Player 2 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-lg mb-2">Player 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {registration.player2_name}
                      </div>
                      <div>
                        <span className="font-medium">Singh/Kaur:</span>{" "}
                        {registration.player2_singh_kaur}
                      </div>
                      <div>
                        <span className="font-medium">DOB:</span>{" "}
                        {registration.player2_dob || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {registration.player2_phone_number}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {registration.player2_email}
                      </div>
                      <div>
                        <span className="font-medium">City:</span>{" "}
                        {registration.player2_city || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Emergency Contact:</span>{" "}
                        {registration.player2_emergency_contact_name}
                      </div>
                      <div>
                        <span className="font-medium">Emergency Phone:</span>{" "}
                        {registration.player2_emergency_contact_phone}
                      </div>
                      <div>
                        <span className="font-medium">Father's Name:</span>{" "}
                        {registration.player2_father_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Mother's Name:</span>{" "}
                        {registration.player2_mother_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Gatka Experience:</span>{" "}
                        {registration.player2_gatka_experience}
                      </div>
                    </div>
                    {/* Player 2 DOB Proof */}
                    <div className="mt-3">
                      <span className="font-medium text-sm">DOB Proof:</span>
                      {registration.player2_dob_proof &&
                      registration.player2_dob_proof.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-6">
                          {registration.player2_dob_proof.map(
                            (proofUrl: string, index: number) => (
                              <FilePreview
                                key={index}
                                url={proofUrl}
                                index={index}
                                label="Player 2 DOB Document"
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {" "}
                          No proof uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Player 3 */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-lg mb-2">Player 3</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {registration.player3_name}
                      </div>
                      <div>
                        <span className="font-medium">Singh/Kaur:</span>{" "}
                        {registration.player3_singh_kaur}
                      </div>
                      <div>
                        <span className="font-medium">DOB:</span>{" "}
                        {registration.player3_dob || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {registration.player3_phone_number}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {registration.player3_email}
                      </div>
                      <div>
                        <span className="font-medium">City:</span>{" "}
                        {registration.player3_city || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Emergency Contact:</span>{" "}
                        {registration.player3_emergency_contact_name}
                      </div>
                      <div>
                        <span className="font-medium">Emergency Phone:</span>{" "}
                        {registration.player3_emergency_contact_phone}
                      </div>
                      <div>
                        <span className="font-medium">Father's Name:</span>{" "}
                        {registration.player3_father_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Mother's Name:</span>{" "}
                        {registration.player3_mother_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Gatka Experience:</span>{" "}
                        {registration.player3_gatka_experience}
                      </div>
                    </div>
                    {/* Player 3 DOB Proof */}
                    <div className="mt-3">
                      <span className="font-medium text-sm">DOB Proof:</span>
                      {registration.player3_dob_proof &&
                      registration.player3_dob_proof.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-6">
                          {registration.player3_dob_proof.map(
                            (proofUrl: string, index: number) => (
                              <FilePreview
                                key={index}
                                url={proofUrl}
                                index={index}
                                label="DOB Proof"
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {" "}
                          No proof uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Backup Player */}
                  {registration.backup_player && registration.backup_name && (
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium text-lg mb-2">
                        Backup Player
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Name:</span>{" "}
                          {registration.backup_name}
                        </div>
                        <div>
                          <span className="font-medium">Singh/Kaur:</span>{" "}
                          {registration.backup_singh_kaur || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">DOB:</span>{" "}
                          {registration.backup_dob || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span>{" "}
                          {registration.backup_phone_number || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span>{" "}
                          {registration.backup_email || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">City:</span>{" "}
                          {registration.backup_city || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">
                            Emergency Contact:
                          </span>{" "}
                          {registration.backup_emergency_contact_name || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Emergency Phone:</span>{" "}
                          {registration.backup_emergency_contact_phone || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Father's Name:</span>{" "}
                          {registration.backup_father_name || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Mother's Name:</span>{" "}
                          {registration.backup_mother_name || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Gatka Experience:</span>{" "}
                          {registration.backup_gatka_experience || "N/A"}
                        </div>
                      </div>
                      {/* Backup Player DOB Proof */}
                      <div className="mt-3">
                        <span className="font-medium text-sm">DOB Proof:</span>
                        {registration.backup_dob_proof &&
                        registration.backup_dob_proof.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-6">
                            {registration.backup_dob_proof.map(
                              (proofUrl: string, index: number) => (
                                <FilePreview
                                  key={index}
                                  url={proofUrl}
                                  index={index}
                                  label="Backup Player DOB Document"
                                />
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            {" "}
                            No proof uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold font-montserrat">
              View Registration
            </CardTitle>
            <p className="text-sm text-gray-600">
              Enter your registration token to view your registration details
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Registration Token</Label>
                <Input
                  id="token"
                  type="text"
                  value={formToken}
                  onChange={(e) => setFormToken(e.target.value)}
                  placeholder="Enter your registration token"
                  className="font-mono"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white hover:bg-[#F5A623] hover:text-white transition-colors duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      View Registration
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToHome}
                  className="w-full bg-white text-black border-2 border-gray-300 hover:bg-black hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
