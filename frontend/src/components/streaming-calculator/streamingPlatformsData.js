import { FaSpotify,FaNapster ,FaApple, FaAmazon, FaYoutube, FaDeezer, FaSoundcloud, FaGooglePlay } from 'react-icons/fa';
import { SiPandora, SiTidal } from 'react-icons/si';



const streamingPlatformsData = [
    { platform: 'Napster', payPerStream: 0.019, icon: <FaNapster size="20px" color='#cfb182'/> },
    { platform: 'Tidal', payPerStream: 0.012, icon: <SiTidal size="20px" color='#cfb182'/> },
    { platform: 'Apple Music', payPerStream: 0.008, icon: <FaApple size="20px" color='#cfb182'/> },
    { platform: 'Google Play Music', payPerStream: 0.006, icon: <FaGooglePlay size="20px" color='#cfb182'/> },
    { platform: 'Deezer', payPerStream: 0.0064, icon: <FaDeezer size="20px" color='#cfb182'/> },
    { platform: 'Amazon Music', payPerStream: 0.0045, icon: <FaAmazon size="20px" color='#cfb182'/> },
    { platform: 'Spotify', payPerStream: 0.004, icon: <FaSpotify size="20px" color='#cfb182'/> },
    { platform: 'SoundCloud', payPerStream: 0.00275, icon: <FaSoundcloud size="20px" color='#cfb182'/> },
    { platform: 'Pandora', payPerStream: 0.0013, icon: <SiPandora size="20px" color='#cfb182'/> },
    { platform: 'YouTube', payPerStream: 0.00085, icon: <FaYoutube size="20px" color='#cfb182'/> }
];

export default streamingPlatformsData