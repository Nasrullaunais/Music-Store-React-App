import { useState, } from 'react';
import {  ArtistDashboardStats } from '@/api/artist';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Progress,
  Chip
} from '@heroui/react';
import {
  FiRefreshCw,
  FiMusic,
  FiStar,
  FiDollarSign
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ArtistAnalyticsProps {
  stats: ArtistDashboardStats | null;
  onRefresh: () => void;
}

const ArtistAnalytics = ({ stats, onRefresh }: ArtistAnalyticsProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      toast.success('Analytics refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh analytics');
    } finally {
      setRefreshing(false);
    }
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const { salesAnalytics, reviewAnalytics } = stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <Button
          startContent={<FiRefreshCw className={refreshing ? 'animate-spin' : ''} />}
          onClick={handleRefresh}
          isLoading={refreshing}
          variant="flat"
        >
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FiMusic className="text-primary" />
              <h3 className="font-semibold">Track Performance</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Total Tracks</span>
                <span className="font-semibold">{salesAnalytics.totalTracks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Recent Uploads</span>
                <Chip size="sm" color="success" variant="flat">
                  {salesAnalytics.recentUploads}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-success" />
              <h3 className="font-semibold">Sales Performance</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Total Sales</span>
                <span className="font-semibold">{salesAnalytics.totalSales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Revenue</span>
                <span className="font-semibold text-success">
                  ${salesAnalytics.totalRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FiStar className="text-warning" />
              <h3 className="font-semibold">Review Performance</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Total Reviews</span>
                <span className="font-semibold">{reviewAnalytics.totalReviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Avg Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{reviewAnalytics.averageRating.toFixed(1)}</span>
                  <FiStar className="text-yellow-500 fill-current text-sm" />
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-default-500">Recent Reviews</span>
                <Chip size="sm" color="primary" variant="flat">
                  {reviewAnalytics.recentReviews}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Genre Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Genre Distribution</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {salesAnalytics.genreDistribution && Object.entries(salesAnalytics.genreDistribution).map(([genre, count]) => {
              const percentage = (count / salesAnalytics.totalTracks) * 100;
              return (
                <div key={genre} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{genre}</span>
                    <span className="text-sm text-default-500">
                      {count} tracks ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    color="primary"
                    className="max-w-full"
                  />
                </div>
              );
            })}
            {(!salesAnalytics.genreDistribution || Object.keys(salesAnalytics.genreDistribution).length === 0) && (
              <p className="text-center text-default-500 py-8">
                No genre data available yet. Upload some music to see analytics!
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Rating Distribution</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {reviewAnalytics.ratingDistribution && Object.entries(reviewAnalytics.ratingDistribution)
              .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
              .map(([rating, count]) => {
                const percentage = reviewAnalytics.totalReviews > 0
                  ? (count / reviewAnalytics.totalReviews) * 100
                  : 0;
                return (
                  <div key={rating} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rating}</span>
                        <FiStar className="text-yellow-500 fill-current text-sm" />
                      </div>
                      <span className="text-sm text-default-500">
                        {count} reviews ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      color={parseInt(rating) >= 4 ? 'success' : parseInt(rating) >= 3 ? 'warning' : 'danger'}
                      className="max-w-full"
                    />
                  </div>
                );
              })}
            {(!reviewAnalytics.ratingDistribution || Object.keys(reviewAnalytics.ratingDistribution).length === 0) && (
              <p className="text-center text-default-500 py-8">
                No rating data available yet.
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Top Performing Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Top Performing Tracks</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {salesAnalytics.topTracks.length > 0 ? (
                salesAnalytics.topTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg bg-default-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{track.name}</p>
                      <div className="flex items-center gap-4 text-sm text-default-500">
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-500 fill-current" />
                          <span>{track.averageRating.toFixed(1)}</span>
                        </div>
                        <span>{track.totalReviews} reviews</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-default-500 py-8">
                  No top performing tracks yet. Upload more music to see analytics!
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Top Rated Tracks</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {reviewAnalytics.topRatedTracks?.length > 0 ? (
                reviewAnalytics.topRatedTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg bg-default-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{track.name}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <FiStar className="text-yellow-500 fill-current" />
                        <span className="text-warning font-semibold">
                          {track.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-default-500 py-8">
                  No ratings yet. Encourage your listeners to leave reviews!
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ArtistAnalytics;
