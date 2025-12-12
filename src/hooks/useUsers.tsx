import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole, AppRole } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export interface UserWithRole extends UserProfile {
  user_roles: UserRole[];
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      return profiles.map(profile => ({
        ...profile,
        user_roles: roles.filter(r => r.user_id === profile.user_id)
      })) as UserWithRole[];
    }
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      toast({ title: 'User role updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating user role', description: error.message, variant: 'destructive' });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      toast({ title: 'User deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting user', description: error.message, variant: 'destructive' });
    }
  });
}
