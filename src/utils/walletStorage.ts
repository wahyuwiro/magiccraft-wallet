// src/utils/walletStorage.ts

export const saveKeystore = (encryptedKeystore: string): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ keystore: encryptedKeystore }, () => resolve());
  });
};

export const getKeystore = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['keystore'], (res) => {
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
    chrome.storage.local.remove(['keystore', 'session'], () => resolve());
  });
};
