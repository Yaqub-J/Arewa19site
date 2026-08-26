import { useLayoutEffect, useState } from 'react';

const StatsSection = () => {
  const [count1, setCount1] = useState(1000000);
  const [count2, setCount2] = useState(19);
  const [count3, setCount3] = useState(5000);
  const [count4, setCount4] = useState(50);

  useLayoutEffect(() => {
    const animateCounter = (target, setter) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const intervalTime = duration / steps;
      
      let current = 0;
      let stepCount = 0;
      
      const timer = setInterval(() => {
        stepCount++;
        current = Math.floor((target / steps) * stepCount);
        
        if (stepCount >= steps) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(current);
        }
      }, intervalTime);

      return timer;
    };

    // Start with 0
    setCount1(0);
    setCount2(0);
    setCount3(0);
    setCount4(0);

    // Small delay to ensure state updates before animation starts
    const delay = setTimeout(() => {
      const timer1 = animateCounter(1000000, setCount1);
      const timer2 = animateCounter(19, setCount2);
      const timer3 = animateCounter(5000, setCount3);
      const timer4 = animateCounter(50, setCount4);

      return () => {
        clearTimeout(delay);
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
        clearInterval(timer4);
      };
    }, 50);

    return () => clearTimeout(delay);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

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
