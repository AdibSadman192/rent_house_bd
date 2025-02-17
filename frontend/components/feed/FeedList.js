import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import FeedItem from './FeedItem';
import useInfiniteScroll from 'react-infinite-scroll-hook';

const FeedList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState(null);

  const loadMore = async () => {
    if (loading) return;

    try {
      setLoading(true);
      // TODO: Implement API call to fetch more posts
      // const response = await fetchPosts(posts.length);
      // setPosts([...posts, ...response.data]);
      // setHasNextPage(response.hasMore);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: '0px 0px 400px 0px',
  });

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  if (error) {
    return (
      <Box className="text-center text-red-500 py-4">
        {error}
      </Box>
    );
  }

  return (
    <Box className="max-w-2xl mx-auto py-4">
      {posts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
      {(loading || hasNextPage) && (
        <Box ref={sentryRef} className="flex justify-center py-4">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default FeedList;