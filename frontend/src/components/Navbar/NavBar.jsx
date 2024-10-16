// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   IconButton,
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Avatar,
//   useDisclosure,
//   Stack,
//   Badge,
//   Image,
//   Tooltip,
//   keyframes
// } from "@chakra-ui/react";
// import { HamburgerIcon, CloseIcon, Search2Icon, ArrowBackIcon } from "@chakra-ui/icons";
// import { Link, useNavigate, Outlet } from "react-router-dom";
// import SearchBar from "./SearchBar"; // Import the SearchBar component
// import { useAuth } from "../../hooks/useAuth";
// import { FaShoppingCart } from "react-icons/fa"
// import { useCart } from "../../context/CartContext";
// import Footer from "./Footer";
// import { useTheme } from "@emotion/react";

// // const backgroundImage = {
// //   backgroundImage: `url(${process.env.PUBLIC_URL}/assets/bg2.jpg)`,
// //   backgroundSize: "cover",
// //   backgroundRepeat: "no-repeat",
// //   backgroundPosition: "center",
// //   minHeight: "100vh",
// // };


// const NavBar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
//   const { cartItems } = useCart();


// const [scrolling, setScrolling] = useState(false);

// const handleScroll = () => {
//   if (window.scrollY > 0) {
//     setScrolling(true);
//   } else {
//     setScrolling(false);
//   }
// };

// useEffect(() => {
//   window.addEventListener('scroll', handleScroll);
//   return () => {
//     window.removeEventListener('scroll', handleScroll);
//   };
// }, []);

//   let auth = useAuth()

//   const navigate = useNavigate();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const handleLogout = () => {
//     // Handle logout functionality here
//     auth.logout()
//     closeMenu();
//     navigate("/");
//   };

//   const toogleSearch = () => {
//     setIsSearchOpen(!isSearchOpen)
//   }

//   const spin = keyframes`
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// `;


// const theme = useTheme();



//   return (
//     <Box bg="dark.100" minH="100vh">

//       <Box
//       h="15vh"

//       >

//         <Flex
//           maxW="100vw"
//           mx="auto"
//           justify="space-between"
//           align="center"
//           boxShadow="0px 2px 5px rgba(0, 0, 0, 0.1)"
//           zIndex={3}
//           p={3}
//           wrap="wrap"
//           position="fixed"
//           bg={scrolling ? "secondary.500":"transparent"}
//           color="primary.100"
//           w="100%"
//           h="14vh"
//         >
// {/* 
//           <Box
//             flex={3}
//             display={{base: "block", lg:"none"}}
//           >

//           </Box> */}

//           {/* Menu Items */}
//           <Box
//             flex={3}
//             display={{ base: isMenuOpen ? "block" : "none", md: "flex" }}
//             alignItems="center"
//             justifyContent="flex-start"
//             position={{ base: "absolute", md: "relative" }}
//             top={0}
//             left={0}
//             w={{ base: "100%", md: "max-content" }}
//             h={{ base: "100vh", md: "max-content" }}
//             zIndex={11}
//             bg={{ base: "secondary.900", md: "none" }}
//           >
// {/* 
//             <Flex h="10vh" w="100vw">

//             </Flex> */}
//             {/* Menu Items Content */}
//             <Flex direction={{ base: "column", md: "row" }} align="center">
//               <Button variant="ghost" as={Link} to="/faq" onClick={closeMenu} mt={{ base: 2, md: 0 }} mr={{ base: 0, md: 4 }}>
//                 Faq
//               </Button>
//               <Button variant="ghost" as={Link} to="/services" onClick={closeMenu} mt={{ base: 2, md: 0 }} mr={{ base: 0, md: 4 }}>
//                 Services
//               </Button>
//               <Button variant="ghost" as={Link} to="/contact" onClick={closeMenu} mt={{ base: 2, md: 0 }}>
//                 Contact
//               </Button>
//             </Flex>
//           </Box>


//           <Box
//             as={Link}
//             to="/"
//             flexShrink={0}
//             flex={0.4}
//             cursor="pointer"
//             // animation={`${spin} infinite 5s linear`}
//             w="7rem"
//           >
//             <Image
//               src={`${process.env.PUBLIC_URL}/assets/logo1.png`}
//               alt="Logo"
//               w="100%"
//               h="100%"
//               cursor="pointer"

//             />
//           </Box>

