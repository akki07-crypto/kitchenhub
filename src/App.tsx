import React from 'react';
import { AppContextProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Forum from './components/Forum';
import Academy from './components/Academy';
import Profile from './components/Profile';
import ChatWidget from './components/Chat';
import Marketplace from './components/Marketplace';
import Auth from './components/Auth';
import MealPlanner from './components/MealPlanner';
import { Truck, MapPin, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, isLoggedIn, showAuthModal, setShowAuthModal, setCurrentView, toast, activeDelivery, cancelDelivery } = useApp();

  // Intercept restricted views for non-logged-in users
  React.useEffect(() => {
    const restrictedViews = ['academy', 'forum', 'profile', 'planner'];
    if (!isLoggedIn && restrictedViews.includes(currentView)) {
      setShowAuthModal(true);
      setCurrentView('home'); // Send them back to homepage safely
    }
  }, [currentView, isLoggedIn, setCurrentView, setShowAuthModal]);

  return (
    <>
      <Navbar />
      {/* 90px top margin to clear the fixed luxury navbar */}
      <main style={{ minHeight: 'calc(100vh - 90px)', marginTop: '90px' }}>
        {currentView === 'home' && <Dashboard />}
        {currentView === 'recipes' && <Explore />}
        {currentView === 'planner' && isLoggedIn && <MealPlanner />}
        {currentView === 'academy' && isLoggedIn && <Academy />}
        {currentView === 'shop' && <Marketplace />}
        {currentView === 'forum' && isLoggedIn && <Forum />}
        {currentView === 'profile' && isLoggedIn && <Profile />}
      </main>

      {/* Global Toast Notification System */}
      {toast && (
        <div className="toast-container">
          <div className="toast-item">
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Global floating AI Chat Widget */}
      <ChatWidget />

      {/* Global Floating Grocery Delivery Tracker */}
      {activeDelivery && (
        <div style={{
          position: 'fixed',
          bottom: '28px',
          left: '24px',
          width: '340px',
          background: 'rgba(15, 22, 36, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(197, 168, 128, 0.25)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(16, 185, 129, 0.05)',
          borderRadius: '20px',
          padding: '16px 20px',
          zIndex: 99999,
          animation: 'slide-up-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: activeDelivery.service === 'Blinkit' ? '#ffe100' : activeDelivery.service === 'Zepto' ? '#701a75' : activeDelivery.service === 'Instamart' ? '#ff6c37' : '#059669',
                color: activeDelivery.service === 'Blinkit' ? '#000' : '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}>
                {activeDelivery.service}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{activeDelivery.status}</span>
            </div>
            <button
              onClick={cancelDelivery}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              title="Cancel Order"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress Tracking Bar */}
          <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginBottom: '16px', overflow: 'visible' }}>
            {/* Filled Progress */}
            <div style={{
              width: `${activeDelivery.progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, #10b981 100%)',
              borderRadius: '3px',
              transition: 'width 1s linear'
            }} />
            
            {/* Moving Truck Icon */}
            <div style={{
              position: 'absolute',
              left: `calc(${activeDelivery.progress}% - 12px)`,
              top: '-8px',
              transition: 'left 1s linear',
              background: '#07090e',
              border: '1px solid var(--primary)',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(197,168,128,0.4)'
            }}>
              <Truck size={12} color="var(--primary)" />
            </div>

            {/* Destination Pin */}
            <div style={{
              position: 'absolute',
              right: '-4px',
              top: '-8px',
              background: activeDelivery.progress === 100 ? '#10b981' : '#1f2937',
              border: `1px solid ${activeDelivery.progress === 100 ? '#10b981' : '#4b5563'}`,
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeDelivery.progress === 100 ? '0 0 12px rgba(16,185,129,0.5)' : 'none'
            }} className={activeDelivery.progress < 100 ? 'animate-pulse' : ''}>
              <MapPin size={12} color={activeDelivery.progress === 100 ? '#07090e' : '#94a3b8'} />
            </div>
          </div>

          {/* Delivery Stats Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              📦 {activeDelivery.itemsCount} items in cart
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
              ⚡ {Math.floor(activeDelivery.timeLeft / 60)}m {activeDelivery.timeLeft % 60}s remaining
            </span>
          </div>
        </div>
      )}

      {/* Render Auth Modal Overlay */}
      {showAuthModal && <Auth />}
    </>
  );
};

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
