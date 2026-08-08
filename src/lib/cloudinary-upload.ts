import { getCloudinarySignatureAction, type KycUploadKind } from "@/app/actions/kyc/cloudinary-api";

/**
 * File নিয়ে সরাসরি Cloudinary-তে POST করে, আমাদের server bandwidth-এ কোনো
 * ভার পড়ে না — শুধু signature নিতে একবার server action কল হয়। `kind`
 * অনুযায়ী server-side ঠিক করে দেয় কোন folder-এ upload হবে (nid vs branding vs product)।
 */
export async function uploadKycImage(file: File, kind: KycUploadKind): Promise<string> {
  const { timestamp, signature, apiKey, cloudName, folder } =
    await getCloudinarySignatureAction(kind);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload ব্যর্থ হয়েছে");
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

/** পুরনো কলার-দের জন্য — NID front/back upload। */
export async function uploadNidImage(file: File): Promise<string> {
  return uploadKycImage(file, "nid-front");
}