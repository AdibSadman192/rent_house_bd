import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Group from './Group';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-4">Loading groups...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="mb-8">
        <Typography variant="h4" component="h1" className="mb-6">
          Community Groups
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="mb-4"
        />
      </div>

      <Grid container spacing={3}>
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Grid item xs={12} key={group.id}>
              <Group group={group} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" className="text-center text-gray-500">
              No groups found matching your search.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default GroupList;