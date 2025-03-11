import React from 'react';

interface FilterPanelProps {
  textFilter: string;
  onTextFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: string;
  onSortByChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOrder: string;
  onSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  textFilter,
  onTextFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Text Filter */}
      <input
        type="text"
        placeholder="Search by name..."
        value={textFilter}
        onChange={onTextFilterChange}
        className="w-full sm:max-w-xs px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      {/* Dropdown for sort field */}
      <select
        value={sortBy}
        onChange={onSortByChange}
        className="w-full sm:max-w-xs px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="name">Name</option>
        <option value="dateCreated">Date Created</option>
      </select>
      {/* Dropdown for sort order */}
      <select
        value={sortOrder}
        onChange={onSortOrderChange}
        className="w-full sm:max-w-xs px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default React.memo(FilterPanel);
