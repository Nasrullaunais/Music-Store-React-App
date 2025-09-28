import React, {useEffect, useState} from 'react';
import {useAuth} from "@/context/AuthContext.tsx";
import {Music, Playlist} from "@/types";
import {fetchMyPurchasedMusic} from "@/api/myMusic.ts";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistWithMusic,
    updatePlaylist,
    deletePlaylist,
    addMusicToPlaylist,
    removeMusicFromPlaylist
} from "@/api/playlist.ts";
import AudioPlayer from "@/components/common/MusicPlayer.tsx";
import MusicReviews from "@/components/UI/MusicReviews.tsx";
import {PlayIcon, PauseIcon, MoreVerticalIcon, PlusIcon, PlaylistIcon} from "@/components/icons.tsx";
import {Tabs, Tab, Card, CardBody, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea} from "@heroui/react";
import {FiStar, FiMessageSquare} from 'react-icons/fi';
import {toast} from "react-toastify";

// Helper function to check if music is in playlist
const isMusicInPlaylist = (playlist: Playlist, musicId: number): boolean => {
    return playlist.musics ? playlist.musics.some(music => music.id === musicId) : false;
};

// Music Card Component
interface MusicCardProps {
    music: Music;
    onPlay: (music: Music) => void;
    currentMusic: Music | null;
    allPlaylists: Playlist[];
    onPlaylistUpdate: () => void;
}

