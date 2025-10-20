import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Shield, 
  Building, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Lock,
  Unlock,
  GraduationCap,
  User
} from "lucide-react";
import { useAccount } from "wagmi";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useFHEEncryption } from "@/hooks/useFHEEncryption";

const UniversityAdminPanel = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState<"student" | "diploma">("student");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const { isDecrypting } = useFHEEncryption();

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      alert("Please enter search criteria");
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate search for diplomas
      // In a real implementation, this would query the contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = [
        {
          diplomaId: "12345",
          studentId: "STU001",
          studentName: "John Smith",
          universityName: "Harvard University",
          degreeName: "Master of Computer Science",
          major: "Computer Science",
          issueDate: "2023-05-15",
          isVerified: false,
          encryptedData: {
            gpa: "3.8",
            graduationYear: "2023",
            degreeType: "Master",
            isApproved: true
          }
        },
        {
          diplomaId: "12346", 
          studentId: "STU002",
          studentName: "Jane Doe",
          universityName: "MIT",
          degreeName: "Bachelor of Engineering",
          major: "Electrical Engineering",
          issueDate: "2023-06-20",
          isVerified: true,
          encryptedData: {
            gpa: "3.9",
            graduationYear: "2023",
            degreeType: "Bachelor",
            isApproved: true
          }
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerifyDiploma = async (diplomaId: string, approved: boolean) => {
    setIsVerifying(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the diploma status
      setSearchResults(prev => 
        prev.map(diploma => 
          diploma.diplomaId === diplomaId 
            ? { ...diploma, isVerified: approved }
            : diploma
        )
      );
      
      alert(`Diploma ${diplomaId} ${approved ? 'verified' : 'rejected'} successfully`);
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDecryptData = async (diploma: any) => {
    if (!instance) {
      alert("FHE instance not available");
      return;
    }

    try {
      // Simulate FHE decryption
      // In a real implementation, this would use FHE to decrypt the data
      console.log("Decrypting data for diploma:", diploma.diplomaId);
      console.log("Decrypted data:", diploma.encryptedData);
      
      setSelectedDiploma(diploma);
      alert("Data decrypted successfully! (In a real implementation, this would show decrypted data)");
    } catch (error) {
      console.error("Decryption failed:", error);
      alert("Decryption failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="p-6 bg-gradient-certificate border-certificate-border shadow-certificate">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-full">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-academic-navy">University Admin Panel</h3>
              <p className="text-sm text-muted-foreground">
                Search, decrypt, and verify student credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Search Type</Label>
              <Select value={searchType} onValueChange={(value: "student" | "diploma") => setSearchType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">By Student ID</SelectItem>
                  <SelectItem value="diploma">By Diploma ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">
                {searchType === "student" ? "Student ID" : "Diploma ID"}
              </Label>
              <Input
                placeholder={searchType === "student" ? "STU001" : "12345"}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                variant="academic" 
                onClick={handleSearch}
                disabled={!searchInput || isSearching}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3 text-academic-gold" />
            <span>Full access to encrypted data for verification purposes</span>
          </div>
        </div>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="p-6 bg-gradient-certificate border-2 border-academic-gold shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-academic-navy">Search Results</h4>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {searchResults.length} found
              </Badge>
            </div>

            <div className="space-y-3">
              {searchResults.map((diploma, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-certificate-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-full">
                        <GraduationCap className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-academic-navy">{diploma.studentName}</h5>
                        <p className="text-sm text-muted-foreground">{diploma.studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={diploma.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {diploma.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">University</span>
                      <p className="text-sm font-semibold">{diploma.universityName}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Degree</span>
                      <p className="text-sm font-semibold">{diploma.degreeName}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Major</span>
                      <p className="text-sm font-semibold">{diploma.major}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Issue Date</span>
                      <p className="text-sm font-semibold">{diploma.issueDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDecryptData(diploma)}
                    >
                      <Unlock className="w-3 h-3 mr-1" />
                      Decrypt Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyDiploma(diploma.diplomaId, true)}
                      disabled={diploma.isVerified || isVerifying}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyDiploma(diploma.diplomaId, false)}
                      disabled={isVerifying}
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Decrypted Data Modal */}
      {selectedDiploma && (
        <Card className="p-6 bg-gradient-certificate border-2 border-academic-gold shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-academic-navy">Decrypted Data</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDiploma(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">GPA</span>
                  <p className="text-sm font-semibold">{selectedDiploma.encryptedData.gpa}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Graduation Year</span>
                  <p className="text-sm font-semibold">{selectedDiploma.encryptedData.graduationYear}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Degree Type</span>
                  <p className="text-sm font-semibold">{selectedDiploma.encryptedData.degreeType}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Approval Status</span>
                  <p className="text-sm font-semibold text-green-600">
                    {selectedDiploma.encryptedData.isApproved ? "Approved" : "Not Approved"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-certificate-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3 text-academic-gold" />
                <span>Data decrypted using FHE for verification purposes only</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UniversityAdminPanel;
