import hre from 'hardhat';

async function main() {
  const contractAddress = process.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error('Contract address not found in environment variables');
    return;
  }
  
  console.log('Checking user permissions...');
  console.log('Contract address:', contractAddress);
  
  const contract = await hre.ethers.getContractAt('FHEDiplomaVault', contractAddress);
  
  // Get the current signer
  const [signer] = await hre.ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  console.log('Current signer:', signerAddress);
  
  try {
    // Check if signer is admin
    const isAdmin = await contract.isAdmin(signerAddress);
    console.log('Is admin:', isAdmin);
    
    // Check if signer is university admin
    const isUniversityAdmin = await contract.isUniversityAdmin(signerAddress);
    console.log('Is university admin:', isUniversityAdmin);
    
    // Check diploma counter
    const diplomaCounter = await contract.diplomaCounter();
    console.log('Diploma counter:', diplomaCounter.toString());
    
    // Check if there are any diplomas
    if (diplomaCounter > 0) {
      console.log('Checking first diploma...');
      try {
        const diplomaData = await contract.getDiplomaPublicData(0);
        console.log('First diploma data:', diplomaData);
      } catch (error) {
        console.log('Error getting first diploma:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error checking permissions:', error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
