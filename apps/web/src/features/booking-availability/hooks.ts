import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppContent } from "@/i18n/locale-provider";
import { getBookingAvailability, saveBookingAvailability } from "./api";

const availabilityKey = ["booking-availability"] as const;

export function useBookingAvailability(enabled = true) {
  return useQuery({
    queryKey: availabilityKey,
    queryFn: getBookingAvailability,
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: 15_000,
  });
}

export function useSaveBookingAvailability() {
  const client = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: saveBookingAvailability,
    onSuccess: async (data) => {
      client.setQueryData(availabilityKey, data);
      await client.invalidateQueries({ queryKey: availabilityKey });
      toast.success(content.bookingAvailability.saved);
    },
    onError: (error) => toast.error(error.message || content.common.requestFailed),
  });
}
