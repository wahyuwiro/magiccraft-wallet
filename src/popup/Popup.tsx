import React, { useState, useEffect, useRef } from "react";
import CreateWallet from "./CreateWallet";
import ImportWallet from "./ImportWallet";
import UnlockWallet from "./UnlockWallet";
import Dashboard from "./Dashboard";
import { decrypt } from "../utils/crypto";
import {
  getKeystore,
  saveKeystore,
  saveSession,
  getSession,
  clearSession,
  clearWallet,
} from "../utils/walletStorage";
import NetworkSelector from "./NetworkSelector";
import { NETWORKS } from "../utils/networks";
import { getBalance } from "../utils/wallet";

type View = "welcome" | "create" | "import" | "unlock" | "dashboard";

export default function Popup() {
  const [view, setView] = useState<View>("welcome");
  const [walletData, setWalletData] = useState<any>(null);
  const [error, setError] = useState("");

  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof NETWORKS>("holesky");
  const [balance, setBalance] = useState<string>("0");

  // Prevent multiple keystore checks
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return; // only run once
    initialized.current = true;

    async function init() {
      console.log("[Popup] Checking session and keystore on load...");

      const session = await getSession();
      if (session) {
        console.log("[Popup] Session found, going to dashboard");
        setWalletData(session);
        setView("dashboard");
        return;
      }

      const keystore = await getKeystore();
      if (keystore) {
        console.log("[Popup] Keystore found, showing unlock screen");
        setView("unlock");
      } else {
        console.log("[Popup] No keystore found, showing welcome screen");
        setView("welcome");
      }
    }
    init();
  }, []);

    // Update balance when walletData or selectedNetwork changes
    useEffect(() => {
      if (walletData?.address) {
        getBalance(walletData.address, selectedNetwork).then(setBalance);
      }
    }, [walletData, selectedNetwork]);

  async function handleWalletReady(data: any, encryptedKeystore?: string) {
    console.log("[Popup] Wallet ready", data);

    setWalletData(data);
    setError("");

    if (encryptedKeystore) {
      await saveKeystore(encryptedKeystore);
      console.log("[Popup] Saved keystore");
    }

    await saveSession(data);
    console.log("[Popup] Saved session");

    setView("dashboard");
  }

  async function handleLogout() {
    console.log("[Popup] Logout clicked");
    await clearSession();
    setWalletData(null);
    setView("welcome");
  }

  async function handleReset() {
    console.log("[Popup] Reset clicked");
    await clearSession();
    await clearWallet();
    setWalletData(null);
    setView("welcome");
  }

  useEffect(() => {
    console.log("view :", view);
  }, [view]);

  return (
    <div style={{ padding: 8, maxWidth: 400, margin: "auto" }}>
      {view === "welcome" && (
        <div>
          <h1>🧙‍♂️ MagicCraft Wallet</h1>
          <button onClick={() => setView("create")}>Create New Wallet</button>
          <button onClick={() => setView("import")}>Import Wallet</button>
          <button onClick={() => setView("unlock")}>Unlock Wallet</button>
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
  );
}
