import { getSession } from "./src/utils/walletStorage";

// Inject your custom provider into the page
window.postMessage({ type: 'FROM_MAGICCRAFT_WALLET', message: 'Wallet injected!' }, '*');

// Add listener if the page wants to connect to wallet
window.addEventListener('message', async (event) => {
  if (event.data.type === 'CONNECT_MAGICCRAFT') {
    const session = await getSession();
    // const wallet = await walletStorage.getWallet(passphrase);
    window.postMessage({
      type: 'MAGICCRAFT_WALLET_ADDRESS',
      address: session?.address || null,
    }, '*');
  }
});
