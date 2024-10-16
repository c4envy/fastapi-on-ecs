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
import axiosInstance from '../../../services/axios';
import { useAuth } from '../../../hooks/useAuth';

const FanProfile = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();
  const toast = useToast();
  const auth = useAuth();
  const fanData = auth.user
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(fanData.image_url);

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
      const response = await axiosInstance.post(`/music/upload/file?fan=${fanData.firstnames}`, formData);
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
        ...fanData,
        ...values,
        image: imageUrl || fanData.image || null,
      };

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

  return (
    <Flex direction="column" alignItems="center" rounded={6} p={6} color="primary.100">
      <Heading mb={6} color="dark.900">Edit Fan Profile</Heading>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.fan_name}>
            <FormLabel>First Name</FormLabel>
            <Input
              placeholder="Fan Name"
              variant="filled"
              defaultValue={fanData.firstname}
              {...register('firstname', {
                required: 'Fan name is required',
              })}
            />
            <FormErrorMessage>{errors.firstname && errors.firstname.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.image}>
            <FormLabel>Profile Image</FormLabel>
            <Image src={imagePreview} alt="Add Profile Image" boxSize="200px" objectFit="cover" mb={4} />
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

export default FanProfile;