import { apiFetch } from "@/lib/api/client";
import type { BookingAvailability, SaveBookingAvailabilityRequest } from "@/types/api";

export function getBookingAvailability() {
  return apiFetch<BookingAvailability>("/api/proxy/booking-availability");
}

export function saveBookingAvailability(payload: SaveBookingAvailabilityRequest) {
  return apiFetch<BookingAvailability>("/api/proxy/booking-availability", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
