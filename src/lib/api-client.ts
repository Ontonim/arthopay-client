import type { ApiErrorItem, ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL && typeof window !== "undefined") {
  // Fail loud in the browser during development instead of silently hitting "undefined/...".
  console.error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local (see .env.local example)."
  );
}

/**
 * Thrown for every non-2xx response. Carries the backend's message and
 * field-level errorSource so forms can map errors back onto inputs.
 */
export class ApiError extends Error {
  status: number;
  errorSource?: ApiErrorItem[];

  constructor(message: string, status: number, errorSource?: ApiErrorItem[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorSource = errorSource;
  }

  /** Convenience: get the message for a specific field, if the backend sent one. */
  fieldError(path: string): string | undefined {
    return this.errorSource?.find((e) => e.path === path)?.message;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Attach `Authorization: Bearer <token>`. Omit for public endpoints. */
  accessToken?: string;
  /** Skip JSON.stringify — use for FormData uploads. */
  raw?: boolean;
}

/**
 * Low-level request helper. All auth.service functions should go through this
 * so response-shape handling and error normalization stay in one place.
 */
export async function apiRequest<T>(
  path: string,
  { body, accessToken, raw, headers, ...init }: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method: init.method ?? (body ? "POST" : "GET"),
    // Refresh token travels as an httpOnly cookie — must include credentials
    // so the browser attaches/receives it on same-site or CORS-with-credentials setups.
    credentials: "include",
    headers: {
      ...(raw ? {} : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : raw ? (body as BodyInit) : JSON.stringify(body),
  });

  // 204 No Content — nothing to parse.
  if (res.status === 204) return undefined as T;

  let json: ApiSuccessResponse<T> | ApiErrorResponse;
  try {
    json = await res.json();
  } catch {
    throw new ApiError("Server-এ কোনো সমস্যা হয়েছে, আবার চেষ্টা করো।", res.status);
  }

  if (!res.ok || json.success === false) {
    const errJson = json as ApiErrorResponse;
    throw new ApiError(
      errJson.message || "কিছু একটা ভুল হয়েছে।",
      res.status,
      errJson.errorSource
    );
  }

  return (json as ApiSuccessResponse<T>).data;
}
