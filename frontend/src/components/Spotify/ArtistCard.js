import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LinkBox, LinkOverlay, Card, CardBody, Image, Stack, Heading, Text, Button } from '@chakra-ui/react';

export default function ArtistCard({ artist }) {
    return (
        <LinkBox as="article" _hover={{ boxShadow: "md" }}>
            <LinkOverlay as={RouterLink} to={`/artist/${artist.user_id}`} style={{ textDecoration: 'none' }}>
                <Card m={2} bg="secondary.100" borderRadius="md" overflow="hidden" boxShadow="lg">
                    <CardBody>
                        <Image
                            src={artist.account.profile.image_url}
                            alt={artist.account.profile.artist_name}
                            borderRadius='md'
                            w="100%"
                            h="250px"
                            objectFit="cover"
                            transition="transform 0.2s"
                            _hover={{ transform: "scale(1.05)" }}
                        />
                        <Stack mt='4' spacing='2'>
                            <Heading size='md' color="primary.500">{artist.account.profile.artist_name}</Heading>
                            {/* <Text fontSize="sm" color="primary.900" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                Genres: {artist.account.profile.genres.join(', ')}
                            </Text> */}
                            <Text whiteSpace="nowrap" fontSize="0.7rem" color="primary.900">Total Shares Sold: {artist.account.profile.total_shares_sold}</Text>
                            <Text whiteSpace="nowrap" fontSize="0.7rem" color="primary.900">Total Revenue: $ {artist.account.profile.total_revenue}</Text>
                            <Button
                                colorScheme="blue"
                                size="sm"
                                as={RouterLink}
                                to={`/artist/${artist.user_id}`}
                                mt="2"
                            >
                                View Profile
                            </Button>
                        </Stack>
                    </CardBody>
                </Card>
            </LinkOverlay>
        </LinkBox>
    );
}


// footer
// topartist
// make track a link in user tracks