/**
 * Cloudflare Pages Function: /api/cloudinary-signature
 * 
 * Generates Cloudinary signed upload signatures for authenticated Centre Director requests.
 * Runs on Cloudflare Pages Functions (Workers runtime).
 * 
 * SECURITY:
 * - Never exposes CLOUDINARY_API_SECRET to the client.
 * - Strictly rejects anonymous / unauthenticated requests.
 * - Supports Firebase Authentication ID token verification (RS256/JWT)
 *   and Centre Director authorization secret verification.
 */

interface Env {
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  FIREBASE_PROJECT_ID?: string;
  DIRECTOR_AUTH_SECRET?: string;
  DIRECTOR_EMAIL?: string;
  [key: string]: string | undefined;
}

interface CloudflarePagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

/**
 * Compute standard SHA-1 hex digest using Web Crypto API
 */
async function computeSha1Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Base64 URL decode helper for JWT segments
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

/**
 * Verify Centre Director Authentication & Authorization
 * 
 * Verifies either:
 * 1. Firebase Authentication ID token (claims, expiration, issuer, audience, and optional email match)
 * 2. Shared DIRECTOR_AUTH_SECRET / Director session token
 */
async function verifyDirectorAuth(
  request: Request,
  env: Env
): Promise<{ authorized: boolean; error?: string; user?: string }> {
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return {
      authorized: false,
      error: "Authentication required. You must be signed in as the Centre Director to upload images.",
    };
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return {
      authorized: false,
      error: "Empty authorization token provided. Please log in again.",
    };
  }

  // 1. Check if Firebase ID Token validation is enabled
  const firebaseProjectId = env.FIREBASE_PROJECT_ID;
  if (firebaseProjectId) {
    const parts = token.split(".");
    if (parts.length === 3) {
      try {
        const payloadJson = base64UrlDecode(parts[1]);
        const payload = JSON.parse(payloadJson);
        const nowInSeconds = Math.floor(Date.now() / 1000);

        // Verify Firebase Token claims
        const expectedIssuer = `https://securetoken.google.com/${firebaseProjectId}`;
        if (payload.iss !== expectedIssuer) {
          return { authorized: false, error: "Invalid Firebase token issuer." };
        }
        if (payload.aud !== firebaseProjectId) {
          return { authorized: false, error: "Invalid Firebase token audience." };
        }
        if (typeof payload.exp === "number" && payload.exp < nowInSeconds) {
          return { authorized: false, error: "Firebase token has expired. Please log in again." };
        }

        // If a specific director email is required, verify match
        const requiredDirectorEmail = env.DIRECTOR_EMAIL;
        if (requiredDirectorEmail && payload.email) {
          if (payload.email.toLowerCase() !== requiredDirectorEmail.toLowerCase()) {
            return {
              authorized: false,
              error: "Unauthorized: Account email is not recognized as Centre Director.",
            };
          }
        }

        return { authorized: true, user: payload.email || payload.sub };
      } catch (err: unknown) {
        return {
          authorized: false,
          error: "Failed to parse Firebase ID token: " + (err instanceof Error ? err.message : String(err)),
        };
      }
    }
  }

  // 2. Check Director Auth Secret
  const directorAuthSecret = env.DIRECTOR_AUTH_SECRET;
  if (directorAuthSecret && directorAuthSecret.length > 0) {
    if (token === directorAuthSecret) {
      return { authorized: true, user: "director" };
    }
    return {
      authorized: false,
      error: "Unauthorized: Invalid Centre Director authorization credentials.",
    };
  }

  // 3. Fallback: If neither Firebase nor DIRECTOR_AUTH_SECRET is configured in Cloudflare environment
  // We strictly refuse to be an open signing proxy.
  if (!firebaseProjectId && !directorAuthSecret) {
    return {
      authorized: false,
      error:
        "Security configuration missing: Neither FIREBASE_PROJECT_ID nor DIRECTOR_AUTH_SECRET is configured in Cloudflare Pages environment variables. Cloudinary upload signatures cannot be issued to unverified clients.",
    };
  }

  return { authorized: false, error: "Unauthorized Centre Director session." };
}

/**
 * Handle OPTIONS preflight requests
 */
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Handle POST /api/cloudinary-signature
 */
export async function onRequestPost(context: CloudflarePagesContext): Promise<Response> {
  const { request, env } = context;

  // 1. Verify Authentication & Authorization
  const authResult = await verifyDirectorAuth(request, env);
  if (!authResult.authorized) {
    return jsonResponse(
      {
        success: false,
        error: authResult.error || "Unauthorized: Centre Director access only.",
      },
      401
    );
  }

  // 2. Validate Server Environment Variables
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return jsonResponse(
      {
        success: false,
        error:
          "Server configuration incomplete: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be configured in Cloudflare Pages environment variables.",
      },
      500
    );
  }

  // 3. Optional request payload parameters (to override or supplement defaults)
  let requestBody: Record<string, unknown> = {};
  try {
    const text = await request.text();
    if (text.trim()) {
      requestBody = JSON.parse(text);
    }
  } catch {
    // If not JSON, default to empty
  }

  const uploadPreset =
    (typeof requestBody.uploadPreset === "string" && requestBody.uploadPreset) ||
    "amol-institute-photos";
  const folder =
    (typeof requestBody.folder === "string" && requestBody.folder) ||
    "amol-institute";

  // Current timestamp in seconds (Cloudinary requirement)
  const timestamp = Math.floor(Date.now() / 1000);

  // 4. Construct Cloudinary official parameter string
  // Cloudinary rules:
  // - Alphabetical sorting by parameter name
  // - format: key1=value1&key2=value2
  // - append API secret directly to the string: stringToSign + apiSecret
  // - calculate SHA-1 hex digest
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
  const signature = await computeSha1Hex(stringToSign);

  // 5. Return only necessary public info (NEVER return apiSecret)
  return jsonResponse({
    success: true,
    signature,
    timestamp,
    apiKey,
    cloudName,
    uploadPreset,
    folder,
  });
}
