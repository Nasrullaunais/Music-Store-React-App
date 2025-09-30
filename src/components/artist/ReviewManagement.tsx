import { useState, useEffect } from 'react';
import { artistAPI, Review } from '@/api/artistApi.ts';
import { Music } from '@/types';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Spinner,
  Avatar,
  Chip,
  Divider,
  Input
} from '@heroui/react';
import {
  FiStar,
  FiMessageSquare,
  FiSearch,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ReviewManagement = () => {
  const [music, setMusic] = useState<Music[]>([]);
  const [selectedMusicId, setSelectedMusicId] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('');

  useEffect(() => {
    loadMusic();
  }, []);

  useEffect(() => {
    if (selectedMusicId) {
      loadReviews(parseInt(selectedMusicId));
    }
  }, [selectedMusicId]);

  const loadMusic = async () => {
    setLoading(true);
    try {
      const response = await artistAPI.getMyMusic(0, 100); // Get all music for dropdown
      setMusic(response.music);
      if (response.music.length > 0) {
        setSelectedMusicId(response.music[0].id.toString());
      }
    } catch (error) {
      console.error('Error loading music:', error);
      toast.error('Failed to load music library');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (musicId: number) => {
    setLoadingReviews(true);
    try {
      const reviewData = await artistAPI.getMusicReviews(musicId);
      setReviews(reviewData);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleRefresh = () => {
    if (selectedMusicId) {
      loadReviews(parseInt(selectedMusicId));
    }
  };

  const getSelectedMusic = () => {
    return music.find(m => m.id.toString() === selectedMusicId);
  };

  const getFilteredReviews = () => {
    let filtered = reviews;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerUsername.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (ratingFilter) {
      filtered = filtered.filter(review => review.rating.toString() === ratingFilter);
    }

    // Sort by newest first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedMusic = getSelectedMusic();
  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Review Management</h2>
        <Button
          startContent={<FiRefreshCw />}
          onPress={handleRefresh}
          variant="flat"
          isDisabled={!selectedMusicId}
        >
          Refresh
        </Button>
      </div>

      {music.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <FiMessageSquare className="mx-auto text-6xl text-default-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Music Available</h3>
            <p className="text-default-500">
              Upload some music first to start receiving reviews.
            </p>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Music Selection and Filters */}
          <Card>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  label="Select Track"
                  placeholder="Choose a track"
                  selectedKeys={selectedMusicId ? [selectedMusicId] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedMusicId(selected);
                  }}
                >
                  {music.map((track) => (
                    <SelectItem key={track.id.toString()}>
                      {track.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Search Reviews"
                  placeholder="Search by comment or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<FiSearch />}
                />

                <Select
                  label="Filter by Rating"
                  placeholder="All ratings"
                  selectedKeys={ratingFilter ? [ratingFilter] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setRatingFilter(selected);
                  }}
                >
                  <SelectItem key="">All Ratings</SelectItem>
                  <SelectItem key="5">5 Stars</SelectItem>
                  <SelectItem key="4">4 Stars</SelectItem>
                  <SelectItem key="3">3 Stars</SelectItem>
                  <SelectItem key="2">2 Stars</SelectItem>
                  <SelectItem key="1">1 Star</SelectItem>
                </Select>

                <div className="flex items-end">
                  <Button
                    variant="flat"
                    startContent={<FiFilter />}
                    onPress={() => {
                      setSearchTerm('');
                      setRatingFilter('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Selected Track Overview */}
          {selectedMusic && (
            <Card>
              <CardBody>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMusic.imageUrl || '/placeholder-music.png'}
                    alt={selectedMusic.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{selectedMusic.name}</h3>
                    <p className="text-default-500">{selectedMusic.genre} • ${selectedMusic.price}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <FiStar className="text-yellow-500 fill-current" />
                      <span className="font-semibold">{selectedMusic.averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-default-500">{selectedMusic.totalReviews} reviews</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold">
                  Reviews ({filteredReviews.length})
                </h3>
                {ratingFilter && (
                  <Chip size="sm" variant="flat">
                    Showing {ratingFilter} star reviews
                  </Chip>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {loadingReviews ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner />
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-8">
                  <FiMessageSquare className="mx-auto text-4xl text-default-300 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">
                    {reviews.length === 0 ? 'No Reviews Yet' : 'No Matching Reviews'}
                  </h4>
                  <p className="text-default-500">
                    {reviews.length === 0
                      ? 'This track hasn\'t received any reviews yet.'
                      : 'Try adjusting your search filters.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((review, index) => (
                    <div key={review.id}>
                      <div className="flex gap-4">
                        <Avatar
                          name={review.customerUsername}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">{review.customerUsername}</span>
                            <Chip
                              size="sm"
                              color={getRatingColor(review.rating)}
                              variant="flat"
                              startContent={<FiStar className="fill-current" />}
                            >
                              {review.rating}
                            </Chip>
                            <span className="text-sm text-default-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-default-700">{review.comment}</p>
                          )}
                        </div>
                      </div>
                      {index < filteredReviews.length - 1 && <Divider className="my-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Review Statistics */}
          {reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Rating Breakdown</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(r => r.rating === rating).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm">{rating}</span>
                            <FiStar className="text-yellow-500 fill-current text-xs" />
                          </div>
                          <div className="flex-grow bg-default-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                rating >= 4 ? 'bg-success' : rating >= 3 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-default-500 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Review Insights</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-default-500">Total Reviews</span>
                      <span className="font-semibold">{reviews.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-500">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{selectedMusic?.averageRating.toFixed(1)}</span>
                        <FiStar className="text-yellow-500 fill-current text-sm" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-500">Reviews with Comments</span>
                      <span className="font-semibold">
                        {reviews.filter(r => r.comment && r.comment.trim()).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-500">5-Star Reviews</span>
                      <span className="font-semibold text-success">
                        {reviews.filter(r => r.rating === 5).length}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewManagement;
