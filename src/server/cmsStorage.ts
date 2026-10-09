import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  CmsStoreData,
  DEFAULT_CATEGORIES,
  DEFAULT_PHOTOS,
  DEFAULT_COURSES,
  DEFAULT_FACILITIES,
  DEFAULT_CONTACT,
  DEFAULT_SETTINGS,
} from "./defaultData";

export interface DirectorAccount {
  email: string;
  username: string;
  passwordHash: string;
  salt: string;
  name: string;
  designation: string;
  lastLogin?: string;
}

export interface SessionInfo {
  token: string;
  username: string;
  createdAt: string;
  expiresAt: string;
}

export interface FullStoreSchema {
  auth: {
    director: DirectorAccount;
    sessions: Record<string, SessionInfo>;
  };
  published: CmsStoreData;
  draft: CmsStoreData;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "cms-store.json");
const UPLOADS_DIR = path.resolve(process.cwd(), "public", "uploads");

// Helper to hash passwords using scrypt
export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// In-memory cached store with write-through file persistence
let cachedStore: FullStoreSchema | null = null;

function getInitialStore(): FullStoreSchema {
  const salt = generateSalt();
  // Initial director password: Director@Risod2024
  const passwordHash = hashPassword("Director@Risod2024", salt);

  const initialContent: CmsStoreData = {
    photos: DEFAULT_PHOTOS,
    categories: DEFAULT_CATEGORIES,
    courses: DEFAULT_COURSES,
    facilities: DEFAULT_FACILITIES,
    contact: DEFAULT_CONTACT,
    settings: DEFAULT_SETTINGS,
    lastUpdated: new Date().toISOString(),
  };

  return {
    auth: {
      director: {
        email: "22210007@mkcl.org",
        username: "director",
        passwordHash,
        salt,
        name: "Mr. Ravindra Solanke",
        designation: "Director",
      },
      sessions: {},
    },
    published: JSON.parse(JSON.stringify(initialContent)),
    draft: JSON.parse(JSON.stringify(initialContent)),
  };
}

export async function ensureStorage(): Promise<void> {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  if (fs.existsSync(STORE_FILE)) {
    try {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      cachedStore = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to read cms-store.json, initializing default store:", err);
      cachedStore = getInitialStore();
      persistStore();
    }
  } else {
    cachedStore = getInitialStore();
    persistStore();
  }
}

function persistStore(): void {
  if (!cachedStore) return;
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(cachedStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write cms-store.json:", err);
  }
}

export async function getStore(): Promise<FullStoreSchema> {
  if (!cachedStore) {
    await ensureStorage();
  }
  return cachedStore!;
}

// Authentication Helpers
export async function authenticateDirector(
  identifier: string,
  plainPassword: string
): Promise<{ token: string; user: { name: string; email: string; username: string } } | null> {
  const store = await getStore();
  const dir = store.auth.director;

  const matchesIdentifier =
    identifier.trim().toLowerCase() === dir.email.toLowerCase() ||
    identifier.trim().toLowerCase() === dir.username.toLowerCase();

  if (!matchesIdentifier) {
    return null;
  }

  const computedHash = hashPassword(plainPassword, dir.salt);
  if (computedHash !== dir.passwordHash) {
    return null;
  }

  // Create session
  const token = generateToken();
  const now = new Date();
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  store.auth.sessions[token] = {
    token,
    username: dir.username,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };

  dir.lastLogin = now.toISOString();
  persistStore();

  return {
    token,
    user: {
      name: dir.name,
      email: dir.email,
      username: dir.username,
    },
  };
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false;
  const store = await getStore();
  const session = store.auth.sessions[token];
  if (!session) return false;

  const expires = new Date(session.expiresAt).getTime();
  if (Date.now() > expires) {
    delete store.auth.sessions[token];
    persistStore();
    return false;
  }

  return true;
}

export async function destroySession(token: string): Promise<void> {
  const store = await getStore();
  if (store.auth.sessions[token]) {
    delete store.auth.sessions[token];
    persistStore();
  }
}

