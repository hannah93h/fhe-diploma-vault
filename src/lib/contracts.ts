import { sepolia } from 'wagmi/chains';

export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    FHEDiplomaVault: '0x90E6FEba3449DEc0CD818900BBfe2592408e268D',
  },
} as const;

export const SUPPORTED_CHAINS = [sepolia] as const;
