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
  // 'home' | 'nutrition' | 'success' | 'cancel'
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    if (path === '/success') return 'success';
    if (path === '/cancel') return 'cancel';
    return 'home';
  });

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
    window.history.pushState({}, '', '/');
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
      ) : currentView === 'success' ? (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div style={{ background: 'rgba(197,160,89,0.1)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem', color: '#C5A059' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h1 style={{ fontSize: '3rem', color: '#F4F4F5', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Paiement Réussi !</h1>
          <p style={{ color: '#9A948A', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '3rem' }}>
            Merci pour votre réservation. Votre paiement a été confirmé et votre place est réservée.
          </p>
          <button onClick={goHome} className="btn-primary">Retour à l'accueil</button>
        </div>
      ) : currentView === 'cancel' ? (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div style={{ background: 'rgba(224,85,85,0.1)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem', color: '#e05555' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <h1 style={{ fontSize: '3rem', color: '#F4F4F5', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Paiement Annulé</h1>
          <p style={{ color: '#9A948A', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '3rem' }}>
            Votre paiement n'a pas été finalisé. Vous pouvez réessayer quand vous le souhaitez.
          </p>
          <button onClick={goHome} className="btn-primary">Retour à l'accueil</button>
        </div>
      ) : (
        <>
          <Navbar {...sharedNavProps} />
          <main className="main-content">
            <Hero onBookClick={openBookingModal} />
            <Schedule />
            <Pricing onPlanBook={openBookingModal} />
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
