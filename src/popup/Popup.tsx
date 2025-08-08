import React, { useState, useEffect } from "react";
import UnlockWallet from "./UnlockWallet";
import Onboarding from "./Onboarding";
import ImportWallet from "./ImportWallet";
import { decrypt } from "../utils/crypto";

function Home({ walletData, onCreate, onImport }) {
  return (
    <div>
      <h2>MagicCraft Wallet Dashboard</h2>
      {walletData ? (
        <>
          <p><strong>Address:</strong> {walletData.address}</p>
          <button onClick={onImport}>Import Wallet</button>
        </>
      ) : (
        <>
          <p>No wallet loaded.</p>
          <button onClick={onCreate}>Create New Wallet</button>
          <button onClick={onImport}>Import Wallet</button>
        </>
      )}
    </div>
  );
}

export default function Popup() {
  const [view, setView] = useState<"home" | "onboarding" | "import" | "unlock">("home");
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Popup useEffect running - checking keystore in storage...");
    chrome.storage.local.get(["keystore"], ({ keystore }) => {
      console.log("chrome.storage.local.get returned keystore:", keystore);

      if (keystore) {
        const password = prompt("Enter your passphrase to unlock wallet");
        console.log("User entered passphrase:", password);

        if (!password) {
          console.log("No passphrase entered, staying on home view");
          setView("home");
          setLoading(false);
          return;
        }

        try {
          const decrypted = decrypt(keystore, password);
          console.log("Decrypted string:", decrypted);

          if (!decrypted) {
            alert("Failed to decrypt with that passphrase");
            setView("home");
            setLoading(false);
            return;
          }

          const data = JSON.parse(decrypted);
          console.log("Parsed wallet data:", data);
          setWalletData(data);
          setView("home");
          setLoading(false);
        } catch (err) {
          alert("Incorrect passphrase or corrupted data");
          console.error("Decryption error:", err);
          setView("home");
          setLoading(false);
        }
      } else {
        console.log("No keystore found in storage, default to home");
        setView("home");
        setLoading(false);
      }
    });
  }, []);

  // Called after unlock/import/create success to set walletData and show home
  const handleWalletDone = (data: any) => {
    console.log("Wallet loaded or created:", data);
    setWalletData(data);
    setView("home");
  };

  if (loading) {
    return <div>Loading wallet data...</div>;
  }

  if (view === "unlock") {
    return (
      <UnlockWallet
        onBack={() => setView("home")}
        onUnlock={(data) => {
          console.log("UnlockWallet onUnlock called with data:", data);
          handleWalletDone(data);
        }}
      />
    );
  }

  if (view === "onboarding") {
    return <Onboarding onDone={handleWalletDone} onBack={() => setView("home")} />;
  }

  if (view === "import") {
    return <ImportWallet onDone={handleWalletDone} onBack={() => setView("home")} />;
  }

  return (
    <>
      <div>
        <h4>Debug walletData:</h4>
        <pre>{JSON.stringify(walletData, null, 2)}</pre>
      </div>
      <Home
        walletData={walletData}
        onCreate={() => setView("onboarding")}
        onImport={() => setView("import")}
      />
    </>
  );
}
