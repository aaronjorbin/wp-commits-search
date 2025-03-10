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
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          defaultValue={query}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !searching) {
              console.log('enter', e.key);
              onQueryChange(e.currentTarget.value);
              onSearch();
            }
          }}
          className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-lg transition-all duration-200 placeholder:text-gray-400"
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
          className={`px-8 py-3 rounded-xl font-semibold text-lg shadow-sm transition-all duration-200 
            ${searching
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md active:transform active:scale-95'
            }`}
        >
          {searching ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching...
            </span>
          ) : 'Search'}
        </button>
      </div>

      {searching && (
        <div className="text-center text-gray-600 mb-6 animate-pulse">
          <p className="text-lg">Searching through commits...</p>
        </div>
      )}

      {!searching && query && (resultsCount === 0 || resultsCount === null) && (
        <div className="text-center mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xl text-gray-800 mb-2">No commits found matching "<span className="font-semibold">{query}</span>"</p>
          <p className="text-gray-600">Try different keywords or check your spelling</p>
        </div>
      )}

      {!searching && resultsCount !== null && resultsCount > 0 && (
        <div className="text-center mb-6">
          <p className="text-xl text-gray-800">
            Found <span className="font-semibold">{resultsCount.toLocaleString()}</span> commit{resultsCount === 1 ? '' : 's'} for "<span className="font-semibold">{query}</span>"
          </p>
        </div>
      )}
    </div>
  );
}; 