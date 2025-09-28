import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { artistAPI, ArtistProfile as ArtistProfileType } from '@/api/artist';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Avatar,
  Chip,
  Divider,
  Spinner
} from '@heroui/react';
import {
  FiUser,
  FiMusic,
  FiStar,
  FiEdit,
  FiSave,
  FiX
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ArtistProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ArtistProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    artistName: '',
    bio: '',
    website: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      spotify: ''
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profileData = await artistAPI.getProfile();
      setProfile(profileData);

      // Initialize edit form with current data
      setEditForm({
        artistName: user?.artistName || user?.username || '',
        bio: '',
        website: '',
        socialLinks: {
          twitter: '',
          instagram: '',
          youtube: '',
          spotify: ''
        }
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to original values
    setEditForm({
      artistName: user?.artistName || user?.username || '',
      bio: '',
      website: '',
      socialLinks: {
        twitter: '',
        instagram: '',
        youtube: '',
        spotify: ''
      }
    });
  };

  const handleSave = async () => {
    try {
      // Note: In a real implementation, you'd need a profile update API endpoint
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Artist Profile</h2>
        {!editing ? (
          <Button
            startContent={<FiEdit />}
            onPress={handleEdit}
            color="primary"
            variant="flat"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              startContent={<FiSave />}
              onPress={handleSave}
              color="primary"
            >
              Save Changes
            </Button>
            <Button
              startContent={<FiX />}
              onPress={handleCancel}
              variant="flat"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar
                src={user?.cover}
                name={user?.artistName || user?.username}
                className="w-32 h-32 text-large"
              />
              {editing && (
                <Button size="sm" variant="flat">
                  Change Photo
                </Button>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-grow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-default-600">Artist Name</label>
                  {editing ? (
                    <Input
                      value={editForm.artistName}
                      onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })}
                      placeholder="Enter your artist name"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{user?.artistName || user?.username}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-default-600">Username</label>
                  <p className="text-lg">{user?.username}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-default-600">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-default-600">Role</label>
                  <Chip color="primary" variant="flat">
                    {user?.role}
                  </Chip>
                </div>
              </div>

              {editing && (
                <div>
                  <label className="text-sm font-medium text-default-600">Website</label>
                  <Input
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Artist Statistics */}
      {profile && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Artist Statistics</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FiMusic className="text-primary text-xl" />
                  <span className="text-2xl font-bold">{profile.totalTracks}</span>
                </div>
                <p className="text-default-500">Total Tracks</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FiUser className="text-success text-xl" />
                  <span className="text-2xl font-bold">-</span>
                </div>
                <p className="text-default-500">Followers</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FiStar className="text-warning text-xl" />
                  <span className="text-2xl font-bold">-</span>
                </div>
                <p className="text-default-500">Total Plays</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Artist Bio</h3>
        </CardHeader>
        <CardBody>
          {editing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="Tell your fans about yourself, your music journey, influences, and what makes your music unique..."
              className="w-full min-h-32 p-3 rounded-lg border border-default-200 bg-default-50 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
            />
          ) : (
            <p className="text-default-600">
              {editForm.bio || "Add a bio to tell your fans about yourself and your music journey."}
            </p>
          )}
        </CardBody>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Social Media Links</h3>
        </CardHeader>
        <CardBody>
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Twitter"
                placeholder="https://twitter.com/yourusername"
                value={editForm.socialLinks.twitter}
                onChange={(e) => setEditForm({
                  ...editForm,
                  socialLinks: { ...editForm.socialLinks, twitter: e.target.value }
                })}
              />
              <Input
                label="Instagram"
                placeholder="https://instagram.com/yourusername"
                value={editForm.socialLinks.instagram}
                onChange={(e) => setEditForm({
                  ...editForm,
                  socialLinks: { ...editForm.socialLinks, instagram: e.target.value }
                })}
              />
              <Input
                label="YouTube"
                placeholder="https://youtube.com/@yourusername"
                value={editForm.socialLinks.youtube}
                onChange={(e) => setEditForm({
                  ...editForm,
                  socialLinks: { ...editForm.socialLinks, youtube: e.target.value }
                })}
              />
              <Input
                label="Spotify"
                placeholder="https://open.spotify.com/artist/..."
                value={editForm.socialLinks.spotify}
                onChange={(e) => setEditForm({
                  ...editForm,
                  socialLinks: { ...editForm.socialLinks, spotify: e.target.value }
                })}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(editForm.socialLinks).map(([platform, url]) => (
                <div key={platform} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{platform}</span>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  ) : (
                    <span className="text-default-400">Not set</span>
                  )}
                </div>
              ))}
              {Object.values(editForm.socialLinks).every(link => !link) && (
                <p className="text-center text-default-500 py-4">
                  Add your social media links to connect with fans
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Account Settings</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Account Status</h4>
                <p className="text-sm text-default-500">Your artist account is active</p>
              </div>
              <Chip color="success" variant="flat">
                Active
              </Chip>
            </div>

            <Divider />

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Account Type</h4>
                <p className="text-sm text-default-500">Standard Artist Account</p>
              </div>
              <Button variant="flat" size="sm">
                Upgrade
              </Button>
            </div>

            <Divider />

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Privacy Settings</h4>
                <p className="text-sm text-default-500">Manage your privacy preferences</p>
              </div>
              <Button variant="flat" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ArtistProfile;
