// src/components/NetworkSelector.tsx
import React from "react";
import { NETWORKS } from "../utils/networks";
import { MCRT_ADDRESSES } from "../utils/constants";

interface NetworkSelectorProps {
  selectedNetwork: keyof typeof NETWORKS;
  onChange: (network: keyof typeof NETWORKS) => void;
  tokenType?: "native" | "mcrt"; // optional for reusability
}

export default function NetworkSelector({
  selectedNetwork,
  onChange,
  tokenType = "native",
}: NetworkSelectorProps) {
  // filter networks if tokenType is mcrt
  const availableNetworks = Object.entries(NETWORKS).filter(([key]) => {
    if (tokenType === "mcrt") {
      const mcrtKey = NETWORKS[key as keyof typeof NETWORKS].mcrtKey;
      return Boolean(MCRT_ADDRESSES[mcrtKey]);
    }
    return true;
  });

  return (
    <select
      value={selectedNetwork}
      onChange={(e) => onChange(e.target.value as keyof typeof NETWORKS)}
      style={{ marginBottom: 12, width: "100%" }}
    >
      {availableNetworks.map(([key, net]) => (
        <option key={key} value={key}>
          {net.name}
        </option>
      ))}
    </select>
  );
}
