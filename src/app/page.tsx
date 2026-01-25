"use client";
import Navbar from "@/components/navbar";
import Hero from "@/sections/hero";
import LightRays from "@/components/light-rays";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <Hero />
      <LightRays
        raysOrigin="top-center"
        raysColor="#ea45ed"
        raysSpeed={1}
        lightSpread={0.8}
        rayLength={5}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0}
        distortion={0.01}
        className="custom-rays w-full h-full -z-1 absolute top-0"
        pulsating={false}
        fadeDistance={1}
        saturation={1}
      />
    </div>
  );
}
