"use client";

import { Registration, StatusType } from "@/types/database";

export class PDFGenerator {
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
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Registration - ${registration.form_token}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; }
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

        <!-- Form Metadata Section -->
        <div class="section">
          <h3>Form Metadata</h3>
          <div class="field"><span class="label">Form Token:</span> ${
            registration.form_token
          }</div>
          <div class="field"><span class="label">Status:</span> ${this.getStatusBadgeHTML(
            registration.status
          )}</div>
          <div class="field"><span class="label">Division:</span> ${
            registration.division
          }</div>
          <div class="field"><span class="label">Submitted:</span> ${new Date(
            registration.submission_date_time
          ).toLocaleString()}</div>
          <div class="field"><span class="label">Created:</span> ${new Date(
            registration.created_at
          ).toLocaleString()}</div>
          <div class="field"><span class="label">Last Updated:</span> ${new Date(
            registration.updated_at
          ).toLocaleString()}</div>
        </div>

        <!-- Team Information Section -->
        <div class="section">
          <h3>Team Information</h3>
          <div class="field"><span class="label">Team Name:</span> ${
            registration.team_name
          }</div>
          <div class="field"><span class="label">Location:</span> ${
            registration.team_location || "N/A"
          }</div>
          
          <h4 style="margin-top: 20px;">Ustad Information</h4>
          <div class="field"><span class="label">Ustad Name:</span> ${
            registration.ustad_name || "N/A"
          }</div>
          <div class="field"><span class="label">Ustad Email:</span> ${
            registration.ustad_email || "N/A"
          }</div>
          
          <h4 style="margin-top: 20px;">Senior Gatkai Coach Information</h4>
          <div class="field"><span class="label">Senior Gatkai Coach Name:</span> ${
            registration.coach_name || "N/A"
          }</div>
          <div class="field"><span class="label">Senior Gatkai Coach Email:</span> ${
            registration.coach_email || "N/A"
          }</div>
          
          <h4 style="margin-top: 20px;">Player Order</h4>
          <div class="field"><span class="label">Default Player Order:</span> ${
            registration.player_order || "N/A"
          }</div>
        </div>

        <!-- Player Information Section -->
        <div class="section">
          <h3>Player Information</h3>
          
          <div class="player-section">
            <div class="player-header">Player 1</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.player1_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.player1_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.player1_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.player1_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.player1_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.player1_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.player1_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.player1_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.player1_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.player1_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.player1_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Player 2</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.player2_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.player2_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.player2_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.player2_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.player2_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.player2_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.player2_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.player2_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.player2_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.player2_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.player2_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Player 3</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.player3_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.player3_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.player3_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.player3_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.player3_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.player3_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.player3_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.player3_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.player3_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.player3_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.player3_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>

          <div class="player-section">
            <div class="player-header">Backup Player</div>
            <table>
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td><strong>Name</strong></td><td>${
                registration.backup_name || "N/A"
              }</td></tr>
              <tr><td><strong>Date of Birth</strong></td><td>${
                registration.backup_dob || "N/A"
              }</td></tr>
              <tr><td><strong>Singh/Kaur</strong></td><td>${
                registration.backup_singh_kaur || "N/A"
              }</td></tr>
              <tr><td><strong>Phone</strong></td><td>${
                registration.backup_phone_number || "N/A"
              }</td></tr>
              <tr><td><strong>Email</strong></td><td>${
                registration.backup_email || "N/A"
              }</td></tr>
              <tr><td><strong>City</strong></td><td>${
                registration.backup_city || "N/A"
              }</td></tr>
              <tr><td><strong>Father's Name</strong></td><td>${
                registration.backup_father_name || "N/A"
              }</td></tr>
              <tr><td><strong>Mother's Name</strong></td><td>${
                registration.backup_mother_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Contact</strong></td><td>${
                registration.backup_emergency_contact_name || "N/A"
              }</td></tr>
              <tr><td><strong>Emergency Phone</strong></td><td>${
                registration.backup_emergency_contact_phone || "N/A"
              }</td></tr>
              <tr><td><strong>Gatka Experience</strong></td><td>${
                registration.backup_gatka_experience || "N/A"
              }</td></tr>
            </table>
          </div>
        </div>

        ${
          registration.admin_notes
            ? `
        <div class="section">
          <h3>Admin Notes</h3>
          <div class="field" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">${registration.admin_notes}</div>
        </div>
        `
            : ""
        }
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
