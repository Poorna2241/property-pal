import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Home, Heart, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const { user, profile, role, signOut, isAdmin, isSeller } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center glow-primary transition-transform group-hover:scale-105">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">PropMarket</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Properties
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </Button>
                </Link>

                {isSeller && (
                  <Link to="/seller">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 ml-2">
                      <Avatar className="w-7 h-7 ring-2 ring-primary/20">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs gradient-primary text-primary-foreground font-semibold">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm">{profile?.full_name || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass border-border/50">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{profile?.full_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{role} account</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/signin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
