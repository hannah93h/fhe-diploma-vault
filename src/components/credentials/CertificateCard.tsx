import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/enhanced-button";
import { GraduationCap, Shield, Calendar, Award, Eye } from "lucide-react";

interface CertificateCardProps {
  certificate: {
    diplomaId: number;
    studentId: number;
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
  onDecrypt?: () => void;
}

const CertificateCard = ({ 
  certificate,
  onDecrypt
}: CertificateCardProps) => {
  const handleDownload = () => {
    console.log("Downloading certificate...");
  };

  // Debug: Log certificate data
  console.log("CertificateCard received certificate:", certificate);

  const formatDate = (timestamp: number) => {
    if (!timestamp || timestamp === 0 || isNaN(timestamp)) return 'N/A';
    try {
      // Handle both Unix timestamp (seconds) and milliseconds
      const date = timestamp > 1e10 ? new Date(timestamp) : new Date(timestamp * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'timestamp:', timestamp);
      return 'Invalid Date';
    }
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
          <span className="text-muted-foreground">Student ID: </span>
          <span className="font-semibold text-academic-navy">{certificate.studentId.toString()}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Major: </span>
          <span className="font-semibold text-academic-navy">{certificate.major}</span>
        </div>

        {/* Encrypted Fields */}
        <div className="border-t border-academic-gold/20 pt-3 mt-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
            <Shield className="w-3 h-3" />
            <span>Encrypted with FHE-256</span>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">GPA: </span>
            <span className="font-semibold text-academic-navy">{certificate.gpa > 0 ? `${certificate.gpa}/4.0` : 'N/A'}</span>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Graduation Year: </span>
            <span className="font-semibold text-academic-navy">{certificate.graduationYear > 0 ? certificate.graduationYear : 'N/A'}</span>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Degree Type: </span>
            <span className="font-semibold text-academic-navy">{getDegreeTypeName(certificate.degreeType)}</span>
          </div>
        </div>
      </div>

      {/* Certificate Actions */}
      <div className="flex gap-2">
        {onDecrypt && (
          <Button variant="academic" size="sm" className="flex-1" onClick={onDecrypt}>
            <Shield className="w-3 h-3 mr-1" />
            Decrypt & View Details
          </Button>
        )}
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border-4 border-academic-gold/20 rounded-lg pointer-events-none"></div>
    </Card>
  );
};

export default CertificateCard;