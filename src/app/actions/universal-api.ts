"use server";

import { cookies } from "next/headers";

/**
 * সব module (auth, product, kyc...) এই একটাই file দিয়ে backend-এ কথা বলবে।
 * এটা Server Action — Next.js server থেকে সরাসরি backend hit করে, browser না।
 *
 * Token strategy:
 * - accessToken: আমাদের নিজেদের httpOnly cookie-তে রাখি (backend body-তে পাঠায়,
 *   আমরা নিজেরা cookie বসাই — setAccessTokenCookie() দিয়ে)
 * - refreshToken: backend নিজে httpOnly cookie হিসেবে Set-Cookie করে, কিন্তু সেটা
 *   আসে এই Next.js server-এর fetch response-এ (browser-এ না) — তাই সেটা ধরে
 *   আমরা নিজেরা আবার আমাদের cookie-তে বসাই, নাহলে হারিয়ে যাবে।
 */

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

export interface ApiErrorItem {
  path: string;
  message: string;
}

export type ApiResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; errorSource?: ApiErrorItem[]; status?: number };

interface UniversalApiOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** আমাদের cookie থেকে accessToken নিয়ে Authorization header বসাবে কিনা। Default true. */
  requireAuth?: boolean;
  /** আমাদের cookie-তে থাকা refreshToken backend-এ Cookie header হিসেবে পাঠাবে কিনা।
   *  শুধু /auth/refresh-token endpoint-এর জন্য দরকার। */
  forwardRefreshToken?: boolean;
}

/** fetch response-এর Set-Cookie header থেকে নির্দিষ্ট নামের cookie value বের করে। */
function getSetCookieValue(headers: Headers, name: string): string | undefined {
  const setCookieHeaders = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : [];
  const line = setCookieHeaders.find((c) => c.startsWith(`${name}=`));
  if (!line) return undefined;
  const raw = line.split(";")[0].split("=").slice(1).join("=");
  return raw ? decodeURIComponent(raw) : undefined;
}

export async function universalApi<T = unknown>({
  endpoint,
  method = "GET",
  body,
  requireAuth = true,
  forwardRefreshToken = false,
}: UniversalApiOptions): Promise<ApiResult<T>> {
  if (!API_BASE_URL) {
    return { success: false, message: "API_BASE_URL সেট করা নেই — .env.local চেক করো।" };
  }

  const cookieStore = await cookies();
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (requireAuth) {
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (forwardRefreshToken) {
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
    if (refreshToken) headers["Cookie"] = `refreshToken=${refreshToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      cache: "no-store",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { success: false, message: "Network error — আবার চেষ্টা করো।" };
  }

  // Backend যদি এই response-এ নতুন refreshToken cookie সেট করে থাকে (login/register-এ
  // হয়), সেটা এখানেই ধরে ফেলি — নাহলে Next.js server-এর বাইরে এটা কখনো পৌঁছাবে না।
  const forwardedRefreshToken = getSetCookieValue(response.headers, REFRESH_TOKEN_COOKIE);
  if (forwardedRefreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, forwardedRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 দিন — doc অনুযায়ী refreshToken-এর মেয়াদ
      path: "/",
    });
  }

  let json: { success: boolean; message: string; data?: T; errorSource?: ApiErrorItem[] };
  try {
    json = await response.json();
  } catch {
    return { success: false, message: "Server response পড়া যাচ্ছে না।", status: response.status };
  }

  if (!response.ok || json.success === false) {
    // accessToken invalid/expired হলে নিজেদের cookie মুছে দিই যাতে stale token আটকে না থাকে
    if (response.status === 401 && requireAuth) {
      cookieStore.delete(ACCESS_TOKEN_COOKIE);
    }
    return {
      success: false,
      message: json.message || `Error: ${response.statusText}`,
      errorSource: json.errorSource,
      status: response.status,
    };
  }

  return { success: true, message: json.message, data: json.data as T };
}

/** Login / refresh-token success হলে accessToken নিজেদের httpOnly cookie-তে বসায়। */
export async function setAccessTokenCookie(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 মিনিট — backend-এর accessToken মেয়াদ অনুযায়ী
    path: "/",
  });
}

/** Logout / change-password-এর পর দুটো cookie-ই মুছে দেয়। */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}