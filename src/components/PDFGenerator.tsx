"use client";

import {
  Registration,
  StatusType,
  FIELD_DISPLAY_NAMES,
} from "@/types/database";
import { formatUstadsForPDF } from "@/utils/ustads-utils";

export class PDFGenerator {
  // Helper function to wrap text in red/bold if it needs update
  private static wrapIfNeedsUpdate(
    value: string | null,
    fieldName: string,
    requestedUpdates: string[],
  ): string {
    const needsUpdate = requestedUpdates.includes(fieldName);
    const displayValue = value || "N/A";
    return needsUpdate
      ? `<span style="color: #dc2626; font-weight: 700;">${displayValue}</span>`
      : displayValue;
  }

  private static getRequestedUpdates(registration: Registration): string[] {
    const requestedUpdates = registration.admin_notes?.requested_updates || [];

    // Define field order to match form structure
    const fieldOrder = [
      "team_name",
      "team_location",
      "team_photo",
      "ustad_1",
      "ustad_2",
      "ustad_3",
      "ustad_4",
      "ustad_5",
      "coach_name",
      "coach_email",
      "player_order",
      "player1_name",
      "player1_singh_kaur",
      "player1_dob",
      "player1_dob_proof",
      "player1_email",
      "player1_phone_number",
      "player1_emergency_contact_name",
      "player1_emergency_contact_phone",
      "player1_father_name",
      "player1_mother_name",
      "player1_city",
      "player1_gatka_experience",
      "player2_name",
      "player2_singh_kaur",
      "player2_dob",
      "player2_dob_proof",
      "player2_email",
      "player2_phone_number",
      "player2_emergency_contact_name",
      "player2_emergency_contact_phone",
      "player2_father_name",
      "player2_mother_name",
      "player2_city",
      "player2_gatka_experience",
      "player3_name",
      "player3_singh_kaur",
      "player3_dob",
      "player3_dob_proof",
      "player3_email",
      "player3_phone_number",
      "player3_emergency_contact_name",
      "player3_emergency_contact_phone",
      "player3_father_name",
      "player3_mother_name",
      "player3_city",
      "player3_gatka_experience",
      "backup_player",
      "backup_name",
      "backup_singh_kaur",
      "backup_dob",
      "backup_dob_proof",
      "backup_phone_number",
      "backup_emergency_contact_name",
      "backup_emergency_contact_phone",
      "backup_father_name",
      "backup_mother_name",
      "backup_city",
      "backup_gatka_experience",
    ];

    // Sort and filter requested updates
    const sortedUpdates = requestedUpdates
      .filter((field) => field !== "ustads") // Filter out legacy 'ustads' field
      .sort((a, b) => {
        const aIndex = fieldOrder.indexOf(a);
        const bIndex = fieldOrder.indexOf(b);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      })
      .map((field) => FIELD_DISPLAY_NAMES[field] || field);

    return sortedUpdates;
  }
  private static getStatusBadgeHTML(status: StatusType): string {
    const getStatusConfig = (status: StatusType) => {
      switch (status) {
        case "new submission":
          return {
            className: "status-new-submission",
            label: "New Submission",
          };
        case "in review":
          return {
            className: "status-in-review",
            label: "In Review",
          };
        case "information requested":
          return {
            className: "status-information-requested",
            label: "Info Requested",
          };
        case "updated information":
          return {
            className: "status-updated-information",
            label: "Updated Info",
          };
        case "approved":
          return {
            className: "status-approved",
            label: "Approved",
          };
        case "denied":
          return {
            className: "status-denied",
            label: "Denied",
          };
        case "dropped":
          return {
            className: "status-dropped",
            label: "Dropped",
          };
        default:
          return {
            className: "status-new-submission",
            label:
              String(status).charAt(0).toUpperCase() + String(status).slice(1),
          };
      }
    };

    const config = getStatusConfig(status);
    return `<span class="status-badge ${config.className}">${config.label}</span>`;
  }

