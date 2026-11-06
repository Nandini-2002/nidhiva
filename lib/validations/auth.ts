export interface AuthValidation {
  ok: boolean;
  errors: Record<string, string>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return "Email is required";
  if (!EMAIL.test(value)) return "Enter a valid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password needs at least one letter and one number";
  }
  if (/\s/.test(password)) return "Password cannot contain spaces";
  return null;
}

export function validateRegister(input: {
  name: string;
  email: string;
  password: string;
  confirm: string;
}): AuthValidation {
  const errors: Record<string, string> = {};
  const name = input.name.trim();
  if (name.length < 2) errors.name = "Name must be at least 2 characters";
  if (name.length > 60) errors.name = "Name is too long";

  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(input.password);
  if (passwordError) errors.password = passwordError;
  else if (input.password !== input.confirm) {
    errors.confirm = "Passwords do not match";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function validateLogin(input: {
  email: string;
  password: string;
}): AuthValidation {
  const errors: Record<string, string> = {};
  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;
  if (!input.password) errors.password = "Password is required";
  else if (input.password.length < 6) {
    errors.password = "Password is too short";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export function firebaseAuthMessage(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: string }).code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Log in instead.";
    case "auth/invalid-email":
      return "That email address is not valid.";
    case "auth/weak-password":
      return "Password is too weak. Use 8+ characters with a letter and a number.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before it finished.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google popup. Allow popups and try again.";
    case "auth/unauthorized-domain":
      return "This domain is not allowed in Firebase Auth. Add localhost in Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled yet. In Firebase Console turn on Google under Authentication → Sign-in method.";
    case "auth/account-exists-with-different-credential":
      return "This email is already registered with a password. Log in with email, or link Google in Firebase.";
    default:
      return error instanceof Error ? error.message : "Something went wrong. Try again.";
  }
}
