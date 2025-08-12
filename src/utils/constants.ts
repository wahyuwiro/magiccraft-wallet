// src/utils/constants.ts
export const MCRT_ADDRESSES: Record<string, string> = {
  ethereum: "0xde16Ce60804a881e9F8c4eBB3824646EDecd478D",
  bsc: "0x4b8285ab433d8f69cb48d5ad62b415ed1a221e4f",
};

export const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];
  