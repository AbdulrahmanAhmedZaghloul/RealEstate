import { useState } from 'react';

export const useCursorPagination = () => {
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [allListings, setAllListings] = useState([]);

  const loadNextPage = (newData) => {
    if (!newData.data.pagination.has_more) {
      setHasMore(false);
    }
    setCursor(newData.data.pagination.next_cursor);
    setAllListings((prev) => [...prev, ...newData.data.listings]);
  };

  return {
    cursor,
    hasMore,
    allListings,
    setAllListings,
    loadNextPage,
  };
};