/**
 * Updates URL query parameters without triggering a page reload
 */
export const updateUrlParams = (query: string, page: number) => {
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

/**
 * Gets the initial URL parameters for search query and page
 */
export const getInitialUrlParams = (): { query: string | null; page: number | null } => {
  const url = new URL(window.location.href);
  const query = url.searchParams.get('q');
  const page = url.searchParams.get('p');

  return {
    query,
    page: page ? parseInt(page) : null
  };
}; 