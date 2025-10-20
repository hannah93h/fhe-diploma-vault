import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Checking contract status...");

  // Connect to the deployed contract
  const contractAddress = "0x2766111e6825D84147B75b10C32CC3F25342086E";
  const FHEDiplomaVault = await ethers.getContractFactory("FHEDiplomaVault");
  const contract = FHEDiplomaVault.attach(contractAddress);
  
  console.log("Connected to contract at:", contractAddress);

  // Check admin status
  const [signer] = await ethers.getSigners();
  console.log("Current signer:", await signer.getAddress());
  
  const isAdmin = await contract.isAdmin(await signer.getAddress());
  console.log("Is admin:", isAdmin);
  
  const isUniversityAdmin = await contract.isUniversityAdmin(await signer.getAddress());
  console.log("Is university admin:", isUniversityAdmin);
  
  // Check university counter
  const universityCounter = await contract.universityCounter();
  console.log("University counter:", universityCounter.toString());
  
  // Get all universities
  const allUniversities = await contract.getAllUniversities();
  console.log("All universities:", allUniversities);
  
  // Get university info for each
  for (let i = 0; i < allUniversities.length; i++) {
    const universityInfo = await contract.getUniversityInfo(i);
    console.log(`University ${i}:`, {
      id: universityInfo.id.toString(),
      name: universityInfo.name,
      country: universityInfo.country,
      admin: universityInfo.admin,
      isVerified: universityInfo.isVerified,
      isActive: universityInfo.isActive
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
