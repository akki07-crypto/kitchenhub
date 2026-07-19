import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import VoiceCookMode from './VoiceCookMode';
import PlatingStudio from './PlatingStudio';
import { 
  Clock, 
  Flame, 
  ArrowLeft, 
  Heart, 
  Play, 
  ShoppingBag, 
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Timer,
  ChefHat,
  Mic
} from 'lucide-react';

const Explore: React.FC = () => {
  const { 
    recipes, 
    activeRecipeId, 
    setActiveRecipeId, 
    currentUser, 
    saveRecipe, 
    addToGroceryList,
    showToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showVideo, setShowVideo] = useState(false);
  const [isSticky, setIsSticky] = useState(false);



  // Guided Cooking State
  const [isGuidedCooking, setIsGuidedCooking] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);
  const [isVoiceCookMode, setIsVoiceCookMode] = useState(false);
  const [isPlatingStudio, setIsPlatingStudio] = useState(false);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);

  // Timer Ticker
  useEffect(() => {
    let interval: any = null;
    if (activeTimerSeconds !== null && activeTimerSeconds > 0) {
      interval = setInterval(() => {
        setActiveTimerSeconds(prev => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    } else if (activeTimerSeconds === 0) {
      showToast('⏰ Cooking Step Timer Finished!', 'success');
      setActiveTimerSeconds(null);
    }
    return () => clearInterval(interval);
  }, [activeTimerSeconds, showToast]);

  // Scroll detection for Sticky PiP
  useEffect(() => {
    const handleScroll = () => {
      if (showVideo) {
        if (window.scrollY > 350) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showVideo]);

  useEffect(() => {
    setShowVideo(false);
    setIsSticky(false);
    setIsGuidedCooking(false);
    setCookingStep(0);
    setActiveTimerSeconds(null);
  }, [activeRecipeId]);

  // Filter recipes by search, difficulty, and nutritional category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || 
                          recipe.chef.toLowerCase().includes(search.toLowerCase()) ||
                          (recipe.category && recipe.category.toLowerCase().includes(search.toLowerCase()));
    
    let matchesCategory = true;
    if (filterCategory === 'High Protein') {
      matchesCategory = recipe.category === 'High Protein';
    } else if (filterCategory === 'High Calorie') {
      matchesCategory = recipe.category === 'High Calorie' || recipe.calories >= 550;
    } else if (filterCategory === 'Sweet Dessert') {
      matchesCategory = recipe.category === 'Sweet Dessert';
    } else if (filterCategory === 'Vegetarian') {
      matchesCategory = recipe.category === 'Vegetarian';
    } else if (filterCategory === 'Chef Special') {
      matchesCategory = recipe.difficulty === 'Expert' || Boolean(recipe.tags?.includes('Chef Special'));
    } else if (filterCategory === 'Easy' || filterCategory === 'Medium' || filterCategory === 'Expert') {
      matchesCategory = recipe.difficulty === filterCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const activeRecipe = recipes.find(r => r.id === activeRecipeId);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : '';
  };





  // Render Grid list of recipes
  if (!activeRecipe) {
    return (
      <div className="container animate-fade-in">
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Culinary Engine
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '8px', marginBottom: '16px' }}>
            Explore Gastronomy
          </h1>

          {/* Plating Studio CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '900px', margin: '-8px auto 16px' }}>
            <button
              onClick={() => setIsPlatingStudio(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(159,103,247,0.08))', border: '1px solid rgba(124,58,237,0.35)', color: '#a78bfa', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(159,103,247,0.15))'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(159,103,247,0.08))'; }}
            >
              🎨 Open Plating Studio
            </button>
          </div>



          {/* Search and filter bars */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            <input 
              type="text" 
              placeholder="Search recipes, ingredients, chefs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ padding: '16px 20px', borderRadius: '14px', fontSize: '1rem' }}
            />
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { id: 'All', label: 'All Recipes' },
                { id: 'High Protein', label: '💪 High Protein' },
                { id: 'High Calorie', label: '🔥 High Calorie' },
                { id: 'Sweet Dessert', label: '🍰 Sweet Dessert' },
                { id: 'Vegetarian', label: '🥗 Vegetarian' },
                { id: 'Chef Special', label: '🌟 Chef Special' },
                { id: 'Easy', label: 'Easy' },
                { id: 'Medium', label: 'Medium' },
                { id: 'Expert', label: 'Expert' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className="btn"
                  style={{
                    background: filterCategory === cat.id ? 'var(--primary-gradient)' : 'rgba(197, 168, 128, 0.05)',
                    color: filterCategory === cat.id ? '#07090e' : 'var(--text-primary)',
                    border: filterCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    borderRadius: '10px'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid System */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '40px'
        }}>
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setActiveRecipeId(recipe.id)}
              className="glass-panel glass-panel-hover"
              style={{
                cursor: 'pointer',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '460px'
              }}
            >
              {/* Card Image */}
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  className="hover-zoom-image"
                />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <span className="tag" style={{ background: 'var(--bg-dark)', color: 'var(--primary)' }}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{recipe.chef}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <Clock size={12} color="var(--primary)" />
                      {recipe.prepTime}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', lineHeight: 1.3, marginBottom: '8px' }}>{recipe.title}</h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{recipe.description}</p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-glass)',
                  paddingTop: '16px',
                  marginTop: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{recipe.calories} Kcal</span>
                    </div>
                    {recipe.protein && (
                      <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '2px 6px', borderRadius: '6px', fontWeight: 600 }}>
                        💪 {recipe.protein}
                      </span>
                    )}
                    {recipe.category && (
                      <span style={{ fontSize: '0.7rem', background: 'rgba(197, 168, 128, 0.1)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '6px', fontWeight: 600 }}>
                        {recipe.category}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} fill="var(--primary)" color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {recipe.reviews.length > 0 
                        ? `${(recipe.reviews.reduce((acc, r) => acc + r.rating, 0) / recipe.reviews.length).toFixed(1)} ★ (${recipe.reviews.length})`
                        : 'New dish'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    );
  }

  // Render Split-screen Detail View
  const isSaved = currentUser ? currentUser.savedRecipes.includes(activeRecipe.id) : false;
  const avgRating = activeRecipe.reviews.length > 0
    ? (activeRecipe.reviews.reduce((acc, r) => acc + r.rating, 0) / activeRecipe.reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <button 
          onClick={() => setActiveRecipeId(null)}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '10px 18px' }}
        >
          <ArrowLeft size={16} />
          Back to Gallery
        </button>

        {/* Start Guided Cooking Mode Button */}
        <button
          onClick={() => { setIsGuidedCooking(true); setCookingStep(0); }}
          className="btn btn-primary"
          style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}
        >
          <ChefHat size={18} color="#07090e" />
          🍳 Start Hands-Free Guided Cooking Mode
        </button>
      </div>

      {/* Split-Screen Layout on Desktop */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '48px',
        flexWrap: 'wrap'
      }}>
        
        {/* Left Side: Media Window */}
        <div style={{
          flex: '1 1 450px',
          position: 'sticky',
          top: '110px',
          alignSelf: 'flex-start',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Main Visual Frame */}
          <div className="glass-panel" style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            height: '420px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-glass)'
          }}>
            {!showVideo ? (
              <>
                <img 
                  src={activeRecipe.image} 
                  alt={activeRecipe.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Embed Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(7,9,14,0.7) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '32px',
                  zIndex: 2
                }}>
                  <button 
                    onClick={() => setShowVideo(true)}
                    className="btn btn-primary"
                    style={{ width: '100%', gap: '10px', borderRadius: '14px', padding: '14px' }}
                  >
                    <Play size={20} fill="currentColor" />
                    Watch Masterclass Video
                  </button>
                </div>
              </>
            ) : (
              /* Inline Player (when not sticky) */
              !isSticky && (
                <iframe
                  width="100%"
                  height="100%"
                  src={getYoutubeEmbedUrl(activeRecipe.videoUrl)}
                  title="Chef Masterclass Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )
            )}
          </div>

          {/* Cooking stats card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderRadius: '16px', textAlign: 'center' }}>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Difficulty
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--primary)' }}>
                {activeRecipe.difficulty}
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Prep Time
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--primary)' }}>
                {activeRecipe.prepTime}
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Calories
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--primary)' }}>
                {activeRecipe.calories} Kcal
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Protein
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 650, color: '#10b981' }}>
                {activeRecipe.protein || '35g'}
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Carbs
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 650, color: '#f59e0b' }}>
                {activeRecipe.carbs || '24g'}
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Fat
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--primary)' }}>
                {activeRecipe.fat || '30g'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Scrollable Details */}
        <div style={{
          flex: '1 1 500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px'
        }}>
          {/* Header Metadata */}
          <div>
            <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  By {activeRecipe.chef}
                </span>
                <h1 style={{ fontSize: '3rem', margin: '6px 0 12px 0', lineHeight: 1.1 }}>{activeRecipe.title}</h1>
              </div>
              
              {/* Save Button */}
              <button 
                onClick={() => saveRecipe(activeRecipe.id)}
                className="btn btn-secondary"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: isSaved ? 'var(--primary)' : 'var(--border-glass)',
                  background: isSaved ? 'var(--primary-glow)' : 'transparent'
                }}
              >
                <Heart size={20} fill={isSaved ? 'var(--primary)' : 'transparent'} color={isSaved ? 'var(--primary)' : 'var(--text-secondary)'} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                <Star size={16} fill="var(--primary)" color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{avgRating}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({activeRecipe.reviews.length} reviews)</span>
              </div>
            </div>
            
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginTop: '20px',
              fontStyle: 'italic'
            }}>{activeRecipe.description}</p>
          </div>

          <div style={{ height: '1px', background: 'var(--border-glass)' }}></div>

          {/* Checklist of Ingredients */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Ingredients</h2>
              <button 
                onClick={() => addToGroceryList(activeRecipe.ingredients)}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ShoppingBag size={14} color="#07090e" />
                Add All to Grocery List
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeRecipe.ingredients.map((ing, i) => (
                <label key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: 'var(--text-primary)'
                }}>
                  <input type="checkbox" style={{
                    accentColor: 'var(--primary)',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }} />
                  <span>{ing}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-glass)' }}></div>


          {/* Cook Mode Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <button
              onClick={() => { setCookingStep(0); setIsGuidedCooking(true); }}
              className="btn btn-secondary"
              style={{ flex: 1, borderRadius: '14px', padding: '14px', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChefHat size={18} /> Guided Cook Mode
            </button>
            <button
              onClick={() => setIsVoiceCookMode(true)}
              style={{ flex: 1, borderRadius: '14px', padding: '14px', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(197,168,128,0.12), rgba(197,168,128,0.06))', border: '1px solid rgba(197,168,128,0.35)', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <Mic size={18} /> Voice Cook Mode
            </button>
          </div>

          {/* Cooking Steps */}
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '18px' }}>Preparation Steps</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {activeRecipe.steps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    background: 'var(--primary-glow)',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                    fontSize: '0.9rem'
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    paddingTop: '3px'
                  }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Guided Cooking Mode Modal */}
      {isGuidedCooking && activeRecipe && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 9, 14, 0.96)',
          backdropFilter: 'blur(20px)',
          zIndex: 10002,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px'
        }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ChefHat size={28} color="var(--primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Guided Cooking Mode</span>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{activeRecipe.title}</h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {activeTimerSeconds !== null && (
                <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '12px', color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Timer size={18} />
                  {Math.floor(activeTimerSeconds / 60)}:{(activeTimerSeconds % 60).toString().padStart(2, '0')}
                </div>
              )}

              <button
                onClick={() => setIsGuidedCooking(false)}
                className="btn btn-secondary"
                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Center Step Card (Giant Typography) */}
          <div className="glass-panel animate-fade-in" style={{
            maxWidth: '850px',
            margin: '0 auto',
            width: '100%',
            padding: '48px',
            borderRadius: '28px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-glass)'
          }}>
            <span style={{
              background: 'var(--primary-glow)',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Step {cookingStep + 1} of {activeRecipe.steps.length}
            </span>

            <p style={{
              fontSize: '1.8rem',
              lineHeight: 1.5,
              marginTop: '32px',
              marginBottom: '40px',
              color: 'var(--text-primary)',
              fontFamily: 'Playfair Display, serif'
            }}>
              "{activeRecipe.steps[cookingStep]}"
            </p>

            {/* Quick Timer Triggers */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setActiveTimerSeconds(120)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '10px' }}
              >
                ⏱️ Start 2-Min Sear Timer
              </button>
              <button
                onClick={() => setActiveTimerSeconds(300)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '10px' }}
              >
                ⏱️ Start 5-Min Simmer Timer
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
            <button
              disabled={cookingStep === 0}
              onClick={() => setCookingStep(prev => Math.max(0, prev - 1))}
              className="btn btn-secondary"
              style={{ padding: '14px 28px', borderRadius: '14px', opacity: cookingStep === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={20} />
              Previous Step
            </button>

            {cookingStep < activeRecipe.steps.length - 1 ? (
              <button
                onClick={() => setCookingStep(prev => Math.min(activeRecipe.steps.length - 1, prev + 1))}
                className="btn btn-primary"
                style={{ padding: '14px 28px', borderRadius: '14px', fontWeight: 700 }}
              >
                Next Step
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => { setIsGuidedCooking(false); showToast('🎉 Congratulations! Dish Completed!', 'success'); }}
                className="btn btn-primary"
                style={{ padding: '14px 28px', borderRadius: '14px', fontWeight: 700, background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                Finish Dish 🎉
              </button>
            )}
          </div>
        </div>
      )}
      {/* Voice Cook Mode */}
      {isVoiceCookMode && activeRecipe && (
        <VoiceCookMode
          recipe={activeRecipe}
          onClose={() => setIsVoiceCookMode(false)}
        />
      )}
      {/* Plating Studio */}
      {isPlatingStudio && (
        <PlatingStudio onClose={() => setIsPlatingStudio(false)} />
      )}
    </div>
  );
};

export default Explore;
