import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Card from '../components/Card';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {query ? `Search results for "${query}"` : "Search results"}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Card filter={query} />
        </div>
      </div>
    </div>
  );
}

export default Search;
