import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Building, CheckCircle, AlertCircle } from "lucide-react";

const EmployerVerification = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async () => {
    setIsVerifying(true);
    
    // Mock verification process
    setTimeout(() => {
      setVerificationResult({
        studentName: "John Smith",
        institution: "Harvard University",
        degree: "Master of Computer Science",
        graduationDate: "May 2023",
        gpa: "3.8/4.0",
        verified: true,
        encryptionLevel: "FHE-256"
      });
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-certificate border-certificate-border shadow-certificate">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-full">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-academic-navy">Employer Verification Portal</h3>
              <p className="text-sm text-muted-foreground">
                Verify educational credentials through FHE queries
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="wallet" className="text-sm font-medium">
                Student Wallet Address
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button 
                  variant="academic" 
                  onClick={handleVerification}
                  disabled={!walletAddress || isVerifying}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3 text-academic-gold" />
              <span>All queries are encrypted and privacy-preserving</span>
            </div>
          </div>
        </div>
      </Card>

      {verificationResult && (
        <Card className="p-6 bg-gradient-certificate border-2 border-academic-gold shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-academic-navy">Verification Result</h4>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Student Name</span>
                  <p className="text-sm font-semibold">{verificationResult.studentName}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Institution</span>
                  <p className="text-sm font-semibold">{verificationResult.institution}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Degree</span>
                  <p className="text-sm font-semibold">{verificationResult.degree}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Graduation Date</span>
                  <p className="text-sm font-semibold">{verificationResult.graduationDate}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-certificate-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-academic-gold" />
                  <span>Encryption: {verificationResult.encryptionLevel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-academic-gold" />
                  <span>Query processed via FHE</span>
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