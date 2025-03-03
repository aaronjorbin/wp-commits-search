import { useEffect, useState, useCallback } from "react";

// @ts-expect-error flexsearch is not typed
import Document from "flexsearch/dist/module/document";

// import the commits.json file from the root of the project
import commits from "../commits.json";
import { Commit } from "./components/Commit";
import { PaginationControls } from "./components/PaginationControls";
import { SearchControls } from "./components/SearchControls";

const index = new Document({
  document: {
      id: "id",
      index: ["text", "date"],
      store: ["message", "author", "date", "id", "files"],
  }
});

type Commit = {
  id: number;
  message: string;
  author: string;
  date: string;
  text?: string;
  files: string[];
  doc?: {
    id: string;
    message: string;
    author: string;
    date: string;
    files: string[];
  };
};

// Helper function to update URL without triggering a page reload
const updateUrlParams = (query: string, page: number) => {
  const url = new URL(window.location.href);
  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }
  if (page > 1) {
    url.searchParams.set('p', page.toString());
  } else {
    url.searchParams.delete('p');
  }
  window.history.pushState({}, '', url);
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Commit[]>([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Initialize from URL params
  useEffect(() => {
    const url = new URL(window.location.href);
    const urlQuery = url.searchParams.get('q');
    const urlPage = url.searchParams.get('p');

    if (urlQuery) {
      setQuery(urlQuery);
    }
    if (urlPage) {
      setCurrentPage(parseInt(urlPage));
    }

    const loadCommits = async () => {
      const commitsArray: Commit[] = commits as Commit[];
      commitsArray.forEach((commit) => {
        commit.text = `${commit.message} ${commit.author} ${commit.date} ${commit.id} ${commit.files.join(' ')}`;
        index.add(commit);
      });
      console.log( 'commits loaded' );
      setLoading(false);
    };

    loadCommits();
  }, []);

  const handleSearch = useCallback(( currentPage?: number ) => {
    setSearching(true);
    setCurrentPage(currentPage || 1); // Reset to first page on new search
    const results = index.search(query, { limit: 100000, enrich: true });

    if ( results.length === 0 || results[0].result.length === 0 ) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    // Sort results by ID in descending order (newest first)
    const sortedResults = results[0].result.sort((a: Commit, b: Commit) => {
      return parseInt(b.doc?.id || '0') - parseInt(a.doc?.id || '0');
    });

    setSearchResults(sortedResults);
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

  useEffect(() => {
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = searchResults.slice(startIndex, startIndex + resultsPerPage);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">Search WordPress Core Commits</h1>
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
              <ul className="space-y-4">
                {paginatedResults.map((commit) => (
                  <Commit key={commit.doc?.id} doc={commit.doc} />
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
          <footer className="mt-8 text-center text-gray-600">
            Made with ❤️ by{' '}
            <a 
              href="https://aaron.jorb.in"
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aaron Jorbin
            </a>
          </footer>
        </div>
      )}
    </>
  );
} 