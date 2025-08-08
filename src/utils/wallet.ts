// src/utils/wallet.ts
import { ethers } from 'ethers';
import { generateMnemonic } from "bip39";
import { formatEther } from "ethers";
import { provider } from "./provider";

// const RPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
// const provider = new ethers.JsonRpcProvider(RPC_URL)

export const createMnemonic = () => {
  return generateMnemonic();
}

export const saveWallet = (encryptedWallet: string) => {
  chrome.storage.local.set({ keystore: encryptedWallet });
};

export const getWallet = (): Promise<{ privateKey: string, mnemonic?: string } | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['keystore'], (result) => {
      resolve(result.keystore || null);
    });
  });
};


export const clearWallet = () => {
  chrome.storage.local.remove(['keystore']);
};

export function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
}

export async function getBalance(address: string): Promise<string> {
  try {
    const balanceBigInt = await provider.getBalance(address);
    // Convert from wei (BigInt) to ether string
    return ethers.formatEther(balanceBigInt);
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw error;
  }
}
