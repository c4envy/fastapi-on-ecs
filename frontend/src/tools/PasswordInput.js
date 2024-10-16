import React, { useState } from 'react';
import { FormControl, Input, Button, FormErrorMessage } from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const PasswordInput = ({ register, errors, name, placeholder, validation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={errors[name]} mt={3} position="relative">
      <Input
        placeholder={placeholder}
        type={showPassword ? 'text' : 'password'}
        variant="filled"
        {...register(name, validation)}
      />
      <Button
        size="sm"
        position="absolute"
        right="8px"
        top="50%"
        transform="translateY(-50%)"
        onClick={() => setShowPassword(!showPassword)}
        variant="ghost"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </Button>
      <FormErrorMessage>{errors[name] && errors[name].message}</FormErrorMessage>
    </FormControl>
  );
};

export default PasswordInput;