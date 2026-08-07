"use client";

import { useState, type FormEvent } from "react";
import { Building2, Mail, Phone, MapPin, Image as ImageIcon, Globe } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { NidUploadInput } from "@/components/kyc/nid-upload-input";
import { submitKycAction, type SubmitKycPayload } from "@/app/actions/kyc/kyc-api";

interface FormState {
  businessName: string;
  businessUsername: string;
  businessEmail: string;
  phoneNumber: string;
  businessAddress: string;
  bio: string;
  businessLogo: string;
  coverImage: string;
  facebookPageUrl: string;
  instagram: string;
  website: string;
  nidFront: string;
  nidBack: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  businessName: "",
  businessUsername: "",
  businessEmail: "",
  phoneNumber: "",
  businessAddress: "",
  bio: "",
  businessLogo: "",
  coverImage: "",
  facebookPageUrl: "",
  instagram: "",
  website: "",
  nidFront: "",
  nidBack: "",
};

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function KycForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  }

  function validate(): boolean {
    const next: FieldErrors = {};

    if (values.businessName.trim().length < 2 || values.businessName.trim().length > 100) {
      next.businessName = "Business name must be 2–100 characters";
    }
    if (!/^[a-z0-9_]{3,30}$/i.test(values.businessUsername)) {
      next.businessUsername = "3–30 characters – only letters, numbers, and underscore";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.businessEmail)) {
      next.businessEmail = "Enter a valid email address";
    }
    if (!/^01[3-9]\d{8}$/.test(values.phoneNumber)) {
      next.phoneNumber = "Enter a valid BD mobile number, e.g. 01712345678";
    }
    if (values.businessAddress.trim().length < 5 || values.businessAddress.trim().length > 300) {
      next.businessAddress = "Address must be 5–300 characters";
    }
    if (values.bio.length > 500) {
      next.bio = "Maximum 500 characters";
    }
    if (values.businessLogo && !isValidUrl(values.businessLogo)) {
      next.businessLogo = "Enter a valid URL";
    }
    if (values.coverImage && !isValidUrl(values.coverImage)) {
      next.coverImage = "Enter a valid URL";
    }
    if (!values.facebookPageUrl || !isValidUrl(values.facebookPageUrl)) {
      next.facebookPageUrl = "Enter a valid Facebook page URL";
    }
    if (values.instagram && !isValidUrl(values.instagram)) {
      next.instagram = "Enter a valid URL";
    }
    if (values.website && !isValidUrl(values.website)) {
      next.website = "Enter a valid URL";
    }
    if (!values.nidFront) {
      next.nidFront = "Upload NID front image";
    }
    if (!values.nidBack) {
      next.nidBack = "Upload NID back image";
    }

    setErrors(next);
    setConfirmError(!confirmed);
    return Object.keys(next).length === 0 && confirmed;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: SubmitKycPayload = {
        businessName: values.businessName.trim(),
        businessUsername: values.businessUsername.trim().toLowerCase(),
        businessEmail: values.businessEmail.trim().toLowerCase(),
        phoneNumber: values.phoneNumber.trim(),
        businessAddress: values.businessAddress.trim(),
        bio: values.bio.trim() || undefined,
        businessLogo: values.businessLogo.trim() || undefined,
        coverImage: values.coverImage.trim() || undefined,
        facebookPageUrl: values.facebookPageUrl.trim(),
        instagram: values.instagram.trim() || undefined,
        website: values.website.trim() || undefined,
        // ⚠️ productImages will be handled separately in the "product upload" feature.
        // Currently sending an empty array – backend expects 3–5 URLs, so this may
        // return a 400 until that feature is integrated.
        productImages: [],
        nidFront: values.nidFront,
        nidBack: values.nidBack,
        confirmed: true,
      };

      const result = await submitKycAction(payload);

      if (!result.success) {
        if (result.errorSource?.length) {
          const fieldErrors: FieldErrors = {};
          for (const err of result.errorSource) {
            fieldErrors[err.path as keyof FieldErrors] = err.message;
          }
          setErrors(fieldErrors);
        }
        setFormError(result.message);
        return;
      }

      onSubmitted();
    } catch {
      setFormError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      {formError && (
        <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
          {formError}
        </p>
      )}

      {/* Section 1 – Business information */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg font-bold text-foreground">1. Business information</h3>
        <AuthInput
          label="Business name"
          name="businessName"
          placeholder="Rahim Fashion House"
          icon={<Building2 className="h-4 w-4" />}
          value={values.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          error={errors.businessName}
        />
        <AuthInput
          label="Business username"
          name="businessUsername"
          placeholder="rahim_fashion"
          value={values.businessUsername}
          onChange={(e) => set("businessUsername", e.target.value.replace(/\s/g, ""))}
          error={errors.businessUsername}
        />
        <AuthInput
          label="Business email"
          name="businessEmail"
          type="email"
          placeholder="info@rahimfashion.com"
          icon={<Mail className="h-4 w-4" />}
          value={values.businessEmail}
          onChange={(e) => set("businessEmail", e.target.value)}
          error={errors.businessEmail}
        />
        <AuthInput
          label="Phone number"
          name="phoneNumber"
          type="tel"
          placeholder="01712345678"
          icon={<Phone className="h-4 w-4" />}
          value={values.phoneNumber}
          onChange={(e) => set("phoneNumber", e.target.value.replace(/\s/g, ""))}
          error={errors.phoneNumber}
        />
        <AuthInput
          label="Business address"
          name="businessAddress"
          placeholder="House 42, Road 7, Mirpur DOHS, Dhaka 1216"
          icon={<MapPin className="h-4 w-4" />}
          value={values.businessAddress}
          onChange={(e) => set("businessAddress", e.target.value)}
          error={errors.businessAddress}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bio" className="text-sm font-bold text-foreground">
            Bio <span className="font-semibold text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            maxLength={500}
            placeholder="Premium quality panjabi and kurta for men."
            value={values.bio}
            onChange={(e) => set("bio", e.target.value)}
            className="rounded-2xl border-2 border-ink bg-surface-elevated px-4 py-3 text-sm font-semibold text-foreground shadow-hard-sm outline-none placeholder:text-muted-foreground/50 focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-hard"
          />
          {errors.bio && <p className="text-xs font-semibold text-danger">{errors.bio}</p>}
        </div>
      </section>

      {/* Section 2 – Branding */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg font-bold text-foreground">2. Branding</h3>
        <AuthInput
          label="Business logo URL"
          name="businessLogo"
          placeholder="https://cdn.example.com/logo.jpg"
          icon={<ImageIcon className="h-4 w-4" />}
          value={values.businessLogo}
          onChange={(e) => set("businessLogo", e.target.value)}
          error={errors.businessLogo}
        />
        <AuthInput
          label="Cover image URL"
          name="coverImage"
          placeholder="https://cdn.example.com/cover.jpg"
          icon={<ImageIcon className="h-4 w-4" />}
          value={values.coverImage}
          onChange={(e) => set("coverImage", e.target.value)}
          error={errors.coverImage}
        />
      </section>

      {/* Section 3 – Social */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg font-bold text-foreground">3. Social</h3>
        <AuthInput
          label="Facebook page URL"
          name="facebookPageUrl"
          placeholder="https://facebook.com/rahimfashionhouse"
          icon={<FaFacebook className="h-4 w-4" />}
          value={values.facebookPageUrl}
          onChange={(e) => set("facebookPageUrl", e.target.value)}
          error={errors.facebookPageUrl}
        />
        <AuthInput
          label="Instagram URL"
          name="instagram"
          placeholder="https://instagram.com/rahimfashion"
          icon={<FaInstagram className="h-4 w-4" />}
          value={values.instagram}
          onChange={(e) => set("instagram", e.target.value)}
          error={errors.instagram}
        />
        <AuthInput
          label="Website URL"
          name="website"
          placeholder="https://rahimfashion.com"
          icon={<Globe className="h-4 w-4" />}
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
          error={errors.website}
        />
      </section>

      {/* Section 4 – Identity (NID) – uploaded directly to Cloudinary */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-lg font-bold text-foreground">4. Identity (NID)</h3>
        <NidUploadInput
          label="NID front"
          value={values.nidFront}
          onChange={(url) => set("nidFront", url)}
          error={errors.nidFront}
        />
        <NidUploadInput
          label="NID back"
          value={values.nidBack}
          onChange={(url) => set("nidBack", url)}
          error={errors.nidBack}
        />
      </section>

      <div className="flex flex-col gap-1.5 border-t-2 border-ink/10 pt-5">
        <label className="flex cursor-pointer items-start gap-2.5 text-xs font-semibold leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked);
              setConfirmError(false);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-2 border-ink accent-signature"
          />
          I confirm that all the above information is correct. After submission, I wont be able to edit it myself — if there is any mistake, I must contact the admin.
        </label>
        {confirmError && <p className="text-xs font-semibold text-danger">Check to continue</p>}
      </div>

      <AuthButton loading={loading} disabled={!confirmed}>
        {loading ? "Submitting…" : "Submit for verification"}
      </AuthButton>
    </form>
  );
}