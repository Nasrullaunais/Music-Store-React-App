import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminAPI, SystemOverview } from '@/api/admin';
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Chip,
  Button
} from '@heroui/react';
import {
  FiUsers,
  FiBarChart,
  FiFlag,
  FiMessageSquare,
  FiShoppingCart,
  FiStar,
  FiSettings,
  FiTrendingUp,
  FiActivity,
  FiDollarSign
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import admin components
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import UserManagement from '@/components/admin/UserManagement';
import ContentModeration from '@/components/admin/ContentModeration';
import ReviewManagement from '@/components/admin/ReviewManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import TicketManagement from '@/components/admin/TicketManagement';
import SystemManagement from '@/components/admin/SystemManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getSystemOverview();
      setOverview(data);
    } catch (error) {
      toast.error('Failed to load dashboard overview');
      console.error('Overview loading error:', error);
    } finally {
      setLoading(false);
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
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-primary">Admin Dashboard</h1>
        <p className="text-default-600">
          Welcome back, {user?.username}! Manage your music store platform.
        </p>
      </div>

      {/* Overview Stats - Always visible */}
      {overview && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiActivity className="text-primary" />
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-primary">{formatNumber(overview.totalUsers)}</p>
                  </div>
                  <FiUsers className="text-2xl text-primary" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(overview.totalRevenue)}</p>
                  </div>
                  <FiDollarSign className="text-2xl text-success" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-warning">{formatNumber(overview.totalOrders)}</p>
                  </div>
                  <FiShoppingCart className="text-2xl text-warning" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Music Tracks</p>
                    <p className="text-2xl font-bold text-secondary">{formatNumber(overview.totalMusic)}</p>
                  </div>
                  <FiActivity className="text-2xl text-secondary" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Today's Orders</p>
                    <p className="text-xl font-semibold">{formatNumber(overview.todayOrders)}</p>
                  </div>
                  <FiTrendingUp className="text-xl text-primary" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Today's Revenue</p>
                    <p className="text-xl font-semibold">{formatCurrency(overview.todayRevenue)}</p>
                  </div>
                  <FiDollarSign className="text-xl text-success" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Flagged Content</p>
                    <p className="text-xl font-semibold">{formatNumber(overview.flaggedMusic)}</p>
                  </div>
                  <FiFlag className={`text-xl ${overview.flaggedMusic > 0 ? 'text-danger' : 'text-default-400'}`} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-default-600 text-sm">Active Tickets</p>
                    <p className="text-xl font-semibold">{formatNumber(overview.activeTickets)}</p>
                  </div>
                  <FiMessageSquare className={`text-xl ${overview.activeTickets > 0 ? 'text-warning' : 'text-default-400'}`} />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {overview.flaggedMusic > 0 && (
              <Button
                color="danger"
                variant="flat"
                startContent={<FiFlag />}
                onPress={() => setActiveTab('moderation')}
              >
                Review {overview.flaggedMusic} Flagged Items
              </Button>
            )}
            {overview.activeTickets > 0 && (
              <Button
                color="warning"
                variant="flat"
                startContent={<FiMessageSquare />}
                onPress={() => setActiveTab('tickets')}
              >
                Manage {overview.activeTickets} Active Tickets
              </Button>
            )}
            <Button
              color="primary"
              variant="flat"
              startContent={<FiBarChart />}
              onPress={() => setActiveTab('analytics')}
            >
              View Analytics
            </Button>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <Card>
        <CardBody>
          <Tabs
            aria-label="Admin Dashboard Tabs"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab
              key="analytics"
              title={
                <div className="flex items-center space-x-2">
                  <FiBarChart />
                  <span>Analytics</span>
                </div>
              }
            >
              <AdminAnalytics />
            </Tab>

            <Tab
              key="users"
              title={
                <div className="flex items-center space-x-2">
                  <FiUsers />
                  <span>User Management</span>
                </div>
              }
            >
              <UserManagement />
            </Tab>

            <Tab
              key="moderation"
              title={
                <div className="flex items-center space-x-2">
                  <FiFlag />
                  <span>Content Moderation</span>
                  {overview && overview.flaggedMusic > 0 && (
                    <Chip size="sm" color="danger" variant="flat">
                      {overview.flaggedMusic}
                    </Chip>
                  )}
                </div>
              }
            >
              <ContentModeration onContentUpdate={loadOverviewData} />
            </Tab>

            <Tab
              key="reviews"
              title={
                <div className="flex items-center space-x-2">
                  <FiStar />
                  <span>Review Management</span>
                </div>
              }
            >
              <ReviewManagement />
            </Tab>

            <Tab
              key="orders"
              title={
                <div className="flex items-center space-x-2">
                  <FiShoppingCart />
                  <span>Order Management</span>
                </div>
              }
            >
              <OrderManagement />
            </Tab>

            <Tab
              key="tickets"
              title={
                <div className="flex items-center space-x-2">
                  <FiMessageSquare />
                  <span>Ticket Management</span>
                  {overview && overview.activeTickets > 0 && (
                    <Chip size="sm" color="warning" variant="flat">
                      {overview.activeTickets}
                    </Chip>
                  )}
                </div>
              }
            >
              <TicketManagement />
            </Tab>

            <Tab
              key="system"
              title={
                <div className="flex items-center space-x-2">
                  <FiSettings />
                  <span>System Management</span>
                </div>
              }
            >
              <SystemManagement />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminDashboard;
