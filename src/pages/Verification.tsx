import { useState, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CertificateCard from "@/components/credentials/CertificateCard";
import CredentialCreator from "@/components/credentials/CredentialCreator";
import UniversityAdminPanel from "@/components/admin/UniversityAdminPanel";
import EmployerVerification from "@/components/verification/EmployerVerification";
import Header from "@/components/layout/Header";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useFHEEncryption } from "@/hooks/useFHEEncryption";
import { useDiplomaManagement } from "@/hooks/useDiplomaManagement";
import { useGetDiplomaEncryptedData } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { GraduationCap, Users, Shield, Plus, Eye } from "lucide-react";
import certificateIcon from "@/assets/certificate-icon.jpg";

const Verification = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [showCreator, setShowCreator] = useState(false);
  
  const { address } = useAccount();
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();
  const { isEncrypting, isDecrypting } = useFHEEncryption();
  const { diplomas, transcripts, isLoading: credentialsLoading, error: credentialsError, loadUserCredentials } = useDiplomaManagement();

  // Load user credentials when wallet connects
  useEffect(() => {
    if (address && instance) {
      loadUserCredentials();
    }
  }, [address, instance, loadUserCredentials]);

  // Use diplomas directly as credentials for CertificateCard
  const credentials = diplomas;

  const handleDecrypt = async (certificate: any) => {
    console.log("Decrypting certificate:", certificate);
    
    if (!instance || !address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Get encrypted data from contract using the hook
      const { CONTRACT_ADDRESSES } = await import('@/lib/contracts');
      const contractAddress = CONTRACT_ADDRESSES[11155111]?.FHEDiplomaVault;
      
      if (!contractAddress) {
        alert('Contract address not configured');
        return;
      }

      // Get encrypted data from contract using direct call
      const { createPublicClient, http } = await import('viem');
      const { sepolia } = await import('viem/chains');
      
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http('https://1rpc.io/sepolia')
      });

      // Call the contract directly with minimal ABI
      const encryptedData = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            "inputs": [{"name": "_diplomaId", "type": "uint256"}],
            "name": "getDiplomaEncryptedData",
            "outputs": [
              {"name": "encryptedGpa", "type": "bytes32"},
              {"name": "encryptedGraduationYear", "type": "bytes32"},
              {"name": "encryptedDegreeType", "type": "bytes32"}
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: 'getDiplomaEncryptedData',
        args: [BigInt(certificate.diplomaId)],
        authorizationList: []
      });

      console.log('Encrypted data from contract:', encryptedData);

      // Decrypt using FHE instance
      const handleContractPairs = [
        { handle: encryptedData[0], contractAddress }, // GPA
        { handle: encryptedData[1], contractAddress }, // Graduation Year
        { handle: encryptedData[2], contractAddress }, // Degree Type
      ];

      const decryptedResult = await instance.userDecrypt(handleContractPairs);
      
      console.log('Decrypted result:', decryptedResult);
      
      // Update the certificate with decrypted data
      const updatedCertificate = {
        ...certificate,
        gpa: Number(decryptedResult[0]),
        graduationYear: Number(decryptedResult[1]),
        degreeType: Number(decryptedResult[2])
      };

      console.log('Updated certificate with decrypted data:', updatedCertificate);
      
      // Show success message
      alert(`Decryption successful!\nGPA: ${updatedCertificate.gpa}\nGraduation Year: ${updatedCertificate.graduationYear}\nDegree Type: ${updatedCertificate.degreeType}`);
      
    } catch (error) {
      console.error('Decryption failed:', error);
      alert('Decryption failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-certificate-bg">
      {/* Header with Logo and Navigation */}
      <Header />
      
      {/* Main Application - Core Functionality */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-certificate-bg">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="student" 
                className="data-[state=active]:bg-academic-navy data-[state=active]:text-primary-foreground"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                My Portal
              </TabsTrigger>
              <TabsTrigger 
                value="university"
                className="data-[state=active]:bg-academic-navy data-[state=active]:text-primary-foreground"
              >
                <Shield className="w-4 h-4 mr-2" />
                University Admin
              </TabsTrigger>
              <TabsTrigger 
                value="employer"
                className="data-[state=active]:bg-academic-navy data-[state=active]:text-primary-foreground"
              >
                <Users className="w-4 h-4 mr-2" />
                Employer Verification
              </TabsTrigger>
            </TabsList>

            {/* Student Portal - Create and manage encrypted credentials */}
            <TabsContent value="student" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={certificateIcon} 
                        alt="Digital Certificate" 
                        className="w-12 h-12 rounded-lg object-cover border border-certificate-border"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-academic-navy">My Credentials</h2>
                        <p className="text-muted-foreground">Create and manage your encrypted educational records</p>
                      </div>
                    </div>
                    <Button
                      variant="academic"
                      onClick={() => setShowCreator(!showCreator)}
                      className="bg-academic-navy hover:bg-academic-navy/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Credential
                    </Button>
                  </div>

                  {/* Credential Creator */}
                  {showCreator && (
                    <CredentialCreator onCredentialCreated={() => {
                      setShowCreator(false);
                      loadUserCredentials();
                    }} />
                  )}

                  {/* Credentials List */}
                  <div className="space-y-4">
                    {credentialsLoading ? (
                      <Card className="p-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-academic-navy"></div>
                          Loading credentials...
                        </div>
                      </Card>
                    ) : credentialsError ? (
                      <Card className="p-8 text-center">
                        <div className="text-red-600">
                          <p>Error loading credentials: {credentialsError}</p>
                          <Button 
                            variant="outline" 
                            onClick={loadUserCredentials}
                            className="mt-4"
                          >
                            Retry
                          </Button>
                        </div>
                      </Card>
                    ) : credentials.length === 0 ? (
                      <Card className="p-8 text-center">
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-academic-navy to-primary rounded-full flex items-center justify-center">
                            <GraduationCap className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-academic-navy mb-2">No Credentials Found</h3>
                            <p className="text-muted-foreground mb-4">
                              You don't have any credentials yet. Create your first encrypted diploma.
                            </p>
                            <Button
                              variant="academic"
                              onClick={() => setShowCreator(true)}
                              className="bg-academic-navy hover:bg-academic-navy/90"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Your First Credential
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      credentials.map((credential, index) => (
                        <CertificateCard
                          key={index}
                          certificate={credential}
                          onDecrypt={() => handleDecrypt(credential)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* University Admin - Decrypt and verify student credentials */}
            <TabsContent value="university" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-lg">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-academic-navy">University Admin Panel</h2>
                      <p className="text-muted-foreground">Decrypt and verify student credentials with full access</p>
                    </div>
                  </div>

                  <UniversityAdminPanel />
                </div>
              </div>
            </TabsContent>

            {/* Employer Verification - View verification results without sensitive data */}
            <TabsContent value="employer" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-lg">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-academic-navy">Employer Verification</h2>
                      <p className="text-muted-foreground">Verify educational credentials by wallet address</p>
                    </div>
                  </div>

                  {/* Simple Verification Process */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="p-4 text-center border-2 border-academic-gold">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-academic-navy to-primary rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-academic-navy mb-2">1. Enter Address</h3>
                      <p className="text-sm text-muted-foreground">Enter student's wallet address</p>
                    </Card>
                    
                    <Card className="p-4 text-center border-2 border-academic-gold">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-academic-navy to-primary rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-academic-navy mb-2">2. FHE Query</h3>
                      <p className="text-sm text-muted-foreground">Encrypted query without revealing sensitive data</p>
                    </Card>
                    
                    <Card className="p-4 text-center border-2 border-academic-gold">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-academic-navy to-primary rounded-full flex items-center justify-center">
                        <Eye className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-academic-navy mb-2">3. Verify Result</h3>
                      <p className="text-sm text-muted-foreground">Get verification status without seeing raw data</p>
                    </Card>
                  </div>

                  {/* Employer Verification Component */}
                  <EmployerVerification />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

    </div>
  );
};

export default Verification;