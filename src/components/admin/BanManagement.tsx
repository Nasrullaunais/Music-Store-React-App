import { useState, useEffect } from 'react';
import { adminAPI, BannedUserDto, BanStatistics } from '@/api/adminApi.ts';
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
  Spinner,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
} from '@heroui/react';
import {
  FiShield,
  FiAlertCircle,
  FiClock,
  FiUser,
  FiInfo,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const BanManagement = () => {
  const [bannedUsers, setBannedUsers] = useState<BannedUserDto[]>([]);
  const [statistics, setStatistics] = useState<BanStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<BannedUserDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isUnbanning, setIsUnbanning] = useState(false);
  const pageSize = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isUnbanModalOpen, onOpen: onUnbanModalOpen, onClose: onUnbanModalClose } = useDisclosure();

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bannedResponse, statsResponse] = await Promise.all([
        adminAPI.getBannedUsers(currentPage - 1, pageSize),
        adminAPI.getBanStatistics(),
      ]);

      setBannedUsers(bannedResponse.content);
      setTotalPages(bannedResponse.totalPages);
      setTotalElements(bannedResponse.totalElements);
      setStatistics(statsResponse);
    } catch (error) {
      toast.error('Failed to load banned users data');
      console.error('Banned users loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnbanUser = async (user: BannedUserDto) => {
    setSelectedUser(user);
    onUnbanModalOpen();
  };

  const confirmUnban = async () => {
    if (!selectedUser) return;

    setIsUnbanning(true);
    try {
      if (selectedUser.userType === 'CUSTOMER') {
        await adminAPI.unbanCustomer(selectedUser.userId);
      } else if (selectedUser.userType === 'ARTIST') {
        await adminAPI.unbanArtist(selectedUser.userId);
      }

      toast.success(`${selectedUser.username} has been unbanned successfully`);
      onUnbanModalClose();
      // Close details modal if open
      if (isOpen) {
        onClose();
      }
      loadData();
    } catch (error) {
      toast.error('Failed to unban user');
      console.error('Unban error:', error);
    } finally {
      setIsUnbanning(false);
    }
  };

  const handleViewDetails = (user: BannedUserDto) => {
    setSelectedUser(user);
    onOpen();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserTypeColor = (userType: string) => {
    return userType === 'ARTIST' ? 'secondary' : 'primary';
  };

  const getTimeRemainingColor = (hours: number) => {
    if (hours <= 24) return 'danger';
    if (hours <= 72) return 'warning';
    return 'default';
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return 'Expired';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-danger-50 to-danger-100/50 backdrop-blur-lg border-danger-200 shadow-lg">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-danger-500/20 rounded-lg">
                <FiAlertCircle className="text-2xl text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-danger-600 font-medium">Total Banned</p>
                <p className="text-2xl font-bold text-danger-700">{statistics.totalBanned}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/30 backdrop-blur-lg shadow-lg">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary-500/20 rounded-lg">
                <FiUsers className="text-2xl text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600 font-medium">Banned Customers</p>
                <p className="text-2xl font-bold text-primary-700">{statistics.bannedCustomers}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/30 backdrop-blur-lg shadow-lg">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-secondary-500/20 rounded-lg">
                <FiTrendingUp className="text-2xl text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Banned Artists</p>
                <p className="text-2xl font-bold text-secondary-700">{statistics.bannedArtists}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/30 backdrop-blur-lg shadow-lg">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-warning-500/20 rounded-lg">
                <FiClock className="text-2xl text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-warning-600 font-medium">Expiring Soon</p>
                <p className="text-2xl font-bold text-warning-700">{statistics.expiringSoon}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="bg-white/40 backdrop-blur-lg border-white/60 shadow-xl">
        <CardHeader className="border-b border-divider/50">
          <div className="flex justify-between items-center w-full">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <FiAlertCircle className="text-danger" />
                Banned Users Management
              </h3>
              <p className="text-sm text-default-500 mt-1">
                Showing {bannedUsers.length} of {totalElements} banned users
              </p>
            </div>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onPress={loadData}
              isLoading={loading}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {bannedUsers.length === 0 ? (
            <div className="text-center py-12 text-default-500">
              <FiShield className="mx-auto text-5xl mb-3 text-success" />
              <p className="text-lg font-medium">No banned users</p>
              <p className="text-sm mt-1">All users are in good standing</p>
            </div>
          ) : (
            <>
              <Table
                aria-label="Banned users table"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  th: "bg-default-100/50 backdrop-blur-sm text-default-700 font-semibold",
                  td: "bg-transparent",
                }}
              >
                <TableHeader>
                  <TableColumn>USER INFO</TableColumn>
                  <TableColumn>TYPE</TableColumn>
                  <TableColumn>BAN REASON</TableColumn>
                  <TableColumn>BANNED BY</TableColumn>
                  <TableColumn>TIME REMAINING</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {bannedUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="flex flex-col">
                          <p className="font-semibold text-foreground">{user.username}</p>
                          <p className="text-sm text-default-500">{user.email}</p>
                          <p className="text-xs text-default-400">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getUserTypeColor(user.userType)}
                          variant="flat"
                          size="sm"
                          className="font-medium"
                        >
                          {user.userType}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Tooltip content={user.banReason} placement="top">
                          <p className="max-w-[200px] truncate text-sm text-default-700">
                            {user.banReason}
                          </p>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FiUser className="text-default-400" />
                          <span className="text-sm text-default-700">{user.bannedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getTimeRemainingColor(user.hoursRemaining)}
                          variant="flat"
                          size="sm"
                          startContent={<FiClock className="text-sm" />}
                          className="font-medium"
                        >
                          {formatTimeRemaining(user.hoursRemaining)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Tooltip content="View Details">
                            <Button
                              isIconOnly
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() => handleViewDetails(user)}
                            >
                              <FiInfo className="text-lg" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Unban User">
                            <Button
                              isIconOnly
                              size="sm"
                              color="success"
                              variant="flat"
                              onPress={() => handleUnbanUser(user)}
                            >
                              <FiShield className="text-lg" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    showControls
                    color="primary"
                    classNames={{
                      wrapper: "gap-2",
                      item: "bg-white/50 backdrop-blur-sm",
                      cursor: "bg-primary shadow-lg",
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        backdrop="blur"
        classNames={{
          base: "bg-white/40 backdrop-blur-lg",
          body: "py-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2 text-xl font-bold">
                <FiInfo className="text-primary" />
                Banned User Details
              </ModalHeader>
              <ModalBody>
                {selectedUser && (
                  <div className="space-y-6">
                    {/* User Information */}
                    <div className="bg-default-100/50 rounded-lg p-4">
                      <h4 className="font-semibold text-default-700 mb-3 flex items-center gap-2">
                        <FiUser className="text-primary" />
                        User Information
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-default-500 font-medium">User ID</p>
                          <p className="text-sm font-semibold text-default-700">#{selectedUser.userId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 font-medium">User Type</p>
                          <Chip color={getUserTypeColor(selectedUser.userType)} size="sm" variant="flat">
                            {selectedUser.userType}
                          </Chip>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 font-medium">Username</p>
                          <p className="text-sm font-semibold text-default-700">{selectedUser.username}</p>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 font-medium">Email</p>
                          <p className="text-sm font-semibold text-default-700">{selectedUser.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 font-medium">First Name</p>
                          <p className="text-sm font-semibold text-default-700">{selectedUser.firstName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 font-medium">Last Name</p>
                          <p className="text-sm font-semibold text-default-700">{selectedUser.lastName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ban Information */}
                    <div className="rounded-lg p-4">
                      <h4 className="font-semibold text-danger-700 mb-3 flex items-center gap-2">
                        <FiAlertCircle className="text-danger" />
                        Ban Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-danger-600 font-medium mb-1">Ban Reason</p>
                          <p className="text-sm text-default-700  p-2">
                            {selectedUser.banReason}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-danger-600 font-medium">Banned By</p>
                            <p className="text-sm font-semibold text-default-700">{selectedUser.bannedBy}</p>
                          </div>
                          <div>
                            <p className="text-xs text-danger-600 font-medium">Time Remaining</p>
                            <Chip color={getTimeRemainingColor(selectedUser.hoursRemaining)} size="sm" variant="flat">
                              {formatTimeRemaining(selectedUser.hoursRemaining)} ({selectedUser.hoursRemaining}h)
                            </Chip>
                          </div>
                          <div>
                            <p className="text-xs text-danger-600 font-medium">Banned At</p>
                            <p className="text-sm font-semibold text-default-700">{formatDate(selectedUser.bannedAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-danger-600 font-medium">Ban Expires</p>
                            <p className="text-sm font-semibold text-default-700">{formatDate(selectedUser.bannedUntil)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedUser && (
                  <Button
                    color="success"
                    variant="flat"
                    startContent={<FiShield />}
                    onPress={() => handleUnbanUser(selectedUser)}
                  >
                    Unban User
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Unban Confirmation Modal */}
      <Modal
        isOpen={isUnbanModalOpen}
        onClose={onUnbanModalClose}
        size="md"
        backdrop="blur"
        classNames={{
          base: "bg-white/40 backdrop-blur-lg",
          body: "py-6",
        }}
        isDismissable={!isUnbanning}
        hideCloseButton={isUnbanning}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2 text-xl font-bold">
                <FiCheckCircle className="text-success" />
                Confirm Unban User
              </ModalHeader>
              <ModalBody>
                {selectedUser && (
                  <div className="space-y-4">
                    {isUnbanning ? (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Spinner size="lg" color="success" className="mb-4" />
                        <p className="text-lg font-semibold text-default-700">Unbanning user...</p>
                        <p className="text-sm text-default-500 mt-2">Please wait while we process your request</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-success-50/50 rounded-lg p-4">
                          <p className="text-sm text-default-700 mb-2">
                            Are you sure you want to unban this user?
                          </p>
                          <div className="space-y-2 mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-default-500">Username:</span>
                              <span className="text-sm font-bold text-default-700">{selectedUser.username}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-default-500">Email:</span>
                              <span className="text-sm font-bold text-default-700">{selectedUser.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-default-500">User Type:</span>
                              <Chip color={getUserTypeColor(selectedUser.userType)} size="sm" variant="flat">
                                {selectedUser.userType}
                              </Chip>
                            </div>
                          </div>
                        </div>
                        <div className="bg-warning-50/50 rounded-lg p-3">
                          <p className="text-xs text-warning-700 flex items-start gap-2">
                            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                            <span>
                              This will immediately restore the user's access to the platform. They will be able to log in and use all features again.
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isUnbanning}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  variant="flat"
                  startContent={!isUnbanning && <FiShield />}
                  onPress={confirmUnban}
                  isLoading={isUnbanning}
                  isDisabled={isUnbanning}
                >
                  {isUnbanning ? 'Unbanning...' : 'Yes, Unban User'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BanManagement;

