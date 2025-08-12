import { JsonRpcProvider } from "ethers";
import { NETWORKS } from "./networks";

export function getProvider(networkKey: keyof typeof NETWORKS = "holesky") {
  const network = NETWORKS[networkKey];
  if (!network) throw new Error(`Unknown network: ${networkKey}`);
  return new JsonRpcProvider(network.rpc);
}