export async function changeDirectorPassword(
  token: string,
  oldPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  const isValid = await validateSession(token);
  if (!isValid) {
    return { success: false, error: "Unauthorized session." };
  }

  const store = await getStore();
  const dir = store.auth.director;
  const oldHash = hashPassword(oldPass, dir.salt);
  if (oldHash !== dir.passwordHash) {
    return { success: false, error: "Incorrect current password." };
  }

  if (newPass.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }

  const newSalt = generateSalt();
  dir.salt = newSalt;
  dir.passwordHash = hashPassword(newPass, newSalt);
  persistStore();

  return { success: true };
}

// Public Data (only published content)
export async function getPublicContent(): Promise<CmsStoreData> {
  const store = await getStore();
  // Filter only visible items for visitors
  const published = store.published;
  return {
    photos: published.photos.filter((p) => p.visible !== false),
    categories: published.categories,
    courses: published.courses.filter((c) => c.visible !== false),
    facilities: published.facilities.filter((f) => f.visible !== false),
    contact: published.contact,
    settings: published.settings,
    lastUpdated: published.lastUpdated,
  };
}

// CMS Data (draft + published comparison for admin)
export async function getCmsContent(token: string): Promise<{
  draft: CmsStoreData;
  published: CmsStoreData;
  hasUnpublishedChanges: boolean;
  director: { name: string; email: string; username: string };
} | null> {
  const isValid = await validateSession(token);
  if (!isValid) return null;

  const store = await getStore();
  const draftStr = JSON.stringify(store.draft);
  const pubStr = JSON.stringify(store.published);
  const hasUnpublishedChanges = draftStr !== pubStr;

  return {
    draft: store.draft,
    published: store.published,
    hasUnpublishedChanges,
    director: {
      name: store.auth.director.name,
      email: store.auth.director.email,
      username: store.auth.director.username,
    },
  };
}

export async function saveDraftContent(
  token: string,
  updates: Partial<CmsStoreData>
): Promise<boolean> {
  const isValid = await validateSession(token);
  if (!isValid) return false;

  const store = await getStore();

  if (updates.photos) store.draft.photos = updates.photos;
  if (updates.categories) store.draft.categories = updates.categories;
  if (updates.courses) store.draft.courses = updates.courses;
  if (updates.facilities) store.draft.facilities = updates.facilities;
  if (updates.contact) store.draft.contact = updates.contact;
  if (updates.settings) store.draft.settings = updates.settings;

  store.draft.lastUpdated = new Date().toISOString();
  persistStore();
  return true;
}

export async function publishDraftContent(token: string): Promise<boolean> {
  const isValid = await validateSession(token);
  if (!isValid) return false;

  const store = await getStore();
  // Deep clone draft to published
  store.published = JSON.parse(JSON.stringify(store.draft));
  store.published.lastUpdated = new Date().toISOString();
  persistStore();
  return true;
}

export async function discardDraftChanges(token: string): Promise<boolean> {
  const isValid = await validateSession(token);
  if (!isValid) return false;

  const store = await getStore();
  // Deep clone published back to draft
  store.draft = JSON.parse(JSON.stringify(store.published));
  persistStore();
  return true;
}

// File Upload
export async function saveUploadedImage(
  token: string,
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<{ success: boolean; url?: string; error?: string }> {
  const isValid = await validateSession(token);
  if (!isValid) {
    return { success: false, error: "Unauthorized session." };
  }

  const allowedMime = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedMime.includes(mimeType.toLowerCase())) {
    return { success: false, error: "Only JPG, PNG, WEBP, and GIF images are allowed." };
  }

  // Max 8MB
  if (buffer.length > 8 * 1024 * 1024) {
    return { success: false, error: "Image file exceeds maximum 8MB size limit." };
  }

  await ensureStorage();

  const ext = path.extname(filename) || (mimeType.includes("png") ? ".png" : ".jpg");
  const cleanBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${Date.now()}-${cleanBase}${ext}`;
  const targetPath = path.join(UPLOADS_DIR, uniqueName);

  fs.writeFileSync(targetPath, buffer);

  const publicUrl = `/uploads/${uniqueName}`;
  return { success: true, url: publicUrl };
}
