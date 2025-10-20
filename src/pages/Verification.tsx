import { useState, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CertificateCard from "@/components/credentials/CertificateCard";
import CertificateDetailModal from "@/components/credentials/CertificateDetailModal";
import CredentialCreator from "@/components/credentials/CredentialCreator";
import EmployerVerification from "@/components/verification/EmployerVerification";
import Header from "@/components/layout/Header";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useFHEEncryption } from "@/hooks/useFHEEncryption";
import { useDiplomaManagement } from "@/hooks/useDiplomaManagement";
import { useAccount } from "wagmi";
import { GraduationCap, Users, Plus, Shield, Eye, Share2, QrCode } from "lucide-react";
import certificateIcon from "@/assets/certificate-icon.jpg";

const Verification = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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

  // Convert decrypted diplomas to display format
  const credentials = diplomas.map((diploma, index) => ({
    title: diploma.degreeName || 'Degree Certificate',
    institution: diploma.universityName || 'University',
    degree: diploma.degreeName || 'Degree',
    graduationDate: new Date(diploma.issueDate * 1000).toLocaleDateString(),
    gpa: diploma.gpa ? `${(Number(diploma.gpa) / 10).toFixed(1)}/4.0` : 'N/A',
    isVerified: diploma.isVerified,
    studentId: diploma.studentId ? diploma.studentId.toString() : 'N/A',
    major: diploma.major || 'N/A',
    location: "Cambridge, Massachusetts",
    issueDate: new Date(diploma.issueDate * 1000).toLocaleDateString(),
    blockchainHash: `0x${diploma.diplomaId.toString(16).padStart(64, '0')}`,
    encryptionLevel: "FHE-256",
    honors: ["Magna Cum Laude", "Dean's List"],
    coursework: [
      "Advanced Algorithms",
      "Machine Learning", 
      "Distributed Systems",
      "Computer Vision"
    ],
    // Simple verification data
    verificationId: `VERIFY_${diploma.diplomaId}`,
    shareableCode: `FHE_${diploma.diplomaId}`,
    publicVerificationUrl: `${window.location.origin}/verify/${diploma.diplomaId}`
  }));

  const handleViewDetails = (certificate: any) => {
    setSelectedCertificate(certificate);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleShareCredential = (certificate: any) => {
    const verificationUrl = `${window.location.origin}/verify/${certificate.blockchainHash}`;
    navigator.clipboard.writeText(verificationUrl);
    alert(`Verification link copied to clipboard: ${verificationUrl}`);
  };

  const handleGenerateQR = (certificate: any) => {
    const qrData = {
      type: "FHE_DIPLOMA_VERIFICATION",
      diplomaId: certificate.blockchainHash,
      studentAddress: address,
      verificationUrl: certificate.publicVerificationUrl,
      timestamp: Date.now()
    };
    console.log("QR Code Data:", qrData);
    alert("QR Code generated! (In a real implementation, this would show a QR code)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-certificate-bg">
      {/* Header with Logo and Navigation */}
      <Header />
      
      {/* Main Application - Core Functionality */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-certificate-bg">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="student" 
                className="data-[state=active]:bg-academic-navy data-[state=active]:text-primary-foreground"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Student Portal
              </TabsTrigger>
              <TabsTrigger 
                value="employer"
                className="data-[state=active]:bg-academic-navy data-[state=active]:text-primary-foreground"
              >
                <Users className="w-4 h-4 mr-2" />
                Employer Verification
              </TabsTrigger>
            </TabsList>

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
                        <h2 className="text-2xl font-bold text-academic-navy">Your Credentials</h2>
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
                          onViewDetails={() => handleViewDetails(credential)}
                          onShare={() => handleShareCredential(credential)}
                          onGenerateQR={() => handleGenerateQR(credential)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employer" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-lg">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-academic-navy">Employer Verification</h2>
                      <p className="text-muted-foreground">Verify educational credentials through FHE queries</p>
                    </div>
                  </div>

                  {/* Simple Verification Process */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="p-4 text-center border-2 border-academic-gold">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-academic-navy to-primary rounded-full flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-academic-navy mb-2">1. Student Shares</h3>
                      <p className="text-sm text-muted-foreground">Student provides wallet address or verification link</p>
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

      {/* Certificate Detail Modal */}
      {isDetailModalOpen && selectedCertificate && (
        <CertificateDetailModal
          certificate={selectedCertificate}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onShare={() => handleShareCredential(selectedCertificate)}
          onGenerateQR={() => handleGenerateQR(selectedCertificate)}
        />
      )}
    </div>
  );
};

export default Verification;