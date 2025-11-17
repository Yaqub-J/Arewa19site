import { useEffect } from 'react';
import Link from 'next/link';

const HeroSection = () => {
  useEffect(() => {
    // Initialize Bootstrap carousel
    if (typeof window !== 'undefined') {
      const initCarousel = async () => {
        try {
          // Wait for Bootstrap to be available
          const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');

          const carouselElement = document.querySelector('#hero-carousel');
          if (carouselElement) {
            // Initialize carousel
            new bootstrap.Carousel(carouselElement, {
              interval: 3000,
              ride: 'carousel',
              pause: 'hover',
              wrap: true
            });
          }
        } catch (error) {
          console.error('Error initializing carousel:', error);
        }
      };

      initCarousel();
    }
  }, []);

  return (
    <section id="hero" className="hero section dark-background">
      <div id="hero-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-item active">
          <img src="/assets/img/slider1.jpg" alt="Grassroots Political Mobilization" />
          <div className="carousel-container">
            <h2>Grassroots Political Mobilization<br /></h2>
            <p>Rallying Arewa Youth for Unity, Integrity, and Accountability</p>
            <Link href="#about" className="btn-get-started">Join the Movement</Link>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/assets/img/slider2.jpg" alt="Economic & Industrial Empowerment" />
          <div className="carousel-container">
            <h2>Economic & Industrial Empowerment</h2>
            <p>Reviving Arewa's Industrial and Economic Potential</p>
            <Link href="#about" className="btn-get-started">Learn More</Link>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/assets/img/slider3.jpg" alt="Governance Accountability" />
          <div className="carousel-container">
            <h2>Governance Accountability</h2>
            <p>Holding Politicians Accountable for Arewa's Progress</p>
            <Link href="#about" className="btn-get-started">Explore Our Impact</Link>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

        <div className="carousel-indicators">
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
