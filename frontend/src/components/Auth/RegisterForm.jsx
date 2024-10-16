// // Inside the RegisterForm component

// import React, { useState } from 'react';
// import {
//   Button,
//   FormControl,
//   FormErrorMessage,
//   Input,
//   Heading,
//   useToast,
//   Flex,
// } from '@chakra-ui/react';
// import { useForm } from 'react-hook-form';
// import axiosInstance from '../../services/axios';
// import { useNavigate } from 'react-router-dom';
// import ArtistDetailsForm from './ArtistDetailsForm';
// import { FiEye, FiEyeOff } from 'react-icons/fi';


// const RegisterForm = ({ userType, onSuccess }) => {
//   const {
//     handleSubmit,
//     register,
//     formState: { errors, isSubmitting },
//     watch, // Watch function to watch form inputs
//   } = useForm();
//   const navigate = useNavigate();
//   const toast = useToast();

//   const [artistData, setArtistData] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);

//   const password = watch("password", "");

//   const onSubmit = async (values) => {
//     try {
//       // Depending on the userType, adjust the payload accordingly
//       let payload = { ...values, account_type: userType };

//       if (userType === 'artist' && artistData) {
//         payload = {
//           ...payload,
//           account: {
//             profile: {
//               artist_name: artistData.artist_name,
//               genres: artistData.genres,
//               artist_id: [artistData.artist_id],
//               image_url: artistData.image_url,
//             }
//           }
//         }
//       }

//       if (userType === 'merchant') {
//         // Additional adjustments for merchant type
//         payload = {
//           ...payload,
//           account: {
//             profile: {
//               company: values.company,
//               company_address: {
//                 street: values.street,
//                 city: values.city,
//                 state: values.state,
//                 country: values.country,
//                 postal_code: values.postal_code
//               },
//               business_type: values.business_type,
//               state_of_incorporation: values.state_of_incorporation,
//               registration_number: values.registration_number
//             }
//           }
//         };
//       }

//       if(userType === "fan"){
//         payload = {
//           ...payload,
//           account: {
//             profile:{
//               collection:[],
//               total_shares_owned:0,
//               total_revenue:0,
//               lifetime_revenue: 0
//             }
  
//           }
//         }
//       }
//       console.log(payload)
//       await axiosInstance.post('/users/create', payload);
//       toast({
//         title: 'Account created successfully.',
//         status: 'success',
//         isClosable: true,
//         duration: 1500,
//       });
//       onSuccess();
//     } catch (err) {
//       toast({
//         title: `${err.response.data.detail}`,
//         status: 'error',
//         isCloseable: true,
//         duration: 1500,
//       });
//     }
//   };

//   return (
//     <Flex
//       direction="column"
//       alignItems="center"
//       rounded={6}
//     >
//       <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
//         <FormControl isInvalid={errors.firstname} mt={3}>
//           <Input
//             placeholder="First Name"
//             type="text"
//             variant="filled"
//             {...register('firstname', {
//               required: 'This is a required field',
//             })}
//           />
//           <FormErrorMessage>
//             {errors.firstname && errors.firstname.message}
//           </FormErrorMessage>
//         </FormControl>

//         <FormControl isInvalid={errors.lastname} mt={3}>
//           <Input
//             placeholder="Last Name"
//             type="text"
//             variant="filled"
//             size="md"
//             {...register('lastname', {
//               required: 'This is a required field',
//             })}
//           />
//           <FormErrorMessage>
//             {errors.lastname && errors.lastname.message}
//           </FormErrorMessage>
//         </FormControl>

//         <FormControl isInvalid={errors.email} mt={3}>
//           <Input
//             placeholder="Email"
//             type="email"
//             variant="filled"
//             size="md"
//             {...register('email', {
//               required: 'This is a required field',
//             })}
//           />
//           <FormErrorMessage>
//             {errors.email && errors.email.message}
//           </FormErrorMessage>
//         </FormControl>

//         <FormControl isInvalid={errors.username} mt={3}>
//           <Input
//             placeholder="Username"
//             type="text"
//             variant="filled"
//             size="md"
//             {...register('username', {
//               required: 'This is a required field',
//               minLength: {
//                 value: 5,
//                 message: 'Username must be at least 5 characters',
//               },
//               maxLength: {
//                 value: 24,
//                 message: 'Username must be at most 24 characters',
//               },
//             })}
//           />
//           <FormErrorMessage>
//             {errors.username && errors.username.message}
//           </FormErrorMessage>
//         </FormControl>

