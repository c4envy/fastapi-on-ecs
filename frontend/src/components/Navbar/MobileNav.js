import React, { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  HStack,
  Avatar,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  VStack,
  Image,
  Button,
  Badge,
  Tooltip,
  Grid,
  useMediaQuery,
  useDisclosure,
  useToast

} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { ChevronDownIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import SearchBar from "./SearchBar";
import { LinkItems, NavItem } from "./NavItem";



const MobileNav = ({ onOpen, ...rest }) => {
  let auth = useAuth();
  const { cartItems } = useCart();
  const [scrolling, setScrolling] = useState(false);
  const { isOpen } = useDisclosure();

  const toast = useToast() 

  const cartValue = () => {
    let count = 0
    cartItems.forEach(item => {
      count += item.quantity
    });

    return count
  }

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigate = useNavigate()


  const [tab] = useMediaQuery("(min-width:768px")
  const [desk] = useMediaQuery("(max-width:1068px")
  return (


    <Grid
      bg={scrolling ? "dark.500" : "transparent"}
      templateRows={{ base: "1fr 1fr", md: "1fr" }}
      templateColumns={{ base: "1fr 3fr 1fr", lg: "0.3fr 2fr 2fr 1fr" }}
      // ml={{ base: 0, md: "15vw" }}

      px={{ base: "2rem", md: "2.5rem" }}
      py={2}

      gridColumnGap={4}
      gridRowGap={2}
      position="fixed"
      right={0}
      // borderBottom="1px"
      // borderColor="dark.900"
      w="100vw"
      zIndex={4}
      h={{ base: "17vh", md: "15vh" }}
      alignItems="center"

    >

      <Box display={{ base: 'none', md: 'block' }} gridRowStart={{ base: 1, md: 'auto' }}
        gridRowEnd={{ base: 2, md: "auto" }}
        gridColumnStart={{ base: 1, md: 2 }}
        gridColumnEnd={{ base: 2, md: 3 }}>
        <Box display={{ md: 'block', lg: 'none' }}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="solid" _active={{ bg: "dark.500" }}>
              Menu
            </MenuButton>
            <MenuList>
              {LinkItems.map((link) => (
                <MenuItem key={link.name} as={Link} to={link.link}>
                  <link.icon />
                  {link.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
        <HStack display={{ base: 'none', lg: 'flex' }} spacing={4}>
          {LinkItems.map((link) => (
            <Button key={link.name} as={Link} to={link.link} variant="ghost" leftIcon={<link.icon />}>
              {link.name}
            </Button>
          ))}
        </HStack>
      </Box>




      <IconButton
        gridRowStart={{ base: 1, md: 'auto' }}
        gridRowEnd={{ base: 2, md: "auto" }}
        gridColumnStart={{ base: 3, md: 2 }}
        gridColumnEnd={{ base: 4, md: 'auto' }}
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="solid"
        aria-label="open menu"
        flex={{ base: "1", md: "none" }}
        icon={<FiMenu />}
      />

      <Box

        alignItems="center"
        justifyContent="center"

        gridRowStart={{ base: 1, md: 1 }}
        gridRowEnd={{ base: 2, md: 2 }}
        gridColumnStart={{ base: 1, md: 1 }}
        gridColumnEnd={{ base: 2, md: 2 }}

          
      >
        <Link to="/">
          <Image
            src={`${process.env.PUBLIC_URL}/assets/logo_beatstake/beatstake.gif`}
            w="5rem"
            alt="Logo"
            cursor="pointer"
          />
        </Link>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent={{ base:"flex-end"}}
        gridRowStart={{ base: 1, md: 1 }}
        gridRowEnd={{ base: 2, md: 2 }}
        gridColumnStart={{ base: 2, md: 4 }}
        gridColumnEnd={{ base: 3, md: 5 }}

      >
        <Box position="relative" mx={2} >
          <Badge position="absolute" color="dark.500" bg="dark.900" zIndex={5} left={7} top={-2}>{cartItems && cartItems.length !== 0 && cartValue() }</Badge>
          <Tooltip label='Cart' fontSize='md'>

            <IconButton
              variant="solid"
              as={Link}
              to="/cart"
              icon={<FaShoppingCart />}
              aria-label="Menu"
            />
          </Tooltip>


        </Box>


        {auth.isAuthenticated ? (
          <HStack spacing={{ base: "0", md: "6" }} mx={2}>
            {/* <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<FiBell />}
          /> */}
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none" }}
                >
                  <HStack>
                    <Avatar size="sm" name={`${auth.user.firstname} ${auth.user.lastname}`} bg="dark.900" color="secondary.900" _hover={{ bg: "secondary.900", color: "primary.900" }} />

                    <Box display={{ base: "none", md: "flex" }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList

                >
                  <Text as="p" textAlign="left" p={2} color="dark.900">welcome {auth.user.username} !</Text>
                  <MenuDivider />
                  <MenuItem as={Link} to={`/dashboard/${auth.user.account_type}/profile`}>Profile</MenuItem>
                  <MenuItem as={Link} to={`/dashboard/transactions`}>Orders</MenuItem>
               
                  <MenuItem as={Link} to={`/dashboard/collections`}>Portfolio</MenuItem>
                  {auth.user.account_type !== "fan" && <MenuItem as={Link} to={`/dashboard/${auth.user.account_type}/tracks`}>Catalogue</MenuItem>}
                  {auth.user.account_type !== "fan" && <MenuItem as={Link} to={`/dashboard/${auth.user.account_type}/documents`}>documents</MenuItem>}
                  <MenuDivider />
                  <MenuItem onClick={() => {
                    auth.logout(auth.user.email)
                    toast({
                      title: "Logged out",
                      description: "You have been logged out successfully",
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                    })
                    navigate("/")
                  }}>Log out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HStack>
        ) : (
          <Button variant="solid" as={Link} to="/login">
            login
          </Button>
        )}

      </Box>


      <Box
        gridRowStart={{ base: 2, md: 1 }}
        gridRowEnd={{ base: 3, md: 2 }}
        gridColumnStart={{ base: 1, md: 3 }}
        gridColumnEnd={{ base: 4, md: 4 }}
        w={{ base: "100%", md: "100%" }}
        display="flex"
        justifyContent={{ base: "center", md: "flex-end" }}
      >
        <SearchBar />
      </Box>
    </Grid>

  );
};

export default MobileNav;
