import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useZamaInstance } from './useZamaInstance';
import { useFHEEncryption } from './useFHEEncryption';
import { useGetDiplomaEncryptedData, useGetTranscriptEncryptedData, useGetStudentDiplomas, useGetDiplomaPublicData } from './useContract';

export interface DecryptedDiploma {
  diplomaId: number;
  studentId: number;
  graduationYear: number;
  gpa: number;
  degreeType: number;
  isVerified: boolean;
  isActive: boolean;
  universityName: string;
  degreeName: string;
  major: string;
  student: string;
  university: string;
  issueDate: number;
  expiryDate: number;
  ipfsHash: string;
}

export interface DecryptedTranscript {
  transcriptId: number;
  studentId: number;
  totalCredits: number;
  completedCredits: number;
  gpa: number;
  isVerified: boolean;
  isActive: boolean;
  universityName: string;
  student: string;
  university: string;
  issueDate: number;
  ipfsHash: string;
}

export const useDiplomaManagement = () => {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const { decryptData } = useFHEEncryption();
  
  const [diplomas, setDiplomas] = useState<DecryptedDiploma[]>([]);
  const [transcripts, setTranscripts] = useState<DecryptedTranscript[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get student diploma IDs from contract
  const { data: diplomaIds, isLoading: isLoadingDiplomaIds, error: diplomaIdsError } = useGetStudentDiplomas(address);

  // For now, we'll create a simple mapping of diploma data
  // Get diploma public data from contract
  const getDiplomaPublicData = async (diplomaId: number) => {
    try {
      console.log(`🔍 Getting public data for diploma ${diplomaId} from contract...`);
      
      // Import required modules for contract interaction
      const { createPublicClient, http } = await import('viem');
      const { sepolia } = await import('viem/chains');
      
      // Get contract address from environment variables
      const contractAddress = import.meta.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS;
      
      if (!contractAddress) {
        console.error('❌ Contract address not configured. Please set VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS in environment variables.');
        return null;
      }
      
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http('https://1rpc.io/sepolia')
      });
      
      const result = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            "inputs": [{"name": "_diplomaId", "type": "uint256"}],
            "name": "getDiplomaPublicData",
            "outputs": [
              {"name": "diplomaId", "type": "uint256"},
              {"name": "studentId", "type": "string"},
              {"name": "universityName", "type": "string"},
              {"name": "degreeName", "type": "string"},
              {"name": "major", "type": "string"},
              {"name": "ipfsHash", "type": "string"},
              {"name": "studentAddress", "type": "address"},
              {"name": "issueDate", "type": "uint256"},
              {"name": "isVerified", "type": "bool"}
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: 'getDiplomaPublicData',
        args: [BigInt(diplomaId)]
      });
      
      console.log(`📊 Real contract data for diploma ${diplomaId}:`, result);
      return result;
    } catch (error) {
      console.log(`No diploma found with ID ${diplomaId}:`, error.message);
      return null;
    }
  };

  const loadUserCredentials = useCallback(async () => {
    console.log('🔍 loadUserCredentials called with:', {
      instance: !!instance,
      address,
      isLoadingDiplomaIds,
      diplomaIds,
      diplomaIdsError
    });

    if (!instance || !address) {
      console.log('❌ Missing instance or address');
      setError('Wallet not connected or FHE not initialized');
      return;
    }

    if (isLoadingDiplomaIds) {
      console.log('⏳ Still loading diploma IDs, waiting...');
      return; // Wait for diploma IDs to load
    }

    if (diplomaIdsError) {
      console.error('❌ Diploma IDs error:', diplomaIdsError);
      setError(`Failed to load diploma IDs: ${diplomaIdsError.message || diplomaIdsError}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const decryptedDiplomas: DecryptedDiploma[] = [];
      const decryptedTranscripts: DecryptedTranscript[] = [];

      console.log('Loading credentials for address:', address);
      console.log('Diploma IDs from contract:', diplomaIds);
      
      if (diplomaIds && diplomaIds.length > 0) {
        console.log('📚 Processing diploma IDs:', diplomaIds);
        
        // For each diploma ID, get the public data from contract
        for (let i = 0; i < diplomaIds.length; i++) {
          const diplomaId = Number(diplomaIds[i]);
          console.log(`📖 Loading diploma ${diplomaId} data...`);
          
          // Get public data from contract
          const publicData = await getDiplomaPublicData(diplomaId);
          console.log(`📊 Public data for diploma ${diplomaId}:`, publicData);
          
          if (publicData) {
            // Try to decrypt encrypted data for the student
            let decryptedGpa = 0;
            let decryptedGraduationYear = 0;
            let decryptedDegreeType = 0;
            
            // Try to decrypt encrypted data for the student
            try {
              if (instance && address) {
                console.log(`🔓 Attempting to decrypt diploma ${diplomaId} data...`);
                
                // Get encrypted data from contract
                const { createPublicClient, http } = await import('viem');
                const { sepolia } = await import('viem/chains');
                const contractAddress = import.meta.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS;
                
                if (!contractAddress) {
                  console.error('❌ Contract address not configured for encrypted data fetch.');
                  return;
                }
                
                const publicClient = createPublicClient({
                  chain: sepolia,
                  transport: http('https://1rpc.io/sepolia')
                });
                
                const encryptedData = await publicClient.readContract({
                  address: contractAddress as `0x${string}`,
                  abi: [
                    {
                      "inputs": [{"name": "_diplomaId", "type": "uint256"}],
                      "name": "getDiplomaEncryptedData",
                      "outputs": [
                        {"name": "encryptedGpa", "type": "bytes32"},
                        {"name": "encryptedGraduationYear", "type": "bytes32"},
                        {"name": "encryptedDegreeType", "type": "bytes32"}
                      ],
                      "stateMutability": "view",
                      "type": "function"
                    }
                  ],
                  functionName: 'getDiplomaEncryptedData',
                  args: [BigInt(diplomaId)]
                });
                
                console.log(`🔐 Encrypted data for diploma ${diplomaId}:`, encryptedData);
                
                // Note: FHE decryption requires specific permissions
                // For now, we'll use placeholder values since students can't decrypt their own data
                // In a real implementation, this would require proper FHE key management
                console.log(`🔐 FHE decryption requires proper key management - using placeholder values`);
              }
            } catch (decryptError) {
              console.warn(`⚠️ Could not decrypt diploma ${diplomaId} data:`, decryptError);
              // Continue with default values if decryption fails
            }
            
            decryptedDiplomas.push({
              diplomaId,
              studentId: publicData.studentId,
              graduationYear: decryptedGraduationYear,
              gpa: decryptedGpa,
              degreeType: decryptedDegreeType,
              isVerified: publicData.isVerified,
              isActive: true,
              universityName: publicData.universityName,
              degreeName: publicData.degreeName,
              major: publicData.major,
              student: publicData.studentAddress,
              university: `0x${'0'.repeat(40)}`,
              issueDate: Number(publicData.issueDate),
              expiryDate: Number(publicData.issueDate) + (365 * 24 * 60 * 60), // 1 year from issue date
              ipfsHash: publicData.ipfsHash,
            });
          }
        }
      }
      
      setDiplomas(decryptedDiplomas);
      setTranscripts(decryptedTranscripts);
    } catch (err) {
      console.error('Failed to load credentials:', err);
      setError('Failed to load credentials');
    } finally {
      setIsLoading(false);
    }
  }, [instance, address, diplomaIds, isLoadingDiplomaIds, diplomaIdsError]);

  const createDiploma = async (diplomaData: {
    studentId: number;
    graduationYear: number;
    gpa: number;
    degreeType: number;
    universityName: string;
    degreeName: string;
    major: string;
    ipfsHash: string;
  }) => {
    if (!instance || !address) {
      throw new Error('Wallet not connected or FHE not initialized');
    }

    try {
      // In a real implementation, this would:
      // 1. Encrypt the sensitive data using FHE
      // 2. Call the contract's issueDiploma function
      // 3. Return the transaction hash
      
      console.log('Creating diploma with encrypted data:', diplomaData);
      
      // Simulate encryption process
      const encryptedData = {
        studentId: await instance.encrypt(diplomaData.studentId),
        graduationYear: await instance.encrypt(diplomaData.graduationYear),
        gpa: await instance.encrypt(diplomaData.gpa),
        degreeType: await instance.encrypt(diplomaData.degreeType),
        isVerified: await instance.encrypt(true),
        isActive: await instance.encrypt(true),
      };

      console.log('Encrypted data created:', encryptedData);
      
      // In real implementation, call contract here
      // const tx = await contract.issueDiploma(encryptedData, ...);
      
      return '0x1234567890abcdef'; // Mock transaction hash
    } catch (err) {
      console.error('Failed to create diploma:', err);
      throw new Error('Failed to create diploma');
    }
  };

  const verifyCredential = async (credentialId: number, isDiploma: boolean) => {
    if (!instance || !address) {
      throw new Error('Wallet not connected or FHE not initialized');
    }

    try {
      // In a real implementation, this would:
      // 1. Create a verification request with encrypted data
      // 2. Call the contract's requestVerification function
      // 3. Return the transaction hash
      
      console.log('Verifying credential:', { credentialId, isDiploma });
      
      // Simulate verification process
      const verificationData = {
        credentialId: await instance.encrypt(credentialId),
        isDiploma: await instance.encrypt(isDiploma),
        requester: address,
      };

      console.log('Verification request created:', verificationData);
      
      // In real implementation, call contract here
      // const tx = await contract.requestVerification(verificationData);
      
      return '0xabcdef1234567890'; // Mock transaction hash
    } catch (err) {
      console.error('Failed to verify credential:', err);
      throw new Error('Failed to verify credential');
    }
  };

  useEffect(() => {
    if (instance && address && !isLoadingDiplomaIds) {
      loadUserCredentials();
    }
  }, [loadUserCredentials, instance, address, isLoadingDiplomaIds]);

  return {
    diplomas,
    transcripts,
    isLoading,
    error,
    createDiploma,
    verifyCredential,
    loadUserCredentials,
  };
};

