const { ethers } = require("hardhat");

async function main() {
  console.log("Initializing FHE Diploma Vault...");

  // Get the contract
  const FHEDiplomaVault = await ethers.getContractFactory("FHEDiplomaVault");
  
  // Deploy the contract (if not already deployed)
  const verifierAddress = "0x0000000000000000000000000000000000000000"; // Placeholder verifier
  const contract = await FHEDiplomaVault.deploy(verifierAddress);
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("Contract deployed at:", contractAddress);

  // Set admin address
  const adminAddress = "0x1C7EF492E796A6e0DD3521a299A0836B26D5E73C";
  
  // Register some universities
  console.log("Registering universities...");
  
  // Harvard University
  const harvardTx = await contract.registerUniversity(
    "Harvard University",
    "United States",
    "New England Commission of Higher Education"
  );
  await harvardTx.wait();
  console.log("Harvard University registered");

  // MIT
  const mitTx = await contract.registerUniversity(
    "Massachusetts Institute of Technology",
    "United States", 
    "New England Commission of Higher Education"
  );
  await mitTx.wait();
  console.log("MIT registered");

  // Stanford University
  const stanfordTx = await contract.registerUniversity(
    "Stanford University",
    "United States",
    "Western Association of Schools and Colleges"
  );
  await stanfordTx.wait();
  console.log("Stanford University registered");

  // University of Cambridge
  const cambridgeTx = await contract.registerUniversity(
    "University of Cambridge",
    "United Kingdom",
    "Quality Assurance Agency for Higher Education"
  );
  await cambridgeTx.wait();
  console.log("University of Cambridge registered");

  console.log("Initialization complete!");
  console.log("Contract Address:", contractAddress);
  console.log("Admin Address:", adminAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

