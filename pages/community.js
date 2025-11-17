import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import TeamSection from '../components/TeamSection';
import ContactSection from '../components/ContactSection';

export default function Community() {
  return (
    <div className="starter-page-page">
      <Head>
        <title>Community - Arewa19 Pyramid</title>
        <meta name="description" content="Meet our team and join the A19 grassroots movement. Connect with civic leaders, activists, and change-makers mobilizing for Arewa's political and economic progress." />
        <meta name="keywords" content="Arewa19 community, Northern Nigeria leaders, grassroots mobilization, civic engagement, youth movement, political activism" />
      </Head>

      <Header />
      
      <main className="main">
        {/* Page Title with margin for header */}
        <div style={{ marginTop: '60px' }}>
          <Banner />
        </div>
        
        <TeamSection />
        <ContactSection 
          pageType="community"
          sectionTitle="Join Us"
          sectionDescription="Become a Member"
          formSource="community_page"
          includeMembershipType={true}
          useSimpleLayout={false}
        />
      </main>

      <Footer />
    </div>
  );
}
