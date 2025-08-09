import { Wallet, parseEther, ethers } from "ethers";

// import { provider } from "./provider";

// // Use the same RPC URL and provider as wallet.ts or pass provider as param
// const RPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
// const provider = new ethers.JsonRpcProvider(RPC_URL);

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
    console.error("Transaction failed:", error);
    throw error;
  }
}
