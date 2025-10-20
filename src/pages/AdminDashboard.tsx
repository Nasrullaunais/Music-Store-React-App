import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminAPI, SystemOverview } from '@/api/adminApi.ts';
import {
  Card,
  CardBody,
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
  FiDollarSign,
  FiUserPlus,
  FiLogOut,
  FiHome,
  FiAlertCircle,
  FiFileText
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
import UserRegistration from '@/components/admin/UserRegistration';
import RefundManagement from '@/components/admin/RefundManagement';
import BanManagement from '@/components/admin/BanManagement';
import SalesReportManagement from '@/components/admin/SalesReportManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: FiHome },
    { key: 'analytics', label: 'Analytics', icon: FiBarChart },
    { key: 'users', label: 'User Management', icon: FiUsers },
    { key: 'moderation', label: 'Content Moderation', icon: FiFlag, badge: overview?.flaggedMusic || 0 },
    { key: 'reviews', label: 'Review Management', icon: FiStar },
    { key: 'orders', label: 'Order Management', icon: FiShoppingCart },
    { key: 'tickets', label: 'Ticket Management', icon: FiMessageSquare, badge: overview?.activeTickets || 0 },
    { key: 'system', label: 'System Management', icon: FiSettings },
    { key: 'registration', label: 'User Registration', icon: FiUserPlus },
    { key: 'refunds', label: 'Refund Management', icon: FiDollarSign },
    { key: 'bans', label: 'Ban Management', icon: FiAlertCircle },
    { key: 'reports', label: 'Sales Reports', icon: FiFileText },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-primary">Dashboard Overview</h1>
              <p className="text-default-600">
                Welcome back, {user?.username}! Here's what's happening with your platform.
              </p>
            </div>

            {/* Overview Stats */}
            {overview && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiActivity className="text-primary" />
                  System Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-md border-primary/30 shadow-lg">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-default-600 text-sm">Total Users</p>
                          <p className="text-2xl font-bold text-primary">{formatNumber(overview.totalUsers)}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <FiTrendingUp className="text-xs text-success" />
                            <span className="text-xs text-success">Active</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                          <FiUsers className="text-4xl text-primary opacity-80 relative z-10" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-gradient-to-br from-success/20 to-success/10 backdrop-blur-md border-success/30 shadow-lg">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-default-600 text-sm">Total Revenue</p>
                          <p className="text-2xl font-bold text-success">{formatCurrency(overview.totalRevenue)}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <FiTrendingUp className="text-xs text-success" />
                            <span className="text-xs text-success">+12.5%</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-success/20 rounded-full blur-xl"></div>
                          <FiDollarSign className="text-4xl text-success opacity-80 relative z-10" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-gradient-to-br from-warning/20 to-warning/10 backdrop-blur-md border-warning/30 shadow-lg">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-default-600 text-sm">Total Orders</p>
                          <p className="text-2xl font-bold text-warning">{formatNumber(overview.totalOrders)}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <FiActivity className="text-xs text-warning" />
                            <span className="text-xs text-warning">Processing</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-warning/20 rounded-full blur-xl"></div>
                          <FiShoppingCart className="text-4xl text-warning opacity-80 relative z-10" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-md border-secondary/30 shadow-lg">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-default-600 text-sm">Music Tracks</p>
                          <p className="text-2xl font-bold text-secondary">{formatNumber(overview.totalMusic)}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <FiActivity className="text-xs text-secondary" />
                            <span className="text-xs text-secondary">Available</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl"></div>
                          <FiActivity className="text-4xl text-secondary opacity-80 relative z-10" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-8">
                  {/* Revenue Chart */}
                  <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
                    <CardBody className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiTrendingUp className="text-success" />
                        Revenue Overview
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600">Today</span>
                          <span className="text-lg font-bold text-success">{formatCurrency(overview.todayRevenue)}</span>
                        </div>
                        <div className="h-2 bg-default-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-success to-success/60 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((overview.todayRevenue / overview.totalRevenue) * 100 * 30, 100)}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-default-600">Total</span>
                          <span className="text-lg font-bold text-primary">{formatCurrency(overview.totalRevenue)}</span>
                        </div>
                        <div className="h-2 bg-default-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                            style={{ width: '100%' }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <div className="p-3 bg-success/10 rounded-lg backdrop-blur-sm">
                            <p className="text-xs text-default-600">Avg Order</p>
                            <p className="text-lg font-bold text-success">
                              {formatCurrency(overview.totalRevenue / Math.max(overview.totalOrders, 1))}
                            </p>
                          </div>
                          <div className="p-3 bg-primary/10 rounded-lg backdrop-blur-sm">
                            <p className="text-xs text-default-600">Growth</p>
                            <p className="text-lg font-bold text-primary">+12.5%</p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Activity Distribution */}
                  <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
                    <CardBody className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiActivity className="text-primary" />
                        Platform Activity
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-default-600 flex items-center gap-2">
                              <FiUsers className="text-primary" />
                              Active Users
                            </span>
                            <span className="text-sm font-semibold">{formatNumber(overview.totalUsers)}</span>
                          </div>
                          <div className="h-2 bg-default-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                              style={{ width: '85%' }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-default-600 flex items-center gap-2">
                              <FiShoppingCart className="text-warning" />
                              Orders
                            </span>
                            <span className="text-sm font-semibold">{formatNumber(overview.totalOrders)}</span>
                          </div>
                          <div className="h-2 bg-default-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-warning to-warning/60 rounded-full"
                              style={{ width: '70%' }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-default-600 flex items-center gap-2">
                              <FiActivity className="text-secondary" />
                              Music Tracks
                            </span>
                            <span className="text-sm font-semibold">{formatNumber(overview.totalMusic)}</span>
                          </div>
                          <div className="h-2 bg-default-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full"
                              style={{ width: '95%' }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-default-600 flex items-center gap-2">
                              <FiMessageSquare className="text-success" />
                              Support Tickets
                            </span>
                            <span className="text-sm font-semibold">{formatNumber(overview.activeTickets)}</span>
                          </div>
                          <div className="h-2 bg-default-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-success to-success/60 rounded-full"
                              style={{ width: '40%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Today's Stats */}
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-8">
                  <FiTrendingUp className="text-primary" />
                  Today's Activity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg hover:shadow-xl transition-shadow">
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

                  <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg hover:shadow-xl transition-shadow">
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

                  <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg hover:shadow-xl transition-shadow">
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

                  <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg hover:shadow-xl transition-shadow">
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

                {/* System Health */}
                <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg mb-6">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiSettings className="text-primary" />
                      System Health
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600">Server Status</span>
                          <Chip color="success" size="sm" variant="flat">Online</Chip>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600">Database</span>
                          <Chip color="success" size="sm" variant="flat">Connected</Chip>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600">API Response</span>
                          <span className="text-sm font-semibold text-success">Fast</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600">Uptime</span>
                          <span className="text-sm font-semibold">99.9%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600">Last Backup</span>
                          <span className="text-sm font-semibold">2 hours ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600">Cache Status</span>
                          <Chip color="success" size="sm" variant="flat">Optimal</Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="flex flex-wrap gap-3">
                    {overview.flaggedMusic > 0 && (
                      <Button
                        color="danger"
                        variant="flat"
                        startContent={<FiFlag />}
                        onPress={() => handleTabChange('moderation')}
                        className="bg-danger/20 backdrop-blur-md hover:bg-danger/30 transition-all"
                      >
                        Review {overview.flaggedMusic} Flagged Items
                      </Button>
                    )}
                    {overview.activeTickets > 0 && (
                      <Button
                        color="warning"
                        variant="flat"
                        startContent={<FiMessageSquare />}
                        onPress={() => handleTabChange('tickets')}
                        className="bg-warning/20 backdrop-blur-md hover:bg-warning/30 transition-all"
                      >
                        Manage {overview.activeTickets} Active Tickets
                      </Button>
                    )}
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<FiBarChart />}
                      onPress={() => handleTabChange('analytics')}
                      className="bg-primary/20 backdrop-blur-md hover:bg-primary/30 transition-all"
                    >
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'analytics':
        return <AdminAnalytics />;
      case 'users':
        return <UserManagement />;
      case 'moderation':
        return <ContentModeration onContentUpdate={loadOverviewData} />;
      case 'reviews':
        return <ReviewManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'tickets':
        return <TicketManagement />;
      case 'system':
        return <SystemManagement />;
      case 'registration':
        return <UserRegistration />;
      case 'refunds':
        return <RefundManagement />;
      case 'bans':
        return <BanManagement />;
      case 'reports':
        return <SalesReportManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white/40 backdrop-blur-lg shadow-3xl fixed left-0 top-0 h-[98vh] flex flex-col z-50 m-2 rounded-2xl">
        {/* Logo/Header */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
          <p className="text-sm text-default-600 mt-1">{user?.username}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => handleTabChange(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-primary/30 text-primary font-semibold backdrop-blur-md shadow-md scale-105'
                        : 'hover:bg-white/30 text-default-700 hover:backdrop-blur-md hover:scale-102'
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Chip
                        size="sm"
                        color={item.key === 'moderation' ? 'danger' : 'warning'}
                        variant="flat"
                        className="backdrop-blur-md"
                      >
                        {item.badge}
                      </Chip>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <Button
            color="danger"
            variant="flat"
            startContent={<FiLogOut />}
            onPress={logout}
            className="w-full bg-danger/20 backdrop-blur-md hover:bg-danger/30 transition-all duration-300"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 h-screen overflow-y-auto">
        <div className="p-8 min-h-full">
          <div className="max-w-7xl mx-auto">
            <div
              className={`transition-all duration-300 ${
                isTransitioning 
                  ? 'opacity-0 transform translate-y-4' 
                  : 'opacity-100 transform translate-y-0'
              }`}
            >
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
