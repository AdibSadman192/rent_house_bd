import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Avatar, List, ListItem } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Group = ({ group }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Fetch group members
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/groups/${group.id}/members`);
        const data = await response.json();
        setMembers(data.members);
        setIsJoined(data.members.some(member => member.id === user?.id));
      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    };

    if (group?.id) {
      fetchMembers();
    }
  }, [group?.id, user?.id]);

  const handleJoinGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${group.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (response.ok) {
        setIsJoined(true);
        // Refresh members list
        const updatedMembers = [...members, user];
        setMembers(updatedMembers);
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  return (
    <Card className="p-4 mb-4 shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar src={group.avatar} alt={group.name} className="w-12 h-12" />
          <div>
            <Typography variant="h6" className="font-semibold">
              {group.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {group.description}
            </Typography>
          </div>
        </div>
        {!isJoined && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinGroup}
            className="px-6 py-2"
          >
            Join Group
          </Button>
        )}
      </div>

      <div className="mt-4">
        <Typography variant="subtitle1" className="mb-2 font-semibold">
          Members ({members.length})
        </Typography>
        <List className="max-h-60 overflow-y-auto">
          {members.map((member) => (
            <ListItem key={member.id} className="py-2">
              <div className="flex items-center space-x-3">
                <Avatar src={member.avatar} alt={member.name} />
                <Typography variant="body1">{member.name}</Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </Card>
  );
};

export default Group;