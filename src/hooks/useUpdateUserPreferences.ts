import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { updateUserPreferences } from '@/services';
import type { UserPreferences } from '@/types/UserPreferences';

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (next: UserPreferences) => updateUserPreferences(next),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userPreferences.current,
      });
    },
  });
}