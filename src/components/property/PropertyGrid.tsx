import { PropertyCard } from './PropertyCard';
import { PropertyWithImages } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface PropertyGridProps {
  properties?: PropertyWithImages[];
  isLoading?: boolean;
}

export function PropertyGrid({ properties, isLoading }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!properties?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property, index) => (
        <div
          key={property.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}
