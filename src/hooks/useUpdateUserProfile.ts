import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { UserProfile } from '@/types/UserProfile';

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (next: UserProfile) => updateUserProfile(next),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userProfile.current,
      });
    },
  });
}