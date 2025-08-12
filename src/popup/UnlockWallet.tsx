// src/popup/UnlockWallet.tsx
import React, { useState } from "react";
import { decryptData } from "../utils/crypto";
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
        const decrypted = decryptData(keystore, passphrase); // use new decryptData
        if (!decrypted) throw new Error("Decryption failed");
  
        const walletData = JSON.parse(decrypted);
  
        await saveSession(walletData);
        onUnlock(walletData);
      } catch (err) {
        alert("Failed to unlock wallet: incorrect passphrase");
        console.log(err);
      }
    });
  };
  

  return (
    <div className="container">
      <div className="header header-sec">
        <h2>Unlock Wallet</h2>
      </div>

      <button style={{ maxWidth: "70px", marginTop: 8}} onClick={onBack}>Back</button>
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
