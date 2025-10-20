import { sepolia } from 'wagmi/chains';

export const CONTRACT_ADDRESSES = {
  [sepolia.id]: {
    FHEDiplomaVault: '0x3dEe389B72d2feed20BF0b0f07385dCBb35D25e5',
  },
} as const;

export const SUPPORTED_CHAINS = [sepolia] as const;
