import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import HomePage from '@/pages/HomePage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ServicesPage from '@/pages/ServicesPage.jsx';
import PortfolioPage from '@/pages/PortfolioPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import WorksPage from '@/pages/Workspage.jsx';
import LoginPage from '@/pages/admin/LoginPage.jsx';
import DashboardPage from '@/pages/admin/DashboardPage.jsx';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<DashboardPage />} />
        </Routes>
        <Toaster />
      </Router>
    </LanguageProvider>
  );
}

export default App;