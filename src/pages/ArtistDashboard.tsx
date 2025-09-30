import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { artistAPI, ArtistDashboardStats } from '@/api/artistApi.ts';
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Chip
} from '@heroui/react';
import {
  FiMusic,
  FiStar,
  FiUpload,
  FiTrendingUp,
  FiActivity,
  FiDollarSign,
  FiMessageSquare,
  FiUser
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import artist components (to be created)
import ArtistAnalytics from '@/components/artist/ArtistAnalytics';
import MusicManagement from '@/components/artist/MusicManagement';
import ReviewManagement from '@/components/artist/ReviewManagement';
import ArtistProfile from '@/components/artist/ArtistProfile';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ArtistDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const data = await artistAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.artistName || user?.username}!
        </h1>
        <p className="text-default-500">
          Manage your music, track performance, and connect with your audience.
        </p>
      </div>

      {/* Overview Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FiMusic className="text-2xl text-primary" />
              </div>
              <div>
                <p className="text-sm text-default-500">Total Tracks</p>
                <p className="text-2xl font-bold">{stats.totalTracks}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <FiDollarSign className="text-2xl text-success" />
              </div>
              <div>
                <p className="text-sm text-default-500">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${stats.salesAnalytics.totalRevenue.toFixed(2)}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <FiTrendingUp className="text-2xl text-warning" />
              </div>
              <div>
                <p className="text-sm text-default-500">Total Sales</p>
                <p className="text-2xl font-bold">{stats.salesAnalytics.totalSales}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <FiStar className="text-2xl text-secondary" />
              </div>
              <div>
                <p className="text-sm text-default-500">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {stats.reviewAnalytics.averageRating.toFixed(1)}
                  </p>
                  <FiStar className="text-yellow-500 fill-current" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Card>
        <CardBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            color="primary"
            className="w-full"
          >
            <Tab
              key="overview"
              title={
                <div className="flex items-center gap-2">
                  <FiActivity />
                  <span>Overview</span>
                </div>
              }
            >
              <div className="pt-6">
                <ArtistAnalytics stats={stats} onRefresh={loadDashboardStats} />
              </div>
            </Tab>

            <Tab
              key="music"
              title={
                <div className="flex items-center gap-2">
                  <FiMusic />
                  <span>Music Library</span>
                </div>
              }
            >
              <div className="pt-6">
                <MusicManagement onStatsUpdate={loadDashboardStats} />
              </div>
            </Tab>

            <Tab
              key="upload"
              title={
                <div className="flex items-center gap-2">
                  <FiUpload />
                  <span>Upload Music</span>
                </div>
              }
            >
              <div className="pt-6">
                <MusicManagement defaultView="upload" onStatsUpdate={loadDashboardStats} />
              </div>
            </Tab>

            <Tab
              key="reviews"
              title={
                <div className="flex items-center gap-2">
                  <FiMessageSquare />
                  <span>Reviews</span>
                  {stats && stats.reviewAnalytics.recentReviews > 0 && (
                    <Chip size="sm" color="primary" variant="flat">
                      {stats.reviewAnalytics.recentReviews}
                    </Chip>
                  )}
                </div>
              }
            >
              <div className="pt-6">
                <ReviewManagement />
              </div>
            </Tab>

            <Tab
              key="profile"
              title={
                <div className="flex items-center gap-2">
                  <FiUser />
                  <span>Profile</span>
                </div>
              }
            >
              <div className="pt-6">
                <ArtistProfile />
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default ArtistDashboard;
