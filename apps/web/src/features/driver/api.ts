// Typed client-side calls for the Driver PWA endpoints.
import { apiFetch } from "@/lib/api/client";
import type { DriverProfile, Order, ProofOfDeliveryRequest, UpdateAvailabilityRequest } from "@/types/api";

export function getDriverProfile() {
  return apiFetch<DriverProfile>("/api/proxy/driver/me");
}

export function updateAvailability(payload: UpdateAvailabilityRequest) {
  return apiFetch<DriverProfile>("/api/proxy/driver/availability", { method: "PUT", body: JSON.stringify(payload) });
}

export function getDriverJobs() {
  return apiFetch<Order[]>("/api/proxy/driver/jobs");
}

export function getDriverJob(id: number) {
  return apiFetch<Order>(`/api/proxy/orders/${id}`);
}

export function startJob(id: number) {
  return apiFetch<Order>(`/api/proxy/driver/jobs/${id}/start`, { method: "PUT" });
}

export function submitProofOfDelivery(id: number, payload: ProofOfDeliveryRequest) {
  return apiFetch<Order>(`/api/proxy/driver/jobs/${id}/pod`, { method: "POST", body: JSON.stringify(payload) });
}
