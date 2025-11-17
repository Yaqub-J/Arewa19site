import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';

export default function Programs() {
  return (
    <div className="programs-page">
      <Head>
        <title>Programs - Arewa19 Pyramid</title>
        <meta name="description" content="Explore A19's programs: Political Accountability, Civic Education, Economic Empowerment, Leadership Academies, and Industrial Mobilization transforming Northern Nigeria" />
      </Head>

      <Header />

      <main className="main">
        {/* Page Title with margin for header */}
        <div style={{ marginTop: '60px' }}>
          <Banner />
        </div>

        {/* Programs Section */}
        <section id="programs" className="programs section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Our Programs</h2>
            <div><span>Transforming Northern Nigeria Through</span> <span className="description-title">Action</span></div>
          </div>

          <div className="container">
            {/* Political Accountability Program */}
            <div className="row gy-4 mb-5" data-aos="fade-up" data-aos-delay="100">
              <div className="col-lg-6">
                <div className="program-card">
                  <img src="/assets/img/portfolio/kad3.jpg" className="img-fluid" alt="Political Accountability" />
                </div>
              </div>
              <div className="col-lg-6 d-flex flex-column justify-content-center">
                <span className="program-badge">Core Program</span>
                <h3>Political Accountability & Governance Monitoring</h3>
                <p>
                  Demanding integrity and accountability from politicians through citizen-led governance monitoring, advocacy campaigns, and oversight mechanisms. We mobilize youth to track government performance, expose corruption, and hold leaders accountable to their promises.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Governance Scorecards & Performance Tracking</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Anti-Corruption Advocacy Campaigns</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Citizen-Led Oversight Mechanisms</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Political Promises Monitoring</li>
                </ul>
              </div>
            </div>

            {/* Leadership Academy */}
            <div className="row gy-4 mb-5" data-aos="fade-up" data-aos-delay="200">
              <div className="col-lg-6 order-lg-2">
                <div className="program-card">
                  <img src="/assets/img/portfolio/kad1.jpg" className="img-fluid" alt="Leadership Academy" />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1 d-flex flex-column justify-content-center">
                <span className="program-badge">Core Program</span>
                <h3>Political Leadership Academy</h3>
                <p>
                  Training the next generation of value-based political leaders through intensive leadership development programs. Our academy equips young leaders with the skills, ethics, and knowledge needed to drive progressive change and restore integrity to Northern Nigeria's politics.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Leadership Development Training</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Policy Analysis & Advocacy Skills</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Public Speaking & Communication</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Ethics & Value-Based Leadership</li>
                </ul>
              </div>
            </div>

            {/* Civic Education Program */}
            <div className="row gy-4 mb-5" data-aos="fade-up" data-aos-delay="300">
              <div className="col-lg-6">
                <div className="program-card">
                  <img src="/assets/img/portfolio/Bau2.jpg" className="img-fluid" alt="Civic Education" />
                </div>
              </div>
              <div className="col-lg-6 d-flex flex-column justify-content-center">
                <span className="program-badge">Core Program</span>
                <h3>Civic Education & Political Consciousness</h3>
                <p>
                  Building politically aware citizens through structured civic education campaigns, voter education drives, and governance literacy programs. We train community members to understand their rights, responsibilities, and the power of informed participation in democratic processes.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Voter Education & Registration Drives</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Governance Literacy Workshops</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Political Awareness Campaigns</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Community Dialogue Forums</li>
                </ul>
              </div>
            </div>

            {/* Economic Empowerment */}
            <div className="row gy-4 mb-5" data-aos="fade-up" data-aos-delay="400">
              <div className="col-lg-6 order-lg-2">
                <div className="program-card">
                  <img src="/assets/img/portfolio/IMG_3522.JPG" className="img-fluid" alt="Economic Empowerment" />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1 d-flex flex-column justify-content-center">
                <span className="program-badge">Economic Impact</span>
                <h3>Economic Empowerment & Entrepreneurship</h3>
                <p>
                  Reviving Arewa's economic potential through entrepreneurship support, skills training, and advocacy for pro-growth policies. We create pathways for youth economic participation, job creation, and sustainable livelihoods.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Entrepreneurship Training & Mentorship</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Skills Development Programs</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Access to Capital & Markets</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Economic Policy Advocacy</li>
                </ul>
              </div>
            </div>

            {/* Industrial Mobilization */}
            <div className="row gy-4 mb-5" data-aos="fade-up" data-aos-delay="500">
              <div className="col-lg-6">
                <div className="program-card">
                  <img src="/assets/img/portfolio/kad4.jpg" className="img-fluid" alt="Industrial Mobilization" />
                </div>
              </div>
              <div className="col-lg-6 d-flex flex-column justify-content-center">
                <span className="program-badge">Industrial Impact</span>
                <h3>Industrial Mobilization & Revival</h3>
                <p>
                  Championing the revival of Arewa's industrial base through policy advocacy, youth engagement in manufacturing, and strategic partnerships. We mobilize for the restoration of Northern Nigeria's once-thriving textile, agriculture, and manufacturing sectors.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Industrial Policy Advocacy</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Youth in Manufacturing Programs</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Reviving Local Industries Initiative</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Public-Private Partnership Development</li>
                </ul>
              </div>
            </div>

            {/* Research & Policy */}
            <div className="row gy-4 mb-5" data-aos="fade-up" data-aos-delay="600">
              <div className="col-lg-6 order-lg-2">
                <div className="program-card">
                  <img src="/assets/img/portfolio/maid1.jpg" className="img-fluid" alt="Research & Policy" />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1 d-flex flex-column justify-content-center">
                <span className="program-badge">Research & Data</span>
                <h3>Research & Policy Advocacy</h3>
                <p>
                  Leveraging data and research to inform policy decisions and advocate for progressive reforms. We produce evidence-based reports, governance scorecards, and policy briefs that drive accountability and change.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Policy Research & Analysis</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Governance Scorecards</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Data-Driven Advocacy Campaigns</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Partnership with Think Tanks</li>
                </ul>
              </div>
            </div>

            {/* Communication & Advocacy Tools */}
            <div className="row gy-4 mb-5" data-aos="fade-up" data-aos-delay="700">
              <div className="col-lg-6">
                <div className="program-card">
                  <img src="/assets/img/portfolio/Bau2.jpg" className="img-fluid" alt="Communication Tools" />
                </div>
              </div>
              <div className="col-lg-6 d-flex flex-column justify-content-center">
                <span className="program-badge">Support Tools</span>
                <h3>Communication Tools & Digital Literacy</h3>
                <p>
                  Equipping youth with modern communication skills and digital literacy as tools to amplify advocacy, organize grassroots campaigns, and hold leaders accountable. Technology serves our broader political and economic mobilization goals.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Strategic Communication Training</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Basic Digital Literacy Skills</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Advocacy Campaign Tools</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Storytelling for Social Change</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="call-to-action section dark-background">
          <img src="/assets/img/portfolio/IMG_3499.JPG" alt="Join Our Programs" />
          <div className="container">
            <div className="row justify-content-center" data-aos="zoom-in" data-aos-delay="100">
              <div className="col-xl-10">
                <div className="text-center">
                  <h3>Get Involved in Our Programs</h3>
                  <p>Whether you want to learn, volunteer, or partner with us, there's a place for you in our movement.</p>
                  <a href="/get-involved" className="cta-btn">Join the Movement</a>
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
