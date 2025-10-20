import { useState, useEffect } from 'react';
import { adminAPI, AdminUser, CreateUserRequest, BanRequest } from '@/api/adminApi.ts';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
  useDisclosure,
  Textarea
} from '@heroui/react';
import {
  FiPlus,
  FiEdit2,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,
  FiUsers,
  FiAlertCircle,
  FiShield
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import AnimatedModal from './AnimatedModal';

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isBanModalOpen, onOpen: onBanModalOpen, onClose: onBanModalClose } = useDisclosure();

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    password: '',
    email: '',
    role: 'CUSTOMER',
    firstName: '',
    lastName: ''
  });

  const [banFormData, setBanFormData] = useState<BanRequest>({
    reason: '',
    durationInHours: 24
  });

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const filterValue = roleFilter === 'all' ? undefined : roleFilter || undefined;
      const response = await adminAPI.getAllUsers(page - 1, 10, filterValue);
      setUsers(response.content || []);
      const totalElements = response.totalElements || 0;
      setTotalPages(Math.max(1, Math.ceil(totalElements / 10)));
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Users loading error:', error);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setIsCreating(true);
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      email: '',
      role: 'CUSTOMER',
      firstName: '',
      lastName: ''
    });
    onOpen();
  };

  const handleEditUser = (user: AdminUser) => {
    setIsCreating(false);
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      email: user.email,
      role: user.role as any,
      firstName: '',
      lastName: ''
    });
    onOpen();
  };

  const handleSubmit = async () => {
    try {
      if (isCreating) {
        await adminAPI.createUser(formData);
        toast.success('User created successfully');
      } else if (selectedUser) {
        const updateData: Partial<CreateUserRequest> = {
          email: formData.email,
          role: formData.role
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        if (formData.firstName) {
          updateData.firstName = formData.firstName;
        }
        if (formData.lastName) {
          updateData.lastName = formData.lastName;
        }

        await adminAPI.updateUser(selectedUser.id, updateData);
        toast.success('User updated successfully');
      }

      onClose();
      loadUsers();
    } catch (error) {
      toast.error(isCreating ? 'Failed to create user' : 'Failed to update user');
      console.error('User operation error:', error);
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      // Find the current user to get their current enabled status
      const currentUser = users.find(user => user.id === userId);
      if (!currentUser) return;

      // Toggle the status
      await adminAPI.toggleUserStatus(userId, !currentUser.enabled);
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Toggle status error:', error);
    }
  };

  const handleBanUser = (user: AdminUser) => {
    setSelectedUser(user);
    setBanFormData({
      reason: '',
      durationInHours: 24
    });
    onBanModalOpen();
  };

  const handleSubmitBan = async () => {
    if (!selectedUser) return;

    try {
      setIsBanning(true);
      if (selectedUser.role === 'CUSTOMER') {
        await adminAPI.banCustomer(selectedUser.id, banFormData);
      } else if (selectedUser.role === 'ARTIST') {
        await adminAPI.banArtist(selectedUser.id, banFormData);
      } else {
        toast.error('Only customers and artists can be banned');
        return;
      }

      toast.success(`User banned successfully for ${banFormData.durationInHours} hours`);
      onBanModalClose();
      loadUsers();
    } catch (error) {
      toast.error('Failed to ban user');
      console.error('Ban error:', error);
    } finally {
      setIsBanning(false);
    }
  };

  const handleUnbanUser = async (user: AdminUser) => {
    try {
      if (user.role === 'CUSTOMER') {
        await adminAPI.unbanCustomer(user.id);
      } else if (user.role === 'ARTIST') {
        await adminAPI.unbanArtist(user.id);
      }

      toast.success('User unbanned successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to unban user');
      console.error('Unban error:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'STAFF': return 'warning';
      case 'ARTIST': return 'secondary';
      case 'CUSTOMER': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'success' : 'danger';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query)
    );
  });

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiUsers />
              User Management
            </h3>
            <Button color="primary" startContent={<FiPlus />} onPress={handleCreateUser}>
              Create User
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4 mb-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<FiSearch />}
              className="max-w-xs"
              classNames={{
                inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50 shadow-lg"
              }}
            />
            <Select
              placeholder="Filter by role"
              selectedKeys={roleFilter ? [roleFilter] : []}
              onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string || '')}
              className="max-w-xs"
              classNames={{
                trigger: "bg-white/30 backdrop-blur-lg border-white/50 shadow-lg",
                listboxWrapper: "max-h-[300px]",
                popoverContent: "bg-white/90 border border-gray-200 shadow-2xl"
              }}
              aria-label="Filter users by role"
            >
              <SelectItem key="all">All Roles</SelectItem>
              <SelectItem key="CUSTOMER">Customer</SelectItem>
              <SelectItem key="ARTIST">Artist</SelectItem>
              <SelectItem key="STAFF">Staff</SelectItem>
              <SelectItem key="ADMIN">Admin</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
        <CardBody>
          <Table
            aria-label="Users table"
            classNames={{
              wrapper: "bg-transparent shadow-none",
              th: "bg-white/20 backdrop-blur-sm",
              td: "bg-transparent"
            }}
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                  classNames={{
                    wrapper: "backdrop-blur-slg rounded-xl",
                    item: "backdrop-blur-lg rounded-lg",
                    cursor: "bg-primary/60 backdrop-blur-lg rounded-lg",
                    prev: "backdrop-blur-lg",
                    next: "backdrop-blur-lg"
                  }}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>USERNAME</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>CREATED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={`${user.id}-${index}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-small text-default-400">ID: {user.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip color={getRoleColor(user.role)} variant="flat" size="sm">
                      {user.role}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Chip color={getStatusColor(user.enabled)} variant="flat" size="sm">
                        {user.enabled ? 'Active' : 'Disabled'}
                      </Chip>
                      {user.isBanned && (
                        <Chip color="danger" variant="flat" size="sm" startContent={<FiAlertCircle />}>
                          Banned
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleEditUser(user)}
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={user.enabled ? 'danger' : 'success'}
                        onPress={() => handleToggleUserStatus(user.id)}
                      >
                        {user.enabled ? <FiToggleRight /> : <FiToggleLeft />}
                      </Button>
                      {(user.role === 'CUSTOMER' || user.role === 'ARTIST') && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color={user.isBanned ? 'success' : 'danger'}
                          onPress={() => user.isBanned ? handleUnbanUser(user) : handleBanUser(user)}
                          title={user.isBanned ? 'Unban User' : 'Ban User'}
                        >
                          {user.isBanned ? <FiShield /> : <FiAlertCircle />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Create/Edit User Modal */}
      <AnimatedModal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        size="2xl"
      >
        <ModalHeader className="flex flex-col gap-1">
          {isCreating ? 'Create New User' : `Edit User: ${selectedUser?.username}`}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              autoFocus
              label="Username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              isDisabled={!isCreating}
              classNames={{
                inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
              }}
            />
            <Input
              label="Email"
              placeholder="Enter email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              classNames={{
                inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
              }}
            />
            <Input
              label="Password"
              placeholder={isCreating ? "Enter password" : "Leave blank to keep current"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              classNames={{
                inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
              }}
            />
            <Select
              label="Role"
              selectedKeys={[formData.role]}
              onSelectionChange={(keys) => setFormData(prev => ({ ...prev, role: Array.from(keys)[0] as any }))}
              classNames={{
                trigger: "bg-white/30 backdrop-blur-lg border-white/50",
                listboxWrapper: "max-h-[300px]",
                popoverContent: "bg-white/90 border border-gray-200 shadow-2xl"
              }}
            >
              <SelectItem key="CUSTOMER">Customer</SelectItem>
              <SelectItem key="ARTIST">Artist</SelectItem>
              <SelectItem key="STAFF">Staff</SelectItem>
              <SelectItem key="ADMIN">Admin</SelectItem>
            </Select>
            <Input
              label="First Name"
              placeholder="Enter first name (optional)"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              classNames={{
                inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
              }}
            />
            <Input
              label="Last Name"
              placeholder="Enter last name (optional)"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              classNames={{
                inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            {isCreating ? 'Create User' : 'Update User'}
          </Button>
        </ModalFooter>
      </AnimatedModal>

      {/* Ban User Modal */}
      <AnimatedModal
        isOpen={isBanModalOpen}
        onClose={onBanModalClose}
        placement="top-center"
        size="md"
        isDismissable={!isBanning}
      >
        <ModalHeader className="flex items-center gap-2 text-xl font-bold">
          <FiAlertCircle className="text-danger" />
          Ban User: {selectedUser?.username}
        </ModalHeader>
        <ModalBody>
          {isBanning ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Spinner size="lg" color="danger" className="mb-4" />
              <p className="text-lg font-semibold text-default-700">Banning user...</p>
              <p className="text-sm text-default-500 mt-2">Please wait while we process your request</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-danger-50/50 rounded-lg p-4">
                <p className="text-sm text-default-700 mb-3 font-medium">
                  You are about to ban this user from the platform:
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-default-500">Username:</span>
                    <span className="text-sm font-bold text-default-700">{selectedUser?.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-default-500">Email:</span>
                    <span className="text-sm font-bold text-default-700">{selectedUser?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-default-500">Role:</span>
                    <Chip color={getRoleColor(selectedUser?.role || '')} size="sm" variant="flat">
                      {selectedUser?.role}
                    </Chip>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Textarea
                  label="Ban Reason"
                  placeholder="Enter the reason for the ban (required)"
                  value={banFormData.reason}
                  onChange={(e) => setBanFormData(prev => ({ ...prev, reason: e.target.value }))}
                  classNames={{
                    inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
                  }}
                  isRequired
                  minRows={3}
                />
                <Input
                  label="Duration (in hours)"
                  placeholder="Enter duration in hours"
                  type="number"
                  value={String(banFormData.durationInHours)}
                  onChange={(e) => setBanFormData(prev => ({ ...prev, durationInHours: Number(e.target.value) }))}
                  classNames={{
                    inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
                  }}
                  isRequired
                  description={`User will be banned for ${banFormData.durationInHours} hours (${Math.round(banFormData.durationInHours / 24 * 10) / 10} days)`}
                />
              </div>

              <div className="bg-warning-50/50 rounded-lg p-3">
                <p className="text-xs text-warning-700 flex items-start gap-2">
                  <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                  <span>
                    The user will be immediately logged out and unable to access the platform until the ban expires or is manually removed.
                  </span>
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onBanModalClose}
            isDisabled={isBanning}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            variant="flat"
            startContent={!isBanning && <FiAlertCircle />}
            onPress={handleSubmitBan}
            isLoading={isBanning}
            isDisabled={isBanning || !banFormData.reason.trim() || banFormData.durationInHours <= 0}
          >
            {isBanning ? 'Banning User...' : 'Confirm Ban'}
          </Button>
        </ModalFooter>
      </AnimatedModal>
    </div>
  );
};

export default UserManagement;
