import { useEffect, useRef, useState } from 'react';

const StatsSection = () => {
  const [count1, setCount1] = useState(1000000);
  const [count2, setCount2] = useState(19);
  const [count3, setCount3] = useState(5000);
  const [count4, setCount4] = useState(50);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Prevent animation from running twice in Strict Mode
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const startTime = Date.now();
    const duration = 2000; // 2 seconds
    const targets = [1000000, 19, 5000, 50];
    const setters = [setCount1, setCount2, setCount3, setCount4];
    let animationFrameId;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      targets.forEach((target, index) => {
        const current = Math.floor(target * progress);
        setters[index](current);
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Ensure final values are set
        targets.forEach((target, index) => {
          setters[index](target);
        });
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
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
