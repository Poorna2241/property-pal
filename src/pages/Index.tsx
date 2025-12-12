import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';
import { Building2 } from 'lucide-react';

const Index = () => {
  const [filters, setFilters] = useState({});
  const { data: properties, isLoading } = useProperties({ ...filters, status: 'active' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">Find Your Dream Property</h1>
          </div>
          <p className="text-muted-foreground">
            Browse through our curated collection of properties
          </p>
        </div>

        <div className="mb-8">
          <PropertyFilters onFiltersChange={setFilters} />
        </div>

        <PropertyGrid properties={properties} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Index;
