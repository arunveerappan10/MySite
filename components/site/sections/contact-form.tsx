"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitEnquiry } from "./contact-actions";
import { TurnstileWidget } from "./turnstile-widget";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", turnstileToken: "" },
  });

  async function onSubmit(data: ContactInput) {
    setServerError(null);
    const result = await submitEnquiry(data);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-7 space-y-5">
      <FormField id="name" label="Full name" registration={register("name")} error={errors.name?.message} disabled={sent} />
      <FormField
        id="email"
        label="Work email"
        type="email"
        registration={register("email")}
        error={errors.email?.message}
        disabled={sent}
      />
      <FormField
        id="message"
        label="How can I help?"
        textarea
        registration={register("message")}
        error={errors.message?.message}
        disabled={sent}
      />
      {!sent && <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token ?? "")} />}
      {errors.turnstileToken && (
        <p role="alert" className="text-xs text-destructive">
          {errors.turnstileToken.message}
        </p>
      )}
      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={sent || isSubmitting}
        className="group inline-flex items-center gap-2 border border-foreground rounded-full px-5 py-2.5 text-sm hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors disabled:opacity-60"
      >
        {sent ? "Message received — I'll respond shortly" : isSubmitting ? "Sending…" : "Send inquiry"}
        {!sent && !isSubmitting && (
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </button>
    </form>
  );
}

function FormField({
  id,
  label,
  type = "text",
  textarea,
  registration,
  error,
  disabled,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  registration: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
}) {
  const errorId = `${id}-error`;
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

  return (
    <label htmlFor={id} className="block group">
      <span className="font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          id={id}
          rows={5}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`mt-2 w-full bg-transparent border-b border-border focus:border-primary py-2 text-foreground resize-none transition-colors disabled:opacity-60 ${focusRing}`}
          {...registration}
        />
      ) : (
        <input
          id={id}
          type={type}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`mt-2 w-full bg-transparent border-b border-border focus:border-primary py-2 text-foreground transition-colors disabled:opacity-60 ${focusRing}`}
          {...registration}
        />
      )}
      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-xs text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
