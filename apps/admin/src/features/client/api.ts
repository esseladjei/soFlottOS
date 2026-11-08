// Typed client-side calls for Client endpoints through the Next.js proxy.
import { apiFetch } from "@/lib/api/client";
import type { CreateOrderRequest, Invoice, InvoiceDetail, Order, OrderQuote, QuoteOrderRequest } from "@/types/api";

export function getClientOrders() {
  return apiFetch<Order[]>("/api/proxy/orders/mine");
}

export function getClientOrder(id: number) {
  return apiFetch<Order>(`/api/proxy/orders/${id}`);
}

export function quoteOrder(payload: QuoteOrderRequest) {
  return apiFetch<OrderQuote>("/api/proxy/orders/quote", { method: "POST", body: JSON.stringify(payload) });
}

export function createOrder(payload: CreateOrderRequest) {
  return apiFetch<Order>("/api/proxy/orders", { method: "POST", body: JSON.stringify(payload) });
}

export function cancelOrder(id: number) {
  return apiFetch<Order>(`/api/proxy/orders/${id}/cancel`, { method: "PUT" });
}

export function getClientInvoices() {
  return apiFetch<Invoice[]>("/api/proxy/invoices/mine");
}

export function getInvoice(id: number) {
  return apiFetch<InvoiceDetail>(`/api/proxy/invoices/${id}`);
}
