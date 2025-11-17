import { useEffect } from 'react';
import Link from 'next/link';

const AboutSection = () => {
  useEffect(() => {
    // Initialize GLightbox if available
    if (typeof window !== 'undefined') {
      import('glightbox').then(({ default: GLightbox }) => {
        const glightbox = GLightbox({
          selector: '.glightbox'
        });
      }).catch(console.error);
    }
  }, []);

  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-5 position-relative" data-aos="fade-up" data-aos-delay="200">
            <img src="/assets/img/about.jpg" className="img-fluid" alt="About Arewa19" />
            <a href="https://youtu.be/HhaPu3llSqg" className="glightbox pulsating-play-btn"></a>
          </div>

          <div className="col-lg-7 content ps-lg-4" data-aos="fade-up" data-aos-delay="100">
            <h3>About Arewa19 Pyramid</h3>
            <p>
              Arewa19 Pyramid (A19) is a grassroots socio-political movement mobilizing Arewa youth to demand accountability, unity, and integrity from our leaders. We are a network of young leaders, reformers, and activists dedicated to reviving Northern Nigeria industrially, technologically, politically, and economically. We believe that Arewa's progress depends on politically conscious youth who hold leaders accountable and champion value-based governance.
            </p>
            <ul>
              <li>
                <i className="bi bi-shield-check"></i>
                <div>
                  <h5>Political Accountability & Unity</h5>
                  <p>Mobilizing youth to demand integrity, unity, and accountability from politicians while building value-based leadership across Northern Nigeria</p>
                </div>
              </li>
              <li>
                <i className="bi bi-graph-up-arrow"></i>
                <div>
                  <h5>Economic & Industrial Mobilization</h5>
                  <p>Reviving Arewa's industrial capacity and economic potential through advocacy, entrepreneurship support, and strategic economic mobilization</p>
                </div>
              </li>
              <li>
                <i className="bi bi-people-fill"></i>
                <div>
                  <h5>Civic Engagement & Education</h5>
                  <p>Building politically conscious citizens through civic education, leadership training, and grassroots organizing supported by modern communication tools</p>
                </div>
              </li>
            </ul>
            <p>
              Born from the urgency to address declining civic participation, leadership vacuum, and economic stagnation, A19 operates as a non-partisan, values-driven institution. Through community cells across all 19 Northern states, we connect local action to broader mobilization — from civic education campaigns and political leadership academies to economic empowerment programs and diaspora collaborations. Our ultimate goal is to mobilize one million active youth and civic leaders who will rebuild Northern Nigeria into a peaceful, progressive, and economically vibrant region.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
