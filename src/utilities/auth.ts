import crypto from "crypto";

/**
 * Validates a password against a secure hash/salt.
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 32, "sha512").toString("hex");
  return verifyHash === hash;
}

/**
 * Generates a secure hash/salt pair for storage.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 32, "sha512").toString("hex");
  return { hash, salt };
}
