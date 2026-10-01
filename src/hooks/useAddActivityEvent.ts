import { queryKeys } from "@/lib/queryKeys";
import { addActivityEvent } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddActivityEvent() {
    const queryClient = useQueryClient();
    return useMutation({ 
        mutationFn: addActivityEvent,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: queryKeys.activityEvents.recent() }); }
    })
}