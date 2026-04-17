import React from 'react';
import mainBg from '../assets/main-bg.jpg';

const PageBanner = ({ title, subtitle }) => {
  return (
    <div className="bg-primary text-white pt-28 pb-14 lg:pt-36 lg:pb-20 relative overflow-hidden">
      {/* Background Image Overlay for Banners */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src={mainBg} 
          alt="" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-primary mix-blend-multiply"></div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-light/10 rounded-full -ml-32 -mb-32 blur-2xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rotate-45 blur-xl"></div>

      <div className="max-w-[1200px] mx-auto px-5 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 animate-fade-in-up overflow-hidden">
          <span className="w-2 h-2 bg-greenTint rounded-full animate-pulse"></span>
          Arada Code Enforcement
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tighter drop-shadow-md animate-fade-in-up selection:bg-white selection:text-primary">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-white/80 text-lg md:text-xl max-w-2xl font-light leading-relaxed animate-fade-in-up delay-150">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Wave Divider at Bottom */}
      <div className="absolute bottom-0 left-0 w-full leading-none z-10">
        <svg className="relative block w-full h-[30px] md:h-[50px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V120H1200V0C1100,60,950,90,600,60S100,30,0,0Z" className="fill-bgLight"></path>
        </svg>
      </div>
    </div>
  );
};

export default PageBanner;
