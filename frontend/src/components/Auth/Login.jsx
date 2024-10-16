import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  textDecoration,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import axiosInstance from "../../services/axios";


const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("username", values.email);
      formData.append("password", values.password);
      let response = await axiosInstance.post("/auth/login_otp", formData);
      console.log(response.data)
      if(response.data.status_code == "200"){
        navigate(`/otp-verify/${response.data.user_id}/${response.data.email}/${response.data.phone}`, { replace: true });
      }else{
        navigate("/", { replace: true });
      }
      // await login(values.email, values.password);
    } catch (error) {
      toast({
        title: "Invalid email or password",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        alignItems="center"
        bg="dark.500"
        p={12}
        m={6}
        rounded={6}
      >
        <Heading mb={6} size="md" color="dark.900">Login</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            <Input
              placeholder="Email"
              type="email"
              size="md"
              variant="outline"
              mt={3}
              {...register("email", {
                required: "Email is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password} position="relative" mt={3}>
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              size="md"
              variant="outline"
              {...register("password", {
                required: "Password is required",
              })}
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
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            isLoading={isSubmitting}
            loadingText="Logging in..."
            width="100%"
            variant="solid"
            
            mt={6}
            type="submit"
          >
            Sign in
          </Button>
        </form>
  
        <Button
          onClick={() => navigate("/register", { replace: true })}
          width="100%"
          variant="solid"
          mt={6}
        >
          Register Instead
        </Button>

        <Text mt={6}>forgot password ? <Text as={Link} to="/reset-password" textDecor="underline" color="dark.900">reset</Text></Text>
      </Flex>
    </Flex>
  );
};

export default Login;
