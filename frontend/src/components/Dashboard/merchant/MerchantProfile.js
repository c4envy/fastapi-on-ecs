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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../services/axios';
import { useAuth } from '../../../hooks/useAuth';


const MerchantProfile = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm();
  const toast = useToast();
  let auth = useAuth()
  let merchantData = auth.user.account.profile
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const updatedProfile = {
        ...merchantData,
        ...values,
      };

      // Send updated profile to the server
      await axiosInstance.put(`/users/${merchantData.id}`, updatedProfile);

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
    <Flex
      direction="column"
      alignItems="center"
      rounded={6}
    >
      <Heading mb={6}>Edit Merchant Profile</Heading>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FormControl isInvalid={errors.merchant_name} mb={4}>
          <FormLabel>Merchant Name</FormLabel>
          <Input
            placeholder="Merchant Name"
            defaultValue={merchantData.merchant_name}
            {...register('merchant_name', {
              required: 'Merchant name is required',
            })}
          />
          <FormErrorMessage>
            {errors.merchant_name && errors.merchant_name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email} mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            defaultValue={merchantData.email}
            {...register('email', {
              required: 'Email is required',
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.address} mb={4}>
          <FormLabel>Address</FormLabel>
          <Input
            placeholder="Address"
            defaultValue={merchantData.address}
            {...register('address', {
              required: 'Address is required',
            })}
          />
          <FormErrorMessage>
            {errors.address && errors.address.message}
          </FormErrorMessage>
        </FormControl>
        {/* Add more profile fields as needed */}
        <Divider my={6} />
        <FormControl isInvalid={errors.password} mb={4}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            placeholder="New Password"
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
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.confirmPassword} mb={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            })}
          />
          <FormErrorMessage>
            {errors.confirmPassword && errors.confirmPassword.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          colorScheme="blue"
          isLoading={isLoading}
          loadingText="Updating..."
          type="submit"
        >
          Update Profile
        </Button>
      </form>
    </Flex>
  );
};

export default MerchantProfile;
