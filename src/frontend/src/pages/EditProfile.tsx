import { useInternetIdentity } from '../hooks/useInternetIdentity';
import EditProfileForm from '../components/EditProfileForm';
import AuthGuard from '../components/AuthGuard';

export default function EditProfile() {
  const { identity } = useInternetIdentity();

  return (
    <AuthGuard>
      <div className="container max-w-2xl py-8">
        <EditProfileForm />
      </div>
    </AuthGuard>
  );
}
