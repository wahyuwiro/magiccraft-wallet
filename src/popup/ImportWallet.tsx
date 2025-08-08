import React, { useState } from "react";
import { Wallet, Mnemonic } from "ethers";
import { encrypt } from "../utils/crypto";

interface ImportWalletProps {
  onDone: (walletData: any) => void;
  onBack: () => void;
}

export default function ImportWallet({ onDone, onBack }: ImportWalletProps) {
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");

  const importWallet = async () => {
    try {
      const cleanedMnemonic = mnemonic.trim().split(/\s+/).join(" ");

      // Validate mnemonic (this throws if invalid)
      Mnemonic.fromPhrase(cleanedMnemonic, "en");

      // Create wallet
      const wallet = Wallet.fromPhrase(cleanedMnemonic);

      const walletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: cleanedMnemonic,
      };

      const keystore = await encrypt(JSON.stringify(walletData), passphrase);

      chrome.storage.local.set({ keystore }, () => {
        alert("Wallet imported and stored securely");
        onDone(walletData);
      });
    } catch (error) {
      alert("Mnemonic is invalid. Please check your input.");
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <textarea
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        placeholder="Enter 12-word mnemonic"
        rows={3}
        style={{ width: "100%" }}
      />
      <input
        type="password"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        placeholder="Passphrase to encrypt"
        style={{ width: "100%", marginTop: 8 }}
      />
      <button onClick={importWallet} style={{ marginTop: 8 }}>
        Import & Secure
      </button>
    </div>
  );
}
