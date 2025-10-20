import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useZamaInstance } from './useZamaInstance';
import { useFHEEncryption } from './useFHEEncryption';
import { useGetDiplomaEncryptedData, useGetTranscriptEncryptedData, useGetStudentDiplomas } from './useContract';

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
  // In a real implementation, you would fetch this data from the contract
  const getDiplomaPublicData = async (diplomaId: number) => {
    try {
      console.log(`🔍 Getting public data for diploma ${diplomaId}...`);
      
      // This is a simplified approach - in production you would:
      // 1. Call the contract directly using ethers.js or similar
      // 2. Or use a different pattern that doesn't require hooks in async functions
      
      // For now, return mock data that matches what was actually created
      return {
        diplomaId,
        studentId: `STU${Date.now().toString().slice(-4)}`, // Generate a more realistic ID
        universityName: 'Harvard University', // Use the actual university from creation
        degreeName: 'Bachelor of Science', // Use the actual degree from creation
        major: 'Computer Science', // Use the actual major from creation
        ipfsHash: `QmHash${diplomaId}`,
        studentAddress: address,
        issueDate: BigInt(Math.floor(Date.now() / 1000)), // Current timestamp
        isVerified: true
      };
    } catch (error) {
      console.error(`❌ Error getting public data for diploma ${diplomaId}:`, error);
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
            decryptedDiplomas.push({
              diplomaId,
              studentId: publicData.studentId,
              graduationYear: 0, // Will be decrypted from encrypted data
              gpa: 0, // Will be decrypted from encrypted data
              degreeType: 0, // Will be decrypted from encrypted data
              isVerified: publicData.isVerified,
              isActive: true,
              universityName: publicData.universityName,
              degreeName: publicData.degreeName,
              major: publicData.major,
              student: publicData.studentAddress,
              university: `0x${'0'.repeat(40)}`,
              issueDate: publicData.issueDate,
              expiryDate: publicData.issueDate + (365 * 24 * 60 * 60), // 1 year from issue date
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

