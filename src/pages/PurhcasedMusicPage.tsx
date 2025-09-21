import React, {useEffect, useState} from 'react';
import {useAuth} from "@/context/AuthContext.tsx";
import {Music} from "@/types";
import {fetchMyPurchasedMusic} from "@/api/myMusic.ts";
import AudioPlayer from "@/components/common/MusicPlayer.tsx"

export const ListboxWrapper = ({children}: {children: React.ReactNode}) => (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        {children}
    </div>
);

export const PurchasedMusic = () => {
    const {isAuthenticated, loading} = useAuth();
    const [currentMusic, setCurrentMusic] = useState<Music | null>(null);
    const [isLoading, setIsLoading] = useState(loading);
    const [purchasedMusic, setPurchasedMusic] = useState<Music[]>([]);

    useEffect(() => {
        const fetchPurchasedMusic = async () => {
            try {
                setIsLoading(true);
                const userPurchasedMusic = await fetchMyPurchasedMusic();
                setPurchasedMusic(userPurchasedMusic);
                console.log("Purchased Music fetched: ", userPurchasedMusic);
            } catch (error) {
                console.error("Error fetching purchased music:", error);
            } finally {
                setIsLoading(false); // Set to false when loading is complete
            }
        };
        fetchPurchasedMusic();
    }, []);

    // const imageUrl = `http://localhost:8082/uploads/covers/`;
    const audioUrl = `http://localhost:8082`;
    return (
        <div className="container mx-auto p-4 w-full">
            {currentMusic && (
                <div className="flex-2">
                    <AudioPlayer
                        audioSrc = {audioUrl.concat(currentMusic.audioFilePath as string)}
                        audioArtist={currentMusic.artist}
                        audioTitle={currentMusic.title as string}
                    />
                </div>
            )}
            {isAuthenticated && !isLoading && purchasedMusic.length > 0 ? (
                <div className="grid grid-cols-1 grid-flow-row gap-4 w-full">
                    {purchasedMusic.map((music: Music) => (
                        <div key={music.id}>
                            <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer" onClick={() => {setCurrentMusic(music)}}>



                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    {isLoading ? "Loading..." : "No purchased music found"}
                </div>
            )}
        </div>
    )

    
}