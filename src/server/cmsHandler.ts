import type { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";
import {
  authenticateDirector,
  validateSession,
  destroySession,
  changeDirectorPassword,
  getPublicContent,
  getCmsContent,
  saveDraftContent,
  publishDraftContent,
  discardDraftChanges,
  saveUploadedImage,
  getStore,
} from "./cmsStorage";

function sendJson(res: ServerResponse, statusCode: number, data: any): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // 15MB limit for JSON (handles base64 image uploads)
      if (body.length > 15 * 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        if (!body.trim()) {
          resolve({});
        } else {
          resolve(JSON.parse(body));
        }
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", (err) => reject(err));
  });
}

function extractToken(req: IncomingMessage): string {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  // Also check cookie if present
  const cookieHeader = req.headers["cookie"];
  if (cookieHeader) {
    const match = cookieHeader.match(/director_token=([^;]+)/);
    if (match) return match[1].trim();
  }
  return "";
}

export async function handleCmsRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const url = req.url || "";

  // 1. PUBLIC CONTENT
  if (url.startsWith("/api/public/content") && req.method === "GET") {
    try {
      const data = await getPublicContent();
      sendJson(res, 200, { success: true, data });
    } catch (err: any) {
      console.error("Error getting public content:", err);
      sendJson(res, 500, { success: false, error: "Failed to load content" });
    }
    return true;
  }

  // 2. AUTH: LOGIN
  if (url.startsWith("/api/auth/login") && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const { identifier, password } = body;

      if (!identifier || !password) {
        sendJson(res, 400, {
          success: false,
          error: "Please enter your email/username and password.",
        });
        return true;
      }

      const result = await authenticateDirector(identifier, password);
      if (!result) {
        sendJson(res, 401, {
          success: false,
          error: "Invalid login credentials. Please check and try again.",
        });
        return true;
      }

      // Set HTTP-only session cookie for defense-in-depth
      res.setHeader(
        "Set-Cookie",
        `director_token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
          7 * 24 * 60 * 60
        }`
      );

      sendJson(res, 200, {
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (err: any) {
      console.error("Login error:", err);
      sendJson(res, 500, { success: false, error: "Internal login error." });
    }
    return true;
  }

  // 3. AUTH: LOGOUT
  if (url.startsWith("/api/auth/logout") && req.method === "POST") {
    const token = extractToken(req);
    if (token) {
      await destroySession(token);
    }
    res.setHeader(
      "Set-Cookie",
      "director_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
    );
    sendJson(res, 200, { success: true, message: "Logged out successfully" });
    return true;
  }

  // 4. AUTH: ME / VALIDATE
  if (url.startsWith("/api/auth/me") && req.method === "GET") {
    const token = extractToken(req);
    const isValid = await validateSession(token);
    if (!isValid) {
      sendJson(res, 401, { success: false, authenticated: false });
      return true;
    }

    const store = await getStore();
    sendJson(res, 200, {
      success: true,
      authenticated: true,
      user: {
        name: store.auth.director.name,
        email: store.auth.director.email,
        username: store.auth.director.username,
        designation: store.auth.director.designation,
      },
    });
    return true;
  }

  // 5. AUTH: CHANGE PASSWORD
  if (url.startsWith("/api/auth/change-password") && req.method === "POST") {
    const token = extractToken(req);
    try {
      const body = await parseJsonBody(req);
      const { oldPassword, newPassword } = body;
      const result = await changeDirectorPassword(token, oldPassword, newPassword);
      if (!result.success) {
        sendJson(res, 400, result);
        return true;
      }
      sendJson(res, 200, { success: true, message: "Password updated successfully." });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message || "Failed to update password." });
    }
    return true;
  }

  // 6. CMS: GET CONTENT (Draft + Published)
  if (url.startsWith("/api/cms/content") && req.method === "GET") {
    const token = extractToken(req);
    const content = await getCmsContent(token);
    if (!content) {
      sendJson(res, 401, { success: false, error: "Unauthorized. Please log in." });
      return true;
    }
    sendJson(res, 200, { success: true, ...content });
    return true;
  }

  // 7. CMS: SAVE DRAFT
  if (url.startsWith("/api/cms/save-draft") && req.method === "POST") {
    const token = extractToken(req);
    try {
      const body = await parseJsonBody(req);
      const ok = await saveDraftContent(token, body);
      if (!ok) {
        sendJson(res, 401, { success: false, error: "Unauthorized session." });
        return true;
      }
      sendJson(res, 200, { success: true, message: "Draft changes saved to storage." });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message || "Failed to save draft." });
    }
    return true;
  }

  // 8. CMS: PUBLISH
  if (url.startsWith("/api/cms/publish") && req.method === "POST") {
    const token = extractToken(req);
    try {
      const ok = await publishDraftContent(token);
      if (!ok) {
        sendJson(res, 401, { success: false, error: "Unauthorized session." });
        return true;
      }
      sendJson(res, 200, {
        success: true,
        message: "Website content published live to public visitors!",
      });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: err.message || "Failed to publish." });
    }
    return true;
  }

  // 9. CMS: DISCARD DRAFT
  if (url.startsWith("/api/cms/discard-draft") && req.method === "POST") {
    const token = extractToken(req);
    try {
      const ok = await discardDraftChanges(token);
      if (!ok) {
        sendJson(res, 401, { success: false, error: "Unauthorized session." });
        return true;
      }
      sendJson(res, 200, { success: true, message: "Draft reverted to published state." });
    } catch (err: any) {
      sendJson(res, 500, { success: false, error: "Failed to discard draft." });
    }
    return true;
  }

  // 10. CMS: UPLOAD IMAGE
  if (url.startsWith("/api/cms/upload") && req.method === "POST") {
    const token = extractToken(req);
    try {
      const body = await parseJsonBody(req);
      const { filename, mimeType, base64Data } = body;

      if (!filename || !mimeType || !base64Data) {
        sendJson(res, 400, {
          success: false,
          error: "Missing image file payload (filename, mimeType, base64Data required).",
        });
        return true;
      }

      // Convert base64 to Buffer
      const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");

      const result = await saveUploadedImage(token, filename, mimeType, buffer);
      if (!result.success) {
        sendJson(res, 400, result);
        return true;
      }

      sendJson(res, 200, {
        success: true,
        url: result.url,
        message: "Image uploaded and stored successfully.",
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      sendJson(res, 500, { success: false, error: err.message || "Upload failed." });
    }
    return true;
  }

  // 11. CLOUDINARY UPLOAD SIGNATURE (Secure Signed Preset)
  if (url.startsWith("/api/cloudinary-signature")) {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.end();
      return true;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { success: false, error: "Method not allowed. Use POST." });
      return true;
    }

    // 1. Authorize Centre Director
    const token = extractToken(req);
    let isAuthorized = false;

    if (token) {
      // Check active CMS session
      if (validateSession(token)) {
        isAuthorized = true;
      } else if (
        process.env.DIRECTOR_AUTH_SECRET &&
        token === process.env.DIRECTOR_AUTH_SECRET
      ) {
        isAuthorized = true;
      } else if (process.env.FIREBASE_PROJECT_ID) {
        // Basic check for Firebase JWT format and expiration
        const parts = token.split(".");
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(
              Buffer.from(parts[1], "base64url").toString("utf-8")
            );
            const now = Math.floor(Date.now() / 1000);
            if (
              payload.iss === `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}` &&
              payload.aud === process.env.FIREBASE_PROJECT_ID &&
              payload.exp > now
            ) {
              isAuthorized = true;
            }
          } catch {
            isAuthorized = false;
          }
        }
      }
    }

    if (!isAuthorized) {
      sendJson(res, 401, {
        success: false,
        error: "Authentication required. You must be signed in as the Centre Director to request upload signatures.",
      });
      return true;
    }

    // 2. Validate Server Environment Variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      sendJson(res, 500, {
        success: false,
        error:
          "Cloudinary server configuration missing. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your server environment variables.",
      });
      return true;
    }

    // 3. Compute Official Cloudinary Signature
    try {
      const body = await parseJsonBody(req);
      const uploadPreset = body.uploadPreset || "amol-institute-photos";
      const folder = body.folder || "amol-institute";
      const timestamp = Math.floor(Date.now() / 1000);

      const paramsToSign: Record<string, string | number> = {
        folder,
        timestamp,
        upload_preset: uploadPreset,
      };

      const sortedKeys = Object.keys(paramsToSign).sort();
      const serializedParams = sortedKeys
        .map((k) => `${k}=${paramsToSign[k]}`)
        .join("&");

      const stringToSign = `${serializedParams}${apiSecret}`;
      const signature = crypto
        .createHash("sha1")
        .update(stringToSign)
        .digest("hex");

      sendJson(res, 200, {
        success: true,
        signature,
        timestamp,
        apiKey,
        cloudName,
        uploadPreset,
        folder,
      });
    } catch (err: any) {
      console.error("Cloudinary signature generation error:", err);
      sendJson(res, 500, {
        success: false,
        error: err.message || "Failed to generate Cloudinary signature.",
      });
    }
    return true;
  }

  return false;
}
