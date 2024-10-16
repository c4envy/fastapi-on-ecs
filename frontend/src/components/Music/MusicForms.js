import React from 'react';
import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, VStack, Flex, useBreakpointValue } from '@chakra-ui/react';
// Import the AddTrack and AddTracks components
import AddTrack from './AddTrack';
import AddTracks from './AddTracks';

const MusicForms = () => {
    const tabSize = useBreakpointValue({ base: 'sm', md: 'md' });

    return (
        <Box minHeight="100vh">
            {/* <Heading mb="4">Create Tracks</Heading> */}
            <Flex direction="column" align="center" my={{ base: 4, md: 5 }}>
                <Tabs isFitted size={tabSize}>
                    <TabList  bg="secondary.900">
                        <Tab p={{ base: 2, md: 3 }}>
                            Add Track by track ID
                        </Tab>
                        <Tab p={{ base: 2, md: 3 }}>
                            Add Track by Album ID
                        </Tab>
                    </TabList>
                    <TabPanels mt={{ base: 4, md: 0 }}>
                        <TabPanel>
                            <VStack align="start" spacing="4">
                                {/* Render the AddTrack component */}
                                <AddTrack />
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            <VStack align="start" spacing="4">
                                {/* Render the AddTracks component */}
                                <AddTracks />
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Box>
    );
};

export default MusicForms;
