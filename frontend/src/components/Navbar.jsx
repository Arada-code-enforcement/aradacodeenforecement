import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import aradaLogo from '../assets/logo.jpg';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '#about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/news', label: 'News' },
  { to: '/documents', label: 'Documents' },
  { to: '/compliment', label: 'Compliments' },
  { to: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent ${
      scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-md py-3 top-[40px]'
        : 'bg-white py-5 shadow-sm top-[40px]'
    }`}>
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity flex-shrink-0">
          <img
            src={aradaLogo}
            alt="Arada Code Enforcement Logo"
            className="w-14 h-14 object-contain rounded-full shadow-sm"
          />
          <div>
            <div className="font-bold text-primary tracking-tight leading-tight text-lg">Arada</div>
            <div className="text-xs text-textLight tracking-wide font-medium uppercase">Code Enforcement</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex space-x-4 xl:space-x-6 items-center">
          {navLinks.map((link) => {
            const isHashLink = link.to.includes('#');
            return isHashLink ? (
              <a
                key={link.to}
                href={link.to}
                className="text-textDark font-medium hover:text-primary transition-colors hover:scale-105 active:scale-95 transform text-sm"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="text-textDark font-medium hover:text-primary transition-colors hover:scale-105 active:scale-95 transform text-sm"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link
            to="/report"
            className="inline-block bg-accent hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            Report Issue
          </Link>
        </div>

        {/* Mobile: CTA + Hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            to="/report"
            className="inline-block bg-accent hover:bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold transition-all text-xs shadow-sm"
          >
            Report
          </Link>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className={`block h-0.5 w-6 bg-textDark rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-textDark rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-textDark rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-1 shadow-md">
          {navLinks.map((link) => {
            const isHashLink = link.to.includes('#');
            return isHashLink ? (
              <a
                key={link.to}
                href={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-textDark font-medium hover:bg-primary/5 hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2.5 rounded-xl text-textDark font-medium hover:bg-primary/5 hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
