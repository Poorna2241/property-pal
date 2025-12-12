import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyWithImages, PropertyImage } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface PropertyFilters {
  search?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  status?: string;
}

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,city.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
      }
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters?.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PropertyWithImages[];
    }
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.seller_id)
          .maybeSingle();
        
        return { ...data, seller_profile: profile } as PropertyWithImages;
      }
      
      return null;
    },
    enabled: !!id
  });
}

export function useMyProperties(userId?: string) {
  return useQuery({
    queryKey: ['my-properties', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .eq('seller_id', userId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyWithImages[];
    },
    enabled: !!userId
  });
}

export function useAllPropertiesAdmin() {
  return useQuery({
    queryKey: ['all-properties-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyWithImages[];
    }
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (property: Partial<Property> & { seller_id: string; title: string; price: number; property_type: string; address: string; city: string; status: string }) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      toast({ title: 'Property created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating property', description: error.message, variant: 'destructive' });
    }
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Property> & { id: string }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property'] });
      toast({ title: 'Property updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating property', description: error.message, variant: 'destructive' });
    }
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      toast({ title: 'Property deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting property', description: error.message, variant: 'destructive' });
    }
  });
}

export function useAddPropertyImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: Omit<PropertyImage, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('property_images')
        .insert(image)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property'] });
    }
  });
}

export function useDeletePropertyImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property'] });
    }
  });
}
