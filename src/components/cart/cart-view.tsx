"use client";

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { DemoNotice } from "@/components/ui/demo-notice";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <DemoNotice description="Your cart is empty. Add pieces from the shop to preview the cart and checkout flow in demo mode." />
        <Link href="/shop" className="luxe-button w-fit">
          Return To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={`${item.slug}-${item.size}-${item.color}`}
            className="grid gap-4 border border-[rgba(46,16,101,0.1)] p-4 sm:grid-cols-[180px_1fr]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f4ff]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="180px"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-serif text-3xl tracking-[0.08em] text-[var(--color-ivory)]">
                    {item.name}
                  </h2>
                  <p className="text-sm leading-6 text-[rgba(46,16,101,0.62)]">
                    Color: {item.color}
                    <br />
                    Size: {item.size}
                  </p>
                </div>
                <p className="text-sm tracking-[0.16em] text-[var(--color-gold)]">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="space-y-2">
                  <span className="form-label">Quantity</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(
                        item.slug,
                        item.size,
                        item.color,
                        Math.max(1, Math.min(5, Number(event.target.value) || 1)),
                      )
                    }
                    className="field w-24"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug, item.size, item.color)}
                  className="text-sm uppercase tracking-[0.18em] text-[rgba(46,16,101,0.56)] transition hover:text-[var(--color-ivory)]"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="space-y-6">
        <div className="border border-[rgba(46,16,101,0.1)] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Order Summary
          </p>
          <div className="mt-6 flex items-center justify-between text-sm text-[rgba(46,16,101,0.7)]">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-[rgba(46,16,101,0.7)]">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <p className="mt-6 text-xs leading-6 text-[rgba(46,16,101,0.48)]">
            Taxes, shipping, and payment processing are not connected in this demo.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/checkout" className="luxe-button justify-center">
              Proceed To Checkout
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="luxe-button-secondary justify-center"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <DemoNotice description="Cart contents persist in local browser storage for demo purposes only and are not reserved against real inventory." />
      </aside>
    </div>
  );
}

