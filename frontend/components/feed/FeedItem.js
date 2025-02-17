import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardActions, Typography, IconButton, Avatar } from '@mui/material';
import { FavoriteBorder, Favorite, Comment, Share } from '@mui/icons-material';

const FeedItem = ({ post }) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post?.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    // TODO: Implement API call to update like status
  };

  const handleComment = () => {
    // TODO: Implement comment functionality
  };

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="p-4 flex items-center">
        <Avatar src={post?.author?.avatar} alt={post?.author?.name} />
        <div className="ml-3">
          <Typography variant="subtitle1" className="font-semibold">
            {post?.author?.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {new Date(post?.createdAt).toLocaleDateString()}
          </Typography>
        </div>
      </div>

      {post?.content && (
        <CardContent>
          <Typography variant="body1">{post.content}</Typography>
        </CardContent>
      )}

      {post?.image && (
        <div className="relative w-full h-[400px]">
          <Image
            src={post.image}
            alt="Post image"
            layout="fill"
            objectFit="cover"
            className="cursor-pointer"
          />
        </div>
      )}

      <CardActions className="flex justify-between px-4 py-2">
        <div className="flex items-center">
          <IconButton onClick={handleLike} color={liked ? 'primary' : 'default'}>
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2">{likeCount}</Typography>
        </div>

        <IconButton onClick={handleComment}>
          <Comment />
        </IconButton>

        <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default FeedItem;