import React, { useState } from 'react';
import { useApp, type MealPlanDay, type MealSlot, type IRecipe } from '../context/AppContext';
import { Calendar, Plus, Trash2, ShoppingBag, Flame, ChevronRight, X } from 'lucide-react';

const MealPlanner: React.FC = () => {
  const { mealPlan, recipes, addToMealPlan, removeFromMealPlan, exportMealPlanToGrocery, setCurrentView, setActiveRecipeId } = useApp();
  const [selectedSlot, setSelectedSlot] = useState<{ day: MealPlanDay; slot: MealSlot } | null>(null);
  const [activeDay, setActiveDay] = useState<MealPlanDay>('mon');
  const [macroTargets, setMacroTargets] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_macro_targets');
      return saved ? JSON.parse(saved) : { calories: 2000, protein: 150, carbs: 220, fat: 70 };
    } catch (e) {
      return { calories: 2000, protein: 150, carbs: 220, fat: 70 };
    }
  });

  const updateTarget = (key: string, val: number) => {
    const next = { ...macroTargets, [key]: val };
    setMacroTargets(next);
    localStorage.setItem('kh_macro_targets', JSON.stringify(next));
  };

  const days: { id: MealPlanDay; name: string }[] = [
    { id: 'mon', name: 'Monday' },
    { id: 'tue', name: 'Tuesday' },
    { id: 'wed', name: 'Wednesday' },
    { id: 'thu', name: 'Thursday' },
    { id: 'fri', name: 'Friday' },
    { id: 'sat', name: 'Saturday' },
    { id: 'sun', name: 'Sunday' },
  ];

  const slots: { id: MealSlot; name: string; icon: string }[] = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
    { id: 'lunch', name: 'Lunch', icon: '☀️' },
    { id: 'dinner', name: 'Dinner', icon: '🌙' },
  ];

  // Calculate weekly totals
  let totalCalories = 0;
  let totalProteinGrams = 0;
  let scheduledCount = 0;

  Object.values(mealPlan).forEach(dayObj => {
    Object.values(dayObj).forEach(recipe => {
      if (recipe) {
        scheduledCount++;
        totalCalories += recipe.calories || 0;
        if (recipe.protein) {
          const p = parseInt(recipe.protein.replace('g', ''), 10);
          if (!isNaN(p)) totalProteinGrams += p;
        }
      }
    });
  });

  const handleSelectRecipeForSlot = (recipe: IRecipe) => {
    if (!selectedSlot) return;
    addToMealPlan(selectedSlot.day, selectedSlot.slot, recipe);
    setSelectedSlot(null);
  };

  // Compute daily macro totals for active day
  let dayCal = 0, dayProtein = 0, dayCarbs = 0, dayFat = 0;
  const dayMeals = mealPlan[activeDay] || {};
  Object.values(dayMeals).forEach((recipe: any) => {
    if (recipe) {
      dayCal += recipe.calories || 0;
      if (recipe.protein) { const p = parseInt(recipe.protein.replace('g', ''), 10); if (!isNaN(p)) dayProtein += p; }
      if (recipe.carbs) { const c = parseInt(recipe.carbs.replace('g', ''), 10); if (!isNaN(c)) dayCarbs += c; }
      if (recipe.fat) { const f = parseInt(recipe.fat.replace('g', ''), 10); if (!isNaN(f)) dayFat += f; }
    }
  });

  const getAdvice = () => {
    if (dayCal === 0) return { message: `No meals for ${days.find(d => d.id === activeDay)?.name} yet.`, tips: 'Assign recipes to breakfast, lunch, or dinner slots below to calculate macro ratios.', variant: 'info' };
    if (dayProtein < macroTargets.protein * 0.7) return { message: '⚠️ Daily Protein intake is low!', tips: "Add high-protein options like 'Wagyu Ribeye Steak' or 'Chef Melissa's Salmon' to reach your goal.", variant: 'warning' };
    if (dayCal > macroTargets.calories) return { message: '🚨 Daily Calorie budget exceeded!', tips: "Replace a heavier course with 'Artisanal Burrata Salad' or a seasonal vegetable side.", variant: 'danger' };
    return { message: '🌟 Perfect Macro Balance!', tips: 'Your planned meals align beautifully with your daily nutritional limits. Excellent work!', variant: 'success' };
  };
  const advice = getAdvice();

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Calendar size={18} color="var(--primary)" />
          <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Weekly Menu Engine
          </span>
        </div>
        <h1 style={{ fontSize: '3rem', marginTop: '4px', marginBottom: '16px' }}>Gourmet Meal Planner</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.5 }}>
          Schedule your weekly breakfast, lunch, and dinner menus with automated macro calculation and 1-click grocery list export.
        </p>

        {/* Stats & Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '28px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '12px 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={20} color="var(--primary)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Meals Planned</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{scheduledCount} / 21</strong>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '12px 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Flame size={20} color="var(--primary)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Total Weekly Energy</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{totalCalories} Kcal</strong>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '12px 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.3rem' }}>💪</span>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Weekly Protein</span>
              <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{totalProteinGrams}g</strong>
            </div>
          </div>

          <button
            onClick={exportMealPlanToGrocery}
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <ShoppingBag size={16} />
            Export Grocery List
          </button>
        </div>
      </div>

      {/* ── DAILY MACRO BUDGET & TRACKER ── */}
      <div style={{
        borderRadius: '24px',
        padding: '28px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(7,9,14,0.97) 0%, rgba(12,16,26,0.97) 100%)',
        border: '1px solid rgba(197,168,128,0.22)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(197,168,128,0.07)'
      }}>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(197,168,128,0.1)', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#c5a880,#9a7a50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🎯</div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'Playfair Display, serif', color: '#ffffff', fontWeight: 700 }}>Daily Macro Budget &amp; Tracker</h2>
              <p style={{ fontSize: '0.76rem', color: '#475569', margin: 0 }}>Select a day to track and balance your macronutrient values.</p>
            </div>
          </div>

          {/* Day Tab Buttons */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {days.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                style={{
                  padding: '7px 13px',
                  borderRadius: '10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: activeDay === d.id ? '1px solid rgba(197,168,128,0.55)' : '1px solid rgba(255,255,255,0.06)',
                  background: activeDay === d.id ? 'linear-gradient(135deg,#c5a880,#9a7a50)' : 'rgba(255,255,255,0.03)',
                  color: activeDay === d.id ? '#07090e' : '#64748b',
                  transition: 'all 0.18s',
                  boxShadow: activeDay === d.id ? '0 3px 14px rgba(197,168,128,0.28)' : 'none'
                }}
              >
                {d.name.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>

          {/* LEFT — Set Goals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.62rem', color: '#475569', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>Set Nutrition Goals</h4>
            {[
              { key: 'calories', label: 'Energy Budget', unit: 'Kcal', color: '#c5a880', step: 100 },
              { key: 'protein',  label: 'Protein Target', unit: 'g',    color: '#10b981', step: 10  },
              { key: 'carbs',    label: 'Carbs Budget',   unit: 'g',    color: '#3b82f6', step: 10  },
              { key: 'fat',      label: 'Fats Budget',    unit: 'g',    color: '#f59e0b', step: 5   },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '11px 14px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', display: 'block' }}>{item.label}</span>
                  <span style={{ fontSize: '0.66rem', color: '#334155' }}>Per day</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => updateTarget(item.key, Math.max(0, (macroTargets as any)[item.key] - item.step))} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: '#64748b', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                  <strong style={{ fontSize: '0.9rem', color: item.color, minWidth: '66px', textAlign: 'center', fontFamily: 'monospace' }}>{(macroTargets as any)[item.key]} {item.unit}</strong>
                  <button onClick={() => updateTarget(item.key, (macroTargets as any)[item.key] + item.step)} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: '#64748b', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* MIDDLE — Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h4 style={{ fontSize: '0.62rem', color: '#475569', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>Daily Macros Met</h4>
            {[
              { label: 'Calories',      actual: dayCal,     target: macroTargets.calories, color: '#c5a880', glow: 'rgba(197,168,128,0.45)', unit: 'Kcal' },
              { label: 'Protein',       actual: dayProtein, target: macroTargets.protein,  color: '#10b981', glow: 'rgba(16,185,129,0.45)',  unit: 'g'    },
              { label: 'Carbohydrates', actual: dayCarbs,   target: macroTargets.carbs,    color: '#3b82f6', glow: 'rgba(59,130,246,0.45)',  unit: 'g'    },
              { label: 'Fats',          actual: dayFat,     target: macroTargets.fat,       color: '#f59e0b', glow: 'rgba(245,158,11,0.45)',  unit: 'g'    },
            ].map(macro => {
              const pct = Math.min(100, Math.round((macro.actual / macro.target) * 100)) || 0;
              const isOver = macro.actual > macro.target && macro.label === 'Calories';
              return (
                <div key={macro.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{macro.label}</span>
                    <span style={{ fontSize: '0.73rem', color: '#475569' }}>
                      <strong style={{ color: isOver ? '#f87171' : macro.color, fontSize: '0.86rem' }}>{macro.actual}</strong>
                      <span style={{ color: '#1e293b' }}> / </span>
                      {macro.target} {macro.unit}
                      <span style={{ marginLeft: '5px', background: isOver ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '8px', fontSize: '0.66rem', color: isOver ? '#f87171' : '#475569' }}>{pct}%</span>
                    </span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: isOver ? 'linear-gradient(90deg,#f87171,#ef4444)' : macro.color,
                      borderRadius: '10px',
                      transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                      boxShadow: pct > 0 ? `0 0 8px ${isOver ? 'rgba(239,68,68,0.5)' : macro.glow}` : 'none'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — Chef Advice */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.62rem', color: '#475569', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>Chef Nutritionist Advice</h4>
            <div style={{
              flex: 1, borderRadius: '16px', padding: '20px',
              background: advice.variant === 'warning' ? 'rgba(234,179,8,0.06)' : advice.variant === 'danger' ? 'rgba(239,68,68,0.06)' : advice.variant === 'success' ? 'rgba(16,185,129,0.06)' : 'rgba(197,168,128,0.04)',
              border: `1px solid ${advice.variant === 'warning' ? 'rgba(234,179,8,0.22)' : advice.variant === 'danger' ? 'rgba(239,68,68,0.22)' : advice.variant === 'success' ? 'rgba(16,185,129,0.22)' : 'rgba(197,168,128,0.13)'}`,
              display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center'
            }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: advice.variant === 'warning' ? '#fbbf24' : advice.variant === 'danger' ? '#f87171' : advice.variant === 'success' ? '#34d399' : '#c5a880' }}>
                {advice.message}
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#64748b', margin: 0 }}>{advice.tips}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {days.map(day => (
          <div key={day.id} className="glass-panel" style={{ borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Playfair Display, serif', color: 'var(--primary)' }}>{day.name}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>7-Day Schedule</span>
            </div>

            {slots.map(slot => {
              const recipe = mealPlan[day.id]?.[slot.id];
              return (
                <div key={slot.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{slot.icon}</span> {slot.name}
                    </span>
                    {recipe && (
                      <button onClick={() => removeFromMealPlan(day.id, slot.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }} title="Remove meal">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {recipe ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img src={recipe.image} alt={recipe.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h4 onClick={() => { setActiveRecipeId(recipe.id); setCurrentView('recipes'); }} style={{ fontSize: '0.85rem', margin: '0 0 2px 0', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}>
                          {recipe.title}
                        </h4>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                          <span>🔥 {recipe.calories} Kcal</span>
                          {recipe.protein && <span style={{ color: '#10b981' }}>💪 {recipe.protein}</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedSlot({ day: day.id, slot: slot.id })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'transparent', border: '1px dashed var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Plus size={14} /> Assign Recipe
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Recipe Selection Modal */}
      {selectedSlot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,9,14,0.85)', backdropFilter: 'blur(12px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '550px', borderRadius: '24px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setSelectedSlot(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif' }}>
              Select Recipe for {selectedSlot.day.toUpperCase()} {selectedSlot.slot.toUpperCase()}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Choose a dish from your Kitchen Hub recipe collection:
            </p>

            <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recipes.map(recipe => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelectRecipeForSlot(recipe)}
                  style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  className="glass-panel-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={recipe.image} alt={recipe.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>{recipe.title}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {recipe.chef} • 🔥 {recipe.calories} Kcal {recipe.protein && `• 💪 ${recipe.protein}`}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--primary)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
