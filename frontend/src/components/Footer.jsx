import React from 'react';
import { Link } from 'react-router-dom';
import aradaLogo from '../assets/logo.jpg';

import developerPhoto from '../assets/developer.jpg';

const Footer = () => {
  return (
    <footer className="bg-darkFooter pt-16 pb-8 border-t-[6px] border-primary">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-6 mb-8 group">
              <div className="relative">
                <img
                  src={aradaLogo}
                  alt="Arada Code Enforcement Logo"
                  className="w-24 h-24 object-contain rounded-full bg-white p-1.5 shadow-xl animate-float logo-dynamic-shield"
                />
              </div>
              <div>
                <h2 className="text-white text-3xl font-extrabold tracking-tighter leading-none mb-1">
                  <span className="text-dynamic-gradient">Arada</span>
                  <span className="block text-lg tracking-widest uppercase font-black text-gray-400 group-hover:text-primary transition-colors duration-500 mt-2">Code Enforcement</span>
                </h2>
                <p className="text-[#bdc3c7] text-sm font-medium tracking-widest uppercase opacity-70">Serving the community.</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Committed to ensuring a safe, healthy, and pristine environment for all residents of the Arada Sub-City through fair and effective code enforcement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative">
              Quick Links
              <span className="absolute bottom-[-10px] left-0 w-12 h-1 bg-primary rounded"></span>
            </h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Home</Link></li>
              <li><Link to="/report" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><span>›</span> File a Report</Link></li>
              <li><Link to="/documents" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Official Documents</Link></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><span>›</span> Contact Info</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative">
              Contact Us
              <span className="absolute bottom-[-10px] left-0 w-12 h-1 bg-primary rounded"></span>
            </h3>
            <ul className="flex flex-col gap-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg mt-0.5">📞</span>
                <div>
                  <span className="block text-white font-medium">Free Line</span>
                  9995
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg mt-0.5">📧</span>
                <div>
                  <span className="block text-white font-medium">Email</span>
                  <a href="mailto:info@arada-enforcement.com" className="hover:text-primary transition-colors">info@arada-enforcement.com</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Arada Sub-City Administration. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white/5 py-2 px-4 rounded-full border border-white/10 group hover:border-primary/50 transition-all">
            <div className="relative">
              <img 
                src={developerPhoto} 
                alt="Developer" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20 group-hover:border-primary transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1c1e] rounded-full"></span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Developed by</span>
              <span className="text-white font-semibold text-sm group-hover:text-primary transition-colors tracking-wide">Alemu Samuel</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
