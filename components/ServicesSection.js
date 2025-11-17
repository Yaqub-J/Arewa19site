const ServicesSection = () => {
  return (
    <section id="services" className="services section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Movement Pillars</h2>
        <div><span>What</span> <span className="description-title">We Do</span></div>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="100">
            <div className="icon flex-shrink-0"><i className="bi bi-shield-check"></i></div>
            <div>
              <h4 className="title">Political Accountability</h4>
              <p className="description">Demanding integrity and accountability from politicians through governance monitoring, advocacy campaigns, and citizen-led oversight mechanisms.</p>
              <a href="/programs" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="200">
            <div className="icon flex-shrink-0"><i className="bi bi-book"></i></div>
            <div>
              <h4 className="title">Civic Education & Leadership</h4>
              <p className="description">Training politically conscious leaders through civic education campaigns, political leadership academies, and value-based governance programs.</p>
              <a href="/programs" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="300">
            <div className="icon flex-shrink-0"><i className="bi bi-building"></i></div>
            <div>
              <h4 className="title">Economic Empowerment</h4>
              <p className="description">Reviving Arewa's economic potential through entrepreneurship support, skills training, and advocacy for pro-growth policies and investments.</p>
              <a href="/programs" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="400">
            <div className="icon flex-shrink-0"><i className="bi bi-gear-fill"></i></div>
            <div>
              <h4 className="title">Industrial Mobilization</h4>
              <p className="description">Championing the revival of Arewa's industrial base through policy advocacy, youth engagement in manufacturing, and strategic partnerships.</p>
              <a href="/programs" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="500">
            <div className="icon flex-shrink-0"><i className="bi bi-diagram-3"></i></div>
            <div>
              <h4 className="title">Grassroots Organizing</h4>
              <p className="description">Building community cells across all 19 Northern states to connect local action, mobilize youth, and strengthen diaspora collaborations.</p>
              <a href="/state-chapters" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="600">
            <div className="icon flex-shrink-0"><i className="bi bi-megaphone"></i></div>
            <div>
              <h4 className="title">Advocacy & Communication</h4>
              <p className="description">Amplifying Arewa's story through strategic communications, storytelling, and modern platforms to challenge stereotypes and drive change.</p>
              <a href="/media-hub" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
