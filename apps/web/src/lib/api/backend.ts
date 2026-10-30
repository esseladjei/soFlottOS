import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/server-env";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getRequestLocale } from "@/i18n/server";
import type { ApiProblemDetails, AuthResponse, ForgotPasswordRequest, LoginRequest, RegisterClientRequest, RegisterDriverRequest, ResetPasswordRequest } from "@/types/api";

export class BackendError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
  }
}

export class BackendUnavailableError extends Error {
  constructor(
    message: string,
    public readonly problem: ApiProblemDetails,
    public readonly cause?: unknown,
  ) {
    super(message);
  }
}

function isSelfSignedCertificateError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const cause = error.cause as { code?: string } | undefined;
  return cause?.code === "DEPTH_ZERO_SELF_SIGNED_CERT";
}

function buildBackendUrl(path: string, search?: URLSearchParams) {
  const url = new URL(path, serverEnv.SOFLOTT_API_BASE_URL);
  if (search) {
    url.search = search.toString();
  }

  return url;
}

function createBackendUnavailableProblem(error?: unknown): ApiProblemDetails {
  if (isSelfSignedCertificateError(error)) {
    return {
      title: "soFlottOS API HTTPS certificate is not trusted",
      detail:
        `The frontend reached ${serverEnv.SOFLOTT_API_BASE_URL} over HTTPS, but Node.js does not trust the ASP.NET development certificate. ` +
        "Use http://localhost:5235 locally, or trust the ASP.NET development certificate.",
      status: 503,
    };
  }

  return {
    title: "soFlottOS API unavailable",
    detail: `The frontend could not reach the backend API at ${serverEnv.SOFLOTT_API_BASE_URL}. Start the ASP.NET API or update SOFLOTT_API_BASE_URL.`,
    status: 503,
  };
}

async function fetchFromBackend(path: string, init: RequestInit, search?: URLSearchParams) {
  const url = buildBackendUrl(path, search);

  try {
    const headers = new Headers(init.headers);
    headers.set("X-App-Locale", await getRequestLocale());
    return await fetch(url, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Unable to reach backend endpoint ${url.toString()}.`, error);
    throw new BackendUnavailableError(
      "Unable to reach the soFlottOS API.",
      createBackendUnavailableProblem(error),
      error,
    );
  }
}

async function readJsonOrText(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function authenticateAgainstBackend(path: string, body: LoginRequest | RegisterClientRequest | RegisterDriverRequest) {
  const response = await fetchFromBackend(path, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody = await readJsonOrText(response);
  if (!response.ok) {
    throw new BackendError("Unable to authenticate against the soFlottOS API.", response.status, responseBody);
  }

  return responseBody as AuthResponse;
}

export function loginAgainstBackend(request: LoginRequest) {
  return authenticateAgainstBackend("/api/auth/login", request);
}

export function registerClientAgainstBackend(request: RegisterClientRequest) {
  return authenticateAgainstBackend("/api/auth/register/client", request);
}

export function registerDriverAgainstBackend(request: RegisterDriverRequest) {
  return authenticateAgainstBackend("/api/auth/register/driver", request);
}

export async function recoverPasswordAgainstBackend(
  action: "forgot-password" | "reset-password",
  body: ForgotPasswordRequest | ResetPasswordRequest,
) {
  const response = await fetchFromBackend(`/api/auth/${action}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new BackendError("Password recovery failed.", response.status, await readJsonOrText(response));
  }
}
export async function proxyRequestToBackend(request: NextRequest, segments: string[]) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      {
        title: "Unauthorized",
        detail: "You need an active session to access the operations API.",
        status: 401,
      },
      { status: 401 },
    );
  }

  const headers = new Headers({
    accept: "application/json",
    authorization: `Bearer ${session.token}`,
  });

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  let backendResponse: Response;

  try {
    backendResponse = await fetchFromBackend(
      `/api/${segments.join("/")}`,
      {
        method: request.method,
        headers,
        body,
      },
      request.nextUrl.searchParams,
    );
  } catch (error) {
    if (error instanceof BackendUnavailableError) {
      return NextResponse.json(error.problem, { status: error.problem.status ?? 503 });
    }

    throw error;
  }

  const payload = backendResponse.status === 204 ? null : await backendResponse.text();

  const response = new NextResponse(payload, {
    status: backendResponse.status,
    headers: {
      "content-type": backendResponse.headers.get("content-type") ?? "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

  if (backendResponse.status === 401) {
    response.cookies.delete(SESSION_COOKIE_NAME);
  }

  return response;
}
