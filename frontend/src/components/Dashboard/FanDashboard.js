import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";

const FanDashboard = () => {
    let auth = useAuth()
  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">Fan Dashboard</Text>
      <Text>Welcome, Fan! {auth.user.first_name} </Text>
      {/* Add more content specific to Fan */}
    </Box>
  );
};

export default FanDashboard;
