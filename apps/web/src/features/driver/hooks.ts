// React Query wrappers for driver PWA screens.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { useAppContent } from "@/i18n/locale-provider";
import type { ProofOfDeliveryRequest, UpdateAvailabilityRequest } from "@/types/api";
import { getDriverJob, getDriverJobs, getDriverProfile, startJob, submitProofOfDelivery, updateAvailability } from "./api";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export const driverKeys = {
  profile: ["driver", "profile"] as const,
  jobs: ["driver", "jobs"] as const,
  job: (id: number) => ["driver", "jobs", id] as const,
};

export function useDriverProfile() {
  return useQuery({ queryKey: driverKeys.profile, queryFn: getDriverProfile });
}

export function useDriverJobs() {
  return useQuery({ queryKey: driverKeys.jobs, queryFn: getDriverJobs });
}

export function useDriverJob(id: number) {
  return useQuery({ queryKey: driverKeys.job(id), queryFn: () => getDriverJob(id) });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (payload: UpdateAvailabilityRequest) => updateAvailability(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: driverKeys.profile });
      toast.success(content.feedback.availabilityUpdated);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useStartJob(id: number) {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: () => startJob(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: driverKeys.jobs });
      await queryClient.invalidateQueries({ queryKey: driverKeys.job(id) });
      toast.success(content.feedback.jobStarted);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}

export function useSubmitPod(id: number) {
  const queryClient = useQueryClient();
  const content = useAppContent();
  return useMutation({
    mutationFn: (payload: ProofOfDeliveryRequest) => submitProofOfDelivery(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: driverKeys.jobs });
      await queryClient.invalidateQueries({ queryKey: driverKeys.job(id) });
      await queryClient.invalidateQueries({ queryKey: driverKeys.profile });
      toast.success(content.feedback.deliveryCompleted);
    },
    onError: (error) => toast.error(errorMessage(error, content.common.requestFailed)),
  });
}
