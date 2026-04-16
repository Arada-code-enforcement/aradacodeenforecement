import React from 'react';
import { Link } from 'react-router-dom';

const CardsSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {/* Card 1 */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-500 border border-white/50 border-t-[5px] border-primary">
        <div className="text-5xl mb-4 text-primary">🏦</div>
        <h3 className="text-xl font-bold mb-2">Finance Report</h3>
        <p className="text-textLight mb-4 text-sm leading-relaxed">Report issues such as illegal dumping, unsafe buildings, or other community code violations anonymously.</p>
        <Link to="/report" className="btn w-full">Submit a Report</Link>
      </div>

      {/* Card 2 - Services */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-500 border border-white/50 border-t-[5px] border-primary">
        <div className="text-5xl mb-4 text-primary">🛠️</div>
        <h3 className="text-xl font-bold mb-2">Our Services</h3>
        <p className="text-textLight mb-4 text-sm leading-relaxed">Discover the various code enforcement services we provide to keep our community safe.</p>
        <Link to="/services" className="btn w-full">View Services</Link>
      </div>

      {/* Card 3 - Documents */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-500 border border-white/50 border-t-[5px] border-primary">
        <div className="text-5xl mb-4 text-primary">📄</div>
        <h3 className="text-xl font-bold mb-2">Official Documents</h3>
        <p className="text-textLight mb-4 text-sm leading-relaxed">Access regulatory guidelines, city codes, and official administrative documents.</p>
        <Link to="/documents" className="btn w-full">View Documents</Link>
      </div>

      {/* Card 4 - Compliment */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-500 border border-white/50 border-t-[5px] border-[#27ae60]">
        <div className="text-5xl mb-4 text-[#27ae60]">🌟</div>
        <h3 className="text-xl font-bold mb-2 text-[#27ae60]">Send a Compliment</h3>
        <p className="text-textLight mb-4 text-sm leading-relaxed">Have you noticed positive changes or want to thank an officer? Let us know!</p>
        <Link to="/compliment" className="inline-block w-full bg-[#27ae60] text-white py-3 px-6 rounded-full font-semibold no-underline mt-4 transition-all duration-300 transform hover:bg-[#219653] hover:shadow-lg hover:-translate-y-0.5 border-0 cursor-pointer">Give Feedback</Link>
      </div>
    </section>
  );
};

export default CardsSection;
