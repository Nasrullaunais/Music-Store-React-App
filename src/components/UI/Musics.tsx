import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Image, Chip } from '@heroui/react';
import { fetchAllMusic, PaginatedResponse } from '@/api/music.ts';
import { Music } from '@/types';
import AddToCartButton from './AddToCartButton';
import MusicPreview from "@/components/UI/MusicPreview.tsx";
import { AiFillStar } from "react-icons/ai";
import { FiMusic, FiSearch } from "react-icons/fi";

interface MusicsProps {
    searchQuery?: string;
}

const MusicPage: React.FC<MusicsProps> = ({ searchQuery = '' }) => {
    const [tracks, setTracks] = useState<PaginatedResponse<Music>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setLoading(true);
                // Pass search query to API if it exists
                const fetchedTracks = await fetchAllMusic(0, 100, searchQuery || undefined);

                // If a searchQuery was provided and backend returned a full list (or ignored the param),
                // perform a client-side filter to ensure correct search behavior.
                if (searchQuery && fetchedTracks?.content) {
                    const term = searchQuery.trim().toLowerCase();
                    const filtered = fetchedTracks.content.filter((m) => {
                        const name = (m.name || m.title || '').toString().toLowerCase();
                        const artist = (m.artist || '').toString().toLowerCase();
                        const genre = (m.genre || '').toString().toLowerCase();
                        return (
                            name.includes(term) ||
                            artist.includes(term) ||
                            genre.includes(term)
                        );
                    });

                    // Keep pagination metadata but replace content with filtered results
                    const paginatedFiltered: PaginatedResponse<Music> = {
                        ...fetchedTracks,
                        content: filtered,
                        totalElements: filtered.length,
                        totalPages: Math.ceil(filtered.length / (fetchedTracks.size || filtered.length || 1)),
                    };
                    setTracks(paginatedFiltered);
                } else {
                    setTracks(fetchedTracks);
                }

                setError(null);
            } catch (err: any) {
                setError("Failed to fetch tracks. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTracks();
    }, [searchQuery]); // Re-fetch when search query changes

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center mt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-indigo-600 dark:text-indigo-400">
                    {searchQuery ? 'Searching music...' : 'Loading tracks...'}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center mt-20">
                <FiMusic size={48} className="text-red-400 mb-4" />
                <div className="text-center text-red-600 dark:text-red-400">{error}</div>
            </div>
        );
    }

    const imageUrl = `http://localhost:8082`;
    const audioUrl = `http://localhost:8082`;

    return (
        <div className="container mt-5 w-full px-4">
            {/* Search Results Header */}
            {searchQuery && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <FiSearch className="text-indigo-600 dark:text-indigo-400" size={24} />
                        <h1 className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">
                            Search Results
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-gray-600 dark:text-gray-400">Searching for:</span>
                        <Chip
                            color="primary"
                            variant="flat"
                            className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                        >
                            "{searchQuery}"
                        </Chip>
                        <span className="text-gray-600 dark:text-gray-400">
                            ({tracks?.totalElements || 0} result{tracks?.totalElements !== 1 ? 's' : ''} found)
                        </span>
                    </div>
                </div>
            )}

            {/* Default Header for All Music */}
            {!searchQuery && (
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-indigo-950 dark:text-indigo-50 mb-2">
                        Discover Music
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Explore our collection of {tracks?.totalElements || 0} amazing tracks
                    </p>
                </div>
            )}

            {/* No Results Message */}
            {tracks?.content.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <FiMusic size={64} className="text-gray-400 mb-6" />
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        {searchQuery ? 'No music found' : 'No music available'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 text-center max-w-md">
                        {searchQuery
                            ? `Try searching with different keywords or browse our full catalog.`
                            : 'Check back later for new releases and updates.'
                        }
                    </p>
                </div>
            )}

            {/* Music Grid */}
            {tracks?.content && tracks.content.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {tracks.content.map((track: Music) => (
                        <Card
                            isBlurred={true}
                            key={track.id}
                            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm w-full py-4 hover:shadow-xl rounded-xl hover:scale-105 transition-all duration-300 border border-indigo-100 dark:border-indigo-900/50"
                        >
                            <CardHeader className="pb-0 pt-2 px-4 flex-col justify-between items-start">
                                <h4 className="font-bold text-medium text-indigo-950 dark:text-indigo-50 truncate w-full">
                                    {track.name}
                                </h4>
                                <div className="flex flex-row mb-1 justify-between items-center w-full">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-tiny uppercase font-bold text-indigo-600 dark:text-indigo-400">
                                            {track.genre}
                                        </p>
                                        <small className="text-gray-500 dark:text-gray-400 truncate block">
                                            by {track.artist}
                                        </small>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-center items-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl p-1 mt-2 ml-2">
                                        <MusicPreview fileUrl={audioUrl.concat(track.audioFilePath as string)} />
                                        <p className="text-tiny text-center mb-1 mr-1 mt-1 text-indigo-700 dark:text-indigo-300">
                                            Preview
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2 items-center flex flex-col">
                                <Image
                                    alt={track.title}
                                    className="object-cover rounded-xl shadow-md"
                                    src={imageUrl.concat(track.imageUrl as string)}
                                    width={250}
                                    height={200}
                                    isBlurred={true}
                                />
                                {/* Rating Display */}
                                {track.averageRating && track.totalReviews ? (
                                    <div className="flex items-center gap-1 mt-3 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                                        <AiFillStar className="text-yellow-500" size={16} />
                                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                            {track.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-tiny text-yellow-600 dark:text-yellow-400">
                                            ({track.totalReviews})
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 mt-3 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                        <AiFillStar className="text-gray-400" size={16} />
                                        <span className="text-tiny text-gray-500">No reviews yet</span>
                                    </div>
                                )}
                                <div className="mt-auto flex items-center justify-between pt-3 w-full px-1">
                                    <p className="text-lg font-bold text-indigo-800 dark:text-indigo-300">
                                        ${track.price.toFixed(2)}
                                    </p>
                                    <AddToCartButton
                                        itemId={track.id}
                                        title={track.name}
                                        artist={track.artist}
                                        price={track.price}
                                        image={track.imageUrl as string}
                                        duration={track.duration}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MusicPage;