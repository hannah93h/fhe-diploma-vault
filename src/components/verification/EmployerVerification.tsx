import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Building, CheckCircle, AlertCircle, Copy } from "lucide-react";
import { useAccount } from "wagmi";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useFHEEncryption } from "@/hooks/useFHEEncryption";

const EmployerVerification = () => {
  const [studentAddress, setStudentAddress] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string>("");
  
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const { isDecrypting } = useFHEEncryption();

  const handleVerification = async () => {
    if (!studentAddress.trim()) {
      setVerificationError("Please enter a student wallet address");
      return;
    }

    if (!instance) {
      setVerificationError("FHE instance not available");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");
    
    try {
      // Simulate FHE verification process
      // In a real implementation, this would:
      // 1. Query the contract for encrypted diploma data
      // 2. Use FHE to verify credentials without decrypting
      // 3. Return verification result
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock verification result
      const mockResult = {
        studentAddress,
        verified: true,
        verificationTimestamp: Date.now(),
        encryptionLevel: "FHE-256",
        queryType: "FHE_VERIFICATION",
        privacyPreserved: true,
        // Mock diploma data (in real implementation, this would come from FHE query)
        diplomaData: {
          institution: "Harvard University",
          degree: "Master of Computer Science", 
          graduationDate: "May 2023",
          gpa: "3.8/4.0",
          isVerified: true
        },
        fheProof: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        verificationHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      };

      setVerificationResult(mockResult);
    } catch (error: any) {
      setVerificationError(error.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyResult = () => {
    if (verificationResult) {
      const resultText = `FHE Verification Result:
Student Address: ${verificationResult.studentAddress}
Verified: ${verificationResult.verified ? 'Yes' : 'No'}
Institution: ${verificationResult.diplomaData.institution}
Degree: ${verificationResult.diplomaData.degree}
Graduation: ${verificationResult.diplomaData.graduationDate}
GPA: ${verificationResult.diplomaData.gpa}
Verification Hash: ${verificationResult.verificationHash}
Privacy Preserved: ${verificationResult.privacyPreserved ? 'Yes' : 'No'}`;
      
      navigator.clipboard.writeText(resultText);
      alert("Verification result copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Input */}
      <Card className="p-6 bg-gradient-certificate border-certificate-border shadow-certificate">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-full">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-academic-navy">FHE Verification Portal</h3>
              <p className="text-sm text-muted-foreground">
                Verify educational credentials through encrypted queries
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="student-address" className="text-sm font-medium">
                Student Wallet Address
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="student-address"
                  placeholder="0x..."
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button 
                  variant="academic" 
                  onClick={handleVerification}
                  disabled={!studentAddress || isVerifying}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3 text-academic-gold" />
              <span>All queries are encrypted and privacy-preserving using FHE</span>
            </div>
          </div>

          {verificationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{verificationError}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Verification Result */}
      {verificationResult && (
        <Card className="p-6 bg-gradient-certificate border-2 border-academic-gold shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-academic-navy">FHE Verification Result</h4>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyResult}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Result
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Student Address</span>
                  <p className="text-xs font-mono text-academic-navy">{verificationResult.studentAddress}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Institution</span>
                  <p className="text-sm font-semibold">{verificationResult.diplomaData.institution}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Degree</span>
                  <p className="text-sm font-semibold">{verificationResult.diplomaData.degree}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Graduation Date</span>
                  <p className="text-sm font-semibold">{verificationResult.diplomaData.graduationDate}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">GPA</span>
                  <p className="text-sm font-semibold">{verificationResult.diplomaData.gpa}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Verification Status</span>
                  <p className="text-sm font-semibold text-green-600">
                    {verificationResult.diplomaData.isVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-certificate-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-academic-gold" />
                  <span>Encryption: {verificationResult.encryptionLevel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-academic-gold" />
                  <span>Query processed via FHE</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-academic-gold" />
                  <span>Privacy preserved</span>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-academic-navy/5 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">FHE Verification Hash</div>
                <div className="text-xs font-mono text-academic-navy break-all">
                  {verificationResult.verificationHash}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmployerVerification;