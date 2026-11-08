import type { ApiProblemDetails } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly problem?: ApiProblemDetails,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? ((await response.json()) as unknown)
    : await response.text();

  if (!response.ok) {
    const problem = typeof body === "object" && body !== null ? (body as ApiProblemDetails) : undefined;
    const detail =
      problem?.detail ??
      problem?.title ??
      (typeof body === "string" ? body : "The request could not be completed.");

    throw new ApiError(detail, response.status, problem);
  }

  return body as T;
}
