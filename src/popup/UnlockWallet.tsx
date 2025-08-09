import React, { useState } from "react";
import { decrypt } from "../utils/crypto";
import { saveSession } from "../utils/walletStorage";

export default function UnlockWallet({ onUnlock, onBack }) {
  const [passphrase, setPassphrase] = useState("");

  const unlock = () => {
    chrome.storage.local.get(["keystore"], async ({ keystore }) => {
      if (!keystore) {
        alert("No wallet found. Please create or import one.");
        onBack();
        return;
      }

      try {
        const decrypted = decrypt(keystore, passphrase);
        if (!decrypted) throw new Error("Decryption failed");
        const walletData = JSON.parse(decrypted);

        await saveSession(walletData);
        onUnlock(walletData);
      } catch (err) {
        alert("Failed to unlock wallet: incorrect passphrase");
        console.error(err);
      }
    });
  };

  return (
    <div className="container">
      <button onClick={onBack}>Back</button>
      <h2>Unlock Wallet</h2>
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
