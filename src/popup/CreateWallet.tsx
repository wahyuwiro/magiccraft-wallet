// src/popup/CreateWallet.tsx
import React, { useState } from "react";
import { generateWallet, saveWallet } from "../utils/wallet";
import { encryptData } from "../utils/crypto";
import { saveSession } from "../utils/walletStorage";
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

    const encrypted = encryptData(JSON.stringify(walletData), passphrase);
    saveWallet(encrypted);
    saveSession(walletData);

    onDone(walletData, encrypted);
  };

  return (
    <div className="container">
      <div className="header header-sec">
        <h2>Create New Wallet</h2>
      </div>
      <button style={{ maxWidth: "70px", marginTop: 8}} onClick={onBack}>Back</button>

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
