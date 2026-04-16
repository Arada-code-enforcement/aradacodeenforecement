import React from 'react';
import { Link } from 'react-router-dom';
import mainBg from '../assets/main-bg.jpg';

const Header = () => {
  return (
    <header className="relative bg-darkFooter text-white pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-darkFooter/80 z-10 mix-blend-multiply transition-opacity duration-1000"></div>
        <img
          src={mainBg}
          alt="Arada Sub-City"
          className="w-full h-full object-cover object-center animate-fade-in"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-5 text-center">
        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-medium tracking-wide mb-6 animate-fade-in-up hover:bg-white/20 transition-all cursor-default">
          Arada Sub-City Administration
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
          Code Enforcement <span className="text-greenTint opacity-90">Office</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/report" className="bg-white text-primary px-8 py-3.5 rounded-full font-semibold shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all transform hover:-translate-y-1">
            File a Report
          </Link>
          <a href="#about" className="bg-transparent border-2 border-white/50 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 hover:border-white transition-all">
            Learn More
          </a>
        </div>
      </div>

      {/* Decorative Bottom shape */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,126.38,200.5,119.53,242.09,115.42,283.4,103.55,321.39,56.44Z" className="fill-bgLight"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;
