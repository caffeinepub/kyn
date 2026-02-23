import { useUserProfile, useUserPosts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PostCard from './PostCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, MessageSquare, MapPin, Edit } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from '@tanstack/react-router';

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId);
  const { data: posts, isLoading: postsLoading, error: postsError } = useUserPosts(userId);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const isOwnProfile = identity?.getPrincipal().toString() === userId;

  if (profileLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>User not found or not registered yet.</AlertDescription>
      </Alert>
    );
  }

  const userIdShort = `${userId.slice(0, 8)}...${userId.slice(-6)}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">{userIdShort}</p>
              </div>
            </div>
            {isOwnProfile && (
              <Button variant="outline" size="sm" onClick={() => navigate({ to: '/profile/edit' })}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{profile.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{posts?.length || 0} posts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {postsError ? (
          <Alert variant="destructive">
            <AlertDescription>Failed to load posts.</AlertDescription>
          </Alert>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id.toString()} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
