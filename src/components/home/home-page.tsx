import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/shop/product-card";
import {
  cityAtelierNotes,
  collections,
  products,
} from "@/lib/site-data";

const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

export function HomePage() {
  return (
    <div className="pb-16 sm:pb-24">
      <section className="border-b border-[rgba(46,16,101,0.08)] px-5 pt-10 pb-14 sm:px-8 lg:px-12 lg:pt-14 lg:pb-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-8">
            <span className="eyebrow">Pakistani Menswear House</span>
            <div className="space-y-6">
              <h1 className="font-serif text-5xl leading-[0.95] tracking-[0.08em] text-[var(--color-ivory)] sm:text-6xl xl:text-7xl">
                Premium Shalwar Kameez styles stitched for everyday elegance and formal occasions.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[rgba(46,16,101,0.72)] sm:text-lg">
                MIAN TAILOR and design focuses on Kameez Shalwar only:
                classic whites, textured designer cuts, festive occasionwear,
                and direct customer support for Pakistani menswear clients.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/gallery" className="luxe-button justify-center">
                View Gallery
              </Link>
              <Link href="/contact" className="luxe-button-secondary justify-center">
                Contact Us
              </Link>
            </div>

            <div className="grid gap-6 border-t border-[rgba(46,16,101,0.08)] pt-6 sm:grid-cols-3">
              {[
                ["Classic Colors", "White, black, cream, blue, taupe, and beige styles."],
                ["Custom Details", "Collars, cuffs, plackets, buttons, and fabric finishes."],
                ["Private Guidance", "Appointments for measurements, wedding styling, and stitching."],
              ].map(([title, copy]) => (
                <div key={title} className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gold)]">
                    {title}
                  </p>
                  <p className="text-sm leading-6 text-[rgba(46,16,101,0.62)]">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mian-motion-panel relative min-h-[440px] overflow-hidden border border-[rgba(46,16,101,0.1)] bg-[#f8f4ff]">
            <div className="mian-orb mian-orb-left" />
            <div className="mian-orb mian-orb-right" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(124,58,237,0.06)_0%,rgba(124,58,237,0.12)_35%,rgba(124,58,237,0.18)_100%)]" />
            <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-8">
              <div className="mian-wordmark-wrap text-center">
                <p className="mian-wordmark-main font-serif text-5xl tracking-[0.18em] text-[var(--color-ivory)] sm:text-6xl xl:text-7xl">
                  MIAN TAILOR
                </p>
                <p className="mian-wordmark-sub mt-4 text-sm tracking-[0.4em] text-[rgba(46,16,101,0.7)] sm:text-base">
                  and design
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(46,16,101,0.08)] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="eyebrow">Featured Pieces</span>
              <h2 className="font-serif text-4xl leading-none tracking-[0.08em] text-[var(--color-ivory)] sm:text-5xl">
                Featured Kameez Shalwar.
              </h2>
            </div>
            <Link href="/gallery" className="luxe-link">
              View Full Gallery
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-3">
          {collections.map((collection) => (
            <article
              key={collection.slug}
              className="group overflow-hidden border border-[rgba(46,16,101,0.1)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="space-y-4 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
                  {collection.season}
                </p>
                <h3 className="font-serif text-3xl tracking-[0.08em] text-[var(--color-ivory)]">
                  {collection.name}
                </h3>
                <p className="text-sm leading-7 text-[rgba(46,16,101,0.68)]">
                  {collection.description}
                </p>
                <ul className="space-y-2 text-sm text-[rgba(46,16,101,0.58)]">
                  {collection.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <Link href="/gallery" className="luxe-link">
                  View In Gallery
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[rgba(46,16,101,0.08)] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <span className="eyebrow">Bespoke Journey</span>
            <h2 className="font-serif text-4xl leading-none tracking-[0.08em] text-[var(--color-ivory)] sm:text-5xl">
              A custom stitching process shaped around your event and preferred cut.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[rgba(46,16,101,0.7)]">
              From fabric and collar selection to measurements and final
              finishing, each order is organized for clients who want a proper
              Shalwar Kameez fit instead of off-the-rack guesswork.
            </p>
            <div className="space-y-3 pt-4">
              {cityAtelierNotes.map((note) => (
                <p
                  key={note}
                  className="border-l border-[var(--color-gold)] pl-4 text-sm leading-7 text-[rgba(46,16,101,0.62)]"
                >
                  {note}
                </p>
              ))}
            </div>
            <Link href="/contact" className="luxe-button-secondary">
              Contact For Stitching
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              [
                "01",
                "Design Selection",
                "Choose your preferred Kameez Shalwar style, color, and category.",
              ],
              [
                "02",
                "Measurements",
                "Review fit preferences for collar shape, cuff finishing, and overall length.",
              ],
              [
                "03",
                "Fabric & Details",
                "Confirm fabric type, buttons, placket treatment, and event-specific styling.",
              ],
              [
                "04",
                "Delivery",
                "Finalize and deliver the stitched outfit with finishing notes and care guidance.",
              ],
            ].map(([step, title, copy]) => (
              <article
                key={step}
                className="border border-[rgba(46,16,101,0.1)] px-5 py-6"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
                  {step}
                </p>
                <h3 className="mt-4 font-serif text-2xl tracking-[0.08em] text-[var(--color-ivory)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[rgba(46,16,101,0.64)]">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

