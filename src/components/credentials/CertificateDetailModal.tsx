import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Shield, 
  Calendar, 
  Award, 
  MapPin, 
  Clock, 
  Download, 
  Share2,
  Lock,
  Hash,
  Globe,
  QrCode,
  Copy,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

interface CertificateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    title: string;
    institution: string;
    degree: string;
    graduationDate: string;
    gpa?: string;
    isVerified: boolean;
    studentId?: string;
    major?: string;
    minor?: string;
    honors?: string[];
    coursework?: string[];
    location?: string;
    issueDate?: string;
    blockchainHash?: string;
    encryptionLevel?: string;
    verificationId?: string;
    shareableCode?: string;
    publicVerificationUrl?: string;
  };
  onShare?: () => void;
  onGenerateQR?: () => void;
}

const CertificateDetailModal = ({ 
  isOpen, 
  onClose, 
  certificate, 
  onShare, 
  onGenerateQR 
}: CertificateDetailModalProps) => {
  const [shareableLink, setShareableLink] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");

  const handleDownload = () => {
    console.log("Downloading certificate...");
  };

  const handleShare = () => {
    if (certificate.publicVerificationUrl) {
      setShareableLink(certificate.publicVerificationUrl);
      navigator.clipboard.writeText(certificate.publicVerificationUrl);
      alert("Verification link copied to clipboard!");
    } else if (onShare) {
      onShare();
    }
  };

  const handleGenerateQR = () => {
    if (certificate.shareableCode) {
      const qrData = {
        type: "FHE_DIPLOMA_VERIFICATION",
        diplomaId: certificate.blockchainHash,
        verificationCode: certificate.shareableCode,
        verificationUrl: certificate.publicVerificationUrl,
        timestamp: Date.now()
      };
      setQrCodeData(JSON.stringify(qrData, null, 2));
      if (onGenerateQR) {
        onGenerateQR();
      }
    }
  };

  const handleCopyVerificationCode = () => {
    if (certificate.shareableCode) {
      navigator.clipboard.writeText(certificate.shareableCode);
      alert("Verification code copied to clipboard!");
    }
  };

  const handleCopyBlockchainHash = () => {
    if (certificate.blockchainHash) {
      navigator.clipboard.writeText(certificate.blockchainHash);
      alert("Blockchain hash copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-academic-gold" />
            <span>Certificate Details</span>
            {certificate.isVerified && (
              <Badge className="bg-academic-gold text-academic-navy">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-academic-navy">{certificate.title}</h2>
            <p className="text-lg text-muted-foreground">{certificate.institution}</p>
            <p className="text-sm text-muted-foreground">{certificate.degree}</p>
          </div>

          <Separator />

          {/* Certificate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-academic-navy">Academic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-academic-gold" />
                  <div>
                    <span className="text-sm text-muted-foreground">Graduation Date</span>
                    <p className="font-semibold">{certificate.graduationDate}</p>
                  </div>
                </div>

                {certificate.gpa && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">GPA</span>
                      <p className="font-semibold">{certificate.gpa}</p>
                    </div>
                  </div>
                )}

                {certificate.major && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Major</span>
                      <p className="font-semibold">{certificate.major}</p>
                    </div>
                  </div>
                )}

                {certificate.studentId && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Student ID</span>
                      <p className="font-semibold">{certificate.studentId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-academic-navy">Verification Information</h3>
              
              <div className="space-y-3">
                {certificate.encryptionLevel && (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Encryption</span>
                      <p className="font-semibold">{certificate.encryptionLevel}</p>
                    </div>
                  </div>
                )}

                {certificate.blockchainHash && (
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Blockchain Hash</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={certificate.blockchainHash} 
                        readOnly 
                        className="font-mono text-xs"
                      />
                      <Button size="sm" variant="outline" onClick={handleCopyBlockchainHash}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {certificate.shareableCode && (
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Verification Code</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={certificate.shareableCode} 
                        readOnly 
                        className="font-mono text-xs"
                      />
                      <Button size="sm" variant="outline" onClick={handleCopyVerificationCode}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Honors and Coursework */}
          {(certificate.honors || certificate.coursework) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificate.honors && certificate.honors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-academic-navy mb-3">Honors</h3>
                    <div className="space-y-1">
                      {certificate.honors.map((honor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-academic-gold" />
                          <span className="text-sm">{honor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {certificate.coursework && certificate.coursework.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-academic-navy mb-3">Key Coursework</h3>
                    <div className="space-y-1">
                      {certificate.coursework.map((course, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-academic-gold" />
                          <span className="text-sm">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Share and Verification Actions */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-academic-navy">Share & Verification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Button 
                  variant="academic" 
                  className="w-full" 
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share for Verification
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGenerateQR}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
                
                {certificate.publicVerificationUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => window.open(certificate.publicVerificationUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Verification
                  </Button>
                )}
              </div>
            </div>

            {/* Shareable Link Display */}
            {shareableLink && (
              <div className="p-4 bg-academic-navy/5 rounded-lg">
                <Label className="text-sm font-medium text-academic-navy">Shareable Verification Link</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    value={shareableLink} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(shareableLink)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* QR Code Data Display */}
            {qrCodeData && (
              <div className="p-4 bg-academic-navy/5 rounded-lg">
                <Label className="text-sm font-medium text-academic-navy">QR Code Data</Label>
                <div className="mt-2 p-3 bg-white rounded border">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {qrCodeData}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDetailModal;