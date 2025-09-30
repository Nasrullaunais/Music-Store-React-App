import { useState, useEffect } from 'react';
import { adminAPI, FlaggedMusic } from '@/api/adminApi.ts';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import {
  FiFlag,
  FiCheck,
  FiTrash2,
  FiAlertTriangle,
  FiMusic,
  FiUser
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ContentModerationProps {
  onContentUpdate: () => void;
}

const ContentModeration = ({ onContentUpdate }: ContentModerationProps) => {
  const [flaggedMusic, setFlaggedMusic] = useState<FlaggedMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMusic, setSelectedMusic] = useState<FlaggedMusic | null>(null);
  const [actionType, setActionType] = useState<'unflag' | 'delete'>('unflag');

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadFlaggedMusic();
  }, [page]);

  const loadFlaggedMusic = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getFlaggedMusic(page - 1, 10);
      setFlaggedMusic(response.content);
      setTotalPages(Math.ceil(response.totalElements / 10));
    } catch (error) {
      toast.error('Failed to load flagged content');
      console.error('Flagged music loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnflag = (music: FlaggedMusic) => {
    setSelectedMusic(music);
    setActionType('unflag');
    onOpen();
  };

  const handleDelete = (music: FlaggedMusic) => {
    setSelectedMusic(music);
    setActionType('delete');
    onOpen();
  };

  const confirmAction = async () => {
    if (!selectedMusic) return;

    try {
      if (actionType === 'unflag') {
        await adminAPI.unflagMusic(selectedMusic.id);
        toast.success('Music unflagged successfully');
      } else {
        await adminAPI.deleteFlaggedMusic(selectedMusic.id);
        toast.success('Flagged music deleted successfully');
      }

      onClose();
      loadFlaggedMusic();
      onContentUpdate();
    } catch (error) {
      toast.error(`Failed to ${actionType} music`);
      console.error(`${actionType} error:`, error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading && flaggedMusic.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiFlag />
              Content Moderation
            </h3>
            <div className="flex items-center gap-2">
              <Chip color="warning" variant="flat">
                {flaggedMusic.length} flagged items
              </Chip>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Flagged Content Table */}
      <Card>
        <CardBody>
          {flaggedMusic.length === 0 ? (
            <div className="text-center py-8">
              <FiCheck className="mx-auto text-4xl text-success mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Flagged Content</h3>
              <p className="text-default-500">All content has been reviewed and approved.</p>
            </div>
          ) : (
            <Table
              aria-label="Flagged music table"
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={setPage}
                  />
                </div>
              }
            >
              <TableHeader>
                <TableColumn>MUSIC</TableColumn>
                <TableColumn>ARTIST</TableColumn>
                <TableColumn>GENRE</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>FLAGGED DATE</TableColumn>
                <TableColumn>FLAGGED BY</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {flaggedMusic.map((music) => (
                  <TableRow key={music.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                            <FiMusic className="text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{music.name}</p>
                          <p className="text-small text-default-400">ID: {music.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FiUser className="text-default-400" />
                        <span>{music.artistUsername}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip color="secondary" variant="flat" size="sm">
                        {music.genre}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-success">
                        {formatCurrency(music.price)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(music.flaggedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FiUser className="text-default-400" />
                        <span className="text-small">Customer ID: {music.flaggedByCustomerId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={<FiCheck />}
                          onPress={() => handleUnflag(music)}
                        >
                          Unflag
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          startContent={<FiTrash2 />}
                          onPress={() => handleDelete(music)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {actionType === 'delete' ? (
                <FiTrash2 className="text-danger" />
              ) : (
                <FiCheck className="text-success" />
              )}
              {actionType === 'delete' ? 'Delete Flagged Music' : 'Unflag Music'}
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedMusic && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-default-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <FiMusic className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedMusic.name}</p>
                    <p className="text-small text-default-600">by {selectedMusic.artistUsername}</p>
                    <p className="text-small text-default-500">Flagged on {formatDate(selectedMusic.flaggedAt)}</p>
                  </div>
                </div>

                {actionType === 'delete' ? (
                  <div className="bg-danger/10 border border-danger/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiAlertTriangle className="text-danger" />
                      <span className="font-semibold text-danger">Warning: Permanent Action</span>
                    </div>
                    <p className="text-small">
                      This will permanently delete the music track from the system. This action cannot be undone.
                      The music will be removed from all playlists and customer libraries.
                    </p>
                  </div>
                ) : (
                  <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCheck className="text-success" />
                      <span className="font-semibold text-success">Unflag Content</span>
                    </div>
                    <p className="text-small">
                      This will remove the flag and mark the content as reviewed and approved.
                      The music will remain available on the platform.
                    </p>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color={actionType === 'delete' ? 'danger' : 'success'}
              onPress={confirmAction}
            >
              {actionType === 'delete' ? 'Delete Music' : 'Unflag Music'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ContentModeration;
