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
  Lock,
  Hash
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

const CertificateDetailModal = ({ 
  isOpen, 
  onClose, 
  certificate
}: CertificateDetailModalProps) => {
  const handleDownload = () => {
    console.log("Downloading certificate...");
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
                    <span className="text-sm text-muted-foreground">Blockchain Hash</span>
                    <p className="text-xs font-mono text-academic-navy break-all">{certificate.blockchainHash}</p>
                  </div>
                )}

                {certificate.issueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-academic-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Issue Date</span>
                      <p className="font-semibold">{certificate.issueDate}</p>
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleDownload}>
              Download Certificate
            </Button>
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