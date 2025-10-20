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

  const loadUserCredentials = useCallback(async () => {
    if (!instance || !address) {
      setError('Wallet not connected or FHE not initialized');
      return;
    }

    if (isLoadingDiplomaIds) {
      return; // Wait for diploma IDs to load
    }

    if (diplomaIdsError) {
      setError('Failed to load diploma IDs');
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
        // For each diploma ID, we would need to:
        // 1. Get the public data (university, degree, etc.)
        // 2. Get the encrypted data (GPA, graduation year, etc.)
        // 3. Decrypt the encrypted data
        // For now, we'll create mock data based on the diploma IDs
        for (let i = 0; i < diplomaIds.length; i++) {
          const diplomaId = Number(diplomaIds[i]);
          decryptedDiplomas.push({
            diplomaId,
            studentId: 12345 + i,
            graduationYear: 2020 + i,
            gpa: 3.5 + (i * 0.1),
            degreeType: i % 3 + 1, // 1=Bachelor, 2=Master, 3=PhD
            isVerified: true,
            isActive: true,
            universityName: `University ${i + 1}`,
            degreeName: `Degree ${i + 1}`,
            major: `Major ${i + 1}`,
            student: address,
            university: `0x${'0'.repeat(40)}`,
            issueDate: Date.now(),
            expiryDate: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year from now
            ipfsHash: `QmHash${i + 1}`,
          });
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

