import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { useChainId } from 'wagmi';

// Contract ABI - This would be generated from the Solidity contract
export const FHEDiplomaVaultABI = [
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
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_student",
        "type": "address"
      }
    ],
    "name": "getStudentDiplomas",
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
        "name": "_diplomaId",
        "type": "uint256"
      }
    ],
    "name": "getDiplomaPublicData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "diplomaId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "studentId",
        "type": "string"
      },
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
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
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
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
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
        "name": "_admin",
        "type": "address"
      }
    ],
    "name": "isUniversityAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
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

  console.log('🔍 useFHEDiplomaVault:', {
    chainId,
    contractAddress,
    availableChains: Object.keys(CONTRACT_ADDRESSES)
  });

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
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'registerUniversity',
      args: [name, country, accreditation],
    } as any);
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

export const useGetStudentDiplomas = (studentAddress: `0x${string}` | undefined) => {
  const { contractAddress } = useFHEDiplomaVault();
  
  console.log('🔍 useGetStudentDiplomas called with:', {
    studentAddress,
    contractAddress,
    enabled: !!contractAddress && !!studentAddress
  });
  
  const result = useReadContract({
    address: contractAddress,
    abi: FHEDiplomaVaultABI,
    functionName: 'getStudentDiplomas',
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!studentAddress,
    },
  });

  console.log('📊 useGetStudentDiplomas result:', {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error
  });

  return result;
};

export const useGetDiplomaPublicData = (diplomaId: bigint | undefined) => {
  const { contractAddress } = useFHEDiplomaVault();
  
  return useReadContract({
    address: contractAddress,
    abi: FHEDiplomaVaultABI,
    functionName: 'getDiplomaPublicData',
    args: diplomaId ? [diplomaId] : undefined,
    query: {
      enabled: !!contractAddress && !!diplomaId,
    },
  });
};

export const useGetDiplomaEncryptedData = (diplomaId: bigint | undefined) => {
  const { contractAddress } = useFHEDiplomaVault();
  
  return useReadContract({
    address: contractAddress,
    abi: FHEDiplomaVaultABI,
    functionName: 'getDiplomaEncryptedData',
    args: diplomaId ? [diplomaId] : undefined,
    query: {
      enabled: !!contractAddress && !!diplomaId,
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
      address: contractAddress as `0x${string}`,
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
    } as any);
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

// Hook to check if user is admin
export const useIsAdmin = () => {
  const { address } = useAccount();
  const contractAddress = CONTRACT_ADDRESSES[11155111]?.FHEDiplomaVault;
  
  console.log('🔍 useIsAdmin debug:', {
    address,
    contractAddress,
    chainId: 11155111
  });
  
  const { data, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: FHEDiplomaVaultABI,
    functionName: 'isAdmin',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  console.log('🔍 useIsAdmin result:', { data, isLoading, error });

  return {
    isAdmin: data || false,
    isLoading,
    error
  };
};

// Hook to check if user is university admin
export const useIsUniversityAdmin = () => {
  const { address } = useAccount();
  const contractAddress = CONTRACT_ADDRESSES[11155111]?.FHEDiplomaVault;
  
  console.log('🔍 useIsUniversityAdmin debug:', {
    address,
    contractAddress,
    chainId: 11155111
  });
  
  const { data, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: FHEDiplomaVaultABI,
    functionName: 'isUniversityAdmin',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  console.log('🔍 useIsUniversityAdmin result:', { data, isLoading, error });

  return {
    isUniversityAdmin: data || false,
    isLoading,
    error
  };
};
