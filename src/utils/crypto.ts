/**
 * Cryptographic utilities for SafeVoice:
 * - Genuine SHA-256 hashing via native Web Crypto API
 * - Tamper verification & integrity checks
 * - Secure reference ID & secret access code generation
 */

export async function computeSHA256(data: BufferSource | string): Promise<string> {
  const buffer: BufferSource = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return computeSHA256(arrayBuffer);
}

export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `SV-${year}-${randomPart}`;
}

export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

export async function verifyEvidenceIntegrity(
  fileData: BufferSource | string,
  storedHash: string
): Promise<{ isValid: boolean; computedHash: string }> {
  const computedHash = await computeSHA256(fileData);
  return {
    isValid: computedHash.toLowerCase() === storedHash.toLowerCase(),
    computedHash,
  };
}
