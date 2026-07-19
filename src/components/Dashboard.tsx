import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, BookOpen, Clock, Flame, Award, User, ChefHat, Star, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { recipes, setCurrentView, setActiveRecipeId, isLoggedIn, setShowAuthModal } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax tilt effect on mouse move
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top  - cy) / cy;
      const card = hero.querySelector('.hero-card') as HTMLElement;
      if (card) {
        card.style.transform = `perspective(1200px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg) translateZ(10px)`;
      }
    };
    const reset = () => {
      const card = hero.querySelector('.hero-card') as HTMLElement;
      if (card) card.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    };
    hero.addEventListener('mousemove', handleMove);
    hero.addEventListener('mouseleave', reset);
    return () => { hero.removeEventListener('mousemove', handleMove); hero.removeEventListener('mouseleave', reset); };
  }, []);

  const trendingRecipes = recipes.slice(0, 3);

  const handleRecipeClick = (recipeId: string) => {
    setActiveRecipeId(recipeId);
    setCurrentView('recipes');
  };

  const stats = [
    { label: 'Premium Recipes', value: `${recipes.length}+`, icon: '🍽️' },
    { label: 'Master Chefs',    value: '50+',               icon: '👨‍🍳' },
    { label: 'Students Enrolled', value: '12K+',            icon: '🎓' },
    { label: 'Countries',        value: '80+',              icon: '🌍' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>

      {/* ─── HERO SECTION ─── */}
      <div
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 60% 40%, #1a0d2e 0%, #07090e 50%, #0d1a0a 100%)',
        }}
      >
        {/* Animated BG Video */}
        <video
          autoPlay loop muted playsInline
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.25, zIndex:0 }}
        >
          <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054ba208d130ab15e507b1d644d563a&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(7,9,14,0.2) 0%, rgba(7,9,14,0.75) 70%, #07090e 100%)', zIndex:1 }} />

        {/* Orbiting rings */}
        <div style={{ position:'absolute', width:'700px', height:'700px', border:'1px solid rgba(197,168,128,0.07)', borderRadius:'50%', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:1 }} className="animate-orbit-slow" />
        <div style={{ position:'absolute', width:'500px', height:'500px', border:'1px dashed rgba(197,168,128,0.1)', borderRadius:'50%', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:1 }} className="animate-orbit-medium" />
        <div style={{ position:'absolute', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(197,168,128,0.08) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:1 }} />

        {/* Floating particles */}
        {[
          { left:'15%', top:'65%', size:6 },
          { left:'80%', top:'55%', size:4 },
          { left:'30%', top:'75%', size:8 },
          { left:'68%', top:'70%', size:5 },
          { left:'50%', top:'80%', size:6 },
          { left:'90%', top:'40%', size:4 },
        ].map((p, i) => (
          <div key={i} className={`animate-particle-${(i % 4) + 1}`} style={{
            position:'absolute', left:p.left, top:p.top, zIndex:1,
            width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(197,168,128,0.8), transparent)',
          }} />
        ))}

        {/* Floating cuisine emoji decorations */}
        {[
          { emoji:'🔪', top:'18%', left:'8%',  delay:'0s',   size:'2rem' },
          { emoji:'🍴', top:'70%', left:'5%',  delay:'1s',   size:'1.6rem' },
          { emoji:'🧑‍🍳', top:'15%', right:'8%', delay:'0.5s', size:'2.2rem' },
          { emoji:'🌿', top:'72%', right:'6%', delay:'1.5s', size:'1.8rem' },
          { emoji:'⭐', top:'40%', left:'4%',  delay:'2s',   size:'1.4rem' },
        ].map((d, i) => (
          <div key={i} className="animate-float-slow" style={{
            position:'absolute', top:d.top, left:(d as any).left, right:(d as any).right,
            fontSize:d.size, zIndex:2, animationDelay:d.delay, opacity:0.55,
            filter:'drop-shadow(0 0 8px rgba(197,168,128,0.4))'
          }}>{d.emoji}</div>
        ))}

        {/* Steam effects at bottom */}
        {[{ left:'35%' }, { left:'50%' }, { left:'65%' }].map((s, i) => (
          <div key={i} className={`animate-steam-${i + 1}`} style={{
            position:'absolute', bottom:'10%', left:s.left, zIndex:1,
            width:'4px', height:'30px', borderRadius:'4px',
            background:'linear-gradient(to top, rgba(197,168,128,0.5), transparent)',
          }} />
        ))}

        {/* ─── HERO CARD (3D tilt target) ─── */}
        <div
          className="hero-card animate-border-glow"
          style={{
            position:'relative', zIndex:3,
            padding:'52px 60px',
            maxWidth:'800px', width:'90%',
            background:'rgba(7,9,14,0.78)',
            backdropFilter:'blur(24px)',
            WebkitBackdropFilter:'blur(24px)',
            border:'1px solid rgba(197,168,128,0.28)',
            borderRadius:'32px',
            textAlign:'center',
            transition:'transform 0.15s ease',
            willChange:'transform',
          }}
        >
          {/* Top badge */}
          <div className="animate-slide-up-1" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'22px' }}>
            <span style={{ width:'40px', height:'1px', background:'var(--primary)', opacity:0.5 }} />
            <span style={{
              color:'var(--primary)', textTransform:'uppercase', fontWeight:700,
              fontSize:'0.72rem', letterSpacing:'0.38em',
            }}>The Art of Haute Cuisine</span>
            <span style={{ width:'40px', height:'1px', background:'var(--primary)', opacity:0.5 }} />
          </div>

          {/* Main title with shimmer */}
          <h1 className="animate-slide-up-2 animate-shimmer" style={{
            fontSize:'clamp(3.2rem, 8vw, 6rem)',
            lineHeight:1.0, fontWeight:900,
            fontFamily:"'Playfair Display', serif",
            marginBottom:'12px', letterSpacing:'-0.02em',
          }}>
            Kitchen Hub
          </h1>

          <p className="animate-slide-up-3" style={{
            fontSize:'clamp(1rem, 2.5vw, 1.6rem)',
            fontFamily:"'Playfair Display', serif",
            fontStyle:'italic', color:'#d4c4b0',
            marginBottom:'28px', letterSpacing:'0.02em',
          }}>
            Where Culinary Art Meets Modern Gastronomy
          </p>

          <p className="animate-slide-up-4" style={{
            color:'rgba(255,255,255,0.72)', fontSize:'1rem',
            lineHeight:1.75, maxWidth:'580px', margin:'0 auto 40px auto',
          }}>
            Discover Michelin-inspired recipes, learn from world-class chefs,
            and shop artisanal kitchenware. Elevate home cooking to a sensory masterwork.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up-5" style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <button
              onClick={() => setCurrentView('recipes')}
              className="btn btn-primary"
              style={{ padding:'15px 32px', borderRadius:'14px', fontSize:'0.9rem', fontWeight:700, gap:'10px', boxShadow:'0 0 35px rgba(197,168,128,0.3)' }}
            >
              <Compass size={18} /> Explore Recipes
            </button>

            {!isLoggedIn ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn btn-secondary"
                style={{ padding:'15px 32px', borderRadius:'14px', fontSize:'0.9rem', fontWeight:700, borderColor:'rgba(197,168,128,0.4)', color:'#fff' }}
              >
                <User size={18} color="var(--primary)" /> Sign In / Join Hub
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('academy')}
                className="btn btn-secondary"
                style={{ padding:'15px 32px', borderRadius:'14px', fontSize:'0.9rem', fontWeight:700, borderColor:'rgba(197,168,128,0.4)', color:'#fff' }}
              >
                <BookOpen size={18} color="var(--primary)" /> Culinary Academy
              </button>
            )}
          </div>

          {/* Glow dot accent */}
          <div className="animate-glow-ring" style={{
            position:'absolute', bottom:'-18px', left:'50%', transform:'translateX(-50%)',
            width:'36px', height:'36px', borderRadius:'50%',
            background:'var(--primary-gradient)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <ChefHat size={16} color="#07090e" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)',
          zIndex:3, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px'
        }}>
          <span style={{ fontSize:'0.7rem', color:'rgba(197,168,128,0.5)', letterSpacing:'0.15em', textTransform:'uppercase' }}>Scroll</span>
          <div className="animate-float-slow" style={{ width:'1px', height:'32px', background:'linear-gradient(to bottom, rgba(197,168,128,0.5), transparent)' }} />
        </div>
      </div>

      {/* ─── STATS BAR ─── */}
      <div style={{ background:'rgba(197,168,128,0.04)', borderTop:'1px solid rgba(197,168,128,0.12)', borderBottom:'1px solid rgba(197,168,128,0.12)' }}>
        <div className="container" style={{ paddingTop:'32px', paddingBottom:'32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'24px' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:'6px' }}>{s.icon}</div>
                <div style={{ fontSize:'2rem', fontWeight:800, fontFamily:"'Playfair Display', serif", color:'var(--primary)' }}>{s.value}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TRENDING MASTERPIECES ─── */}
      <div className="container" style={{ paddingTop:'80px' }}>
        <div className="flex-between" style={{ marginBottom:'48px', alignItems:'flex-end' }}>
          <div>
            <span style={{ color:'var(--primary)', textTransform:'uppercase', fontWeight:600, fontSize:'0.72rem', letterSpacing:'0.22em', display:'block', marginBottom:'8px' }}>
              Curated Selection
            </span>
            <h2 style={{ fontSize:'2.6rem', margin:0 }}>Trending Masterpieces</h2>
          </div>
          <button onClick={() => { setActiveRecipeId(null); setCurrentView('recipes'); }} className="btn btn-secondary" style={{ fontSize:'0.8rem' }}>
            View All Creations
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px,1fr))', gap:'40px', marginTop:'20px' }}>
          {trendingRecipes.map((recipe, idx) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
              className="glass-panel glass-panel-hover"
              style={{ cursor:'pointer', overflow:'hidden', display:'flex', flexDirection:'column', borderRadius:'20px', animationDelay:`${idx * 0.12}s` }}
            >
              {/* Image */}
              <div className="hover-zoom-container" style={{ height:'260px', position:'relative' }}>
                <img src={recipe.image} alt={recipe.title} className="hover-zoom-image" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(7,9,14,0.6) 0%, transparent 50%)' }} />
                {/* Difficulty badge */}
                <span className={`tag ${recipe.difficulty==='Easy'?'tag-easy':recipe.difficulty==='Medium'?'tag-medium':'tag-expert'}`}
                  style={{ position:'absolute', top:'14px', right:'14px', zIndex:2 }}>
                  {recipe.difficulty}
                </span>
                {/* Rating on image */}
                {recipe.reviews.length > 0 && (
                  <div style={{ position:'absolute', bottom:'14px', left:'14px', zIndex:2, display:'flex', alignItems:'center', gap:'4px', background:'rgba(7,9,14,0.75)', padding:'4px 10px', borderRadius:'20px' }}>
                    <Star size={12} fill="#c5a880" color="#c5a880" />
                    <span style={{ fontSize:'0.75rem', color:'#c5a880', fontWeight:600 }}>
                      {(recipe.reviews.reduce((a,r) => a + r.rating, 0) / recipe.reviews.length).toFixed(1)}
                    </span>
                    <span style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.5)' }}>({recipe.reviews.length})</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding:'28px', display:'flex', flexDirection:'column', flexGrow:1, justifyContent:'space-between' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                    <span style={{ fontSize:'0.72rem', color:'var(--primary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>{recipe.chef}</span>
                    <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>•</span>
                    <div style={{ display:'flex', alignItems:'center', gap:'4px', color:'var(--text-secondary)', fontSize:'0.72rem' }}>
                      <Clock size={11} color="var(--primary)" /> {recipe.prepTime}
                    </div>
                  </div>
                  <h3 style={{ fontSize:'1.5rem', lineHeight:1.3, marginBottom:'10px' }}>{recipe.title}</h3>
                  <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {recipe.description}
                  </p>
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border-glass)', paddingTop:'18px', marginTop:'16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                    <Flame size={13} color="var(--primary)" />
                    <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>{recipe.calories} kcal</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                    <Award size={13} color="var(--primary)" />
                    <span style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--primary)' }}>
                      {recipe.reviews.length > 0
                        ? `${(recipe.reviews.reduce((a,r) => a+r.rating,0)/recipe.reviews.length).toFixed(1)} ★`
                        : 'New'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURE HIGHLIGHTS ─── */}
      <div className="container" style={{ paddingTop:'80px' }}>
        <div style={{ textAlign:'center', marginBottom:'52px' }}>
          <span style={{ color:'var(--primary)', textTransform:'uppercase', fontWeight:600, fontSize:'0.72rem', letterSpacing:'0.22em', display:'block', marginBottom:'10px' }}>Why Kitchen Hub</span>
          <h2 style={{ fontSize:'2.4rem', margin:0 }}>The Complete Culinary Experience</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:'28px' }}>
          {[
            { icon:'🍽️', title:'Premium Recipes', desc:'Michelin-starred techniques adapted for your kitchen with step-by-step video guides.', color:'#c5a880' },
            { icon:'🎓', title:'Live Masterclasses', desc:'Learn directly from world-class chefs. Enroll, watch, and cook along in real-time.', color:'#a78bfa' },
            { icon:'🤖', title:'AI Chef Advisor', desc:'Ask our AI Sommelier anything — wine pairings, substitutions, plating techniques.', color:'#34d399' },
            { icon:'🛒', title:'Artisan Marketplace', desc:'Shop curated professional kitchenware sourced from top culinary suppliers.', color:'#f59e0b' },
          ].map((f, i) => (
            <div key={i} className="glass-panel glass-panel-hover" style={{ padding:'32px 28px', textAlign:'center', cursor:'default' }}>
              <div style={{ fontSize:'2.4rem', marginBottom:'16px', filter:`drop-shadow(0 0 12px ${f.color}60)` }}>{f.icon}</div>
              <h3 style={{ fontSize:'1.2rem', marginBottom:'10px', color:f.color }}>{f.title}</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem', lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA BANNER ─── */}
      {!isLoggedIn && (
        <div className="container" style={{ paddingTop:'80px' }}>
          <div style={{
            background:'linear-gradient(135deg, rgba(197,168,128,0.12) 0%, rgba(100,60,200,0.08) 100%)',
            border:'1px solid rgba(197,168,128,0.25)',
            borderRadius:'24px', padding:'52px 40px', textAlign:'center',
            position:'relative', overflow:'hidden',
          }}>
            <div className="animate-scan" />
            <Sparkles size={36} color="var(--primary)" style={{ marginBottom:'16px' }} />
            <h2 style={{ fontSize:'2.2rem', marginBottom:'12px' }}>Ready to Elevate Your Cooking?</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'1rem', maxWidth:'500px', margin:'0 auto 32px auto', lineHeight:1.7 }}>
              Join thousands of food lovers mastering Michelin techniques from the comfort of their kitchen.
            </p>
            <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ padding:'16px 40px', fontSize:'1rem', borderRadius:'14px' }}>
              Join Kitchen Hub Free
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
