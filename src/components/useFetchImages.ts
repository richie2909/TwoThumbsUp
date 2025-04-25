import { useState, useCallback } from 'react';
import { ImageType } from '../Context/context';

interface ApiResponse {
  img: ImageType[];
  totalPages?: number;
  currentPage?: number;
  totalImages?: number;
}

export const useFetchImages = (setPhoto: (photos: ImageType[]) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(
    async (
      filter: string = '',
      sortBy: string = 'name',
      sortOrder: string = 'asc',
      limit: number = 12,
      page: number = 1
    ) => {
      setLoading(true);
      setPageLoading(true);
      setError(null);
      
      try {
        let url = '/img';
        const params = new URLSearchParams();
        
        if (filter) params.append('search', filter);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);
        if (limit) params.append('limit', limit.toString());
        params.append('page', page.toString());
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        console.log('Fetching images from:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json: ApiResponse = await response.json();
        
        if (json && Array.isArray(json.img)) {
          setPhoto(json.img);
          setTotalPages(json.totalPages || 1);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load images');
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    },
    [setPhoto]
  );

  return { fetchData, loading, pageLoading, totalPages, error };
};
