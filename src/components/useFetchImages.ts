import { useState, useCallback } from 'react';
import { ImageType } from '../Context/context';

interface ApiResponse {
  img: ImageType[];
}

export const useFetchImages = (setPhoto: (photos: ImageType[]) => void) => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const fetchData = useCallback(
    async (
      filter: string = '',
      sortBy: string = 'name',
      sortOrder: string = 'asc',
      limit?: number
    ) => {
      setLoading(true);
      setPageLoading(true);
      try {
        let url = '/img';
        const params = new URLSearchParams();
        if (filter) {
          params.append('search', filter);
        }
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        if (sortOrder) {
          params.append('sortOrder', sortOrder);
        }
        if (limit) {
          params.append('limit', limit.toString());
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        console.log('Fetching from URL:', url); // Debug: Check final URL
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: ApiResponse = await response.json();
        if (json && json.img) {
          setPhoto(json.img);
        } else {
          console.error('Error: JSON data is invalid or missing img property.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    },
    [setPhoto]
  );

  return { fetchData, loading, pageLoading };
};
