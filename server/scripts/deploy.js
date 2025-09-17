// scripts/deploy.js
const hre = require("hardhat");
require('dotenv').config();


async function main() {
const SkillSync = await ethers.getContractFactory("SkillSwap");
const skillSync = await SkillSync.deploy(); // deploy returns a deployed contract
console.log("SkillSync deployed to:", skillSync.target); // use `target` instead of `address`
}

main().catch((error) => {
console.error(error);
process.exitCode = 1;
});