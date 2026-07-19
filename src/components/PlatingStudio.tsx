import React, { useState, useRef, useCallback } from 'react';
import { X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface PlatingElement {
  id: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

const PALETTE: { emoji: string; label: string; category: string }[] = [
  // Proteins
  { emoji: '🥩', label: 'Steak', category: 'Protein' },
  { emoji: '🍗', label: 'Chicken', category: 'Protein' },
  { emoji: '🐟', label: 'Fish', category: 'Protein' },
  { emoji: '🍤', label: 'Shrimp', category: 'Protein' },
  { emoji: '🥚', label: 'Egg', category: 'Protein' },
  // Sauces
  { emoji: '🫙', label: 'Coulis', category: 'Sauce' },
  { emoji: '🍮', label: 'Purée', category: 'Sauce' },
  { emoji: '🫕', label: 'Sauce', category: 'Sauce' },
  // Garnishes
  { emoji: '🌿', label: 'Herb', category: 'Garnish' },
  { emoji: '🌸', label: 'Flower', category: 'Garnish' },
  { emoji: '🫛', label: 'Pea', category: 'Garnish' },
  { emoji: '🌶️', label: 'Chili', category: 'Garnish' },
  { emoji: '🧄', label: 'Garlic', category: 'Garnish' },
  { emoji: '🫒', label: 'Olive', category: 'Garnish' },
  // Sides
  { emoji: '🥕', label: 'Carrot', category: 'Side' },
  { emoji: '🥦', label: 'Broccoli', category: 'Side' },
  { emoji: '🥑', label: 'Avocado', category: 'Side' },
  { emoji: '🧅', label: 'Onion', category: 'Side' },
  { emoji: '🍄', label: 'Mushroom', category: 'Side' },
  { emoji: '🫘', label: 'Beans', category: 'Side' },
  // Starches
  { emoji: '🍚', label: 'Rice', category: 'Starch' },
  { emoji: '🥔', label: 'Potato', category: 'Starch' },
  { emoji: '🍝', label: 'Pasta', category: 'Starch' },
  { emoji: '🥖', label: 'Bread', category: 'Starch' },
  // Sweets
  { emoji: '🍰', label: 'Cake', category: 'Sweet' },
  { emoji: '🍫', label: 'Chocolate', category: 'Sweet' },
  { emoji: '🍓', label: 'Strawberry', category: 'Sweet' },
  { emoji: '🫐', label: 'Blueberry', category: 'Sweet' },
];

const CATEGORIES = ['All', 'Protein', 'Sauce', 'Garnish', 'Side', 'Starch', 'Sweet'];

const PlatingStudio: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [elements, setElements] = useState<PlatingElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; offX: number; offY: number } | null>(null);
  const topZ = useRef(10);

  const addElement = (item: typeof PALETTE[0]) => {
    const id = Date.now().toString();
    topZ.current += 1;
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? (rect.width / 2 / zoom) + (Math.random() - 0.5) * 80 : 240;
    const cy = rect ? (rect.height / 2 / zoom) + (Math.random() - 0.5) * 80 : 240;
    setElements(prev => [...prev, {
      id, emoji: item.emoji, label: item.label,
      x: cx, y: cy, rotation: 0, scale: 1, zIndex: topZ.current
    }]);
    setSelectedId(id);
  };

  const startDrag = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    const el = elements.find(el => el.id === id);
    if (!el) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const canvasX = (e.clientX - rect.left) / zoom;
    const canvasY = (e.clientY - rect.top) / zoom;
    dragging.current = { id, offX: canvasX - el.x, offY: canvasY - el.y };
    topZ.current += 1;
    setElements(prev => prev.map(el => el.id === id ? { ...el, zIndex: topZ.current } : el));
    setSelectedId(id);
  }, [elements, zoom]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / zoom - dragging.current.offX;
    const y = (e.clientY - rect.top) / zoom - dragging.current.offY;
    setElements(prev => prev.map(el => el.id === dragging.current!.id ? { ...el, x, y } : el));
  }, [zoom]);

  const onMouseUp = () => { dragging.current = null; };

  const rotateSelected = (deg: number) => {
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, rotation: el.rotation + deg } : el));
  };

  const scaleSelected = (delta: number) => {
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, scale: Math.max(0.3, Math.min(3, el.scale + delta)) } : el));
  };

  const deleteSelected = () => {
    setElements(prev => prev.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  const filtered = activeCategory === 'All' ? PALETTE : PALETTE.filter(p => p.category === activeCategory);
  const selected = elements.find(el => el.id === selectedId);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,8,18,0.98)', backdropFilter: 'blur(20px)', zIndex: 99998, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(197,168,128,0.12)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#9f67f7)', borderRadius: '10px', padding: '6px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>🎨 Plating Studio</div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Drag & drop to design your gourmet plate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><ZoomIn size={16} /></button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '36px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><ZoomOut size={16} /></button>
          <button onClick={() => { setElements([]); setSelectedId(null); }} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px 12px', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}><RotateCcw size={14} /> Clear</button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}><X size={22} /></button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Palette */}
        <div style={{ width: '220px', borderRight: '1px solid rgba(197,168,128,0.1)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          {/* Category Tabs */}
          <div style={{ padding: '12px 12px 0', display: 'flex', flexWrap: 'wrap', gap: '4px', flexShrink: 0 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', background: activeCategory === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.04)', border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.07)', color: activeCategory === cat ? '#07090e' : '#64748b', transition: 'all 0.2s' }}>{cat}</button>
            ))}
          </div>
          {/* Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignContent: 'flex-start' }}>
            {filtered.map((item, i) => (
              <button key={i} onClick={() => addElement(item)} title={'Add ' + item.label} style={{ width: '48px', height: '52px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', transition: 'all 0.18s', fontSize: '1.4rem' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(197,168,128,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                <span>{item.emoji}</span>
                <span style={{ fontSize: '0.48rem', color: '#64748b', lineHeight: 1 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Canvas */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 50%, rgba(197,168,128,0.03) 0%, transparent 70%)' }}>
          <div
            ref={canvasRef}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onClick={() => setSelectedId(null)}
            style={{ position: 'relative', width: '560px', height: '560px', transform: `scale(${zoom})`, transformOrigin: 'center', cursor: 'default', flexShrink: 0 }}
          >
            {/* Plate */}
            <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', background: 'radial-gradient(ellipse at 35% 30%, #f8f6f0, #e8e4dc 40%, #d0ccc4)', boxShadow: '0 8px 64px rgba(0,0,0,0.6), inset 0 2px 12px rgba(255,255,255,0.3), 0 0 0 12px rgba(197,168,128,0.1), 0 0 0 14px rgba(197,168,128,0.06)' }} />
            {/* Plate rim detail */}
            <div style={{ position: 'absolute', inset: '16px', borderRadius: '50%', border: '2px solid rgba(197,168,128,0.4)', pointerEvents: 'none' }} />
            {/* Grid dots */}
            <div style={{ position: 'absolute', inset: '30px', borderRadius: '50%', backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

            {/* Elements */}
            {elements.map(el => (
              <div
                key={el.id}
                onMouseDown={e => startDrag(e, el.id)}
                style={{ position: 'absolute', left: el.x, top: el.y, transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.scale})`, fontSize: '2.4rem', cursor: 'grab', userSelect: 'none', zIndex: el.zIndex, filter: selectedId === el.id ? 'drop-shadow(0 0 12px rgba(197,168,128,0.8))' : 'none', transition: 'filter 0.15s', lineHeight: 1 }}
                title={el.label}
              >
                {el.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Controls */}
        <div style={{ width: '200px', borderLeft: '1px solid rgba(197,168,128,0.1)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Selected</div>
            {selected ? (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{selected.emoji}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{selected.label}</div>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Click an element on the plate to select it</div>
            )}
          </div>

          {selected && (
            <>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Rotate</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => rotateSelected(-15)} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem' }}>◀ -15°</button>
                  <button onClick={() => rotateSelected(15)} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem' }}>+15° ▶</button>
                </div>
                <input type='range' min={-180} max={180} value={selected.rotation % 360} onChange={e => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, rotation: parseInt(e.target.value) } : el))} style={{ width: '100%', marginTop: '8px', accentColor: 'var(--primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Size — {Math.round(selected.scale * 100)}%</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => scaleSelected(-0.1)} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>−</button>
                  <button onClick={() => scaleSelected(0.1)} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>+</button>
                </div>
                <input type='range' min={30} max={300} value={Math.round(selected.scale * 100)} onChange={e => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, scale: parseInt(e.target.value) / 100 } : el))} style={{ width: '100%', marginTop: '8px', accentColor: 'var(--primary)' }} />
              </div>
              <button onClick={deleteSelected} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>🗑 Remove</button>
            </>
          )}

          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>On Plate</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{elements.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#475569' }}>elements placed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatingStudio;