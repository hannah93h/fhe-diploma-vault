# FHE Diploma Vault

A secure blockchain-based platform for managing and verifying educational credentials using Fully Homomorphic Encryption (FHE).

## Project Overview

FHE Diploma Vault is a decentralized application that allows universities to issue diplomas and transcripts on-chain in encrypted form, while maintaining privacy through FHE technology. Employers and institutions can verify credentials without exposing sensitive information.

## Features

- **Secure Credential Storage**: Diplomas and transcripts stored on-chain with FHE encryption
- **Privacy-Preserving Verification**: Verify credentials without revealing sensitive data
- **University Dashboard**: Issue and manage educational credentials
- **Employer Verification**: Verify candidate credentials securely
- **Blockchain Integration**: Built on Ethereum with FHE support

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Ethereum, FHE (Fully Homomorphic Encryption)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hannah93h/fhe-diploma-vault.git
cd fhe-diploma-vault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

**Security Note**: Replace the placeholder values with your actual API keys and project IDs. Never commit sensitive credentials to version control.

## Smart Contracts

The project includes FHE-enabled smart contracts for:
- Credential issuance and storage
- Privacy-preserving verification
- Reputation management
- Access control

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.