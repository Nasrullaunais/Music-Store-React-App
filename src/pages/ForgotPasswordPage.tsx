import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Divider } from '@heroui/react';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { forgotPassword } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email);
            setEmailSent(true);
            toast.success('Password reset instructions sent to your email');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
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

                <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-xl p-8">
                    <CardHeader className="flex flex-col items-center gap-3 p-6 pb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-full">
                                <FiMail className="text-white text-3xl" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Forgot Password?
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                {emailSent
                                    ? "Check your email for reset instructions"
                                    : "No worries, we'll send you reset instructions"}
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-6">
                        {!emailSent ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    type="email"
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    startContent={<FiMail className="text-gray-400" />}
                                    variant="bordered"
                                    size="lg"
                                    isRequired
                                    classNames={{
                                        inputWrapper: "backdrop-blur-sm border-white/50"
                                    }}
                                />

                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
                                    isLoading={loading}
                                    startContent={!loading && <FiMail />}
                                >
                                    Send Reset Link
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full">
                                            <FiCheck className="text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                                                Email Sent Successfully!
                                            </h3>
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                We've sent password reset instructions to <strong>{email}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                        Next Steps:
                                    </h4>
                                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                        <li>Check your email inbox</li>
                                        <li>Click the password reset link</li>
                                        <li>Create your new password</li>
                                        <li>Log in with your new password</li>
                                    </ol>
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Didn't receive the email? Check your spam folder or try again in a few minutes.
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        variant="flat"
                                        color="primary"
                                        className="flex-1"
                                        onPress={() => {
                                            setEmailSent(false);
                                            setEmail('');
                                        }}
                                    >
                                        Try Another Email
                                    </Button>
                                    <Button
                                        color="primary"
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                                        onPress={() => navigate('/auth')}
                                    >
                                        Back to Login
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Additional Help */}
                <Card className="mt-4 bg-white/20 backdrop-blur-lg border-white/40">
                    <CardBody className="p-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Remember your password?{' '}
                            <button
                                onClick={() => navigate('/auth')}
                                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                            >
                                Sign in here
                            </button>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
