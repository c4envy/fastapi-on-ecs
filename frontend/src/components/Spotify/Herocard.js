import React from 'react'
import { Card, CardBody, Image, Stack, Heading, Box, Text, Divider, background, Button, IconButton, Link } from '@chakra-ui/react'
import { useCart } from '../../context/CartContext'
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FaCartArrowDown } from 'react-icons/fa';




export default function Herocard({ item }) {
  const { addToCart } = useCart()






  return (
    <Card w="100%" h={{ base: '400px', md: "500px" }} borderRadius="10px" position="relative" zIndex={2} overflow="hidden" bg="transparent">
      <Box
        background={`url(${item.item.image_url})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        w="100%"
        h="100%"
        position="absolute"
        transition="transform 0.3s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
        zIndex="0"
        borderRadius="10px"
      />
      <CardBody

        display="flex"
        alignItems="flex-end"
        justifyContent={{ base: 'center', md: 'flex-start' }}

      >
        <Box



          h="100%"
          w={{ base: '100%', md: "20%" }}
          p={5}
          display="flex"
          justifyContent="flex-end"
          bg="dark.200"

          flexDirection="column"
          position="absolute"
          bottom="0"
          left="0"
          right="0"




        >
          <Image
            src={item.item.image_url}
            alt={item.track_name}
            borderRadius={4}
            w="50%"
            border="5px solid"
            borderColor="dark.900"
          />

          <Box>
            <Text color="dark.900" fontSize={20} fontWeight="900">{item.item.track_name}</Text>
            <Text color="primary.900">{item.item.artist_name}</Text>
            <Text fontSize={30} color="primary.100" fontWeight="900">${item.item.price_per_share}</Text>
          </Box>


          <Box
            display="flex"
          >
            <IconButton
              icon={<FaCartArrowDown />}
              onClick={() => addToCart(item.item)}
              variant="glassy"
              w="30%"

            />
            <Link href={`/track/${item.item.track_id}`}>

              <IconButton
                icon={<ExternalLinkIcon />}
                variant="ghost"
                _hover={{ bg: "transparent", color: "dark.900" }}
                w="30%"

              />
            </Link>
          </Box>


        </Box>
      </CardBody>
    </Card>
  )
}
