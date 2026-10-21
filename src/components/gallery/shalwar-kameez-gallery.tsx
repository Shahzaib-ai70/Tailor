"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { GalleryCategory, GalleryItem } from "@/lib/site-data";
import { galleryCategories, products } from "@/lib/site-data";

type ShalwarKameezGalleryProps = {
  items: GalleryItem[];
};

type ActiveCategory = GalleryCategory | "All";

export function ShalwarKameezGallery({
  items,
}: ShalwarKameezGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return items;
    }

    return items.filter((item) => item.categories.includes(activeCategory));
  }, [activeCategory, items]);

  const activeItem = activeIndex === null ? null : filteredItems[activeIndex] ?? null;

  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeItem]);

  function openLightbox(index: number) {
    setActiveIndex(index);
    setZoomed(false);
  }

  function stepLightbox(direction: number) {
    if (activeIndex === null) {
      return;
    }

    const nextIndex =
      (activeIndex + direction + filteredItems.length) % filteredItems.length;
    setActiveIndex(nextIndex);
    setZoomed(false);
  }

  function selectCategory(category: ActiveCategory) {
    setActiveCategory(category);
    setActiveIndex(null);
    setZoomed(false);
  }

  function getGallerySummary(item: GalleryItem) {
    const matchingProduct = products.find((product) => product.slug === item.slug);

    if (matchingProduct) {
      return matchingProduct.summary;
    }

    return item.alt;
  }

  return (
    <div className="w-full space-y-10 overflow-x-hidden">
      <section className="space-y-5 overflow-hidden border border-[rgba(46,16,101,0.1)] px-5 py-5 sm:px-6">
        <div className="hidden flex-col gap-3 lg:flex lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Curated Categories
            </p>
            <p className="max-w-3xl text-sm leading-7 text-[rgba(46,16,101,0.64)]">
              Browse classic whites, occasionwear, stitching details, fabrics,
              and modern Pakistani menswear styles. Each card now uses actual
              Kameez Shalwar catalog imagery so customers can compare cuts,
              colors, and finishing details before ordering.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-[rgba(46,16,101,0.5)]">
            {filteredItems.length} styles shown
          </p>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex w-max min-w-full gap-3 pr-2">
            <FilterButton
              active={activeCategory === "All"}
              label="All Looks"
              onClick={() => selectCategory("All")}
            />
            {galleryCategories.map((category) => (
              <FilterButton
                key={category}
                active={activeCategory === category}
                label={category}
                onClick={() => selectCategory(category)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item, index) => (
          <article
            key={item.slug}
            className="group flex h-full min-w-0 flex-col overflow-hidden border border-[rgba(46,16,101,0.12)] bg-[rgba(124,58,237,0.04)] transition duration-500 hover:-translate-y-1 hover:border-[rgba(124,58,237,0.4)]"
          >
            <button
              type="button"
              onClick={() => openLightbox(index)}
              className="block w-full text-left"
              aria-label={`Open gallery image for ${item.title}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden border-b border-[rgba(46,16,101,0.1)] bg-[#f8f4ff]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
                  priority={index < 2}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(124,58,237,0.02)_35%,rgba(124,58,237,0.22)_100%)]" />
                <div className="absolute right-3 top-3 border border-[rgba(124,58,237,0.16)] bg-[rgba(255,255,255,0.9)] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-ivory)] sm:right-4 sm:top-4 sm:px-3">
                  Zoom
                </div>
              </div>
            </button>

            <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {item.primaryCategory}
                </p>
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h2 className="min-w-0 font-serif text-2xl leading-tight break-words text-[var(--color-ivory)] sm:text-3xl">
                    {item.title}
                  </h2>
                  {item.priceLabel ? (
                    <span className="pt-1 text-sm tracking-[0.12em] text-[var(--color-gold)] sm:shrink-0">
                      {item.priceLabel}
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="text-sm leading-6 text-[rgba(46,16,101,0.68)]">
                {getGallerySummary(item)}
              </p>

              <div className="flex flex-wrap gap-2">
                {item.categories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="border border-[rgba(46,16,101,0.12)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[rgba(46,16,101,0.55)]"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex min-w-0 flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-xs leading-6 text-[rgba(46,16,101,0.45)]">
                  {item.sourceLabel}
                </p>
                <Link href="/contact" className="luxe-link">
                  Stitch This Style
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filteredItems.length === 0 ? (
        <div className="border border-[rgba(46,16,101,0.1)] px-6 py-8 text-sm leading-7 text-[rgba(46,16,101,0.68)]">
          No styles match this category right now. Choose another filter to
          continue browsing the Shalwar Kameez reference gallery.
        </div>
      ) : null}

      {activeItem ? (
        <div className="fixed inset-0 z-50 bg-[rgba(7,7,7,0.92)] px-4 py-5 sm:px-8 sm:py-8">
          <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {activeItem.primaryCategory}
                </p>
                <h3 className="mt-2 font-serif text-3xl tracking-[0.08em] text-[var(--color-ivory)] sm:text-4xl">
                  {activeItem.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setZoomed((value) => !value)}
                  className="luxe-button-secondary"
                >
                  {zoomed ? "Normal View" : "Zoom Image"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveIndex(null);
                    setZoomed(false);
                  }}
                  className="luxe-button-secondary"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[72px_1fr_72px_320px] lg:items-center">
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                className="hidden h-18 w-18 items-center justify-center border border-[rgba(46,16,101,0.18)] text-sm uppercase tracking-[0.18em] text-[var(--color-ivory)] lg:inline-flex"
              >
                Prev
              </button>

              <div className="relative min-h-[360px] overflow-hidden border border-[rgba(46,16,101,0.12)] bg-[#f8f4ff]">
                <button
                  type="button"
                  onClick={() => setZoomed((value) => !value)}
                  className="absolute inset-0 z-10 cursor-zoom-in"
                  aria-label="Toggle image zoom"
                />
                <div
                  className={`absolute inset-0 transition duration-300 ${
                    zoomed ? "scale-[1.45]" : "scale-100"
                  }`}
                >
                  <Image
                    src={activeItem.image}
                    alt={activeItem.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => stepLightbox(1)}
                className="hidden h-18 w-18 items-center justify-center border border-[rgba(46,16,101,0.18)] text-sm uppercase tracking-[0.18em] text-[var(--color-ivory)] lg:inline-flex"
              >
                Next
              </button>

              <aside className="space-y-5 border border-[rgba(46,16,101,0.12)] p-5 sm:p-6">
                <p className="text-sm leading-7 text-[rgba(46,16,101,0.7)]">
                  {activeItem.alt}
                </p>
                <div className="space-y-2 text-xs uppercase tracking-[0.2em] text-[rgba(46,16,101,0.5)]">
                  <p>{activeItem.sourceLabel}</p>
                  {activeItem.priceLabel ? <p>{activeItem.priceLabel}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeItem.categories.map((category) => (
                    <span
                      key={category}
                      className="border border-[rgba(46,16,101,0.12)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[rgba(46,16,101,0.55)]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Link href="/contact" className="luxe-button justify-center">
                    Enquire For Stitching
                  </Link>
                  <Link href="/contact" className="luxe-button-secondary justify-center">
                    Contact For Details
                  </Link>
                </div>
              </aside>
            </div>

            <div className="flex justify-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                className="luxe-button-secondary"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(1)}
                className="luxe-button-secondary"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition ${
        active
          ? "border-[var(--color-gold)] bg-[rgba(124,58,237,0.12)] text-[var(--color-ivory)]"
          : "border-[rgba(46,16,101,0.12)] text-[rgba(46,16,101,0.6)] hover:border-[rgba(124,58,237,0.35)] hover:text-[var(--color-ivory)]"
      }`}
    >
      {label}
    </button>
  );
}

