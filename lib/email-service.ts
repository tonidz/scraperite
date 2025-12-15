import nodemailer from "nodemailer";
import { EmailData } from "@/types/email";

/**
 * Email service that provides multiple methods for sending emails
 * with fallback options if the primary method fails
 */
export class EmailService {
  /**
   * Send an email using multiple methods with fallbacks
   * @param emailData The email data to send
   * @returns A promise that resolves to a boolean indicating success or failure
   */
  static async sendEmail(emailData: EmailData): Promise<{
    success: boolean;
    method?: string;
    error?: string;
  }> {
    // Try EmailIT API first
    if (process.env.EMAILIT_API_KEY) {
      try {
        console.log("Attempting to send email via EmailIT API");

        // Always use the configured sender email, not the user's email
        const fromName =
          emailData.fromName ||
          process.env.EMAILIT_FROM_NAME ||
          "Scraperite";
        const fromEmail =
          process.env.EMAILIT_FROM_EMAIL || "noreply@scraperite.com";
        const fromField = `${fromName} <${fromEmail}>`;

        // Use the user's email as reply-to if provided
        const replyToEmail = emailData.fromEmail || null;

        // Ensure we have a text version of the email
        const textContent =
          emailData.text ||
          "Please view this email in an HTML-compatible email client.";

        // Prepare email data for EmailIT API
        const apiEmailData: any = {
          from: fromField,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: textContent,
        };

        // Only add reply_to if we have a user email
        if (replyToEmail) {
          apiEmailData.reply_to = replyToEmail;
        }

        console.log("Sending email via EmailIT API to:", emailData.to);

        // Log API details (with partial masking for security)
        const apiKey = process.env.EMAILIT_API_KEY || "";
        const maskedApiKey =
          apiKey.length > 8
            ? `${apiKey.substring(0, 4)}...${apiKey.substring(
                apiKey.length - 4
              )}`
            : "not set";

        console.log("EmailIT API Key (masked):", maskedApiKey);

        // Make the API request
        const response = await fetch("https://api.emailit.com/v1/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EMAILIT_API_KEY}`,
          },
          body: JSON.stringify(apiEmailData),
        });

        // Check response
        if (response.ok) {
          const data = await response.json();
          console.log("Email sent successfully via EmailIT API:", data);
          return { success: true, method: "emailit_api" };
        } else {
          const errorText = await response.text();
          console.error("EmailIT API error:", response.status, errorText);

          // Try to parse the error response if it's JSON
          try {
            if (errorText.trim().startsWith("{")) {
              const errorJson = JSON.parse(errorText);
              console.error("EmailIT API error details:", errorJson);
            } else {
              console.error(
                "EmailIT API error text (truncated):",
                errorText.substring(0, 200) +
                  (errorText.length > 200 ? "..." : "")
              );
            }
          } catch (parseError) {
            console.error("Error parsing API error response:", parseError);
          }

          // Try an alternative format if we get a 422 error
          if (response.status === 422) {
            console.log("Trying alternative API format...");

            // Try with content array format instead
            const alternativeApiData: any = {
              from: fromField,
              to: emailData.to,
              subject: emailData.subject,
              content: [
                {
                  type: "text/plain",
                  value: textContent,
                },
                {
                  type: "text/html",
                  value: emailData.html,
                },
              ],
            };

            if (replyToEmail) {
              alternativeApiData.reply_to = replyToEmail;
            }

            const alternativeResponse = await fetch(
              "https://api.emailit.com/v1/emails",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.EMAILIT_API_KEY}`,
                },
                body: JSON.stringify(alternativeApiData),
              }
            );

            if (alternativeResponse.ok) {
              const data = await alternativeResponse.json();
              console.log(
                "Email sent successfully via alternative EmailIT API format:",
                data
              );
              return { success: true, method: "emailit_api_alternative" };
            } else {
              const altErrorText = await alternativeResponse.text();
              console.error(
                "Alternative EmailIT API error:",
                alternativeResponse.status,
                altErrorText
              );
            }
          }

          throw new Error(
            `EmailIT API error: ${response.status} ${response.statusText}`
          );
        }
      } catch (apiError) {
        console.error("Error using EmailIT API:", apiError);
        // Continue to next method if this fails
      }
    }

    // Try EmailIT SMTP as second option
    if (process.env.EMAILIT_SMTP_KEY) {
      try {
        console.log("Attempting to send email via EmailIT SMTP");

        // Create a transporter using EmailIT SMTP
        const transporter = nodemailer.createTransport({
          host: "smtp.emailit.co",
          port: 587,
          secure: false, // Use TLS
          auth: {
            user: process.env.EMAILIT_SMTP_KEY,
            pass: process.env.EMAILIT_SMTP_KEY,
          },
          connectionTimeout: 10000, // 10 seconds
          greetingTimeout: 5000, // 5 seconds
          socketTimeout: 10000, // 10 seconds
        });

        console.log("SMTP transporter created, verifying connection...");

        // Verify SMTP connection before sending
        try {
          await transporter.verify();
          console.log("SMTP connection verified successfully");
        } catch (verifyError: any) {
          console.error("SMTP connection verification failed:", verifyError);
          throw new Error(
            `SMTP connection failed: ${verifyError.message || "Unknown error"}`
          );
        }

        // Always use the configured sender email for SMTP as well
        const fromName =
          emailData.fromName ||
          process.env.EMAILIT_FROM_NAME ||
          "Scraperite";
        const fromEmail =
          process.env.EMAILIT_FROM_EMAIL || "noreply@scraperite.com";

        // Send the email
        const info = await transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: emailData.to,
          subject: emailData.subject,
          text:
            emailData.text ||
            "Please view this email in an HTML-compatible email client.",
          html: emailData.html,
          ...(emailData.fromEmail && { replyTo: emailData.fromEmail }),
        });

        console.log(
          `Email sent successfully via EmailIT SMTP: ${info.messageId}`
        );
        return { success: true, method: "emailit_smtp" };
      } catch (smtpError) {
        console.error("Error using EmailIT SMTP:", smtpError);
        // Log more detailed error information
        if (smtpError instanceof Error) {
          console.error("SMTP Error name:", smtpError.name);
          console.error("SMTP Error message:", smtpError.message);
          console.error("SMTP Error stack:", smtpError.stack);
        }
        // Continue to next method if this fails
      }
    }

    // Try direct SMTP as a third option
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      try {
        console.log("Attempting to send email via direct SMTP");

        // Create a transporter using direct SMTP
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          connectionTimeout: 15000, // 15 seconds
          greetingTimeout: 10000, // 10 seconds
          socketTimeout: 15000, // 15 seconds
          debug: true, // Enable debug output
          logger: true, // Log information to the console
        });

        console.log("Direct SMTP transporter created with settings:", {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || "587",
          secure: process.env.SMTP_SECURE === "true",
          user: process.env.SMTP_USER ? "Set" : "Not set",
          pass: process.env.SMTP_PASS ? "Set" : "Not set",
        });

        // Always use the configured sender email for direct SMTP as well
        const fromName =
          emailData.fromName ||
          process.env.EMAILIT_FROM_NAME ||
          "Scraperite";

        // Send the email (direct SMTP)
        const info = await transporter.sendMail({
          from: `"${fromName}" <${process.env.SMTP_USER}>`,
          to: emailData.to,
          subject: emailData.subject,
          text:
            emailData.text ||
            "Please view this email in an HTML-compatible email client.",
          html: emailData.html,
          ...(emailData.fromEmail && { replyTo: emailData.fromEmail }),
        });

        console.log(
          `Email sent successfully via direct SMTP: ${info.messageId}`
        );
        return { success: true, method: "direct_smtp" };
      } catch (smtpError) {
        console.error("Error using direct SMTP:", smtpError);
        // Log more detailed error information
        if (smtpError instanceof Error) {
          console.error("Direct SMTP Error name:", smtpError.name);
          console.error("Direct SMTP Error message:", smtpError.message);
          console.error("Direct SMTP Error stack:", smtpError.stack);
        }
        // Continue to next method if this fails
      }
    }

    // Try Gmail as final fallback
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        console.log("Attempting to send email via Gmail");
        console.log("Gmail settings:", {
          user: process.env.GMAIL_USER ? "Set" : "Not set",
          appPassword: process.env.GMAIL_APP_PASSWORD ? "Set" : "Not set",
        });

        // Create a transporter using Gmail
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
          debug: true, // Enable debug output
          logger: true, // Log information to the console
        });

        // Verify connection
        try {
          await transporter.verify();
          console.log("Gmail SMTP connection verified successfully");
        } catch (verifyError: any) {
          console.error(
            "Gmail SMTP connection verification failed:",
            verifyError
          );
          throw new Error(
            `Gmail SMTP connection failed: ${
              verifyError.message || "Unknown error"
            }`
          );
        }

        // Always use the configured sender email for Gmail as well
        const fromName =
          emailData.fromName ||
          process.env.EMAILIT_FROM_NAME ||
          "Scraperite";

        // Send the email (Gmail)
        const info = await transporter.sendMail({
          from: `"${fromName}" <${process.env.GMAIL_USER}>`,
          to: emailData.to,
          subject: emailData.subject,
          text:
            emailData.text ||
            "Please view this email in an HTML-compatible email client.",
          html: emailData.html,
          ...(emailData.fromEmail && { replyTo: emailData.fromEmail }),
        });

        console.log(`Email sent successfully via Gmail: ${info.messageId}`);
        return { success: true, method: "gmail" };
      } catch (gmailError) {
        console.error("Error using Gmail:", gmailError);
        // Log more detailed error information
        if (gmailError instanceof Error) {
          console.error("Gmail Error name:", gmailError.name);
          console.error("Gmail Error message:", gmailError.message);
          console.error("Gmail Error stack:", gmailError.stack);
        }
        return {
          success: false,
          method: "all_failed",
          error:
            gmailError instanceof Error
              ? gmailError.message
              : "Unknown error with Gmail",
        };
      }
    }

    // If we get here, all methods failed
    console.error("All email sending methods failed");
    return {
      success: false,
      method: "all_failed",
      error: "All email sending methods failed or no methods configured",
    };
  }
} 