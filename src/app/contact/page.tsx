import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="pb-16 sm:pb-24">
      <PageHero
        eyebrow="Client Services"
        title="Contact the atelier for stitching orders, private consultations, and wardrobe enquiries."
        description="Use the contact form to reference gallery looks, request custom Shalwar Kameez stitching, or discuss styling and fitting details. The interface validates inputs without pretending to submit to a live backend."
      />

      <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

