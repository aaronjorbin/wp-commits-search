import { useState } from 'react';

type CommitProps = {
  doc?: {
    id: string;
    message: string;
    author: string;
    date: string;
    files: string[];
  };
  searchQuery?: string;
};

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor(seconds / 2592000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60);

  if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  });
  
  return `${formattedDate} (${timeAgo(date)})`;
};

const highlightText = (text: string, searchQuery: string) => {
  if (!searchQuery) return text;
  
  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === searchQuery.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 rounded-sm">{part}</mark>
    ) : part
  );
};

const formatMessageWithLinks = (text: string, searchQuery?: string) => {
  // First split on both patterns
  const parts = text.split(/(\[?\d+\]|#\d+)/g);
  return parts.map((part, index) => {
    // Check for ticket numbers (#1234)
    const ticketMatch = part.match(/^#(\d+)$/);
    if (ticketMatch) {
      return (
        <a
          key={index}
          href={`https://core.trac.wordpress.org/ticket/${ticketMatch[1]}`}
          className="text-blue-500 hover:text-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }

    // Check for changeset references ([1234])
    const changesetMatch = part.match(/^\[(\d+)\]$/);
    if (changesetMatch) {
      return (
        <a
          key={index}
          href={`https://core.trac.wordpress.org/changeset/${changesetMatch[1]}`}
          className="text-blue-500 hover:text-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }

    return searchQuery ? highlightText(part, searchQuery) : part;
  });
};

export const Commit = ({ doc, searchQuery }: CommitProps) => {
  const [showFiles, setShowFiles] = useState(false);

  if (!doc) return null;

  const messageLines = doc.message.split('\n');

  return (
    <li className="p-4 border rounded-lg hover:bg-gray-50">
      <div>
        <p className="text-lg font-medium mb-2">
          <a 
            href={`https://core.trac.wordpress.org/changeset/${doc.id}`}
            className="text-blue-500 hover:text-blue-600 mr-2"
            target="_blank"
            rel="noopener noreferrer"
          >
           r{doc.id}
          </a> 
          {formatMessageWithLinks(messageLines[0], searchQuery)}
        </p>
        {messageLines.slice(1).map((line, index) => (
          <p key={index} className="text-sm mb-1">
            {formatMessageWithLinks(line, searchQuery)}
          </p>
        ))}
        <div className="text-sm text-gray-600 mt-2">
          <p className="mb-1">Author: {searchQuery ? highlightText(doc.author, searchQuery) : doc.author}</p>
          <p>Date: {doc.date && formatDate(doc.date)}</p>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setShowFiles(!showFiles)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              {showFiles ? '▼' : '▶'} {doc.files.length} file{doc.files.length === 1 ? '' : 's'}
            </button>
          </div>
          {showFiles && (
            <ul className="mt-1 ml-4 space-y-1">
              {doc.files.map((file, index) => (
                <li key={index} className="text-gray-600">
                  {searchQuery ? highlightText(file, searchQuery) : file}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}; 