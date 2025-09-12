import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Globe
} from "lucide-react";

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
  };
}

const CertificateDetailModal = ({ isOpen, onClose, certificate }: CertificateDetailModalProps) => {
  const handleDownload = () => {
    console.log("Downloading certificate...");
  };

  const handleShare = () => {
    console.log("Sharing certificate...");
  };

  const handleVerifyOnBlockchain = () => {
    console.log("Verifying on blockchain...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-academic-gold shadow-2xl relative">
        <div className="absolute inset-0 bg-white opacity-100 rounded-lg"></div>
        <DialogHeader className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-academic-navy flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-academic-gold to-yellow-400 rounded-full">
                <GraduationCap className="w-6 h-6 text-academic-navy" />
              </div>
              Certificate Details
            </DialogTitle>
            {certificate.isVerified && (
              <Badge className="bg-academic-gold text-academic-navy hover:bg-academic-gold/90">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Verified
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 relative z-10">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-academic-navy to-primary p-6 rounded-lg text-primary-foreground">
            <h2 className="text-3xl font-bold mb-2">{certificate.title}</h2>
            <h3 className="text-xl text-primary-foreground/80">{certificate.institution}</h3>
            {certificate.location && (
              <p className="text-sm text-primary-foreground/60 flex items-center gap-1 mt-2">
                <MapPin className="w-4 h-4" />
                {certificate.location}
              </p>
            )}
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-academic-navy border-b border-academic-gold pb-2">
                Academic Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-academic-gold" />
                  <div>
                    <span className="text-sm text-muted-foreground">Degree:</span>
                    <p className="font-medium">{certificate.degree}</p>
                  </div>
                </div>

                {certificate.major && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Major:</span>
                      <p className="font-medium">{certificate.major}</p>
                    </div>
                  </div>
                )}

                {certificate.minor && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Minor:</span>
                      <p className="font-medium">{certificate.minor}</p>
                    </div>
                  </div>
                )}

                {certificate.gpa && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">GPA:</span>
                      <p className="font-medium">{certificate.gpa}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-academic-gold" />
                  <div>
                    <span className="text-sm text-muted-foreground">Graduation Date:</span>
                    <p className="font-medium">{certificate.graduationDate}</p>
                  </div>
                </div>

                {certificate.issueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Issue Date:</span>
                      <p className="font-medium">{certificate.issueDate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-academic-navy border-b border-academic-gold pb-2">
                Blockchain & Security
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-academic-gold" />
                  <div>
                    <span className="text-sm text-muted-foreground">Encryption:</span>
                    <p className="font-medium">{certificate.encryptionLevel || "FHE-256"}</p>
                  </div>
                </div>

                {certificate.blockchainHash && (
                  <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 text-academic-gold mt-1" />
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground">Blockchain Hash:</span>
                      <p className="font-mono text-xs break-all bg-muted p-2 rounded mt-1">
                        {certificate.blockchainHash}
                      </p>
                    </div>
                  </div>
                )}

                {certificate.studentId && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Student ID:</span>
                      <p className="font-medium">{certificate.studentId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Honors & Awards */}
          {certificate.honors && certificate.honors.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-academic-navy border-b border-academic-gold pb-2">
                Honors & Awards
              </h4>
              <div className="flex flex-wrap gap-2">
                {certificate.honors.map((honor, index) => (
                  <Badge key={index} variant="outline" className="border-academic-gold text-academic-navy">
                    <Award className="w-3 h-3 mr-1" />
                    {honor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Key Coursework */}
          {certificate.coursework && certificate.coursework.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-academic-navy border-b border-academic-gold pb-2">
                Key Coursework
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {certificate.coursework.map((course, index) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded">
                    {course}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            <Button variant="outline" onClick={handleVerifyOnBlockchain}>
              <Globe className="w-4 h-4 mr-2" />
              Verify on Blockchain
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Certificate
            </Button>
            <Button variant="certificate" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDetailModal;