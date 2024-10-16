import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OTPInput from "react-otp-input";
import axiosInstance from "../../services/axios";

const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();
  const [stage, setStage] = useState(1); // 1: Choose method, 2: Request OTP, 3: Verify OTP, 4: Reset Password
  const [otp, setOtp] = useState(""); // State to store the OTP input
  const [email, setEmail] = useState(""); // State to store email
  const [phone, setPhone] = useState(""); // State to store phone number
  const [newPassword, setNewPassword] = useState(""); // State to store new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State to store confirm password
  const [verificationMethod, setVerificationMethod] = useState(""); // State to store the selected verification method
  const toast = useToast();
  const navigate = useNavigate();

  // Handle OTP request
  const handleRequestOtp = async (values) => {
    try {
      if (verificationMethod === "email") {
        await axiosInstance.get(`/users/verify/user_email/${values.email}`);
        setEmail(values.email);
      } else if (verificationMethod === "sms") {
        await axiosInstance.get(`/users/verify/user_phone/${values.phone}`);
        setPhone(values.phone);
      }

      toast({
        title: "OTP sent",
        status: "success",
        isClosable: true,
        duration: 1500,
      });
      setStage(3); // Move to OTP verification stage
    } catch (error) {
      toast({
        title: "Error requesting OTP",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    try {
      await axiosInstance.post(`/auth/verify/totp/${otp}/${verificationMethod === "email" ? email : phone}`);
      toast({
        title: "OTP verified",
        status: "success",
        isClosable: true,
        duration: 1500,
      });
      setStage(4); // Move to password reset stage
    } catch (error) {
      toast({
        title: "Invalid OTP",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
      return;
    }
    try {
      await axiosInstance.post("/users/reset/password", {
        otp: otp,
        email: verificationMethod === "email" ? email : null,
        phone: verificationMethod === "sms" ? phone : null,
        new_password: newPassword,
      });
      toast({
        title: "Password reset successful",
        status: "success",
        isClosable: true,
        duration: 1500,
      });
      navigate("/login"); // Redirect to login page
    } catch (error) {
      toast({
        title: "Error resetting password",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" bg="transparent">
      <Flex direction="column" bg="dark.500" p={12} m={6} rounded={6} shadow="md" maxW="400px">
        <Heading mb={6} size="md" color="primaryOne">
          Password Reset
        </Heading>

        {stage === 1 && (
          <FormControl mb={6}>
            <Text mb={4} color="primaryOne">Choose how you'd like to reset your password:</Text>
            <RadioGroup onChange={setVerificationMethod} value={verificationMethod}>
              <Stack direction="row">
                <Radio value="email">Email</Radio>
                <Radio value="sms">SMS</Radio>
              </Stack>
            </RadioGroup>
            <Button
              isDisabled={!verificationMethod}
              mt={6}
              width="full"
              colorScheme="primary"
              onClick={() => setStage(2)}
            >
              Continue
            </Button>
          </FormControl>
        )}

        {stage === 2 && (
          <form onSubmit={handleSubmit(handleRequestOtp)}>
            {verificationMethod === "email" && (
              <FormControl isInvalid={errors.email} mb={6}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  variant="filled"
                  {...register("email", { required: "Email is required" })}
                  _hover={{ borderColor: "primaryOne" }}
                />
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>
            )}
            {verificationMethod === "sms" && (
              <FormControl isInvalid={errors.phone} mb={6}>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  variant="filled"
                  {...register("phone", { required: "Phone number is required" })}
                  _hover={{ borderColor: "primaryOne" }}
                />
                <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
              </FormControl>
            )}
            <Button
              isLoading={isSubmitting}
              width="full"
              variant="solid"
              colorScheme="primary"
              mt={6}
              type="submit"
            >
              Request OTP
            </Button>
          </form>
        )}

        {stage === 3 && (
          <FormControl my={6}>
            <Text mb={4} color="primaryOne">
              An OTP has been sent to your {verificationMethod === "email" ? "email" : "phone"}. Enter the OTP to verify.
            </Text>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <Input
                  {...props}
                  variant="outline"
                  w="50px"
                  h="50px"
                  m={1}
                  textAlign="center"
                  fontSize="lg"
                  p={0}
                  _hover={{ borderColor: "primary.100" }}
                />
              )}
              separator={<span>-</span>}
              shouldAutoFocus
            />
            <Button
              isLoading={isSubmitting}
              width="full"
              variant="solid"
              colorScheme="primary"
              mt={6}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </FormControl>
        )}

        {stage === 4 && (
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <FormControl isInvalid={errors.newPassword} mb={6}>
              <Input
                type="password"
                placeholder="Enter new password"
                variant="outline"
                {...register("newPassword", { required: "New password is required" })}
                onChange={(e) => setNewPassword(e.target.value)}
                borderColor="secondaryOne"
                _hover={{ borderColor: "primaryOne" }}
              />
              <FormErrorMessage>{errors.newPassword && errors.newPassword.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword} mb={6}>
              <Input
                type="password"
                placeholder="Confirm new password"
                variant="outline"
                {...register("confirmPassword", { required: "Confirm password is required" })}
                onChange={(e) => setConfirmPassword(e.target.value)}
                borderColor="secondaryOne"
                _hover={{ borderColor: "primaryOne" }}
              />
              <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
            </FormControl>

            <Button
              isLoading={isSubmitting}
              width="full"
              variant="solid"
              colorScheme="primary"
              mt={6}
              type="submit"
            >
              Reset Password
            </Button>
          </form>
        )}
      </Flex>
    </Flex>
  );
};

export default PasswordReset;
