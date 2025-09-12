import { sepolia } from 'wagmi/chains';

export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    FHEDiplomaVault: import.meta.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  },
} as const;

export const SUPPORTED_CHAINS = [sepolia] as const;
