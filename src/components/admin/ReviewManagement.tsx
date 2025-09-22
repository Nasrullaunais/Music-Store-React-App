import { useState, useEffect } from 'react';
import { adminAPI, AdminReview } from '@/api/admin';
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
  useDisclosure,
  Select,
  SelectItem
} from '@heroui/react';
import {
  FiStar,
  FiTrash2,
  FiUser,
  FiMusic,
  FiAlertTriangle
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadReviews();
  }, [page, sortBy]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllReviews(page - 1, 10, sortBy);
      setReviews(response.content || []);
      const totalElements = response.totalElements || 0;
      setTotalPages(Math.max(1, Math.ceil(totalElements / 10)));
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error('Reviews loading error:', error);
      setReviews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = (review: AdminReview) => {
    setSelectedReview(review);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedReview) return;

    try {
      await adminAPI.deleteReview(selectedReview.id);
      toast.success('Review deleted successfully');
      onClose();
      loadReviews();
    } catch (error) {
      toast.error('Failed to delete review');
      console.error('Delete review error:', error);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`text-sm ${i < rating ? 'text-warning fill-warning' : 'text-default-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiStar />
              Review Management
            </h3>
            <div className="flex gap-4">
              <Select
                label="Sort by"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                className="max-w-xs"
                aria-label="Sort reviews by criteria"
              >
                <SelectItem key="date">Date</SelectItem>
                <SelectItem key="rating">Rating</SelectItem>
                <SelectItem key="customer">Customer</SelectItem>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardBody>
          <Table
            aria-label="Reviews table"
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
              <TableColumn>REVIEW</TableColumn>
              <TableColumn>MUSIC</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>RATING</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-small line-clamp-2">{review.content}</p>
                      <p className="text-xs text-default-400 mt-1">ID: {review.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiMusic className="text-primary text-sm" />
                        <span className="font-medium text-sm">{review.musicName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUser className="text-default-400 text-xs" />
                        <span className="text-xs text-default-600">{review.artistUsername}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-default-400" />
                      <span>{review.customerUsername}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <Chip
                        color={getRatingColor(review.rating)}
                        variant="flat"
                        size="sm"
                      >
                        {review.rating}/5
                      </Chip>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(review.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      startContent={<FiTrash2 />}
                      onPress={() => handleDeleteReview(review)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FiTrash2 className="text-danger" />
              Delete Review
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedReview && (
              <div className="space-y-4">
                <div className="p-4 bg-default-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <Chip
                      color={getRatingColor(selectedReview.rating)}
                      variant="flat"
                      size="sm"
                    >
                      {selectedReview.rating}/5
                    </Chip>
                  </div>
                  <p className="text-sm mb-2">"{selectedReview.content}"</p>
                  <div className="flex items-center justify-between text-xs text-default-600">
                    <span>by {selectedReview.customerUsername}</span>
                    <span>{formatDate(selectedReview.createdAt)}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-divider">
                    <div className="flex items-center gap-2">
                      <FiMusic className="text-primary" />
                      <span className="text-sm font-medium">{selectedReview.musicName}</span>
                      <span className="text-xs text-default-500">by {selectedReview.artistUsername}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-danger/10 border border-danger/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiAlertTriangle className="text-danger" />
                    <span className="font-semibold text-danger">Warning: Permanent Action</span>
                  </div>
                  <p className="text-small">
                    This will permanently delete the review from the system. This action cannot be undone.
                    The music's rating will be automatically recalculated after deletion.
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Delete Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReviewManagement;
