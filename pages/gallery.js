import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import DriveGallerySection from '../components/DriveGallerySection';

export default function Gallery() {
  return (
    <div className="starter-page-page">
      <Head>
        <title>Gallery - Arewa19 Pyramid</title>
        <meta name="description" content="Explore our gallery of civic education programs, community events, and movement activities across 19 Northern states" />
        <meta name="keywords" content="Arewa19 gallery, Northern Nigeria events, civic programs, community activities, movement photos" />
      </Head>

      <Header />
      
      <main className="main">
        {/* Page Title with margin for header */}
        <div style={{ marginTop: '60px' }}>
          <Banner />
        </div>
        
        {/* Gallery Section - using Google Drive images */}
        <DriveGallerySection />
      </main>

      <Footer />
    </div>
  );
}
