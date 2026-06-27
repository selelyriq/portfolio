"use client";

import LandingPage from "@/components/Landing/LandingPage";
import TransitionSection from "@/components/Landing/TransitionSection";
import LayeredGallery from "@/components/Gallery/LayeredGallery";

export default function Home() {
  return (
    <main>
      <LandingPage />
      <TransitionSection />
      <LayeredGallery />
    </main>
  );
}
