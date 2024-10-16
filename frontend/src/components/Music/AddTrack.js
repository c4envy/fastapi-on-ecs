import React, { useState } from 'react';
import { Box, Heading, Tabs, TabList, Tab, TabPanels, TabPanel, useBreakpointValue } from '@chakra-ui/react';
import TrackForm from './TrackForm';

const AddTrack = () => {
    const tabSize = useBreakpointValue({ base: 'md', md: 'lg' });
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <Box  
        minHeight="80vh" display="flex" maxW="100vw" justifyContent="center" mx="auto" my={2}>
          <Box w={{ base: '80vw'}}>

                <Tabs onChange={(index) => setSelectedTab(index)} size={tabSize} isFitted>
                    <TabList justifyContent="center">
                        <Tab>Spotify</Tab>
                        <Tab>Apple Music</Tab>
                        <Tab>Tidal</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <TrackForm service="spotify" requestType="singleTrack" />
                        </TabPanel>
                        <TabPanel>
                            <TrackForm service="apple" requestType="singleTrack" />
                        </TabPanel>
                        <TabPanel>
                            <TrackForm service="tidal" requestType="singleTrack" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    );
};

export default AddTrack;
