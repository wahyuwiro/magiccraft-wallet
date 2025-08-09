import React from "react";
import { NETWORKS } from "../utils/networks";

interface NetworkSelectorProps {
  selectedNetwork: keyof typeof NETWORKS;
  onChange: (network: keyof typeof NETWORKS) => void;
}

export default function NetworkSelector({ selectedNetwork, onChange }: NetworkSelectorProps) {
  return (
    <select
      value={selectedNetwork}
      onChange={(e) => onChange(e.target.value as keyof typeof NETWORKS)}
      style={{ marginBottom: 12, width: "100%" }}
    >
      {Object.keys(NETWORKS).map((key) => (
        <option key={key} value={key}>
          {NETWORKS[key as keyof typeof NETWORKS].name}
        </option>
      ))}
    </select>
  );
}
