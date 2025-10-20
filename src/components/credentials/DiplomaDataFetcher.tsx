import { useEffect, useState } from 'react';
import { useGetDiplomaPublicData } from '@/hooks/useContract';

interface DiplomaDataFetcherProps {
  diplomaId: number;
  onDataLoaded: (data: any) => void;
}

export const DiplomaDataFetcher = ({ diplomaId, onDataLoaded }: DiplomaDataFetcherProps) => {
  const { data: publicData, isLoading, error } = useGetDiplomaPublicData(BigInt(diplomaId));

  useEffect(() => {
    if (publicData && !isLoading && !error) {
      console.log(`📊 Fetched real data for diploma ${diplomaId}:`, publicData);
      onDataLoaded({
        diplomaId: Number(publicData.diplomaId),
        studentId: publicData.studentId,
        universityName: publicData.universityName,
        degreeName: publicData.degreeName,
        major: publicData.major,
        ipfsHash: publicData.ipfsHash,
        studentAddress: publicData.studentAddress,
        issueDate: Number(publicData.issueDate),
        isVerified: publicData.isVerified
      });
    }
  }, [publicData, isLoading, error, diplomaId, onDataLoaded]);

  return null; // This component doesn't render anything
};
