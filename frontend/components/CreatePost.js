import { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Grid,
  GridItem,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Text,
  HStack,
  useColorModeValue,
  Image,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Map } from './Map';

const CreatePost = ({ initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [],
    images: [],
    ...initialData,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const propertyTypes = [
    'Apartment',
    'House',
    'Condo',
    'Townhouse',
    'Villa',
    'Studio',
  ];

  const amenitiesList = [
    'Air Conditioning',
    'Parking',
    'Swimming Pool',
    'Gym',
    'Balcony',
    'Furnished',
    'Pet Friendly',
    'Security System',
    'Elevator',
    'Laundry',
  ];

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...response.data.urls],
      }));

      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const endpoint = initialData
        ? `/api/posts/${initialData._id}`
        : '/api/posts';
      const method = initialData ? 'put' : 'post';

      const response = await axios[method](endpoint, formData);

      toast({
        title: 'Success',
        description: initialData
          ? 'Post updated successfully'
          : 'Post created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save post',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter property title"
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your property"
                rows={4}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Price ($/month)</FormLabel>
              <NumberInput
                value={formData.price}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, price: value }))
                }
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Property Type</FormLabel>
              <Select
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    propertyType: e.target.value,
                  }))
                }
                placeholder="Select property type"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Bedrooms</FormLabel>
              <NumberInput
                value={formData.bedrooms}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, bedrooms: value }))
                }
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Bathrooms</FormLabel>
              <NumberInput
                value={formData.bathrooms}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, bathrooms: value }))
                }
                min={0}
                step={0.5}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Area (sqft)</FormLabel>
              <NumberInput
                value={formData.area}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, area: value }))
                }
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Enter property location"
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Location on Map</FormLabel>
              <Box h="300px" borderRadius="md" overflow="hidden">
                <Map
                  center={formData.coordinates}
                  markers={[
                    {
                      position: formData.coordinates,
                      draggable: true,
                      onDragEnd: (e) =>
                        setFormData((prev) => ({
                          ...prev,
                          coordinates: {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                          },
                        })),
                    },
                  ]}
                />
              </Box>
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Amenities</FormLabel>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {amenitiesList.map((amenity) => (
                  <Checkbox
                    key={amenity}
                    isChecked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  >
                    {amenity}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Images</FormLabel>
              <Box
                {...getRootProps()}
                p={6}
                borderWidth={2}
                borderRadius="md"
                borderStyle="dashed"
                textAlign="center"
                cursor="pointer"
                bg={isDragActive ? 'gray.50' : 'transparent'}
                _hover={{ bg: 'gray.50' }}
              >
                <input {...getInputProps()} />
                <VStack spacing={2}>
                  <AddIcon />
                  <Text>
                    {isDragActive
                      ? 'Drop the files here'
                      : 'Drag & drop images here, or click to select files'}
                  </Text>
                </VStack>
              </Box>
            </FormControl>
          </GridItem>

          {formData.images.length > 0 && (
            <GridItem colSpan={2}>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {formData.images.map((image, index) => (
                  <Box key={index} position="relative">
                    <Image
                      src={image}
                      alt={`Property image ${index + 1}`}
                      borderRadius="md"
                      objectFit="cover"
                      w="100%"
                      h="150px"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="red"
                      onClick={() => handleImageDelete(index)}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </GridItem>
          )}
        </Grid>

        <HStack justify="flex-end" pt={4}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            isDisabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={submitting}
            loadingText="Saving"
          >
            {initialData ? 'Update Post' : 'Create Post'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CreatePost;
