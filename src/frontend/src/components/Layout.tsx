import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Home, PenSquare, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (identity) {
      navigate({ to: '/profile/$userId', params: { userId: identity.getPrincipal().toString() } });
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    clear();
    navigate({ to: '/' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/kyn-logo.dim_256x256.png" alt="KYN Logo" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">KYN</span>
              <span className="text-xs text-muted-foreground -mt-1">Know Your Neighbor</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            {identity && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/create">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Create Post
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                {isAdmin && (
                  <Button variant="ghost" asChild>
                    <Link to="/moderation">
                      <Shield className="mr-2 h-4 w-4" />
                      Moderation
                    </Link>
                  </Button>
                )}
              </>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {identity ? (
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button onClick={login} disabled={isLoggingIn} size="sm">
                {isLoggingIn ? 'Connecting...' : 'Login'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container py-4 flex flex-col space-y-2">
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              {identity && (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/create" onClick={() => setMobileMenuOpen(false)}>
                      <PenSquare className="mr-2 h-4 w-4" />
                      Create Post
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleProfileClick} className="justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" asChild className="justify-start">
                      <Link to="/moderation" onClick={() => setMobileMenuOpen(false)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Moderation
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
              {!identity && (
                <Button onClick={login} disabled={isLoggingIn}>
                  {isLoggingIn ? 'Connecting...' : 'Login'}
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <img src="/assets/generated/kyn-logo.dim_256x256.png" alt="KYN" className="h-8 w-8" />
                <span className="font-bold text-lg">KYN</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building stronger communities through open communication and neighborhood connections.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <div className="flex space-x-3">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-sm text-muted-foreground">
                KYN is a free speech platform for sharing community information and connecting with your neighbors.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} KYN. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'kyn-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
