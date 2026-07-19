import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  BookOpen, 
  MessageSquare, 
  ChefHat, 
  User, 
  Sun, 
  Moon,
  Home,
  ShoppingBag,
  LogOut,
  X,
  Trash2,
  Check,
  Search,
  ArrowRight,
  Calendar,
  Truck
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    theme, 
    toggleTheme, 
    logout, 
    setShowAuthModal,
    groceryList,
    removeFromGroceryList,
    clearGroceryList,
    cartItems,
    recipes,
    marketplaceTools,
    classes,
    setActiveRecipeId,
    placeDeliveryOrder,
    activeDelivery
  } = useApp();

  const [isGroceryOpen, setIsGroceryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedService, setSelectedService] = useState('Zepto');

  const toggleCheckItem = (item: string) => {
    setCheckedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Search Results
  const matchingRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingTools = marketplaceTools.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingClasses = classes.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRecipe = (id: string) => {
    setActiveRecipeId(id);
    setCurrentView('recipes');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectTool = () => {
    setCurrentView('shop');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectClass = () => {
    setCurrentView('academy');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const navItems = [
    { id: 'home',     label: 'Home',         icon: Home },
    { id: 'recipes',  label: 'Recipes',       icon: Compass },
    { id: 'planner',  label: 'Meal Planner',  icon: Calendar },
    { id: 'academy',  label: 'Academy',       icon: BookOpen },
    { id: 'shop',     label: 'Shop',          icon: ShoppingBag },
    { id: 'forum',    label: 'Forums',        icon: MessageSquare },
    { id: 'profile',  label: 'Chef Profile',  icon: User }
  ];

  return (
    <>
      <nav className="glass-panel animate-fade-in" style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        right: '16px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        borderRadius: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer' 
          }}
        >
          <div style={{
            background: 'var(--primary-gradient)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <ChefHat size={20} color="#07090e" />
          </div>
          <span className="brand-font brand-text" style={{
            fontWeight: 700,
            fontSize: '1.25rem',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            Kitchen Hub
          </span>
        </div>

        {/* Nav Actions */}
        <div className="navbar-desktop-actions" style={{ display: 'flex', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="btn"
                style={{
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '8px 12px',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  position: 'relative'
                }}
              >
                <Icon size={14} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span className="nav-label">{item.label}</span>
                {item.id === 'shop' && cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--primary)',
                    color: '#07090e',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="btn btn-secondary"
            style={{
              width: '36px',
              height: '36px',
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(197, 168, 128, 0.05)'
            }}
            title="Global Search (Recipes, Tools & Classes)"
          >
            <Search size={16} color="var(--primary)" />
          </button>

          {/* Grocery List Quick Drawer Toggle */}
          <button
            onClick={() => setIsGroceryOpen(true)}
            className="btn btn-secondary"
            style={{
              height: '36px',
              padding: '0 12px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              position: 'relative',
              background: groceryList.length > 0 ? 'var(--primary-glow)' : 'rgba(197, 168, 128, 0.05)',
              border: groceryList.length > 0 ? '1px solid var(--primary)' : '1px solid var(--border-glass)'
            }}
            title="Open Grocery List"
          >
            <ShoppingBag size={14} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>Grocery</span>
            {groceryList.length > 0 && (
              <span style={{
                background: 'var(--primary)',
                color: '#07090e',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '0.65rem',
                fontWeight: 700
              }}>
                {groceryList.length}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              width: '36px',
              height: '36px',
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(197, 168, 128, 0.05)'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={16} color="var(--primary)" />
            ) : (
              <Moon size={16} color="var(--primary)" />
            )}
          </button>

          {/* User Level Counter */}
          {currentUser && (
            <div className="glass-panel nav-user-level" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '12px',
              background: 'var(--primary-glow)',
              borderColor: 'rgba(197, 168, 128, 0.3)'
            }}>
              <ChefHat size={14} color="var(--primary)" />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {currentUser.level}
              </span>
            </div>
          )}

          {/* User Avatar */}
          {currentUser && (
            <div 
              onClick={() => setCurrentView('profile')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer' 
              }}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)',
                  boxShadow: 'var(--shadow-glow)'
                }}
              />
              <div className="nav-user-details" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {currentUser.role === 'admin' ? 'Grand Chef (Admin)' : 'Chef Member'}
                </span>
              </div>
            </div>
          )}

          {/* Sign Out / Sign In Button */}
          {currentUser ? (
            <button 
              onClick={logout}
              className="btn btn-secondary text-glow"
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.25)'
              }}
              title="Sign Out"
            >
              <LogOut size={16} color="#ef4444" />
            </button>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="btn btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.8rem',
                borderRadius: '10px',
                fontWeight: 650,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <User size={14} color="#07090e" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="mobile-bottom-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="btn btn-secondary"
                style={{
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  borderColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  border: '1px solid transparent'
                }}
                title={item.label}
              >
                <Icon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '90px',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            maxWidth: '650px',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: 'var(--shadow-glass)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsSearchOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            {/* Input Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
              <Search size={22} color="var(--primary)" />
              <input
                type="text"
                autoFocus
                placeholder="Search recipes, ingredients, cookware tools, classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>

            {/* Results Display */}
            {searchQuery.trim() === '' ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Type keywords like <strong style={{ color: 'var(--primary)' }}>"Wagyu"</strong>, <strong style={{ color: 'var(--primary)' }}>"Knife"</strong>, <strong style={{ color: 'var(--primary)' }}>"Sauce"</strong>, or <strong style={{ color: 'var(--primary)' }}>"Chef"</strong>
              </div>
            ) : (
              <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Recipe Results */}
                {matchingRecipes.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                      Recipes ({matchingRecipes.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {matchingRecipes.map(r => (
                        <div
                          key={r.id}
                          onClick={() => handleSelectRecipe(r.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={r.image} alt={r.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.chef} • {r.prepTime}</div>
                            </div>
                          </div>
                          <ArrowRight size={16} color="var(--primary)" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tool Results */}
                {matchingTools.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                      Kitchen Tools ({matchingTools.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {matchingTools.map(t => (
                        <div
                          key={t.id}
                          onClick={handleSelectTool}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={t.image} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>${t.price}</div>
                            </div>
                          </div>
                          <ArrowRight size={16} color="var(--primary)" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Class Results */}
                {matchingClasses.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                      Online Masterclasses ({matchingClasses.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {matchingClasses.map(c => (
                        <div
                          key={c.id}
                          onClick={handleSelectClass}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={c.image} alt={c.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.instructor} • {c.duration}</div>
                            </div>
                          </div>
                          <ArrowRight size={16} color="var(--primary)" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchingRecipes.length === 0 && matchingTools.length === 0 && matchingClasses.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No matching results found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grocery Checklist Drawer Modal */}
      {isGroceryOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 9, 14, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div className="animate-fade-in" style={{
            width: '100%',
            maxWidth: '420px',
            height: '100%',
            background: 'rgba(15, 22, 36, 0.96)',
            borderLeft: '1px solid var(--border-glass)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-glass)'
          }}>
            {isCheckingOut ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Truck size={22} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Instant Checkout</h3>
                  </div>
                  <button onClick={() => { setIsCheckingOut(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <ArrowRight size={22} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Choose your instant delivery partner:
                </p>

                {/* Delivery Partners Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { id: 'Blinkit', name: 'Blinkit', time: '10 mins', color: '#ffe100', text: '#000' },
                    { id: 'Zepto', name: 'Zepto', time: '9 mins', color: '#701a75', text: '#fff' },
                    { id: 'Instamart', name: 'Instamart', time: '12 mins', color: '#ff6c37', text: '#fff' },
                    { id: 'Whole Foods', name: 'Whole Foods', time: '25 mins', color: '#059669', text: '#fff' }
                  ].map(partner => (
                    <div
                      key={partner.id}
                      onClick={() => setSelectedService(partner.id)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        border: selectedService === partner.id ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
                        background: selectedService === partner.id ? 'rgba(197, 168, 128, 0.08)' : 'rgba(255,255,255,0.02)',
                        boxShadow: selectedService === partner.id ? 'var(--shadow-glow)' : 'none'
                      }}
                    >
                      <span style={{
                        background: partner.color,
                        color: partner.text,
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        marginBottom: '6px'
                      }}>{partner.name}</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>🛵 {partner.time}</div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Items ({groceryList.length})</span>
                    <span>₹{groceryList.length * 35}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
                    <span><span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '6px' }}>₹40</span> <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Handling & Packaging</span>
                    <span>₹10</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#10b981' }}>Chef Discount (MASTERCHEF)</span>
                    <span style={{ color: '#10b981' }}>-₹25</span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700 }}>
                    <span>To Pay</span>
                    <span style={{ color: 'var(--primary)' }}>₹{Math.max(50, groceryList.length * 35 + 10 - 25)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      placeDeliveryOrder(selectedService, groceryList.length);
                      setIsGroceryOpen(false);
                      setIsCheckingOut(false);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700 }}
                  >
                    Confirm & Place Order
                  </button>
                  <button
                    onClick={() => setIsCheckingOut(false)}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px' }}
                  >
                    Back to Checklist
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={22} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Grocery Checklist</h3>
                  </div>
                  <button onClick={() => setIsGroceryOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={22} />
                  </button>
                </div>

                {groceryList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                    <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '1rem', margin: 0 }}>Your grocery list is empty.</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Open any recipe in Explore and click "Add All to Grocery List"!</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', marginBottom: '20px' }}>
                      {groceryList.map((item, idx) => {
                        const isChecked = checkedItems.includes(item);
                        return (
                          <div
                            key={idx}
                            className="glass-panel"
                            onClick={() => toggleCheckItem(item)}
                            style={{
                              padding: '12px 16px',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              opacity: isChecked ? 0.5 : 1,
                              background: isChecked ? 'rgba(255,255,255,0.02)' : 'var(--bg-card)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '6px',
                                border: '1px solid var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isChecked ? 'var(--primary)' : 'transparent'
                              }}>
                                {isChecked && <Check size={14} color="#07090e" />}
                              </div>
                              <span style={{
                                fontSize: '0.9rem',
                                textDecoration: isChecked ? 'line-through' : 'none',
                                color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)'
                              }}>
                                {item}
                              </span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeFromGroceryList(item); }}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                      <button
                        onClick={() => {
                          if (activeDelivery) return;
                          setIsCheckingOut(true);
                        }}
                        disabled={!!activeDelivery}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '12px',
                          fontWeight: 700,
                          background: activeDelivery ? 'rgba(255,255,255,0.05)' : 'var(--primary-gradient)',
                          color: activeDelivery ? 'var(--text-secondary)' : '#07090e',
                          border: activeDelivery ? '1px solid var(--border-glass)' : 'none'
                        }}
                      >
                        {activeDelivery ? '🚚 Delivery in Progress...' : '⚡ Order via Instant Delivery'}
                      </button>
                      <button
                        onClick={clearGroceryList}
                        className="btn btn-secondary"
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                      >
                        Clear All Items
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
