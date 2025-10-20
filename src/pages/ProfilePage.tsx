import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../api/authApi.ts';
import { User } from '@/types';
import { Card, CardBody, CardHeader, Button, Chip, Avatar, Divider, Spinner } from '@heroui/react';
import { FiUser, FiMail, FiShield, FiLogOut, FiEdit, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<User | null>(user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Re-fetch user data on mount to ensure it's up to date
        setLoading(true);
        getCurrentUser()
            .then(currentUser => {
                setProfile(currentUser);
            })
            .catch(error => {
                console.error('Failed to fetch user profile:', error);
                toast.error('Failed to load profile');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    const getRoleColor = (role: string) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return 'danger';
            case 'ARTIST':
                return 'secondary';
            case 'STAFF':
                return 'warning';
            case 'CUSTOMER':
                return 'primary';
            default:
                return 'default';
        }
    };

    const getInitials = (username: string) => {
        return username?.substring(0, 2).toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Failed to load profile</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header Card */}
                <Card className="mb-6 bg-white/30 backdrop-blur-lg border-white/50 shadow-xl">
                    <CardBody className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar Section */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                                <Avatar
                                    name={getInitials(profile.username)}
                                    className="w-32 h-32 text-4xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative z-10"
                                    isBordered
                                    color="secondary"
                                />
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {profile.username}
                                    </h1>
                                    <Chip
                                        color={getRoleColor(profile.role)}
                                        variant="flat"
                                        startContent={<FiShield size={16} />}
                                        className="font-semibold"
                                    >
                                        {profile.role}
                                    </Chip>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                                    {profile.firstName && profile.lastName
                                        ? `${profile.firstName} ${profile.lastName}`
                                        : 'Welcome to your profile'}
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        startContent={<FiEdit />}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        color="danger"
                                        startContent={<FiLogOut />}
                                        onPress={handleLogout}
                                    >
                                        Log Out
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Personal Information Card */}
                    <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-xl">
                        <CardHeader className="pb-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FiUser className="text-indigo-600" />
                                Personal Information
                            </h2>
                        </CardHeader>
                        <Divider />
                        <CardBody className="space-y-4 pt-4">
                            {profile.firstName && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <FiUser className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {profile.firstName}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {profile.lastName && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <FiUser className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {profile.lastName}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                                    <FiUser className="text-pink-600 dark:text-pink-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {profile.username}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Contact & Account Card */}
                    <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-xl">
                        <CardHeader className="pb-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FiMail className="text-purple-600" />
                                Contact & Account
                            </h2>
                        </CardHeader>
                        <Divider />
                        <CardBody className="space-y-4 pt-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <FiMail className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <FiShield className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Role</p>
                                    <Chip
                                        color={getRoleColor(profile.role)}
                                        variant="flat"
                                        size="lg"
                                        className="mt-1"
                                    >
                                        {profile.role}
                                    </Chip>
                                </div>
                            </div>

                            {profile.id && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <FiCalendar className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            #{profile.id}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Account Stats Card (Optional - can be expanded based on role) */}
                <Card className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/50 shadow-xl">
                    <CardBody className="p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                Account Status
                            </h3>
                            <Chip color="success" variant="flat" size="lg" className="font-semibold">
                                Active & Verified
                            </Chip>
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                Your account is in good standing. Enjoy using our platform!
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;