//         <FormControl isInvalid={errors.password} mt={3}>
//           <Input
//             placeholder="Password"
//             type={showPassword ? "text" : "password"}
//             variant="filled"
//             size="md"
//             {...register('password', {
//               required: 'This is a required field',
//               minLength: {
//                 value: 5,
//                 message: 'Password must be at least 5 characters long',
//               },
//               maxLength: {
//                 value: 24,
//                 message: 'Password must be at most 24 characters',
//               },
//             })}
//           />
//           <Button
//             size="sm"
//             position="absolute"
//             right="8px"
//             top="50%"
//             transform="translateY(-50%)"
//             onClick={() => setShowPassword(!showPassword)}
//             variant="ghost"
//           >
//             {showPassword ? <FiEyeOff /> : <FiEye />}
//           </Button>
//           <FormErrorMessage>
//             {errors.password && errors.password.message}
//           </FormErrorMessage>
//         </FormControl>

//         <FormControl isInvalid={errors.confirmPassword} mt={3}>
//           <Input
//             placeholder="Confirm Password"
//             type="password"
//             variant="filled"
//             size="md"
//             {...register('confirmPassword', {
//               required: 'Please confirm your password',
//               validate: (value) => value === password || "Passwords do not match"
//             })}
//           />
//           <FormErrorMessage>
//             {errors.confirmPassword && errors.confirmPassword.message}
//           </FormErrorMessage>
//         </FormControl>

//         {userType === 'artist' && (
//           <ArtistDetailsForm setArtistData={setArtistData} artistData={artistData} />
//         )}

//         {userType === 'merchant' && (
//           <>
//             <FormControl isInvalid={errors.company} mt={3}>
//               <Input
//                 placeholder="Company"
//                 type="text"
//                 variant="filled"
//                 {...register('company', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.company && errors.company.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.street} mt={3}>
//               <Input
//                 placeholder="Street"
//                 type="text"
//                 variant="filled"
//                 {...register('street', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.street && errors.street.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.city} mt={3}>
//               <Input
//                 placeholder="City"
//                 type="text"
//                 variant="filled"
//                 {...register('city', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.city && errors.city.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.state} mt={3}>
//               <Input
//                 placeholder="State"
//                 type="text"
//                 variant="filled"
//                 {...register('state', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.state && errors.state.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.country} mt={3}>
//               <Input
//                 placeholder="Country"
//                 type="text"
//                 variant="filled"
//                 {...register('country', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.country && errors.country.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.postal_code} mt={3}>
//               <Input
//                 placeholder="Postal Code"
//                 type="text"
//                 variant="filled"
//                 {...register('postal_code', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.postal_code && errors.postal_code.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.business_type} mt={3}>
//               <Input
//                 placeholder="Business Type"
//                 type="text"
//                 variant="filled"
//                 {...register('business_type', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.business_type && errors.business_type.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.state_of_incorporation} mt={3}>
//               <Input
//                 placeholder="State of Incorporation"
//                 type="text"
//                 variant="filled"
//                 {...register('state_of_incorporation', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.state_of_incorporation && errors.state_of_incorporation.message}
//               </FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={errors.registration_number} mt={3}>
//               <Input
//                 placeholder="Registration Number"
//                 type="text"
//                 variant="filled"
//                 {...register('registration_number', {
//                   required: 'This is a required field',
//                 })}
//               />
//               <FormErrorMessage>
//                 {errors.registration_number && errors.registration_number.message}
//               </FormErrorMessage>
//             </FormControl>
//           </>
//         )}

//         <Button
//           isLoading={isSubmitting}
//           loadingText="Creating account..."
//           width="100%"
//           variant="solid"
//           mt={6}
//           mb={6}
//           type="submit"
//         >
//           Register
//         </Button>
//       </form>
//       <Button
//         onClick={() => navigate('/login', { replace: true })}
//         width="100%"
//         variant="solid"
//       >
//         Login Instead
//       </Button>
//     </Flex>
//   );
// };

// export default RegisterForm;

import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Flex,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios';
import ArtistDetailsForm from './ArtistDetailsForm';
import PasswordInput from '../../tools/PasswordInput';

