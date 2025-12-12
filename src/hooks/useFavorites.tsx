import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Favorite, PropertyWithImages } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user!.id);

      if (error) throw error;

      const propertyIds = favorites.map(f => f.property_id);
      const { data: properties } = await supabase
        .from('properties')
        .select('*, property_images (*)')
        .in('id', propertyIds);

      return favorites.map(f => ({
        ...f,
        properties: properties?.find(p => p.id === f.property_id) as PropertyWithImages
      }));
    },
    enabled: !!user
  });
}

export function useFavoriteIds() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorite-ids', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user!.id);

      if (error) throw error;
      return data.map(f => f.property_id);
    },
    enabled: !!user
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ propertyId, isFavorite }: { propertyId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Must be logged in');

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, property_id: propertyId });

        if (error) throw error;
      }
    },
    onSuccess: (_, { isFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
      toast({ title: isFavorite ? 'Removed from favorites' : 'Added to favorites' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating favorites', description: error.message, variant: 'destructive' });
    }
  });
}
