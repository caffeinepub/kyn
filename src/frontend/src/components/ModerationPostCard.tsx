import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Check, X, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useApprovePost, useRejectPost } from '../hooks/useQueries';
import type { Post } from '../backend';
import { PostStatus } from '../backend';
import { toast } from 'sonner';

interface ModerationPostCardProps {
  post: Post;
}

export default function ModerationPostCard({ post }: ModerationPostCardProps) {
  const approvePost = useApprovePost();
  const rejectPost = useRejectPost();

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case PostStatus.pendingReview:
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
            Pending Review
          </Badge>
        );
      case PostStatus.approved:
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
            Approved
          </Badge>
        );
      case PostStatus.rejected:
        return (
          <Badge variant="destructive" className="bg-red-500/10 text-red-700 dark:text-red-400">
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleApprove = async () => {
    try {
      await approvePost.mutateAsync(post.id);
      toast.success('Post approved successfully');
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error('Failed to approve post');
    }
  };

  const handleReject = async () => {
    try {
      await rejectPost.mutateAsync(post.id);
      toast.success('Post rejected successfully');
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast.error('Failed to reject post');
    }
  };

  const authorId = post.author.toString();
  const authorShort = `${authorId.slice(0, 5)}...${authorId.slice(-3)}`;
  const isProcessing = approvePost.isPending || rejectPost.isPending;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Button variant="link" asChild className="p-0 h-auto font-semibold text-foreground hover:text-primary">
                <Link to="/profile/$userId" params={{ userId: authorId }}>
                  {authorShort}
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</p>
            </div>
          </div>
          {getStatusBadge(post.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground whitespace-pre-wrap break-words">{post.content}</p>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleApprove}
            disabled={isProcessing || post.status === PostStatus.approved}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {approvePost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReject}
            disabled={isProcessing || post.status === PostStatus.rejected}
            className="flex-1"
          >
            {rejectPost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Reject
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
