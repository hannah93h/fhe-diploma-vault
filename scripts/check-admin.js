import hre from 'hardhat';

async function main() {
  const contractAddress = process.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
  const targetAddress = '0x1c7ef492e796a6e0dd3521a299a0836b26d5e73c';
  
  if (!contractAddress) {
    console.error('Contract address not found in environment variables');
    return;
  }
  
  console.log('Checking admin status for address:', targetAddress);
  console.log('Contract address:', contractAddress);
  
  const contract = await hre.ethers.getContractAt('FHEDiplomaVault', contractAddress);
  
  try {
    const isAdmin = await contract.isAdmin(targetAddress);
    const isUniversityAdmin = await contract.isUniversityAdmin(targetAddress);
    
    console.log('Is admin:', isAdmin);
    console.log('Is university admin:', isUniversityAdmin);
    
    if (!isAdmin) {
      console.log('Address is not an admin. Adding as admin...');
      const tx = await contract.addAdmin(targetAddress);
      await tx.wait();
      console.log('Admin added successfully');
    }
    
  } catch (error) {
    console.error('Error checking admin status:', error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
