import { ethers } from "ethers";
import React, { useEffect, useState, useRef  } from "react";
import { getBalance, getRecentTransactions } from "../utils/wallet";
import { sendTransaction } from "../utils/transactions";
import { NETWORKS } from "../utils/networks";
import NetworkSelector from "./NetworkSelector";
import { QRCodeCanvas } from "qrcode.react";
import TransactionConfirmModal from "../components/TransactionConfirmModal";
import jsQR from "jsqr";

interface DashboardProps {
  walletData: any;
  onLogout: () => Promise<void>;
}
export default function Dashboard({
  walletData,
  onLogout,
}: DashboardProps) {
  const [balance, setBalance] = useState("Loading...");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof NETWORKS>("holesky");
  const [transactions, setTransactions] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const netConfig = NETWORKS[selectedNetwork];
  const recipientRef = useRef<HTMLInputElement>(null);
  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 15)}...${addr.slice(-3)}` : "";
  
  useEffect(() => {
    console.log('walletData:', walletData);
  },[walletData]);

  async function fetchTransactions() {
    try {
    if (!walletData?.address) return;
    const txs = await getRecentTransactions(walletData.address, selectedNetwork);
    console.log("Transactions fetched:", txs);
    setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  async function fetchBalance() {
    try {
      if (!walletData?.address) return;
      const bal = await getBalance(walletData.address, selectedNetwork);

      setBalance(bal);
    } catch (error) {
      console.log("Error fetchBalance :", error);
      setBalance("Error fetching balance");
    }
  }

  const refreshData = async () => {
    await fetchBalance();
    await fetchTransactions();
  };
  
  useEffect(() => {
    refreshData();
  }, [walletData.address, selectedNetwork]);
  
  const handleSendClick = () => {
    if (!to || !amount) return;
    setShowConfirm(true);
  };
  const handleConfirmSend  = async () => {
    console.log('netConfig :',netConfig);
    if (!to || !amount) {
      alert("Please enter recipient address and amount.");
      return;
    }
    setShowConfirm(false);
    setStatus("Pending...");
    setSending(true);
    try {
      const txHash = await sendTransaction(
        walletData.privateKey, 
        to, 
        amount,
        netConfig.rpc,
        netConfig.chainId
      );
      setTxHash(txHash);
      alert(`Transaction sent! Hash: ${txHash}`);

      // Refresh balance after sending
     
      const provider = new ethers.JsonRpcProvider(netConfig.rpc);
      await provider.waitForTransaction(txHash);

      // Now refresh data after confirmation
      await refreshData();

      // Optional: poll after a delay to catch slow explorer updates
      setTimeout(refreshData, 5000);
      setStatus("Transaction confirmed!");      
      setTo("");
      setAmount("");
    } catch (err) {
      console.error("Transaction error:", err);

      alert("Failed to send transaction");
    } finally {
      setSending(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Failed to copy address:", err));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setTo(code.data); // QR decoded address
        } else {
          alert("No QR code detected in the image.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="wallet-info">          
          <div className="address">
            <p>{shortAddress(walletData.address)}</p>
            <button
              onClick={copyAddress}
            >
              <span className="copy-icon"
                style={{
                  maskImage: `url(${copied ? "/icons/copy-success.svg" : "/icons/copy.svg"})`,
                  WebkitMaskImage: `url(${copied ? "/icons/copy-success.svg" : "/icons/copy.svg"})`,
                  backgroundColor: copied ? "#4CAF50" : "#F1C40F", // gold or green
                }}
              />
            </button>
          </div>
          <div className="balance">{balance} ETH</div>
        </div>
      </div>
      <div className="scroll-body">
        <h2>🧙‍♂️ Dashboard</h2>

        {/* QR Code */}
        <div style={{ marginBottom: "16px" }}>
          <QRCodeCanvas
            value={walletData.address}
            size={128} // size in px
            includeMargin={true}
          />
          <p style={{ fontSize: "0.9em", color: "#888" }}>Scan to get my address</p>
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>Send ETH</h3>
          <NetworkSelector
            selectedNetwork={selectedNetwork}
            onChange={setSelectedNetwork}
          />
          
          <div 
            onDrop={handleDrop} 
            onDragOver={(e) => e.preventDefault()} 
            style={{ 
              border: "2px dashed #F1C40F", 
              padding: "10px",
              overflow: "hidden",
              background: "#1A1B2F",
              marginBottom: 16,
            }}
          >
            <label style={{ display: "block", marginBottom: 4 }}>Recipient Address:</label>
            
            <input
              ref={recipientRef}
              type="text"
              placeholder="Type or drop QR code here"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "95%",
                padding: "8px",
                border: "none",
                outline: "none"
              }}
            />
          </div>


          <input
            type="text"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button onClick={handleSendClick} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

        {status && (
          <div>
            <p>Status: {status}</p>
            {txHash && (
              <a href={`${netConfig.explorer}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                View on Explorer
              </a>
            )}
          </div>
        )}

        {showConfirm && (
          <TransactionConfirmModal
            from={walletData.address}
            to={to}
            amount={amount}
            networkName={netConfig?.name || "Unknown Network"}
            onConfirm={handleConfirmSend}
            onCancel={() => setShowConfirm(false)}
          />
        )}

        <div>
          <h3>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p>No recent transactions</p>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {transactions.map((tx, i) => (
                <li key={i}>
                  <a href={tx.explorerLink} target="_blank" rel="noreferrer">{tx.hash.slice(0, 10)}...</a>
                  {" — "} {tx.value} ETH — {tx.status} — {tx.time}
                </li>
              ))}
            </ul>
          )}
        </div>


        <button style={{ marginTop: 24 }} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
