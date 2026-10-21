"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { DemoNotice } from "@/components/ui/demo-notice";
import type { Product } from "@/lib/site-data";
import { formatPrice } from "@/lib/utils";

export function ProductConfigurator({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const { addItem } = useCart();

  const price = useMemo(() => formatPrice(product.price), [product.price]);

  return (
    <div className="space-y-8">
      <div className="space-y-4 border-b border-[rgba(46,16,101,0.08)] pb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
          {product.collection}
        </p>
        <h1 className="font-serif text-5xl leading-none tracking-[0.08em] text-[var(--color-ivory)]">
          {product.name}
        </h1>
        <p className="text-lg text-[var(--color-gold)]">{price}</p>
        <p className="max-w-2xl text-base leading-8 text-[rgba(46,16,101,0.7)]">
          {product.description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.22em] text-[rgba(46,16,101,0.45)]">
            Size
          </span>
          <select
            value={selectedSize}
            onChange={(event) => setSelectedSize(event.target.value)}
            className="field"
          >
            {product.sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </label>
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.22em] text-[rgba(46,16,101,0.45)]">
            Color
          </span>
          <select
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            className="field"
          >
            {product.colors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block max-w-[180px] space-y-3">
        <span className="text-xs uppercase tracking-[0.22em] text-[rgba(46,16,101,0.45)]">
          Quantity
        </span>
        <input
          type="number"
          min={1}
          max={5}
          value={quantity}
          onChange={(event) =>
            setQuantity(Math.max(1, Math.min(5, Number(event.target.value) || 1)))
          }
          className="field"
        />
      </label>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            addItem({
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
              size: selectedSize,
              color: selectedColor,
              quantity,
            });
            setFeedback(
              `Added ${quantity} item${quantity > 1 ? "s" : ""} in ${selectedColor}, size ${selectedSize}.`,
            );
          }}
          className="luxe-button w-full justify-center sm:w-auto"
        >
          Add To Cart
        </button>
        {feedback ? (
          <p className="text-sm leading-6 text-[rgba(46,16,101,0.72)]">
            {feedback}
          </p>
        ) : null}
      </div>

      <DemoNotice description="Selections update the local cart only. Inventory, payment authorization, and fulfillment integrations are not connected in this demo build." />

      <div className="grid gap-6 border-t border-[rgba(46,16,101,0.08)] pt-8 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Garment Details
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Materials
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
            {product.materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

