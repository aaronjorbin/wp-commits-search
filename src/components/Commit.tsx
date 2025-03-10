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
    <li className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
      <div>
        <p className="text-xl font-medium mb-3 leading-relaxed">
          <a 
            href={`https://core.trac.wordpress.org/changeset/${doc.id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold mr-3 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
           r{doc.id}
          </a> 
          {formatMessageWithLinks(messageLines[0], searchQuery)}
        </p>
        {messageLines.slice(1).map((line, index) => (
          <p key={index} className="text-gray-600 mb-2 pl-4 border-l-2 border-gray-200">
            {formatMessageWithLinks(line, searchQuery)}
          </p>
        ))}
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Author:</span>{' '}
            <span className="text-gray-900">{searchQuery ? highlightText(doc.author, searchQuery) : doc.author}</span>
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Date:</span>{' '}
            <span className="text-gray-900">{doc.date && formatDate(doc.date)}</span>
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setShowFiles(!showFiles)}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <span className="transform transition-transform duration-200" style={{ display: 'inline-block', transform: showFiles ? 'rotate(90deg)' : 'none' }}>
              ▶
            </span>
            {doc.files.length} file{doc.files.length === 1 ? '' : 's'}
          </button>
          {showFiles && (
            <ul className="mt-3 pl-6 space-y-1 border-l-2 border-blue-100">
              {doc.files.map((file, index) => (
                <li key={index} className="text-gray-700 hover:text-gray-900">
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