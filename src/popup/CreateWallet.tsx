import React from "react";
import { generateWallet } from "../utils/wallet";
import { encrypt } from "../utils/crypto";

export default function CreateWallet({
  onDone,
  onBack,
}: {
  onDone: (walletData: any) => void;
  onBack: () => void;
}) {
  const handleCreate = () => {
    const wallet = generateWallet();
    const password = prompt("Set a password to encrypt your wallet");
    if (!password) return alert("Password is required");

    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    };

    const encrypted = encrypt(JSON.stringify(walletData), password);

    chrome.storage.local.set({ keystore: encrypted }, () => {
      alert("Wallet created and stored securely");
      onDone(walletData);
    });
  };

  return (
    <div>
      <h3>Create New Wallet</h3>
      <button onClick={handleCreate}>Generate Wallet</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
