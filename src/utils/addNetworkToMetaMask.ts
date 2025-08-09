// src/utils/addNetworkToMetaMask.ts
import { NETWORKS } from "./networks";

// Extend the Window type so TypeScript knows about ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export async function addNetworkToMetaMask(networkKey: keyof typeof NETWORKS) {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return;
  }

  const network = NETWORKS[networkKey];
  if (!network) {
    alert("Unknown network");
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${network.chainId.toString(16)}`, // Hex format
          chainName: network.name,
          rpcUrls: [network.rpc],
          nativeCurrency: {
            name: network.name,
            symbol:
              networkKey === "bsc"
                ? "BNB"
                : networkKey === "polygon"
                ? "MATIC"
                : "ETH",
            decimals: 18,
          },
          blockExplorerUrls: [network.explorer],
        },
      ],
    });
    console.log(`${network.name} added to MetaMask`);
  } catch (err) {
    console.error("Error adding network to MetaMask:", err);
  }
}