//           <Stack direction='row' display="flex" alignItems="center" flex={3} justifyContent="flex-end">


//             <Button
//               display={{ base: "flex" }}
//               onClick={toogleSearch}
//               variant="solid"
//               aria-label="Menu"
//               zIndex={10}
//             >
//               <Search2Icon /><Text ml={3} display={{ base: "none", md: "block" }}>Search</Text>
//             </Button>


//             {auth.isAuthenticated ? (

//               <Menu
//                 display={{base:"none", lg:"block"}}
//               >
//                 <MenuButton
//                   borderRadius="100%"
//                   as={IconButton}
//                   aria-label="Options"
//                   icon={<Avatar size="sm" name={auth.user.username} src={auth.user.profileImg} bg="secondary.900" color="primary.900" />}
//                   onClick={closeMenu}
//                   p={1}
//                 />
//                 <MenuList>
//                   <MenuItem as={Link} to={`/dashboard/${auth.user.account_type}`} onClick={closeMenu}>
//                     My Profile
//                   </MenuItem>
//                   <MenuItem onClick={handleLogout}>Logout</MenuItem>
//                 </MenuList>
//               </Menu>

//             ) : (
//               <Button variant="solid" as={Link} to="/login" onClick={closeMenu}>
//                 Login
//               </Button>
//             )}

// <Box position="relative">
//   <Badge position="absolute" zIndex={5} left={7} top={-2}>{cartItems.length !== 0 && cartItems.length}</Badge>
//   <Tooltip label='Cart' fontSize='md'>

//     <IconButton
//       variant="solid"
//       as={Link}
//       to="/cart"
//       icon={<FaShoppingCart />}
//       aria-label="Menu"

//     />
//   </Tooltip>
// </Box>

//             <IconButton
//               display={{ base: "block", md: "none" }}
//               onClick={toggleMenu}
//               variant="solid"
//               icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
//               aria-label="Menu"
//               zIndex={14}
//             />

//           </Stack>

//         </Flex>
//       </Box>

//       {isSearchOpen && <IconButton
//         display={{ base: "block" }}
//         onClick={() => toogleSearch()}
//         variant="solid"
//         icon={<ArrowBackIcon />}
//         zIndex={12}
//         position="absolute"
//         top={1.5}
//         left={1.5}
//       />}



//       {isSearchOpen && <SearchBar />}

//       {/* Outlet for rendering child routes */}
//       <Box display={isSearchOpen ? "none" : "block"} bg="dark.100" px={2} minH="70vh">
//         <Outlet />
//       </Box>

//       <Footer h="20vh" />


//     </Box>
//   );
// };

// export default NavBar;



import React, { useEffect, useState } from "react";
import {
  Box,
  useDisclosure,
  Drawer,
  DrawerContent,
  Flex,
  Image,
  VStack,
  HStack,
  Slider,
  Text,
  IconButton,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack
} from "@chakra-ui/react";

import { useAuth } from "../../hooks/useAuth";
import SidebarContent from "./SidebarContent";
import MobileNav from "./MobileNav";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { LinkItems, NavItem } from "./NavItem";
import { FaVolumeUp, FaPause, FaPlay, FaVolumeDown } from "react-icons/fa";
import MusicPlayer from "../Home/MusicPlayer";
import { useMusicPlayer } from "../../context/MusicPlayerContext";
import { CloseIcon } from "@chakra-ui/icons";

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentTrack } = useMusicPlayer()
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);

  return (
    <Box minH="100vh" maxW="1450px" display="flex" flexDirection="column" m="auto" >
      {/* <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} /> */}

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        returnFocusOnClose={true}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}

      <MobileNav onOpen={onOpen} />
      {
        currentTrack && (
          <Box w="100vw" mt={2} h="10vh" zIndex={2} position="fixed" top={{ base: "17vh", md: "15vh" }} left={0} right={0} transform={currentTrack ? "translateY(0)" : "translateY(20px)"} transition="all 0.3s ease" >
            <MusicPlayer/>
          </Box>
        )
      }

      <Flex direction="column" flex="1">
        <Box transition="margin-top 1s ease"  flex="1" mb={{ base: "500px", lg: "400px" }} mt={{ base: currentTrack ? "29vh" : "19vh", md: currentTrack ? "23vh" : "15vh" }} p="1.5rem">
          <Outlet />
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
};

export default NavBar;
