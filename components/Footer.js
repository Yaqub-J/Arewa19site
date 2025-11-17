import Link from 'next/link';
import { useTheme } from './ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  // Since the footer has a dark background by default, we use the light logo by default
  // But we'll switch if the theme changes and the CSS background changes
  return (
    <footer id="footer" className="footer dark-background">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-5 col-md-12 footer-about">
            <Link href="/" className="logo d-flex align-items-center">
              <img src="/assets/img/logolight.png" alt="Arewa19 Logo" />
            </Link>
            <p>Arewa19 Pyramid (A19) is a digital-first socio-political movement dedicated to redefining the future of Northern Nigeria through technology, civic education, and narrative transformation.</p>
            <p className="mt-2"><strong>Rewriting the Arewa Story — Digitally, Politically, and Powerfully.</strong></p>
            <div className="social-links d-flex mt-4">
              <a href="https://twitter.com/arew19"><i className="bi bi-twitter"></i></a>
              <a href="https://www.facebook.com/profile.php?id=100083345650636"><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/arewa19_official/"><i className="bi bi-instagram"></i></a>
              <a href="https://youtu.be/HhaPu3llSqg"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-6 footer-links">
            <h4>Explore</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/programs">Programs</Link></li>
              <li><Link href="/state-chapters">State Chapters</Link></li>
              <li><Link href="/media-hub">Media Hub</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-6 footer-links">
            <h4>Get Involved</h4>
            <ul>
              <li><Link href="/get-involved">Become a Member</Link></li>
              <li><Link href="/get-involved">Volunteer</Link></li>
              <li><Link href="/get-involved">Partner With Us</Link></li>
              <li><Link href="/get-involved">Join Diaspora</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-12 footer-contact text-center text-md-start">
            <h4>Contact Us</h4>
            <p>
              Kaduna, Nigeria<br />
              <strong>Email:</strong> arewa19pyramid@gmail.com<br />
            </p>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p>&copy; {new Date().getFullYear()} <span>Arewa19 Pyramid</span>. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
