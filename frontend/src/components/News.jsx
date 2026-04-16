import React, { useState } from 'react';

const newsItems = [
  {
    id: 1,
    date: 'March 10, 2026',
    category: 'Enforcement',
    categoryColor: 'bg-red-100 text-red-700',
    title: 'Major Crackdown on Illegal Construction in Arada Sub-City',
    titleAm: 'በአራዳ ክፍለ ከተማ ህገ ወጥ ግንባታዎችን ማፍረስ ተጀምሯል',
    summary:
      'Code enforcement officers conducted a sweep of over 30 unauthorized construction sites this week, issuing stop-work orders and initiating legal proceedings against permit violators.',
    icon: '🏗️',
  },
  {
    id: 2,
    date: 'February 28, 2026',
    category: 'Community',
    categoryColor: 'bg-green-100 text-green-700',
    title: 'Community Awareness Campaign Launched in Arat Kilo Area',
    titleAm: 'አራት ኪሎ አካባቢ የህዝብ ግንዛቤ ፕሮግራም ተጀምሯል',
    summary:
      'A new public awareness campaign informs residents about their rights and responsibilities under city regulations. Sessions are held every Saturday morning near the Kebele office.',
    icon: '📣',
  },
  {
    id: 3,
    date: 'February 15, 2026',
    category: 'Policy Update',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'New Penalty Scale for Street Vending Violations Takes Effect',
    titleAm: 'ለህገ ወጥ ጎዳና ንግድ አዲስ የቅጣት ደረጃ ተተግብሯል',
    summary:
      'Starting this month, revised fines for unauthorized street commerce activities have been implemented. Vendors operating without a valid permit face fines ranging from 500 to 10,000 ETB.',
    icon: '⚖️',
  },
  {
    id: 4,


    date: 'January 30, 2026',
    category: 'Sanitation',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    title: 'Waste Disposal Task Force Cleans 12 Hotspots Across the Sub-City',
    titleAm: 'ቆሻሻ ቁጥጥር ቡድን በ12 ቦታዎች ላይ ዘመቻ አካሏል',
    summary:
      'The sanitation enforcement team successfully cleared 12 illegal dumpsites identified through resident reports. Perpetrators received formal warnings and cleanup orders.',
    icon: '🗑️',
  },
  {
    id: 5,
    date: 'January 12, 2026',
    category: 'Recognition',
    categoryColor: 'bg-purple-100 text-purple-700',
    title: 'Arada Code Enforcement Receives City-Level Excellence Award',
    titleAm: 'አራዳ ደንብ ማስከበር ከተማ አቀፍ የምርጥ አፈጻጸም ሽልማት ተቀበለ',
    summary:
      'Our department was honored at the Addis Ababa City Administration annual review for outstanding performance in reducing code violations by 23% compared to last year.',
    icon: '🏆',
  },
  {
    id: 6,
    date: 'December 20, 2025',
    category: 'Announcement',
    categoryColor: 'bg-indigo-100 text-indigo-700',
    title: 'Online Reporting System Upgraded for Faster Response',
    titleAm: 'ኦንላይን ሪፖርት ማስገቢያ ስርዓት ተሻሽሏል',
    summary:
      'We have upgraded our digital reporting platform to allow residents to attach photos and GPS coordinates to violation reports. This enables our field teams to respond 40% faster.',
    icon: '💻',
  },
];

const categories = ['All', 'Enforcement', 'Community', 'Policy Update', 'Sanitation', 'Recognition', 'Announcement'];

const News = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? newsItems
    : newsItems.filter((n) => n.category === activeCategory);

  return (
    <div className="py-16">
      {/* News Cards */}
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${activeCategory === cat
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-textLight border-gray-200 hover:border-primary hover:text-primary'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Cards */}
        <div className="flex flex-col gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5 hover:shadow-md transition-all duration-300 group"
            >
              <div className="text-4xl flex-shrink-0 w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                {item.icon}
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.categoryColor}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-textLight">{item.date}</span>
                </div>
                <h2 className="text-lg font-bold text-textDark group-hover:text-primary transition-colors leading-snug mb-1">
                  {item.title}
                </h2>
                <p className="text-xs text-textLight mb-3 font-medium">{item.titleAm}</p>
                <p className="text-sm text-textLight leading-relaxed">{item.summary}</p>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-textLight">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg font-medium">No news in this category yet.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default News;
