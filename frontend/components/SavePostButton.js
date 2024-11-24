import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function SavePostButton({ postId }) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch('/api/v1/saved-posts', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.data.some(saved => saved.postId._id === postId));
        } else {
          throw new Error('Failed to check saved status');
        }
      } catch (err) {
        setError('Failed to check if post is saved');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkIfSaved();
    }
  }, [user, postId]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/v1/saved-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          postId,
          notes: note
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      setIsSaved(true);
      setShowNoteDialog(false);
      setNote('');
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to save post');
      setShowError(true);
    }
  };

  const handleUnsave = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/v1/saved-posts', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          postId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to unsave post');
      }

      setIsSaved(false);
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to unsave post');
      setShowError(true);
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <Tooltip title={isSaved ? "Remove from saved" : "Save post"}>
        <IconButton
          onClick={isSaved ? handleUnsave : () => setShowNoteDialog(true)}
          color={isSaved ? "primary" : "default"}
        >
          {isSaved ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </Tooltip>

      <Dialog open={showNoteDialog} onClose={() => setShowNoteDialog(false)}>
        <DialogTitle>Add a Note (Optional)</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this property..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoteDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save Post
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          {isSaved ? 'Post saved successfully' : 'Post removed from saved'}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SavePostButton;
