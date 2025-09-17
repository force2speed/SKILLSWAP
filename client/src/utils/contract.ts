import { ethers } from "ethers";
import SkillSwap from "@/contracts/SkillSwap.json";

const CONTRACT_ADDRESS = "0x7E5c24E1Eb0e3eC8E945581d216B344A3Cc582e8";

export async function getContract() {
  if (!(window as any).ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, SkillSwap.abi, signer);
}
