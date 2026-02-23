import { useState, useEffect } from 'react';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export default function EditProfileForm() {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const saveProfile = useSaveCallerUserProfile();
  const { data: currentProfile, isLoading } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentProfile) {
      setUsername(currentProfile.username);
      setLocation(currentProfile.location);
    }
  }, [currentProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!location.trim()) {
      toast.error('Please enter your location');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        id: identity.getPrincipal(),
        username: username.trim(),
        location: location.trim(),
      });
      toast.success('Profile updated successfully!');
      navigate({ to: '/profile/$userId', params: { userId: identity.getPrincipal().toString() } });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
        <CardDescription>Update your username and location</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter your city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={50}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={saveProfile.isPending || !username.trim() || !location.trim()}
              className="flex-1"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate({ to: '/profile/$userId', params: { userId: identity?.getPrincipal().toString() || '' } })
              }
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
