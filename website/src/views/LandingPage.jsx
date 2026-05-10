import React from "react";
import Navbar from "../components/Navbar";
import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import Features from "./sections/Features";
import AppPreview from "./sections/AppPreview";
import Stats from "./sections/Stats";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <AppPreview />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
