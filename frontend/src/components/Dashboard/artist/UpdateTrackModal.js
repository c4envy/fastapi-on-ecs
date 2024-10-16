import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Stack,
  Box,
  Tooltip,
  Switch,
  Image,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, MinusIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../services/axios';

const UpdateTrackModal = ({ track, onUpdate, onClose }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(track.image || '');
  const toast = useToast();

  const handlePlatformChange = (index, key, value) => {
    const updatedPlatforms = [...track.streaming_platforms];
    updatedPlatforms[index][key] = value;
    setValue(`updateTrackDetails.streaming_platforms[${index}].${key}`, value);
  };

  const handleAddPlatform = () => {
    const updatedPlatforms = [...track.streaming_platforms, { id: '', platform: '' }];
    setValue('updateTrackDetails.streaming_platforms', updatedPlatforms);
  };

  const handleRemovePlatform = (index) => {
    const updatedPlatforms = [...track.streaming_platforms];
    updatedPlatforms.splice(index, 1);
    setValue('updateTrackDetails.streaming_platforms', updatedPlatforms);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast({
        title: 'No file selected',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axiosInstance.post(`/music/upload/file?artist=${track.artist_name}`, formData);
      const imageUrl = response.data;
      return imageUrl;
    } catch (error) {
      toast({
        title: 'Error Uploading Image',
        description: error.message,
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
      throw error;
    }
  };

  const onSubmit = async (data) => {
    let imageUrl = track.image;

    if (imageFile) {
      try {
        imageUrl = await handleImageUpload();
      } catch (error) {
        return;
      }
    }

    const formData = {
      ...data.updateTrackDetails,
      image: imageUrl,
      streaming_platforms: data.updateTrackDetails.streaming_platforms
    };
    formData.release_date = new Date(formData.release_date).toISOString();
    onUpdate(track.track_id, formData);
    onClose();
  };

  const onOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <>
      <Tooltip label='Edit' fontSize='md'>
        <IconButton
          icon={<EditIcon />}
          colorScheme="primary"
          size="sm"
          onClick={onOpen}
          aria-label={`Update ${track.track_name}`}
          mr={2}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Track</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={4} isInvalid={errors.updateTrackDetails?.artist_name}>
                <FormLabel>Artist Name</FormLabel>
                <Input
                  type="text"
                  {...register('updateTrackDetails.artist_name', { required: true })}
                  defaultValue={track.artist_name}
                  variant="light"
                  size="sm"
                />
                <FormErrorMessage>{errors.updateTrackDetails?.artist_name && "Artist name is required"}</FormErrorMessage>
              </FormControl>
              <FormControl mb={4} isInvalid={errors.updateTrackDetails?.track_name}>
                <FormLabel>Track Name</FormLabel>
                <Input
                  type="text"
                  {...register('updateTrackDetails.track_name', { required: true })}
                  defaultValue={track.track_name}
                  variant="light"
                  size="sm"
                />
                <FormErrorMessage>{errors.updateTrackDetails?.track_name && "Track name is required"}</FormErrorMessage>
              </FormControl>
              <FormControl mb={4} isInvalid={errors.updateTrackDetails?.album_name}>
                <FormLabel>Album Name</FormLabel>
                <Input
                  type="text"
                  {...register('updateTrackDetails.album_name', { required: true })}
                  defaultValue={track.album_name}
                  variant="light"
                  size="sm"
                />
                <FormErrorMessage>{errors.updateTrackDetails?.album_name && "Album name is required"}</FormErrorMessage>
              </FormControl>
              <FormControl mb={4} isInvalid={errors.updateTrackDetails?.album_type}>
                <FormLabel>Album Type</FormLabel>
                <Select
                  {...register('updateTrackDetails.album_type', { required: true })}
                  defaultValue={track.album_type}
                  variant="light"
                  size="sm"
                >
                  <option value="single">Single</option>
                  <option value="album">Album</option>
                  <option value="ep">EP</option>
                </Select>
                <FormErrorMessage>{errors.updateTrackDetails?.album_type && "Album type is required"}</FormErrorMessage>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Album Cover</FormLabel>
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={track.track_name}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                    mb={2}
                  />
                )}
                <Input
                  type="file"
                  onChange={handleFileChange}
                  variant="light"
                  size="sm"
                />
              </FormControl>
              <FormControl mb={4} isInvalid={errors.updateTrackDetails?.release_date}>
                <FormLabel>Release Date</FormLabel>
                <Input
                  type="date"
                  {...register('updateTrackDetails.release_date', { required: true })}
                  defaultValue={track.release_date.split("T")[0]}
                  variant="light"
                  size="sm"
                />
                <FormErrorMessage>{errors.updateTrackDetails?.release_date && "Release date is required"}</FormErrorMessage>
              </FormControl>
              <FormControl mb={4} isInvalid={errors.updateTrackDetails?.price_per_share}>
                <FormLabel>Price per Share</FormLabel>
                <Input
                  type="number"
                  {...register('updateTrackDetails.price_per_share', { required: true })}
                  defaultValue={track.price_per_share}
                  variant="light"
                  size="sm"
                />
                <FormErrorMessage>{errors.updateTrackDetails?.price_per_share && "Price per share is required"}</FormErrorMessage>
              </FormControl>
              <FormControl mb={4} isInvalid={errors.updateTrackDetails?.share_limit}>
                <FormLabel>Share Limit</FormLabel>
                <Input
                  type="number"
                  {...register('updateTrackDetails.share_limit', { required: true })}
                  defaultValue={track.share_limit}
                  variant="light"
                  size="sm"
                />
                <FormErrorMessage>{errors.updateTrackDetails?.share_limit && "Share limit is required"}</FormErrorMessage>
              </FormControl>
              {/* <FormControl mb={4}>
                <FormLabel>Disabled</FormLabel>
                <Switch
                  isChecked={track.disabled}
                  {...register('updateTrackDetails.disabled')}
                  onChange={(e) => setValue('updateTrackDetails.disabled', e.target.checked)}
                  size="sm"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Featured</FormLabel>
                <Switch
                  isChecked={track.featured}
                  {...register('updateTrackDetails.featured')}
                  onChange={(e) => setValue('updateTrackDetails.featured', e.target.checked)}
                  size="sm"
                />
              </FormControl> */}
              <FormControl mb={4}>
                <FormLabel>Streaming Platforms</FormLabel>
                <Stack spacing={2}>
                  {track.streaming_platforms.map((platform, index) => (
                    <Box key={index} display="flex" alignItems="center">
                      <Input
                        flex="3"
                        mr={2}
                        {...register(`updateTrackDetails.streaming_platforms[${index}].id`)}
                        defaultValue={platform.id}
                        onChange={(e) => handlePlatformChange(index, 'id', e.target.value)}
                        placeholder="Platform ID"
                        variant="light"
                        size="sm"
                      />
                      <Input
                        flex="3"
                        mr={2}
                        {...register(`updateTrackDetails.streaming_platforms[${index}].platform`)}
                        defaultValue={platform.platform}
                        onChange={(e) => handlePlatformChange(index, 'platform', e.target.value)}
                        placeholder="Platform Name"
                        size="sm"
                        variant="light"
                      />
                      <IconButton
                        flex="1"
                        colorScheme="red"
                        icon={<MinusIcon />}
                        size="sm"
                        onClick={() => handleRemovePlatform(index)}
                        aria-label={`Remove platform ${index}`}
                      />
                    </Box>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="primary"
                    size="sm"
                    onClick={handleAddPlatform}
                  >
                    Add Platform
                  </Button>
                </Stack>
              </FormControl>
              <ModalFooter>
                <Button colorScheme="primary" type="submit" mr={3}>
                  Update
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </ModalFooter>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateTrackModal;
