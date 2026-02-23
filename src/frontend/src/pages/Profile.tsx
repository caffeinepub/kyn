import { useParams } from '@tanstack/react-router';
import UserProfile from '../components/UserProfile';

export default function Profile() {
  const { userId } = useParams({ from: '/profile/$userId' });

  return (
    <div className="container py-8 max-w-3xl">
      <UserProfile userId={userId} />
    </div>
  );
}
