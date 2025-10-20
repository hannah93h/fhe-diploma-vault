import { sepolia } from 'wagmi/chains';

export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    FHEDiplomaVault: import.meta.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || '0x337F0c42c8E12689ED509c7549c3a539A2C6a7eA',
  },
} as const;

export const SUPPORTED_CHAINS = [sepolia] as const;
