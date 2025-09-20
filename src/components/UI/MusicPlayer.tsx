import {useRef, useEffect, useState} from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause } from 'react-icons/fa';

interface MusicPlayerProps {
    fileUrl: string;
}

const MusicPlayer = ({ fileUrl }: MusicPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (!isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
            setIsPlaying(!isPlaying);
        }
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            // Check if the user is not authenticated and the current time exceeds 10 seconds
            if (audio.currentTime >= 10) {
                audio.pause(); // Pause the music
                audio.currentTime = 0; // Reset the audio to the beginning
                setIsPlaying(false);

                toast.info(
                    <div className="text-center">
                        <p className="font-bold">Preview Expired!</p>
                        <p>Please log in or sign up to listen to the full track.</p>
                        <button
                            onClick={() => {
                                navigate('/auth');
                            }}
                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                        >
                            Go to Login
                        </button>
                    </div>,
                    {
                        position: "bottom-center",
                        autoClose: 5000, // Toast will close in 5 seconds
                    }
                );
            }
        };
        const handleAudioEnd = () => {
            setIsPlaying(false);
        }

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleAudioEnd);

        // Clean up the event listener when the component unmounts
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, [isAuthenticated, navigate]);

    return (
        <div>
            <button onClick={handlePlayPause}>
                {isPlaying ? (
                    <FaPause className="text-xl text-indigo-600 hover:text-indigo-700 mt-1 hover:scale-110 transition-transform duration-300 ml-1" />
                ) : (
                    <FaPlay className="text-xl text-indigo-600 hover:text-indigo-700 mt-1 hover:scale-110 transition-transform duration-300 ml-1" />
                )}
            </button>
            <audio ref={audioRef}> {/* No `controls` attribute here */}
                <source src={fileUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export default MusicPlayer;