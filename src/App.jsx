import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import { NUTRITION_ENABLED } from './config/features'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Schedule from './components/Schedule'
import Pricing from './components/Pricing'
import ContactModal from './components/ContactModal'
import BookingModal from './components/BookingModal'
import CrossfitScheduleModal from './components/CrossfitScheduleModal'
import TeamSection from './components/TeamSection'
import Gallery from './components/Gallery'
import NutritionPage from './pages/Nutrition'
import './App.css'

function AppContent() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'nutrition'

  // ── Booking modal (used by Hero, Navbar, and Pricing rows) ────────────────
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingModalPlan, setBookingModalPlan] = useState(null); // null = show plan picker

  /**
   * Open the booking modal.
   * @param {object|null} plan - pre-selected plan, or null to show plan picker first
   */
  const openBookingModal = (plan = null) => {
    // Ignore synthetic event objects accidentally passed as plan
    const validPlan = (plan && plan.name && typeof plan.monthlyRate === 'number') ? plan : null;
    setBookingModalPlan(validPlan);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setTimeout(() => setBookingModalPlan(null), 350);
  };

  // ── Contact modal ─────────────────────────────────────────────────────────
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const openContactModal  = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // ── Crossfit modal ────────────────────────────────────────────────────────
  const [crossfitModalOpen, setCrossfitModalOpen] = useState(false);
  const openCrossfitModal  = () => setCrossfitModalOpen(true);
  const closeCrossfitModal = () => setCrossfitModalOpen(false);

  // ── Navigation ────────────────────────────────────────────────────────────
  const openNutritionPage = () => {
    if (!NUTRITION_ENABLED) return;
    setCurrentView('nutrition');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  // Safety: if nutrition view is somehow active while flag is off, bounce home
  if (currentView === 'nutrition' && !NUTRITION_ENABLED) {
    goHome();
  }

  const sharedNavProps = {
    onBookClick:      openBookingModal,   // opens picker (plan = null)
    onContactClick:   openContactModal,
    onCrossfitClick:  openCrossfitModal,
    onNutritionClick: openNutritionPage,
    onHomeClick:      goHome,
  };

  return (
    <>
      {currentView === 'nutrition' && NUTRITION_ENABLED ? (
        <>
          <Navbar {...sharedNavProps} />
          <NutritionPage onHomeClick={goHome} />
          <Footer onContactClick={openContactModal} />
        </>
      ) : (
        <>
          <Navbar {...sharedNavProps} />
          <main className="main-content">
            <Hero onBookClick={openBookingModal} />
            <Schedule />
            {/* Pricing passes specific plan → modal skips picker, goes straight to form */}
            <Pricing onPlanBook={openBookingModal} onCrossfitClick={openCrossfitModal} />
            {/* <Products onContactClick={openContactModal} /> */}
            <TeamSection />
            <Gallery />
          </main>
          <Footer onContactClick={openContactModal} />
        </>
      )}

      {/* ── Global modals ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {bookingModalOpen && (
          <BookingModal
            plan={bookingModalPlan}
            onClose={closeBookingModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactModalOpen && (
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={closeContactModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {crossfitModalOpen && (
          <CrossfitScheduleModal onClose={closeCrossfitModal} />
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
