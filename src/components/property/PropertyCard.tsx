import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Bed, Bath, Square, MapPin, Building2 } from 'lucide-react';
import { PropertyWithImages } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteIds, useToggleFavorite } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: PropertyWithImages;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const { data: favoriteIds = [] } = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();

  const isFavorite = favoriteIds.includes(property.id);
  const primaryImage = property.property_images?.find(img => img.is_primary) || property.property_images?.[0];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleFavorite.mutate({ propertyId: property.id, isFavorite });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="group overflow-hidden bg-card border-border/50 hover-lift cursor-pointer transition-all duration-300 hover:border-primary/30">
        <div className="relative aspect-[4/3] overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <Building2 className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="gradient-primary text-primary-foreground border-0 font-medium capitalize">
              {property.property_type}
            </Badge>
            {property.status !== 'active' && (
              <Badge variant="secondary" className="capitalize bg-secondary/80 backdrop-blur-sm">
                {property.status}
              </Badge>
            )}
          </div>

          {user && (
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "absolute top-3 right-3 bg-background/30 backdrop-blur-md hover:bg-background/50 border border-border/30 transition-all",
                isFavorite && "text-destructive bg-destructive/20 border-destructive/30"
              )}
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <p className="font-display font-bold text-2xl text-foreground drop-shadow-lg">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary/70" />
            <span className="line-clamp-1">{property.city}, {property.state || property.country}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} baths</span>
              </div>
            )}
            {property.area_sqft && (
              <div className="flex items-center gap-1.5">
                <Square className="w-4 h-4" />
                <span>{property.area_sqft.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
