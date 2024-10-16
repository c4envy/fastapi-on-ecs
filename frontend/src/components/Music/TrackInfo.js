import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box, Button, FormControl, FormLabel, FormErrorMessage,
    Input, Stack, IconButton, Select, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, Text, useToast
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import axiosInstance from '../../services/axios';
import { useAuth } from "../../hooks/useAuth";
import ReactSelect from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';

const TrackInfo = ({ storefront, platform, track, onClose,onTrackCreated }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [trackFile, setTrackFile] = useState(null)

    const navigate = useNavigate()
    let location = useLocation()

    const genres = [
        'Afrobeat', 'AfroRave', 'AfroFusion', 'EmoAfrobeats', 'Street-Hop', 
        'Pon Pon Music', 'AfroLife', 'Highlife', 'Kuduro', 'Afrocongo', 
        'Gqom', 'Azonto', 'Rock', 'Hard Rock', 'Soft Rock', 'Progressive Rock', 
        'Punk Rock', 'Alternative Rock', 'Jazz', 'Bebop', 'Swing', 'Fusion', 
        'Free Jazz', 'Smooth Jazz', 'Classical', 'Baroque', 'Romantic', 
        'Modern', 'Classical Period', 'Contemporary Classical', 'Hip Hop', 
        'Rap', 'Trap', 'Gangsta Rap', 'Conscious Hip Hop', 'East Coast Hip Hop', 
        'West Coast Hip Hop', 'Electronic', 'House', 'Techno', 'Dubstep', 
        'Trance', 'Drum and Bass', 'Ambient', 'Pop', 'Teen Pop', 'Dance Pop', 
        'Synth-pop', 'Electropop', 'Pop Rock', 'R&B', 'Contemporary R&B', 
        'Soul', 'Funk', 'Disco', 'New Jack Swing', 'Country', 'Bluegrass', 
        'Honky Tonk', 'Outlaw Country', 'Country Pop', 'Alternative Country', 
        'Reggae', 'Roots Reggae', 'Dub', 'Dancehall', 'Ska', 'Rocksteady'
      ].map(genre => ({ value: genre, label: genre }));

    function formatDateFromISO(isoDateString) {
        let date = new Date(isoDateString);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    const auth = useAuth();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [trackDetails, setTrackDetails] = useState({
        track_status: 'reviewing',
        artist_name: track.artistName,
        track_name: track.track_name,
        streaming_platforms: [{ platform: platform, id: track.id }],
        album_name: track.album_name,
        album_type: 'single',
        release_date: "",
        num_of_shares: 0,
        available_shares: 0,
        price_per_share: 0,
        share_limit: 0,
        genres: [],
        image_url: "",
        total_track_percent_for_sale: 0,
        ownership_term: 0
    });

    useEffect(() => {
        trackDetails.streaming_platforms[0].platform = platform;
        trackDetails.streaming_platforms[0].id = track.id;
        trackDetails.image_url = trackDetails.image_url
        setTrackDetails(trackDetails);
    }, [imageFile]);

    useEffect(() => {
        const fetchTrackDetails = async () => {
            try {
                if (platform === 'spotify') {
                    setValue('artist_name', track.artists.map(artist => artist.name).join(', '));
                    setValue('track_name', track.name);
                    setValue('album_name', track.album.name);
                    setValue('image_url', track.album.images[0].url);
                    setValue('album_type', 'single');
                    setValue('release_date', track.album.release_date);
                    setTrackDetails({ ...trackDetails, image_url: track.album.images[0].url })
                } else if (platform === 'apple') {
                    setValue('artist_name', track.attributes.artistName);
                    setValue('track_name', track.attributes.name);
                    setValue('album_name', track.attributes.albumName);
                    setValue('image_url', `${track.attributes.artwork.url.slice(0, track.attributes.artwork.url.length - 14)}/${track.attributes.artwork.width}x${track.attributes.artwork.height}bb.jpg`);
                    setValue('album_type', 'single');
                    setValue('release_date', track.attributes.releaseDate);
                    setTrackDetails({ ...trackDetails, image_url: `${track.attributes.artwork.url.slice(0, track.attributes.artwork.url.length - 14)}/${track.attributes.artwork.width}x${track.attributes.artwork.height}bb.jpg` })

                } else if (platform === 'tidal') {
                    setValue('artist_name', track.resource.artists.map(artist => artist.name).join(', '));
                    setValue('track_name', track.resource.title);
                    setValue('album_name', track.resource.album.title);
                    setValue('image_url', track.resource.album.imageCover[0].url);
                    setValue('album_type', 'single');
                    setTrackDetails({ ...trackDetails, image_url: track.resource.album.imageCover[0].url })

                } else {
                    throw new Error('Invalid platform provided');
                }
            } catch (error) {
                console.error('Error fetching track data:', error);
            }
        };
        fetchTrackDetails();
    }, [track.id, platform, storefront, setValue]);

    const handleImageUpload = async () => {
        if (!imageFile) {
            toast({
                title: 'No file selected',
                status: 'error',
                isClosable: true,
                duration: 3000,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await axiosInstance.post(`/music/upload/file?artist=${trackDetails.artist_name}`, formData);
            const imageUrl = response.data;
            setTrackDetails({ ...trackDetails, image_url: imageUrl })
         
            toast({
                title: 'Image Uploaded Successfully',
                status: 'success',
                isClosable: true,
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: 'Error Uploading Image',
                description: error.message,
                status: 'error',
                isClosable: true,
                duration: 3000,
            });
        }
    };

    const handleTrackUpload = async () =>{
        
    }

    const onSubmit = async (data) => {
        
        setLoading(true);
        setError(null);
        setSuccess(false);
        



        data = { ...data, streaming_platforms: trackDetails.streaming_platforms, track_status: trackDetails.track_status, available_shares: data.num_of_shares, genres: data.genres };
        data.release_date = new Date(data.release_date).toISOString();
        data.genres = trackDetails.genres.map(gen => gen.value);
        data.image_url = trackDetails.image_url
        console.log(data)


        try {
            const response = await axiosInstance.post('/music/create_track', data);
            setSuccess(true);
            onClose();
            console.log(response.data)
            onTrackCreated(response.data); 
            toast({
                title: "Track created successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
      
            
        } catch (error) {
            setError(error.message || 'An error occurred');
            toast({
                title: "An error occurred.",
                description: error.message || "Failed to create track.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlatform = () => {
        setTrackDetails(prevState => ({
            ...prevState,
            streaming_platforms: [...prevState.streaming_platforms, { platform: '', id: '' }]
        }));
    };

    const handleRemovePlatform = (index) => {
        setTrackDetails(prevState => ({
            ...prevState,
            streaming_platforms: prevState.streaming_platforms.filter((_, idx) => idx !== index)
        }));
    };

    const handlePlatformChange = (index, field, value) => {
        setTrackDetails(prevState => ({
            ...prevState,
            streaming_platforms: prevState.streaming_platforms.map((platform, idx) =>
                idx === index ? { ...platform, [field]: value } : platform
            )
        }));
    };

    const handleGenresChange = (selectedOptions) => {
        setTrackDetails(prevState => ({
            ...prevState,
            genres: selectedOptions
        }));
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="xl">
                <ModalHeader textAlign="center" fontWeight="bold">Create Music Track</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {trackDetails.image_url && <img src={trackDetails.image_url} alt="Track Artwork" width="200px" />}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <FormControl>
                                <FormLabel>Change Image</FormLabel>
                                <Input type="file" display="none" id='file-upload' onChange={(e) => setImageFile(e.target.files[0])} variant="light" />
                                <Button
                                    as="label"
                                    htmlFor="file-upload"
                                    variant="brand"
                                >
                                    +
                                </Button>


                            </FormControl>
                            <Button onClick={handleImageUpload} mt={2} variant="solid">Upload Image</Button>


                            <FormControl>
                                <FormLabel>Upload Track (MP3 or WAV)</FormLabel>
                                <Input type="file" accept=".mp3,.wav" display="none" id='track-upload' onChange={(e) => setTrackFile(e.target.files[0])} />
                                <Button as="label" htmlFor="track-upload" variant="brand">Upload Track</Button>
                            </FormControl>
                            <Button onClick={handleTrackUpload} mt={2} variant="solid">Upload Track File</Button>

                            <FormControl isInvalid={errors.artist_name}>
                                <FormLabel>Artist Name</FormLabel>
                                <Input type="text" {...register('artist_name', { required: true })} defaultValue={trackDetails.artist_name} variant="light" />
                                <FormErrorMessage>{errors.artist_name && "Artist name is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.track_name}>
                                <FormLabel>Track Name</FormLabel>
                                <Input type="text" {...register('track_name', { required: true })} defaultValue={trackDetails.track_name} variant="light" />
                                <FormErrorMessage>{errors.track_name && "Track name is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Streaming Platforms</FormLabel>
                                <Stack spacing={2}>
                                    {trackDetails.streaming_platforms.map((pf, index) => (
                                        <Box key={index} display="flex" alignItems="center">
                                            <Select
                                                flex="1"
                                                onChange={(e) => handlePlatformChange(index, 'platform', e.target.value)}
                                                value={pf.platform}
                                                placeholder="Select Platform"
                                                variant="light"
                                            >
                                                <option value="spotify">Spotify</option>
                                                <option value="apple">Apple Music</option>
                                                <option value="tidal">Tidal</option>
                                            </Select>
                                            <Input
                                                flex="3"
                                                ml={2}
                                                value={pf.id}
                                                onChange={(e) => handlePlatformChange(index, 'id', e.target.value)}
                                                placeholder="Track ID"
                                                variant="light"
                                            />
                                            {index > 0 && (
                                                <IconButton
                                                    ml={2}
                                                    icon={<MinusIcon />}
                                                    onClick={() => handleRemovePlatform(index)}
                                                    colorScheme="red"
                                                />
                                            )}
                                        </Box>
                                    ))}
                                    <Button onClick={handleAddPlatform} leftIcon={<AddIcon />} color="dark.900" borderColor="dark.900" variant="solid">
                                        Add Platform
                                    </Button>
                                </Stack>
                            </FormControl>
                            <FormControl isInvalid={errors.album_name}>
                                <FormLabel>Album Name</FormLabel>
                                <Input type="text" {...register('album_name', { required: true })} defaultValue={trackDetails.album_name} variant="light" />
                                <FormErrorMessage>{errors.album_name && "Album name is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Album Type</FormLabel>
                                <Select {...register('album_type', { required: true })} defaultValue={trackDetails.album_type} variant="light">
                                    <option value="single">Single</option>
                                    <option value="ep">EP</option>
                                    <option value="album">Album</option>
                                </Select>
                            </FormControl>
                            <FormControl isInvalid={errors.release_date}>
                                <FormLabel>Release Date</FormLabel>
                                <Input type="date" {...register('release_date', { required: true })} defaultValue={formatDateFromISO(trackDetails.release_date)} variant="light" />
                                <FormErrorMessage>{errors.release_date && "Release date is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.num_of_shares}>
                                <FormLabel>Number of Shares</FormLabel>
                                <Input type="number" {...register('num_of_shares', { required: true })} variant="light" />
                                <FormErrorMessage>{errors.num_of_shares && "Number of shares is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.available_shares}>
                                <FormLabel>Available Shares</FormLabel>
                                <Input type="number" {...register('available_shares', { required: true })} variant="light" />
                                <FormErrorMessage>{errors.available_shares && "Available shares is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.price_per_share}>
                                <FormLabel>Price Per Share</FormLabel>
                                <Input
                                    {...register('price_per_share', {
                                        required: "Price per share is required",
                                        validate: (value) => {
                                            const floatValue = parseFloat(value);
                                            return !isNaN(floatValue) || "Price per share must be a valid number";
                                        }
                                    })}
                                    variant="light"
                                />
                                <FormErrorMessage>{errors.price_per_share && errors.price_per_share.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.share_limit}>
                                <FormLabel>Share Limit</FormLabel>
                                <Input type="number" {...register('share_limit', { required: true })} variant="light" />
                                <FormErrorMessage>{errors.share_limit && "Share limit is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.genres}>
                                <FormLabel>Genres</FormLabel>
                                <ReactSelect
                                    {...register('genres', { required: false })}
                                    options={genres}
                                    isMulti
                                    value={trackDetails.genres}
                                    onChange={handleGenresChange}
                                />
                                <FormErrorMessage>{errors.genres && "At least one genre is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.total_track_percent_for_sale}>
                                <FormLabel>Total Track Percent for Sale</FormLabel>
                                <Input type="number" {...register('total_track_percent_for_sale', { required: true })} variant="light" />
                                <FormErrorMessage>{errors.total_track_percent_for_sale && "Total track percent for sale is required"}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.ownership_term}>
                                <FormLabel>Ownership Term</FormLabel>
                                <Input type="number" {...register('ownership_term', { required: true, min: 5 })} variant="light" />
                                <FormErrorMessage>{errors.ownership_term && "Ownership term must be at least 5"}</FormErrorMessage>
                            </FormControl>
                            {error && <Text color="red.500">{error}</Text>}
                            <Button type="submit" isLoading={loading} colorScheme="blue">Create Track</Button>
                        </Stack>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default TrackInfo;


