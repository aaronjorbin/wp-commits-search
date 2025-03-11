import { useEffect, useState, useCallback } from "react";
import { Commit } from "./components/Commit";
import { PaginationControls } from "./components/PaginationControls";
import { SearchControls } from "./components/SearchControls";
import { loadCommits, searchCommits, type Commit as CommitType } from "./lib/commits";
import { updateUrlParams, getInitialUrlParams } from "./lib/url";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CommitType[]>([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [totalCommits, setTotalCommits] = useState<number | null>(null);
  const resultsPerPage = 10;

  // Initialize from URL params and load commits
  useEffect(() => {
    const { query: urlQuery, page: urlPage } = getInitialUrlParams();

    if (urlQuery) {
      setQuery(urlQuery);
    }
    if (urlPage) {
      setCurrentPage(urlPage);
    }

    const initializeCommits = async () => {
      const { error, totalCommits } = await loadCommits();
      if (error) {
        setError(error);
      }
      if (totalCommits) {
        setTotalCommits(totalCommits);
      }
      setLoading(false);
    };

    initializeCommits();
  }, []);

  const handleSearch = useCallback((currentPage?: number) => {
    setSearching(true);
    setCurrentPage(currentPage || 1); // Reset to first page on new search
    const results = searchCommits(query);
    setSearchResults(results);
    setSearching(false);
  }, [query]);

  // Perform initial search if query is present in URL
  useEffect(() => {
    if (query && !loading && !searchResults.length) {
      handleSearch(currentPage);
    }
  }, [loading, query, handleSearch, currentPage, searchResults.length]);

  // Update URL when page or query changes
  useEffect(() => {
    updateUrlParams(query, currentPage);
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = searchResults.slice(startIndex, startIndex + resultsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <header className="py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h1 className="text-4xl font-extrabold text-center mb-2 tracking-tight">
          Search WordPress Core Commits
        </h1>
        <p className="text-center text-blue-100 mt-4 text-lg font-light">
          Search {totalCommits ? (
            <span className="font-semibold">{totalCommits.toLocaleString()}</span>
          ) : "all"} commits to WordPress core in your browser
        </p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-6"></div>
              </div>
              <p className="text-lg text-gray-600">Loading commits data&hellip;</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-600 bg-red-50 px-6 py-4 rounded-lg border border-red-200">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <SearchControls
              query={query}
              onQueryChange={setQuery}
              onSearch={() => handleSearch()}
              searching={searching}
              resultsCount={searchResults.length || null}
            />
            {!searching && searchResults.length > 0 && (
              <>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalResults={searchResults.length}
                  resultsPerPage={resultsPerPage}
                />
                <ul className="space-y-6">
                  {paginatedResults.map((commit) => (
                    <Commit key={commit.doc?.id} doc={commit.doc} searchQuery={query} />
                  ))}
                </ul>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalResults={searchResults.length}
                  resultsPerPage={resultsPerPage}
                />
              </>
            )}
          </div>
        )}
      </main>
      <footer className="py-8 text-center text-gray-600 bg-white border-t border-gray-100">
        <p className="text-sm">
          Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
          <a 
            href="https://aaron.jorb.in"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aaron Jorbin
          </a>
        </p>
      </footer>
    </div>
  );
} 