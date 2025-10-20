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
import { useGetAllUniversities, useGetDiplomaPublicData, useGetDiplomaEncryptedData, useFHEDiplomaVault, useVerifyDiploma } from "@/hooks/useContract";

interface UniversityAdminPanelProps {
  signer?: any;
}

const UniversityAdminPanel = ({ signer }: UniversityAdminPanelProps) => {
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
  const { contractAddress } = useFHEDiplomaVault();
  const { verifyDiploma, isPending: isVerifyingContract, isConfirmed, error: verifyError } = useVerifyDiploma();
  
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
            // Convert BigInt to number for timestamp
            const issueTimestamp = typeof diplomaData[7] === 'bigint' 
              ? Number(diplomaData[7]) 
              : Number(diplomaData[7]);
            
            const result = {
              diplomaId: i.toString(),
              studentId: diplomaData[1], // studentId is at index 1
              studentName: `Student ${diplomaData[1]}`,
              universityName: diplomaData[2], // universityName is at index 2
              degreeName: diplomaData[3], // degreeName is at index 3
              major: diplomaData[4], // major is at index 4
              issueDate: issueTimestamp > 0 ? new Date(issueTimestamp * 1000).toLocaleDateString() : 'Invalid Date',
              isVerified: diplomaData[8], // isVerified is at index 8
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
      
      // Get contract address from CONTRACT_ADDRESSES
      const { CONTRACT_ADDRESSES } = await import('@/lib/contracts');
      const contractAddress = CONTRACT_ADDRESSES[11155111]?.FHEDiplomaVault; // sepolia chain ID
      
      if (!contractAddress) {
        console.error("❌ Contract address not configured. Please set VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS in environment variables.");
        return null;
      }
      
      // Use wagmi's useReadContract hook dynamically
      // We need to make a direct contract call since we can't use hooks in async functions
      const { readContract } = await import('wagmi/actions');
      const { getPublicClient } = await import('wagmi');
      const { createPublicClient, http } = await import('viem');
      const { sepolia } = await import('viem/chains');
      
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http('https://1rpc.io/sepolia')
      });
      
      const result = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            "inputs": [{"name": "_diplomaId", "type": "uint256"}],
            "name": "getDiplomaPublicData",
            "outputs": [
              {"name": "diplomaId", "type": "uint256"},
              {"name": "studentId", "type": "string"},
              {"name": "universityName", "type": "string"},
              {"name": "degreeName", "type": "string"},
              {"name": "major", "type": "string"},
              {"name": "ipfsHash", "type": "string"},
              {"name": "studentAddress", "type": "address"},
              {"name": "issueDate", "type": "uint256"},
              {"name": "isVerified", "type": "bool"}
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: 'getDiplomaPublicData',
        args: [BigInt(diplomaId)]
      });
      
      console.log(`📊 Real contract data for diploma ${diplomaId}:`, result);
      return result;
    } catch (error) {
      console.log(`No diploma found with ID ${diplomaId}:`, error.message);
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
          // Convert BigInt to number for timestamp
          const issueTimestamp = typeof publicData[7] === 'bigint' 
            ? Number(publicData[7]) 
            : Number(publicData[7]);
          
          const result = {
            diplomaId: diplomaId.toString(),
            studentId: publicData[1], // studentId is at index 1
            studentName: `Student ${publicData[1]}`, // We don't have student names in the contract
            universityName: publicData[2], // universityName is at index 2
            degreeName: publicData[3], // degreeName is at index 3
            major: publicData[4], // major is at index 4
            issueDate: issueTimestamp > 0 ? new Date(issueTimestamp * 1000).toLocaleDateString() : 'Invalid Date',
            isVerified: publicData[8], // isVerified is at index 8
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
      
      // Call the contract's verifyDiploma function
      await verifyDiploma(Number(diplomaId), approved, verificationNotes);
      
      console.log(`✅ Diploma ${diplomaId} verification transaction submitted`);
      
      // Update the diploma status locally after successful transaction
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
    console.log("🔓 Decrypting data for diploma:", diploma.diplomaId);
    
    if (!instance || !address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Get encrypted data from contract using the hook
      const { CONTRACT_ADDRESSES } = await import('@/lib/contracts');
      const contractAddress = CONTRACT_ADDRESSES[11155111]?.FHEDiplomaVault;
      
      if (!contractAddress) {
        alert('Contract address not configured');
        return;
      }

      // Get encrypted data from contract using direct call
      const { createPublicClient, http } = await import('viem');
      const { sepolia } = await import('viem/chains');
      
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http('https://1rpc.io/sepolia')
      });

      // Call the contract directly with minimal ABI
      const encryptedData = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            "inputs": [{"name": "_diplomaId", "type": "uint256"}],
            "name": "getDiplomaEncryptedData",
            "outputs": [
              {"name": "encryptedGpa", "type": "bytes32"},
              {"name": "encryptedGraduationYear", "type": "bytes32"},
              {"name": "encryptedDegreeType", "type": "bytes32"}
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ] as const,
        functionName: 'getDiplomaEncryptedData',
        args: [BigInt(diploma.diplomaId)],
        authorizationList: undefined
      });

      console.log('Encrypted data from contract:', encryptedData);

      // Create keypair for decryption (following aidwell-connect pattern)
      const keypair = instance.generateKeypair();
      console.log('Generated keypair:', keypair);

      // Prepare handle-contract pairs
      const handleContractPairs = [
        { handle: encryptedData[0], contractAddress }, // GPA
        { handle: encryptedData[1], contractAddress }, // Graduation Year
        { handle: encryptedData[2], contractAddress }, // Degree Type
      ];

      console.log('Handle-contract pairs:', handleContractPairs);

      // Create EIP712 signature (following aidwell-connect pattern)
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [contractAddress];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      console.log('EIP712 signature data:', eip712);

      // Get signer and create signature
      if (!signer) {
        throw new Error('Signer not available');
      }

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      );

      console.log('Signature created:', signature);

      // Decrypt the data with proper parameters
      const decryptedResult = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays
      );
      
      console.log('Decrypted result:', decryptedResult);
      
      // Extract decrypted values from result object
      const gpa = decryptedResult[encryptedData[0]]?.toString() || '0';
      const graduationYear = decryptedResult[encryptedData[1]]?.toString() || '0';
      const degreeType = decryptedResult[encryptedData[2]]?.toString() || '0';

      console.log('Extracted values:', { gpa, graduationYear, degreeType });
      
      // Update the diploma with decrypted data
      const decryptedData = {
        gpa: gpa,
        graduationYear: graduationYear,
        degreeType: degreeType,
        isApproved: "Approved" // This field is not encrypted in the current contract
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
                      disabled={diploma.isVerified || isVerifying || isVerifyingContract}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {isVerifyingContract ? "Verifying..." : "Verify"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyDiploma(diploma.diplomaId, false)}
                      disabled={isVerifying || isVerifyingContract}
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {isVerifyingContract ? "Rejecting..." : "Reject"}
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
