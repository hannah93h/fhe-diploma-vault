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
  });

  // Simple university options
  const universityOptions = [
    'Harvard University',
    'Massachusetts Institute of Technology', 
    'Stanford University',
    'University of Cambridge',
    'Oxford University',
    'Yale University',
    'Princeton University',
    'Columbia University'
  ];

  // Degree options
  const degreeOptions = [
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Engineering',
    'Master of Science in Computer Science',
    'Master of Science in Engineering',
    'Master of Business Administration',
    'Doctor of Philosophy',
    'Bachelor of Arts',
    'Master of Arts'
  ];

  // Major options
  const majorOptions = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Psychology'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instance || !address) {
      alert('Please connect your wallet and ensure FHE instance is loaded');
      return;
    }

    if (!formData.studentId || !formData.universityName || !formData.degreeName) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    
    try {
      // Convert form data to the format expected by the contract
      const diplomaData = {
        studentId: formData.studentId,
        graduationYear: parseInt(formData.graduationYear) || 2023,
        gpa: Math.round(parseFloat(formData.gpa) * 10) || 38, // Convert to integer (3.8 -> 38)
        degreeType: formData.degreeType || 'Bachelor',
        universityName: formData.universityName,
        degreeName: formData.degreeName,
        major: formData.major,
        ipfsHash: formData.ipfsHash || 'QmDefaultHash',
        studentAddress: formData.studentAddress || address,
      };

      console.log('Creating diploma with data:', diplomaData);

      // Call the contract function
      const result = await adminCreateDiploma({
        args: [
          diplomaData.studentId,
          diplomaData.graduationYear,
          diplomaData.gpa,
          diplomaData.degreeType,
          diplomaData.universityName,
          diplomaData.degreeName,
          diplomaData.major,
          diplomaData.ipfsHash,
          diplomaData.studentAddress
        ]
      });

      console.log('Diploma creation result:', result);
      
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
      });

      alert('Credential created successfully! It will be encrypted and stored on-chain.');
      
      if (onCredentialCreated) {
        onCredentialCreated();
      }
    } catch (error) {
      console.error('Failed to create diploma:', error);
      alert(`Failed to create diploma: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-certificate border-certificate-border shadow-certificate">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-academic-navy to-primary rounded-full">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-academic-navy">Create New Credential</h3>
            <p className="text-sm text-muted-foreground">Create an encrypted educational credential</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="Enter student ID"
                required
              />
            </div>

            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                placeholder="2023"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                placeholder="3.8"
              />
            </div>

            <div>
              <Label htmlFor="degreeType">Degree Type</Label>
              <Select value={formData.degreeType} onValueChange={(value) => handleInputChange('degreeType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor">Bachelor</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                  <SelectItem value="Associate">Associate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="universityName">University Name *</Label>
            <Select value={formData.universityName} onValueChange={(value) => handleInputChange('universityName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {universityOptions.map((university) => (
                  <SelectItem key={university} value={university}>
                    {university}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="degreeName">Degree Name *</Label>
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

          <div>
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

          <div>
            <Label htmlFor="studentAddress">Student Address</Label>
            <Input
              id="studentAddress"
              value={formData.studentAddress}
              onChange={(e) => handleInputChange('studentAddress', e.target.value)}
              placeholder={address || "Enter student wallet address"}
            />
          </div>

          <div>
            <Label htmlFor="ipfsHash">IPFS Hash (Optional)</Label>
            <Input
              id="ipfsHash"
              value={formData.ipfsHash}
              onChange={(e) => handleInputChange('ipfsHash', e.target.value)}
              placeholder="Qm..."
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-academic-gold" />
            <span>This credential will be encrypted using FHE and stored on-chain</span>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="academic"
              disabled={isCreating || isPending || isConfirming}
              className="flex-1"
            >
              {isCreating || isPending || isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isCreating ? 'Creating...' : isPending ? 'Pending...' : 'Confirming...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Credential
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">Error: {error.message}</p>
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};

export default CredentialCreator;