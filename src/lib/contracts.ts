import { sepolia } from 'wagmi/chains';

export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    FHEDiplomaVault: import.meta.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS || '0x38BE817Bfc574E5b2fDeeC3f303ff9fe9c032425',
  },
} as const;

export const SUPPORTED_CHAINS = [sepolia] as const;
