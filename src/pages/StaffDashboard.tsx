import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { staffTicketAPI } from '@/api/tickets';
import { Ticket } from '@/types';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Tabs,
  Tab,
  Input,
  Spinner
} from '@heroui/react';
import {
  FiSearch,
  FiAlertTriangle,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiMessageSquare
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import TicketDetailsModal from '@/components/staff/TicketDetailsModal';
import TicketsList from '@/components/staff/TicketsList';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [urgentTickets, setUrgentTickets] = useState<Ticket[]>([]);
  const [unassignedTickets, setUnassignedTickets] = useState<Ticket[]>([]);
  const [needsAttentionTickets, setNeedsAttentionTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    urgent: 0,
    unassigned: 0,
    needsAttention: 0,
    closed: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allTickets, urgent, unassigned, needsAttention] = await Promise.all([
        staffTicketAPI.getAllTickets(),
        staffTicketAPI.getUrgentTickets(),
        staffTicketAPI.getUnassignedTickets(),
        staffTicketAPI.getTicketsNeedingAttention()
      ]);

      // Debug: Log the actual ticket data structure
      console.log('Raw ticket data from API:', {
        sampleTicket: allTickets[0],
        totalTickets: allTickets.length
      });

      setTickets(allTickets);
      setUrgentTickets(urgent);
      setUnassignedTickets(unassigned);
      setNeedsAttentionTickets(needsAttention);

      // Calculate stats
      setStats({
        total: allTickets.length,
        urgent: urgent.length,
        unassigned: unassigned.length,
        needsAttention: needsAttention.length,
        closed: allTickets.filter(t => t.status === 'CLOSED').length
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDashboardData();
      return;
    }

    try {
      const searchResults = await staffTicketAPI.searchTickets(searchQuery);
      setTickets(searchResults);
      setActiveTab('all');
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleTicketUpdate = () => {
    // Refresh data after ticket update
    loadDashboardData();
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'primary';
      case 'IN_PROGRESS': return 'warning';
      case 'URGENT': return 'danger';
      case 'CLOSED': return 'success';
      default: return 'default';
    }
  };

  const getCurrentTickets = () => {
    switch (activeTab) {
      case 'urgent': return urgentTickets;
      case 'unassigned': return unassignedTickets;
      case 'needs-attention': return needsAttentionTickets;
      case 'closed': return tickets.filter(t => t.status === 'CLOSED');
      default: return tickets;
    }
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
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-default-600">Welcome back, {user?.username}! Manage customer support tickets and provide excellent service.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-none shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <p className="text-default-600 text-sm">Total Tickets</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FiMessageSquare className="text-primary text-2xl" />
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <p className="text-default-600 text-sm">Urgent</p>
              <p className="text-2xl font-bold text-danger">{stats.urgent}</p>
            </div>
            <FiAlertTriangle className="text-danger text-2xl" />
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <p className="text-default-600 text-sm">Unassigned</p>
              <p className="text-2xl font-bold text-warning">{stats.unassigned}</p>
            </div>
            <FiUsers className="text-warning text-2xl" />
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <p className="text-default-600 text-sm">Needs Attention</p>
              <p className="text-2xl font-bold text-secondary">{stats.needsAttention}</p>
            </div>
            <FiClock className="text-secondary text-2xl" />
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <p className="text-default-600 text-sm">Closed</p>
              <p className="text-2xl font-bold text-success">{stats.closed}</p>
            </div>
            <FiCheckCircle className="text-success text-2xl" />
          </CardBody>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-4">
          <Input
            placeholder="Search tickets by subject or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            startContent={<FiSearch className="text-default-400" />}
            className="flex-1"
          />
          <Button
            color="primary"
            onPress={handleSearch}
            startContent={<FiSearch />}
          >
            Search
          </Button>
          <Button
            variant="ghost"
            onPress={() => {
              setSearchQuery('');
              loadDashboardData();
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Tickets Tabs */}
      <Card className="shadow-sm">
        <CardHeader>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="w-full"
          >
            <Tab
              key="all"
              title={
                <div className="flex items-center space-x-2">
                  <span>All Tickets</span>
                  <Chip color="primary" size="sm">{stats.total}</Chip>
                </div>
              }
            />
            <Tab
              key="urgent"
              title={
                <div className="flex items-center space-x-2">
                  <span>Urgent</span>
                  <Chip color="danger" size="sm">{stats.urgent}</Chip>
                </div>
              }
            />
            <Tab
              key="unassigned"
              title={
                <div className="flex items-center space-x-2">
                  <span>Unassigned</span>
                  <Chip color="warning" size="sm">{stats.unassigned}</Chip>
                </div>
              }
            />
            <Tab
              key="needs-attention"
              title={
                <div className="flex items-center space-x-2">
                  <span>Needs Attention</span>
                  <Chip color="secondary" size="sm">{stats.needsAttention}</Chip>
                </div>
              }
            />
            <Tab
              key="closed"
              title={
                <div className="flex items-center space-x-2">
                  <span>Closed</span>
                  <Chip color="success" size="sm">{stats.closed}</Chip>
                </div>
              }
            />
          </Tabs>
        </CardHeader>
        <CardBody>
          <TicketsList
            tickets={getCurrentTickets()}
            onTicketSelect={handleTicketSelect}
            getStatusColor={getStatusColor}
          />
        </CardBody>
      </Card>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
};

export default StaffDashboard;
