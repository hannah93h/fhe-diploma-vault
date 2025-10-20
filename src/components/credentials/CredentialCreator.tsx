import { useState } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDiplomaManagement } from '@/hooks/useDiplomaManagement';
import { useZamaInstance } from '@/hooks/useZamaInstance';
import { useAdminCreateDiploma } from '@/hooks/useContract';
import { useAccount } from 'wagmi';
import { GraduationCap, Plus, Shield } from 'lucide-react';

interface CredentialCreatorProps {
  onCredentialCreated?: () => void;
}

const CredentialCreator: React.FC<CredentialCreatorProps> = ({ onCredentialCreated }) => {
  const { createDiploma } = useDiplomaManagement();
  const { instance, isLoading: fheLoading } = useZamaInstance();
  const { adminCreateDiploma, isPending, isConfirming, isConfirmed, error } = useAdminCreateDiploma();
  const { address } = useAccount();
  
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    graduationYear: '',
    gpa: '',
    degreeType: '',
    universityName: '',
    degreeName: '',
    major: '',
    ipfsHash: '',
    studentAddress: '',
    universityAddress: '',
  });

  // University options
  const universityOptions = [
    { name: 'Harvard University', address: '0x1234567890123456789012345678901234567890' },
    { name: 'Massachusetts Institute of Technology', address: '0x2345678901234567890123456789012345678901' },
    { name: 'Stanford University', address: '0x3456789012345678901234567890123456789012' },
    { name: 'University of Cambridge', address: '0x4567890123456789012345678901234567890123' },
  ];

  // Degree options
  const degreeOptions = [
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Engineering',
    'Master of Science in Computer Science',
    'Master of Science in Engineering',
    'Master of Business Administration',
    'Doctor of Philosophy in Computer Science',
    'Doctor of Philosophy in Engineering',
  ];

  // Major options
  const majorOptions = [
    'Computer Science',
    'Computer Engineering',
    'Software Engineering',
    'Data Science',
    'Artificial Intelligence',
    'Cybersecurity',
    'Information Technology',
    'Mathematics',
    'Physics',
    'Business Administration',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instance) {
      alert('FHE encryption service not available');
      return;
    }

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    setIsCreating(true);
    
    try {
      // Create encrypted input using FHE
      const contractAddress = import.meta.env.VITE_DIPLOMA_VAULT_CONTRACT_ADDRESS;
      if (!contractAddress) {
        alert('Contract address not configured');
        return;
      }
      const input = instance.createEncryptedInput(contractAddress, address);
      
      // Add encrypted values
      input.add32(parseInt(formData.studentId));
      input.add32(parseInt(formData.graduationYear));
      input.add32(Math.round(parseFloat(formData.gpa) * 10)); // Convert to integer for FHE
      input.add8(parseInt(formData.degreeType));
      
      const encryptedInput = await input.encrypt();
      
      // Calculate expiry date (10 years from now)
      const expiryDate = BigInt(Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60));
      
      const txHash = await adminCreateDiploma(
        formData.studentAddress as `0x${string}`,
        formData.universityAddress as `0x${string}`,
        formData.degreeName,
        formData.major,
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.handles[2],
        encryptedInput.handles[3],
        expiryDate,
        formData.ipfsHash,
        encryptedInput.inputProof
      );
      
      alert(`Diploma created successfully! Transaction: ${txHash}`);
      
      // Reset form
      setFormData({
        studentId: '',
        graduationYear: '',
        gpa: '',
        degreeType: '',
        universityName: '',
        degreeName: '',
        major: '',
        ipfsHash: '',
        studentAddress: '',
        universityAddress: '',
      });
      
      onCredentialCreated?.();
    } catch (error) {
      console.error('Failed to create diploma:', error);
      alert('Failed to create diploma. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUniversityChange = (universityName: string) => {
    const university = universityOptions.find(u => u.name === universityName);
    setFormData(prev => ({ 
      ...prev, 
      universityName,
      universityAddress: university?.address || ''
    }));
  };

  return (
    <Card className="p-6 bg-gradient-certificate border-certificate-border shadow-certificate">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-lg">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-academic-navy">Create New Credential</h3>
          <p className="text-muted-foreground">Issue a new encrypted diploma or transcript</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              type="number"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              placeholder="Enter student ID"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              value={formData.graduationYear}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              placeholder="e.g., 2023"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              type="number"
              step="0.1"
              value={formData.gpa}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
              placeholder="e.g., 3.8"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="degreeType">Degree Type</Label>
            <Select value={formData.degreeType} onValueChange={(value) => handleInputChange('degreeType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select degree type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Bachelor's Degree</SelectItem>
                <SelectItem value="2">Master's Degree</SelectItem>
                <SelectItem value="3">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="universityName">University Name</Label>
            <Select value={formData.universityName} onValueChange={handleUniversityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {universityOptions.map((university) => (
                  <SelectItem key={university.name} value={university.name}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="degreeName">Degree Name</Label>
            <Select value={formData.degreeName} onValueChange={(value) => handleInputChange('degreeName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                {degreeOptions.map((degree) => (
                  <SelectItem key={degree} value={degree}>
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Select value={formData.major} onValueChange={(value) => handleInputChange('major', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select major" />
              </SelectTrigger>
              <SelectContent>
                {majorOptions.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ipfsHash">IPFS Hash</Label>
            <Input
              id="ipfsHash"
              value={formData.ipfsHash}
              onChange={(e) => handleInputChange('ipfsHash', e.target.value)}
              placeholder="QmHash..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="studentAddress">Student Address</Label>
            <Input
              id="studentAddress"
              value={formData.studentAddress}
              onChange={(e) => handleInputChange('studentAddress', e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="universityAddress">University Address</Label>
            <Input
              id="universityAddress"
              value={formData.universityAddress}
              onChange={(e) => handleInputChange('universityAddress', e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button
            type="submit"
            variant="certificate"
            disabled={fheLoading || isCreating || isPending || isConfirming || !instance}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            {fheLoading ? 'Initializing FHE...' : 
             isCreating || isPending ? 'Creating...' : 
             isConfirming ? 'Confirming...' : 
             'Create Encrypted Credential'}
          </Button>
          
          {!instance && (
            <p className="text-sm text-muted-foreground">
              FHE encryption service is required to create credentials
            </p>
          )}
        </div>
      </form>
    </Card>
  );
};

export default CredentialCreator;
