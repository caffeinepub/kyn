import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { Post } from '../backend';
import { PostStatus } from '../backend';

interface PostCardProps {
  post: Post;
  showStatus?: boolean;
}

export default function PostCard({ post, showStatus = false }: PostCardProps) {
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

  const authorId = post.author.toString();
  const authorShort = `${authorId.slice(0, 5)}...${authorId.slice(-3)}`;

  return (
    <Card className="hover:shadow-md transition-shadow relative">
      {showStatus && (
        <div className="absolute top-4 right-4">
          {getStatusBadge(post.status)}
        </div>
      )}
      <CardHeader className="pb-3">
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
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap break-words">{post.content}</p>
      </CardContent>
    </Card>
  );
}
