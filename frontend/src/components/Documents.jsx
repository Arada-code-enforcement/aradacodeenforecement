import React, { useState } from 'react';

const documents = [
  {
    id: 1,
    title: 'City Code Enforcement Regulation - Proclamation 180/2012',
    titleAm: 'ደንብ ቁጥር 150.2015 ለማስፈፀም.pptx ',
    titleAm: 'የአዲስ አበባ ከተማ ደንብ ማስከበር ደንብ - አዋጅ ቁጥር 180/2012',
    category: 'Regulation',
    type: 'PDF',
    size: '2.4 MB',
    date: 'Oct 2020',
    icon: '📜',
    color: 'red',
    url: '/arada-code-enforcement/documents/proclamation_180.pdf'
  },
  {
    id: 2,
    title: 'Solid Waste Management Policy',
    titleAm: 'ደረቅ ቆሻሻ አያያዝ ፖሊሲ',
    category: 'Regulation',
    type: 'PDF',
    size: '1.8 MB',
    date: 'Jan 2021',
    icon: '♻️',
    color: 'green',
    url: '/arada-code-enforcement/documents/waste_policy.pdf'
  },
  {
    id: 3,
    title: 'Illegal Construction Penalty Guidelines',
    titleAm: 'ህገ ወጥ ግንባታ የቅጣት መመሪያ',
    category: 'Guideline',
    type: 'PDF',
    size: '1.1 MB',
    date: 'Mar 2025',
    icon: '🏗️',
    color: 'blue',
    url: '/arada-code-enforcement/documents/construction_guideline.pdf'
  },
  {
    id: 4,
    title: 'Arada Sub-City Strategic Plan 2024-2028',
    titleAm: 'የአራዳ ክፍለ ከተማ ስትራቴጂካዊ ዕቅድ 2016-2020',
    category: 'Report',
    type: 'PDF',
    size: '4.2 MB',
    date: 'Dec 2023',
    icon: '📅',
    color: 'purple',
    url: '/arada-code-enforcement/documents/strategic_plan.pdf'
  },
  {
    id: 5,
    title: 'Noise Pollution Level Standards',
    titleAm: 'የድምፅ ብክለት ደረጃዎች መመዘኛ',
    category: 'Regulation',
    type: 'PDF',
    size: '950 KB',
    date: 'Jun 2022',
    icon: '📢',
    color: 'yellow',
    url: '/arada-code-enforcement/documents/noise_standards.pdf'
  },
  {
    id: 6,
    title: 'Public Health & Sanitation Directives',
    titleAm: 'የህዝብ ጤና እና ንፅህና መመሪያዎች',
    category: 'Guideline',
    type: 'PDF',
    size: '1.5 MB',
    date: 'Apr 2023',
    icon: '🏥',
    color: 'teal',
    url: '/arada-code-enforcement/documents/health_directives.pdf'
  },
  {
    id: 7,
    title: 'Complaints Filing Form',
    titleAm: 'ቅሬታ ማቅረቢያ ቅፅ',
    category: 'Form',
    type: 'DOCX',
    size: '120 KB',
    date: 'Jan 2026',
    icon: '📝',
    color: 'indigo',
    url: '/arada-code-enforcement/documents/complaint_form.docx'
  },
  {
    id: 8,
    title: 'Street Vendor Licensing Procedure',
    titleAm: 'የጎዳና ንግድ ፈቃድ አሰጣጥ ሂደት',
    category: 'Guide',
    type: 'PDF',
    size: '880 KB',
    date: 'Aug 2024',
    icon: '🏪',
    color: 'orange',
    url: '/arada-code-enforcement/documents/vendor_guide.pdf'
  },
  {
    id: 9,
    title: 'Building Permit Application Checklist',
    titleAm: 'የህንፃ ፈቃድ ማመልከቻ ዝርዝር (ቼክሊስት)',
    category: 'Form',
    type: 'PDF',
    size: '450 KB',
    date: 'Feb 2025',
    icon: '✅',
    color: 'blue',
    url: '/arada-code-enforcement/documents/permit_checklist.pdf'
  },
  {
    id: 10,
    title: 'Arada Code Enforcement Annual Report 2023',
    titleAm: 'የአራዳ ደንብ ማስከበር 2015 ዓመታዊ ሪፖርት',
    category: 'Report',
    type: 'PDF',
    size: '3.1 MB',
    date: 'Jan 2024',
    icon: '📈',
    color: 'green',
    url: '/arada-code-enforcement/documents/annual_report_2023.pdf'
  }
];
const categories = ['All', 'Regulation', 'Guideline', 'Report', 'Guide', 'Form'];
const colorMap = {
  red: { badge: 'bg-red-50 text-red-700 border-red-200', hover: 'hover:border-red-300' },
  blue: { badge: 'bg-blue-50 text-blue-700 border-blue-200', hover: 'hover:border-blue-300' },
  green: { badge: 'bg-green-50 text-green-700 border-green-200', hover: 'hover:border-green-300' },
  yellow: { badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', hover: 'hover:border-yellow-300' },
  purple: { badge: 'bg-purple-50 text-purple-700 border-purple-200', hover: 'hover:border-purple-300' },
  orange: { badge: 'bg-orange-50 text-orange-700 border-orange-200', hover: 'hover:border-orange-300' },
  teal: { badge: 'bg-teal-50 text-teal-700 border-teal-200', hover: 'hover:border-teal-300' },
  indigo: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', hover: 'hover:border-indigo-300' },
};
const Documents = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link if fetch fails
      window.location.href = url;
    }
  };

  const filtered = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.titleAm.includes(search);
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="py-16">
      <div className="max-w-[1000px] mx-auto px-5">
        {/* Search + Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search documents... / ሰነዶችን ይፈልጉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white text-sm transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Document List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((doc) => {
            const colors = colorMap[doc.color];
            return (
              <div
                key={doc.id}
                onClick={() => downloadFile(doc.url, doc.url.split('/').pop())}
                className={`bg-white border border-gray-100 ${colors.hover} rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-all duration-300 group cursor-pointer no-underline block`}
              >
                <div className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${colors.badge}`}>
                  {doc.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
                      {doc.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{doc.type} · {doc.size}</span>
                    <span className="text-xs text-gray-400 ml-auto">{doc.date}</span>
                  </div>
                  <h3 className="font-semibold text-textDark text-sm leading-snug group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-textLight mt-0.5">{doc.titleAm}</p>
                </div>
                <div className="flex-shrink-0 text-gray-300 group-hover:text-primary transition-colors mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-16 text-textLight">
              <p className="text-5xl mb-4">📂</p>
              <p className="text-lg font-medium">No documents found.</p>
            </div>
          )}
        </div>
        {/* Info Notice */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800 flex gap-3 items-start">
          <span className="text-xl flex-shrink-0">ℹ️</span>
          <p>
            All documents are official publications of the Arada Sub-City Code Enforcement Authority.
            For certified copies or additional records, please visit our office or contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Documents;
