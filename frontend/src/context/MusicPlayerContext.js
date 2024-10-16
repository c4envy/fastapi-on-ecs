

import { createContext, useState, useContext, useEffect } from 'react';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
    return useContext(MusicPlayerContext);
};

export const MusicPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [progress, setProgress] = useState(0);

    const playTrack = (track) => {
        if (audio) {
            audio.pause(); // Pause any currently playing audio
        }

        const newAudio = new Audio(track.url);
        setCurrentTrack(track);
        setAudio(newAudio);
        newAudio.play();
        setIsPlaying(true);

        newAudio.ontimeupdate = () => {
            setProgress((newAudio.currentTime / newAudio.duration) * 100);
        };

        newAudio.onended = () => {
            setIsPlaying(false);
            setProgress(0);
        };
    };

    const pauseTrack = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const resumeTrack = () => {
        if (audio) {
            audio.play();
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (value) => {
        if (audio) {
            audio.volume = value / 100;
        }
    };

    // Stop playing track and reset player state
    const handleClose = () => {
        if (audio) {
            audio.pause();  // Pause the audio
            audio.currentTime = 0;  // Reset the playback position to the start
        }
        setCurrentTrack(null);  // Reset current track
        setAudio(null);  // Clear audio object
        setIsPlaying(false);  // Set playing state to false
        setProgress(0);  // Reset progress
    };

    // Seek to a specific time in the track when the progress slider is adjusted
    const seekTrack = (value) => {
        if (audio) {
            const seekTime = (value / 100) * audio.duration;  // Calculate time to seek to
            audio.currentTime = seekTime;  // Set the audio's current time to the new seek time
            setProgress(value);  // Update the progress state
        }
    };

    return (
        <MusicPlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            progress,
            playTrack,
            pauseTrack,
            resumeTrack,
            handleVolumeChange,
            handleClose,
            seekTrack,  // Pass seekTrack to the context so it can be used in components
        }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};
