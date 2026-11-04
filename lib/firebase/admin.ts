import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null | undefined;
let initError: string | null = null;

function readPrivateKey() {
  return process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function hasServiceAccountEnv() {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      readPrivateKey(),
  );
}

/**
 * Initializes Firebase Admin once per process.
 * Requires FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,
 * FIREBASE_ADMIN_PRIVATE_KEY in .env.local (from a service account JSON).
 */
export function getAdminApp(): App | null {
  if (app !== undefined) return app;

  if (getApps().length) {
    app = getApps()[0]!;
    return app;
  }

  if (!hasServiceAccountEnv()) {
    initError =
      "Missing FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY";
    app = null;
    return app;
  }

  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: readPrivateKey()!,
      }),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    initError = null;
    return app;
  } catch (err) {
    initError = err instanceof Error ? err.message : "Admin init failed";
    app = null;
    return app;
  }
}

export function getAdminAuth(): Auth | null {
  const adminApp = getAdminApp();
  return adminApp ? getAuth(adminApp) : null;
}

export function getAdminDb(): Firestore | null {
  const adminApp = getAdminApp();
  return adminApp ? getFirestore(adminApp) : null;
}

export function getAdminInitError() {
  getAdminApp();
  return initError;
}

export async function verifyBearerToken(authHeader: string | null) {
  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    throw new Error(getAdminInitError() ?? "Firebase Admin is not configured");
  }
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing Bearer token");
  }
  return adminAuth.verifyIdToken(authHeader.slice(7));
}
