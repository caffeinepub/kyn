import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const saveProfile = useSaveCallerUserProfile();
  const { identity } = useInternetIdentity();

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
      toast.error('You must be logged in to register');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        id: identity.getPrincipal(),
        username: username.trim(),
        location: location.trim(),
      });
      setUsername('');
      setLocation('');
      toast.success('Registration successful! You can now create posts.');
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Failed to register. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Choose a username and location to start sharing with your community</CardDescription>
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
          <Button
            type="submit"
            disabled={saveProfile.isPending || !username.trim() || !location.trim()}
            className="w-full"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
