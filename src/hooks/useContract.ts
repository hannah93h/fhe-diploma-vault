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
    "inputs": [],
    "name": "getAllUniversities",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_universityId",
        "type": "uint256"
      }
    ],
    "name": "getUniversityInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "universityId",
        "type": "uint256"
      },
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
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "registrationDate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_diplomaId",
        "type": "uint256"
      }
    ],
    "name": "getDiplomaEncryptedData",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "encryptedGpa",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "encryptedGraduationYear",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "encryptedDegreeType",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_transcriptId",
        "type": "uint256"
      }
    ],
    "name": "getTranscriptEncryptedData",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "encryptedGpa",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "encryptedGraduationYear",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "encryptedDegreeType",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_student",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_university",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_degreeName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_major",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_studentId",
        "type": "string"
      },
      {
        "internalType": "uint32",
        "name": "_graduationYear",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "_gpa",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "_degreeType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "_expiryDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "_inputProof",
        "type": "bytes"
      }
    ],
    "name": "adminCreateDiploma",
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
        "internalType": "string",
        "name": "_studentId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_universityName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_degreeName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_major",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "_encryptedGpa",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_encryptedGraduationYear",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_encryptedDegreeType",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_inputProof",
        "type": "bytes"
      }
    ],
    "name": "createDiploma",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
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

export const useGetAllUniversities = () => {
  const { contractAddress, abi } = useFHEDiplomaVault();

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getAllUniversities',
    query: {
      enabled: !!contractAddress,
    },
  });
};

export const useGetUniversityInfo = (universityId: bigint) => {
  const { contractAddress, abi } = useFHEDiplomaVault();

  return useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getUniversityInfo',
    args: [universityId],
    query: {
      enabled: !!contractAddress && !!universityId,
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

export const useCreateDiploma = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createDiploma = async (
    contractAddress: `0x${string}`,
    studentId: string,
    universityName: string,
    degreeName: string,
    major: string,
    ipfsHash: string,
    encryptedGpa: `0x${string}`,
    encryptedGraduationYear: `0x${string}`,
    encryptedDegreeType: `0x${string}`,
    inputProof: `0x${string}`
  ) => {
    if (!contractAddress) {
      throw new Error('Contract address is required');
    }

    return writeContractAsync({
      address: contractAddress,
      abi: FHEDiplomaVaultABI,
      functionName: 'createDiploma',
      args: [
        studentId,
        universityName,
        degreeName,
        major,
        ipfsHash,
        encryptedGpa,
        encryptedGraduationYear,
        encryptedDegreeType,
        inputProof
      ],
    });
  };

  return {
    createDiploma,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};