const MusicCard: React.FC<MusicCardProps> = ({ music, onPlay, currentMusic, allPlaylists, onPlaylistUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isCurrentlyPlaying = currentMusic?.id === music.id;

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;

        try {
            setIsLoading(true);
            const newPlaylist = await createPlaylist(newPlaylistName.trim());
            await addMusicToPlaylist(newPlaylist.id, music.id);
            onPlaylistUpdate();
            setIsModalOpen(false);
            setNewPlaylistName('');
            setNewPlaylistDescription('');
            toast.success('Playlist created and song added successfully!');
        } catch (error: any) {
            console.error('Error creating playlist:', error);
            toast.error(error.response?.data?.message || 'Failed to create playlist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToExistingPlaylist = async (playlistId: number) => {
        try {
            await addMusicToPlaylist(playlistId, music.id);
            onPlaylistUpdate();
            toast.success('Song added to playlist successfully!');
        } catch (error: any) {
            console.error('Error adding to playlist:', error);
            toast.error(error.response?.data?.message || 'Failed to add song to playlist');
        }
    };

    const handleRemoveFromPlaylist = async (playlistId: number) => {
        try {
            await removeMusicFromPlaylist(playlistId, music.id);
            onPlaylistUpdate();
            toast.success('Song removed from playlist successfully!');
        } catch (error: any) {
            console.error('Error removing from playlist:', error);
            toast.error(error.response?.data?.message || 'Failed to remove song from playlist');
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onPlay(music)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        {/* Play/Pause Icon */}
                        <div className="flex-shrink-0">
                            {isCurrentlyPlaying ? (
                                <PauseIcon size={20} className="text-blue-600" />
                            ) : (
                                <PlayIcon size={20} className="text-gray-600 dark:text-gray-400" />
                            )}
                        </div>

                        {/* Music Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {music.name || music.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {music.artist}
                            </p>
                            {/* Display rating if available */}
                            {music.averageRating && music.totalReviews > 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                    <FiStar size={14} className="text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {music.averageRating.toFixed(1)} ({music.totalReviews} reviews)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Three Dots Menu */}
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    aria-label="More options"
                                >
                                    <MoreVerticalIcon size={16} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Music actions"
                                onAction={(key) => {
                                    if (key === "create") {
                                        setIsModalOpen(true);
                                    } else if (key === "review") {
                                        setIsReviewModalOpen(true);
                                    } else {
                                        const playlistId = parseInt(key.toString().replace('playlist-', ''));
                                        const playlist = allPlaylists.find(p => p.id === playlistId);
                                        if (playlist) {
                                            const isInPlaylist = isMusicInPlaylist(playlist, music.id);
                                            if (isInPlaylist) {
                                                handleRemoveFromPlaylist(playlist.id);
                                            } else {
                                                handleAddToExistingPlaylist(playlist.id);
                                            }
                                        }
                                    }
                                }}
                                items={[
                                    { key: "review", label: "Reviews & Ratings", icon: <FiMessageSquare size={16} /> },
                                    { key: "create", label: "Create new playlist", icon: <PlusIcon size={16} /> },
                                    ...allPlaylists.map((playlist) => {
                                        const isInPlaylist = isMusicInPlaylist(playlist, music.id);
                                        return {
                                            key: `playlist-${playlist.id}`,
                                            label: isInPlaylist ? `Remove from ${playlist.name}` : `Add to ${playlist.name}`,
                                            icon: <PlaylistIcon size={16} />
                                        };
                                    })
                                ]}
                            >
                                {(item: any) => (
                                    <DropdownItem key={item.key} startContent={item.icon}>
                                        {item.label}
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {/* Create Playlist Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>Create New Playlist</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Playlist Name"
                            placeholder="Enter playlist name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            maxLength={100}
                        />
                        <Textarea
                            label="Description (Optional)"
                            placeholder="Enter playlist description"
                            value={newPlaylistDescription}
                            onChange={(e) => setNewPlaylistDescription(e.target.value)}
                            style={{ display: 'none' }} // Hide description for now since backend doesn't support it
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleCreatePlaylist}
                            isDisabled={!newPlaylistName.trim() || isLoading}
                            isLoading={isLoading}
                        >
                            Create & Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Reviews Modal */}
            <Modal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3>Reviews for "{music.name || music.title}"</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                            by {music.artist}
                        </p>
                    </ModalHeader>
                    <ModalBody className="px-0">
                        <div className="px-6">
                            <MusicReviews
                                musicId={music.id}
                                musicTitle={music.name || music.title || ''}
                                musicArtist={music.artist}
                                onReviewChange={() => {
                                    // Optionally refresh music data to update rating display
                                    console.log('Review changed for music:', music.id);
                                }}
                            />
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

// Playlist Card Component
interface PlaylistCardProps {
    playlist: Playlist;
    onPlay: (music: Music) => void;
    onDeletePlaylist: (playlistId: number) => void;
    onEditPlaylist: (playlistId: number, newName: string) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onPlay, onDeletePlaylist, onEditPlaylist }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState(playlist.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = async () => {
        if (!editName.trim() || editName === playlist.name) {
            setIsEditModalOpen(false);
            return;
        }

        try {
            setIsLoading(true);
            await onEditPlaylist(playlist.id, editName.trim());
            setIsEditModalOpen(false);
            toast.success('Playlist updated successfully!');
        } catch (error: any) {
            console.error('Error updating playlist:', error);
            toast.error(error.response?.data?.message || 'Failed to update playlist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
            try {
                await onDeletePlaylist(playlist.id);
                toast.success('Playlist deleted successfully!');
            } catch (error: any) {
                console.error('Error deleting playlist:', error);
                toast.error(error.response?.data?.message || 'Failed to delete playlist');
            }
        }
    };

    return (
        <>
            <Card className="w-full">
                <CardBody className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{playlist.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {playlist.trackCount} {playlist.trackCount === 1 ? 'song' : 'songs'}
                            </p>
                            <p className="text-xs text-gray-400">
                                Created: {new Date(playlist.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                variant="light"
                                size="sm"
                                onPress={() => setIsEditModalOpen(true)}
                            >
                                Edit
                            </Button>
                            <Button
                                color="danger"
                                variant="light"
                                size="sm"
                                onPress={handleDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    {playlist.musics && playlist.musics.length > 0 && (
                        <div className="space-y-2">
                            {playlist.musics.map((music) => (
                                <div
                                    key={music.id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                    onClick={() => onPlay(music)}
                                >
                                    <PlayIcon size={16} className="text-gray-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {music.name || music.title}
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                            {music.artist}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Edit Playlist Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>Edit Playlist</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Playlist Name"
                            placeholder="Enter playlist name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            maxLength={100}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleEdit}
                            isDisabled={!editName.trim() || isLoading}
                            isLoading={isLoading}
                        >
                            Update
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export const PurchasedMusic = () => {
    const {isAuthenticated, loading} = useAuth();
    const [currentMusic, setCurrentMusic] = useState<Music | null>(null);
    const [isLoading, setIsLoading] = useState(loading);
    const [purchasedMusic, setPurchasedMusic] = useState<Music[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedTab, setSelectedTab] = useState('music');

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
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchPurchasedMusic();
            loadPlaylists();
        }
    }, [isAuthenticated]);

    const loadPlaylists = async () => {
        try {
            const userPlaylists = await getUserPlaylists();
            // Get detailed playlist information with music tracks
            const playlistsWithMusic = await Promise.all(
                userPlaylists.map(async (playlist) => {
                    try {
                        return await getPlaylistWithMusic(playlist.id);
                    } catch (error) {
                        console.error(`Error fetching playlist ${playlist.id}:`, error);
                        return playlist;
                    }
                })
            );
            setPlaylists(playlistsWithMusic);
        } catch (error) {
            console.error("Error fetching playlists:", error);
            toast.error("Failed to load playlists");
        }
    };

    const handleDeletePlaylist = async (playlistId: number) => {
        try {
            await deletePlaylist(playlistId);
            await loadPlaylists(); // Refresh playlists
        } catch (error) {
            throw error; // Re-throw to let the component handle the error display
        }
    };

    const handleEditPlaylist = async (playlistId: number, newName: string) => {
        try {
            await updatePlaylist(playlistId, newName);
            await loadPlaylists(); // Refresh playlists
        } catch (error) {
            throw error; // Re-throw to let the component handle the error display
        }
    };

    const audioUrl = `http://localhost:8082`;

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-lg text-gray-600">Please log in to view your music library.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-lg text-gray-600">Loading your music library...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 w-full">
            {currentMusic && (
                <div className="mb-6">
                    <AudioPlayer
                        audioSrc={audioUrl.concat(currentMusic.audioFilePath as string)}
                        audioArtist={currentMusic.artist}
                        audioTitle={currentMusic.title as string || currentMusic.name}
                    />
                </div>
            )}

            <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                className="w-full"
            >
                <Tab key="music" title="My Music">
                    <div className="mt-4">
                        {purchasedMusic.length > 0 ? (
                            <div className="space-y-3">
                                {purchasedMusic.map((music: Music) => (
                                    <MusicCard
                                        key={music.id}
                                        music={music}
                                        onPlay={setCurrentMusic}
                                        currentMusic={currentMusic}
                                        allPlaylists={playlists}
                                        onPlaylistUpdate={loadPlaylists}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-lg text-gray-600">No purchased music found.</p>
                                <p className="text-sm text-gray-500 mt-2">Purchase some music to start building your library!</p>
                            </div>
                        )}
                    </div>
                </Tab>

                <Tab key="playlists" title="Playlists">
                    <div className="mt-4">
                        {playlists.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {playlists.map((playlist) => (
                                    <PlaylistCard
                                        key={playlist.id}
                                        playlist={playlist}
                                        onPlay={setCurrentMusic}
                                        onDeletePlaylist={handleDeletePlaylist}
                                        onEditPlaylist={handleEditPlaylist}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <PlaylistIcon size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-lg text-gray-600">No playlists created yet.</p>
                                <p className="text-sm text-gray-500 mt-2">Create playlists by clicking the three dots menu on any song!</p>
                            </div>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};
