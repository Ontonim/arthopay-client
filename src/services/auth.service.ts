import { apiRequest } from "@/lib/api-client";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponseData,
  RefreshTokenResponseData,
  RegisterPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from "@/types/api";

/**
 * One function per row of the "Quick API Reference" table in the docs.
 * Each function returns `data` from the success envelope — apiRequest()
 * already unwraps {success, message, data} and throws ApiError on failure.
 */

// POST /auth/register — ❌ no auth — creates CREATOR/GUEST_USER account
export function registerUser(payload: RegisterPayload) {
  return apiRequest<{ user: User }>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

// POST /auth/verify-email — ❌ no auth — OTP verifies the email
export function verifyEmail(payload: VerifyEmailPayload) {
  return apiRequest<{ user: User }>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

// POST /auth/resend-otp — ❌ no auth — resend the verification OTP
export function resendOtp(payload: ResendOtpPayload) {
  return apiRequest<null>("/auth/resend-otp", {
    method: "POST",
    body: payload,
  });
}

// POST /auth/login — ❌ no auth — email/phone + password
// Sets refreshToken as an httpOnly cookie server-side; returns accessToken + user here.
export function login(payload: LoginPayload) {
  return apiRequest<LoginResponseData>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

// POST /auth/refresh-token — ❌ no auth (uses the httpOnly cookie, not a bearer token)
export function refreshAccessToken() {
  return apiRequest<RefreshTokenResponseData>("/auth/refresh-token", {
    method: "POST",
  });
}

// POST /auth/forgot-password — ❌ no auth — sends a password-reset OTP
export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiRequest<null>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

// POST /auth/reset-password — ❌ no auth — OTP + new password
export function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<null>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

// POST /auth/change-password — ✅ any logged-in user
export function changePassword(payload: ChangePasswordPayload, accessToken: string) {
  return apiRequest<null>("/auth/change-password", {
    method: "POST",
    body: payload,
    accessToken,
  });
}

// POST /auth/create-admin — ✅ SUPER_ADMIN only
export function createAdmin(
  payload: { name: string; username: string; email: string; mobile: string; password: string },
  accessToken: string
) {
  return apiRequest<{ user: User }>("/auth/create-admin", {
    method: "POST",
    body: payload,
    accessToken,
  });
}
