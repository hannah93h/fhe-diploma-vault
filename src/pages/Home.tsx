import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { GraduationCap, Shield, Users, Award, Lock, Search } from "lucide-react";
import universityHero from "@/assets/university-hero.jpg";

const Home = () => {
  const { instance, isLoading: fheLoading, error: fheError } = useZamaInstance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-certificate-bg">
      {/* Header with Logo and Navigation */}
      <Header />
      
      {/* Hero Section - Marketing Content */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden pt-16">
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
              <Button 
                variant="certificate" 
                size="xl" 
                disabled={fheLoading || !instance}
                onClick={() => window.location.href = '/verification'}
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                {fheLoading ? 'Initializing FHE...' : 'Access Credentials'}
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold bg-transparent !text-white"
                style={{ color: 'white', backgroundColor: 'transparent' }}
                onClick={() => window.open('https://docs.zama.ai/fhevm', '_blank')}
              >
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

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-academic-navy mb-6">
              Ready to Secure Your Educational Records?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the future of privacy-preserving credential verification
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="certificate" 
                size="xl"
                onClick={() => window.location.href = '/verification'}
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-academic-navy text-academic-navy hover:bg-academic-navy hover:text-white"
                onClick={() => window.open('https://github.com/zama-ai/fhevm', '_blank')}
              >
                <Users className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
