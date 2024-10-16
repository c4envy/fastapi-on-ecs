import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Button, Box, Select, Spinner, useToast } from '@chakra-ui/react';
import axiosInstance from '../../services/axios';
import Tracks from './Tracks';

const TrackForm = ({ service, requestType }) => {
    const [id, setId] = useState('');
    const [items, setItems] = useState([]);
    const [selectedStorefront, setSelectedStorefront] = useState('us');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            let response;
            if (requestType === 'singleTrack') {
                if (service === 'spotify') {
                    response = await axiosInstance.get(`/spotify/track/${id}`);
                    setItems([response.data]);
                } else if (service === 'apple') {
                    response = await axiosInstance.get(`/apple/song/${selectedStorefront}/${id}`);
                    setItems(response.data.data);
                } else if (service === 'tidal') {
                    response = await axiosInstance.get(`/tidal/track/${Number(id)}/${selectedStorefront}`);
                    setItems(response.data.data);
                }
            } else if (requestType === 'albumTracks') {
                if (service === 'spotify') {
                    response = await axiosInstance.get(`/spotify/album/tracks/${id}`);
                    let response_tracks = await Promise.all(response.data.items.map(async tr => {
                        let tra = await axiosInstance.get(`/spotify/track/${tr.id}`);
                        return tra.data;
                    }));
                    setItems(response_tracks);
                } else if (service === 'apple') {
                    response = await axiosInstance.get(`/apple/album/${selectedStorefront}/${id}`);
                    setItems(response.data.data[0].relationships.tracks.data);
                } else if (service === 'tidal') {
                    response = await axiosInstance.get(`/tidal/album/items/${Number(id)}/${selectedStorefront}`);
                    setItems(response.data.data);
                }
            }
        } catch (error) {
            toast({
                title: 'Error fetching tracks.',
                description: error.message || 'An unexpected error occurred.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error('Error fetching tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>{requestType === 'singleTrack' ? 'Track ID' : 'Album ID'}:</FormLabel>
                    <Input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        variant="filled"
                        placeholder={requestType === 'singleTrack' ? 'Enter Track ID' : 'Enter Album ID'}
                    />
                </FormControl>
                {(service === 'apple' || service === 'tidal') && (
                    <FormControl mt="4">
                        <FormLabel>Storefront:</FormLabel>
                        <Select
                            value={selectedStorefront}
                            onChange={(e) => setSelectedStorefront(e.target.value)}
                            variant="filled"
                        >
                            <option value="us">US</option>
                            <option value="gb">GB</option>
                        </Select>
                    </FormControl>
                )}
                <Button mt="4" type="submit" isDisabled={loading}>
                    {loading ? <Spinner size="sm" /> : requestType === 'singleTrack' ? 'Fetch Track Details' : 'Fetch Tracks'}
                </Button>
            </form>
            <Tracks
                items={items}
                service={service}
                selectedStorefront={selectedStorefront}
            />
        </Box>
    );
};

export default TrackForm;
