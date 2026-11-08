// React Query wrappers keep browser data fetching consistent and cache-aware.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { useAppContent } from "@/i18n/locale-provider";
import type { CreateOrderRequest, QuoteOrderRequest } from "@/types/api";
import { cancelOrder, createOrder, getClientInvoices, getClientOrder, getClientOrders, getInvoice, quoteOrder } from "./api";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export const clientKeys = {
  orders: ["client", "orders"] as const,
  order: (id: number) => ["client", "orders", id] as const,
  invoices: ["client", "invoices"] as const,
  invoice: (id: number) => ["client", "invoices", id] as const,
};

export function useClientOrders() {
  return useQuery({ queryKey: clientKeys.orders, queryFn: getClientOrders });
}

export function useClientOrder(id: number) {
  return useQuery({ queryKey: clientKeys.order(id), queryFn: () => getClientOrder(id) });
}

export function useQuoteOrder() {
  const content = useAppContent();
  return useMutation({ mutationFn: (payload: QuoteOrderRequest) => quoteOrder(payload), onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)) });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => createOrder(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: clientKeys.orders });
      await queryClient.invalidateQueries({ queryKey: clientKeys.invoices });
      toast.success(content.feedback.orderCreated);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: async (order) => {
      await queryClient.invalidateQueries({ queryKey: clientKeys.orders });
      await queryClient.invalidateQueries({ queryKey: clientKeys.order(order.id) });
      toast.success(content.feedback.orderCancelled);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useClientInvoices() {
  return useQuery({ queryKey: clientKeys.invoices, queryFn: getClientInvoices });
}

export function useInvoice(id: number) {
  return useQuery({ queryKey: clientKeys.invoice(id), queryFn: () => getInvoice(id) });
}
