import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';
import { Building2, Sparkles } from 'lucide-react';

const Index = () => {
  const [filters, setFilters] = useState({});
  const { data: properties, isLoading } = useProperties({ ...filters, status: 'active' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-dark opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(38_92%_50%/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(38_92%_50%/0.05),transparent_40%)]" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Premium Real Estate Listings</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Find Your
              <span className="gradient-text"> Dream Property</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Discover exceptional properties that match your lifestyle. 
              From luxury homes to modern apartments, your perfect space awaits.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Browse Properties</h2>
              <p className="text-sm text-muted-foreground">
                {properties?.length || 0} properties available
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <PropertyFilters onFiltersChange={setFilters} />
        </div>

        <PropertyGrid properties={properties} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 PropMarket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
