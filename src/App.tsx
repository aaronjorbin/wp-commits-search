import { useEffect, useState } from "react";

// @ts-ignore
import Document from "flexsearch/dist/module/document";

// import the commits.json file from the root of the project
import commits from "../commits.json";
import { Commit } from "./components/Commit";
import { PaginationControls } from "./components/PaginationControls";

const index = new Document({
  document: {
      id: "id",
      index: ["text", "date"],
      store: ["message", "author", "date", "id"],
  }
});

type Commit = {
  id: string;
  message: string;
  author: string;
  date: string;
  text: string;
  doc?: {
    id: string;
    message: string;
    author: string;
    date: string;
  };
};

const commitsArray: Commit[] = commits as Commit[];
commitsArray.forEach((commit) => {
  commit.text = `${commit.message} ${commit.author} ${commit.date}`;
  index.add(commit);
});

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
  }, []);

  // Perform initial search if query is present in URL
  useEffect(() => {
    if (query && !loading && !searchResults.length) {
      handleSearch(currentPage);
    }
  }, [loading, query]);

  // Update URL when page or query changes
  useEffect(() => {
    updateUrlParams(query, currentPage);
  }, [query, currentPage]);

  useEffect(() => {
    const loadCommits = async () => {
      const commitsArray: Commit[] = commits as Commit[];
      commitsArray.forEach((commit) => {
        index.add(commit);
      });
      setLoading(false);
    };

    loadCommits();
  }, []);

  const handleSearch = ( currentPage?: number ) => {
    setSearching(true);
    setCurrentPage(currentPage || 1); // Reset to first page on new search
    const results = index.search(query, { limit: 100000, enrich: true });

    // Sort results by ID in descending order (newest first)
    const sortedResults = results[0].result.sort((a: Commit, b: Commit) => {
      return parseInt(b.doc?.id || '0') - parseInt(a.doc?.id || '0');
    });

    setSearchResults(sortedResults);
    setSearching(false);
  };

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
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !searching) {
                  setQuery((e.target as HTMLInputElement).value);
                  handleSearch();
                }
              }}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your search query..."
              disabled={searching}
            />
            <button 
              onClick={() => handleSearch()}
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
          {!searching && searchResults.length > 0 && (
            <>
              <p className="text-gray-600 mb-4">
                Found {searchResults.length.toLocaleString()} commit{searchResults.length === 1 ? '' : 's'}
              </p>
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