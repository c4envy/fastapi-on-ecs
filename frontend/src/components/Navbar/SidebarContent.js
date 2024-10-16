import React from "react";
import {
    Box,
    CloseButton,
    Flex,
    Image,
    Link,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { LinkItems, NavItem } from "./NavItem";

const SidebarContent = ({ onClose, ...rest }) => {
    return (
        <Box
            bg="dark.500"
            // borderRight="1px"
            // borderColor="dark.900"
            boxShadow="dark-lg"
            w={{ base: "full", md: "20vw", lg: "15vw" }}
            pos="fixed"
            h="full"

            zIndex={5}
            {...rest}
        >
            <Flex h="20" alignItems="center" justifyContent="space-between" mx={5} my={2} onClick={onClose}>
                <Link to="/">
                    <Image
                        src={`${process.env.PUBLIC_URL}/assets/logo_beatstake/beatstake.gif`}
                        w="4rem"
                        alt="Logo"
                        cursor="pointer"
                    />
                </Link>
                <CloseButton as="button" display={{ base: "flex", md: "none" }} size="xl" variant="solid" onClick={onClose} />
            </Flex>
            <Flex direction="column" alignItems="center">

                {LinkItems.map((link) => (
                    <NavItem key={link.name} icon={link.icon} link={link.link} onClick={onClose}>
                        {link.name}
                    </NavItem>
                ))}
            </Flex>
        </Box>
    );
};

export default SidebarContent;
