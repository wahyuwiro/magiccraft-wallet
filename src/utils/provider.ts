import { JsonRpcProvider } from "ethers";
import { NETWORKS } from "./networks";

export function getProvider(networkKey: keyof typeof NETWORKS = "holesky") {
  const network = NETWORKS[networkKey];
  if (!network) throw new Error(`Unknown network: ${networkKey}`);
  return new JsonRpcProvider(network.rpc);
}

export const provider = new JsonRpcProvider("https://rpc.ankr.com/eth_holesky/f8bd53c888e188a04f868338747a2008b22e8f3ec3fc4f3a0939da53559d2b55");