const RegisterForm = ({ userType, onSuccess }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [artistData, setArtistData] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // For TOS agreement

  const password = watch('password', '');

  const onSubmit = async (values) => {
    if (!agreedToTerms) {
      toast({
        title: 'You must agree to the Terms of Service.',
        status: 'error',
        isClosable: true,
        duration: 1500,
      });
      return;
    }

    try {
      let payload = { ...values, account_type: userType };

      if (userType === 'artist' && artistData) {
        payload = {
          ...payload,
          account: {
            profile: {
              artist_name: artistData.artist_name,
              genres: artistData.genres,
              artist_id: [artistData.artist_id],
              image_url: artistData.image_url,
            },
          },
        };
      }

      if (userType === 'merchant') {
        payload = {
          ...payload,
          account: {
            profile: {
              company: values.company,
              company_address: {
                street: values.street,
                city: values.city,
                state: values.state,
                country: values.country,
                postal_code: values.postal_code,
              },
              business_type: values.business_type,
              state_of_incorporation: values.state_of_incorporation,
              registration_number: values.registration_number,
            },
          },
        };
      }

      if (userType === 'fan') {
        payload = {
          ...payload,
          account: {
            profile: {
              collection: [],
              total_shares_owned: 0,
              total_revenue: 0,
              lifetime_revenue: 0,
            },
          },
        };
      }

      await axiosInstance.post('/users/create', payload);
      toast({
        title: 'Account created successfully.',
        status: 'success',
        isClosable: true,
        duration: 1500,
      });
      onSuccess();
    } catch (err) {
      toast({
        title: `${err.response.data.detail}`,
        status: 'error',
        isCloseable: true,
        duration: 1500,
      });
    }
  };

  return (
    <Flex direction="column" alignItems="center" rounded={6}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {/* First Name Field */}
        <FormControl isInvalid={errors.firstname} mt={3}>
          <Input
            placeholder="First Name"
            type="text"
            variant="filled"
            {...register('firstname', { required: 'This is a required field' })}
          />
          <FormErrorMessage>{errors.firstname && errors.firstname.message}</FormErrorMessage>
        </FormControl>

        {/* Last Name Field */}
        <FormControl isInvalid={errors.lastname} mt={3}>
          <Input
            placeholder="Last Name"
            type="text"
            variant="filled"
            {...register('lastname', { required: 'This is a required field' })}
          />
          <FormErrorMessage>{errors.lastname && errors.lastname.message}</FormErrorMessage>
        </FormControl>

        {/* Email Field */}
        <FormControl isInvalid={errors.email} mt={3}>
          <Input
            placeholder="Email"
            type="email"
            variant="filled"
            {...register('email', { required: 'This is a required field' })}
          />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl>

        {/* Username Field */}
        <FormControl isInvalid={errors.username} mt={3}>
          <Input
            placeholder="Username"
            type="text"
            variant="filled"
            {...register('username', {
              required: 'This is a required field',
              minLength: {
                value: 5,
                message: 'Username must be at least 5 characters',
              },
              maxLength: {
                value: 24,
                message: 'Username must be at most 24 characters',
              },
            })}
          />
          <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
        </FormControl>

        {/* Password Field */}
        <PasswordInput
          register={register}
          errors={errors}
          name="password"
          placeholder="Password"
          validation={{
            required: 'This is a required field',
            minLength: {  value: 5, message: 'Password must be at least 5 characters long' }, 
            maxLength: { value: 24, message: 'Password must be at most 24 characters' },
          }} 
        />

        {/* Confirm Password Field */}
        <PasswordInput 
          register={register}
          errors={errors}
          name="confirmPassword"
          placeholder="Confirm Password"
          validation={{ 
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          }}

        />
        {userType === 'artist' && (
          <ArtistDetailsForm setArtistData={setArtistData} artistData={artistData} />
        )}

        {/* Terms of Service Checkbox */}
        <FormControl display="flex" justifyContent="center" mt={4} isInvalid={!agreedToTerms && isSubmitting}>
          <Checkbox
            isChecked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          >
            I agree to the{' '}
            <Button onClick={onOpen} variant="link" color="blue.500">
              Terms of Service
            </Button>
          </Checkbox>
          {!agreedToTerms && isSubmitting && (
            <FormErrorMessage>
              You must agree to the Terms of Service.
            </FormErrorMessage>
          )}
        </FormControl>

        {/* Register Button */}
        <Button
          isLoading={isSubmitting}
          loadingText="Creating account..."
          width="100%"
          variant="solid"
          mt={6}
          mb={6}
          type="submit"
        >
          Register
        </Button>
      </form>

      {/* Link to Login Instead */}
      <Button
        onClick={() => navigate('/login', { replace: true })}
        width="100%"
        variant="solid"
      >
        Login Instead
      </Button>

      {/* Modal for Terms of Service */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms of Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Terms of Service content */}
            <Text>
              [Insert Terms of Service content here...]
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default RegisterForm;
