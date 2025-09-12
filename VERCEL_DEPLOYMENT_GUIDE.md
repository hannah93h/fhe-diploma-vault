# Vercel Deployment Guide for FHE Diploma Vault

This guide provides step-by-step instructions for deploying the FHE Diploma Vault application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Environment variables ready

## Step-by-Step Deployment

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project" or "Add New..." → "Project"

### Step 2: Import Repository

1. In the "Import Git Repository" section, find `hannah93h/fhe-diploma-vault`
2. Click "Import" next to the repository
3. Vercel will automatically detect it's a Vite project

### Step 3: Configure Project Settings

1. **Project Name**: `fhe-diploma-vault` (or your preferred name)
2. **Framework Preset**: Vite (should be auto-detected)
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `dist` (default)
6. **Install Command**: `npm install` (default)

### Step 4: Environment Variables Configuration

Click "Environment Variables" and add the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Infura Configuration (Optional)
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia

# Contract Addresses (Update after deployment)
NEXT_PUBLIC_DIPLOMA_VAULT_CONTRACT_ADDRESS=

# FHE Configuration
NEXT_PUBLIC_FHE_NETWORK_URL=https://api.zama.ai/fhevm
```

**Important**: 
- Replace all placeholder values (YOUR_*) with your actual API keys and project IDs
- Replace `NEXT_PUBLIC_DIPLOMA_VAULT_CONTRACT_ADDRESS` with the actual deployed contract address
- These are public variables (prefixed with `NEXT_PUBLIC_`) and will be visible in the client-side code
- Do not add sensitive private keys or secrets here
- Never commit actual API keys to version control

### Step 5: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Vercel will provide you with a deployment URL (e.g., `https://fhe-diploma-vault.vercel.app`)

### Step 6: Domain Configuration (Optional)

#### Custom Domain Setup

1. Go to your project dashboard in Vercel
2. Click on "Settings" tab
3. Navigate to "Domains" section
4. Add your custom domain
5. Follow DNS configuration instructions

#### Domain Verification

1. Add the required DNS records as instructed by Vercel
2. Wait for DNS propagation (can take up to 24 hours)
3. Verify domain status in Vercel dashboard

### Step 7: Post-Deployment Configuration

#### Update Contract Address

1. Deploy your smart contracts to Sepolia testnet
2. Update the `NEXT_PUBLIC_DIPLOMA_VAULT_CONTRACT_ADDRESS` environment variable in Vercel
3. Redeploy the application

#### Verify Deployment

1. Visit your deployed URL
2. Test wallet connection functionality
3. Verify that the application loads correctly
4. Check browser console for any errors

## Environment Variables Reference

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_CHAIN_ID` | Ethereum chain ID | `11155111` (Sepolia) |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint URL | `https://sepolia.infura.io/v3/...` |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | `YOUR_WALLET_CONNECT_PROJECT_ID` |
| `NEXT_PUBLIC_INFURA_API_KEY` | Infura API key | `YOUR_INFURA_API_KEY` |
| `NEXT_PUBLIC_DIPLOMA_VAULT_CONTRACT_ADDRESS` | Deployed contract address | `0x...` |
| `NEXT_PUBLIC_FHE_NETWORK_URL` | FHE network endpoint | `https://api.zama.ai/fhevm` |

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are properly installed
   - Verify TypeScript compilation errors
   - Ensure all environment variables are set

2. **Wallet Connection Issues**
   - Verify WalletConnect project ID is correct
   - Check that RPC URLs are accessible
   - Ensure chain ID matches your target network

3. **Contract Interaction Issues**
   - Verify contract address is correct
   - Check that contract is deployed on the correct network
   - Ensure ABI matches the deployed contract

### Build Logs

To view build logs:
1. Go to your project dashboard
2. Click on the deployment
3. View "Build Logs" tab for detailed information

### Redeployment

To redeploy after changes:
1. Push changes to the main branch
2. Vercel will automatically trigger a new deployment
3. Or manually trigger deployment from the Vercel dashboard

## Security Considerations

1. **Environment Variables**: Only use public variables (prefixed with `NEXT_PUBLIC_`)
2. **API Keys**: Never expose private API keys in client-side code
3. **Contract Addresses**: Verify contract addresses before deployment
4. **Network Security**: Use HTTPS for all external API calls

## Performance Optimization

1. **Code Splitting**: The build already includes code splitting for better performance
2. **Caching**: Vercel automatically handles caching for static assets
3. **CDN**: Vercel provides global CDN for fast content delivery

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings for performance monitoring
2. **Error Tracking**: Consider integrating error tracking services
3. **User Analytics**: Add analytics tools as needed

## Support

For deployment issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs for specific error messages
3. Contact Vercel support if needed

## Next Steps

After successful deployment:
1. Test all functionality thoroughly
2. Deploy smart contracts to mainnet (when ready)
3. Update contract addresses in environment variables
4. Set up monitoring and analytics
5. Configure custom domain (if needed)
6. Set up automated deployments from main branch
