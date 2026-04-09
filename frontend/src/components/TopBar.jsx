import React from 'react';

const TopBar = () => {
  return (
    <div className="bg-[#1c2833] text-white py-2 border-b border-white/5 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-semibold tracking-wider">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 transition-colors group cursor-default">
            <span className="bg-primary/20 p-1 rounded-md text-primary-light">📞</span>
            <span className="text-gray-400 group-hover:text-white transition-colors uppercase text-[9px]">Free Line:</span>
            <span className="font-extrabold tracking-widest text-accent drop-shadow-sm">9995</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 transition-colors group">
            <span className="bg-primary/20 p-1 rounded-md text-primary-light">✉️</span>
            <span className="text-gray-400 group-hover:text-white transition-colors uppercase text-[9px]">Email:</span>
            <a href="mailto:info@arada-enforcement.com" className="hover:text-white transition-all underline decoration-primary/30 underline-offset-4">info@arada-enforcement.com</a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 opacity-90 group">
          <span className="text-primary-light group-hover:rotate-12 transition-transform">📅</span>
          <span className="text-gray-500 font-bold uppercase text-[9px]">Working Hours:</span>
          <span className="text-gray-300">Mon -Sun (8:00 AM - 5:30 PM)</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
