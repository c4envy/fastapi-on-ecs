import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Heading,
  useToast,
  Flex,
  Divider,
  Image,
  Stack,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { Select as ChakraSelect } from 'chakra-react-select';
import axiosInstance from '../../../services/axios';
import { useAuth } from '../../../hooks/useAuth';

const ArtistProfile = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control,
  } = useForm();
  const toast = useToast();
  const auth = useAuth();
  const artistData = auth.user.account.profile;
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(artistData.image_url);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
      const response = await axiosInstance.post(`/music/upload/file?artist=${artistData.artist_name}`, formData);
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

  const onSubmit = async (values) => {

    
    try {
      setIsLoading(true);
      const imageUrl = await handleImageUpload();
      const updatedProfile = {
        ...artistData,
        ...values,
        image: imageUrl || artistData.image,
        genres: values.genres.map((genre) => genre.value), // Extract values from selected options
      };
      console.log(updatedProfile)
      // Send updated profile to the server
      await axiosInstance.put(`/users/update/user`, updatedProfile);

      toast({
        title: 'Profile updated successfully.',
        status: 'success',
        isClosable: true,
        duration: 3000,
      });

      // Clear form fields after successful update
      reset();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'An error occurred while updating profile.',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const genres = [
    'Rock', 'Hard Rock', 'Soft Rock', 'Progressive Rock', 'Punk Rock', 'Alternative Rock',
    'Jazz', 'Bebop', 'Swing', 'Fusion', 'Free Jazz', 'Smooth Jazz',
    'Classical', 'Baroque', 'Romantic', 'Modern', 'Classical Period', 'Contemporary Classical',
    'Hip Hop', 'Rap', 'Trap', 'Gangsta Rap', 'Conscious Hip Hop', 'East Coast Hip Hop', 'West Coast Hip Hop',
    'Electronic', 'House', 'Techno', 'Dubstep', 'Trance', 'Drum and Bass', 'Ambient',
    'Pop', 'Teen Pop', 'Dance Pop', 'Synth-pop', 'Electropop', 'Pop Rock',
    'R&B', 'Contemporary R&B', 'Soul', 'Funk', 'Disco', 'New Jack Swing',
    'Country', 'Bluegrass', 'Honky Tonk', 'Outlaw Country', 'Country Pop', 'Alternative Country',
    'Reggae', 'Roots Reggae', 'Dub', 'Dancehall', 'Ska', 'Rocksteady'
  ].map(genre => ({ value: genre, label: genre }));

  return (
    <Flex direction="column" alignItems="center" rounded={6} p={6} color="primary.100">
      <Heading mb={6} color="dark.900">Edit Artist Profile</Heading>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.artist_name}>
            <FormLabel>Artist Name</FormLabel>
            <Input
              placeholder="Artist Name"
              variant="filled"
              defaultValue={artistData.artist_name}
              {...register('artist_name', {
                required: 'Artist name is required',
              })}
            />
            <FormErrorMessage>{errors.artist_name && errors.artist_name.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.genres}>
            <FormLabel>Genres</FormLabel>
            <Controller
              name="genres"
              control={control}
              defaultValue={artistData.genres.map(genre => ({ value: genre, label: genre }))}
              rules={{ required: 'Genres are required' }}
              render={({ field }) => (
                <ChakraSelect
                  {...field}
                  isMulti
                  options={genres}
                  placeholder="Select genres"
                  closeMenuOnSelect={false}
                  variant="filled"
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
            
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    
                    }),
                    dropdownIndicator: (provided, state) => ({
                      ...provided,
                      background: "dark.900",
                      color:"dark.100",
                      p: 0,
                      w: "40px",
                    }),
                  }}
                />
              )}
            />
            <FormErrorMessage>{errors.genres && errors.genres.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.image}>
            <FormLabel>Profile Image</FormLabel>
            <Image src={imagePreview} alt="Artist Image" boxSize="200px" objectFit="cover" mb={4} />
            <Flex alignItems="center">
              <Input
                type="file"
                accept="image/*"
                display="none"
                id="file-upload"
                onChange={handleImageChange}
              />
              <Button as="label" htmlFor="file-upload" variant="solid" colorScheme="teal" mr={4}>
                Choose File
              </Button>
            </Flex>
            <FormErrorMessage>{errors.image && errors.image.message}</FormErrorMessage>
          </FormControl>
          <Divider my={6} />
          <FormControl isInvalid={errors.password}>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              placeholder="New Password"
              variant="filled"
              {...register('password', {
                minLength: {
                  value: 5,
                  message: 'Password must be at least 5 characters long',
                },
                maxLength: {
                  value: 24,
                  message: 'Password must be at most 24 characters',
                },
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm Password"
              variant="filled"
              {...register('confirmPassword', {
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
            />
            <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isLoading}
            loadingText="Updating..."
            type="submit"
          >
            Update Profile
          </Button>
        </Stack>
      </form>
    </Flex>
  );
};

export default ArtistProfile;
