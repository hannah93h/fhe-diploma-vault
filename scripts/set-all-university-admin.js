import hre from 'hardhat';

async function main() {
  const contractAddress = process.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
  const targetAddress = '0x1c7ef492e796a6e0dd3521a299a0836b26d5e73c';
  
  if (!contractAddress) {
    console.error('Contract address not found in environment variables');
    return;
  }
  
  console.log('Setting university admin for all schools...');
  console.log('Contract address:', contractAddress);
  console.log('Target address:', targetAddress);
  
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
    
    // Check if target address is already university admin
    const isUniversityAdmin = await contract.isUniversityAdmin(targetAddress);
    console.log('Target is university admin:', isUniversityAdmin);
    
    if (isUniversityAdmin) {
      console.log('Target address is already a university admin');
    } else {
      // Add as university admin
      console.log('Adding target address as university admin...');
      const tx = await contract.addUniversityAdmin(targetAddress);
      console.log('Transaction hash:', tx.hash);
      
      await tx.wait();
      console.log('Successfully added target address as university admin');
    }
    
    // Verify the change
    const isUniversityAdminAfter = await contract.isUniversityAdmin(targetAddress);
    console.log('Target is university admin after:', isUniversityAdminAfter);
    
    // Also check if target is a regular admin
    const isTargetAdmin = await contract.isAdmin(targetAddress);
    console.log('Target is admin:', isTargetAdmin);
    
    if (!isTargetAdmin) {
      console.log('Adding target address as regular admin...');
      const tx2 = await contract.addAdmin(targetAddress);
      console.log('Admin transaction hash:', tx2.hash);
      
      await tx2.wait();
      console.log('Successfully added target address as admin');
      
      // Verify admin status
      const isTargetAdminAfter = await contract.isAdmin(targetAddress);
      console.log('Target is admin after:', isTargetAdminAfter);
    }
    
  } catch (error) {
    console.error('Error setting university admin:', error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
