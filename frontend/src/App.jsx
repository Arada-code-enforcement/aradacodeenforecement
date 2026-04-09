import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import CardsSection from './components/CardsSection';
import OrganizationInfo from './components/OrganizationInfo';
import ReportForm from './components/ReportForm';
import ComplimentForm from './components/ComplimentForm';
import AboutContact from './components/AboutContact';
import Services from './components/Services';
import News from './components/News';
import Documents from './components/Documents';
import Hero from './components/Hero';
import AnnouncementTicker from './components/AnnouncementTicker';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import TopBar from './components/TopBar';

// A simple Home wrapper component for the homepage content
const Home = () => (
  <>
    <Header />
    <Hero />
    <main id="about" className="py-16 flex-grow">
      <div className="max-w-[1200px] mx-auto px-5">
        <CardsSection />
        <OrganizationInfo />
        <AboutContact />
      </div>
    </main>
  </>
);
function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="fixed top-0 w-full z-[60]">
        <TopBar />
        <AnnouncementTicker />
      </div>
      <div className="mt-[82px] transition-all duration-300">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/news" element={<News />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/report" element={<main className="py-16 lg:py-24 flex-grow bg-bgLight px-5"><ReportForm /></main>} />
        <Route path="/compliment" element={<main className="py-16 lg:py-24 flex-grow bg-bgLight px-5"><ComplimentForm /></main>} />
        <Route path="/admin" element={<main className="py-16 lg:py-24 flex-grow bg-bgLight px-5"><AdminDashboard /></main>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
