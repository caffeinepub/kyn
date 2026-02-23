import HeroSection from '../components/HeroSection';
import CommunityFeed from '../components/CommunityFeed';

export default function Feed() {
  return (
    <div>
      <HeroSection />
      <div className="container py-8 max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Community Feed</h2>
          <p className="text-muted-foreground">See what your neighbors are sharing</p>
        </div>
        <CommunityFeed />
      </div>
    </div>
  );
}
