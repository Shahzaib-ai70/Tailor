"use client";

import { useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { DemoNotice } from "@/components/ui/demo-notice";
import { formatPrice } from "@/lib/utils";

type CheckoutState = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  cardName: string;
};

const initialState: CheckoutState = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  country: "",
  cardName: "",
};

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutState, string>>
  >({});
  const [message, setMessage] = useState("");

  function validate() {
    const nextErrors: Partial<Record<keyof CheckoutState, string>> = {};

    if (items.length === 0) {
      setMessage("Add items to the cart before reviewing checkout.");
      return false;
    }

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Please enter the client name.";
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Please enter the delivery address.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "Please enter the city.";
    }

    if (!form.country.trim()) {
      nextErrors.country = "Please enter the country.";
    }

    if (!form.cardName.trim()) {
      nextErrors.cardName = "Please enter the cardholder name.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        noValidate
        className="space-y-6 border border-[rgba(46,16,101,0.1)] p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("");

          if (!validate()) {
            return;
          }

          setMessage(
            "Checkout details look complete. Demo mode only: no payment gateway was contacted and no order was placed.",
          );
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">Full Name</span>
            <input
              value={form.fullName}
              onChange={(event) =>
                setForm((current) => ({ ...current, fullName: event.target.value }))
              }
              className="field"
            />
            {errors.fullName ? <p className="form-error">{errors.fullName}</p> : null}
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
          <span className="form-label">Address</span>
          <input
            value={form.address}
            onChange={(event) =>
              setForm((current) => ({ ...current, address: event.target.value }))
            }
            className="field"
          />
          {errors.address ? <p className="form-error">{errors.address}</p> : null}
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="form-label">City</span>
            <input
              value={form.city}
              onChange={(event) =>
                setForm((current) => ({ ...current, city: event.target.value }))
              }
              className="field"
            />
            {errors.city ? <p className="form-error">{errors.city}</p> : null}
          </label>
          <label className="space-y-2">
            <span className="form-label">Country</span>
            <input
              value={form.country}
              onChange={(event) =>
                setForm((current) => ({ ...current, country: event.target.value }))
              }
              className="field"
            />
            {errors.country ? <p className="form-error">{errors.country}</p> : null}
          </label>
        </div>

        <label className="space-y-2">
          <span className="form-label">Cardholder Name</span>
          <input
            value={form.cardName}
            onChange={(event) =>
              setForm((current) => ({ ...current, cardName: event.target.value }))
            }
            className="field"
          />
          {errors.cardName ? <p className="form-error">{errors.cardName}</p> : null}
        </label>

        <button type="submit" className="luxe-button justify-center">
          Validate Checkout
        </button>

        {message ? (
          <p className="border border-[rgba(46,16,101,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(46,16,101,0.72)]">
            {message}
          </p>
        ) : null}
      </form>

      <aside className="space-y-6">
        <DemoNotice description="The checkout flow validates the form and presents totals, but payment processing, fraud checks, tax calculation, and order submission are not connected." />
        <div className="border border-[rgba(46,16,101,0.1)] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Checkout Summary
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
            <p>{items.length} line items</p>
            <p>Subtotal: {formatPrice(subtotal)}</p>
            <p>Shipping and taxes remain uncalculated in demo mode.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

