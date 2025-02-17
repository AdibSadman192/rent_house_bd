import React from 'react';
import { Container, Typography } from '@mui/material';
import CreatePost from '../components/feed/CreatePost';
import FeedList from '../components/feed/FeedList';
import withAuth from '../components/withAuth';

const FeedPage = () => {
  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6">
        News Feed
      </Typography>
      
      <CreatePost />
      <FeedList />
    </Container>
  );
};

// Protect the feed page with authentication
export default withAuth(FeedPage);