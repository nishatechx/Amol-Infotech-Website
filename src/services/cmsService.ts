import {
  CmsStoreData,
  DEFAULT_CATEGORIES,
  DEFAULT_PHOTOS,
  DEFAULT_COURSES,
  DEFAULT_FACILITIES,
  DEFAULT_CONTACT,
  DEFAULT_SETTINGS,
  PhotoItem,
  CourseItem,
  FacilityItem,
  ContactInfo,
  WebsiteSettings,
} from "../server/defaultData";

export type {
  CmsStoreData,
  PhotoItem,
  CourseItem,
  FacilityItem,
  ContactInfo,
  WebsiteSettings,
};

const TOKEN_KEY = "director_token";

export interface DirectorUser {
  name: string;
  email: string;
  username: string;
  designation?: string;
}

export function getSessionToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

export function setSessionToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearSessionToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Fetch published content for public website visitors.
 * Always resolves gracefully (falling back to built-in data if needed).
 */
export async function fetchPublicContent(): Promise<CmsStoreData> {
  try {
    const res = await fetch("/api/public/content");
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Public content API offline, using built-in defaults:", err);
  }

  // Graceful fallback
  return {
    photos: DEFAULT_PHOTOS,
    categories: DEFAULT_CATEGORIES,
    courses: DEFAULT_COURSES,
    facilities: DEFAULT_FACILITIES,
    contact: DEFAULT_CONTACT,
    settings: DEFAULT_SETTINGS,
  };
}

/**
 * Director Authentication
 */
export async function directorLogin(
  identifier: string,
  password: string
): Promise<{ success: boolean; user?: DirectorUser; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const json = await res.json();
    if (res.ok && json.success && json.token) {
      setSessionToken(json.token);
      return { success: true, user: json.user };
    }
    return { success: false, error: json.error || "Login failed" };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error. Please try again." };
  }
}

export async function directorLogout(): Promise<void> {
  const token = getSessionToken();
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Logout request error:", err);
  } finally {
    clearSessionToken();
  }
}

export async function checkDirectorAuth(): Promise<{
  authenticated: boolean;
  user?: DirectorUser;
}> {
  const token = getSessionToken();
  if (!token) return { authenticated: false };

  try {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.authenticated) {
        return { authenticated: true, user: json.user };
      }
    }
  } catch (err) {
    console.warn("Check auth error:", err);
  }

  clearSessionToken();
  return { authenticated: false };
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const token = getSessionToken();
  try {
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || "Password update failed." };
  }
}

/**
 * CMS Content Management (Protected)
 */
export async function fetchCmsContent(): Promise<{
  success: boolean;
  draft?: CmsStoreData;
  published?: CmsStoreData;
  hasUnpublishedChanges?: boolean;
  director?: DirectorUser;
  error?: string;
}> {
  const token = getSessionToken();
  try {
    const res = await fetch("/api/cms/content", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load CMS content" };
  }
}

export async function saveDraftChanges(
  updates: Partial<CmsStoreData>
): Promise<{ success: boolean; message?: string; error?: string }> {
  const token = getSessionToken();
  try {
    const res = await fetch("/api/cms/save-draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save draft." };
  }
}

export async function publishAllChanges(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const token = getSessionToken();
  try {
    const res = await fetch("/api/cms/publish", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || "Publish operation failed." };
  }
}

export async function discardDraft(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const token = getSessionToken();
  try {
    const res = await fetch("/api/cms/discard-draft", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || "Discard draft failed." };
  }
}

/**
 * Upload Image Helper (File -> Base64 -> Persistent Server Storage)
 */
export async function uploadImageFile(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = getSessionToken();

  // Validate size client-side (max 8MB)
  if (file.size > 8 * 1024 * 1024) {
    return { success: false, error: "Image file is too large. Maximum size is 8MB." };
  }

  // Convert to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  try {
    const res = await fetch("/api/cms/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: file.name,
        mimeType: file.type || "image/jpeg",
        base64Data,
      }),
    });

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err.message || "Upload request failed." };
  }
}

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  bytes?: number;
  format?: string;
  error?: string;
}

/**
 * Upload Image to Cloudinary with Secure Server-Generated Signature
 * 
 * 1. Obtains signed upload credentials from /api/cloudinary-signature
 * 2. Uploads binary file directly to Cloudinary using Signed Preset amol-institute-photos
 * 3. Tracks real-time upload progress via XMLHttpRequest
 */
export async function uploadToCloudinarySigned(
  file: File,
  options?: {
    uploadPreset?: string;
    folder?: string;
    onProgress?: (percent: number) => void;
  }
): Promise<CloudinaryUploadResult> {
  const token = getSessionToken();
  if (!token) {
    return {
      success: false,
      error: "Authentication required. Please sign in as Centre Director to upload images.",
    };
  }

  // 1. Client-side file validation (Max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      error: `File ${file.name} is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 10MB.`,
    };
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (file.type && !validTypes.includes(file.type)) {
    return {
      success: false,
      error: `Unsupported file format (${file.type}). Please upload JPG, PNG, WEBP, or SVG images.`,
    };
  }

  try {
    // 2. Request signature from backend (/api/cloudinary-signature)
    const sigResponse = await fetch("/api/cloudinary-signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uploadPreset: options?.uploadPreset || "amol-institute-photos",
        folder: options?.folder || "amol-institute",
      }),
    });

    const sigData = await sigResponse.json();

    if (!sigResponse.ok || !sigData.success) {
      return {
        success: false,
        error:
          sigData.error ||
          `Failed to obtain Cloudinary signature (${sigResponse.status}). Ensure server environment variables are configured.`,
      };
    }

    const { signature, timestamp, apiKey, cloudName, uploadPreset, folder } = sigData;

    // 3. Prepare FormData for direct Cloudinary upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("upload_preset", uploadPreset);
    if (folder) {
      formData.append("folder", folder);
    }

    // 4. Perform direct upload with progress tracking
    return new Promise<CloudinaryUploadResult>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

      if (options?.onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            options.onProgress?.(percent);
          }
        };
      }

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && response.secure_url) {
            resolve({
              success: true,
              url: response.secure_url,
              publicId: response.public_id,
              bytes: response.bytes,
              format: response.format,
            });
          } else {
            resolve({
              success: false,
              error:
                response.error?.message ||
                `Cloudinary upload failed with status ${xhr.status}`,
            });
          }
        } catch (e: any) {
          resolve({
            success: false,
            error: "Failed to parse Cloudinary response: " + e.message,
          });
        }
      };

      xhr.onerror = () => {
        resolve({
          success: false,
          error: "Network error while uploading directly to Cloudinary.",
        });
      };

      xhr.send(formData);
    });
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred during Cloudinary upload.",
    };
  }
}

