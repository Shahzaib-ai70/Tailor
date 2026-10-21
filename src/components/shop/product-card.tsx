import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/site-data";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col border border-[rgba(46,16,101,0.12)] bg-[rgba(124,58,237,0.04)] transition duration-500 hover:-translate-y-1 hover:border-[rgba(124,58,237,0.4)]">
      <div className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden border-b border-[rgba(46,16,101,0.1)] bg-[#f8f4ff]">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          {product.badge ? (
            <span className="absolute left-4 top-4 border border-[rgba(124,58,237,0.22)] bg-[rgba(255,255,255,0.9)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--color-ivory)]">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(46,16,101,0.45)]">
              {product.collection}
            </p>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-2xl leading-tight text-[var(--color-ivory)]">
                {product.name}
              </h3>
              <span className="text-sm tracking-[0.12em] text-[var(--color-gold)]">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
          <p className="text-sm leading-6 text-[rgba(46,16,101,0.68)]">
            {product.summary}
          </p>
          <Link
            href="/contact"
            className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-ivory)]"
          >
            Enquire Now
            <span className="h-px w-10 bg-[rgba(46,16,101,0.35)] transition duration-500 group-hover:w-16 group-hover:bg-[var(--color-gold)]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

