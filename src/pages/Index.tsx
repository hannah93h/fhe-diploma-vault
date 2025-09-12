import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletConnect from "@/components/wallet/WalletConnect";
import CertificateCard from "@/components/credentials/CertificateCard";
import CertificateDetailModal from "@/components/credentials/CertificateDetailModal";
import EmployerVerification from "@/components/verification/EmployerVerification";
import { GraduationCap, Shield, Users, Award, Lock, Search } from "lucide-react";
import universityHero from "@/assets/university-hero.jpg";
import certificateIcon from "@/assets/certificate-icon.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
      {/* Hero Section */}
      <section className="relative bg-gradient-academic text-primary-foreground overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${universityHero})` }}
        />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Education Records
              <span className="block bg-gradient-gold bg-clip-text text-transparent">
                Secured by FHE
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
              Diplomas and transcripts issued on-chain in encrypted form, 
              verifiable only through Fully Homomorphic Encryption queries
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="certificate" size="xl">
                <GraduationCap className="w-5 h-5 mr-2" />
                Access Credentials
              </Button>
              <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-academic-navy">
                <Shield className="w-5 h-5 mr-2" />
                Learn About FHE
              </Button>
            </div>
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

      {/* Main Application */}
      <section className="py-16">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <WalletConnect />
                </div>
                <div className="lg:col-span-2">
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

export default Index;
