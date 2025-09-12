import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/enhanced-button";
import { GraduationCap, Shield, Calendar, Award } from "lucide-react";

interface CertificateCardProps {
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
  onViewDetails: () => void;
}

const CertificateCard = ({ 
  title, 
  institution, 
  degree, 
  graduationDate, 
  gpa, 
  isVerified,
  onViewDetails
}: CertificateCardProps) => {
  const handleDownload = () => {
    console.log("Downloading certificate...");
  };
  return (
    <Card className="p-6 bg-gradient-certificate border-2 border-certificate-border shadow-certificate hover:shadow-elegant transition-all duration-300">
      {/* Certificate Header */}
      <div className="border-b-2 border-academic-gold pb-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-academic-gold to-yellow-400 rounded-full">
              <GraduationCap className="w-5 h-5 text-academic-navy" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-academic-navy">{title}</h3>
              <p className="text-sm text-muted-foreground">{institution}</p>
            </div>
          </div>
          {isVerified && (
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
          <span className="font-medium">{degree}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Graduated: {graduationDate}</span>
        </div>
        
        {gpa && (
          <div className="text-sm">
            <span className="text-muted-foreground">GPA: </span>
            <span className="font-semibold text-academic-navy">{gpa}</span>
          </div>
        )}
      </div>

      {/* Certificate Actions */}
      <div className="flex gap-2">
        <Button variant="academic" size="sm" className="flex-1" onClick={onViewDetails}>
          View Details
        </Button>
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