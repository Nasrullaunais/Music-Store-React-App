import { useState, useEffect, Fragment } from 'react';
import { adminAPI, AdminReview } from '@/api/adminApi.ts';
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
import { fetchMusicById } from '@/api/musicApi.ts';
import { Music } from '@/types';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [musicMap, setMusicMap] = useState<Record<number, Music>>({});
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllReviews(page - 1, 10, sortBy);
      const content = response.content || [];
      console.log('Reviews:', content);
      setReviews(content);
      const totalElements = response.totalElements || 0;
      setTotalPages(Math.max(1, Math.ceil(totalElements / 10)));

      // Seed musicMap from nested `review.music` objects returned by backend
      const seededMap: Record<number, Music> = { ...(musicMap || {}) };
      content.forEach((r) => {
        const nested = (r as any).music;
        const mid = nested?.id ?? r.musicId;
        if (nested && mid) {
          seededMap[mid] = {
            id: nested.id ?? mid,
            name: nested.name ?? nested.title ?? `#${mid}`,
            title: nested.title,
            artist: nested.artist ?? nested.artistUsername ?? 'Unknown Artist',
            imageUrl: nested.imageUrl ?? undefined,
            price: nested.price ?? 0,
            // fill other Music fields with sensible defaults
            album: (nested as any).albumName || undefined,
            genre: (nested as any).genre || undefined,
            averageRating: nested.averageRating ?? 0,
            totalReviews: nested.totalReviews ?? 0
          } as Music;
        }
      });

      // Determine which musicIds still need fetching
      const idsToFetch = Array.from(
        new Set(
          content
            .map((r) => (r.music?.id ?? r.musicId) as number | undefined)
            .filter((id) => id && !seededMap[id!])
        )
      ) as number[];

      if (idsToFetch.length > 0) {
        const fetches = idsToFetch.map((id) =>
          fetchMusicById(id)
            .then((m) => ({ id, m }))
            .catch((err) => {
              console.warn('Failed fetching music', id, err);
              return null;
            })
        );
        const results = await Promise.all(fetches);
        results.forEach((res) => {
          if (res && res.m) seededMap[res.id] = res.m;
        });
      }

      console.debug('seeded musicMap:', seededMap);
      setMusicMap(seededMap);
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

  const toggleExpand = (id: number) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
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
    try {
      const d = new Date(dateString);
      if (Number.isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getMusicForReview = (review: AdminReview) => {
    // Prefer nested review.music, then seeded musicMap by id
    const nested = (review as any).music;
    if (nested) {
      return {
        id: nested.id ?? review.musicId,
        name: nested.name ?? nested.title ?? `#${nested.id ?? review.musicId}`,
        artist: nested.artist ?? nested.artistUsername ?? 'Unknown Artist'
      } as Partial<Music>;
    }

    const id = review.musicId ?? (review.music && (review.music.id as number));
    if (id && musicMap[id]) return musicMap[id];
    return undefined;
  };

  // New helpers: produce display-friendly music name and artist reliably
  const getMusicName = (review: AdminReview) => {
    const nested = (review as any).music;
    if (nested?.name) return nested.name;
    if (nested?.title) return nested.title;
    const id = review.musicId ?? nested?.id;
    const m = id && musicMap[id as number];
    if (m) return m.name ?? m.title ?? `#${id}`;
    return id ? `#${id}` : 'Unknown Music';
  };

  const getMusicArtist = (review: AdminReview) => {
    const nested = (review as any).music;
    if (nested?.artist) return nested.artist;
    if (nested?.artistUsername) return nested.artistUsername;
    const id = review.musicId ?? nested?.id;
    const m = id && musicMap[id as number];
    if (m) return (m as any).artist ?? (m as any).artistUsername ?? 'Unknown Artist';
    return 'Unknown Artist';
  };

  const getCustomerDisplay = (review: AdminReview) => {
    const nested = (review as any).customer;
    if (nested) {
      const fullName = [nested.firstName, nested.lastName].filter(Boolean).join(' ');
      return fullName || nested.username || nested.email || 'Unknown Customer';
    }
    if (review.customerName) return review.customerName;
    if (review.customerUsername) return review.customerUsername;
    return 'Unknown Customer';
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
            <div className="flex gap-4 items-center w-full md:w-auto">
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
              {reviews.map((review) => {
                const music = getMusicForReview(review);
                const customerDisplay = getCustomerDisplay(review);

                // compute stable display values
                const musicName = getMusicName(review);
                const musicArtist = getMusicArtist(review);

                console.debug(`review ${review.id} -> musicName:`, musicName, 'artist:', musicArtist, 'customer:', customerDisplay);

                return (
                  <Fragment key={review.id}>
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-small line-clamp-2">{review.comment}</p>
                          <p className="text-xs text-default-400 mt-1">ID: {review.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FiMusic className="text-primary text-sm" />
                            <span className="font-medium text-sm">{musicName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiUser className="text-default-400 text-xs" />
                            <span className="text-xs text-default-600">{musicArtist}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FiUser className="text-default-400" />
                          <span>{customerDisplay}</span>
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
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="default"
                            variant="flat"
                            onPress={() => toggleExpand(review.id)}
                          >
                            Details
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<FiTrash2 />}
                            onPress={() => handleDeleteReview(review)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {expandedReviews[review.id] && (
                      <TableRow key={`details-${review.id}`}>
                        <TableCell colSpan={6}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-default-50 rounded">
                            {/* Music info */}
                            <div className="flex items-start gap-3">
                              {music?.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={music.imageUrl} alt={musicName} className="w-20 h-20 object-cover rounded" />
                              ) : (
                                <div className="w-20 h-20 bg-default-100 rounded flex items-center justify-center text-default-400">🎵</div>
                              )}
                              <div>
                                <div className="font-semibold">{musicName}</div>
                                <div className="text-xs text-default-500">{musicArtist}</div>
                                {(music as any)?.album && <div className="text-xs text-default-400">Album: {(music as any).album}</div>}
                                {(music as any)?.price !== undefined && <div className="text-xs text-default-400">Price: ${(music as any).price}</div>}
                              </div>
                            </div>

                            {/* Review details */}
                            <div className="col-span-1 md:col-span-1">
                              <div className="text-sm font-medium mb-2">Review</div>
                              <p className="text-default-600 mb-2">{review.comment}</p>
                              <div className="flex items-center gap-2 mb-2">
                                {renderStars(review.rating)}
                                <Chip color={getRatingColor(review.rating)} size="sm" variant="flat">{review.rating}/5</Chip>
                              </div>
                              <div className="text-xs text-default-500">Created: {formatDate(review.createdAt)}</div>
                              {review.updatedAt && <div className="text-xs text-default-500">Updated: {formatDate(review.updatedAt)}</div>}
                            </div>

                            {/* Customer info */}
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-medium">Customer</div>
                              <div className="text-default-600">{getCustomerDisplay(review)}</div>
                              {(review as any).customer?.username && <div className="text-xs text-default-500">Username: {(review as any).customer.username}</div>}
                              {(review as any).customer?.email && <div className="text-xs text-default-500">Email: {(review as any).customer.email}</div>}
                              <div className="text-xs text-default-500">ID: {(review as any).customer?.id ?? (review as any).customerId ?? ''}</div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                 );
               })}
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
                  <p className="text-sm mb-2">"{selectedReview.comment}"</p>
                  <div className="flex items-center justify-between text-xs text-default-600">
                    <span>by {getCustomerDisplay(selectedReview)}</span>
                    <span>{formatDate(selectedReview.createdAt)}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-divider">
                    <div className="flex items-center gap-2">
                      <FiMusic className="text-primary" />
                      <span className="text-sm font-medium">{getMusicForReview(selectedReview)?.name || `#${selectedReview.musicId ?? (selectedReview as any).music?.id}`}</span>
                      <span className="text-xs text-default-500">by {getMusicForReview(selectedReview)?.artist || (selectedReview as any).music?.artist || 'Unknown'}</span>
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
