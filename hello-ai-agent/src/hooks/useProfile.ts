import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/services/profileApi';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      // Mock data for development
      return Promise.resolve({
        username: "shadcn",
        email: "user@example.com", 
        bio: "I own a computer.",
        urls: [
          { id: "website", label: "Website", url: "https://shadcn.com", type: "website" as const },
          { id: "twitter", label: "Twitter", url: "https://twitter.com/shadcn", type: "twitter" as const }
        ]
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

export function useVerifiedEmails() {
  return useQuery({
    queryKey: ['verified-emails'],
    queryFn: () => {
      // Mock data for development
      return Promise.resolve([
        { email: "user@example.com", verified: true, primary: true },
        { email: "admin@example.com", verified: true, primary: false },
        { email: "demo@example.com", verified: true, primary: false }
      ]);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
