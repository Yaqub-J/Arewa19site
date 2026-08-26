const StatsSection = () => {
  return (
    <section id="stats" className="stats section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-people"></i>
              <span className="purecounter" data-purecounterStart="0" data-purecounterEnd="1000000" data-purecounterDuration="2">27,000,000</span>
              <p><strong>Youth Mobilized</strong> <span>Target</span></p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-map"></i>
              <span className="purecounter" data-purecounterStart="0" data-purecounterEnd="19" data-purecounterDuration="2">19</span>
              <p><strong>Northern States</strong> <span>Coverage</span></p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-award"></i>
              <span className="purecounter" data-purecounterStart="0" data-purecounterEnd="5000" data-purecounterDuration="2">5,000</span>
              <p><strong>Civic Leaders</strong> <span>Trained</span></p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-laptop"></i>
              <span className="purecounter" data-purecounterStart="0" data-purecounterEnd="50" data-purecounterDuration="2">50</span>
              <p><strong>Innovation Hubs</strong> <span>& Programs</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
