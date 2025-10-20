import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Initializing FHE Diploma Vault...");

  // Connect to the already deployed contract
  const contractAddress = "0x337F0c42c8E12689ED509c7549c3a539A2C6a7eA";
  const FHEDiplomaVault = await ethers.getContractFactory("FHEDiplomaVault");
  const contract = FHEDiplomaVault.attach(contractAddress);
  
  console.log("Connected to contract at:", contractAddress);

  // Set admin address
  const adminAddress = "0x1C7EF492E796A6e0DD3521a299A0836B26D5E73C";
  
  // Add admin if not already added
  try {
    const isAdmin = await contract.isAdmin(adminAddress);
    if (!isAdmin) {
      console.log("Adding admin address...");
      const addAdminTx = await contract.addAdmin(adminAddress);
      await addAdminTx.wait();
      console.log("Admin address added");
    } else {
      console.log("Admin address already exists");
    }
  } catch (error) {
    console.log("Error adding admin:", error.message);
  }

  // Register universities using adminRegisterUniversity
  console.log("Registering universities...");
  
  try {
    // Harvard University
    const harvardTx = await contract.registerUniversity(
      "Harvard University",
      "United States",
      adminAddress
    );
    await harvardTx.wait();
    console.log("Harvard University registered");
  } catch (error) {
    console.log("Error registering Harvard:", error.message);
  }

  try {
    // MIT
    const mitTx = await contract.registerUniversity(
      "Massachusetts Institute of Technology",
      "United States",
      adminAddress
    );
    await mitTx.wait();
    console.log("MIT registered");
  } catch (error) {
    console.log("Error registering MIT:", error.message);
  }

  try {
    // Stanford University
    const stanfordTx = await contract.registerUniversity(
      "Stanford University",
      "United States",
      adminAddress
    );
    await stanfordTx.wait();
    console.log("Stanford University registered");
  } catch (error) {
    console.log("Error registering Stanford:", error.message);
  }

  try {
    // University of Cambridge
    const cambridgeTx = await contract.registerUniversity(
      "University of Cambridge",
      "United Kingdom",
      adminAddress
    );
    await cambridgeTx.wait();
    console.log("University of Cambridge registered");
  } catch (error) {
    console.log("Error registering Cambridge:", error.message);
  }

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