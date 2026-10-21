import type { Metadata } from "next";

import { GalleryAdminDashboard } from "@/components/admin/gallery-admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Panel",
  description:
    "Professional admin workspace for managing the MIAN TAILOR and design gallery.",
};

export default function AdminPage() {
  return <GalleryAdminDashboard />;
}

