import type { Metadata } from "next";
import Link from "next/link";

import { ManagedGallery } from "@/components/gallery/managed-gallery";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Shalwar Kameez Gallery",
  description:
    "Premium men's Shalwar Kameez gallery with classic, formal, casual, wedding, and stitching detail inspiration for private orders.",
};

export default function GalleryPage() {
  return (
    <div className="pb-16 sm:pb-24">
      <PageHero
        eyebrow="Pakistani Menswear Gallery"
        title="Premium Shalwar Kameez references for stitching orders, fabric selection, and modern design details."
        description="Browse a dedicated image gallery covering classic whites and blacks, formal stitched outfits, casual cotton sets, wedding styling, fabric inspiration, and stitching detail references."
      />

      <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8">
          <ManagedGallery />
        </div>
      </section>

      <section className="border-t border-[rgba(46,16,101,0.08)] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="space-y-3">
            <span className="eyebrow">Place A Stitching Order</span>
            <h2 className="font-serif text-4xl leading-none tracking-[0.08em] text-[var(--color-ivory)] sm:text-5xl">
              Shortlist a design, then contact the atelier for sizing and fabric guidance.
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[rgba(46,16,101,0.68)]">
              Use this gallery as a premium catalog reference for custom
              Shalwar Kameez orders, designer adjustments, collar preferences,
              cuff details, and seasonal fabric recommendations.
            </p>
          </div>
          <Link href="/contact" className="luxe-button justify-center">
            Contact For Order
          </Link>
          <Link href="/contact" className="luxe-button-secondary justify-center">
            Ask For Details
          </Link>
        </div>
      </section>
    </div>
  );
}

