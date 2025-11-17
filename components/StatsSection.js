import { useEffect, useState } from 'react';

const StatsSection = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Animate counters
    const duration = 2000; // 2 seconds
    const steps = 60;
    const intervalTime = duration / steps;

    const animateCounter = (target, setter) => {
      let current = 0;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, intervalTime);

      return timer;
    };

    const timer1 = animateCounter(1000000, setCount1);
    const timer2 = animateCounter(19, setCount2);
    const timer3 = animateCounter(5000, setCount3);
    const timer4 = animateCounter(50, setCount4);

    // Cleanup
    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
      clearInterval(timer4);
    };
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Don't show 0 on server-side render
  if (!mounted) {
    return (
      <section id="stats" className="stats section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-people"></i>
                <span className="purecounter">1,000,000</span>
                <p><strong>Youth Mobilized</strong> <span>Target</span></p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-map"></i>
                <span className="purecounter">19</span>
                <p><strong>Northern States</strong> <span>Coverage</span></p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-award"></i>
                <span className="purecounter">5,000</span>
                <p><strong>Civic Leaders</strong> <span>Trained</span></p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-laptop"></i>
                <span className="purecounter">50</span>
                <p><strong>Innovation Hubs</strong> <span>& Programs</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="stats" className="stats section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-people"></i>
              <span className="purecounter">{formatNumber(count1)}</span>
              <p><strong>Youth Mobilized</strong> <span>Target</span></p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-map"></i>
              <span className="purecounter">{count2}</span>
              <p><strong>Northern States</strong> <span>Coverage</span></p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-award"></i>
              <span className="purecounter">{formatNumber(count3)}</span>
              <p><strong>Civic Leaders</strong> <span>Trained</span></p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <i className="bi bi-laptop"></i>
              <span className="purecounter">{count4}</span>
              <p><strong>Innovation Hubs</strong> <span>& Programs</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
