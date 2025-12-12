import { Navbar } from '@/components/layout/Navbar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const { data: favorites, isLoading } = useFavorites();

  const properties = favorites?.map(f => f.properties).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Properties you've saved for later
          </p>
        </div>

        <PropertyGrid properties={properties} isLoading={isLoading} />
      </main>
    </div>
  );
}
