import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Star, ExternalLink, Compass, Plus, Minus, Trash2, ShoppingCart, CheckCircle, X } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { marketplaceTools, recipes, setCurrentView, setActiveRecipeId, addToCart, cartItems, removeFromCart, updateCartQuantity, clearCart, showToast } = useApp();
  const [filterCategory, setFilterCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Form State
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Categories mapping based on tool IDs for easy filtering
  const getCategory = (toolId: string) => {
    if (toolId.includes('skillet')) return 'Cookware';
    if (toolId.includes('plate')) return 'Tableware';
    return 'Precision Tools'; // blowtorch, tweezers, sous-vide
  };

  const filteredTools = marketplaceTools.filter(tool => {
    if (filterCategory === 'All') return true;
    return getCategory(tool.id) === filterCategory;
  });

  // Find recipes that use a given tool
  const getLinkedRecipes = (toolName: string) => {
    return recipes.filter(recipe => 
      recipe.tools.some(t => t.toLowerCase().includes(toolName.toLowerCase()) || toolName.toLowerCase().includes(t.toLowerCase()))
    );
  };

  const handleRecipeClick = (recipeId: string) => {
    setActiveRecipeId(recipeId);
    setCurrentView('recipes');
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.tool.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName.trim() || !shippingAddress.trim()) {
      showToast('Please enter your shipping details.', 'warning');
      return;
    }

    setIsOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setIsCheckoutModalOpen(false);
      setIsOrderPlaced(false);
      setIsCartOpen(false);
      showToast('🎉 Order Placed Successfully! Tracking details emailed.', 'success');
      setShippingName('');
      setShippingAddress('');
    }, 2000);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px', position: 'relative' }}>
      {/* Top Banner & Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Culinary Equipment & Tools
          </span>
        </div>

        <h1 style={{ fontSize: '3rem', marginTop: '4px', marginBottom: '16px' }}>
          Kitchen Hub Boutique
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.5 }}>
          Equip your kitchen with professional-grade cutlery, copper cookware, and modernist plating devices recommended by our Master Chefs.
        </p>

        {/* View Cart Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary"
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <ShoppingCart size={18} color="#07090e" />
            View Shopping Cart ({cartItemCount})
            {cartTotal > 0 && <span style={{ background: '#07090e', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>${cartTotal.toFixed(2)}</span>}
          </button>
        </div>
      </div>

      {/* Categories Selector */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}>
        {['All', 'Cookware', 'Tableware', 'Precision Tools'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className="btn"
            style={{
              background: filterCategory === cat ? 'var(--primary-gradient)' : 'rgba(197, 168, 128, 0.05)',
              color: filterCategory === cat ? '#07090e' : 'var(--text-primary)',
              borderColor: filterCategory === cat ? 'var(--primary)' : 'var(--border-glass)',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '8px 18px',
              fontSize: '0.8rem'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Marketplace Items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px'
      }}>
        {filteredTools.map((tool) => {
          const linkedRecipes = getLinkedRecipes(tool.name);
          return (
            <div 
              key={tool.id}
              className="glass-panel glass-panel-hover"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Product Image */}
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={tool.image} 
                  alt={tool.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  className="hover-zoom-image"
                />
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="tag" style={{ background: 'var(--bg-dark)', color: 'var(--primary)', fontSize: '0.7rem' }}>
                    {getCategory(tool.id)}
                  </span>
                </div>
              </div>

              {/* Product Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div className="flex-between" style={{ marginBottom: '8px', alignItems: 'flex-start', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif', lineHeight: 1.3 }}>{tool.name}</h3>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Inter, sans-serif' }}>${tool.price}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                    <Star size={12} fill="var(--primary)" color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>{tool.rating.toFixed(1)} Rating</span>
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    margin: 0
                  }}>
                    {tool.description}
                  </p>
                </div>

                {/* Footer Actions */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                  {/* Linked Recipes */}
                  {linkedRecipes.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Compass size={11} /> Used in:
                      </span>
                      {linkedRecipes.map(recipe => (
                        <button
                          key={recipe.id}
                          onClick={() => handleRecipeClick(recipe.id)}
                          style={{
                            background: 'rgba(197, 168, 128, 0.08)',
                            border: '1px solid rgba(197, 168, 128, 0.2)',
                            color: 'var(--primary)',
                            fontSize: '0.68rem',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {recipe.title.split(' with ')[0]}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Add to Cart & Buy Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => addToCart(tool)}
                      className="btn btn-primary"
                      style={{ flex: 1, gap: '6px', fontSize: '0.8rem', borderRadius: '10px', height: '42px' }}
                    >
                      <ShoppingCart size={14} color="#07090e" />
                      Add to Cart
                    </button>
                    <a 
                      href={tool.purchaseUrl}
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
                      title="Direct Affiliate Purchase"
                    >
                      <ExternalLink size={14} color="var(--primary)" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Shopping Cart Drawer */}
      {isCartOpen && (
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
            maxWidth: '440px',
            height: '100%',
            background: 'rgba(15, 22, 36, 0.96)',
            borderLeft: '1px solid var(--border-glass)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-glass)'
          }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShoppingCart size={22} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Shopping Cart ({cartItemCount})</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Items List */}
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                  <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '1rem', margin: 0 }}>Your cart is empty.</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Add precision kitchen tools from the boutique above!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                  {cartItems.map(({ tool, quantity }) => (
                    <div key={tool.id} className="glass-panel" style={{ padding: '14px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={tool.image} alt={tool.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{tool.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 650 }}>${(tool.price * quantity).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button onClick={() => updateCartQuantity(tool.id, -1)} className="btn btn-secondary" style={{ width: '26px', height: '26px', padding: 0 }}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{quantity}</span>
                        <button onClick={() => updateCartQuantity(tool.id, 1)} className="btn btn-secondary" style={{ width: '26px', height: '26px', padding: 0 }}>
                          <Plus size={12} />
                        </button>
                        <button onClick={() => removeFromCart(tool.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: '4px', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--success)' }}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Glassmorphic Checkout Modal */}
      {isCheckoutModalOpen && (
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
            maxWidth: '500px',
            padding: '32px',
            borderRadius: '24px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {isOrderPlaced ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle size={56} color="var(--success)" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Processing Order...</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Securing your items & issuing chef dispatch order.</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'Playfair Display, serif' }}>Checkout Order</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 8px 0' }}>
                  Total to pay: <strong style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</strong> ({cartItemCount} items)
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="123 Culinary Way, Suite 400..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)' }}
                  >
                    <option value="card">💳 Credit Card (Instant Chef Authorization)</option>
                    <option value="apple">🍎 Apple Pay</option>
                    <option value="crypto">🪙 Crypto (USDT / ETH)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '12px', fontWeight: 700 }}
                >
                  Confirm & Pay ${cartTotal.toFixed(2)}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
