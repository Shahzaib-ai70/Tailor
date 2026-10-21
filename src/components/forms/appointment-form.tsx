"use client";

import { useState } from "react";

import { DemoNotice } from "@/components/ui/demo-notice";
import { appointmentOptions } from "@/lib/site-data";

type FormState = {
  name: string;
  email: string;
  service: string;
  date: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  service: appointmentOptions[0] ?? "",
  date: "",
  notes: "",
};

export function AppointmentForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [message, setMessage] = useState("");

  function validate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please provide your name.";
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.date) {
      nextErrors.date = "Please select a preferred date.";
    }

    if (form.notes.trim().length < 12) {
      nextErrors.notes = "Please include a few details about the appointment.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        className="space-y-6 border border-[rgba(46,16,101,0.1)] p-6 sm:p-8"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("");

          if (!validate()) {
            return;
          }

          setMessage(
            "Validation passed. Demo mode only: your appointment request has not been transmitted to a live booking system.",
          );
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">Full Name</span>
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

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">Service</span>
            <select
              value={form.service}
              onChange={(event) =>
                setForm((current) => ({ ...current, service: event.target.value }))
              }
              className="field"
            >
              {appointmentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="form-label">Preferred Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
              className="field"
            />
            {errors.date ? <p className="form-error">{errors.date}</p> : null}
          </label>
        </div>

        <label className="space-y-2">
          <span className="form-label">Appointment Notes</span>
          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            rows={6}
            className="field min-h-36 resize-y"
            placeholder="Event timing, desired garments, cloth preferences, or fit concerns."
          />
          {errors.notes ? <p className="form-error">{errors.notes}</p> : null}
        </label>

        <button type="submit" className="luxe-button justify-center">
          Review Request
        </button>

        {message ? (
          <p className="border border-[rgba(46,16,101,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(46,16,101,0.72)]">
            {message}
          </p>
        ) : null}
      </form>

      <div className="space-y-6">
        <DemoNotice description="This form validates locally to demonstrate the booking flow. It does not contact a calendar, CRM, or scheduling provider." />
        <div className="border border-[rgba(46,16,101,0.1)] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            What To Expect
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
            <p>Initial consultations typically run 45 to 60 minutes.</p>
            <p>Bring references, event details, or existing garments if helpful.</p>
            <p>
              Bespoke projects usually require multiple fittings before final
              delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

