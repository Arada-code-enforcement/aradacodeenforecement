import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: '🌍',
    title:'ህገ ወጥ መሬት ወረራ ቁጥጥር',
    titleAm:'Illegal Land Occupation Control',
    description:
      'Investigating and resolving cases of unauthorized land seizure and expansion to protect the rights of rightful landowners and communities.',
    color: 'green',
  },
  {
    icon: '🏗️',
    title:'ህገ ወጥ ግንባታ ቁጥጥር',
    titleAm:'Illegal Construction Control', 
    description:
      'We inspect and take action on unauthorized construction activities, ensuring all buildings comply with Addis Ababa city regulations and permit requirements.',
    color: 'blue',
  },
  {
    icon: '📏',
    title:'ህገ ወጥ መሬት ማስፋፋት ቁጥጥር',
    titleAm:'Illegal Land Expansion Control', 
    description:
      'Enforcing regulations against unauthorized expansion of land boundaries into public or neighboring properties.',
    color: 'teal',
  },
  {
    icon: '🏪',
    title:'ህገ ወጥ ጎዳና ንግድ ቁጥጥር',
    titleAm: 'Street Vending Control',
    description:
      'Managing unauthorized street vending and trade activities to ensure orderly commerce while supporting legitimate vendors.',
    color: 'indigo',
  },
  {
    icon: '🗑️',
    title:'ህገ ወጥ ደረቅና ፋሳሽ ቆሻሻ ቁጥጥር',
    titleAm: 'Waste & Sanitation Control',
    description:
      'Enforcing proper waste disposal regulations, combating illegal dumping of solid and liquid waste, and keeping public spaces clean.',
    color: 'yellow',
  },
  {
    icon: '🐄',
    title:'ህገ ወጥ የእንስሳት እርድ ቁጥጥር',
    titleAm:'Animal Slaughter Control',
    description:
      'Monitoring and enforcing regulations on animal slaughtering to ensure public health standards and prevent unauthorized slaughter.',
    color: 'orange',
  },
  {
    icon: '💼',
    title:'ህገ ወጥ ንግድ አጠቃቀም ቁጥጥር',
    titleAm:'Illegal Business Usage Control',
    description:
      'Regulating unauthorized business activities and ensuring businesses are operating according to proper zoning and licensing.',
    color: 'purple',
  },
  {
    icon: '🔊',
    title:'ህገ ወጥ አዋኪ ድርጊት ቁጥጥር',
    titleAm:'Public Disturbance Control',
    description:
      'Addressing public nuisance, illegal noise pollution, and other disturbances to maintain a peaceful environment for all residents.',
    color: 'red',
  },
  {
    icon: '📢',
    title:'ህገ ወጥ ማስታወቂያ ቁጥጥር',
    titleAm:'Illegal Advertisement Control',
    description:
      'Removing unauthorized billboards, banners, and signage that violate city advertising standards and detract from the urban environment.',
    color: 'blue',
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100', border: 'border-blue-200', accent: 'bg-blue-500' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100', border: 'border-green-200', accent: 'bg-green-500' },
  yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100', border: 'border-yellow-200', accent: 'bg-yellow-500' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', border: 'border-purple-200', accent: 'bg-purple-500' },
  red: { bg: 'bg-red-50', icon: 'bg-red-100', border: 'border-red-200', accent: 'bg-red-500' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100', border: 'border-orange-200', accent: 'bg-orange-500' },
  teal: { bg: 'bg-teal-50', icon: 'bg-teal-100', border: 'border-teal-200', accent: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100', border: 'border-indigo-200', accent: 'bg-indigo-500' },
};

const Services = () => {
  return (
    <div className="py-16">
      {/* Services Grid */}
      <div className="max-w-[1200px] mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const colors = colorMap[service.color];
            return (
              <div
                key={index}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className={`${colors.icon} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-bold text-textDark text-lg leading-snug">{service.title}</h3>
                  <p className="text-xs text-textLight font-medium mt-0.5">{service.titleAm}</p>
                </div>
                <p className="text-sm text-textLight leading-relaxed flex-grow">{service.description}</p>
                <div className={`h-1 w-12 ${colors.accent} rounded-full mt-auto group-hover:w-full transition-all duration-500`}></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <h2 className="text-2xl font-bold text-textDark mb-3">Witnessed a Violation?</h2>
          <p className="text-textLight mb-6 max-w-lg mx-auto">
            Report it to us directly using our online finance report form. We act swiftly to investigate and resolve all reported violations.
          </p>
          <Link
            to="/report"
            className="inline-block bg-accent hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            Report a Violation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
