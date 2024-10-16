import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Herocard from "../Spotify/Herocard";
import { Outlet } from "react-router-dom";

const ArtistDashboard = ({artist_profile}) => {
  return (
    <Box>
    
      <Outlet/>
    </Box>
  );
};

export default ArtistDashboard;
