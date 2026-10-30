// Typed client-side calls for Admin operations endpoints.
import { apiFetch } from "@/lib/api/client";
import type { AdminDashboard, AssignOrderRequest, ClientDetail, ClientSummary, DriverProfile, Invoice, InvoiceStatus, Order, OrderStatus, RegisterDriverRequest, SaveClientRequest } from "@/types/api";

export function getDashboard() {
  return apiFetch<AdminDashboard>("/api/proxy/admin/dashboard");
}

export function getAdminOrders(status?: OrderStatus) {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<Order[]>(`/api/proxy/orders${suffix}`);
}

export function getAdminOrder(id: number) {
  return apiFetch<Order>(`/api/proxy/orders/${id}`);
}

export function assignOrder(id: number, payload: AssignOrderRequest) {
  return apiFetch<Order>(`/api/proxy/orders/${id}/assign`, { method: "PUT", body: JSON.stringify(payload) });
}

export function getClients() {
  return apiFetch<ClientSummary[]>("/api/proxy/clients");
}

export function createClient(payload: SaveClientRequest) {
  return apiFetch<ClientDetail>("/api/proxy/clients", { method: "POST", body: JSON.stringify(payload) });
}

export function getClient(id: number) {
  return apiFetch<ClientDetail>(`/api/proxy/clients/${id}`);
}

export function updateClient(id: number, payload: SaveClientRequest) {
  return apiFetch<ClientDetail>(`/api/proxy/clients/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export function getDrivers() {
  return apiFetch<DriverProfile[]>("/api/proxy/admin/drivers");
}

export function createDriver(payload: RegisterDriverRequest) {
  return apiFetch<DriverProfile>("/api/proxy/admin/drivers", { method: "POST", body: JSON.stringify(payload) });
}

export function getInvoices(status?: InvoiceStatus) {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<Invoice[]>(`/api/proxy/invoices${suffix}`);
}

export function updateInvoiceStatus(id: number, status: InvoiceStatus) {
  return apiFetch<Invoice>(`/api/proxy/invoices/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
}
