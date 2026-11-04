import { auth } from "@/lib/firebase/client";

/** Returns the current user's ID token for Authorization: Bearer … */
export async function getIdToken(): Promise<string | null> {
  const user = auth?.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
