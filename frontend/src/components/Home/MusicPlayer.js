import { Box, IconButton, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Image, HStack, VStack } from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import {useMusicPlayer} from '../../context/MusicPlayerContext'
import { useState } from 'react';
import { CloseIcon } from "@chakra-ui/icons";

const MusicPlayer = () => {
    const { currentTrack, isPlaying, progress, pauseTrack, resumeTrack, handleVolumeChange , handleClose,seekTrack} = useMusicPlayer();
    const [volume, setVolume] = useState(50); // Initialize volume at 50%

    const handleSliderChange = (value) => {
        setVolume(value);
        handleVolumeChange(value);
    };

    return (
        <Box 
          display="grid" 
          gridTemplateColumns={{base:"60px 1fr 50px", md:"60px 1fr 50px auto"}}
          gridTemplateRows="1fr auto" 
          alignItems="center" 
          justifyContent="space-between" 
          bg="secondary.700" 
          w="95%" 
          px={12} 
          py={2}
          position="relative"
          mx={"auto"}
          borderRadius="5px"
        >
            {/* Album Art */}
            <Image 
              src={currentTrack ? currentTrack.image : "https://via.placeholder.com/50"} 
              alt="Album Art" 
              borderRadius="md" 
              boxSize="50px" 
              gridColumn="1/2" 
              gridRow="1/3"
              my={2}
            />

            {/* Track Info */}
            <VStack 
              align="start" 
              spacing={0} 
              mx={4} 
              gridColumn="2/3" 
              gridRow="1/2"
              justifySelf="flex-start"
            >
                <Text color="primary.900" fontSize="sm">
                  {currentTrack ? currentTrack.name : "No Track Playing"}
                </Text>
                <Text color="secondary.100" fontSize="xs">
                  {currentTrack ? currentTrack.artist : "Unknown Artist"}
                </Text>
            </VStack>

            {/* Player Controls */}
            <HStack 
              gridColumn={{base:"3/4"}}
              gridRow="1/2"
              justify="flex-end"
              align="center"
              spacing={4}
            >
                <IconButton
                    aria-label={isPlaying ? "Pause" : "Play"}
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    onClick={isPlaying ? pauseTrack : resumeTrack}
                    size="md"
                    color="dark.500"
                    variant="ghost"
                    _hover={{ color: "secondary.500" }}
                   
                />
            </HStack>

            {/* Progress Slider (Bottom Border as Slider) */}
            <Slider
                aria-label="progress"
                value={progress}
                onChange={seekTrack}
                gridColumn="1/5"
                gridRow="2/3"
                w="100%"
                h="2px"
                colorScheme="secondary"
                position="absolute"
                bottom="0"
                left="0"
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
            </Slider>

            {/* Volume Control */}
            <HStack 
              spacing={2} 
              gridColumn="4/5" 
              gridRow="1/2"
              justifySelf="flex-start"
              mx={2}
              display={{ base: "none", md: "flex" }} // Hide volume control on small screens
            >
                <FaVolumeDown/>
                <Slider 
                  aria-label="volume" 
                  value={volume} 
                  onChange={handleSliderChange} 
                  w="100px" 
                  colorScheme="dark"
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <FaVolumeUp/>
            </HStack>

            <IconButton
              aria-label="close"
              size="sm"
              
              icon={<CloseIcon/>}
              onClick={handleClose}
              variant="ghost"
              color="dark.100"
              fontWeight="bold"
              position="absolute"
              _hover={{color:"secondary.500"}}
              zIndex={4}
              right={0}
              top={0}
            
            />
        </Box>
    );
};

export default MusicPlayer;
