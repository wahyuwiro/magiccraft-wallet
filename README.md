# 🪄 MagicCraft Web3 Wallet (Browser Extension)

A lightweight, EVM-compatible Web3 wallet browser extension inspired by MetaMask but with a **MagicCraft** theme.  
Supports Ethereum, Binance Smart Chain (BSC), Polygon, and other EVM networks.

---

## ✨ Features

- **Wallet Creation & Import**
  - Generate a new 12-word mnemonic
  - Import wallet via mnemonic
  - Securely stores keys encrypted in browser storage

- **Dashboard**
  - View native coin balance for the selected network
  - Recent 5 transactions with hash, status, amount, and timestamp
  - Copy wallet address with a click

- **Send Transactions**
  - Enter recipient address, token type, and amount
  - QR code drop support for recipient address
  - Confirmation modal before sending
  - Automatic balance & history refresh after confirmation

- **Network Selector**
  - Switch between Ethereum, BSC, Polygon mainnets
  - Shows current network name and color dot indicator

- **MagicCraft Theme**
  - Deep midnight blues, arcane purples, shimmering gold accents
  - Compact, extension-friendly layout

---

## 📦 Installation & Running Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/magiccraft-wallet.git
cd magiccraft-wallet
```

2️⃣ Install dependencies
```bash
npm install
# or
yarn install
```

3️⃣ Build the extension
```bash
npm run build
```

This will generate the extension files in the ```dist/``` folder.

🧩 Load in Browser (Chrome / Edge)
1. Open your browser and go to:
```bash
chrome://extensions/
```
   
2. Enable **Developer mode** (toggle in top right).
3. Click **Load unpacked**.
4. Select the ```dist```/ folder from your project.


🔑 Usage
- **Create or Import a Wallet**: On first load, choose to create a new wallet or import using your mnemonic.
- **View Dashboard**: See your current balance and latest transactions.
- **Send a Transaction**: Fill in recipient, amount, and confirm.
- **Switch Networks**: Use the dropdown in the header to change between supported networks.


🛠 Tech Stack
- **React**(UI framework)
- **ethers.js** (Blockchain interaction)
- **Vite** (Fast bundler for extensions)
- **WebExtension APIs** (Browser integration)
- **Custom CSS** (MagicCraft theme)


🌐 Live Demo

- **Demo Video:** [YouTube](https://youtu.be/plsd43wxiCI)
