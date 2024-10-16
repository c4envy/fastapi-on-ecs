// import React, { useState } from 'react';
// import { Box, Text, Image, Button, Flex } from '@chakra-ui/react';
// import TrackInfo from './TrackInfo'; // Import the Track component
// import PaymentModal from './PaymentModal';

// const Tracks = ({ items, service, selectedStorefront }) => {
//     const [selectedTrack, setSelectedTrack] = useState(null);

//     // Function to handle selection of a track
//     const handleTrackSelect = (track) => {
//         setSelectedTrack(track);
//     };

//     return (
//         <Box my={3}>
//             {items.length >= 1 && items.map((track, index) => (
//                 <Box key={track.id} p="4" bg="secondary.900" borderRadius="md" boxShadow="base" mb="4">
//                     <Flex direction={{ base: 'column', md: 'row' }} align="flex-start" justify="flex-start">
//                         {service === "spotify" && (
//                             <>
//                                 <Image w="50px" src={track.album.images[0].url} alt='' mr={{ md: 4 }} mb={{ base: 4, md: 0 }} />
//                                 <Text>{track.name}</Text>
//                             </>
//                         )}
//                         {service === "apple" && (
//                             <>
//                                 <Image w="50px" src={`${track.attributes.artwork.url.slice(0, track.attributes.artwork.url.length - 14)}/${track.attributes.artwork.width}x${track.attributes.artwork.height}bb.jpg`} alt='' mr={{ md: 4 }} mb={{ base: 4, md: 0 }} />
//                                 <Text>{track.attributes.name}</Text>
//                             </>
//                         )}
//                         {service === "tidal" && <Text>{track.resource.title}</Text>}
//                     </Flex>
//                     <Button mt="2" onClick={() => handleTrackSelect(track)}>
//                         View Details
//                     </Button>
//                 </Box>
//             ))}

//             {/* Render Track component as an overlay */}
//             {selectedTrack && (
//                 <Box
//                     position="fixed"
//                     top="0"
//                     left="0"
//                     width="100%"
//                     height="100%"
//                     backgroundColor="rgba(0, 0, 0, 0.5)"
//                     display="flex"
//                     justifyContent="center"
//                     alignItems="center"
//                     zIndex="999"
//                 >
//                     <Box p="4" bg="primary.900" borderRadius="md">
//                         <TrackInfo
//                             track={selectedTrack}
//                             storefront={selectedStorefront}
//                             onClose={() => setSelectedTrack(null)}
//                             platform={service}
//                         />
//                     </Box>
//                 </Box>
//             )}

       
//         </Box>
//     );
// };

// export default Tracks;


import React, { useState } from 'react';
import { Box, Text, Image, Button, Flex } from '@chakra-ui/react';
import TrackInfo from './TrackInfo'; // Import the TrackInfo component
import PaymentModal from './PaymentModal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51PLQgX2KnKdf1YCEVojH8ER1TVelnSOzUmuNJIJaOadbq1EatVpO2RVndyWTAX0CUmp7fomagqJFkkCQpOJuJB9O00kq1zQolv");


const Tracks = ({ items, service, selectedStorefront }) => {
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [paymentModalData, setPaymentModalData] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleTrackSelect = (track) => {
        setSelectedTrack(track);
    };

    const handleTrackCreated = (createdTrack) => {
        // Close the TrackInfo modal and open the PaymentModal
        setSelectedTrack(null);
        setPaymentModalData(createdTrack);
        setIsPaymentModalOpen(true);
    };

    return (
        <Box my={3}>
            {items.length >= 1 && items.map((track) => (
                <Box key={track.id} p="4" bg="secondary.900" borderRadius="md" boxShadow="base" mb="4">
                    <Flex direction={{ base: 'column', md: 'row' }} align="flex-start" justify="flex-start">
                        {service === "spotify" && (
                            <>
                                <Image w="50px" src={track.album.images[0].url} alt='' mr={{ md: 4 }} mb={{ base: 4, md: 0 }} />
                                <Text>{track.name}</Text>
                            </>
                        )}
                        {service === "apple" && (
                            <>
                                <Image w="50px" src={`${track.attributes.artwork.url.slice(0, track.attributes.artwork.url.length - 14)}/${track.attributes.artwork.width}x${track.attributes.artwork.height}bb.jpg`} alt='' mr={{ md: 4 }} mb={{ base: 4, md: 0 }} />
                                <Text>{track.attributes.name}</Text>
                            </>
                        )}
                        {service === "tidal" && <Text>{track.resource.title}</Text>}
                    </Flex>
                    <Button mt="2" onClick={() => handleTrackSelect(track)}>
                        View Details
                    </Button>
                </Box>
            ))}

            {/* Render TrackInfo component as an overlay */}
            {selectedTrack && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    backgroundColor="rgba(0, 0, 0, 0.5)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    zIndex="999"
                >
                    <Box p="4" bg="primary.900" borderRadius="md" maxW="lg" w="full">
                        <TrackInfo
                            track={selectedTrack}
                            storefront={selectedStorefront}
                            onClose={() => setSelectedTrack(null)}
                            platform={service}
                            onTrackCreated={handleTrackCreated} // Pass the callback function
                        />
                    </Box>
                </Box>
            )}

            {/* Render PaymentModal */}
            {isPaymentModalOpen && paymentModalData && (
                <Elements stripe={stripePromise}>


                    <PaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        onPaymentSuccess={() => setIsPaymentModalOpen(false)}
                        trackDetails={paymentModalData}
                    />
                </Elements>
            )}
        </Box>
    );
};

export default Tracks;
