import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  useToast,
  Avatar,
  Flex,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import axios from 'axios';

const Review = ({ propertyId, existingReviews = [], onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/reviews', {
        propertyId,
        rating,
        comment,
      });

      toast({
        title: 'Success',
        description: 'Review submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setRating(0);
      setComment('');
      
      if (onReviewAdded) {
        onReviewAdded(response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit review',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ReviewStars = ({ rating, onHover, onClick, interactive = false }) => (
    <HStack spacing={1}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Icon
          key={index}
          as={StarIcon}
          boxSize={interactive ? 6 : 4}
          color={index <= (hoverRating || rating) ? 'yellow.400' : 'gray.300'}
          cursor={interactive ? 'pointer' : 'default'}
          onMouseEnter={interactive ? () => onHover(index) : undefined}
          onMouseLeave={interactive ? () => onHover(0) : undefined}
          onClick={interactive ? () => onClick(index) : undefined}
        />
      ))}
    </HStack>
  );

  const ReviewCard = ({ review }) => (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
      w="100%"
    >
      <HStack spacing={4} mb={2}>
        <Avatar size="sm" name={review.userName} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold">{review.userName}</Text>
          <Text fontSize="sm" color="gray.500">
            {format(new Date(review.createdAt), 'MMM d, yyyy')}
          </Text>
        </VStack>
      </HStack>
      
      <ReviewStars rating={review.rating} />
      
      <Text mt={2}>{review.comment}</Text>
    </Box>
  );

  return (
    <VStack spacing={6} align="stretch" w="100%">
      <Box
        p={6}
        borderWidth={1}
        borderRadius="lg"
        bg={bgColor}
        borderColor={borderColor}
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Write a Review
        </Text>
        
        <VStack spacing={4} align="start">
          <Box>
            <Text mb={2}>Rating</Text>
            <ReviewStars
              rating={rating}
              onHover={setHoverRating}
              onClick={setRating}
              interactive
            />
          </Box>

          <Box w="100%">
            <Text mb={2}>Comment</Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              size="md"
              resize="vertical"
            />
          </Box>

          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            alignSelf="flex-end"
          >
            Submit Review
          </Button>
        </VStack>
      </Box>

      {existingReviews.length > 0 && (
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold">
            Reviews ({existingReviews.length})
          </Text>
          {existingReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default Review;
