"use server";

import { createHash } from "crypto";

/**
 * NID front/back Cloudinary-তে সরাসরি (browser → Cloudinary) আপলোড হয় — আমাদের
 * server-এ ফাইল আসে না, শুধু এই signature দিয়ে সেই আপলোডটা authorize করি।
 * তাই CLOUDINARY_API_SECRET কখনো client-এ যায় না, এই function-এর ভিতরেই থাকে।
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

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary env variables সেট করা নেই — .env.local চেক করো (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)"
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "arthopay/kyc-nid";

  // Cloudinary rule: sign করার প্যারামিটারগুলো alphabetically sort করে
  // key=value&key=value... বানিয়ে শেষে api_secret জোড়া দিয়ে SHA-1 নিতে হয়।
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(paramsToSign).digest("hex");

  return { timestamp, signature, apiKey, cloudName, folder };
}