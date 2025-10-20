import hre from 'hardhat';

async function main() {
  const contractAddress = process.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error('Contract address not found in environment variables');
    return;
  }
  
  console.log('Setting university admin...');
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
    
    if (!isAdmin) {
      console.error('Current signer is not an admin. Cannot add university admin.');
      return;
    }
    
    // Check if already university admin
    const isUniversityAdmin = await contract.isUniversityAdmin(signerAddress);
    console.log('Is university admin:', isUniversityAdmin);
    
    if (isUniversityAdmin) {
      console.log('Already a university admin');
      return;
    }
    
    // Add as university admin
    console.log('Adding as university admin...');
    const tx = await contract.addUniversityAdmin(signerAddress);
    console.log('Transaction hash:', tx.hash);
    
    await tx.wait();
    console.log('Successfully added as university admin');
    
    // Verify the change
    const isUniversityAdminAfter = await contract.isUniversityAdmin(signerAddress);
    console.log('Is university admin after:', isUniversityAdminAfter);
    
  } catch (error) {
    console.error('Error setting university admin:', error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
