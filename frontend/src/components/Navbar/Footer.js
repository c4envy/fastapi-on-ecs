import React from "react";
import { Box, Flex, Text, Image, Link, IconButton } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <Box bg="dark.500" color="primary.100" py={10} position="absolute" bottom={0} left={0} right={0}>
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="center"
                px={{ base: 4, md: 10 }}
                
                
            >
                <Flex align="center" mb={{ base: 6, md: 0 }}>
                    <Link to="/">
                        <Image
                            src={`${process.env.PUBLIC_URL}/assets/logo_beatstake/beatstake.gif`}
                            w="8rem"
                            alt="Logo"
                            cursor="pointer"
                        />
                    </Link>

                </Flex>
                <Flex direction="column" align={{ base: "center", md: "flex-end" }}>
                    <Text mb={2}>Email: contact@yourcompany.com</Text>
                    <Text mb={2}>Phone: +1234567890</Text>
                    <Flex>
                        <IconButton
                            as={Link}
                            href="#"
                            aria-label="Facebook"
                            icon={<FaFacebook />}
                            variant="ghost"
                            mr={2}
                            _hover={{ color: "primary.900" }}
                        />
                        <IconButton
                            as={Link}
                            href="#"
                            aria-label="Twitter"
                            icon={<FaTwitter />}
                            variant="ghost"
                            mr={2}
                            _hover={{ color: "primary.900" }}
                        />
                        <IconButton
                            as={Link}
                            href="#"
                            aria-label="Instagram"
                            icon={<FaInstagram />}
                            variant="ghost"
                            mr={2}
                            _hover={{ color: "primary.900" }}
                        />
                        <IconButton
                            as={Link}
                            href="#"
                            aria-label="LinkedIn"
                            icon={<FaLinkedin />}
                            variant="ghost"
                            _hover={{ color: "primary.900" }}
                        />
                    </Flex>
                </Flex>
            </Flex>
            <Box borderTopWidth={1} borderColor="secondary.100" py={4} textAlign="center">
                <Text>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</Text>
            </Box>
        </Box>
    );
};

export default Footer;
