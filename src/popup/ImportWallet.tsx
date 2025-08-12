// src/popup/ImportWallet.tsx
import React, { useState } from "react";
import { HDNodeWallet } from "ethers";
import { saveKeystore, saveSession } from "../utils/walletStorage";
import { mnemonicToSeedSync } from "@scure/bip39";
import { isValidMnemonicWords } from "../utils/wordlist-en";

export default function ImportWallet({ onDone, onBack }) {
  const [mnemonic, setMnemonic] = useState("");
  const [passphrase, setPassphrase] = useState("");
    
  const importWallet = async () => {
    try {
      if (!mnemonic || !passphrase) {
        alert("Please enter your mnemonic and password.");
        return;
      }
  
      const cleanedMnemonic = mnemonic.trim().toLowerCase().split(/\s+/).join(" ");
  
      if (!isValidMnemonicWords(cleanedMnemonic)) {
        alert("Mnemonic contains invalid words.");
        return;
      }
  
      // Get the seed from mnemonic
      const seed = mnemonicToSeedSync(cleanedMnemonic);
  
      // Derive wallet from BIP44 path m/44'/60'/0'/0/0
      const hdNode = HDNodeWallet.fromSeed(seed);
      const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");
  
      const walletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: cleanedMnemonic,
      };
  
      saveKeystore(wallet.privateKey, passphrase);
      await saveSession(walletData);
  
      alert("Wallet imported and stored securely");
      onDone({...walletData,passphrase:passphrase});
    } catch (error) {
      console.log("Error importing wallet:", error);
      alert("Failed to import wallet. Please check your inputs.");
    }
  };

  return (
    <div className="container">
      <div className="header header-sec">
        <h2>Import Wallet</h2>
      </div>
      <button style={{ maxWidth: "70px", marginTop: 8}} onClick={onBack}>Back</button>

      <textarea
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        placeholder="Enter 12-word mnemonic"
        rows={3}
        style={{ width: "100%", marginTop: 8  }}
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
