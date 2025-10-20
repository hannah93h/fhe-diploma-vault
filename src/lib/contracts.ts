import { sepolia } from 'wagmi/chains';

export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    FHEDiplomaVault: import.meta.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || '0x2766111e6825D84147B75b10C32CC3F25342086E',
  },
} as const;

export const SUPPORTED_CHAINS = [sepolia] as const;
