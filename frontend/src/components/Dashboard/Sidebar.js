import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Text, VStack, Divider } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen }) => {
  const sidebarWidth = '250px';
  let sidebarTitle = '';
  let sidebarLinks = [];

  let auth = useAuth();

  let userType = auth.user.account_type;

  // Define sidebar title and links based on user type
  if (userType === 'artist') {
    sidebarTitle = `Dashboard`;
    sidebarLinks = [
      { label: `${auth.user.firstname} profile`, href: '/dashboard/artist/profile' },
      { label: `${auth.user.firstname} tracks`, href: '/dashboard/artist/tracks' },
    ];
  } else if (userType === 'merchant') {
    sidebarTitle = 'Merchant Dashboard';
    sidebarLinks = [
      { label: 'Merchant Profile', href: '/dashboard/merchant/profile' },
      { label: 'Merchant Tracks', href: '/dashboard/merchant/tracks' }
    ];
  } else {
    sidebarTitle = 'Fan Dashboard';
    sidebarLinks = [
      { label: 'Fan Profile', href: '/dashboard/fan/profile' },
      { label: 'Fan Collection', href: '/dashboard/fan/collection' },
    ];
  }

  return (
    <Box
      as="aside"
      bg="secondary.500"
      color="primary.100"
      w={sidebarWidth}
      minH="100vh"
      p="4"
      pt="4rem"
      shadow="md"
      transition="opacity 0.3s ease, transform 0.3s ease"

      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      opacity={{base: isOpen ? 1 : 0, md:1}}
    >
      <VStack spacing="4" align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          {sidebarTitle}
        </Text>
        <Divider />
        {sidebarLinks.map((link, index) => (
          <Link key={index} to={link.href} color="primary.200" fontSize="sm">
            {link.label}
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
