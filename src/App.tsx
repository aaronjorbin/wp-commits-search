import React, { useEffect, useState } from "react";

// @ts-ignore
import Document from "flexsearch/dist/module/document";

// import the commits.json file from the root of the project
import commits from "../commits.json";
import { Commit } from "./components/Commit";

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
}
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Commit[]>([]);
  const [query, setQuery] = useState("");

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

  const handleSearch = () => {
    const results = index.search(query, { limit: 100000, enrich: true });

    // Sort results by ID in descending order (newest first)
    const sortedResults = results[0].result.sort((a: Commit, b: Commit) => {
      return parseInt(b.doc?.id || '0') - parseInt(a.doc?.id || '0');
    });

    setSearchResults(sortedResults);
  };

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your search query..."
            />
            <button 
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
          <ul className="space-y-4">
            {searchResults.map((commit) => (
              <Commit key={commit.doc?.id} doc={commit.doc} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
} 