import React from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const RegisterLayout = () => {
  const tabSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/login", { replace: true });
  };

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <Box w={{ base: '90%', md: '600px' }} bg="dark.500" p={8} borderRadius="lg" >
        <Heading textAlign="center" mb={6} size="lg" color="dark.900">Sign Up</Heading>
        <Tabs size={tabSize} isFitted>
          <TabList mb="1em">
            <Tab>as fan</Tab>
            <Tab>as artist</Tab>
            <Tab>as merchant</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><RegisterForm userType="fan" onSuccess={handleSuccess} /></TabPanel>
            <TabPanel><RegisterForm userType="artist" onSuccess={handleSuccess} /></TabPanel>
            <TabPanel><RegisterForm userType="merchant" onSuccess={handleSuccess} /></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default RegisterLayout;
