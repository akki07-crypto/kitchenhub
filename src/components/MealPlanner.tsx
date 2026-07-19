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

  // Calculate totals
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
        <h1 style={{ fontSize: '3rem', marginTop: '4px', marginBottom: '16px' }}>
          Gourmet Meal Planner
        </h1>
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
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Total Protein</span>
              <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{totalProteinGrams}g Protein</strong>
            </div>
          </div>

          <button
            onClick={exportMealPlanToGrocery}
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ShoppingBag size={18} color="#07090e" />
            Export 1-Click Weekly Grocery List
          </button>
        </div>
      </div>

      {/* Daily Macro Budget & Tracker Dashboard */}
      {(() => {
        let dayCal = 0;
        let dayProtein = 0;
        let dayCarbs = 0;
        let dayFat = 0;
        
        const dayMeals = mealPlan[activeDay] || {};
        Object.values(dayMeals).forEach((recipe: any) => {
          if (recipe) {
            dayCal += recipe.calories || 0;
            if (recipe.protein) {
              const p = parseInt(recipe.protein.replace('g', ''), 10);
              if (!isNaN(p)) dayProtein += p;
            }
            if (recipe.carbs) {
              const c = parseInt(recipe.carbs.replace('g', ''), 10);
              if (!isNaN(c)) dayCarbs += c;
            }
            if (recipe.fat) {
              const f = parseInt(recipe.fat.replace('g', ''), 10);
              if (!isNaN(f)) dayFat += f;
            }
          }
        });

        const getChefNutritionalAdvice = () => {
          if (dayCal === 0) {
            return {
              message: `No meals scheduled for ${days.find(d => d.id === activeDay)?.name} yet.`,
              tips: "Assign recipes to breakfast, lunch, or dinner slots below to calculate macro ratios.",
              variant: 'info'
            };
          }
          if (dayProtein < macroTargets.protein * 0.7) {
            return {
              message: "⚠️ Daily Protein intake is low!",
              tips: "We recommend adding high-protein options like 'Wagyu Ribeye Steak' or 'Chef Melissa's Salmon' to reach your goal.",
              variant: 'warning'
            };
          }
          if (dayCal > macroTargets.calories) {
            return {
              message: "🚨 Daily Calorie budget exceeded!",
              tips: "Replace one of today's heavier courses with a lighter dish like 'Artisanal Burrata Salad' or a seasonal vegetable side.",
              variant: 'danger'
            };
          }
          return {
            message: "🌟 Perfect Macro Balance!",
            tips: "Your planned meals align beautifully with your daily nutritional limits. Excellent work!",
            variant: 'success'
          };
        };

        const advice = getChefNutritionalAdvice();

        return (
          <div className="glass-panel" style={{ borderRadius: '24px', padding: '24px', marginBottom: '40px', background: 'rgba(15, 22, 36, 0.4)' }}>
            {/* Header/Day Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'Playfair Display, serif' }}>🎯 Daily Macro Budget & Tracker</h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Select a day to track and balance your macronutrient values.</p>
              </div>
              
              {/* Day Tab Buttons */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
                {days.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDay(d.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: activeDay === d.id ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                      background: activeDay === d.id ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)',
                      color: activeDay === d.id ? '#07090e' : 'var(--text-primary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {d.name.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Split */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              {/* Left Column: Set Budget Targets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Set Nutrition Goals</h4>
                
                {[
                  { key: 'calories', label: 'Energy Budget', unit: 'Kcal', color: 'var(--primary)', step: 100 },
                  { key: 'protein', label: 'Protein Target', unit: 'g', color: '#10b981', step: 10 },
                  { key: 'carbs', label: 'Carbs Budget', unit: 'g', color: '#3b82f6', step: 10 },
                  { key: 'fat', label: 'Fats Budget', unit: 'g', color: '#eab308', step: 5 }
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '10px 16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block' }}>{item.label}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Per day</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => updateTarget(item.key, Math.max(0, (macroTargets as any)[item.key] - item.step))}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--border-glass)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >-</button>
                      <strong style={{ fontSize: '0.9rem', color: item.color, minWidth: '70px', textAlign: 'center' }}>
                        {(macroTargets as any)[item.key]} {item.unit}
                      </strong>
                      <button
                        onClick={() => updateTarget(item.key, (macroTargets as any)[item.key] + item.step)}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--border-glass)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Middle Column: Daily Progress Gauges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Macros Met</h4>
                
                {[
                  { label: 'Calories', actual: dayCal, target: macroTargets.calories, color: 'var(--primary-gradient)', unit: 'Kcal' },
                  { label: 'Protein', actual: dayProtein, target: macroTargets.protein, color: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', unit: 'g' },
                  { label: 'Carbohydrates', actual: dayCarbs, target: macroTargets.carbs, color: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)', unit: 'g' },
                  { label: 'Fats', actual: dayFat, target: macroTargets.fat, color: 'linear-gradient(90deg, #eab308 0%, #ca8a04 100%)', unit: 'g' }
                ].map(macro => {
                  const pct = Math.min(100, Math.round((macro.actual / macro.target) * 100)) || 0;
                  const isOverBudget = macro.actual > macro.target;
                  return (
                    <div key={macro.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600 }}>{macro.label}</span>
                        <span style={{ color: isOverBudget && macro.label === 'Calories' ? '#ef4444' : 'var(--text-secondary)' }}>
                          <strong>{macro.actual}</strong> / {macro.target} {macro.unit} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: isOverBudget && macro.label === 'Calories' ? 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)' : macro.color,
                          borderRadius: '4px',
                          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: AI Chef Advisor */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chef Nutritionist Advice</h4>
                
                <div style={{
                  flex: 1,
                  borderRadius: '16px',
                  padding: '20px',
                  background: advice.variant === 'warning' ? 'rgba(234, 179, 8, 0.04)' : advice.variant === 'danger' ? 'rgba(239, 68, 68, 0.04)' : advice.variant === 'success' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${advice.variant === 'warning' ? 'rgba(234, 179, 8, 0.15)' : advice.variant === 'danger' ? 'rgba(239, 68, 68, 0.15)' : advice.variant === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'var(--border-glass)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: advice.variant === 'warning' ? '#eab308' : advice.variant === 'danger' ? '#f87171' : advice.variant === 'success' ? '#34d399' : 'var(--primary)' }}>
                    {advice.message}
                  </div>
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                    {advice.tips}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 7-Day Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {days.map(day => (
          <div key={day.id} className="glass-panel" style={{ borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Playfair Display, serif', color: 'var(--primary)' }}>{day.name}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>7-Day Schedule</span>
            </div>

            {/* Slots */}
            {slots.map(slot => {
              const recipe = mealPlan[day.id]?.[slot.id];
              return (
                <div key={slot.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{slot.icon}</span> {slot.name}
                    </span>
                    {recipe && (
                      <button
                        onClick={() => removeFromMealPlan(day.id, slot.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                        title="Remove meal"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {recipe ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img src={recipe.image} alt={recipe.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h4
                          onClick={() => { setActiveRecipeId(recipe.id); setCurrentView('recipes'); }}
                          style={{ fontSize: '0.85rem', margin: '0 0 2px 0', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                        >
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
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '1px dashed var(--border-glass)',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
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
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            maxWidth: '550px',
            borderRadius: '24px',
            padding: '24px',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedSlot(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
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
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
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
