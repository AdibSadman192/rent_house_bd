import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, IconButton, Avatar, Box } from '@mui/material';
import { Image as ImageIcon, Close } from '@mui/icons-material';
import Image from 'next/image';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    try {
      // TODO: Implement API call to create post
      // const formData = new FormData();
      // formData.append('content', content);
      // if (image) formData.append('image', image);
      // await createPost(formData);

      // Reset form
      setContent('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar />
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="outlined"
                className="mb-4"
              />

              {imagePreview && (
                <Box className="relative w-full h-[200px] mb-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <IconButton
                    className="absolute top-2 right-2 bg-white"
                    size="small"
                    onClick={removeImage}
                  >
                    <Close />
                  </IconButton>
                </Box>
              )}

              <div className="flex justify-between items-center">
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <IconButton component="span" color="primary">
                    <ImageIcon />
                  </IconButton>
                </label>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!content.trim() && !image}
                >
                  Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;