import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pb-16 sm:pb-24">
      <PageHero
        eyebrow="House Story"
        title="A premium Shalwar Kameez house focused on custom stitching, clean presentation, and Pakistani menswear."
        description="MIAN TAILOR and design centers its identity around Kameez Shalwar only, combining gallery browsing, customer enquiries, and premium eastern-wear presentation."
      />

      <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <span className="eyebrow">Philosophy</span>
            <h2 className="font-serif text-4xl leading-none tracking-[0.08em] text-[var(--color-ivory)] sm:text-5xl">
              Built around cut, comfort, and traditional detail.
            </h2>
            <p className="text-base leading-8 text-[rgba(46,16,101,0.7)]">
              The focus is simple: present Kameez Shalwar in a cleaner, more
              premium way while helping customers compare fabrics, colors,
              collars, cuffs, and occasion-specific designs before ordering.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              ["Shalwar Kameez First", "All featured products, collections, and imagery now focus on eastern menswear only."],
              ["Premium Presentation", "Layouts stay clean and high-end while highlighting real Kameez Shalwar styles."],
              ["Order Guidance", "Customers can shortlist designs and contact for stitching, fabrics, and size advice."],
            ].map(([title, description]) => (
              <article
                key={title}
                className="border border-[rgba(46,16,101,0.1)] px-5 py-6"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gold)]">
                  {title}
                </p>
                <p className="mt-4 text-sm leading-7 text-[rgba(46,16,101,0.64)]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

