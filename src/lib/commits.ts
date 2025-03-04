// @ts-expect-error flexsearch is not typed
import Document from "flexsearch/dist/module/document";
// @ts-expect-error flexsearch is not typed
import { encode } from "flexsearch/dist/module/lang/latin/advanced";

export type Commit = {
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

const index = new Document({
  document: {
    id: "id",
    index: [{
      field: "text",
      tokenize: "forward",
      encode
    }],
    store: ["message", "author", "date", "id", "files"],
  }
});

export const loadCommits = async (): Promise<{ error?: string; totalCommits?: number }> => {
  try {
    const response = await fetch('/wp-commits-search/commits.json');
    if (!response.ok) {
      throw new Error('Failed to load commits data');
    }
    const commitsArray: Commit[] = await response.json();
    commitsArray.forEach((commit) => {
      commit.text = `${commit.message} ${commit.author} ${commit.date} ${commit.id} ${commit.files.join(' ')}`;
      index.add(commit);
    });
    return { totalCommits: commitsArray.length };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to load commits data' };
  }
};

export const searchCommits = (query: string): Commit[] => {
  const results = index.search(query, { limit: 100000, enrich: true });

  if (results.length === 0 || results[0].result.length === 0) {
    return [];
  }

  // Sort results by ID in descending order (newest first)
  return results[0].result.sort((a: Commit, b: Commit) => {
    return parseInt(b.doc?.id || '0') - parseInt(a.doc?.id || '0');
  });
}; 