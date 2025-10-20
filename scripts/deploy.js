import hre from 'hardhat';
const { ethers } = hre;
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying FHEDiplomaVault contract...");

  // Get the contract factory
  const FHEDiplomaVault = await ethers.getContractFactory("FHEDiplomaVault");
  
  // Deploy the contract (no constructor parameters needed)
  const fheDiplomaVault = await FHEDiplomaVault.deploy();

  await fheDiplomaVault.waitForDeployment();

  const contractAddress = await fheDiplomaVault.getAddress();
  console.log("FHEDiplomaVault deployed to:", contractAddress);
  
  // Update the contract address in the frontend
  const contractsPath = path.join(__dirname, '../src/lib/contracts.ts');
  let contractsContent = fs.readFileSync(contractsPath, 'utf8');
  contractsContent = contractsContent.replace(
    /VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS \|\| '0x0000000000000000000000000000000000000000'/,
    `VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || '${contractAddress}'`
  );
  fs.writeFileSync(contractsPath, contractsContent);
  console.log("Updated contract address in frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });