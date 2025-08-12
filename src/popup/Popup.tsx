import React, { useState, useEffect, useRef } from "react";
import CreateWallet from "./CreateWallet";
import ImportWallet from "./ImportWallet";
import UnlockWallet from "./UnlockWallet";
import Dashboard from "./Dashboard";
import {
  getKeystore,
  saveKeystore,
  saveSession,
  getSession,
  clearSession,
  clearWallet,
} from "../utils/walletStorage";
import { NETWORKS } from "../utils/networks";
import { getBalance } from "../utils/wallet";

type View = "welcome" | "create" | "import" | "unlock" | "dashboard";

export default function Popup() {
  const [view, setView] = useState<View>("welcome");
  const [walletData, setWalletData] = useState<any>(null);
  const [error, setError] = useState("");

  // Prevent multiple keystore checks
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return; // only run once
    initialized.current = true;

    async function init() {  
      const session = await getSession();
      if (session) {
        setWalletData(session);
        setView("dashboard");
        return;
      }

      const keystore = await getKeystore();
      if (keystore) {
        setView("unlock");
      } else {
        setView("welcome");
      }
    }
    init();
  }, []);

  async function handleWalletReady(data: any, encryptedKeystore?: string) {
    setWalletData(data);
    setError("");

    if (encryptedKeystore) {
      await saveKeystore(encryptedKeystore, data.passphrase); // Use a default passphrase for now
    }

    await saveSession(data);
    setView("dashboard");
  }

  async function handleLogout() {
    await clearSession();
    setWalletData(null);
    setView("welcome");
  }

  async function handleReset() {
    await clearSession();
    await clearWallet();
    setWalletData(null);
    setView("welcome");
  }

  return (
    <div class="app-wrapper">
    <div  class="app-inner" style={{ padding: 8, maxWidth: 400, margin: "auto" }}>
      {view === "welcome" && (
        <div>
          <div className="header header-sec">
            <h1>🧙‍♂️ MagicCraft Wallet</h1>
          </div>
          <div className="welcome" >
            <button onClick={() => setView("create")}>Create New Wallet</button>
            <button onClick={() => setView("import")}>Import Wallet</button>
            <button onClick={() => setView("unlock")}>Unlock Wallet</button>
          </div>
        </div>
      )}

      {view === "create" && (
          <CreateWallet
            onBack={() => setView("welcome")}
            onDone={(walletData, encrypted) => {
              // handle wallet ready state, store encrypted, etc.
              setWalletData(walletData);
              setView("dashboard");
            }}
          />
        
      )}

      {view === "import" && (
        <ImportWallet
          onBack={() => setView("welcome")}
          onDone={(data, encrypted) => handleWalletReady(data, encrypted)}
        />
      )}

      {view === "unlock" && (
        <UnlockWallet
          onBack={() => setView("welcome")}
          onUnlock={(data) => handleWalletReady(data)}
        />
      )}

      {view === "dashboard" && walletData && (
        <Dashboard
          walletData={walletData}
          onLogout={handleLogout}
        />
      )}

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>
          <strong>Error: </strong>
          {error}
        </p>
      )}
    </div>
    </div>
  );
}
