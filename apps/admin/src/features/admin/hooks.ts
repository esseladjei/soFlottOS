// React Query wrappers for admin pages and mutations.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { useAppContent } from "@/i18n/locale-provider";
import type { InvoiceStatus, OrderStatus, RegisterDriverRequest, SaveClientRequest } from "@/types/api";
import { assignOrder, createClient, createDriver, getAdminOrder, getAdminOrders, getClient, getClients, getDashboard, getDrivers, getInvoices, updateClient, updateInvoiceStatus } from "./api";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export const adminKeys = {
  dashboard: ["admin", "dashboard"] as const,
  orders: (status?: OrderStatus) => ["admin", "orders", status ?? "all"] as const,
  order: (id: number) => ["admin", "orders", id] as const,
  clients: ["admin", "clients"] as const,
  client: (id: number) => ["admin", "clients", id] as const,
  drivers: ["admin", "drivers"] as const,
  invoices: (status?: InvoiceStatus) => ["admin", "invoices", status ?? "all"] as const,
};

export function useAdminDashboard() {
  return useQuery({ queryKey: adminKeys.dashboard, queryFn: getDashboard });
}

export function useAdminOrders(status?: OrderStatus) {
  return useQuery({ queryKey: adminKeys.orders(status), queryFn: () => getAdminOrders(status) });
}

export function useAdminOrder(id: number) {
  return useQuery({ queryKey: adminKeys.order(id), queryFn: () => getAdminOrder(id), enabled: Number.isInteger(id) && id > 0 });
}

export function useDrivers() {
  return useQuery({ queryKey: adminKeys.drivers, queryFn: getDrivers });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (payload: RegisterDriverRequest) => createDriver(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.drivers });
      toast.success(content.feedback.driverCreated);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useAssignOrder() {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: ({ orderId, driverUserId }: { orderId: number; driverUserId: number }) => assignOrder(orderId, { driverUserId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success(content.feedback.driverAssigned);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useClients() {
  return useQuery({ queryKey: adminKeys.clients, queryFn: getClients });
}

export function useClient(id: number) {
  return useQuery({ queryKey: adminKeys.client(id), queryFn: () => getClient(id) });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (payload: SaveClientRequest) => createClient(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.clients });
      toast.success(content.feedback.clientCreated);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useUpdateClient(id: number) {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (payload: SaveClientRequest) => updateClient(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.clients });
      await queryClient.invalidateQueries({ queryKey: adminKeys.client(id) });
      toast.success(content.feedback.clientSaved);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useInvoices(status?: InvoiceStatus) {
  return useQuery({ queryKey: adminKeys.invoices(status), queryFn: () => getInvoices(status) });
}

export function useUpdateInvoiceStatus(status?: InvoiceStatus) {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: ({ id, nextStatus }: { id: number; nextStatus: InvoiceStatus }) => updateInvoiceStatus(id, nextStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.invoices(status) });
      toast.success(content.feedback.invoiceStatusUpdated);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}
