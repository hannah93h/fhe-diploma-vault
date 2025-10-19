const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FHEDiplomaVault contract...");

  // Get the contract factory
  const FHEDiplomaVault = await ethers.getContractFactory("FHEDiplomaVault");
  
  // Deploy the contract with a verifier address (you can use your own address for testing)
  const verifierAddress = "0x3c7fae276c590a8df81ed320851c53db4bc39916"; // Replace with actual verifier address
  const fheDiplomaVault = await FHEDiplomaVault.deploy(verifierAddress);

  await fheDiplomaVault.waitForDeployment();

  const contractAddress = await fheDiplomaVault.getAddress();
  console.log("FHEDiplomaVault deployed to:", contractAddress);
  
  // Update the contract address in the frontend
  const fs = require('fs');
  const path = require('path');
  
  // Update contracts.ts
  const contractsPath = path.join(__dirname, '../src/lib/contracts.ts');
  let contractsContent = fs.readFileSync(contractsPath, 'utf8');
  contractsContent = contractsContent.replace(
    /VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS \|\| '0x0000000000000000000000000000000000000000'/,
    `VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || '${contractAddress}'`
  );
  fs.writeFileSync(contractsPath, contractsContent);
  
  console.log("Contract address updated in frontend configuration");
  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
