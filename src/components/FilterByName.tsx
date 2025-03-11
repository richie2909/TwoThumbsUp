import React from 'react';

interface FilterByNameProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterByName: React.FC<FilterByNameProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Filter by name..."
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  );
};

export default React.memo(FilterByName);
