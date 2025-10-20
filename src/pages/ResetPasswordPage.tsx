import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Divider, Spinner } from '@heroui/react';
import { FiLock, FiArrowLeft, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { resetPassword, validateResetToken } from '@/api/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link');
            navigate('/forgot-password');
            return;
        }

        // Validate token on mount
        const checkToken = async () => {
            setValidating(true);
            try {
                const result = await validateResetToken(token);
                setTokenValid(result.valid);
                if (!result.valid) {
                    toast.error(result.message || 'Invalid or expired reset link');
                }
            } catch (error) {
                setTokenValid(false);
                toast.error('Failed to validate reset link');
            } finally {
                setValidating(false);
            }
        };

        checkToken();
    }, [token, navigate]);

    const validatePassword = (password: string): string | null => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!token) {
            toast.error('Invalid reset token');
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token, newPassword);
            setPasswordReset(true);
            toast.success('Password reset successfully!');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/auth');
            }, 3000);
        } catch (error: any) {
            toast.error(error.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
                <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-xl p-8">
                    <CardBody className="flex flex-col items-center gap-4">
                        <Spinner size="lg" color="primary" />
                        <p className="text-gray-600 dark:text-gray-300">Validating reset link...</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-xl">
                        <CardBody className="p-8 text-center space-y-4">
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto">
                                <FiAlertCircle className="text-red-600 dark:text-red-400 text-4xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Invalid Reset Link
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                This password reset link is invalid or has expired. Reset links are only valid for 24 hours.
                            </p>
                            <div className="flex flex-col gap-2 pt-4">
                                <Button
                                    color="primary"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                    onPress={() => navigate('/forgot-password')}
                                >
                                    Request New Reset Link
                                </Button>
                                <Button
                                    variant="light"
                                    size="lg"
                                    onPress={() => navigate('/auth')}
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Button
                    variant="light"
                    startContent={<FiArrowLeft />}
                    onPress={() => navigate('/auth')}
                    className="mb-4"
                >
                    Back to Login
                </Button>

                <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-xl">
                    <CardHeader className="flex flex-col items-center gap-3 p-6 pb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-full">
                                <FiLock className="text-white text-3xl" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {passwordReset ? 'Password Reset!' : 'Reset Password'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                {passwordReset
                                    ? "You can now log in with your new password"
                                    : "Enter your new password below"}
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-6">
                        {!passwordReset ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    label="New Password"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    startContent={<FiLock className="text-gray-400" />}
                                    endContent={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="text-gray-400" />
                                            ) : (
                                                <FiEye className="text-gray-400" />
                                            )}
                                        </button>
                                    }
                                    variant="bordered"
                                    size="lg"
                                    isRequired
                                    classNames={{
                                        inputWrapper: "backdrop-blur-sm border-white/50"
                                    }}
                                />

                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    label="Confirm Password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    startContent={<FiLock className="text-gray-400" />}
                                    endContent={
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="focus:outline-none"
                                        >
                                            {showConfirmPassword ? (
                                                <FiEyeOff className="text-gray-400" />
                                            ) : (
                                                <FiEye className="text-gray-400" />
                                            )}
                                        </button>
                                    }
                                    variant="bordered"
                                    size="lg"
                                    isRequired
                                    classNames={{
                                        inputWrapper: "backdrop-blur-sm border-white/50"
                                    }}
                                />

                                {/* Password Requirements */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <p className="text-xs text-blue-800 dark:text-blue-200 font-semibold mb-1">
                                        Password Requirements:
                                    </p>
                                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <FiCheck className={newPassword.length >= 6 ? "text-green-600" : "text-gray-400"} />
                                            At least 6 characters
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FiCheck className={newPassword === confirmPassword && newPassword ? "text-green-600" : "text-gray-400"} />
                                            Passwords match
                                        </li>
                                    </ul>
                                </div>

                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
                                    isLoading={loading}
                                    startContent={!loading && <FiLock />}
                                >
                                    Reset Password
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full">
                                            <FiCheck className="text-green-600 dark:text-green-400 text-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                                                Password Reset Successful!
                                            </h3>
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                Your password has been successfully reset. You can now log in with your new password.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    color="primary"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                    onPress={() => navigate('/auth')}
                                >
                                    Go to Login
                                </Button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Redirecting to login page in 3 seconds...
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Security Note */}
                <Card className="mt-4 bg-white/20 backdrop-blur-lg border-white/40">
                    <CardBody className="p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                            <FiLock className="inline mr-1" />
                            For your security, this reset link can only be used once and expires after 24 hours.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

