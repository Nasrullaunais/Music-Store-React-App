import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Tabs,
  Tab,
  Divider,
  Progress
} from '@heroui/react';
import { FiUser, FiUserPlus, FiMail, FiLock, FiUsers, FiShield, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI, StaffRegistrationRequest, AdminRegistrationRequest } from '@/api/adminApi';

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

const UserRegistration = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [loading, setLoading] = useState(false);

  // Validation states
  const [staffErrors, setStaffErrors] = useState<ValidationErrors>({});
  const [adminErrors, setAdminErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): "danger" | "warning" | "success" => {
    if (strength < 40) return 'danger';
    if (strength < 70) return 'warning';
    return 'success';
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const validateStaffForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!staffForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!staffForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!validateUsername(staffForm.username)) {
      errors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    }

    if (!validateEmail(staffForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (staffForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    setStaffErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAdminForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!adminForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!adminForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!validateUsername(adminForm.username)) {
      errors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    }

    if (!validateEmail(adminForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (adminForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    setAdminErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetStaffForm = () => {
    setStaffForm({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      position: ''
    });
    setStaffErrors({});
    setPasswordStrength(0);
  };

  const resetAdminForm = () => {
    setAdminForm({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: ''
    });
    setAdminErrors({});
    setPasswordStrength(0);
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStaffForm()) {
      toast.error('Please fix the validation errors');
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

    if (!validateAdminForm()) {
      toast.error('Please fix the validation errors');
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            User Registration
          </h2>
          <p className="text-default-600 mt-2">Create new staff members and administrators with secure credentials</p>
        </div>
      </div>

      <Card className="bg-white/40 backdrop-blur-md border-white/50 shadow-xl">
        <CardBody className="p-6">
          <Tabs
            aria-label="User Registration Types"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            classNames={{
              tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider mb-6",
              cursor: "w-full bg-gradient-to-r from-primary to-secondary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary font-semibold"
            }}
          >
            <Tab
              key="staff"
              title={
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-xl" />
                  <span>Register Staff</span>
                </div>
              }
            >
              <div className="pt-6">
                <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-lg">
                  <CardHeader className="pb-3 border-b border-primary/10">
                    <div className="flex items-center gap-4 w-full">
                      <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-xl shadow-lg">
                        <FiUsers className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary">Staff Registration</h3>
                        <p className="text-sm text-default-600 mt-1">
                          Create a new staff member account with support access
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-6">
                    <form onSubmit={handleStaffSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="First Name"
                          placeholder="Enter first name"
                          value={staffForm.firstName}
                          onChange={(e) => {
                            setStaffForm({ ...staffForm, firstName: e.target.value });
                            if (staffErrors.firstName) {
                              setStaffErrors({ ...staffErrors, firstName: undefined });
                            }
                          }}
                          startContent={<FiUser className="text-primary" />}
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-primary transition-colors"
                          }}
                          isInvalid={!!staffErrors.firstName}
                          errorMessage={staffErrors.firstName}
                        />
                        <Input
                          label="Last Name"
                          placeholder="Enter last name"
                          value={staffForm.lastName}
                          onChange={(e) => {
                            setStaffForm({ ...staffForm, lastName: e.target.value });
                            if (staffErrors.lastName) {
                              setStaffErrors({ ...staffErrors, lastName: undefined });
                            }
                          }}
                          startContent={<FiUser className="text-primary" />}
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-primary transition-colors"
                          }}
                          isInvalid={!!staffErrors.lastName}
                          errorMessage={staffErrors.lastName}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Username"
                          placeholder="Enter username"
                          value={staffForm.username}
                          onChange={(e) => {
                            setStaffForm({ ...staffForm, username: e.target.value });
                            if (staffErrors.username) {
                              setStaffErrors({ ...staffErrors, username: undefined });
                            }
                          }}
                          startContent={<FiUserPlus className="text-primary" />}
                          endContent={
                            staffForm.username && validateUsername(staffForm.username) ? (
                              <FiCheckCircle className="text-success" />
                            ) : staffForm.username ? (
                              <FiAlertCircle className="text-danger" />
                            ) : null
                          }
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-primary transition-colors"
                          }}
                          description="3-20 characters, letters, numbers, and underscores only"
                          isInvalid={!!staffErrors.username}
                          errorMessage={staffErrors.username}
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="staff@example.com"
                          value={staffForm.email}
                          onChange={(e) => {
                            setStaffForm({ ...staffForm, email: e.target.value });
                            if (staffErrors.email) {
                              setStaffErrors({ ...staffErrors, email: undefined });
                            }
                          }}
                          startContent={<FiMail className="text-primary" />}
                          endContent={
                            staffForm.email && validateEmail(staffForm.email) ? (
                              <FiCheckCircle className="text-success" />
                            ) : staffForm.email ? (
                              <FiAlertCircle className="text-danger" />
                            ) : null
                          }
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-primary transition-colors"
                          }}
                          isInvalid={!!staffErrors.email}
                          errorMessage={staffErrors.email}
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          label="Password"
                          type="password"
                          placeholder="Enter secure password"
                          value={staffForm.password}
                          onChange={(e) => {
                            setStaffForm({ ...staffForm, password: e.target.value });
                            setPasswordStrength(calculatePasswordStrength(e.target.value));
                            if (staffErrors.password) {
                              setStaffErrors({ ...staffErrors, password: undefined });
                            }
                          }}
                          startContent={<FiLock className="text-primary" />}
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-primary transition-colors"
                          }}
                          description="Minimum 8 characters, include uppercase, lowercase, numbers, and symbols"
                          isInvalid={!!staffErrors.password}
                          errorMessage={staffErrors.password}
                        />
                        {staffForm.password && (
                          <div className="space-y-1 px-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-default-600">Password Strength:</span>
                              <span className={`font-semibold ${
                                passwordStrength < 40 ? 'text-danger' : 
                                passwordStrength < 70 ? 'text-warning' : 'text-success'
                              }`}>
                                {getPasswordStrengthLabel(passwordStrength)}
                              </span>
                            </div>
                            <Progress
                              value={passwordStrength}
                              color={getPasswordStrengthColor(passwordStrength)}
                              size="sm"
                              className="max-w-full"
                            />
                          </div>
                        )}
                      </div>

                      <Input
                        label="Position (Optional)"
                        placeholder="e.g., Support Agent, Customer Service"
                        value={staffForm.position}
                        onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value })}
                        startContent={<FiUser className="text-primary" />}
                        variant="bordered"
                        classNames={{
                          input: "text-base",
                          inputWrapper: "border-default-300 hover:border-primary transition-colors"
                        }}
                        description="Job title or role description"
                      />

                      <Divider className="my-4" />

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          color="primary"
                          size="lg"
                          isLoading={loading}
                          startContent={!loading && <FiUserPlus className="text-lg" />}
                          className="flex-1 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                        >
                          {loading ? 'Registering...' : 'Register Staff Member'}
                        </Button>
                        <Button
                          type="button"
                          variant="flat"
                          size="lg"
                          onPress={resetStaffForm}
                          isDisabled={loading}
                          className="min-w-[120px]"
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
                  <FiShield className="text-xl" />
                  <span>Register Admin</span>
                </div>
              }
            >
              <div className="pt-6">
                <Card className="bg-gradient-to-br from-danger/5 to-transparent border-danger/20 shadow-lg">
                  <CardHeader className="pb-3 border-b border-danger/10">
                    <div className="flex items-center gap-4 w-full">
                      <div className="p-3 bg-gradient-to-br from-danger to-danger/60 rounded-xl shadow-lg">
                        <FiShield className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-danger">Admin Registration</h3>
                        <p className="text-sm text-default-600 mt-1">
                          Create a new administrator account with full system access
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-6">
                    <form onSubmit={handleAdminSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="First Name"
                          placeholder="Enter first name"
                          value={adminForm.firstName}
                          onChange={(e) => {
                            setAdminForm({ ...adminForm, firstName: e.target.value });
                            if (adminErrors.firstName) {
                              setAdminErrors({ ...adminErrors, firstName: undefined });
                            }
                          }}
                          startContent={<FiUser className="text-danger" />}
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-danger transition-colors"
                          }}
                          isInvalid={!!adminErrors.firstName}
                          errorMessage={adminErrors.firstName}
                        />
                        <Input
                          label="Last Name"
                          placeholder="Enter last name"
                          value={adminForm.lastName}
                          onChange={(e) => {
                            setAdminForm({ ...adminForm, lastName: e.target.value });
                            if (adminErrors.lastName) {
                              setAdminErrors({ ...adminErrors, lastName: undefined });
                            }
                          }}
                          startContent={<FiUser className="text-danger" />}
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-danger transition-colors"
                          }}
                          isInvalid={!!adminErrors.lastName}
                          errorMessage={adminErrors.lastName}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Username"
                          placeholder="Enter username"
                          value={adminForm.username}
                          onChange={(e) => {
                            setAdminForm({ ...adminForm, username: e.target.value });
                            if (adminErrors.username) {
                              setAdminErrors({ ...adminErrors, username: undefined });
                            }
                          }}
                          startContent={<FiUserPlus className="text-danger" />}
                          endContent={
                            adminForm.username && validateUsername(adminForm.username) ? (
                              <FiCheckCircle className="text-success" />
                            ) : adminForm.username ? (
                              <FiAlertCircle className="text-danger" />
                            ) : null
                          }
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-danger transition-colors"
                          }}
                          description="3-20 characters, letters, numbers, and underscores only"
                          isInvalid={!!adminErrors.username}
                          errorMessage={adminErrors.username}
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="admin@example.com"
                          value={adminForm.email}
                          onChange={(e) => {
                            setAdminForm({ ...adminForm, email: e.target.value });
                            if (adminErrors.email) {
                              setAdminErrors({ ...adminErrors, email: undefined });
                            }
                          }}
                          startContent={<FiMail className="text-danger" />}
                          endContent={
                            adminForm.email && validateEmail(adminForm.email) ? (
                              <FiCheckCircle className="text-success" />
                            ) : adminForm.email ? (
                              <FiAlertCircle className="text-danger" />
                            ) : null
                          }
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-danger transition-colors"
                          }}
                          isInvalid={!!adminErrors.email}
                          errorMessage={adminErrors.email}
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          label="Password"
                          type="password"
                          placeholder="Enter secure password"
                          value={adminForm.password}
                          onChange={(e) => {
                            setAdminForm({ ...adminForm, password: e.target.value });
                            setPasswordStrength(calculatePasswordStrength(e.target.value));
                            if (adminErrors.password) {
                              setAdminErrors({ ...adminErrors, password: undefined });
                            }
                          }}
                          startContent={<FiLock className="text-danger" />}
                          isRequired
                          variant="bordered"
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-default-300 hover:border-danger transition-colors"
                          }}
                          description="Minimum 8 characters, include uppercase, lowercase, numbers, and symbols"
                          isInvalid={!!adminErrors.password}
                          errorMessage={adminErrors.password}
                        />
                        {adminForm.password && (
                          <div className="space-y-1 px-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-default-600">Password Strength:</span>
                              <span className={`font-semibold ${
                                passwordStrength < 40 ? 'text-danger' : 
                                passwordStrength < 70 ? 'text-warning' : 'text-success'
                              }`}>
                                {getPasswordStrengthLabel(passwordStrength)}
                              </span>
                            </div>
                            <Progress
                              value={passwordStrength}
                              color={getPasswordStrengthColor(passwordStrength)}
                              size="sm"
                              className="max-w-full"
                            />
                          </div>
                        )}
                      </div>

                      <Card className="bg-danger/10 border-danger/30 shadow-inner">
                        <CardBody className="p-4">
                          <div className="flex items-start gap-3">
                            <FiShield className="text-danger text-2xl flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-danger mb-2 flex items-center gap-2">
                                Admin Access Warning
                              </h4>
                              <p className="text-sm text-danger/90 leading-relaxed">
                                Admin accounts have <strong>full system access</strong> including user management, content moderation,
                                system settings, and sensitive data. Only create admin accounts for <strong>trusted personnel</strong> with proper authorization.
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>

                      <Divider className="my-4" />

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          color="danger"
                          size="lg"
                          isLoading={loading}
                          startContent={!loading && <FiShield className="text-lg" />}
                          className="flex-1 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                        >
                          {loading ? 'Registering...' : 'Register Administrator'}
                        </Button>
                        <Button
                          type="button"
                          variant="flat"
                          size="lg"
                          onPress={resetAdminForm}
                          isDisabled={loading}
                          className="min-w-[120px]"
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
