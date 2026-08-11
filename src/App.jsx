import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Schedule from './components/Schedule'
import Pricing from './components/Pricing'
import Products from './components/Products'
import BookingPage from './components/BookingPage'
import ContactModal from './components/ContactModal'
import NutritionPage from './pages/Nutrition'
import './App.css'

function AppContent() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'booking' | 'nutrition'
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState(null);

  const openBookingPage = (category = null) => {
    const validCategory = (category && !category.nativeEvent) ? category : null;
    setPreselectedCategory(validCategory);
    setCurrentView('booking');
    window.scrollTo(0, 0);
  };

  const closeBookingPage = () => {
    setCurrentView('home');
    setTimeout(() => setPreselectedCategory(null), 300);
  };

  const openNutritionPage = () => {
    setCurrentView('nutrition');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <>
      {currentView === 'home' ? (
        <>
          <Navbar
            onBookClick={openBookingPage}
            onContactClick={openContactModal}
            onNutritionClick={openNutritionPage}
            onHomeClick={goHome}
          />
          <main className="main-content">
            <Hero onBookClick={openBookingPage} />
            <Schedule />
            <Pricing onBookClick={openBookingPage} />
            {/* <Products onContactClick={openContactModal} /> */}
          </main>
          <Footer onContactClick={openContactModal} />
        </>
      ) : currentView === 'nutrition' ? (
        <>
          <Navbar
            onBookClick={openBookingPage}
            onContactClick={openContactModal}
            onNutritionClick={openNutritionPage}
            onHomeClick={goHome}
          />
          <NutritionPage onHomeClick={goHome} />
          <Footer onContactClick={openContactModal} />
        </>
      ) : (
        <BookingPage
          onClose={closeBookingPage}
          preselectedCategory={preselectedCategory}
        />
      )}

      <AnimatePresence>
        {isContactModalOpen && (
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={closeContactModal}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
