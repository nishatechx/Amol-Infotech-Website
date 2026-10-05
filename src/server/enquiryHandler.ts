import type { IncomingMessage, ServerResponse } from "http";
import nodemailer from "nodemailer";

// In-memory rate limiting map: IP -> { count, firstSeen }
const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 8; // Max 8 enquiries per 10 mins per IP

export interface EnquiryPayload {
  name: string;
  mobile: string;
  email: string;
  course?: string;
  message?: string;
  honeypot?: string;
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "127.0.0.1";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
    return false;
  }

  if (now - record.firstSeen > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile: string): boolean {
  // Accepts 10 to 15 digits with optional +, spaces, dashes, or parentheses
  const digitsOnly = mobile.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

export async function handleEnquiryRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method Not Allowed" }));
    return;
  }

  // 1. Rate Limiting Check
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    res.statusCode = 429;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: "Too many enquiries submitted. Please wait a few minutes before trying again.",
      })
    );
    return;
  }

  // 2. Read request body
  let bodyStr = "";
  try {
    for await (const chunk of req) {
      bodyStr += chunk;
      // Protect against large payload flood attacks (max 50KB)
      if (bodyStr.length > 50 * 1024) {
        res.statusCode = 413;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: false, error: "Payload too large" }));
        return;
      }
    }
  } catch (err) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Failed to read request body" }));
    return;
  }

  let data: EnquiryPayload;
  try {
    data = JSON.parse(bodyStr);
  } catch {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Invalid JSON format" }));
    return;
  }

  // 3. Spam Honeypot Check
  // If the hidden bot honeypot field is filled, silently succeed without sending spam
  if (data.honeypot && data.honeypot.trim().length > 0) {
    console.warn(`[SPAM BLOCKED] Honeypot triggered from IP: ${clientIp}`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: true,
        message: "Your enquiry has been submitted successfully.",
      })
    );
    return;
  }

  // 4. Server-Side Fields Validation
  const name = (data.name || "").trim();
  const mobile = (data.mobile || "").trim();
  const email = (data.email || "").trim();
  const course = (data.course || "").trim() || "General Inquiry";
  const message = (data.message || "").trim();

  if (!name || name.length < 2) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Please enter your full name (minimum 2 characters)." }));
    return;
  }

  if (name.length > 100) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Name is too long." }));
    return;
  }

  if (!mobile || !validateMobile(mobile)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Please enter a valid 10-digit mobile number." }));
    return;
  }

  if (!email || !validateEmail(email)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Please enter a valid email address." }));
    return;
  }

  if (message.length > 2000) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Message must be under 2000 characters." }));
    return;
  }

  // 5. Prepare Email Details
  const recipientEmail = process.env.EMAIL_TO || "22210007@mkcl.org";
  const senderEmail = process.env.EMAIL_FROM || "noreply@amolinfotech.in";
  const now = new Date();
  const formattedDate = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subject = "New Website Enquiry - Amol Infotech & Maharana Typing Institute";

  const plainTextBody = `New Enquiry Received

Student Name:
${name}

Mobile Number:
${mobile}

Email:
${email}

Course Interested In:
${course}

Message:
${message || "No additional message provided."}

Submitted From:
Website

Submission Date:
${formattedDate}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0b4388; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold;">New Website Enquiry Received</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.85;">Amol Infotech & Maharana Typing Institute Risod</p>
      </div>
      <div style="padding: 24px; color: #1e293b; font-size: 14px; line-height: 1.6;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; width: 35%; color: #475569;">Student Name:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Mobile Number:</td>
            <td style="padding: 10px 0; color: #0284c7; font-weight: bold;"><a href="tel:${mobile}" style="color: #0284c7; text-decoration: none;">${mobile}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email Address:</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Course Interested In:</td>
            <td style="padding: 10px 0; color: #d92525; font-weight: bold;">${course}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569; vertical-align: top;">Message:</td>
            <td style="padding: 10px 0; white-space: pre-wrap;">${message || "No additional message provided."}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Submitted From:</td>
            <td style="padding: 10px 0;">Website (Amol Infotech Risod Portal)</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #475569;">Submission Date:</td>
            <td style="padding: 10px 0; color: #64748b;">${formattedDate}</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f8fafc; padding: 14px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
        Direct reply to this email will respond to the student at <strong>${email}</strong>.
      </div>
    </div>
  `;

  // 6. Send Email using configured transporter or log securely
  try {
    let emailSent = false;

    // Check 1: SMTP settings in environment
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${name} via Amol Infotech" <${senderEmail}>`,
        to: recipientEmail,
        replyTo: email,
        subject: subject,
        text: plainTextBody,
        html: htmlBody,
      });

      emailSent = true;
      console.log(`[ENQUIRY SENT VIA SMTP] To: ${recipientEmail}, Reply-To: ${email}`);
    }

    // Check 2: Resend API Key if present
    else if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [recipientEmail],
          reply_to: email,
          subject: subject,
          text: plainTextBody,
          html: htmlBody,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        throw new Error(`Resend API failed: ${errorText}`);
      }

      emailSent = true;
      console.log(`[ENQUIRY SENT VIA RESEND] To: ${recipientEmail}, Reply-To: ${email}`);
    }

    // Fallback: If SMTP credentials are not yet set in environment,
    // log the structured enquiry to the server console and internal queue
    if (!emailSent) {
      console.log("==================================================");
      console.log("[NEW ENQUIRY RECEIVED]");
      console.log(`To: ${recipientEmail}`);
      console.log(`Reply-To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log("--------------------------------------------------");
      console.log(plainTextBody);
      console.log("==================================================");
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: true,
        message: "Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.",
      })
    );
  } catch (err: any) {
    console.error("[ENQUIRY SUBMISSION ERROR]:", err.message || err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: "Sorry, we couldn't submit your enquiry right now. Please try again.",
      })
    );
  }
}
