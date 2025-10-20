import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { useChainId } from 'wagmi';

// Contract ABI - This would be generated from the Solidity contract
const FHEDiplomaVaultABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_country",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_accreditation",
        "type": "string"
      }
    ],
    "name": "registerUniversity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "diplomaId",
        "type": "uint256"
      }
    ],
    "name": "getDiplomaInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "universityName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "degreeName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "major",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "university",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expiryDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "transcriptId",
        "type": "uint256"
      }
    ],
    "name": "getTranscriptInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "universityName",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "university",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "universityAddress",
        "type": "address"
      }
    ],
    "name": "getUniversityInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "country",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "accreditation",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "admin",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "registrationDate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const useFHEDiplomaVault = () => {
  const chainId = useChainId();
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.FHEDiplomaVault;

  return {
    contractAddress,
    abi: FHEDiplomaVaultABI,
  };
};

export const useRegisterUniversity = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const registerUniversity = async (name: string, country: string, accreditation: string) => {
    const { contractAddress, abi } = useFHEDiplomaVault();
    
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }

    return writeContractAsync({
      address: contractAddress,
      abi,
      functionName: 'registerUniversity',
      args: [name, country, accreditation],
    });
  };

  return {
    registerUniversity,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};

export const useGetDiplomaInfo = (diplomaId: bigint) => {
  const { contractAddress, abi } = useFHEDiplomaVault();

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getDiplomaInfo',
    args: [diplomaId],
    query: {
      enabled: !!contractAddress && !!diplomaId,
    },
  });
};

export const useGetTranscriptInfo = (transcriptId: bigint) => {
  const { contractAddress, abi } = useFHEDiplomaVault();

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getTranscriptInfo',
    args: [transcriptId],
    query: {
      enabled: !!contractAddress && !!transcriptId,
    },
  });
};

export const useGetUniversityInfo = (universityAddress: `0x${string}`) => {
  const { contractAddress, abi } = useFHEDiplomaVault();

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getUniversityInfo',
    args: [universityAddress],
    query: {
      enabled: !!contractAddress && !!universityAddress,
    },
  });
};

export const useGetDiplomaEncryptedData = (diplomaId: bigint) => {
  const { contractAddress, abi } = useFHEDiplomaVault();

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getDiplomaEncryptedData',
    args: [diplomaId],
    query: {
      enabled: !!contractAddress && !!diplomaId,
    },
  });
};

export const useGetTranscriptEncryptedData = (transcriptId: bigint) => {
  const { contractAddress, abi } = useFHEDiplomaVault();

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getTranscriptEncryptedData',
    args: [transcriptId],
    query: {
      enabled: !!contractAddress && !!transcriptId,
    },
  });
};

export const useAdminCreateDiploma = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const adminCreateDiploma = async (
    student: `0x${string}`,
    university: `0x${string}`,
    degreeName: string,
    major: string,
    studentId: any,
    graduationYear: any,
    gpa: any,
    degreeType: any,
    expiryDate: bigint,
    ipfsHash: string,
    inputProof: `0x${string}`
  ) => {
    const { contractAddress, abi } = useFHEDiplomaVault();
    
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }

    return writeContractAsync({
      address: contractAddress,
      abi,
      functionName: 'adminCreateDiploma',
      args: [
        student,
        university,
        degreeName,
        major,
        studentId,
        graduationYear,
        gpa,
        degreeType,
        expiryDate,
        ipfsHash,
        inputProof
      ],
    });
  };

  return {
    adminCreateDiploma,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};
