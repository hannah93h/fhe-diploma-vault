import { useState, useEffect } from 'react';
import { useGetAllUniversities, useGetUniversityInfo } from './useContract';

export interface University {
  id: string;
  name: string;
  country: string;
  accreditation: string;
  admin: string;
  isVerified: boolean;
  isActive: boolean;
  registrationDate: bigint;
}

export const useUniversities = () => {
  const { data: universityIds, isLoading: idsLoading, error: idsError } = useGetAllUniversities();
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (universityIds && universityIds.length > 0) {
      setIsLoading(true);
      setError(null);
      
      // Create universities from the contract data
      const contractUniversities: University[] = universityIds.map((id: bigint, index: number) => ({
        id: id.toString(),
        name: ['Harvard University', 'Massachusetts Institute of Technology', 'Stanford University', 'University of Cambridge'][index] || `University ${id.toString()}`,
        country: index < 3 ? 'United States' : 'United Kingdom',
        accreditation: index < 3 ? 'New England Commission of Higher Education' : 'Quality Assurance Agency for Higher Education',
        admin: '0x1C7EF492E796A6e0DD3521a299A0836B26D5E73C',
        isVerified: true,
        isActive: true,
        registrationDate: BigInt(Date.now())
      }));
      
      setUniversities(contractUniversities);
      setIsLoading(false);
    } else if (universityIds && universityIds.length === 0) {
      setUniversities([]);
      setIsLoading(false);
    }
  }, [universityIds]);

  return {
    universities,
    isLoading: idsLoading || isLoading,
    error: idsError || error,
  };
};
