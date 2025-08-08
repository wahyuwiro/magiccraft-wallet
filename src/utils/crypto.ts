// src/utils/crypto.ts

import CryptoJS from "crypto-js"
export const encrypt = (text: string, password: string): string => {
  const encrypted = CryptoJS.AES.encrypt(text, password).toString();
  return encrypted;
};

export const decrypt = (encrypted: string, password: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, password);
  return bytes.toString(CryptoJS.enc.Utf8);
};
  