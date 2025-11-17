import { useEffect, useState } from 'react';

const SocialMediaPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenSocialPopup');

    if (!hasSeenPopup) {
      // Show popup after 2 seconds delay
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    // Mark that user has seen the popup
    localStorage.setItem('hasSeenSocialPopup', 'true');
  };

  const handleSocialClick = (platform) => {
    // Track which platform was clicked (optional analytics)
    console.log(`User clicked: ${platform}`);
    // Don't close popup immediately - let them click multiple platforms
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="social-popup-backdrop" onClick={handleClose}></div>

      {/* Popup */}
      <div className="social-popup">
        <button className="social-popup-close" onClick={handleClose} aria-label="Close">
          <i className="bi bi-x-lg"></i>
        </button>

        <div className="social-popup-content">
          <div className="social-popup-header">
            <i className="bi bi-megaphone-fill"></i>
            <h3>Join the Movement!</h3>
            <p>Stay connected with Arewa19 Pyramid on social media for updates, events, and civic action.</p>
          </div>

          <div className="social-popup-buttons">
            <a
              href="https://twitter.com/arewa19pyramid"
              target="_blank"
              rel="noopener noreferrer"
              className="social-popup-btn twitter"
              onClick={() => handleSocialClick('Twitter')}
            >
              <i className="bi bi-twitter"></i>
              <span>Follow on Twitter/X</span>
            </a>

            <a
              href="https://facebook.com/arewa19pyramid"
              target="_blank"
              rel="noopener noreferrer"
              className="social-popup-btn facebook"
              onClick={() => handleSocialClick('Facebook')}
            >
              <i className="bi bi-facebook"></i>
              <span>Like on Facebook</span>
            </a>

            <a
              href="https://instagram.com/arewa19pyramid"
              target="_blank"
              rel="noopener noreferrer"
              className="social-popup-btn instagram"
              onClick={() => handleSocialClick('Instagram')}
            >
              <i className="bi bi-instagram"></i>
              <span>Follow on Instagram</span>
            </a>

            <a
              href="https://youtube.com/@arewa19pyramid"
              target="_blank"
              rel="noopener noreferrer"
              className="social-popup-btn youtube"
              onClick={() => handleSocialClick('YouTube')}
            >
              <i className="bi bi-youtube"></i>
              <span>Subscribe on YouTube</span>
            </a>
          </div>

          <button className="social-popup-dismiss" onClick={handleClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </>
  );
};

export default SocialMediaPopup;
