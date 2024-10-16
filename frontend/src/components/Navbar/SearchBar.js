// src/components/SearchBar.js
import React, { useState } from 'react';
import {
  Box, InputGroup, Input, InputRightElement, IconButton, Flex, Text, Link, CloseButton,
  useDisclosure,
  Image,
  Heading
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axios';

const MotionBox = motion(Box);

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch()
  };

  const handleSearch = async () => {
    if (searchTerm) {
      onOpen();
      const response = await axiosInstance.post(`/music/atlas/search?request=${searchTerm}`);
      console.log(response)
      setResults(response.data);
    } else {
      onClose();
      setResults({});
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setResults([]);
    onClose();
  };

  return (
    <Box  w={{base:"100%", md:"50vw", lg:"25vw"}}>
      <Box top={0} zIndex={10}>
        <InputGroup>
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
            variant="filled"
            bg="secondary.100"
            boxShadow="dark-lg"
            _focus={{ borderColor: "dark.900" }}
          />
          <InputRightElement>
            <IconButton
              aria-label="Search database"
              icon={<Search2Icon />}
              onClick={handleSearch}
              variant="ghost"
              color="dark.900"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      {isOpen && (
        <MotionBox
          bg="secondary.500"
          p={3}
          mt={2}
          position="absolute"
          w={{base:"85%", md:"50vw", lg:"25vw"}}
          borderRadius="md"
          boxShadow="dark-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
      
        >
          <Flex justify="flex-end" px={3}>
            <CloseButton onClick={handleClose} color="dark.100" bg="dark.900"/>
          </Flex>
          <Text>Tracks - {results.music_results && results.music_results.length === 0 && "No tracks found"}</Text>
          {results.music_results && results.music_results.map(result => (
            <Flex
              key={result.track_id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="dark.900"
              color="primary.900"
              m={3}
              alignItems="center"
              justifyContent="space-between"
              bg="secondary.100"
              _hover={{ bg: "dark.100", color:"dark.900"}}
              
            >

              <Link href={`/track/${result.track_id}`} _hover={{border:"none", color:"dark.900"}} display="grid" sx={{
                gridTemplateRows:"1fr 1fr",
                gridTemplateColumns:"1fr 2fr",
                alignItems:"center",
                columnGap:4,
            
              }}>
              <Image gridRowStart={1} gridRowEnd={3} gridColumnStart={1} gridColumnEnd={2} src={result.image_url} alt={result.track_name} borderRadius='lg' width={{ base: "3rem", md: "4rem" }} />

                <Text gridRowStart={1} gridRowEnd={2} gridColumnStart={2} gridColumnEnd={3} fontSize="lg" fontWeight="bold" mb={-3}>
                  {result.track_name}
                </Text>
                <Text mt={-2} gridRowStart={2} gridRowEnd={3} gridColumnStart={2} gridColumnEnd={3} fontSize="sm" >
                  {result.artist_name}
                </Text>
              </Link>
              <Text color="secondaryOne">
                ${result.price_per_share}
              </Text>
            </Flex>
          ))}
          <Text>Artists - {results.artist_results && results.artist_results.length === 0 && "No Artist found"}</Text>
          {results.artist_results && results.artist_results.map(result => (
            <Flex
              key={result.account.profile.artist_id[0].id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="dark.900"
              color="primary.900"
              m={3}
              alignItems="center"
              justifyContent="space-between"
              bg="secondary.100"
              _hover={{ bg: "dark.100", color:"dark.900"}}
              
            >

              <Link href={`/artist/`} _hover={{border:"none", color:"dark.900"}} display="grid" sx={{
                gridTemplateRows:"1fr 1fr",
                gridTemplateColumns:"1fr 2fr",
                alignItems:"center",
                columnGap:4,
            
              }}>
              <Image gridRowStart={1} gridRowEnd={3} gridColumnStart={1} gridColumnEnd={2} src={result.account.profile.image_url} alt={result.account.profile.artist_name} borderRadius='lg' width={{ base: "3rem", md: "4rem" }} />

                <Text gridRowStart={1} gridRowEnd={2} gridColumnStart={2} gridColumnEnd={3} fontSize="lg" fontWeight="bold" mb={-3}>
                  {result.account.profile.artist_name}
                </Text>
                
              </Link>
             
            </Flex>
          ))}
        </MotionBox>
      )}
    </Box>
  );
};

export default SearchBar;
