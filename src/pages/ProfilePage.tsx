import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../api/authApi.ts';
import { User } from '@/types';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<User | null>(user);

    useEffect(() => {
        // This part is optional but good practice: re-fetch user data on mount
        // to ensure it's up to date.
        getCurrentUser()
            .then(currentUser => {
                setProfile(currentUser);
            })
            .catch(error => {
                console.error('Failed to fetch user profile:', error);
            });
    }, []);

    if (!profile) {
        return <div className="flex justify-center align-middle">Loading profile...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
                <div className="space-y-4">
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    {profile.firstName && <p><strong>First Name:</strong> {profile.firstName}</p>}
                    {profile.lastName && <p><strong>Last Name:</strong> {profile.lastName}</p>}
                </div>
                <div className="mt-8 text-center">
                    <button
                        onClick={logout}
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;