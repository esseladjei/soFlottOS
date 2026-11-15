// React Query hooks for the Cost & Pricing engine. Every save invalidates the overview and audit
// so the coverage board and the change log always reflect the latest configuration.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { useAppContent } from "@/i18n/locale-provider";
import type {
  CalculatePriceRequest, SaveCostCategoryRequest, SaveCostItemRequest, SaveCostProfileRequest, SaveLabourProfileRequest,
  SavePricingProfileRequest, SaveVehicleProfileRequest,
} from "@/types/api";
import * as api from "./api";

export const pricingKeys = {
  overview: ["pricing", "overview"] as const,
  reference: ["pricing", "reference"] as const,
  categories: ["pricing", "cost-categories"] as const,
  items: ["pricing", "cost-items"] as const,
  vehicles: ["pricing", "vehicle-profiles"] as const,
  labour: ["pricing", "labour-profiles"] as const,
  costProfiles: ["pricing", "cost-profiles"] as const,
  profiles: ["pricing", "profiles"] as const,
  calculations: (simulations?: boolean) => ["pricing", "calculations", simulations ?? "all"] as const,
  calculation: (id: number) => ["pricing", "calculations", "detail", id] as const,
  audit: ["pricing", "audit"] as const,
};

export const usePricingOverview = () => useQuery({ queryKey: pricingKeys.overview, queryFn: api.getPricingOverview });
export const usePricingReference = () => useQuery({ queryKey: pricingKeys.reference, queryFn: api.getPricingReference, staleTime: Infinity });
export const useCostCategories = () => useQuery({ queryKey: pricingKeys.categories, queryFn: api.getCostCategories });
export const useCostItems = () => useQuery({ queryKey: pricingKeys.items, queryFn: api.getCostItems });
export const useVehicleProfiles = () => useQuery({ queryKey: pricingKeys.vehicles, queryFn: api.getVehicleProfiles });
export const useLabourProfiles = () => useQuery({ queryKey: pricingKeys.labour, queryFn: api.getLabourProfiles });
export const useCostProfiles = () => useQuery({ queryKey: pricingKeys.costProfiles, queryFn: api.getCostProfiles });
export const usePricingProfiles = () => useQuery({ queryKey: pricingKeys.profiles, queryFn: api.getPricingProfiles });
export const usePricingCalculations = (simulations?: boolean) => useQuery({ queryKey: pricingKeys.calculations(simulations), queryFn: () => api.getPricingCalculations(simulations) });
export const usePricingCalculation = (id: number | null) => useQuery({ queryKey: pricingKeys.calculation(id ?? 0), queryFn: () => api.getPricingCalculation(id ?? 0), enabled: id !== null });
export const usePricingAudit = () => useQuery({ queryKey: pricingKeys.audit, queryFn: () => api.getPricingAudit() });

type Saver<TRequest, TResponse> = { id?: number; payload: TRequest } & { __response?: TResponse };

function useSave<TRequest, TResponse>(
  keys: readonly (readonly string[])[],
  create: (payload: TRequest) => Promise<TResponse>,
  update: (id: number, payload: TRequest) => Promise<TResponse>,
) {
  const client = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: ({ id, payload }: Saver<TRequest, TResponse>) => (id === undefined ? create(payload) : update(id, payload)),
    onSuccess: async () => {
      await Promise.all([...keys, pricingKeys.overview, pricingKeys.audit].map((queryKey) => client.invalidateQueries({ queryKey })));
      toast.success(content.pricing.common.saved);
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : content.common.requestFailed),
  });
}

export const useSaveCostCategory = () => useSave<SaveCostCategoryRequest, unknown>([pricingKeys.categories, pricingKeys.items], api.createCostCategory, api.updateCostCategory);
export const useSaveCostItem = () => useSave<SaveCostItemRequest, unknown>([pricingKeys.items, pricingKeys.categories], api.createCostItem, api.updateCostItem);
export const useSaveVehicleProfile = () => useSave<SaveVehicleProfileRequest, unknown>([pricingKeys.vehicles, pricingKeys.costProfiles], api.createVehicleProfile, api.updateVehicleProfile);
export const useSaveLabourProfile = () => useSave<SaveLabourProfileRequest, unknown>([pricingKeys.labour, pricingKeys.costProfiles], api.createLabourProfile, api.updateLabourProfile);
export const useSaveCostProfile = () => useSave<SaveCostProfileRequest, unknown>([pricingKeys.costProfiles, pricingKeys.profiles], api.createCostProfile, api.updateCostProfile);
export const useSavePricingProfile = () => useSave<SavePricingProfileRequest, unknown>([pricingKeys.profiles], api.createPricingProfile, api.updatePricingProfile);

export function useSimulatePrice() {
  const client = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (payload: CalculatePriceRequest) => api.simulatePrice(payload),
    onSuccess: async (_, variables) => {
      if (variables.saveAsScenarioName) {
        await client.invalidateQueries({ queryKey: ["pricing", "calculations"] });
        toast.success(content.pricing.simulator.scenarioSaved);
      }
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : content.common.requestFailed),
  });
}
