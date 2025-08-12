// src/utils/walletStorage.ts
import { encryptData, decryptData } from "./crypto";
export const KEYSTORE_KEY = "keystore";

export function saveKeystore(privateKey: string, password: string) {
  const encrypted = encryptData(privateKey, password);
  localStorage.setItem(KEYSTORE_KEY, encrypted);
}

export function getPrivateKey(password: string): string | null {
  const encrypted = localStorage.getItem(KEYSTORE_KEY);
  if (!encrypted) return null;
  return decryptData(encrypted, password);
}

export function clearKeystore() {
  localStorage.removeItem(KEYSTORE_KEY);
}

export const getKeystore = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([KEYSTORE_KEY], (res) => {
      resolve(res.keystore || null);
    });
  });
};

export const saveSession = (walletData: any): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ session: walletData }, () => resolve());
  });
};

export const getSession = (): Promise<any | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['session'], (res) => {
      resolve(res.session || null);
    });
  });
};

export const clearSession = (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove('session', () => resolve());
  });
};

export const clearWallet = (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove([KEYSTORE_KEY, 'session'], () => resolve());
  });
};
