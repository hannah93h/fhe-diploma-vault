import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/enhanced-button";
import { GraduationCap, Shield, Calendar, Award, Eye } from "lucide-react";

interface CertificateCardProps {
  certificate: {
    diplomaId: number;
    studentId: string;
    universityName: string;
    degreeName: string;
    major: string;
    graduationYear?: number;
    gpa?: number;
    degreeType?: number;
    isVerified: boolean;
    issueDate: number;
    ipfsHash: string;
    isEncrypted?: boolean;
  };
  onViewDetails: () => void;
  onDecrypt?: () => void;
}

const CertificateCard = ({ 
  certificate,
  onViewDetails,
  onDecrypt
}: CertificateCardProps) => {
  const handleDownload = () => {
    console.log("Downloading certificate...");
  };

  // Debug: Log certificate data
  console.log("CertificateCard received certificate:", certificate);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getDegreeTypeName = (type?: number) => {
    switch (type) {
      case 1: return 'Bachelor';
      case 2: return 'Master';
      case 3: return 'PhD';
      default: return 'Degree';
    }
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
              <h3 className="text-lg font-bold text-academic-navy">{certificate.degreeName}</h3>
              <p className="text-sm text-muted-foreground">{certificate.universityName}</p>
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
          <span className="font-medium">Degree</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Issue Date: {formatDate(certificate.issueDate)}</span>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">GPA: </span>
          <span className="font-semibold text-academic-navy">N/A/4.0</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Major: </span>
          <span className="font-semibold text-academic-navy">{certificate.major}</span>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Encrypted with FHE-256</span>
        </div>
      </div>

      {/* Certificate Actions */}
      <div className="flex gap-2">
        <Button variant="academic" size="sm" className="flex-1" onClick={onViewDetails}>
          <Eye className="w-3 h-3 mr-1" />
          View Details
        </Button>
        {onDecrypt && (
          <Button variant="outline" size="sm" onClick={onDecrypt}>
            <Shield className="w-3 h-3 mr-1" />
            Decrypt
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleDownload}>
          Download
        </Button>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border-4 border-academic-gold/20 rounded-lg pointer-events-none"></div>
    </Card>
  );
};

export default CertificateCard;