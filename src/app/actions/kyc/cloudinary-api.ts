"use server";

import { createHash } from "crypto";

/**
 * NID front/back Cloudinary-তে সরাসরি (browser → Cloudinary) আপলোড হয়।
 *
 * ⚠️ Signature algorithm: Cloudinary account-ভেদে SHA-1 বা SHA-256 হতে পারে
 * (নতুন account-এ ডিফল্ট SHA-256)। Cloudinary Console → Settings → Security →
 * "Signature algorithm" দেখে .env.local-এ CLOUDINARY_SIGNATURE_ALGORITHM
 * বসাও — না দিলে sha1 ধরে নেওয়া হবে।
 */

export interface CloudinarySignatureData {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export async function getCloudinarySignatureAction(): Promise<CloudinarySignatureData> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const algorithm = (process.env.CLOUDINARY_SIGNATURE_ALGORITHM || "sha1") as
    | "sha1"
    | "sha256";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary env variables সেট করা নেই — .env.local চেক করো (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)"
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "arthopay/kyc-nid";

  // Cloudinary rule: sign করার প্যারামিটারগুলো alphabetically sort করে
  // key=value&key=value... বানিয়ে শেষে api_secret জোড়া দিয়ে hash নিতে হয়।
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash(algorithm).update(paramsToSign).digest("hex");

  return { timestamp, signature, apiKey, cloudName, folder };
}