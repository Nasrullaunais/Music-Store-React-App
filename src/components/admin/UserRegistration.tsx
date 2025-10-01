import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Tabs,
  Tab,
  Divider
} from '@heroui/react';
import { FiUser, FiUserPlus, FiMail, FiLock, FiUsers, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI, StaffRegistrationRequest, AdminRegistrationRequest } from '@/api/adminApi';

const UserRegistration = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [loading, setLoading] = useState(false);

  // Staff registration form state
  const [staffForm, setStaffForm] = useState<StaffRegistrationRequest>({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    position: ''
  });

  // Admin registration form state
  const [adminForm, setAdminForm] = useState<AdminRegistrationRequest>({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  });

  const resetStaffForm = () => {
    setStaffForm({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      position: ''
    });
  };

  const resetAdminForm = () => {
    setAdminForm({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: ''
    });
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffForm.username || !staffForm.password || !staffForm.email ||
        !staffForm.firstName || !staffForm.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await adminAPI.registerStaff(staffForm);
      toast.success(`Staff member ${result.username} registered successfully!`);
      resetStaffForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to register staff member';
      toast.error(errorMessage);
      console.error('Staff registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminForm.username || !adminForm.password || !adminForm.email ||
        !adminForm.firstName || !adminForm.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await adminAPI.registerAdmin(adminForm);
      toast.success(`Admin ${result.username} registered successfully!`);
      resetAdminForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to register admin';
      toast.error(errorMessage);
      console.error('Admin registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">User Registration</h2>
          <p className="text-default-600 mt-1">Register new staff members and administrators</p>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardBody>
          <Tabs
            aria-label="User Registration Types"
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
              key="staff"
              title={
                <div className="flex items-center space-x-2">
                  <FiUsers />
                  <span>Register Staff</span>
                </div>
              }
            >
              <div className="pt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FiUsers className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Staff Registration</h3>
                        <p className="text-sm text-default-600">
                          Create a new staff member account with support access
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="pt-6">
                    <form onSubmit={handleStaffSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          placeholder="Enter first name"
                          value={staffForm.firstName}
                          onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                          startContent={<FiUser className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                        <Input
                          label="Last Name"
                          placeholder="Enter last name"
                          value={staffForm.lastName}
                          onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                          startContent={<FiUser className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Username"
                          placeholder="Enter username"
                          value={staffForm.username}
                          onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                          startContent={<FiUserPlus className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="Enter email address"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                          startContent={<FiMail className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                      </div>

                      <Input
                        label="Password"
                        type="password"
                        placeholder="Enter secure password"
                        value={staffForm.password}
                        onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                        startContent={<FiLock className="text-default-400" />}
                        isRequired
                        variant="bordered"
                      />

                      <Input
                        label="Position"
                        placeholder="Enter job position (optional)"
                        value={staffForm.position}
                        onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value })}
                        startContent={<FiUser className="text-default-400" />}
                        variant="bordered"
                        description="Job title or role description"
                      />

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          color="primary"
                          isLoading={loading}
                          startContent={!loading && <FiUserPlus />}
                          className="flex-1"
                        >
                          {loading ? 'Registering...' : 'Register Staff Member'}
                        </Button>
                        <Button
                          type="button"
                          variant="flat"
                          onPress={resetStaffForm}
                          isDisabled={loading}
                        >
                          Clear Form
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            <Tab
              key="admin"
              title={
                <div className="flex items-center space-x-2">
                  <FiShield />
                  <span>Register Admin</span>
                </div>
              }
            >
              <div className="pt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-danger/10 rounded-lg">
                        <FiShield className="text-danger text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Admin Registration</h3>
                        <p className="text-sm text-default-600">
                          Create a new administrator account with full system access
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="pt-6">
                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          placeholder="Enter first name"
                          value={adminForm.firstName}
                          onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                          startContent={<FiUser className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                        <Input
                          label="Last Name"
                          placeholder="Enter last name"
                          value={adminForm.lastName}
                          onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                          startContent={<FiUser className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Username"
                          placeholder="Enter username"
                          value={adminForm.username}
                          onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                          startContent={<FiUserPlus className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="Enter email address"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                          startContent={<FiMail className="text-default-400" />}
                          isRequired
                          variant="bordered"
                        />
                      </div>

                      <Input
                        label="Password"
                        type="password"
                        placeholder="Enter secure password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        startContent={<FiLock className="text-default-400" />}
                        isRequired
                        variant="bordered"
                      />

                      <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-danger font-medium mb-2">
                          <FiShield />
                          <span>Admin Access Warning</span>
                        </div>
                        <p className="text-sm text-danger/80">
                          Admin accounts have full system access including user management, content moderation,
                          and system settings. Only create admin accounts for trusted personnel.
                        </p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          color="danger"
                          isLoading={loading}
                          startContent={!loading && <FiShield />}
                          className="flex-1"
                        >
                          {loading ? 'Registering...' : 'Register Administrator'}
                        </Button>
                        <Button
                          type="button"
                          variant="flat"
                          onPress={resetAdminForm}
                          isDisabled={loading}
                        >
                          Clear Form
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserRegistration;
