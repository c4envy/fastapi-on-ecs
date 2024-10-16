import React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, Image, Stack, IconButton, Box } from '@chakra-ui/react'
import { FaCartPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function BrowseCard({url, handleClick, title, btnText, description, imageSrc}) {
    return (
        <Card as={Link} to={url} maxW="sm" scrollSnapAlign="start" p={4} bg="transparent" boxShadow="2xl">
            <CardBody>
                <Image
                    src={imageSrc}
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    transition={"transform 0.3s ease-in-out"}
                    _hover={{transform:"scale(1.1)"}}
                />
                <Stack mt='6' spacing='3'>
                    <Heading color="primary.900" h="40px" textOverflow="ellipsis" whiteSpace="pre-wrap" size='sm'>{title}</Heading>
                    <Box display="flex" gap={7}>

                    <Text color='dark.900' fontSize='2xl' display={!description && "none"}>
                        {console.log(description)}
                        {description}
                    </Text>
                    <IconButton variant="solid" onClick={(e) => {
                        e.preventDefault();
                        handleClick()
                    }} icon={<FaCartPlus/>} alignSelf="flex-start">
                        {btnText}
                    </IconButton>
                    </Box>

                </Stack>
            </CardBody>
        </Card>
    )
}
