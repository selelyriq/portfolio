"use client";

import { useEffect } from "react";
import LandingPage from "@/components/Landing/LandingPage";
import LayeredGallery from "@/components/Gallery/LayeredGallery";
import AboutSection from "@/components/About/AboutSection";

export default function Home() {
  useEffect(() => {
    console.log("[page] React hydrated — useEffect running");
  }, []);
  return (
    <main>
      <LandingPage />
      <LayeredGallery />
      <AboutSection />
    </main>
  );
}
