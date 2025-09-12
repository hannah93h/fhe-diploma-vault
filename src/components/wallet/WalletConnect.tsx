import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Wallet, Shield, GraduationCap } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const WalletConnect = () => {
  const { isConnected, address } = useAccount();

  return (
    <Card className="p-6 bg-gradient-to-br from-certificate-bg to-background border-certificate-border shadow-certificate">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-academic-navy to-primary rounded-full">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-sm">
            Securely access your encrypted educational credentials
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-academic-gold" />
            <span>FHE Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-academic-gold" />
            <span>Verified Credentials</span>
          </div>
        </div>
        
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button 
                        variant="wallet" 
                        size="lg" 
                        onClick={openConnectModal}
                        className="w-full"
                      >
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button 
                        variant="wallet" 
                        size="lg" 
                        onClick={openChainModal}
                        className="w-full"
                      >
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      <Button 
                        variant="wallet" 
                        size="lg" 
                        onClick={openAccountModal}
                        className="w-full"
                      >
                        {account.displayName}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Connected to {chain.name}
                      </p>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
        
        <p className="text-xs text-muted-foreground">
          Supported: MetaMask, WalletConnect, Coinbase Wallet
        </p>
      </div>
    </Card>
  );
};

export default WalletConnect;