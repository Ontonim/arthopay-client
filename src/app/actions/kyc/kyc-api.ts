"use server";

import { universalApi, type ApiResult } from "../universal-api";
import type { KycStatus } from "../auth/auth-api";

/**
 * KYC module — Seller segment (Phase 1 — এই file-এ শুধু seller-এর ২টা endpoint)।
 * Admin-এর ৩টা endpoint (list / detail / review) আলাদা file-এ (Phase 2) যাবে।
 *
 * দুইটাই protected — Authorization header `universalApi` নিজেই cookie থেকে বসিয়ে দেয়।
 */

// ---- Types (ডকের Request/Response body অনুযায়ী) ----

export interface SubmitKycPayload {
  businessName: string;
  businessUsername: string;
  businessEmail: string;
  phoneNumber: string;
  businessAddress: string;
  bio?: string;
  businessLogo?: string;
  coverImage?: string;
  facebookPageUrl: string;
  instagram?: string;
  website?: string;
  productImages: string[]; // 3–5 URLs
  nidFront: string;
  nidBack: string;
  confirmed: true;
}

export interface SubmitKycResponseData {
  _id: string;
  businessName: string;
  businessUsername: string;
  status: KycStatus;
  submittedAt: string;
}

/** GET /kyc/me — এর ভিতরের পূর্ণ KYC record (submit করা থাকলেই আসে) */
export interface KycRecord {
  _id: string;
  businessName: string;
  businessUsername: string;
  businessEmail: string;
  phoneNumber: string;
  businessAddress: string;
  bio?: string;
  businessLogo?: string;
  coverImage?: string;
  facebookPageUrl: string;
  instagram?: string;
  website?: string;
  productImages: string[];
  nidFront: string;
  nidBack: string;
  status: KycStatus;
  submittedAt: string;
  rejectionReason?: string;
  submissionCount: number;
  reviewedAt?: string;
}

export interface MyKycData {
  status: KycStatus;
  kyc: KycRecord | null;
}

// ---- Actions ----

// 1. POST /kyc/submit — 🔒 SELLER — একবারই জমা দেওয়া যায়
export async function submitKycAction(
  payload: SubmitKycPayload
): Promise<ApiResult<SubmitKycResponseData>> {
  return universalApi<SubmitKycResponseData>({
    endpoint: "/kyc/submit",
    method: "POST",
    body: payload,
  });
}

// 2. GET /kyc/me — 🔒 SELLER — view-only, dashboard-এ ঢুকেই call করতে হবে
export async function getMyKycAction(): Promise<ApiResult<MyKycData>> {
  return universalApi<MyKycData>({
    endpoint: "/kyc/me",
    method: "GET",
  });
}