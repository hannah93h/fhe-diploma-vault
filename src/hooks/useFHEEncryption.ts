import { useState, useCallback } from 'react';
import { useZamaInstance } from './useZamaInstance';
import { useAccount } from 'wagmi';
import { useFHEDiplomaVault } from './useContract';

export interface DiplomaData {
  studentId: number;
  graduationYear: number;
  gpa: number;
  degreeType: number; // 1=Bachelor, 2=Master, 3=PhD
}

export interface TranscriptData {
  studentId: number;
  totalCredits: number;
  completedCredits: number;
  gpa: number;
}

export function useFHEEncryption() {
  const { instance } = useZamaInstance();
  const { address } = useAccount();
  const { contractAddress } = useFHEDiplomaVault();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const encryptDiplomaData = useCallback(async (data: DiplomaData) => {
    if (!instance || !address || !contractAddress) {
      throw new Error('Missing wallet or encryption service');
    }

    setIsEncrypting(true);
    try {
      const input = instance.createEncryptedInput(contractAddress, address);
      input.add32(data.studentId);
      input.add32(data.graduationYear);
      input.add32(data.gpa);
      input.add8(data.degreeType);

      const encryptedInput = await input.encrypt();

      return {
        handles: encryptedInput.handles,
        inputProof: encryptedInput.inputProof
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  }, [instance, address, contractAddress]);

  const encryptTranscriptData = useCallback(async (data: TranscriptData) => {
    if (!instance || !address || !contractAddress) {
      throw new Error('Missing wallet or encryption service');
    }

    setIsEncrypting(true);
    try {
      const input = instance.createEncryptedInput(contractAddress, address);
      input.add32(data.studentId);
      input.add32(data.totalCredits);
      input.add32(data.completedCredits);
      input.add32(data.gpa);

      const encryptedInput = await input.encrypt();

      return {
        handles: encryptedInput.handles,
        inputProof: encryptedInput.inputProof
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  }, [instance, address, contractAddress]);

  const decryptDiplomaData = useCallback(async (diplomaId: number) => {
    if (!instance || !address || !contractAddress) {
      throw new Error('Missing wallet or encryption service');
    }

    setIsDecrypting(true);
    try {
      // This would need to be implemented to get encrypted data from contract
      // and then decrypt it using the FHE instance
      const handleContractPairs = [
        { handle: '0x...', contractAddress }, // This would be the actual encrypted data
      ];

      const result = await instance.userDecrypt(handleContractPairs);
      
      return {
        studentId: result[0],
        graduationYear: result[1],
        gpa: result[2],
        degreeType: result[3],
        isVerified: result[4],
        isActive: result[5]
      };
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    } finally {
      setIsDecrypting(false);
    }
  }, [instance, address, contractAddress]);

  const decryptTranscriptData = useCallback(async (transcriptId: number) => {
    if (!instance || !address || !contractAddress) {
      throw new Error('Missing wallet or encryption service');
    }

    setIsDecrypting(true);
    try {
      // This would need to be implemented to get encrypted data from contract
      // and then decrypt it using the FHE instance
      const handleContractPairs = [
        { handle: '0x...', contractAddress }, // This would be the actual encrypted data
      ];

      const result = await instance.userDecrypt(handleContractPairs);
      
      return {
        studentId: result[0],
        totalCredits: result[1],
        completedCredits: result[2],
        gpa: result[3],
        isVerified: result[4],
        isActive: result[5]
      };
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    } finally {
      setIsDecrypting(false);
    }
  }, [instance, address, contractAddress]);

  return {
    encryptDiplomaData,
    encryptTranscriptData,
    decryptDiplomaData,
    decryptTranscriptData,
    isEncrypting,
    isDecrypting
  };
}
