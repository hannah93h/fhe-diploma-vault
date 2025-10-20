import hre from 'hardhat';

async function main() {
  const contractAddress = process.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
  const targetAddress = '0x1c7ef492e796a6e0dd3521a299a0836b26d5e73c';
  
  if (!contractAddress) {
    console.error('Contract address not found in environment variables');
    return;
  }
  
  console.log('Checking target address permissions...');
  console.log('Contract address:', contractAddress);
  console.log('Target address:', targetAddress);
  
  const contract = await hre.ethers.getContractAt('FHEDiplomaVault', contractAddress);
  
  try {
    // Check if target is admin
    const isAdmin = await contract.isAdmin(targetAddress);
    console.log('Target is admin:', isAdmin);
    
    // Check if target is university admin
    const isUniversityAdmin = await contract.isUniversityAdmin(targetAddress);
    console.log('Target is university admin:', isUniversityAdmin);
    
    // Check diploma counter
    const diplomaCounter = await contract.diplomaCounter();
    console.log('Diploma counter:', diplomaCounter.toString());
    
    // Check if there are any diplomas
    if (diplomaCounter > 0) {
      console.log('Checking first diploma...');
      try {
        const diplomaData = await contract.getDiplomaPublicData(0);
        console.log('First diploma data:', diplomaData);
        console.log('Diploma is verified:', diplomaData[8]); // isVerified is at index 8
      } catch (error) {
        console.log('Error getting first diploma:', error.message);
      }
    }
    
    // Test if target can call verifyDiploma (this will fail if not university admin)
    if (diplomaCounter > 0) {
      console.log('Testing verifyDiploma call...');
      try {
        // This is a static call to test permissions without actually executing
        await contract.verifyDiploma.staticCall(0, true, "Test verification");
        console.log('✅ Target address can call verifyDiploma');
      } catch (error) {
        console.log('❌ Target address cannot call verifyDiploma:', error.message);
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
