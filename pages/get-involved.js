import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import ContactSection from '../components/ContactSection';

export default function GetInvolved() {
  return (
    <div className="get-involved-page">
      <Head>
        <title>Get Involved - Arewa19 Pyramid</title>
        <meta name="description" content="Join the Arewa19 movement as a digital citizen, volunteer, partner, or supporter. Multiple pathways to help transform Northern Nigeria" />
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
              <div className="col-lg-12 text-center" data-aos="fade-up">
                <h2>Join the Movement</h2>
                <p className="lead mt-3">
                  There are many ways to be part of the Arewa19 Pyramid movement. Whether you're a student, professional, activist, or concerned citizen, there's a place for you in our network of 1 million digital citizens.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ways to Get Involved */}
        <section className="section light-background">
          <div className="container">
            <div className="row gy-4">
              {/* Become a Member */}
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-person-check-fill" style={{ fontSize: '2.5rem', color: '#0d6efd', marginRight: '15px' }}></i>
                      <h4 className="mb-0">Become a Member</h4>
                    </div>
                    <p>
                      Join our network of digital citizens across all 19 Northern states. Get access to training programs, civic education resources, and connect with like-minded reformers.
                    </p>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check-circle-fill text-success"></i> Access to leadership training</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Digital literacy workshops</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> State chapter membership</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Monthly newsletters & updates</li>
                    </ul>
                    <a href="#registration" className="btn btn-primary mt-3">Register Now</a>
                  </div>
                </div>
              </div>

              {/* Volunteer */}
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-people-fill" style={{ fontSize: '2.5rem', color: '#0d6efd', marginRight: '15px' }}></i>
                      <h4 className="mb-0">Volunteer</h4>
                    </div>
                    <p>
                      Contribute your time, skills, and energy to our programs. From organizing community events to content creation, there are many ways to make an impact.
                    </p>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check-circle-fill text-success"></i> Event coordination & facilitation</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Content creation & social media</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Training & mentorship</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Research & data collection</li>
                    </ul>
                    <a href="#registration" className="btn btn-primary mt-3">Volunteer Today</a>
                  </div>
                </div>
              </div>

              {/* Partner With Us */}
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-briefcase-fill" style={{ fontSize: '2.5rem', color: '#0d6efd', marginRight: '15px' }}></i>
                      <h4 className="mb-0">Partner With Us</h4>
                    </div>
                    <p>
                      Organizations, NGOs, tech companies, and academic institutions can collaborate with us to amplify impact across Northern Nigeria.
                    </p>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check-circle-fill text-success"></i> Program co-creation & funding</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Technology & infrastructure support</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Research collaborations</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Capacity building partnerships</li>
                    </ul>
                    <a href="#registration" className="btn btn-primary mt-3">Explore Partnerships</a>
                  </div>
                </div>
              </div>

              {/* Diaspora Network */}
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-globe" style={{ fontSize: '2.5rem', color: '#0d6efd', marginRight: '15px' }}></i>
                      <h4 className="mb-0">Join Diaspora Network</h4>
                    </div>
                    <p>
                      Connect with Northerners abroad who are passionate about transforming the region. Contribute remotely through advocacy, fundraising, and knowledge sharing.
                    </p>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check-circle-fill text-success"></i> Remote participation in programs</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> International advocacy</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Fundraising & resource mobilization</li>
                      <li><i className="bi bi-check-circle-fill text-success"></i> Skills transfer & mentorship</li>
                    </ul>
                    <a href="#registration" className="btn btn-primary mt-3">Join Diaspora</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits of Joining */}
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center mb-5" data-aos="fade-up">
                <h3>Why Join Arewa19 Pyramid?</h3>
                <p className="lead">Be part of a movement that's reshaping Northern Nigeria's future</p>
              </div>
            </div>
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="text-center p-4">
                  <i className="bi bi-graph-up-arrow" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
                  <h5 className="mt-3">Personal Growth</h5>
                  <p>Develop leadership, digital, and civic engagement skills that will serve you throughout life.</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="text-center p-4">
                  <i className="bi bi-network-wired" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
                  <h5 className="mt-3">Network Building</h5>
                  <p>Connect with thousands of young leaders, innovators, and change-makers across Northern Nigeria.</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="text-center p-4">
                  <i className="bi bi-trophy" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
                  <h5 className="mt-3">Make Real Impact</h5>
                  <p>Be part of tangible change in civic participation, governance accountability, and digital transformation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <ContactSection
          pageType="get_involved"
          sectionTitle="Register to Join"
          sectionDescription="Fill out the form below to become part of the Arewa19 movement"
          formSource="get_involved_page"
          includeMembershipType={true}
          useSimpleLayout={false}
        />
      </main>

      <Footer />
    </div>
  );
}
