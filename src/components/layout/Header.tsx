import React from 'react';
import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const navigation = [
    { name: 'Home', href: '/', path: '/' },
    { name: 'Verification', href: '/verification', path: '/verification' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="sm" showText={false} className="text-white" />
            <span className="ml-2 text-white font-bold text-lg drop-shadow-2xl shadow-black/50">FHE Diploma Vault</span>
          </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-white hover:text-yellow-300 transition-colors duration-200 font-semibold drop-shadow-xl shadow-black/50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

          {/* Wallet Connect Button */}
          <div className="hidden md:block">
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
                            onClick={openConnectModal}
                            variant="outline"
                            className="border-white/70 text-white hover:bg-white/30 hover:text-yellow-300 font-semibold drop-shadow-xl shadow-black/50 bg-black/20"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            className="border-red-300 text-red-300 hover:bg-red-500/10"
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <Button
                          onClick={openAccountModal}
                          variant="outline"
                          className="border-white/70 text-white hover:bg-white/30 hover:text-yellow-300 font-semibold drop-shadow-xl shadow-black/50 bg-black/20"
                        >
                          {account.displayName}
                        </Button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile menu button - Removed */}
        </div>

        {/* Mobile Navigation - Removed */}
      </div>
    </header>
  );
};

export default Header;
