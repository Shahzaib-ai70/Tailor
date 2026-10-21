"use client";

import { useState } from "react";

import { useAdminSettings } from "@/components/providers/admin-settings-provider";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const { service, whatsapp, submitCustomerMessage } = useAdminSettings();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormState, string>>
  >({});
  const [message, setMessage] = useState("");

  const whatsappHref = `https://wa.me/${whatsapp.number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    whatsapp.defaultMessage,
  )}`;

  function validate() {
    const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please provide your name.";
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Please add a subject.";
    }

    if (form.message.trim().length < 20) {
      nextErrors.message = "Please share more detail so the atelier can respond.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        noValidate
        className="space-y-6 border border-[rgba(46,16,101,0.1)] p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("");

          if (!validate()) {
            return;
          }

          submitCustomerMessage({
            name: form.name,
            email: form.email,
            text: `Subject: ${form.subject}\n\n${form.message}`,
          });

          setForm(initialState);
          setErrors({});
          setMessage(
            "Your message was sent to customer service and is now visible in the admin panel inbox.",
          );
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">Name</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              className="field"
            />
            {errors.name ? <p className="form-error">{errors.name}</p> : null}
          </label>
          <label className="space-y-2">
            <span className="form-label">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className="field"
            />
            {errors.email ? <p className="form-error">{errors.email}</p> : null}
          </label>
        </div>

        <label className="space-y-2">
          <span className="form-label">Subject</span>
          <input
            value={form.subject}
            onChange={(event) =>
              setForm((current) => ({ ...current, subject: event.target.value }))
            }
            className="field"
          />
          {errors.subject ? <p className="form-error">{errors.subject}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="form-label">Message</span>
          <textarea
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({ ...current, message: event.target.value }))
            }
            rows={7}
            className="field min-h-40 resize-y"
          />
          {errors.message ? <p className="form-error">{errors.message}</p> : null}
        </label>

        <button type="submit" className="luxe-button justify-center">
          Review Message
        </button>

        {message ? (
          <p className="border border-[rgba(46,16,101,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(46,16,101,0.72)]">
            {message}
          </p>
        ) : null}
      </form>

      <div className="space-y-6">
        <div className="border border-[rgba(46,16,101,0.1)] p-6 sm:p-8 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Live Inbox
          </p>
          <p className="mt-5">
            Contact messages go directly to the admin customer service inbox.
          </p>
        </div>
        <div className="border border-[rgba(46,16,101,0.1)] p-6 sm:p-8 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Customer Service Live
          </p>
          <p className="mt-5 text-[var(--color-ivory)]">{service.supportHeadline}</p>
          <p>{service.supportStatus}</p>
          <p>{service.supportHours}</p>
          <p>{service.responseTime}</p>
          <p>{service.assistantName}</p>
        </div>
        <div className="border border-[rgba(46,16,101,0.1)] p-6 sm:p-8 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            WhatsApp Customer
          </p>
          <p className="mt-5">{whatsapp.label}</p>
          <p>{whatsapp.number}</p>
          {whatsapp.enabled ? (
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="luxe-button mt-5 justify-center">
              {whatsapp.buttonText}
            </a>
          ) : (
            <p className="mt-5 text-[rgba(46,16,101,0.45)]">
              WhatsApp contact is currently disabled from admin settings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

