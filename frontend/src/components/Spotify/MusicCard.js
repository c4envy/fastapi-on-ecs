import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LinkBox, LinkOverlay, Card, CardBody, Image, Stack, Heading, Text, Button } from '@chakra-ui/react';
import { useCart } from '../../context/CartContext';

export default function MusicCard({ item }) {
    const { addToCart } = useCart();

    const handleAddToCart = (event) => {
        event.stopPropagation(); // Stop the click event propagation
        addToCart(item);
    };

    const handleButtonClick = (event) => {
        event.preventDefault(); // Prevent default button behavior
        event.stopPropagation(); // Stop the click event propagation
        handleAddToCart(event); // Call the addToCart function
    };

    return (
        <LinkBox as="article" _hover={{ boxShadow: "md" }}>
            <LinkOverlay as={RouterLink} to={`/track/${item.track_id}`} style={{ textDecoration: 'none' }}>
                <Card m={2}  bg="secondary.100" borderRadius="md" overflow="hidden" boxShadow="lg">
                    <CardBody>
                        <Image
                            src={item.image_url}
                            alt={item.track_name}
                            borderRadius='md'
                            w="100%"
                            h="250px"
                            objectFit="cover"
                            transition="transform 0.2s"
                            _hover={{ transform: "scale(1.05)" }}
                        />
                        <Stack mt='4' spacing='2'>
                            <Heading whiteSpace="nowrap" color="primary.100" overflow="hidden" textOverflow="ellipsis" size='md'>{item.track_name}</Heading>
                            <Text fontSize="sm" color="primary.500" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                {item.artist_name}
                            </Text>
                            <Text whiteSpace="nowrap" color="primary.900">$ {item.price_per_share}</Text>
                            <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={handleButtonClick}
                            >
                                Add to Cart
                            </Button>
                        </Stack>
                    </CardBody>
                </Card>
            </LinkOverlay>
        </LinkBox>
    );
}
