import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/enhanced-button";
import { GraduationCap, Shield, Calendar, Award, Share2, QrCode, Eye } from "lucide-react";

interface CertificateCardProps {
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
  onViewDetails: () => void;
  onShare?: () => void;
  onGenerateQR?: () => void;
}

const CertificateCard = ({ 
  certificate,
  onViewDetails,
  onShare,
  onGenerateQR
}: CertificateCardProps) => {
  const handleDownload = () => {
    console.log("Downloading certificate...");
  };

  return (
    <Card className="p-6 bg-gradient-certificate border-2 border-certificate-border shadow-certificate hover:shadow-elegant transition-all duration-300 relative">
      {/* Certificate Header */}
      <div className="border-b-2 border-academic-gold pb-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-academic-gold to-yellow-400 rounded-full">
              <GraduationCap className="w-5 h-5 text-academic-navy" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-academic-navy">{certificate.title}</h3>
              <p className="text-sm text-muted-foreground">{certificate.institution}</p>
            </div>
          </div>
          {certificate.isVerified && (
            <Badge className="bg-academic-gold text-academic-navy hover:bg-academic-gold/90">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Certificate Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-academic-gold" />
          <span className="font-medium">{certificate.degree}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Graduated: {certificate.graduationDate}</span>
        </div>
        
        {certificate.gpa && (
          <div className="text-sm">
            <span className="text-muted-foreground">GPA: </span>
            <span className="font-semibold text-academic-navy">{certificate.gpa}</span>
          </div>
        )}

        {certificate.major && (
          <div className="text-sm">
            <span className="text-muted-foreground">Major: </span>
            <span className="font-semibold text-academic-navy">{certificate.major}</span>
          </div>
        )}

        {certificate.encryptionLevel && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Encrypted with {certificate.encryptionLevel}</span>
          </div>
        )}
      </div>

      {/* Verification Info */}
      {certificate.shareableCode && (
        <div className="mb-4 p-3 bg-academic-navy/5 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Verification Code</div>
          <div className="text-xs font-mono text-academic-navy">{certificate.shareableCode}</div>
        </div>
      )}

      {/* Certificate Actions */}
      <div className="flex gap-2">
        <Button variant="academic" size="sm" className="flex-1" onClick={onViewDetails}>
          <Eye className="w-3 h-3 mr-1" />
          View Details
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          Download
        </Button>
      </div>

      {/* Share Actions */}
      <div className="flex gap-2 mt-3">
        {onShare && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            onClick={onShare}
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share for Verification
          </Button>
        )}
        {onGenerateQR && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            onClick={onGenerateQR}
          >
            <QrCode className="w-3 h-3 mr-1" />
            Generate QR
          </Button>
        )}
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border-4 border-academic-gold/20 rounded-lg pointer-events-none"></div>
    </Card>
  );
};

export default CertificateCard;