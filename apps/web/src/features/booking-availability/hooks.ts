import { useQuery } from "@tanstack/react-query";
import { getBookingAvailability } from "./api";

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
