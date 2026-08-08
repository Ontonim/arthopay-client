/**
 * Types mirroring the Arthopay Server API contract.
 * Keep this in sync with the backend docs (Response Format + User Module).
 */

// ---- Standard response envelope ----

export interface ApiErrorItem {
  path: string;
  message: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorSource?: ApiErrorItem[];
  stack?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ---- User / roles ----

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CREATOR" | "GUEST_USER";

export type Visibility = "public" | "onlyMe";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  role: UserRole;
  profileImage: string;
  coverImage: string;
  bio: string;
  address: string;
  socialLinks: SocialLink[];
  visibility: {
    mobile: Visibility;
    bio: Visibility;
    address: Visibility;
    socialLinks: Visibility;
  };
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  passwordChangedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Auth payloads ----

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface LoginPayload {
  // Backend allows login by email OR phone — send whichever the user typed.
  email?: string;
  mobile?: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: User;
  // refreshToken is set as an httpOnly cookie by the server, not returned here.
}

export interface RefreshTokenResponseData {
  accessToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
