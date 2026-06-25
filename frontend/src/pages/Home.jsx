import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import Footer from '../components/common/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
}