import React, { useState } from 'react';
import { Box, Flex, IconButton } from '@chakra-ui/react';

import { Outlet } from 'react-router-dom';


const DashboardLayout = () => {
  

  return (
    <Flex>
      {/* <Sidebar isOpen={isSidebarOpen} /> */}
      <Box w="100%" p="4" bg="secondary.600" color="secondary.100">
    
      
        <Outlet />
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
