import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Image } from '@heroui/react';
import { fetchAllMusic, PaginatedResponse } from '@/api/music.ts';
import { Music } from '@/types';
import AddToCartButton from './AddToCartButton';
import MusicPlayer from "@/components/UI/MusicPlayer.tsx";
// import SearchBar from "@/components/common/SearchBar.tsx";


const MusicPage = () => {
    const [tracks, setTracks] = useState<PaginatedResponse<Music>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setLoading(true);
                const fetchedTracks = await fetchAllMusic();
                setTracks(fetchedTracks);
                setError(null);
            } catch (err: any) {
                setError("Failed to fetch tracks. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTracks();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading tracks...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-600">{error}</div>;
    }
    const imageUrl = `http://localhost:8082/uploads/covers/`;
    const audioUrl = `http://localhost:8082`;



    return (
        <div className="container mx-auto p-4">
            {/*<div className="flex flex-col md:flex-row items-center justify-between mb-8">*/}
            {/*    <h1 className="text-4xl font-bold mb-8 text-left ml-4">All Music Tracks</h1>*/}
            {/*    <SearchBar />*/}
            {/*</div>*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tracks?.content.map((track: Music) => (
                    <Card isBlurred={true} key={track.id} className="bg-opacity-90 w-full brightness-110 py-4 hover:shadow-lg rounded-xl  hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col justify-between items-start">
                            <h4 className="font-bold text-medium">{track.name}</h4>
                            <div className="flex flex-row mb-1 justify-between items-center w-full">
                                <div>
                                    <p className="text-tiny uppercase font-bold">{track.genre}</p>
                                    <small className="text-default-500">by {track.artist}</small>
                                </div>
                                <div className="flex flex-row gap-2  justify-center items-center bg-gray-300 rounded-xl p-1 mt-2">
                                    <MusicPlayer fileUrl={audioUrl.concat(track.audioFilePath as string)}></MusicPlayer>
                                    <p className="text-tiny text-center mb-1 mr-1 mt-1">Preview</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2 items-center flex flex-col ">
                            <Image
                                alt={track.title}
                                className="object-cover rounded-xl"
                                src={imageUrl.concat(track.imageUrl as string)}
                                width={250}
                                height={200}
                                isBlurred={true}
                            />
                            <div className="mt-auto flex items-center justify-between pt-2 w-full px-1">
                                <p className="text-lg font-bold text-indigo-800">${track.price.toFixed(2)}</p>
                                <AddToCartButton
                                    itemId={track.id}
                                    title={track.name}
                                    artist={track.artist}
                                    price={track.price}
                                    image={track.imageUrl as string}
                                    duration={track.duration}/>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MusicPage;