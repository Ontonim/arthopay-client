"use server";

import {
  universalApi,
  setAccessTokenCookie,
  clearAuthCookies,
  type ApiResult,
} from "../universal-api";

/**
 * সূচিপত্রের ১০টা endpoint — একটা function = একটা row। ডকের Response Format
 * অনুযায়ী type লেখা হয়েছে (firstName/lastName আলাদা, username required,
 * login-এ emailOrPhone একটাই field, ইত্যাদি)।
 */

// ---- Types ----

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role?: "SELLER" | "GUEST_USER"; // না দিলে backend default GUEST_USER ধরে নেয়
}

export interface RegisterResponseData {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface LoginPayload {
  emailOrPhone: string; // email বা mobile — যেটাই হোক, backend @ দেখে বুঝে নেয়
  password: string;
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "SELLER" | "GUEST_USER";
export type KycStatus = "NOT_SUBMITTED" | "PENDING" | "REJECTED" | "APPROVED";

export interface LoginResponseData {
  accessToken: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: UserRole;
    kycStatus: KycStatus;
  };
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponseData {
  resetToken: string;
  message: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface CreateAdminPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export interface CreateAdminResponseData {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  role: "ADMIN";
}

// ---- Actions ----

// 1. POST /auth/register — 🔓 public
export async function registerAction(
  payload: RegisterPayload
): Promise<ApiResult<RegisterResponseData>> {
  return universalApi<RegisterResponseData>({
    endpoint: "/auth/register",
    method: "POST",
    body: payload,
    requireAuth: false,
  });
}

// 2. POST /auth/verify-email — 🔓 public
export async function verifyEmailAction(
  payload: VerifyEmailPayload
): Promise<ApiResult<{ message: string }>> {
  return universalApi<{ message: string }>({
    endpoint: "/auth/verify-email",
    method: "POST",
    body: payload,
    requireAuth: false,
  });
}

// 3. POST /auth/resend-otp — 🔓 public
export async function resendOtpAction(
  payload: ResendOtpPayload
): Promise<ApiResult<{ message: string }>> {
  return universalApi<{ message: string }>({
    endpoint: "/auth/resend-otp",
    method: "POST",
    body: payload,
    requireAuth: false,
  });
}

// 4. POST /auth/login — 🔓 public — success হলে accessToken নিজেদের cookie-তে বসায়
export async function loginAction(payload: LoginPayload): Promise<ApiResult<LoginResponseData>> {
  const result = await universalApi<LoginResponseData>({
    endpoint: "/auth/login",
    method: "POST",
    body: payload,
    requireAuth: false,
  });

  if (result.success) {
    await setAccessTokenCookie(result.data.accessToken);
  }
  return result;
}

// 5. POST /auth/refresh-token — 🔓 public (refreshToken cookie দিয়ে) — নতুন accessToken cookie-তে বসায়
export async function refreshTokenAction(): Promise<ApiResult<{ accessToken: string }>> {
  const result = await universalApi<{ accessToken: string }>({
    endpoint: "/auth/refresh-token",
    method: "POST",
    requireAuth: false,
    forwardRefreshToken: true,
  });

  if (result.success) {
    await setAccessTokenCookie(result.data.accessToken);
  }
  return result;
}

// 6. POST /auth/forgot-password — 🔓 public
export async function forgotPasswordAction(
  payload: ForgotPasswordPayload
): Promise<ApiResult<{ message: string }>> {
  return universalApi<{ message: string }>({
    endpoint: "/auth/forgot-password",
    method: "POST",
    body: payload,
    requireAuth: false,
  });
}

// 7. POST /auth/verify-reset-otp — 🔓 public — resetToken রিটার্ন করে
export async function verifyResetOtpAction(
  payload: VerifyResetOtpPayload
): Promise<ApiResult<VerifyResetOtpResponseData>> {
  return universalApi<VerifyResetOtpResponseData>({
    endpoint: "/auth/verify-reset-otp",
    method: "POST",
    body: payload,
    requireAuth: false,
  });
}

// 8. POST /auth/reset-password — 🔓 public — resetToken দিয়ে, OTP লাগে না
export async function resetPasswordAction(
  payload: ResetPasswordPayload
): Promise<ApiResult<{ message: string }>> {
  return universalApi<{ message: string }>({
    endpoint: "/auth/reset-password",
    method: "POST",
    body: payload,
    requireAuth: false,
  });
}

// 9. POST /auth/change-password — 🔒 logged-in — success হলে token invalid হয়ে যায়, তাই cookie clear করি
export async function changePasswordAction(
  payload: ChangePasswordPayload
): Promise<ApiResult<{ message: string }>> {
  const result = await universalApi<{ message: string }>({
    endpoint: "/auth/change-password",
    method: "POST",
    body: payload,
    requireAuth: true,
  });

  if (result.success) {
    await clearAuthCookies(); // doc: "Please login again" — force logout
  }
  return result;
}

// 10. POST /auth/create-admin — 🔒 SUPER_ADMIN only
export async function createAdminAction(
  payload: CreateAdminPayload
): Promise<ApiResult<CreateAdminResponseData>> {
  return universalApi<CreateAdminResponseData>({
    endpoint: "/auth/create-admin",
    method: "POST",
    body: payload,
    requireAuth: true,
  });
}

// Logout — doc-এ কোনো /auth/logout endpoint নেই, তাই শুধু নিজেদের cookie মুছে দিই
export async function logoutAction(): Promise<{ success: true; message: string }> {
  await clearAuthCookies();
  return { success: true, message: "Logged out successfully" };
}