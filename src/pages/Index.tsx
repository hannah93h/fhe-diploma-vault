import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CertificateCard from "@/components/credentials/CertificateCard";
import CertificateDetailModal from "@/components/credentials/CertificateDetailModal";
import EmployerVerification from "@/components/verification/EmployerVerification";
import Header from "@/components/layout/Header";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useFHEEncryption } from "@/hooks/useFHEEncryption";
import { GraduationCap, Shield, Users, Award, Lock, Search } from "lucide-react";
import universityHero from "@/assets/university-hero.jpg";
import certificateIcon from "@/assets/certificate-icon.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();
  const { isEncrypting, isDecrypting } = useFHEEncryption();

  const mockCredentials = [
    {
      title: "Master's Degree Certificate",
      institution: "Harvard University",
      degree: "Master of Computer Science",
      graduationDate: "May 2023",
      gpa: "3.8/4.0",
      isVerified: true,
      studentId: "HMS2021001",
      major: "Computer Science",
      minor: "Mathematics",
      location: "Cambridge, Massachusetts",
      issueDate: "June 15, 2023",
      blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
      encryptionLevel: "FHE-256",
      honors: ["Magna Cum Laude", "Dean's List", "Outstanding Thesis Award"],
      coursework: [
        "Advanced Algorithms",
        "Machine Learning",
        "Distributed Systems",
        "Computer Vision",
        "Natural Language Processing",
        "Cryptography"
      ]
    },
    {
      title: "Bachelor's Degree Certificate", 
      institution: "MIT",
      degree: "Bachelor of Science in Engineering",
      graduationDate: "June 2021",
      gpa: "3.9/4.0",
      isVerified: true,
      studentId: "MIT2017456",
      major: "Computer Science and Engineering",
      location: "Cambridge, Massachusetts",
      issueDate: "July 10, 2021",
      blockchainHash: "0x9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
      encryptionLevel: "FHE-256",
      honors: ["Summa Cum Laude", "Phi Beta Kappa", "Innovation Award"],
      coursework: [
        "Data Structures & Algorithms",
        "Software Engineering",
        "Computer Systems",
        "Artificial Intelligence",
        "Database Systems",
        "Operating Systems"
      ]
    }
  ];

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
      
      {/* Home Section - Core Functionality */}
      <section id="home" className="py-16 bg-gradient-to-br from-background to-certificate-bg">
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
                  <div className="flex items-center gap-3 mb-6">
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
                  
                  <div className="grid grid-cols-1 gap-6">
                    {mockCredentials.map((credential, index) => (
                      <CertificateCard 
                        key={index} 
                        {...credential} 
                        onViewDetails={() => handleViewDetails(credential)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employer" className="space-y-8">
              <EmployerVerification />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Verification Section */}
      <section id="verification" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-academic-navy mb-4">Credential Verification</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Verify educational credentials with privacy-preserving FHE technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 bg-white border-certificate-border shadow-certificate">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-academic-navy to-primary rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-academic-navy">Student Access</h3>
                  <p className="text-muted-foreground">
                    View and manage your encrypted educational credentials
                  </p>
                  <Button 
                    variant="certificate" 
                    size="lg" 
                    className="w-full"
                    onClick={() => setActiveTab('student')}
                  >
                    Access Your Credentials
                  </Button>
                </div>
              </Card>

              <Card className="p-8 bg-white border-certificate-border shadow-certificate">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-academic-gold to-yellow-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Users className="w-8 h-8 text-academic-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-academic-navy">Employer Verification</h3>
                  <p className="text-muted-foreground">
                    Verify candidate credentials without accessing sensitive data
                  </p>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-academic-navy text-academic-navy hover:bg-academic-navy hover:text-white"
                    onClick={() => setActiveTab('employer')}
                  >
                    Verify Credentials
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - Marketing Content */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${universityHero})` }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 py-20 z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
              <span className="block">Education Records</span>
              <span className="block text-yellow-400 font-extrabold">
                Secured by FHE
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-semibold">
              Diplomas and transcripts issued on-chain in encrypted form, 
              verifiable only through Fully Homomorphic Encryption queries
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="certificate" size="xl" disabled={fheLoading || !instance}>
                <GraduationCap className="w-5 h-5 mr-2" />
                {fheLoading ? 'Initializing FHE...' : 'Access Credentials'}
              </Button>
              <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold">
                <Shield className="w-5 h-5 mr-2" />
                Learn About FHE
              </Button>
            </div>
            
            {/* FHE Status Display */}
            {fheError && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                <strong>FHE Initialization Error:</strong> {fheError}
              </div>
            )}
            
            {instance && (
              <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
                <strong>FHE Encryption Ready:</strong> Your data will be encrypted with Fully Homomorphic Encryption
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-certificate-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-gradient-certificate border-certificate-border shadow-certificate hover:shadow-elegant transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-academic-navy to-primary rounded-full">
                  <Lock className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-academic-navy mb-2">FHE Encryption</h3>
              <p className="text-muted-foreground">
                Credentials encrypted with Fully Homomorphic Encryption, enabling computation on encrypted data
              </p>
            </Card>

            <Card className="p-6 text-center bg-gradient-certificate border-certificate-border shadow-certificate hover:shadow-elegant transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-academic-gold to-yellow-400 rounded-full">
                  <Award className="w-6 h-6 text-academic-navy" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-academic-navy mb-2">Verified Credentials</h3>
              <p className="text-muted-foreground">
                Blockchain-based verification ensures authenticity and prevents tampering
              </p>
            </Card>

            <Card className="p-6 text-center bg-gradient-certificate border-certificate-border shadow-certificate hover:shadow-elegant transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-academic-navy to-primary rounded-full">
                  <Search className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-academic-navy mb-2">Private Verification</h3>
              <p className="text-muted-foreground">
                Employers can verify credentials without accessing sensitive student data
              </p>
            </Card>
          </div>
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

export default Index;
