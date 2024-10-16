import {
  Button,
  Flex,
  FormControl,
  Heading,
  Select,
  Text,
  useToast,
  Input,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import OTPInput from "react-otp-input";
import axiosInstance from "../../services/axios";

const OtpVerification = () => {
  const { handleSubmit, formState: { isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [otp, setOtp] = useState(""); // State to store the OTP input
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control the OTP input visibility
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // State to store the QR code URL
  const [loading, setLoading] = useState(false)

  const { userId, email, phone } = useParams();

  useEffect(() => {
    // Fetch the QR code URL if the verification method is authenticator
    if (verificationMethod === "authenticator") {
      const fetchQrCode = async () => {
        try {
          const response = await axiosInstance.get(`/auth/qr-code`);
          setQrCodeUrl(response.data);
        } catch (error) {
          console.error("Failed to fetch QR code:", error);
          toast({
            title: "Error fetching QR code",
            status: "error",
            isClosable: true,
            duration: 2000,
          });
        }
      };

      fetchQrCode();
    }
  }, [verificationMethod, userId, toast]);

  // Function to partially mask email (e.g., jo****@example.com)
  const maskEmail = (email) => {
    const [x, domain] = email.split("@");
    const maskedLocalPart = x.slice(0, 2) + "*".repeat(x.length - 2);
    return `${maskedLocalPart}@${domain}`;
  };

  const sendOtp = async () => {
    setLoading(true)
    try {

      const params = {
        user_id: userId,
      };
  
      // Add the appropriate parameter based on the verification method
      if (verificationMethod === "email") {
        params.email = email;
      } else if (verificationMethod === "sms") {
        params.sms = phone;
      } else {
        console.log("auth app");
        return;
      }
  
      // Send the POST request with params
      await axiosInstance.post('/auth/send/otp', null, { params });
      setLoading(false)
      setShowOtpInput(true); // Show OTP input field after sending OTP
      
    } catch (error) {
      toast({
        title: "Error sending OTP",
        status: "error",
        isClosable: true,
        duration: 2000,
      });
      setLoading(false)
    }
  };

  const onSubmit = async () => {
    try {
      let user = await login(userId, otp);
      console.log(user);
      if (user.isUserOTPVerified) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast({
        title: "Invalid OTP",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };

  if (!email) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex direction="column" bg="dark.500" p={12} m={6} rounded={6} maxW="400px">
        <Heading mb={6} size="md" color="dark.900">
          OTP Verification
        </Heading>

        <Text mb={4} color="primary.100">
          A verification code will be sent to {verificationMethod === "email" ? maskEmail(email) : phone && `******${phone.slice(-4)}`}
        </Text>

        <FormControl w="90%">
          <Text mb={4} color="primary.100">
            Verify using:
          </Text>
          <Select
            placeholder="Select verification method"
            value={verificationMethod}
            onChange={(e) => setVerificationMethod(e.target.value)}
            variant="filled"
          >
            <option value="email">Email</option>
            <option value="sms">SMS {phone && `******${phone.slice(-4)}`}</option>
            <option value="authenticator">Authenticator App</option>
          </Select>
        </FormControl>

        {verificationMethod === "authenticator" && qrCodeUrl && (
          <Flex direction="column" alignItems="center" mt={6}>
            <Text mb={2} color="primary.100">
              Scan this QR code with your authenticator app:
            </Text>
            <Image src={qrCodeUrl} alt="Authenticator QR Code" mb={4} />
          </Flex>
        )}

        <Button 
          onClick={sendOtp} 
          width="100px" 
          variant="solid" 
          mt={6}>
          {loading ? <Spinner/> : "Send OTP"}
        </Button>


        {showOtpInput && (

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl my={6}>
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
                    borderColor="dark.900"
                    _hover={{ borderColor: "primary.100" }}
                  />
                )}
                separator={<span>-</span>}
                shouldAutoFocus
              />
            </FormControl>

            <Button isLoading={isSubmitting} width="100px" variant="solid" mt={6} type="submit">
              Verify OTP
            </Button>
          </form>
        )}
      </Flex>
    </Flex>
  );
};

export default OtpVerification;
