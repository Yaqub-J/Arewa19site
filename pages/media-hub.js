import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import Link from 'next/link';

export default function MediaHub() {
  const mediaCategories = [
    {
      title: 'Articles & Reports',
      icon: 'bi-file-text',
      description: 'Policy briefs, governance reports, and thought leadership articles',
      items: [
        'State of Northern Nigeria Report 2025',
        'Digital Literacy Gap Analysis',
        'Civic Participation Trends',
        'Youth Leadership in Politics'
      ]
    },
    {
      title: 'Videos & Documentaries',
      icon: 'bi-camera-video',
      description: 'Visual storytelling showcasing our impact and Northern Nigeria narratives',
      items: [
        'A19 Movement Documentary',
        'Digital Citizen Stories',
        'State Chapter Highlights',
        'Leadership Training Series'
      ]
    },
    {
      title: 'Podcasts & Audio',
      icon: 'bi-mic',
      description: 'Conversations with leaders, activists, and change-makers',
      items: [
        'Arewa Voices Podcast',
        'Civic Education Series',
        'Leadership Conversations',
        'Community Dialogues'
      ]
    },
    {
      title: 'Infographics & Data',
      icon: 'bi-bar-chart',
      description: 'Data visualizations and infographics on governance and civic issues',
      items: [
        'Governance Scorecards',
        'Digital Literacy Maps',
        'Civic Participation Data',
        'State Performance Metrics'
      ]
    }
  ];

  return (
    <div className="media-hub-page">
      <Head>
        <title>Media Hub - Arewa19 Pyramid</title>
        <meta name="description" content="Explore A19's media library: articles, videos, podcasts, reports, and data visualizations on Northern Nigeria's transformation" />
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
                <h2>Media Hub</h2>
                <p className="lead mt-3">
                  Access our growing library of content documenting Northern Nigeria's transformation. From policy research to storytelling, we're reshaping narratives through information power.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mb-4" data-aos="fade-up">
                <h3 className="text-center mb-4">Featured Content</h3>
              </div>
            </div>
            <div className="row gy-4">
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <div className="program-card h-100">
                  <img src="/assets/img/portfolio/kad3.jpg" className="img-fluid" alt="Featured Report" />
                  <div className="program-content">
                    <span className="program-badge">Report</span>
                    <h5 className="card-title">State of Northern Nigeria 2025</h5>
                    <p className="card-description">Comprehensive analysis of governance, civic participation, and political mobilization across all 19 Northern states.</p>
                    <a href="#" className="btn btn-enhanced">Read Report</a>
                  </div>
                </div>
              </div>

              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                <div className="program-card h-100">
                  <img src="/assets/img/portfolio/IMG_3522.JPG" className="img-fluid" alt="Featured Video" />
                  <div className="program-content">
                    <span className="program-badge">Video</span>
                    <h5 className="card-title">Arewa19 Movement Documentary</h5>
                    <p className="card-description">Watch the inspiring story of how grassroots mobilization is transforming Northern Nigeria through political accountability and civic action.</p>
                    <a href="https://youtu.be/HhaPu3llSqg" target="_blank" rel="noopener noreferrer" className="btn btn-enhanced">Watch Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Media Categories */}
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mb-5" data-aos="fade-up">
                <h3 className="text-center">Content Library</h3>
                <p className="text-center text-muted">Explore our collection organized by media type</p>
              </div>
            </div>

            <div className="row gy-4">
              {mediaCategories.map((category, index) => (
                <div key={category.title} className="col-lg-6" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="media-card h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="card-icon">
                        <i className={`bi ${category.icon}`}></i>
                      </div>
                      <h4 className="mb-0 ms-3 card-title">{category.title}</h4>
                    </div>
                    <p className="card-description mb-3">{category.description}</p>
                    <ul className="list-unstyled">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="mb-2">
                          <i className="bi bi-chevron-right" style={{ color: 'var(--accent-color)' }}></i> <a href="#" className="text-decoration-none" style={{ color: 'var(--default-color)' }}>{item}</a>
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="btn btn-sm btn-outline-enhanced mt-3">View All</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Narrative Engineering Section */}
        <section className="section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-up">
                <img src="/assets/img/portfolio/kad4.jpg" className="img-fluid rounded shadow" alt="Narrative Engineering" />
              </div>
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                <h3>Narrative Engineering</h3>
                <p>
                  At Arewa19 Pyramid, we believe in the power of storytelling to challenge stereotypes and reshape perceptions. Our narrative engineering initiative uses data journalism, strategic communications, and digital storytelling to amplify positive narratives from Northern Nigeria.
                </p>
                <ul>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Data-driven storytelling</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Counter-narrative campaigns</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Brand Northern Nigeria initiative</li>
                  <li><i className="bi bi-check-circle-fill text-success"></i> Youth amplification programs</li>
                </ul>
                <Link href="/programs" className="btn btn-primary mt-3">Learn More</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center mb-5" data-aos="fade-up">
                <h3>Follow Our Social Media</h3>
                <p className="text-muted">Stay connected with our movement across platforms</p>
              </div>
            </div>
            <div className="row gy-4">
              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto" style={{ background: 'linear-gradient(135deg, #1DA1F2, #0c85d0)' }}>
                    <i className="bi bi-twitter"></i>
                  </div>
                  <h5 className="card-title">Twitter/X</h5>
                  <p className="card-description">Daily updates & civic conversations</p>
                  <a href="#" className="btn btn-sm btn-outline-enhanced">Follow</a>
                </div>
              </div>

              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto" style={{ background: 'linear-gradient(135deg, #4267B2, #365899)' }}>
                    <i className="bi bi-facebook"></i>
                  </div>
                  <h5 className="card-title">Facebook</h5>
                  <p className="card-description">Community engagement & events</p>
                  <a href="#" className="btn btn-sm btn-outline-enhanced">Like</a>
                </div>
              </div>

              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto" style={{ background: 'linear-gradient(135deg, #E4405F, #c13584)' }}>
                    <i className="bi bi-instagram"></i>
                  </div>
                  <h5 className="card-title">Instagram</h5>
                  <p className="card-description">Visual stories & impact</p>
                  <a href="#" className="btn btn-sm btn-outline-enhanced">Follow</a>
                </div>
              </div>

              <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div className="enhanced-card text-center">
                  <div className="card-icon mx-auto" style={{ background: 'linear-gradient(135deg, #FF0000, #cc0000)' }}>
                    <i className="bi bi-youtube"></i>
                  </div>
                  <h5 className="card-title">YouTube</h5>
                  <p className="card-description">Videos & documentaries</p>
                  <a href="https://youtu.be/HhaPu3llSqg" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-enhanced">Subscribe</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="call-to-action section dark-background">
          <img src="/assets/img/portfolio/Bau2.jpg" alt="Contribute Content" />
          <div className="container">
            <div className="row justify-content-center" data-aos="zoom-in" data-aos-delay="100">
              <div className="col-xl-10">
                <div className="text-center">
                  <h3>Contribute Your Story</h3>
                  <p>Have a story, research, or content to share? Help us amplify Northern Nigeria's positive narratives.</p>
                  <a href="/community#contact" className="cta-btn">Submit Content</a>
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
