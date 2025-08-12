// src/utils/sendMCRT.ts
import { ethers } from "ethers";
import { ERC20_ABI, MCRT_ADDRESSES } from "./constants";

export async function sendMCRT(
  privateKey: string,
  to: string,
  amount: string,
  rpcUrl: string,
  networkKey?: "ethereum" | "bsc" // add more if needed
) {
  // Connect to RPC
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Create wallet connected to provider
  const wallet = new ethers.Wallet(privateKey, provider);

  // Pick the right MCRT contract address
  const tokenAddress = MCRT_ADDRESSES[networkKey];
  if (!tokenAddress) {
    throw new Error(`Unsupported network: ${networkKey}`);
  }

  // Load contract
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

  // Convert human-readable amount to token decimals (MCRT is 18 decimals)
  const decimals = 18;
  const amountWei = ethers.parseUnits(amount, decimals);

  // Send transaction
  const tx = await contract.transfer(to, amountWei);

  const receipt = await tx.wait();
  return { hash: tx.hash, receipt };
}