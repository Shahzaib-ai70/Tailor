"use client";

import { ShalwarKameezGallery } from "@/components/gallery/shalwar-kameez-gallery";
import { useGalleryAdmin } from "@/components/providers/gallery-admin-provider";

export function ManagedGallery() {
  const { items } = useGalleryAdmin();

  return <ShalwarKameezGallery items={items} />;
}

