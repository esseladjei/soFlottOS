// Typed client-side calls for the admin Cost & Pricing engine (api/admin/pricing/*).
import { apiFetch } from "@/lib/api/client";
import type {
  CalculatePriceRequest, CostCategory, CostItem, CostProfile, LabourProfile, PricingAuditEntry, PricingCalculation,
  PricingCalculationSummary, PricingOverview, PricingProfile, PricingReference, SaveCostCategoryRequest, SaveCostItemRequest,
  SaveCostProfileRequest, SaveLabourProfileRequest, SavePricingProfileRequest, SaveVehicleProfileRequest, VehicleProfile,
} from "@/types/api";

const base = "/api/proxy/admin/pricing";

function json(method: "POST" | "PUT", body: unknown): RequestInit {
  return { method, body: JSON.stringify(body) };
}

export const getPricingOverview = () => apiFetch<PricingOverview>(`${base}/overview`);
export const getPricingReference = () => apiFetch<PricingReference>(`${base}/reference`);

export const getCostCategories = () => apiFetch<CostCategory[]>(`${base}/cost-categories`);
export const createCostCategory = (payload: SaveCostCategoryRequest) => apiFetch<CostCategory>(`${base}/cost-categories`, json("POST", payload));
export const updateCostCategory = (id: number, payload: SaveCostCategoryRequest) => apiFetch<CostCategory>(`${base}/cost-categories/${id}`, json("PUT", payload));

export const getCostItems = () => apiFetch<CostItem[]>(`${base}/cost-items`);
export const createCostItem = (payload: SaveCostItemRequest) => apiFetch<CostItem>(`${base}/cost-items`, json("POST", payload));
export const updateCostItem = (id: number, payload: SaveCostItemRequest) => apiFetch<CostItem>(`${base}/cost-items/${id}`, json("PUT", payload));

export const getVehicleProfiles = () => apiFetch<VehicleProfile[]>(`${base}/vehicle-profiles`);
export const createVehicleProfile = (payload: SaveVehicleProfileRequest) => apiFetch<VehicleProfile>(`${base}/vehicle-profiles`, json("POST", payload));
export const updateVehicleProfile = (id: number, payload: SaveVehicleProfileRequest) => apiFetch<VehicleProfile>(`${base}/vehicle-profiles/${id}`, json("PUT", payload));

export const getLabourProfiles = () => apiFetch<LabourProfile[]>(`${base}/labour-profiles`);
export const createLabourProfile = (payload: SaveLabourProfileRequest) => apiFetch<LabourProfile>(`${base}/labour-profiles`, json("POST", payload));
export const updateLabourProfile = (id: number, payload: SaveLabourProfileRequest) => apiFetch<LabourProfile>(`${base}/labour-profiles/${id}`, json("PUT", payload));

export const getCostProfiles = () => apiFetch<CostProfile[]>(`${base}/cost-profiles`);
export const createCostProfile = (payload: SaveCostProfileRequest) => apiFetch<CostProfile>(`${base}/cost-profiles`, json("POST", payload));
export const updateCostProfile = (id: number, payload: SaveCostProfileRequest) => apiFetch<CostProfile>(`${base}/cost-profiles/${id}`, json("PUT", payload));

export const getPricingProfiles = () => apiFetch<PricingProfile[]>(`${base}/profiles`);
export const createPricingProfile = (payload: SavePricingProfileRequest) => apiFetch<PricingProfile>(`${base}/profiles`, json("POST", payload));
export const updatePricingProfile = (id: number, payload: SavePricingProfileRequest) => apiFetch<PricingProfile>(`${base}/profiles/${id}`, json("PUT", payload));

export const simulatePrice = (payload: CalculatePriceRequest) => apiFetch<PricingCalculation>(`${base}/simulate`, json("POST", payload));
export const getPricingCalculations = (simulations?: boolean, take = 50) =>
  apiFetch<PricingCalculationSummary[]>(`${base}/calculations?take=${take}${simulations === undefined ? "" : `&simulations=${simulations}`}`);
export const getPricingCalculation = (id: number) => apiFetch<PricingCalculation>(`${base}/calculations/${id}`);
export const getPricingAudit = (take = 100) => apiFetch<PricingAuditEntry[]>(`${base}/audit?take=${take}`);
