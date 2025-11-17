import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';

const Header = () => {
  const { theme } = useTheme();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const router = useRouter();
  const logoSrc = theme === 'dark' ? '/assets/img/logolight.png' : '/assets/img/logodark.png';
  
  // Handle scroll event to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Mobile nav toggle handler using React state
  const toggleMobileNav = () => {
    setMobileNavActive(!mobileNavActive);
  };
  
  // Handle mobile navigation state and effects
  useEffect(() => {
    // Apply/remove mobile-nav-active class based on state
    if (mobileNavActive) {
      document.body.classList.add('mobile-nav-active');
    } else {
      document.body.classList.remove('mobile-nav-active');
    }
    
    // Define close function within the effect to avoid dependency issues
    const handleCloseMobileNav = () => {
      setMobileNavActive(false);
    };
    
    // Close mobile nav on page changes
    if (router && router.events) {
      router.events.on('routeChangeComplete', handleCloseMobileNav);
      
      return () => {
        // Clean up
        router.events.off('routeChangeComplete', handleCloseMobileNav);
      };
    }
  }, [mobileNavActive, router]);
  
  // Close mobile nav when clicking on links
  const closeMobileNav = () => {
    setMobileNavActive(false);
  };
  
  // We've removed the manual DOM event listeners in favor of React state management
  // which provides better consistency across page navigation

  // We'll handle dropdown toggles through React state if needed in the future
  // Currently no dropdown menus in the navigation

  return (
    <header 
      id="header" 
      className={`header d-flex align-items-center fixed-top ${hasScrolled ? 'scrolled' : ''}`}
      style={{
        boxShadow: hasScrolled ? '0px 0 18px rgba(0, 0, 0, 0.3)' : 'none',
        transition: 'all 0.3s ease-in-out'
      }}>
      <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        <Link href="/" className="logo d-flex align-items-center">
          <img src={logoSrc} alt="Arewa19 Logo" />
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link href="/" className="active" onClick={closeMobileNav}>Home</Link></li>
            <li><Link href="/programs" onClick={closeMobileNav}>Programs</Link></li>
            <li><Link href="/state-chapters" onClick={closeMobileNav}>State Chapters</Link></li>
            <li><Link href="/media-hub" onClick={closeMobileNav}>Media Hub</Link></li>
            <li><Link href="/gallery" onClick={closeMobileNav}>Gallery</Link></li>
            <li className="nav-cta-button">
              <Link href="/get-involved" onClick={closeMobileNav}>
                <button className="btn-get-started">Get Involved</button>
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
        
        {/* Mobile Navigation Toggle Button - Using React state for icon class */}
        <i 
          className={`mobile-nav-toggle d-xl-none bi ${mobileNavActive ? 'bi-x' : 'bi-list'}`} 
          onClick={toggleMobileNav}
        ></i>
      </div>
    </header>
  );
};

export default Header;
