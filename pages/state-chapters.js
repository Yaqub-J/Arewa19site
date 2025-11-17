import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';

export default function StateChapters() {
  const northernStates = [
    { name: 'Adamawa', capital: 'Yola', zone: 'North-East' },
    { name: 'Bauchi', capital: 'Bauchi', zone: 'North-East' },
    { name: 'Borno', capital: 'Maiduguri', zone: 'North-East' },
    { name: 'Gombe', capital: 'Gombe', zone: 'North-East' },
    { name: 'Taraba', capital: 'Jalingo', zone: 'North-East' },
    { name: 'Yobe', capital: 'Damaturu', zone: 'North-East' },
    { name: 'Benue', capital: 'Makurdi', zone: 'North-Central' },
    { name: 'Kogi', capital: 'Lokoja', zone: 'North-Central' },
    { name: 'Kwara', capital: 'Ilorin', zone: 'North-Central' },
    { name: 'Nasarawa', capital: 'Lafia', zone: 'North-Central' },
    { name: 'Niger', capital: 'Minna', zone: 'North-Central' },
    { name: 'Plateau', capital: 'Jos', zone: 'North-Central' },
    { name: 'FCT', capital: 'Abuja', zone: 'North-Central' },
    { name: 'Jigawa', capital: 'Dutse', zone: 'North-West' },
    { name: 'Kaduna', capital: 'Kaduna', zone: 'North-West' },
    { name: 'Kano', capital: 'Kano', zone: 'North-West' },
    { name: 'Katsina', capital: 'Katsina', zone: 'North-West' },
    { name: 'Kebbi', capital: 'Birnin Kebbi', zone: 'North-West' },
    { name: 'Sokoto', capital: 'Sokoto', zone: 'North-West' },
    { name: 'Zamfara', capital: 'Gusau', zone: 'North-West' }
  ];

  const zones = ['North-East', 'North-Central', 'North-West'];

  return (
    <div className="state-chapters-page">
      <Head>
        <title>State Chapters - Arewa19 Pyramid</title>
        <meta name="description" content="A19 operates across all 19 Northern states through community cells connecting local action to digital innovation" />
      </Head>

      <Header />

      <main className="main">
        {/* Page Title with margin for header */}
        <div style={{ marginTop: '60px' }}>
          <Banner />
        </div>

        {/* Intro Section */}
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12" data-aos="fade-up">
                <div className="section-title text-center">
                  <h2>19 Northern States Network</h2>
                  <p className="mt-3">
                    Arewa19 Pyramid operates through community cells across all 19 Northern states, connecting local grassroots action to digital innovation. Each state chapter serves as a hub for civic education, digital literacy training, and political mobilization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* States by Zone */}
        {zones.map((zone, index) => (
          <section key={zone} className="section" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="container">
              <h3 className="zone-header">{zone} Zone</h3>
              <div className="row gy-4">
                {northernStates
                  .filter(state => state.zone === zone)
                  .map((state, stateIndex) => (
                    <div key={state.name} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={stateIndex * 50}>
                      <div className="state-card">
                        <div className="d-flex align-items-center mb-3">
                          <div className="state-icon">
                            <i className="bi bi-geo-alt-fill"></i>
                          </div>
                          <div>
                            <h4 className="mb-1 card-title">{state.name} State</h4>
                            <p className="mb-0 text-muted small">{state.capital}</p>
                          </div>
                        </div>
                        <p className="card-description mb-3">Community cell active in {state.capital} and local government areas. Join our grassroots network mobilizing for change.</p>
                        <div className="d-flex gap-2">
                          <a href="/get-involved" className="btn btn-sm btn-enhanced">Join Chapter</a>
                          <a href="/community#contact" className="btn btn-sm btn-outline-enhanced">Contact</a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        ))}

        {/* How State Chapters Work */}
        <section className="section">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-12" data-aos="fade-up">
                <h3 className="mb-5 text-center">How Our State Chapters Work</h3>
              </div>

              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <h5 className="card-title">Community Cells</h5>
                  <p className="card-description">Local volunteer networks organizing civic education activities and community dialogues.</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto">
                    <i className="bi bi-megaphone"></i>
                  </div>
                  <h5 className="card-title">Advocacy Campaigns</h5>
                  <p className="card-description">State-level advocacy on governance accountability and political mobilization initiatives.</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto">
                    <i className="bi bi-calendar-event"></i>
                  </div>
                  <h5 className="card-title">Local Events</h5>
                  <p className="card-description">Regular meetups, training sessions, and community engagement activities.</p>
                </div>
              </div>

              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <h5 className="card-title">Impact Tracking</h5>
                  <p className="card-description">Data-driven monitoring of state-level civic participation and grassroots mobilization.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="call-to-action section dark-background">
          <img src="/assets/img/portfolio/IMG_3523.JPG" alt="Join State Chapter" />
          <div className="container">
            <div className="row justify-content-center" data-aos="zoom-in" data-aos-delay="100">
              <div className="col-xl-10">
                <div className="text-center">
                  <h3>Start or Join a Chapter in Your State</h3>
                  <p>Connect with fellow digital citizens and civic leaders in your state. Together, we're building a better Northern Nigeria.</p>
                  <a href="/get-involved" className="cta-btn">Get Involved</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
