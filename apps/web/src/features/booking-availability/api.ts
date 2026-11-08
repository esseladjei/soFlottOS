import { apiFetch } from "@/lib/api/client";
import type { BookingAvailability } from "@/types/api";

export function getBookingAvailability() {
  return apiFetch<BookingAvailability>("/api/proxy/booking-availability");
}
