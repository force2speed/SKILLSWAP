export async function connectWallet() {
  if (!(window as any).ethereum) {
    throw new Error("MetaMask not installed");
  }
  const accounts = await (window as any).ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
}
