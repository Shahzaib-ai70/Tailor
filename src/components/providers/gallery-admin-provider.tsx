"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  shalwarKameezGallery,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/site-data";

const STORAGE_KEY = "mian-tailor-gallery-admin-v1";

type GalleryAdminContextValue = {
  items: GalleryItem[];
  hydrated: boolean;
  saveItem: (item: GalleryItem, previousSlug?: string) => string;
  deleteItem: (slug: string) => void;
  resetItems: () => void;
  createDraftItem: () => GalleryItem;
};

const GalleryAdminContext = createContext<GalleryAdminContextValue | null>(null);

function cloneDefaultItems() {
  return shalwarKameezGallery.map((item) => ({
    ...item,
    categories: [...item.categories],
  }));
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildUniqueSlug(baseValue: string, items: GalleryItem[]) {
  const base = normalizeSlug(baseValue) || "gallery-item";
  let slug = base;
  let counter = 2;

  while (items.some((item) => item.slug === slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

function isGalleryItem(value: unknown): value is GalleryItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as GalleryItem;

  return Boolean(
    typeof item.slug === "string" &&
      typeof item.title === "string" &&
      typeof item.primaryCategory === "string" &&
      Array.isArray(item.categories) &&
      typeof item.image === "string" &&
      typeof item.alt === "string" &&
      typeof item.sourceLabel === "string",
  );
}

export function GalleryAdminProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<GalleryItem[]>(cloneDefaultItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let nextItems = cloneDefaultItems();

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as unknown;

        if (Array.isArray(parsed) && parsed.every(isGalleryItem)) {
          nextItems = parsed.map((item) => ({
            ...item,
            categories: [...item.categories],
          }));
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    const timer = window.setTimeout(() => {
      setItems(nextItems);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<GalleryAdminContextValue>(() => {
    return {
      items,
      hydrated,
      saveItem(item, previousSlug) {
        let savedSlug = "";

        setItems((currentItems) => {
          const normalizedItem: GalleryItem = {
            ...item,
            slug: normalizeSlug(item.slug) || buildUniqueSlug(item.title, currentItems),
            categories: Array.from(new Set([item.primaryCategory, ...item.categories])),
          };

          const withoutPrevious = currentItems.filter(
            (entry) => entry.slug !== (previousSlug ?? normalizedItem.slug),
          );

          const finalSlug = withoutPrevious.some(
            (entry) => entry.slug === normalizedItem.slug,
          )
            ? buildUniqueSlug(normalizedItem.slug, withoutPrevious)
            : normalizedItem.slug;

          const nextItem = {
            ...normalizedItem,
            slug: finalSlug,
          };

          savedSlug = nextItem.slug;

          return [nextItem, ...withoutPrevious];
        });

        return savedSlug;
      },
      deleteItem(slug) {
        setItems((currentItems) => currentItems.filter((item) => item.slug !== slug));
      },
      resetItems() {
        setItems(cloneDefaultItems());
      },
      createDraftItem() {
        return {
          slug: buildUniqueSlug("new-gallery-item", items),
          title: "",
          primaryCategory: "Classic Shalwar Kameez" as GalleryCategory,
          categories: ["Classic Shalwar Kameez" as GalleryCategory],
          image: "",
          alt: "",
          priceLabel: "",
          sourceLabel: "Uploaded by admin",
        };
      },
    };
  }, [hydrated, items]);

  return (
    <GalleryAdminContext.Provider value={value}>
      {children}
    </GalleryAdminContext.Provider>
  );
}

export function useGalleryAdmin() {
  const context = useContext(GalleryAdminContext);

  if (!context) {
    throw new Error("useGalleryAdmin must be used within GalleryAdminProvider");
  }

  return context;
}

