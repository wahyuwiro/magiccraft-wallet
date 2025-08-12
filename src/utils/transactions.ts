// src/utils/transactions.ts
import { Wallet, ethers } from "ethers";

export async function sendTransaction(privateKey: string, to: string, amount: string, rpc?: string, chainId?: string): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(rpc, chainId);
    const wallet = new Wallet(privateKey, provider);

    // Create transaction object
    const tx = {
      to,
      value: ethers.parseEther(amount)
    };

    // Send transaction
    const txResponse = await wallet.sendTransaction(tx);

    // Wait for it to be mined (optional, but better UX)
    await txResponse.wait();

    return txResponse.hash;
  } catch (error) {
    console.log("Transaction failed:", error);
    throw error;
  }
}
