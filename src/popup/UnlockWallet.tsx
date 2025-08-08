import React, { useState } from "react";
import { decrypt } from "../utils/crypto";

interface UnlockWalletProps {
  onUnlock: (walletData: any) => void;
  onBack: () => void;
}

export default function UnlockWallet({ onUnlock, onBack }: UnlockWalletProps) {
  const [passphrase, setPassphrase] = useState("");

  const unlock = () => {
    chrome.storage.local.get(["keystore"], ({ keystore }) => {
      if (!keystore) {
        alert("No wallet found. Please create or import one.");
        onBack();
        return;
      }

      try {
        const decrypted = decrypt(keystore, passphrase);
        if (!decrypted) throw new Error("Decryption failed");
        const walletData = JSON.parse(decrypted);
        onUnlock(walletData);
      } catch (err) {
        alert("Failed to unlock wallet: incorrect passphrase");
      }
    });
  };

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <input
        type="password"
        placeholder="Enter passphrase"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        style={{ width: "100%", marginTop: 8 }}
      />
      <button onClick={unlock} style={{ marginTop: 8 }}>
        Unlock Wallet
      </button>
    </div>
  );
}
