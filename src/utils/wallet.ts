// src/utils/wallet.ts
import { ethers } from 'ethers';
import { generateMnemonic } from "bip39";
import { getProvider } from "./provider";
import { NETWORKS } from "./networks";
import { MCRT_ADDRESSES, ERC20_ABI } from "./constants";
import { KEYSTORE_KEY } from "../utils/walletStorage";

export const createMnemonic = () => {
  return generateMnemonic();
}

export const saveWallet = (encryptedWallet: string) => {
  chrome.storage.local.set({ [KEYSTORE_KEY]: encryptedWallet });
};

export const getWallet = (): Promise<{ privateKey: string, mnemonic?: string } | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([KEYSTORE_KEY], (result) => {
      resolve(result.keystore || null);
    });
  });
};


export const clearWallet = () => {
  chrome.storage.local.remove([KEYSTORE_KEY]);
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
    return ethers.formatEther(balanceBigInt);
  } catch (error) {
    console.log("Failed to fetch balance:", error);
    throw error;
  }
}

export async function getMcrtBalance(
  address: string,
  networkKey: keyof typeof NETWORKS
): Promise<string> {
  try {
    const provider = getProvider(networkKey);
    const tokenAddress = MCRT_ADDRESSES[networkKey];

    if (!tokenAddress) {
      throw new Error(`No MCRT token address for network: ${networkKey}`);
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const decimals = await contract.decimals();
    const balance = await contract.balanceOf(address);

    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.log("Failed to fetch MCRT balance:", error);
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
      console.log("Error fetching transactions:", data.message);
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
    console.log("Failed to fetch transactions:", error);
    return [];
  }
}

export async function getRecentTokenTransactions(address: string, tokenAddress: string, networkKey: keyof typeof NETWORKS) {
  const netConfig = NETWORKS[networkKey];
  const url = `${netConfig.api}?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${address}&page=1&offset=5&sort=desc&apikey=${netConfig.apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "1" || !data.result) {
      return [];
    }

    return data.result.map((tx: any) => ({
      hash: tx.hash,
      time: new Date(tx.timeStamp * 1000).toLocaleString(),
      value: Number(tx.value) / (10 ** tx.tokenDecimal),
      status: tx.isError === "0" ? "Success" : "Failed",
      explorerLink: `${netConfig.explorer}/tx/${tx.hash}`,
      tokenSymbol: tx.tokenSymbol
    }));
  } catch (error) {
    console.log("Failed to fetch token transactions:", error);
    return [];
  }
}
