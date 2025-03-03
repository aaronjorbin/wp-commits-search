import React from 'react';

interface SearchControlsProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  searching: boolean;
  resultsCount: number | null;
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  query,
  onQueryChange,
  onSearch,
  searching,
  resultsCount
}) => {
  return (
    <div>
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          defaultValue={query}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !searching) {
              console.log( 'enter', e.key );
              onQueryChange( e.currentTarget.value ); 
              onSearch();
            }
          }}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your search query..."
          disabled={searching}
        />
        <button 
          onClick={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            onQueryChange(input.value);
            onSearch();
          }}
          disabled={searching}
          className={`px-6 py-2 rounded-lg transition-colors ${
            searching 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searching && (
        <p className="text-gray-600 mb-4">
          Searching...
        </p>
      )}
      
      {!searching && query && (resultsCount === 0 || resultsCount === null) && (
        <div className="text-center text-gray-600 mb-4">
          <p className="mb-2">No commits found matching "{query}"</p>
          <p>Try different keywords or check your spelling</p>
        </div>
      )}
      
      {!searching && resultsCount !== null && resultsCount > 0 && (
        <p className="text-gray-600 mb-4">
          Found {resultsCount.toLocaleString()} commit{resultsCount === 1 ? '' : 's'} for "{query}"
        </p>
      )}
    </div>
  );
}; 