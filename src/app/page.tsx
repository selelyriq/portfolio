"use client";

import LandingPage from "@/components/Landing/LandingPage";
import LayeredGallery from "@/components/Gallery/LayeredGallery";
import AboutSection from "@/components/About/AboutSection";

export default function Home() {
  return (
    <main>
      <LandingPage />
      <LayeredGallery />
      <AboutSection />
    </main>
  );
}
