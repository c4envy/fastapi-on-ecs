import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiCommand, FiCompass, FiHome, FiSettings, FiStar, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { FaMusic } from "react-icons/fa";

export const LinkItems = [
  { name: "Faqs", icon: FiTrendingUp, link: "/faq" },
  { name: "About Us", icon: FiCompass, link: "/about" },
  { name: "Browse", icon: FaMusic, link: "/browse" },
];

export const NavItem = ({ icon, children, link, ...rest }) => {
  return (
    <Box
      as={Link}
      to={link}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "dark.900",
          color: "secondary.500",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            color="dark.900"
            _groupHover={{
              color: "secondary.500",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};


