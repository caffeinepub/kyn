import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CreatePostForm from '../components/CreatePostForm';
import RegisterForm from '../components/RegisterForm';
import AuthGuard from '../components/AuthGuard';
import { Loader2 } from 'lucide-react';

export default function CreatePost() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !isLoading && isFetched && userProfile === null;

  return (
    <AuthGuard>
      <div className="container max-w-2xl py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : showProfileSetup ? (
          <RegisterForm />
        ) : (
          <CreatePostForm />
        )}
      </div>
    </AuthGuard>
  );
}
