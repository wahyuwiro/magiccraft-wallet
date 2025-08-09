// src/popup/CreateWallet.tsx
import React, { useState } from "react";
import { generateWallet, saveWallet } from "../utils/wallet";
import { encrypt } from "../utils/crypto";

interface CreateWalletProps {
  onDone: (walletData: any, encrypted: string) => void;
  onBack: () => void;
}

export default function CreateWallet({ onDone, onBack }: CreateWalletProps) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");

  const createNewWallet = () => {
    if (!passphrase) {
      setError("Passphrase is required");
      return;
    }

    const newWallet = generateWallet();
    const walletData = {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      mnemonic: newWallet.mnemonic,
    };

    const encrypted = encrypt(JSON.stringify(walletData), passphrase);
    saveWallet(encrypted);

    onDone(walletData, encrypted);
  };

  return (
    <div style={{ padding: 16, maxWidth: 400, margin: "auto" }}>
      <button onClick={onBack}>Back</button>
      <h2>Create New Wallet</h2>
      <input
        type="password"
        placeholder="Set passphrase"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        style={{ width: "100%", marginTop: 8 }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={createNewWallet} style={{ marginTop: 8 }}>
        Create Wallet
      </button>
    </div>
  );
}
