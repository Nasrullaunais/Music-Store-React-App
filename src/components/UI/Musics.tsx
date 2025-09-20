import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Image } from '@heroui/react';
import { fetchAllMusic, PaginatedResponse } from '../../api/music.ts';
import { Music } from '@/types';
import { Link } from 'react-router-dom';


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
    const imageUrl = `http://localhost:8082/uploads/covers/colorful-bicycle-with-guitar-meadow.jpg`;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8 text-center">All Music Tracks</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks?.content.map((track: Music) => (
                    <Card isBlurred={true} key={track.id} className="py-4">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h4 className="font-bold text-large">{track.name}</h4>
                            <p className="text-tiny uppercase font-bold">{track.genre}</p>
                            <small className="text-default-500">by {track.artist}</small>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                            <Image
                                alt={track.title}
                                className="object-cover rounded-xl"
                                src={imageUrl}
                                width={270}
                            />
                            <div className="mt-2 flex justify-between items-center">
                                <p className="text-lg font-bold text-blue-600">${track.price.toFixed(2)}</p>
                                <Link to={`/tracks/${track.id}`} className="text-blue-500 hover:underline">
                                    View Details
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MusicPage;