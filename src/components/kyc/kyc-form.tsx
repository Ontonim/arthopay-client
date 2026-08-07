"use client";

import { useState, type FormEvent } from "react";
import { Building2, Mail, Phone, MapPin, Globe, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { NidUploadInput } from "@/components/kyc/nid-upload-input";
import { BrandingUploadInput } from "@/components/kyc/branding-upload-input";
import { submitKycAction, type SubmitKycPayload } from "@/app/actions/kyc/kyc-api";
import { cn } from "@/lib/utils";

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

// ---- Step definitions ----
// প্রতিটা step-এর সাথে তার নিজের field list বাঁধা, যাতে "Next"-এ শুধু ঐ
// step-এর field-গুলোই validate হয় — পুরো form একসাথে না।
const STEPS = [
  { title: "Business info", fields: ["businessName", "businessUsername", "businessEmail", "phoneNumber", "businessAddress", "bio"] },
  { title: "Branding", fields: ["businessLogo", "coverImage"] },
  { title: "Social", fields: ["facebookPageUrl", "instagram", "website"] },
  { title: "Identity (NID)", fields: ["nidFront", "nidBack"] },
] as const satisfies readonly { title: string; fields: readonly (keyof FormState)[] }[];

const TOTAL_STEPS = STEPS.length;

export function KycForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [step, setStep] = useState(0);
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

  /** একটা field-এর error বের করে (থাকলে) — validate() আর validateStep() দুইটাই এটা শেয়ার করে। */
  function fieldError<K extends keyof FormState>(field: K): string | undefined {
    switch (field) {
      case "businessName":
        return values.businessName.trim().length < 2 || values.businessName.trim().length > 100
          ? "Business name must be 2–100 characters"
          : undefined;
      case "businessUsername":
        return !/^[a-z0-9_]{3,30}$/i.test(values.businessUsername)
          ? "3–30 characters – only letters, numbers, and underscore"
          : undefined;
      case "businessEmail":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.businessEmail)
          ? "Enter a valid email address"
          : undefined;
      case "phoneNumber":
        return !/^01[3-9]\d{8}$/.test(values.phoneNumber)
          ? "Enter a valid BD mobile number, e.g. 01712345678"
          : undefined;
      case "businessAddress":
        return values.businessAddress.trim().length < 5 || values.businessAddress.trim().length > 300
          ? "Address must be 5–300 characters"
          : undefined;
      case "bio":
        return values.bio.length > 500 ? "Maximum 500 characters" : undefined;
      case "businessLogo":
        return values.businessLogo && !isValidUrl(values.businessLogo) ? "Enter a valid URL" : undefined;
      case "coverImage":
        return values.coverImage && !isValidUrl(values.coverImage) ? "Enter a valid URL" : undefined;
      case "facebookPageUrl":
        return !values.facebookPageUrl || !isValidUrl(values.facebookPageUrl)
          ? "Enter a valid Facebook page URL"
          : undefined;
      case "instagram":
        return values.instagram && !isValidUrl(values.instagram) ? "Enter a valid URL" : undefined;
      case "website":
        return values.website && !isValidUrl(values.website) ? "Enter a valid URL" : undefined;
      case "nidFront":
        return !values.nidFront ? "Upload NID front image" : undefined;
      case "nidBack":
        return !values.nidBack ? "Upload NID back image" : undefined;
      default:
        return undefined;
    }
  }

  function validateStep(stepIndex: number): boolean {
    const stepFields = STEPS[stepIndex].fields;
    const next: FieldErrors = {};
    for (const field of stepFields) {
      const err = fieldError(field);
      if (err) next[field] = err;
    }
    // এই step-এর সব field-এর error clear করে, শুধু যেগুলোতে এখনও ভুল আছে সেগুলো বসানো হয়।
    setErrors((prev) => {
      const updated = { ...prev };
      for (const field of stepFields) updated[field] = next[field];
      return updated;
    });
    return Object.keys(next).length === 0;
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    for (const s of STEPS) {
      for (const field of s.fields) {
        const err = fieldError(field);
        if (err) next[field] = err;
      }
    }
    setErrors(next);
    setConfirmError(!confirmed);
    return Object.keys(next).length === 0 && confirmed;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setFormError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setFormError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    // শেষ step-এ থাকলেও পুরো form-টাই validate করা হয়, কোনো আগের step-এর
    // ভুল থেকে গেলে সেই step-এ ফিরিয়ে দেওয়া হয়।
    if (!validate()) {
      const brokenStepIndex = STEPS.findIndex((s) => s.fields.some((f) => fieldError(f)));
      if (brokenStepIndex !== -1) setStep(brokenStepIndex);
      return;
    }

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <StepProgress step={step} />

      {formError && (
        <p className="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
          {formError}
        </p>
      )}

      {/* Step 1 – Business information */}
      <section className={cn("flex flex-col gap-4", step !== 0 && "hidden")}>
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

      {/* Step 2 – Branding */}
      <section className={cn("flex flex-col gap-4", step !== 1 && "hidden")}>
        <h3 className="font-display text-lg font-bold text-foreground">2. Branding</h3>
        <BrandingUploadInput
          label="Business logo"
          kind="business-logo"
          value={values.businessLogo}
          onChange={(url) => set("businessLogo", url)}
          error={errors.businessLogo}
        />
        <BrandingUploadInput
          label="Cover image"
          kind="cover-image"
          value={values.coverImage}
          onChange={(url) => set("coverImage", url)}
          error={errors.coverImage}
        />
      </section>

      {/* Step 3 – Social */}
      <section className={cn("flex flex-col gap-4", step !== 2 && "hidden")}>
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

      {/* Step 4 – Identity (NID) – uploaded directly to Cloudinary */}
      <section className={cn("flex flex-col gap-4", step !== 3 && "hidden")}>
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
      </section>

      {/* Navigation */}
      <div className="flex items-center gap-3 border-t-2 border-ink/10 pt-5">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="press flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink bg-surface-elevated px-5 py-3.5 text-sm font-bold text-foreground shadow-hard-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="press flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-signature py-3.5 text-sm font-bold text-primary-foreground shadow-hard"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <AuthButton loading={loading} disabled={!confirmed} className="w-full">
            {loading ? "Submitting…" : "Submit for verification"}
          </AuthButton>
        )}
      </div>
    </form>
  );
}

/** উপরের step progress bar — কোন step-এ আছি সেটা numbered dots + label দিয়ে দেখায়। */
function StepProgress({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex flex-1 items-center last:flex-none">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink text-xs font-bold shadow-hard-sm transition-colors",
                i < step
                  ? "bg-signature text-primary-foreground"
                  : i === step
                    ? "bg-surface-elevated text-foreground"
                    : "bg-surface-elevated text-muted-foreground/50"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-1.5 h-0.5 flex-1 rounded-full transition-colors",
                  i < step ? "bg-signature" : "bg-ink/10"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Step {step + 1} of {TOTAL_STEPS} — {STEPS[step].title}
      </p>
    </div>
  );
}