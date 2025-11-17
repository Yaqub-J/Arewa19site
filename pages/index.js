import Head from 'next/head';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import Banner from '../components/Banner';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import CallToAction from '../components/CallToAction';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import SocialMediaPopup from '../components/SocialMediaPopup';

export default function Home() {
  useEffect(() => {
    // Any page-specific JavaScript can go here

    // Initialize AOS again for this specific page if needed
    if (typeof window !== 'undefined') {
      const AOS = require('aos');
      AOS.refresh();
    }
  }, []);

  return (
    <div className="index-page">
      <Head>
        <title>Arewa19 Pyramid - Grassroots Movement for Arewa Mobilization</title>
        <meta name="description" content="A19 is mobilizing Arewa youth for political accountability, economic empowerment, and industrial progress. Join the grassroots movement demanding unity, integrity, and accountability from our leaders across 19 Northern states." />
        <meta name="keywords" content="Arewa19, Northern Nigeria, grassroots mobilization, political accountability, civic education, governance, youth empowerment, economic development, industrial revival" />
      </Head>

      <Header />

      <main className="main">
        <HeroSection />
        <StatsSection />
        <Banner />
        <AboutSection />
        <ServicesSection />
        <CallToAction />
        <TestimonialsSection />
        <ContactSection
          pageType="registration"
          sectionTitle="Registration"
          sectionDescription="Join our community"
          formSource="registration_page"
          includeMembershipType={false}
          useSimpleLayout={true}
        />
      </main>

      <Footer />

      {/* Social Media Follow Popup */}
      <SocialMediaPopup />
    </div>
  );
}
