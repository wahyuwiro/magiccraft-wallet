import React, { useEffect, useState } from "react";
import { getBalance } from "../utils/wallet"; // make sure you have this util
import { sendTransaction } from "../utils/transactions";

export default function Dashboard({ walletData, onLogout }) {
  const [balance, setBalance] = useState("Loading...");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const bal = await getBalance(walletData.address);
        setBalance(bal);
      } catch {
        setBalance("Error fetching balance");
      }
    }
    fetchBalance();
  }, [walletData.address]);

  const handleSend = async () => {
    if (!to || !amount) {
      alert("Please enter recipient address and amount.");
      return;
    }
    setSending(true);
    try {
      const txHash = await sendTransaction(walletData.privateKey, to, amount);
      alert(`Transaction sent! Hash: ${txHash}`);
      // Refresh balance after sending
      const bal = await getBalance(walletData.address);
      setBalance(bal);
      setTo("");
      setAmount("");
    } catch (err) {
      alert("Failed to send transaction");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: 16, backgroundColor: "#1A1B2F", color: "#F1C40F" }}>
      <h2>Wallet Dashboard</h2>
      <p><strong>Address:</strong> {walletData.address}</p>
      <p><strong>Balance:</strong> {balance} ETH</p>

      <div style={{ marginTop: 24 }}>
        <h3>Send ETH</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button onClick={handleSend} disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>

      <button style={{ marginTop: 24 }} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
