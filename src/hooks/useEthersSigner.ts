import { useAccount, useSignMessage } from 'wagmi';

export function useEthersSigner() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  return {
    address,
    isConnected,
    signMessageAsync,
  };
}