  private static generatePDFContent(registration: Registration): string {
    // Get requested updates array
    const requestedUpdates = registration.admin_notes?.requested_updates || [];
    const hasRequestedUpdates = requestedUpdates.length > 0;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Registration - ${registration.form_token}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; }
          .legend { background-color: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 15px; margin-bottom: 25px; }
          .legend-title { color: #dc2626; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
          .legend-text { color: #991b1b; font-size: 14px; }
          .needs-update-example { color: #dc2626; font-weight: 700; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .field { margin: 8px 0; }
          .label { font-weight: bold; display: inline-block; min-width: 120px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; vertical-align: top; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .player-section { margin-bottom: 20px; }
          .player-header { background-color: #f8f9fa; padding: 8px; margin: 10px 0; font-weight: bold; border-left: 4px solid #007bff; }
          .status-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid; }
          .status-new-submission { background-color: #dbeafe; color: #1e40af; border-color: #bfdbfe; }
          .status-in-review { background-color: #fef3c7; color: #a16207; border-color: #fde68a; }
          .status-information-requested { background-color: #fed7aa; color: #c2410c; border-color: #fdba74; }
          .status-updated-information { background-color: #f3e8ff; color: #7c3aed; border-color: #e9d5ff; }
          .status-approved { background-color: #dcfce7; color: #15803d; border-color: #bbf7d0; }
          .status-denied { background-color: #fee2e2; color: #dc2626; border-color: #fecaca; }
          .status-dropped { background-color: #f3f4f6; color: #374151; border-color: #d1d5db; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Registration Details</h1>
          <h2>${registration.team_name}</h2>
          <p><strong>Form Token:</strong> ${registration.form_token}</p>
        </div>

        ${
          hasRequestedUpdates
            ? `
        <!-- Update Legend -->
        <div class="legend">
          <div class="legend-title">⚠️ Information Updates Required</div>
          <div class="legend-text">
            Any information displayed in <span class="needs-update-example">red and bold text</span> requires your attention and needs to be updated.
          </div>
        </div>
        `
            : ""
        }

        <!-- Form Metadata Section -->
        <div class="section">
          <h3>Form Metadata</h3>
          <div class="field"><span class="label">Form Token:</span> ${
            registration.form_token
          }</div>
          <div class="field"><span class="label">Status:</span> ${this.getStatusBadgeHTML(
            registration.status,
          )}</div>
          <div class="field"><span class="label">Division:</span> ${
            registration.division
          }</div>
          <div class="field"><span class="label">Submitted:</span> ${new Date(
            registration.submission_date_time,
          ).toLocaleString()}</div>
          <div class="field"><span class="label">Created:</span> ${new Date(
            registration.created_at,
          ).toLocaleString()}</div>
          <div class="field"><span class="label">Last Updated:</span> ${new Date(
            registration.updated_at,
          ).toLocaleString()}</div>
        </div>

        <!-- Team Information Section -->
        <div class="section">
          <h3>Team Information</h3>
          <div class="field"><span class="label">Team Name:</span> ${this.wrapIfNeedsUpdate(
            registration.team_name,
            "team_name",
            requestedUpdates,
          )}</div>
          <div class="field"><span class="label">Location:</span> ${this.wrapIfNeedsUpdate(
            registration.team_location,
            "team_location",
            requestedUpdates,
          )}</div>
          
          <h4 style="margin-top: 20px;">Ustad Information</h4>
          <div class="field"><span class="label">Ustad:</span><br>${
            registration.ustads && registration.ustads.length > 0
              ? registration.ustads
                  .map((ustad, index) => {
                    const ustadFieldName = `ustad_${index + 1}`;
                    const needsUpdate =
                      requestedUpdates.includes(ustadFieldName);
                    const displayText = `${index + 1}. ${ustad.name} (${ustad.email})`;
                    return needsUpdate
                      ? `<span style="color: #dc2626; font-weight: 700;">${displayText}</span>`
                      : displayText;
                  })
                  .join("<br>")
              : "None"
          }</div>
          
          <h4 style="margin-top: 20px;">Senior Gatkai Coach Information</h4>
          <div class="field"><span class="label">Senior Gatkai Coach Name:</span> ${this.wrapIfNeedsUpdate(
            registration.coach_name,
            "coach_name",
            requestedUpdates,
          )}</div>
          <div class="field"><span class="label">Senior Gatkai Coach Email:</span> ${this.wrapIfNeedsUpdate(
            registration.coach_email,
            "coach_email",
            requestedUpdates,
          )}</div>
          
          <h4 style="margin-top: 20px;">Player Order</h4>
          <div class="field"><span class="label">Default Player Order:</span> ${this.wrapIfNeedsUpdate(
            registration.player_order,
            "player_order",
            requestedUpdates,
          )}</div>
        </div>

        <!-- Player Information Section -->
        <div class="section">
          <h3>Player Information</h3>
          
          <div class="player-section">
            <div class="player-header">Player 1</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_name,
                "player1_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_dob,
                "player1_dob",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_singh_kaur,
                "player1_singh_kaur",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_phone_number,
                "player1_phone_number",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Email</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_email,
                "player1_email",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>City</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_city,
                "player1_city",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_father_name,
                "player1_father_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_mother_name,
                "player1_mother_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_emergency_contact_name,
                "player1_emergency_contact_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_emergency_contact_phone,
                "player1_emergency_contact_phone",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player1_gatka_experience,
                "player1_gatka_experience",
                requestedUpdates,
              )}</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Player 2</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_name,
                "player2_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_dob,
                "player2_dob",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_singh_kaur,
                "player2_singh_kaur",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_phone_number,
                "player2_phone_number",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Email</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_email,
                "player2_email",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>City</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_city,
                "player2_city",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_father_name,
                "player2_father_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_mother_name,
                "player2_mother_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_emergency_contact_name,
                "player2_emergency_contact_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_emergency_contact_phone,
                "player2_emergency_contact_phone",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player2_gatka_experience,
                "player2_gatka_experience",
                requestedUpdates,
              )}</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Player 3</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_name,
                "player3_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_dob,
                "player3_dob",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_singh_kaur,
                "player3_singh_kaur",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_phone_number,
                "player3_phone_number",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Email</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_email,
                "player3_email",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>City</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_city,
                "player3_city",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_father_name,
                "player3_father_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_mother_name,
                "player3_mother_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_emergency_contact_name,
                "player3_emergency_contact_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_emergency_contact_phone,
                "player3_emergency_contact_phone",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.player3_gatka_experience,
                "player3_gatka_experience",
                requestedUpdates,
              )}</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Backup Player</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_name,
                "backup_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_dob,
                "backup_dob",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_singh_kaur,
                "backup_singh_kaur",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_phone_number,
                "backup_phone_number",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Email</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_email,
                "backup_email",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>City</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_city,
                "backup_city",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_father_name,
                "backup_father_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_mother_name,
                "backup_mother_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_emergency_contact_name,
                "backup_emergency_contact_name",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_emergency_contact_phone,
                "backup_emergency_contact_phone",
                requestedUpdates,
              )}</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${this.wrapIfNeedsUpdate(
                registration.backup_gatka_experience,
                "backup_gatka_experience",
                requestedUpdates,
              )}</td></tr>
            </table>
          </div>
        </div>

        ${(() => {
          const requestedUpdates = this.getRequestedUpdates(registration);
          const hasRequestedUpdates = requestedUpdates.length > 0;
          const hasPublicNotes = registration.admin_notes?.public_notes;

          if (!hasRequestedUpdates && !hasPublicNotes) {
            return "";
          }

          return `
        <div class="section">
          <h3>Admin Notes</h3>
          ${
            hasRequestedUpdates
              ? `
          <div class="field" style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-bottom: 15px;">
            <strong>Information Update Required</strong><br>
            The following information has been requested by the Jauhr E Teg Team to be updated:<br><br>
            ${requestedUpdates.map((field) => `• ${field}`).join("<br>")}
          </div>
          `
              : ""
          }
          ${
            hasPublicNotes
              ? `
          <div class="field" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">
            ${registration.admin_notes?.public_notes || ""}
          </div>
          `
              : ""
          }
        </div>
        `;
        })()}
      </body>
      </html>
    `;
  }

  /**
   * Generate and download a PDF for the given registration
   * @param registration - The registration data to generate PDF for
   */
  public static async downloadPDF(registration: Registration): Promise<void> {
    try {
      const content = this.generatePDFContent(registration);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error("Failed to download PDF:", error);
      throw error;
    }
  }

  /**
   * Get the HTML content for the PDF (useful for testing or preview)
   * @param registration - The registration data to generate HTML for
   * @returns The HTML content as a string
   */
  public static getHTMLContent(registration: Registration): string {
    return this.generatePDFContent(registration);
  }
}
