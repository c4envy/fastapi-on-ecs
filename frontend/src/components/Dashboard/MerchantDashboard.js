import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const MerchantDashboard = () => {
  return (
    <Box>
      <Outlet/>
    </Box>
  );
};

export default MerchantDashboard;
