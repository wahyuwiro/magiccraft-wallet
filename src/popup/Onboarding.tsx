import React, { useState, useEffect } from "react";
import UnlockWallet from "./UnlockWallet";
import ImportWallet from "./ImportWallet";
import CreateWallet from "./CreateWallet";
import { KEYSTORE_KEY } from "../utils/walletStorage";

export default function Onboarding({ onDone, onBack }) {
  const [view, setView] = useState<"main" | "import" | "unlock" | "dashboard" | "create">("main");

  useEffect(() => {
    chrome.storage.local.get([KEYSTORE_KEY], ({ keystore }) => {
      if (keystore) {
        setView("unlock");
      } else {
        setView("main");
      }
    });
  }, []);

  // When any step finishes and returns wallet data, pass it UP to Popup
  const handleDone = (data) => {
    onDone(data);   // Pass wallet data to Popup component's state
  };

  if (view === "main") {
    return (
      <div>        
        <h2>Welcome to MagicCraft Wallet</h2>
        <button onClick={() => setView("create")}>Create New Wallet</button>
        <button onClick={() => setView("import")}>Import Wallet</button>
        <button onClick={() => setView("unlock")}>Unlock Wallet</button>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  if (view === "unlock") {
    return (
      <UnlockWallet
        onBack={() => setView("main")}
        onUnlock={(data) => {
          handleDone(data);  // Pass wallet data to Popup
          // Optionally: setView("dashboard"); or you can let Popup handle it
        }}
      />
    );
  }

  if (view === "import") {
    return (
      <ImportWallet
        onBack={() => setView("main")}
        onDone={(data) => {
          handleDone(data);
        }}
      />
    );
  }

  if (view === "create") {
    return (
      <CreateWallet
        onBack={() => setView("main")}
        onDone={(data) => {
          handleDone(data);
        }}
      />
    );
  }

  // You can remove the dashboard view here or keep it to show something else, but it's better to let Popup handle dashboard after Onboarding done.

  return null;
}
