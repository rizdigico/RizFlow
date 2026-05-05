import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { sanitizeInput, cn } from "@/lib/utils";

const AUDIT_WEBHOOK = "https://riz-flow-mc-db.vercel.app/api/webhook/audit";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email address"),
  headache: z
    .string()
    .min(5, "Tell us a bit about your biggest challenge")
    .max(500, "Keep it brief — a sentence or two is fine"),
  consent: z.literal(true, { error: "You must agree to continue" }),
});

type FormData = z.infer<typeof schema>;

const consentLabel: ReactNode = (
  <span className="font-mono text-[10px] sm:text-xs text-slate-300 leading-tight">
    I agree to RizFlow's{" "}
    <a href="/privacy-terms" className="text-teal-400 hover:underline">
      Privacy Policy
    </a>{" "}
    and consent to being contacted.
  </span>
);

export function AuditForm({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const payload = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      headache: sanitizeInput(data.headache),
      consent: data.consent,
      // Legacy fields — send empty so webhook doesn't break
      agency: "",
      website: "",
      phone: "",
      referral: "audit-short-form",
    };

    try {
      const res = await fetch(AUDIT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Always redirect to booking page — even on server errors,
      // the Cal.com embed ensures users can still book a call
      navigate("/thank-you");
    } catch {
      // Network error — still redirect so they can book via Cal.com
      navigate("/thank-you");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">
          Your Name
        </label>
        <input
          placeholder="Jane Smith"
          className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-400 font-mono flex items-center gap-1">
            <span>{">"}</span> {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">
          Email Address
        </label>
        <input
          placeholder="jane@yourbusiness.com"
          type="email"
          className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-400 font-mono flex items-center gap-1">
            <span>{">"}</span> {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">
          What's your biggest operations headache?
        </label>
        <textarea
          placeholder="E.g. I spend 3 hours a day on manual order processing..."
          className="w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 py-3 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none min-h-[80px] resize-none"
          {...register("headache")}
        />
        {errors.headache && (
          <p className="text-xs text-red-400 font-mono flex items-center gap-1">
            <span>{">"}</span> {errors.headache.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 mt-4">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-sm border border-teal-500/30 bg-[#050A14] text-teal-500 focus:ring-cyan-400/20 focus:ring-offset-0 focus:ring-1 transition-all"
            {...register("consent")}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-mono">{consentLabel}</label>
          {errors.consent && (
            <p className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1">
              <span>{">"}</span> {errors.consent.message}
            </p>
          )}
        </div>
      </div>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-wider px-4 py-3 rounded-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="w-full font-mono uppercase tracking-widest mt-4"
        isLoading={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Get My Free Audit"}
      </Button>

      <p className="text-xs font-mono text-teal-500/60 text-center uppercase tracking-wider flex items-center justify-center gap-2 mt-4">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
        No spam. No commitment. Results in 24 hours.
      </p>
    </form>
  );
}

export function ContactDetails() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5">
      <div className="flex items-center gap-2 text-slate-300">
        <div className="w-8 h-8 rounded-sm bg-[#050A14] flex items-center justify-center border border-teal-500/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
          <EnvelopeIcon className="w-4 h-4 text-teal-400" />
        </div>
        <a
          href="mailto:main@rizflow.co"
          className="text-xs font-mono text-slate-300 hover:text-teal-400 transition-colors"
        >
          main@rizflow.co
        </a>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <div className="w-8 h-8 rounded-sm bg-[#050A14] flex items-center justify-center border border-teal-500/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
          <svg
            className="w-4 h-4 text-teal-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <a
          href="https://wa.me/6591817631"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-slate-300 hover:text-teal-400 transition-colors"
        >
          +65 9181-7631
        </a>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <div className="w-8 h-8 rounded-sm bg-[#050A14] flex items-center justify-center border border-teal-500/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
          <MapPinIcon className="w-4 h-4 text-teal-400" />
        </div>
        <span className="text-xs font-mono text-slate-300">Singapore 🇸🇬</span>
      </div>
    </div>
  );
}
