import { useState, useEffect } from 'react';
import { adminAPI, DetailedAnalytics, PerformanceMetrics } from '@/api/adminApi.ts';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Spinner
} from '@heroui/react';
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiMusic,
  FiActivity,
  FiCpu,
  FiHardDrive,
  FiCalendar
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<DetailedAnalytics | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAnalytics();
    loadPerformanceMetrics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getDetailedAnalytics(dateRange.start, dateRange.end);
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPerformanceMetrics = async () => {
    try {
      const data = await adminAPI.getPerformanceMetrics();
      setPerformance(data);
    } catch (error) {
      console.error('Performance metrics error:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiCalendar className="text-primary" />
            Analytics Period
          </h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4 items-end ">
            <Input
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              variant="flat"
              labelPlacement="outside"
              className="max-w-xs w-[150px] bg-white/50 backdrop-blur-md rounded-xl"
            />
            <Input
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              variant="flat"
              labelPlacement="outside"
              className="max-w-[150px] w-[150px] bg-white/50 backdrop-blur-md rounded-xl"
            />
            <Button
              color="primary"
              onPress={loadAnalytics}
              startContent={<FiTrendingUp />}
              className="shadow-lg hover:shadow-xl transition-shadow text-white"
            >
              Update Analytics
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Performance Metrics */}
      {performance && (
        <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiActivity className="text-primary" />
              System Performance
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-lg backdrop-blur-sm border border-primary/20 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <FiCpu className="text-2xl text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Memory Used</p>
                    <p className="text-xl font-semibold">{performance.memoryUsed} MB</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-success/20 to-success/10 p-4 rounded-lg backdrop-blur-sm border border-success/20 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <FiUsers className="text-2xl text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Active Users</p>
                    <p className="text-xl font-semibold">{formatNumber(performance.activeUsers)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-warning/20 to-warning/10 p-4 rounded-lg backdrop-blur-sm border border-warning/20 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/20 rounded-lg">
                    <FiHardDrive className="text-2xl text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Memory Total</p>
                    <p className="text-xl font-semibold">{performance.memoryTotal} MB</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 p-4 rounded-lg backdrop-blur-sm border border-secondary/20 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <FiActivity className="text-2xl text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Uptime</p>
                    <p className="text-xl font-semibold">{performance.systemUptime}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Analytics Data */}
      {analytics && (
        <>
          {/* User Growth */}
          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiTrendingUp className="text-primary" />
                User Growth
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">New Users</p>
                  <p className="text-2xl font-bold text-primary">{formatNumber(analytics.userGrowth?.newUsers || 0)}</p>
                  <p className="text-sm text-default-500">Total New</p>
                </div>
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-success">{(analytics.userGrowth?.growthRate || 0).toFixed(1)}%</p>
                  <p className="text-sm text-default-500">Percentage</p>
                </div>
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Active Users</p>
                  <p className="text-2xl font-bold text-warning">{formatNumber(analytics.userGrowth?.activeUsers || 0)}</p>
                  <p className="text-sm text-default-500">Currently Active</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Sales Analytics */}
          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiDollarSign className="text-success" />
                Sales Analytics
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(analytics.salesAnalytics?.totalRevenue || 0)}</p>
                  <p className="text-sm text-default-500">All Time</p>
                </div>
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{formatNumber(analytics.salesAnalytics?.totalOrders || 0)}</p>
                  <p className="text-sm text-default-500">Completed</p>
                </div>
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Average Order Value</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(analytics.salesAnalytics?.averageOrderValue || 0)}</p>
                  <p className="text-sm text-default-500">Per Order</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Music by Genre */}
          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiMusic className="text-secondary" />
                Music by Genre
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {analytics.musicByGenre && Object.entries(analytics.musicByGenre).map(([genre, count], index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-medium">{genre}</p>
                      <p className="text-sm text-default-600">{formatNumber(count as number)} tracks</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">{formatNumber(count as number)}</p>
                      <p className="text-sm text-default-600">Count</p>
                    </div>
                  </div>
                ))}
                {!analytics.musicByGenre && (
                  <p className="text-center text-default-500">No genre data available</p>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Artist Performance */}
          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiUsers className="text-warning" />
                Artist Performance
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Top Artist</p>
                  <p className="text-2xl font-bold text-primary">{analytics.artistPerformance?.topArtist || 'N/A'}</p>
                  <p className="text-sm text-default-500">Best Performer</p>
                </div>
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Total Tracks</p>
                  <p className="text-2xl font-bold text-warning">{formatNumber(analytics.artistPerformance?.totalTracks || 0)}</p>
                  <p className="text-sm text-default-500">Published</p>
                </div>
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-md">
                  <p className="text-sm text-default-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(analytics.artistPerformance?.totalRevenue || 0)}</p>
                  <p className="text-sm text-default-500">Generated</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
