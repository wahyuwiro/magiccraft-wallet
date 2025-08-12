// src/utils/crypto.ts
import CryptoJS from "crypto-js";


// PBKDF2 key derivation
function deriveKey(password: string, salt: CryptoJS.lib.WordArray) {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256-bit key
    iterations: 1000
  });
}

/**
 * Encrypts any string with a password, storing salt & IV.
 */
export function encryptData(data: string, password: string): string {
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  const key = deriveKey(password, salt);

  const encrypted = CryptoJS.AES.encrypt(data, key, { iv }).toString();

  return JSON.stringify({
    salt: CryptoJS.enc.Hex.stringify(salt),
    iv: CryptoJS.enc.Hex.stringify(iv),
    encrypted
  });
}

/**
 * Decrypts data previously encrypted with encryptData().
 */
export function decryptData(encryptedJson: string, password: string): string {
  const { salt, iv, encrypted } = JSON.parse(encryptedJson);

  const saltWA = CryptoJS.enc.Hex.parse(salt);
  const ivWA = CryptoJS.enc.Hex.parse(iv);
  const key = deriveKey(password, saltWA);

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: ivWA });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

  