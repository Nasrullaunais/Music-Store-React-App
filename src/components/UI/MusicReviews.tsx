import React, { useState, useEffect } from 'react';
import { 
    Card, 
    CardBody, 
    Button, 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Textarea, 
    Divider,
    Pagination,
    Chip,
    Avatar
} from '@heroui/react';
import { FiStar, FiEdit, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { Review, ReviewsResponse, CreateReviewRequest, UpdateReviewRequest } from '@/types';
import { 
    createReview, 
    updateReview, 
    deleteReview, 
    getMusicReviews, 
    getUserReviewForMusic 
} from '@/api/reviews';
import { toast } from 'react-toastify';

interface MusicReviewsProps {
    musicId: number;
    musicTitle: string;
    musicArtist: string;
    onReviewChange?: () => void;
}

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ 
    rating, 
    onRatingChange, 
    readOnly = false,
    size = 'md'
}) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    
    const starSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    
    const handleStarClick = (starRating: number) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                    key={star}
                    size={starSize}
                    className={`
                        transition-colors duration-200 cursor-pointer
                        ${star <= (hoveredRating || rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }
                        ${readOnly ? 'cursor-default' : 'hover:text-yellow-400'}
                    `}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => !readOnly && setHoveredRating(star)}
                    onMouseLeave={() => !readOnly && setHoveredRating(0)}
                />
            ))}
        </div>
    );
};

const MusicReviews: React.FC<MusicReviewsProps> = ({ 
    musicId, 
    musicTitle, 
    musicArtist,
    onReviewChange 
}) => {
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    // Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalRating, setModalRating] = useState(5);
    const [modalComment, setModalComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadUserReview();
        loadReviews(1);
    }, [musicId]);

    const loadUserReview = async () => {
        try {
            const review = await getUserReviewForMusic(musicId);
            setUserReview(review);
        } catch (error) {
            console.error('Error loading user review:', error);
        }
    };

    const loadReviews = async (page: number) => {
        try {
            setIsLoading(true);
            const response: ReviewsResponse = await getMusicReviews(musicId, page - 1, 5);
            setReviews(response.content);
            setTotalPages(response.totalPages);
            setTotalReviews(response.totalElements);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error loading reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    };

    const openReviewModal = (editMode = false) => {
        setIsEditing(editMode);
        if (editMode && userReview) {
            setModalRating(userReview.rating);
            setModalComment(userReview.comment);
        } else {
            setModalRating(5);
            setModalComment('');
        }
        setIsReviewModalOpen(true);
    };

    const handleSubmitReview = async () => {
        if (!modalComment.trim()) {
            toast.error('Please add a comment to your review');
            return;
        }

        try {
            setIsSubmitting(true);
            const reviewData: CreateReviewRequest | UpdateReviewRequest = {
                rating: modalRating,
                comment: modalComment.trim()
            };

            if (isEditing && userReview) {
                const updatedReview = await updateReview(userReview.id, reviewData as UpdateReviewRequest);
                setUserReview(updatedReview);
                toast.success('Review updated successfully!');
            } else {
                const newReview = await createReview(musicId, reviewData as CreateReviewRequest);
                setUserReview(newReview);
                toast.success('Review submitted successfully!');
            }

            setIsReviewModalOpen(false);
            loadReviews(currentPage);
            onReviewChange?.();
        } catch (error: any) {
            console.error('Error submitting review:', error);
            if (error.response?.status === 400 && error.response?.data?.message?.includes('already reviewed')) {
                toast.error('You have already reviewed this song');
            } else {
                toast.error(error.response?.data?.message || 'Failed to submit review');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview) return;

        if (!window.confirm('Are you sure you want to delete your review?')) {
            return;
        }

        try {
            await deleteReview(userReview.id);
            setUserReview(null);
            loadReviews(currentPage);
            onReviewChange?.();
            toast.success('Review deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting review:', error);
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Reviews for "{musicTitle}"
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {musicArtist} • {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>
                
                {!userReview ? (
                    <Button
                        color="primary"
                        size="sm"
                        startContent={<FiMessageSquare size={16} />}
                        onPress={() => openReviewModal(false)}
                    >
                        Write Review
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            color="secondary"
                            variant="light"
                            size="sm"
                            startContent={<FiEdit size={16} />}
                            onPress={() => openReviewModal(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            color="danger"
                            variant="light"
                            size="sm"
                            startContent={<FiTrash2 size={16} />}
                            onPress={handleDeleteReview}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* User's Review */}
            {userReview && (
                <Card className="border-l-4 border-l-blue-500">
                    <CardBody className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Chip color="primary" size="sm">Your Review</Chip>
                                <StarRating rating={userReview.rating} readOnly />
                            </div>
                            <span className="text-xs text-gray-500">
                                {formatDate(userReview.updatedAt)}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{userReview.comment}</p>
                    </CardBody>
                </Card>
            )}

            <Divider />

            {/* Other Reviews */}
            <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                    All Reviews {totalReviews > 0 && `(${totalReviews})`}
                </h4>
                
                {isLoading ? (
                    <div className="text-center py-4">
                        <p className="text-gray-600">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <FiMessageSquare size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-600">No reviews yet</p>
                        <p className="text-sm text-gray-500">Be the first to review this song!</p>
                    </div>
                ) : (
                    <>
                        {reviews.map((review) => (
                            <Card key={review.id} className="border border-gray-200 dark:border-gray-700">
                                <CardBody className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar 
                                                name={review.customerName} 
                                                size="sm"
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {review.customerName}
                                                </p>
                                                <StarRating rating={review.rating} readOnly size="sm" />
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 ml-11">
                                        {review.comment}
                                    </p>
                                </CardBody>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    total={totalPages}
                                    page={currentPage}
                                    onChange={loadReviews}
                                    size="sm"
                                    showControls
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Review Modal */}
            <Modal 
                isOpen={isReviewModalOpen} 
                onClose={() => setIsReviewModalOpen(false)}
                size="md"
            >
                <ModalContent>
                    <ModalHeader>
                        {isEditing ? 'Edit Review' : 'Write a Review'}
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rating
                                </p>
                                <StarRating 
                                    rating={modalRating} 
                                    onRatingChange={setModalRating}
                                    size="lg"
                                />
                            </div>
                            
                            <Textarea
                                label="Comment"
                                placeholder="Share your thoughts about this song..."
                                value={modalComment}
                                onChange={(e) => setModalComment(e.target.value)}
                                minRows={3}
                                maxRows={6}
                                maxLength={500}
                                description={`${modalComment.length}/500 characters`}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            variant="light" 
                            onPress={() => setIsReviewModalOpen(false)}
                            isDisabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            color="primary" 
                            onPress={handleSubmitReview}
                            isLoading={isSubmitting}
                            isDisabled={!modalComment.trim()}
                        >
                            {isEditing ? 'Update Review' : 'Submit Review'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default MusicReviews;
