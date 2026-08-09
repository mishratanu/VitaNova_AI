import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import Solution from '../components/landing/Solution';
import Features from '../components/landing/Features';
import SafetyLayer from '../components/landing/SafetyLayer';
import PregnancyCare from '../components/landing/PregnancyCare';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      {/* SEO */}
      <title>VitaNova AI — Bilingual AI Health Triage for Rural India</title>
      <meta name="description" content="VitaNova AI is a bilingual (Hindi/English) AI-powered health triage assistant for rural India. Describe symptoms → AI asks questions → Get severity result → Take action." />

      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <SafetyLayer />
        <PregnancyCare />
      </main>
      <Footer />
    </>
  );
}
