import { useCommunityFeed, useIsCallerAdmin } from '../hooks/useQueries';
import PostCard from './PostCard';
import { Loader2, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function CommunityFeed() {
  const { data: posts, isLoading, error } = useCommunityFeed();
  const { data: isAdmin } = useIsCallerAdmin();
  const [showAllPosts, setShowAllPosts] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load community feed. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground">Be the first to share something with your community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
          <Switch id="show-all" checked={showAllPosts} onCheckedChange={setShowAllPosts} />
          <Label htmlFor="show-all" className="cursor-pointer">
            Show post status (Moderator view)
          </Label>
        </div>
      )}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id.toString()} post={post} showStatus={isAdmin && showAllPosts} />
        ))}
      </div>
    </div>
  );
}
