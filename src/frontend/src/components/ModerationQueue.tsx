import { useState } from 'react';
import { useGetPostsByStatus } from '../hooks/useQueries';
import { PostStatus } from '../backend';
import ModerationPostCard from './ModerationPostCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ModerationQueue() {
  const [activeTab, setActiveTab] = useState<PostStatus>(PostStatus.pendingReview);

  const {
    data: pendingPosts,
    isLoading: pendingLoading,
    error: pendingError,
  } = useGetPostsByStatus(PostStatus.pendingReview);
  const { data: approvedPosts, isLoading: approvedLoading, error: approvedError } = useGetPostsByStatus(PostStatus.approved);
  const { data: rejectedPosts, isLoading: rejectedLoading, error: rejectedError } = useGetPostsByStatus(PostStatus.rejected);

  const renderPostList = (posts: any[] | undefined, isLoading: boolean, error: any, emptyMessage: string) => {
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
          <AlertDescription>Failed to load posts. Please try again later.</AlertDescription>
        </Alert>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <ModerationPostCard key={post.id.toString()} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PostStatus)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={PostStatus.pendingReview}>
            Pending ({pendingPosts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value={PostStatus.approved}>
            Approved ({approvedPosts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value={PostStatus.rejected}>
            Rejected ({rejectedPosts?.length || 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={PostStatus.pendingReview} className="mt-6">
          {renderPostList(pendingPosts, pendingLoading, pendingError, 'No posts pending review')}
        </TabsContent>
        <TabsContent value={PostStatus.approved} className="mt-6">
          {renderPostList(approvedPosts, approvedLoading, approvedError, 'No approved posts')}
        </TabsContent>
        <TabsContent value={PostStatus.rejected} className="mt-6">
          {renderPostList(rejectedPosts, rejectedLoading, rejectedError, 'No rejected posts')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
