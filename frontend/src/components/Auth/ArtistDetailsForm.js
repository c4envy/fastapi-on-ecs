import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  useToast,
  Box,
  IconButton,
  Image,
} from '@chakra-ui/react';
import axiosInstance from '../../services/axios';
import { FiUpload } from 'react-icons/fi';

const ArtistDetailsForm = ({ artistData, setArtistData }) => {
  const [artistId, setArtistId] = useState('');
  const [platform, setPlatform] = useState('');
  const [storeFront, setStoreFront] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const toast = useToast();

  const fetchArtistDetails = async () => {
    try {
      if (!artistId || !platform) {
        throw new Error('Please enter Artist Id and select a platform');
      }

      let endpoint = '';
      let response = null;
      let data = null;

      switch (platform) {
        case 'spotify':
          endpoint = `/spotify/artist_info/${artistId}`;
          response = await axiosInstance.get(endpoint);
          data = {
            artist_name: response.data.name,
            genres: response.data.genres,
            artist_id: {
              id: response.data.id,
              platform: platform,
            },
            image_url: response.data.images[0].url,
          };
          break;
        case 'tidal':
          if (!storeFront) {
            throw new Error('Please enter Store Front for Tidal');
          }
          endpoint = `/tidal/artist/${artistId}/${storeFront}`;
          response = await axiosInstance.get(endpoint);
          data = {
            artist_name: response.data.resource.name,
            genres: ["NA"],
            artist_id: {
              id: response.data.resource.id,
              platform: platform,
            },
            image_url: response.data.resource.picture[0].url,
          };
          break;
        case 'apple':
          if (!storeFront) {
            throw new Error('Please enter Store Front for Apple Music');
          }
          endpoint = `/apple/artist/${storeFront}/${artistId}`;
          response = await axiosInstance.get(endpoint);
          data = {
            artist_name: response.data.data[0].attributes.name,
            genres: response.data.data[0].attributes.genreNames,
            artist_id: {
              id: response.data.data[0].id,
              platform: platform,
            },
            image_url:`${response.data.data[0].attributes.artwork.url.slice(0, response.data.data[0].attributes.artwork.url.length - 14)}/${response.data.data[0].attributes.artwork.width}x${response.data.data[0].attributes.artwork.height}bb.jpg`,
          };
          break;
        default:
          throw new Error('Invalid platform');
      }

      setArtistData(data);
    } catch (error) {
      toast({
        title: 'Error Fetching Artist Details',
        description: error.message,
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
    }
  };

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
      const response = await axiosInstance.post(`/music/save/artist/art/s3?artist=${artistData.artist_name}`, formData);
      const imageUrl = response.data;
      console.log(response)
      setArtistData((prevData) => ({
        ...prevData,
        image_url: imageUrl,
      }));

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

  return (
    <>
      <FormControl isRequired mt={3}>
        <Input
          placeholder="Artist Id"
          type="text"
          variant="filled"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired mt={3}>
        <Select
          placeholder="Select Platform"
          variant="filled"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="spotify">Spotify</option>
          <option value="tidal">Tidal</option>
          <option value="apple">Apple Music</option>
          {/* Add more platforms as needed */}
        </Select>
      </FormControl>

      {platform === 'tidal' || platform === 'apple' ? (
        <FormControl isRequired mt={3}>
          <Input
            placeholder={`Enter Store Front for ${platform}`}
            type="text"
            variant="filled"
            value={storeFront}
            onChange={(e) => setStoreFront(e.target.value)}
          />
        </FormControl>
      ) : null}

      <Button mt={3} onClick={fetchArtistDetails}>
        Get Artist Info
      </Button>

      {artistData && (
        <Box mt={4} bg="secondary.500" p={2} borderRadius={5}>
          <Image my={2} src={artistData.image_url} alt={artistData.artist_name} borderRadius='lg' width="100px" />
          <FormControl isRequired>
            <Input
              placeholder="Artist Name"
              type="text"
              variant="filled"
              value={artistData.artist_name}
              isReadOnly
            />
          </FormControl>

          <FormControl isRequired mt={3}>
            <Input
              placeholder="Genres"
              type="text"
              variant="filled"
              value={artistData.genres.join(", ")}
              isReadOnly
            />
          </FormControl>

          <FormControl isRequired mt={3}>
            <Input
              placeholder="Artist Id"
              type="text"
              variant="filled"
              value={artistData.artist_id.id}
              isReadOnly
            />
          </FormControl>
        

          {/* <FormControl isRequired mt={3}>
            <Input
              placeholder="Image URL"
              type="text"
              variant="filled"
              value={artistData.image_url}
              isReadOnly
            />
          </FormControl> */}

          {/* <FormControl isRequired mt={3}>
            <Input
              type="file"
              variant="filled"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
                <IconButton
                mt={3}
                onClick={handleImageUpload}
                icon={<FiUpload />}
                aria-label="Upload Image"
                colorScheme="blue"
              />
          </FormControl> */}
        </Box>
      )}
    </>
  );
};

export default ArtistDetailsForm;
