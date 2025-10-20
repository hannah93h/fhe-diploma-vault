# FHE Diploma Vault - Secure Education Records

A blockchain-based platform for issuing and verifying educational credentials using Fully Homomorphic Encryption (FHE). This project enables universities to issue diplomas and transcripts on-chain in encrypted form, ensuring privacy while maintaining verifiability.

## 🎥 Demo Video

[![FHE Diploma Vault Demo](https://img.youtube.com/vi/demo/0.jpg)](https://youtu.be/demo)
**Watch the full demo**: [FHE Diploma Vault Demo Video](./fhe-diploma-vault-compressed.mp4) (12MB, High Quality)

*The demo showcases the complete workflow from credential creation to FHE decryption and verification.*

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

### Environment Configuration

1. Copy the environment template:
```bash
cp env.example .env
```

2. Configure the following environment variables in `.env`:

```bash
# Network Configuration
SEPOLIA_RPC_URL=https://1rpc.io/sepolia

# Contract Addresses (Update after deployment)
VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS=0x3dEe389B72d2feed20BF0b0f07385dCBb35D25e5

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# FHE Configuration
VITE_FHE_NETWORK_URL=https://api.zama.ai/fhevm
```

**Important**: The contract address must be updated after each deployment to point to the latest deployed contract.

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

### Contract Information
- **Contract Address**: `0x3dEe389B72d2feed20BF0b0f07385dCBb35D25e5`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Solidity Version**: ^0.8.0
- **FHE Framework**: @fhevm/solidity
- **Etherscan**: [View on Etherscan](https://sepolia.etherscan.io/address/0x3dEe389B72d2feed20BF0b0f07385dCBb35D25e5)

### Core Functions
- `createDiploma()`: Create a diploma with encrypted sensitive data
- `registerUniversity()`: Register a new university
- `verifyDiploma()`: Verify a diploma (university admin only)
- `adminRegisterUniversity()`: Admin function to register universities
- `addUniversityAdmin()`: Add university admin permissions

### Data Access Functions
- `getDiplomaPublicData()`: Get public diploma information (unencrypted)
- `getDiplomaEncryptedData()`: Get encrypted data for FHE decryption
- `getStudentDiplomas()`: Get all diplomas for a student
- `getAllUniversities()`: Get all registered universities
- `isAdmin()`: Check if address is admin
- `isUniversityAdmin()`: Check if address is university admin

## 🔒 FHE Encryption & Decryption Logic

### Encrypted Data Types
- **GPA**: `euint32` - Encrypted grade point average (0-400 scale)
- **Graduation Year**: `euint32` - Encrypted graduation year
- **Degree Type**: `euint8` - Encrypted degree type (1=Bachelor, 2=Master, 3=PhD)

### Public Data (Unencrypted)
- **Student ID**: `string` - Public student identifier
- **University Name**: `string` - University name
- **Degree Name**: `string` - Degree name
- **Major**: `string` - Field of study
- **Issue Date**: `uint256` - Timestamp when issued
- **Is Verified**: `bool` - Verification status
- **Student Address**: `address` - Student wallet address

### FHE Encryption Process
1. **Client-Side Encryption**: Uses `@zama-fhe/relayer-sdk` to encrypt sensitive data
2. **Handle Generation**: Creates encrypted handles for each data field
3. **Contract Storage**: Stores encrypted handles as `bytes32` on-chain
4. **ACL Setup**: Sets access control permissions for decryption

### FHE Decryption Process
1. **Keypair Generation**: Generate FHE public/private key pair
2. **EIP712 Signature**: Create typed data signature for authorization
3. **Wallet Signature**: User signs the decryption request
4. **Data Retrieval**: Fetch encrypted handles from contract
5. **FHE Decryption**: Use `userDecrypt()` to decrypt sensitive data
6. **Display Results**: Show decrypted values to authorized users

### ACL Permissions
- **Contract Access**: `FHE.allowThis()` for contract operations
- **Student Access**: `FHE.allow(studentAddress)` for student data decryption
- **University Access**: `FHE.allow(universityAdmin)` for verification
- **Public Access**: `FHE.allow(address(0))` for demo purposes

## 🌐 Network Configuration

- **Network**: Sepolia Testnet
- **RPC URL**: https://1rpc.io/sepolia
- **Chain ID**: 11155111
- **FHE Network**: https://api.zama.ai/fhevm

## 📱 Frontend Features

### My Portal (Student)
- **View Credentials**: Display all issued diplomas and transcripts
- **FHE Decryption**: Decrypt and view sensitive data (GPA, graduation year, degree type)
- **Real-time Status**: Show verification status and issue dates
- **Credential Management**: Manage access to encrypted credentials

### University Admin Panel
- **Admin Access**: Restricted to university administrators only
- **Diploma Verification**: Verify or reject student credentials
- **FHE Decryption**: Full access to encrypted data for verification
- **Search & Filter**: Find specific diplomas by ID or student
- **Real-time Updates**: Live status updates for verification actions

### Employer Verification
- **Address-based Verification**: Verify credentials using student wallet address
- **Public Data Access**: View non-sensitive credential information
- **Verification Status**: Check if credentials are verified by university
- **Secure Process**: No access to sensitive encrypted data

### Key User Flows
1. **Student**: Create → Encrypt → Store → Decrypt → View
2. **University**: Register → Issue → Verify → Manage
3. **Employer**: Search → Verify → Confirm → Trust

## 🏗️ Technical Architecture

### FHE Implementation Stack
- **Frontend**: React + TypeScript + Vite
- **FHE SDK**: `@zama-fhe/relayer-sdk` for client-side encryption
- **Blockchain**: Ethereum Sepolia Testnet
- **FHE Framework**: `@fhevm/solidity` for smart contract integration
- **Wallet**: MetaMask integration via Wagmi v2
- **Styling**: Tailwind CSS + Radix UI components

### Smart Contract Architecture
```solidity
contract FHEDiplomaVault {
    struct Diploma {
        uint256 diplomaId;
        string studentId;
        string universityName;
        string degreeName;
        string major;
        string ipfsHash;
        address student;
        address university;
        uint256 issueDate;
        bool isVerified;
        // FHE Encrypted Fields
        euint32 encryptedGpa;
        euint32 encryptedGraduationYear;
        euint8 encryptedDegreeType;
    }
}
```

### FHE Data Flow
1. **Encryption**: Client encrypts sensitive data using FHE SDK
2. **Storage**: Encrypted handles stored as `bytes32` on-chain
3. **Access Control**: ACL permissions set for authorized decryption
4. **Decryption**: Authorized users decrypt data client-side
5. **Verification**: Universities verify credentials using decrypted data

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
- **Demo Video**: [FHE Diploma Vault Demo](./fhe-diploma-vault-compressed.mp4) (12MB)
- **Contract**: [0x3dEe389B72d2feed20BF0b0f07385dCBb35D25e5](https://sepolia.etherscan.io/address/0x3dEe389B72d2feed20BF0b0f07385dCBb35D25e5)
- **FHE Documentation**: [Zama FHE Documentation](https://docs.zama.ai/)
- **FHEVM Framework**: [FHEVM Documentation](https://docs.fhevm.org/)

---

**Built with ❤️ using Zama's FHE technology**