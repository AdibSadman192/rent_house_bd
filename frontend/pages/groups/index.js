import React from 'react';
import { Container } from '@mui/material';
import Layout from '../../components/layout/Layout';
import GroupList from '../../components/social/GroupList';
import withAuth from '../../components/withAuth';

const GroupsPage = () => {
  return (
    <Layout>
      <Container maxWidth="lg" className="py-8">
        <GroupList />
      </Container>
    </Layout>
  );
};

// Protect the groups page with authentication
export default withAuth(GroupsPage);