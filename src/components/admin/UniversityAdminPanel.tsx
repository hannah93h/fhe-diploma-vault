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
import { useGetAllUniversities, useGetDiplomaPublicData, useGetDiplomaEncryptedData } from "@/hooks/useContract";

const UniversityAdminPanel = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState<"student" | "diploma">("student");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const { isDecrypting } = useFHEEncryption();
  
  // Contract hooks
  const { data: universities } = useGetAllUniversities();
  
  // Load recent diplomas on component mount
  useEffect(() => {
    loadRecentDiplomas();
  }, []);
  
  // Function to load recent diplomas
  const loadRecentDiplomas = async () => {
    setIsLoadingRecent(true);
    
    try {
      console.log("📚 Loading recent diplomas...");
      
      // For now, we'll load diplomas with IDs 0-9 (assuming there are at least 10 diplomas)
      // In a real implementation, we would need a contract function to get recent diplomas
      const recentDiplomas = [];
      
      for (let i = 0; i < 10; i++) {
        try {
          const diplomaData = await getDiplomaPublicData(i);
          if (diplomaData) {
            const result = {
              diplomaId: i.toString(),
              studentId: diplomaData.studentId,
              studentName: `Student ${diplomaData.studentId}`,
              universityName: diplomaData.universityName,
              degreeName: diplomaData.degreeName,
              major: diplomaData.major,
              issueDate: new Date(Number(diplomaData.issueDate) * 1000).toLocaleDateString(),
              isVerified: diplomaData.isVerified,
              encryptedData: {
                gpa: "Encrypted",
                graduationYear: "Encrypted",
                degreeType: "Encrypted",
                isApproved: "Encrypted"
              }
            };
            recentDiplomas.push(result);
          }
        } catch (error) {
          console.log(`No diploma found with ID ${i}`);
          // Continue to next ID
        }
      }
      
      setSearchResults(recentDiplomas);
      console.log(`✅ Loaded ${recentDiplomas.length} recent diplomas`);
    } catch (error) {
      console.error("Error loading recent diplomas:", error);
    } finally {
      setIsLoadingRecent(false);
    }
  };
  
  // Function to get diploma data from contract
  const getDiplomaPublicData = async (diplomaId: number) => {
    try {
      console.log(`Getting diploma ${diplomaId} data from contract...`);
      
      // For now, we'll simulate getting data from contract
      // In a real implementation, we would use the useGetDiplomaPublicData hook
      // But since we need to call it dynamically, we'll need to implement a different approach
      
      // Simulate contract call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data for now - in real implementation, this would come from contract
      return {
        diplomaId: diplomaId,
        studentId: `STU${diplomaId.toString().padStart(3, '0')}`,
        universityName: "Harvard University",
        degreeName: "Bachelor of Science",
        major: "Computer Science",
        ipfsHash: "QmHash123...",
        studentAddress: "0x1234567890123456789012345678901234567890",
        issueDate: BigInt(Math.floor(Date.now() / 1000) - 86400 * 30), // 30 days ago
        isVerified: false
      };
    } catch (error) {
      console.error("Error getting diploma data:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      alert("Please enter search criteria");
      return;
    }

    setIsSearching(true);
    
    try {
      console.log(`🔍 Searching for ${searchType}: ${searchInput}`);
      
      // For now, we'll search by diploma ID since we don't have a search by student ID function
      // In a real implementation, we would need to add search functions to the contract
      if (searchType === "diploma") {
        const diplomaId = parseInt(searchInput);
        if (isNaN(diplomaId)) {
          alert("Please enter a valid diploma ID number");
          return;
        }
        
        // Get diploma public data from contract
        const publicData = await getDiplomaPublicData(diplomaId);
        console.log(`📊 Public data for diploma ${diplomaId}:`, publicData);
        
        if (publicData) {
          const result = {
            diplomaId: diplomaId.toString(),
            studentId: publicData.studentId,
            studentName: `Student ${publicData.studentId}`, // We don't have student names in the contract
            universityName: publicData.universityName,
            degreeName: publicData.degreeName,
            major: publicData.major,
            issueDate: new Date(Number(publicData.issueDate) * 1000).toLocaleDateString(),
            isVerified: publicData.isVerified,
            encryptedData: {
              gpa: "Encrypted", // Will be decrypted when needed
              graduationYear: "Encrypted",
              degreeType: "Encrypted",
              isApproved: "Encrypted"
            }
          };
          
          setSearchResults([result]);
        } else {
          setSearchResults([]);
          alert("No diploma found with that ID");
        }
      } else {
        // Search by student ID - for now, we'll show a message that this feature needs to be implemented
        alert("Search by student ID is not yet implemented. Please use diploma ID search.");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed: " + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerifyDiploma = async (diplomaId: string, approved: boolean) => {
    setIsVerifying(true);
    
    try {
      console.log(`🔍 Verifying diploma ${diplomaId}: ${approved ? 'approved' : 'rejected'}`);
      
      // In a real implementation, this would call the contract's verifyDiploma function
      // For now, we'll simulate the verification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the diploma status locally
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
      alert("Verification failed: " + error.message);
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
      console.log("🔓 Decrypting data for diploma:", diploma.diplomaId);
      
      // In a real implementation, this would:
      // 1. Get encrypted data from contract using getDiplomaEncryptedData
      // 2. Use FHE instance to decrypt the data
      // 3. Display the decrypted values
      
      // For now, we'll simulate the decryption process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const decryptedData = {
        gpa: "3.8",
        graduationYear: "2023",
        degreeType: "Bachelor",
        isApproved: "Approved"
      };
      
      const updatedDiploma = {
        ...diploma,
        encryptedData: decryptedData
      };
      
      setSelectedDiploma(updatedDiploma);
      console.log("✅ Data decrypted successfully:", decryptedData);
    } catch (error) {
      console.error("Decryption failed:", error);
      alert("Decryption failed: " + error.message);
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

            <div className="flex items-end gap-2">
              <Button 
                variant="academic" 
                onClick={handleSearch}
                disabled={!searchInput || isSearching}
                className="flex-1"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
              <Button 
                variant="outline" 
                onClick={loadRecentDiplomas}
                disabled={isLoadingRecent}
                className="flex-1"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                {isLoadingRecent ? "Loading..." : "Load Recent"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3 text-academic-gold" />
            <span>Full access to encrypted data for verification purposes</span>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {(isLoadingRecent || isSearching) && (
        <Card className="p-6 bg-gradient-certificate border-2 border-academic-gold shadow-elegant">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-academic-navy"></div>
            <span className="text-academic-navy font-medium">
              {isLoadingRecent ? "Loading recent diplomas..." : "Searching..."}
            </span>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !isLoadingRecent && !isSearching && (
        <Card className="p-6 bg-gradient-certificate border-2 border-academic-gold shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-academic-navy">Recent Diplomas</h4>
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
