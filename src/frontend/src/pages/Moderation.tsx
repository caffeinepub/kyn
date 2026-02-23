import { useIsCallerAdmin } from '../hooks/useQueries';
import ModerationQueue from '../components/ModerationQueue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';
import AuthGuard from '../components/AuthGuard';

export default function Moderation() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <AuthGuard>
        <div className="container max-w-4xl py-8">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the moderation interface. Only administrators can moderate posts.
            </AlertDescription>
          </Alert>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Moderation Dashboard</h1>
          <p className="text-muted-foreground">
            Review and moderate community posts. Approve posts to make them visible to all users, or reject posts that
            violate community guidelines.
          </p>
        </div>
        <ModerationQueue />
      </div>
    </AuthGuard>
  );
}
