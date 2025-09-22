import { useState, useEffect } from 'react';
import { adminAPI, DetailedAnalytics, PerformanceMetrics } from '@/api/admin';
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
  FiHardDrive
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<DetailedAnalytics | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
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
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Analytics Period</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="max-w-xs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="max-w-xs"
              />
            </div>
            <Button color="primary" onPress={loadAnalytics}>
              Update Analytics
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Performance Metrics */}
      {performance && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiActivity />
              System Performance
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-2xl text-primary" />
                  <div>
                    <p className="text-sm text-default-600">Memory Used</p>
                    <p className="text-xl font-semibold">{performance.memoryUsed} MB</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-success/10 to-success/5 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiUsers className="text-2xl text-success" />
                  <div>
                    <p className="text-sm text-default-600">Active Users</p>
                    <p className="text-xl font-semibold">{formatNumber(performance.activeUsers)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-warning/10 to-warning/5 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiHardDrive className="text-2xl text-warning" />
                  <div>
                    <p className="text-sm text-default-600">Memory Total</p>
                    <p className="text-xl font-semibold">{performance.memoryTotal} MB</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiActivity className="text-2xl text-secondary" />
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
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiTrendingUp />
                User Growth
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">New Users</p>
                  <p className="text-2xl font-bold text-primary">{formatNumber(analytics.userGrowth?.newUsers || 0)}</p>
                  <p className="text-sm text-default-500">Total New</p>
                </div>
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-success">{(analytics.userGrowth?.growthRate || 0).toFixed(1)}%</p>
                  <p className="text-sm text-default-500">Percentage</p>
                </div>
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">Active Users</p>
                  <p className="text-2xl font-bold text-warning">{formatNumber(analytics.userGrowth?.activeUsers || 0)}</p>
                  <p className="text-sm text-default-500">Currently Active</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Sales Analytics */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiDollarSign />
                Sales Analytics
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(analytics.salesAnalytics?.totalRevenue || 0)}</p>
                  <p className="text-sm text-default-500">All Time</p>
                </div>
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{formatNumber(analytics.salesAnalytics?.totalOrders || 0)}</p>
                  <p className="text-sm text-default-500">Completed</p>
                </div>
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">Average Order Value</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(analytics.salesAnalytics?.averageOrderValue || 0)}</p>
                  <p className="text-sm text-default-500">Per Order</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Music by Genre */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiMusic />
                Music by Genre
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {analytics.musicByGenre && Object.entries(analytics.musicByGenre).map(([genre, count], index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
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
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiUsers />
                Artist Performance
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">Top Artist</p>
                  <p className="text-2xl font-bold text-primary">{analytics.artistPerformance?.topArtist || 'N/A'}</p>
                  <p className="text-sm text-default-500">Best Performer</p>
                </div>
                <div className="border border-divider p-4 rounded-lg">
                  <p className="text-sm text-default-600">Total Tracks</p>
                  <p className="text-2xl font-bold text-warning">{formatNumber(analytics.artistPerformance?.totalTracks || 0)}</p>
                  <p className="text-sm text-default-500">Published</p>
                </div>
                <div className="border border-divider p-4 rounded-lg">
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
