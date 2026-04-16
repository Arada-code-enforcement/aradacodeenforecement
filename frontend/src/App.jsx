import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import CardsSection from './components/CardsSection';
import ReportForm from './components/ReportForm';
import ComplimentForm from './components/ComplimentForm';
import Services from './components/Services';
import News from './components/News';
import Documents from './components/Documents';
import AnnouncementTicker from './components/AnnouncementTicker';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import TopBar from './components/TopBar';
import PageBanner from './components/PageBanner';
import Gallery from './components/Gallery';

// A simple Home wrapper component for the homepage content
const Home = () => (
  <div className="home-background">
    <Header />
    <main className="py-16 flex-grow">
      <div className="max-w-[1200px] mx-auto px-5">
        <CardsSection />
        <Gallery />
      </div>
    </main>
  </div>
);
function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="fixed top-0 w-full z-[60]">
        <TopBar />
      </div>
      <div className="mt-[40px] transition-all duration-300">
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={
          <main className="flex-grow bg-bgLight/40 backdrop-blur-[2px]">
            <PageBanner title="Our Services" subtitle="Discover how we serve and protect our community." />
            <div className="max-w-[1200px] mx-auto px-5 pb-16">
              <Services />
            </div>
          </main>
        } />
        <Route path="/news" element={
          <main className="flex-grow bg-bgLight/40 backdrop-blur-[2px]">
            <PageBanner title="Latest News" subtitle="Stay updated with the latest news and announcements." />
            <div className="max-w-[1200px] mx-auto px-5 pb-16">
              <News />
            </div>
          </main>
        } />
        <Route path="/documents" element={
          <main className="flex-grow bg-bgLight/40 backdrop-blur-[2px]">
            <PageBanner title="Official Documents" subtitle="Access regulatory documents and city guidelines." />
            <div className="max-w-[1200px] mx-auto px-5 pb-16">
              <Documents />
            </div>
          </main>
        } />
        <Route path="/report" element={
          <main className="flex-grow bg-bgLight/40 backdrop-blur-[2px]">
            <PageBanner title="Finance Report" subtitle="Please fill out the form below to report a code violation." />
            <div className="max-w-[1200px] mx-auto px-5 -mt-12 relative z-20 pb-16">
              <ReportForm />
            </div>
          </main>
        } />
        <Route path="/compliment" element={
          <main className="flex-grow bg-bgLight/40 backdrop-blur-[2px]">
            <PageBanner title="Submit a Compliment" subtitle="Did one of our officers do a great job? Let us know!" />
            <div className="max-w-[1200px] mx-auto px-5 -mt-12 relative z-20 pb-16">
              <ComplimentForm />
            </div>
          </main>
        } />
        <Route path="/admin" element={
          <main className="flex-grow bg-bgLight/40 backdrop-blur-[2px]">
            <PageBanner title="Admin Dashboard" subtitle="Manage reports and system configurations." />
            <div className="max-w-[1200px] mx-auto px-5 pb-16">
              <AdminDashboard />
            </div>
          </main>
        } />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
