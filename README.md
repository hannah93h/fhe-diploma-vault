# FHE Diploma Vault - Secure Education Records

A blockchain-based platform for issuing and verifying educational credentials using Fully Homomorphic Encryption (FHE). This project enables universities to issue diplomas and transcripts on-chain in encrypted form, ensuring privacy while maintaining verifiability.

## 🔐 Core Features

- **FHE Encryption**: All sensitive data (GPA, student ID, graduation year) is encrypted using Fully Homomorphic Encryption
- **Privacy-Preserving Verification**: Employers can verify credentials without accessing sensitive student data
- **Blockchain Security**: All credentials are stored on-chain with cryptographic integrity
- **University Management**: Universities can register, issue credentials, and manage verification requests
- **Student Portal**: Students can view and manage their encrypted credentials

## 🛠️ Technical Implementation

### Smart Contract Features
- **FHE Data Types**: Uses `euint32`, `euint8`, `ebool` for encrypted data storage
- **ACL Permissions**: Proper access control for encrypted data decryption
- **University Registration**: Universities can register and be verified
- **Credential Issuance**: Issue diplomas and transcripts with encrypted sensitive data
- **Verification System**: Request and respond to credential verification

### Frontend Integration
- **FHE SDK Integration**: Uses `@zama-fhe/relayer-sdk` for client-side encryption
- **Wallet Integration**: MetaMask and other wallet support via Wagmi
- **Real-time Status**: Shows FHE initialization and encryption status
- **Responsive UI**: Modern, accessible interface for all users

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

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
cp env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

### Smart Contract Deployment

1. Set up your private key in `.env`:
```
PRIVATE_KEY=your_private_key_here
```

2. Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Update the contract address in your frontend configuration.

## 📋 Smart Contract Functions

### Core Functions
- `registerUniversity()`: Register a new university
- `issueDiploma()`: Issue a diploma with encrypted data
- `issueTranscript()`: Issue a transcript with encrypted data
- `requestVerification()`: Request credential verification
- `respondToVerification()`: Respond to verification requests

### Data Access Functions
- `getDiplomaInfo()`: Get public diploma information
- `getDiplomaEncryptedData()`: Get encrypted data for decryption
- `getTranscriptEncryptedData()`: Get encrypted transcript data
- `getVerificationRequestEncryptedData()`: Get encrypted verification data

## 🔒 FHE Encryption Details

### Encrypted Data Types
- **Student ID**: `euint32` - Encrypted student identifier
- **Graduation Year**: `euint32` - Encrypted graduation year
- **GPA**: `euint32` - Encrypted grade point average
- **Degree Type**: `euint8` - Encrypted degree type (1=Bachelor, 2=Master, 3=PhD)
- **Verification Status**: `ebool` - Encrypted verification status
- **Active Status**: `ebool` - Encrypted active status

### ACL Permissions
- **Contract Access**: `FHE.allowThis()` for contract operations
- **Student Access**: `FHE.allow()` for student data decryption
- **University Access**: `FHE.allow()` for university operations

## 🌐 Network Configuration

- **Network**: Sepolia Testnet
- **RPC URL**: https://1rpc.io/sepolia
- **Chain ID**: 11155111
- **FHE Network**: https://api.zama.ai/fhevm

## 📱 Frontend Features

### Student Portal
- View encrypted credentials
- Decrypt and view sensitive data
- Manage credential access

### Employer Verification
- Request credential verification
- View verification status
- Verify credential authenticity

### University Dashboard
- Register university
- Issue diplomas and transcripts
- Manage verification requests

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── assets/             # Static assets

contracts/
└── FHEDiplomaVault.sol # Main smart contract
```

### Key Hooks
- `useZamaInstance()`: FHE SDK initialization
- `useFHEEncryption()`: Encryption/decryption operations
- `useContract()`: Smart contract interactions

## 🧪 Testing

### Frontend Testing
```bash
npm run dev
# Open http://localhost:8080
```

### Smart Contract Testing
```bash
npx hardhat test
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## 🔗 Links

- **GitHub**: https://github.com/hannah93h/fhe-diploma-vault
- **Demo**: [Live Demo URL]
- **Documentation**: [Documentation URL]

---

**Built with ❤️ using Zama's FHE technology**