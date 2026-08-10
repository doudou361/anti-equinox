import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Schedule from './components/Schedule'
import Pricing from './components/Pricing'
import Products from './components/Products'
import BookingModal from './components/BookingModal'
import ContactModal from './components/ContactModal'
import './App.css'

function AppContent() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState(null);

  const openBookingModal = (category = null) => {
    const validCategory = (category && !category.nativeEvent) ? category : null;
    setPreselectedCategory(validCategory);
    setIsBookingModalOpen(true);
  };
  
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setTimeout(() => setPreselectedCategory(null), 300);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
      <Navbar onBookClick={openBookingModal} onContactClick={openContactModal} />
      <main className="main-content">
        <Hero onBookClick={openBookingModal} />
        <Schedule />
        <Pricing onBookClick={openBookingModal} />
        <Products onContactClick={openContactModal} />
      </main>
      <Footer onContactClick={openContactModal} />
      
      <AnimatePresence>
        {isBookingModalOpen && (
          <BookingModal 
            isOpen={isBookingModalOpen} 
            onClose={closeBookingModal} 
            preselectedCategory={preselectedCategory} 
          />
        )}

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
