import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { PenSquare } from 'lucide-react';

export default function HeroSection() {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              Community-Powered Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Know Your <span className="text-primary">Neighbor</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Share information, build connections, and strengthen your community. A free speech platform where
              neighbors connect and communicate openly.
            </p>
            <div className="flex flex-wrap gap-3">
              {identity ? (
                <Button size="lg" asChild>
                  <Link to="/create">
                    <PenSquare className="mr-2 h-5 w-5" />
                    Share Your Story
                  </Link>
                </Button>
              ) : (
                <Button size="lg" onClick={login} disabled={isLoggingIn}>
                  {isLoggingIn ? 'Connecting...' : 'Get Started'}
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="Community Connection"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
