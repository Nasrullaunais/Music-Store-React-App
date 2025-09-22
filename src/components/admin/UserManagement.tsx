import { useState, useEffect } from 'react';
import { adminAPI, AdminUser, CreateUserRequest } from '@/api/admin';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
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
  useDisclosure
} from '@heroui/react';
import {
  FiPlus,
  FiEdit2,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,
  FiUsers
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    password: '',
    email: '',
    role: 'CUSTOMER',
    firstName: '',
    lastName: ''
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
      <Card>
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
            />
            <Select
              placeholder="Filter by role"
              selectedKeys={roleFilter ? [roleFilter] : []}
              onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string || '')}
              className="max-w-xs"
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
      <Card>
        <CardBody>
          <Table
            aria-label="Users table"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
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
              {users.map((user, index) => (
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
                    <Chip color={getStatusColor(user.enabled)} variant="flat" size="sm">
                      {user.enabled ? 'Active' : 'Disabled'}
                    </Chip>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        size="2xl"
      >
        <ModalContent>
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
              />
              <Input
                label="Email"
                placeholder="Enter email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                label="Password"
                placeholder={isCreating ? "Enter password" : "Leave blank to keep current"}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <Select
                label="Role"
                selectedKeys={[formData.role]}
                onSelectionChange={(keys) => setFormData(prev => ({ ...prev, role: Array.from(keys)[0] as any }))}
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
              />
              <Input
                label="Last Name"
                placeholder="Enter last name (optional)"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
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
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;
