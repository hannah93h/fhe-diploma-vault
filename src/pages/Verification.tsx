import { useState } from "react";
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
import { GraduationCap, Users, Plus, Shield } from "lucide-react";
import certificateIcon from "@/assets/certificate-icon.jpg";

const Verification = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();
  const { isEncrypting, isDecrypting } = useFHEEncryption();
  const { diplomas, transcripts, isLoading: credentialsLoading, error: credentialsError, loadUserCredentials } = useDiplomaManagement();

  // Convert decrypted diplomas to display format
  const credentials = diplomas.map((diploma, index) => ({
    title: diploma.degreeName,
    institution: diploma.universityName,
    degree: diploma.degreeName,
    graduationDate: new Date(diploma.issueDate).toLocaleDateString(),
    gpa: `${(diploma.gpa / 10).toFixed(1)}/4.0`,
    isVerified: diploma.isVerified,
    studentId: diploma.studentId.toString(),
    major: diploma.major,
    location: "Cambridge, Massachusetts",
    issueDate: new Date(diploma.issueDate).toLocaleDateString(),
    blockchainHash: `0x${diploma.diplomaId.toString(16).padStart(64, '0')}`,
    encryptionLevel: "FHE-256",
    honors: ["Magna Cum Laude", "Dean's List"],
    coursework: [
      "Advanced Algorithms",
      "Machine Learning",
      "Distributed Systems",
      "Computer Vision"
    ]
  }));

  const handleViewDetails = (certificate: any) => {
    setSelectedCertificate(certificate);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCertificate(null);
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
                        <p className="text-muted-foreground">Manage your encrypted educational records</p>
                      </div>
                    </div>
                    <Button
                      variant="certificate"
                      onClick={() => setShowCreator(!showCreator)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {showCreator ? 'Hide Creator' : 'Create New'}
                    </Button>
                  </div>

                  {showCreator && (
                    <CredentialCreator onCredentialCreated={() => {
                      setShowCreator(false);
                      loadUserCredentials();
                    }} />
                  )}

                  {credentialsLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <Shield className="w-4 h-4 animate-spin" />
                        Loading encrypted credentials...
                      </div>
                    </div>
                  ) : credentialsError ? (
                    <div className="text-center py-8">
                      <div className="text-red-600">
                        Error loading credentials: {credentialsError}
                      </div>
                    </div>
                  ) : credentials.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        No credentials found. Create your first encrypted credential above.
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {credentials.map((credential, index) => (
                        <CertificateCard 
                          key={index} 
                          {...credential} 
                          onViewDetails={() => handleViewDetails(credential)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employer" className="space-y-8">
              <EmployerVerification />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <CertificateDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          certificate={selectedCertificate}
        />
      )}
    </div>
  );
};

export default Verification;
