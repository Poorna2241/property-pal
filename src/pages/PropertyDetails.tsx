import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProperty, useDeleteProperty } from '@/hooks/useProperties';
import { useFavoriteIds, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Heart, Bed, Bath, Square, MapPin, Calendar, User, Phone, Mail, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PropertyForm } from '@/components/property/PropertyForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { data: property, isLoading } = useProperty(id!);
  const { data: favoriteIds = [] } = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();
  const deleteProperty = useDeleteProperty();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => navigate('/')}>Back to Properties</Button>
        </div>
      </div>
    );
  }

  const isFavorite = favoriteIds.includes(property.id);
  const isOwner = user?.id === property.seller_id;
  const canEdit = isOwner || isAdmin;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async () => {
    await deleteProperty.mutateAsync(property.id);
    navigate('/');
  };

  const images = property.property_images || [];
  const currentImage = images[selectedImage];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                {currentImage ? (
                  <img
                    src={currentImage.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Images Available
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors",
                        selectedImage === index ? "border-primary" : "border-transparent"
                      )}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary text-primary-foreground capitalize">
                      {property.property_type}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {property.status}
                    </Badge>
                  </div>
                  <h1 className="font-display text-3xl font-bold">{property.title}</h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}, {property.city}, {property.state || property.country}</span>
                  </div>
                </div>
                <p className="font-display text-3xl font-bold gradient-text">
                  {formatPrice(property.price)}
                </p>
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-border">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-primary" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-primary" />
                    <span>{property.area_sqft.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>

              {property.description && (
                <div>
                  <h2 className="font-semibold text-lg mb-2">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Listed on {new Date(property.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Actions */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                {user && (
                  <Button
                    variant="outline"
                    className={cn("w-full gap-2", isFavorite && "text-destructive")}
                    onClick={() => toggleFavorite.mutate({ propertyId: property.id, isFavorite })}
                  >
                    <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                )}

                {canEdit && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setShowEditDialog(true)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Property
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete Property
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this property? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            {property.seller_profile && (
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Contact Seller</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{property.seller_profile.full_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${property.seller_profile.email}`} className="text-primary hover:underline">
                        {property.seller_profile.email}
                      </a>
                    </div>
                    {property.seller_profile.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${property.seller_profile.phone}`} className="text-primary hover:underline">
                          {property.seller_profile.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <PropertyForm property={property} onSuccess={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
