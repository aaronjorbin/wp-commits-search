import React from 'react';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  resultsPerPage: number;
};

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  resultsPerPage
}) => {
  if (totalResults <= resultsPerPage) return null;

  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow'
        }`}
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow'
        }`}
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700 font-medium bg-gray-50 rounded-lg border border-gray-200">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow'
        }`}
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow'
        }`}
      >
        Last
      </button>
    </div>
  );
}; 