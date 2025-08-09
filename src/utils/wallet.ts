// src/utils/wallet.ts
import { ethers } from 'ethers';
import { generateMnemonic } from "bip39";
import { formatEther } from "ethers";
import { provider } from "./provider";
import { getProvider } from "./provider";
import { NETWORKS } from "../utils/networks";

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

export async function getBalance(
  address: string,
  networkKey: keyof typeof NETWORKS = "holesky"
): Promise<string> {
  const provider = getProvider(networkKey);
  try {
    const balanceBigInt = await provider.getBalance(address);
    console.log("Balance BigInt xxx :", balanceBigInt.toString());
    return ethers.formatEther(balanceBigInt);
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw error;
  }
}

export async function getRecentTransactions(address: string, networkKey: keyof typeof NETWORKS) {
  const netConfig = NETWORKS[networkKey];
  const url = `${netConfig.api}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${netConfig.apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "1" || !data.result) {
      console.error("Error fetching transactions:", data.message);
      return [];
    }

    return data.result.map((tx: any) => ({
      hash: tx.hash,
      time: new Date(tx.timeStamp * 1000).toLocaleString(),
      value: Number(tx.value) / 1e18,
      status: tx.isError === "0" ? "Success" : "Failed",
      explorerLink: `${netConfig.explorer}/tx/${tx.hash}`
    }));
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}
