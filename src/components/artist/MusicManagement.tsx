import { useState, useEffect } from 'react';
import { artistAPI, PaginatedMusicResponse, MusicUploadData, MusicUpdateData } from '@/api/artistApi.ts';
import { Music } from '@/types';
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  useDisclosure,
  Spinner,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import {
  FiUpload,
  FiEdit,
  FiTrash2,
  FiMusic,
  FiStar,
  FiMoreVertical,
  FiPlus,
  FiImage
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface MusicManagementProps {
  defaultView?: 'library' | 'upload';
  onStatsUpdate?: () => void;
}

const genres = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Jazz', 'Classical',
  'Electronic', 'Folk', 'Blues', 'Reggae', 'Punk', 'Metal', 'Alternative'
];

const MusicManagement = ({ defaultView = 'library', onStatsUpdate }: MusicManagementProps) => {
  const [view, setView] = useState<'library' | 'upload'>(defaultView);
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState<MusicUploadData>({
    title: '',
    genre: '',
    price: 0,
    description: ''
    // Removed albumName and releaseYear as backend upload endpoint doesn't accept them
  });
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Edit modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editForm, setEditForm] = useState<MusicUpdateData>({
    name: '',
    description: '',
    price: 0,
    genre: '',
    albumName: '',
    releaseYear: new Date().getFullYear()
  });

  useEffect(() => {
    if (view === 'library') {
      loadMusic();
    }
  }, [view, currentPage]);

  const loadMusic = async () => {
    setLoading(true);
    try {
      const response: PaginatedMusicResponse = await artistAPI.getMyMusic(currentPage - 1, 10);
      setMusic(response.music);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading music:', error);
      toast.error('Failed to load music library');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.genre || !musicFile || !coverImage) {
      toast.error('Please fill in all required fields and select files');
      return;
    }

    setUploading(true);
    try {
      await artistAPI.uploadMusic(uploadForm, musicFile, coverImage);
      toast.success('Music uploaded successfully!');

      // Reset form
      setUploadForm({
        title: '',
        genre: '',
        price: 0,
        description: ''
        // Removed albumName and releaseYear
      });
      setMusicFile(null);
      setCoverImage(null);

      // Clear file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');

      // Update parent stats
      onStatsUpdate?.();

      // Switch to library view
      setView('library');
    } catch (error: any) {
      console.error('Error uploading music:', error);
      toast.error(error.response?.data?.message || 'Failed to upload music');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (music: Music) => {
    setSelectedMusic(music);
    setEditForm({
      name: music.name,
      description: music.description || '',
      price: music.price,
      genre: music.genre || '',
      albumName: music.album || '',
      releaseYear: music.releaseYear || new Date().getFullYear()
    });
    onEditOpen();
  };

  const handleUpdate = async () => {
    if (!selectedMusic) return;

    try {
      await artistAPI.updateMusic(selectedMusic.id, editForm);
      toast.success('Music updated successfully!');
      onEditClose();
      loadMusic();
      onStatsUpdate?.();
    } catch (error: any) {
      console.error('Error updating music:', error);
      toast.error(error.response?.data?.message || 'Failed to update music');
    }
  };

  const handleDelete = async (musicId: number) => {
    if (!confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      return;
    }

    try {
      await artistAPI.deleteMusic(musicId);
      toast.success('Music deleted successfully!');
      loadMusic();
      onStatsUpdate?.();
    } catch (error: any) {
      console.error('Error deleting music:', error);
      toast.error(error.response?.data?.message || 'Failed to delete music');
    }
  };

  const renderUploadView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Upload New Music</h2>
        <Button
          variant="flat"
          onPress={() => setView('library')}
        >
          View Library
        </Button>
      </div>

      <Card>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Track Title"
              placeholder="Enter track title"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              isRequired
            />

            <Select
              label="Genre"
              placeholder="Select genre"
              selectedKeys={uploadForm.genre ? [uploadForm.genre] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setUploadForm({ ...uploadForm, genre: selected });
              }}
              isRequired
            >
              {genres.map((genre) => (
                <SelectItem key={genre}>
                  {genre}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Input
            label="Price (USD)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={uploadForm.price.toString()}
            onChange={(e) => setUploadForm({ ...uploadForm, price: parseFloat(e.target.value) || 0 })}
            startContent="$"
            isRequired
            className="max-w-xs"
          />

          <Textarea
            label="Description"
            placeholder="Enter track description (optional)"
            value={uploadForm.description}
            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
            minRows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Music File *</label>
              <div className="border-2 border-dashed border-default-200 rounded-lg p-6 text-center">
                <FiMusic className="mx-auto text-3xl text-default-400 mb-2" />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {musicFile && (
                  <p className="text-sm text-success mt-2">
                    Selected: {musicFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image *</label>
              <div className="border-2 border-dashed border-default-200 rounded-lg p-6 text-center">
                <FiImage className="mx-auto text-3xl text-default-400 mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="w-full"
                />
                {coverImage && (
                  <p className="text-sm text-success mt-2">
                    Selected: {coverImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            color="primary"
            size="lg"
            startContent={<FiUpload />}
            onPress={handleUpload}
            isLoading={uploading}
            className="w-full md:w-auto"
          >
            Upload Music
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  const renderLibraryView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Music Library</h2>
        <Button
          color="primary"
          startContent={<FiPlus />}
          onPress={() => setView('upload')}
        >
          Upload New Track
        </Button>
      </div>

      <Card>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : music.length === 0 ? (
            <div className="text-center py-12">
              <FiMusic className="mx-auto text-6xl text-default-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No music uploaded yet</h3>
              <p className="text-default-500 mb-6">
                Start building your music library by uploading your first track.
              </p>
              <Button
                color="primary"
                startContent={<FiUpload />}
                onPress={() => setView('upload')}
              >
                Upload Your First Track
              </Button>
            </div>
          ) : (
            <>
              <Table aria-label="Music library table">
                <TableHeader>
                  <TableColumn>TRACK</TableColumn>
                  <TableColumn>GENRE</TableColumn>
                  <TableColumn>PRICE</TableColumn>
                  <TableColumn>RATING</TableColumn>
                  <TableColumn>REVIEWS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {music.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={track.imageUrl || '/placeholder-music.png'}
                            alt={track.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{track.name}</p>
                            <p className="text-sm text-default-500">{track.album}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat">
                          {track.genre}
                        </Chip>
                      </TableCell>
                      <TableCell>${track.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-500 fill-current" />
                          <span>{track.averageRating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{track.totalReviews}</TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="light"
                              size="sm"
                              isIconOnly
                            >
                              <FiMoreVertical />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="edit"
                              startContent={<FiEdit />}
                              onPress={() => handleEdit(track)}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              startContent={<FiTrash2 />}
                              color="danger"
                              onPress={() => handleDelete(track.id)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );

  return (
    <>
      {view === 'upload' ? renderUploadView() : renderLibraryView()}

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
        <ModalContent>
          <ModalHeader>Edit Track</ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Track Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Genre"
                selectedKeys={editForm.genre ? [editForm.genre] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setEditForm({ ...editForm, genre: selected });
                }}
              >
                {genres.map((genre) => (
                  <SelectItem key={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Price (USD)"
                type="number"
                step="0.01"
                min="0"
                value={editForm.price.toString()}
                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                startContent="$"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Album Name"
                value={editForm.albumName}
                onChange={(e) => setEditForm({ ...editForm, albumName: e.target.value })}
              />

              <Input
                label="Release Year"
                type="number"
                value={editForm.releaseYear?.toString()}
                onChange={(e) => setEditForm({ ...editForm, releaseYear: parseInt(e.target.value) })}
              />
            </div>

            <Textarea
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onEditClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdate}>
              Update Track
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MusicManagement;
