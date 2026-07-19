import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Brain, ChefHat, Zap, X, Sparkles, MessageCircle } from 'lucide-react';

const ChatWidget: React.FC = () => {
  const { messages, sendMessage, isLoggedIn } = useApp();
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (!open && messages.length > 0) setUnread(prev => prev + 1);
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsTyping(true);
    sendMessage(inputText.trim());
    setInputText('');
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleQuickTrigger = (prompt: string) => {
    setIsTyping(true);
    sendMessage(prompt);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const chips = [
    { label: '🍷 Wine Pairing',    prompt: 'Recommend a wine pairing for Pan-Seared Wagyu Ribeye.' },
    { label: '🇮🇳 Biryani Wine',     prompt: 'Biryani ke sath konsi wine best match hoti hai?' },
    { label: '🧀 Paneer Tikka Tip', prompt: 'Paneer tikka marination aur smoking ke liye best chef tip batao?' },
    { label: '🍽️ Plating Art',     prompt: 'Give professional French plating and garnish advice.' },
    { label: '🔪 Knife Tips',      prompt: 'Kitchen mein vegetable chopping ke liye best knife konsa hai?' },
  ];

  if (!isLoggedIn) return null;

  return (
    <>
      {/* ── FLOATING WIDGET PANEL ── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            height: '580px',
            maxHeight: 'calc(100vh - 140px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(197,168,128,0.2), 0 0 40px rgba(124,58,237,0.15)',
            animation: 'slide-up-in 0.35s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          {/* ── HEADER ── */}
          <div style={{
            position: 'relative',
            padding: '18px 20px 16px',
            background: 'linear-gradient(135deg, #0d0520 0%, #07090e 60%, #001208 100%)',
            borderBottom: '1px solid rgba(197,168,128,0.15)',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {/* Scan line */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(197,168,128,0.25), transparent)',
              animation: 'scan-line 3s linear infinite',
            }} />
            {/* Glow blobs */}
            <div style={{ position:'absolute', top:'-30px', right:'-20px', width:'120px', height:'120px', borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.18),transparent)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'-20px', left:'20%', width:'80px', height:'80px', borderRadius:'50%', background:'radial-gradient(circle,rgba(52,211,153,0.1),transparent)', pointerEvents:'none' }} />

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                {/* Animated AI avatar */}
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{
                    width:'42px', height:'42px', borderRadius:'50%',
                    background:'linear-gradient(135deg, #7c3aed 0%, #c5a880 50%, #10b981 100%)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:'0 0 20px rgba(124,58,237,0.5)',
                    animation:'glow-ring 3s ease-out infinite',
                  }}>
                    <Brain size={20} color="#fff" />
                  </div>
                  <span style={{
                    position:'absolute', bottom:'1px', right:'1px',
                    width:'11px', height:'11px', borderRadius:'50%',
                    background:'#10b981', border:'2px solid #07090e',
                  }} />
                </div>
                <div>
                  <div style={{ fontSize:'0.95rem', fontWeight:700, color:'#f8fafc', fontFamily:"'Playfair Display',serif" }}>AI Chef Advisor</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'2px' }}>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:'2px', height:'14px' }}>
                      <span className="ai-bar ai-bar-1" />
                      <span className="ai-bar ai-bar-2" />
                      <span className="ai-bar ai-bar-3" />
                      <span className="ai-bar ai-bar-4" />
                    </div>
                    <span style={{ fontSize:'0.65rem', color:'#10b981', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em' }}>Sommelier · Live</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#94a3b8', transition:'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(239,68,68,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,0.06)')}
              >
                <X size={15} />
              </button>
            </div>

            {/* Chips */}
            <div style={{ display:'flex', gap:'6px', marginTop:'12px', overflowX:'auto', paddingBottom:'2px', position:'relative', zIndex:1 }}>
              {chips.map((c, i) => (
                <button key={i} onClick={() => handleQuickTrigger(c.prompt)} style={{
                  padding:'5px 11px', borderRadius:'20px', whiteSpace:'nowrap',
                  background:'rgba(197,168,128,0.07)', border:'1px solid rgba(197,168,128,0.2)',
                  color:'#cbd5e1', fontSize:'0.7rem', cursor:'pointer', flexShrink:0,
                  transition:'all 0.2s ease',
                }}
                  onMouseEnter={e => { (e.currentTarget.style.background='rgba(197,168,128,0.18)'); (e.currentTarget.style.borderColor='rgba(197,168,128,0.45)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.background='rgba(197,168,128,0.07)'); (e.currentTarget.style.borderColor='rgba(197,168,128,0.2)'); }}
                >{c.label}</button>
              ))}
            </div>
          </div>

          {/* ── MESSAGES ── */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            background: 'linear-gradient(to bottom, #080b10, #060810)',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            {/* Empty state */}
            {messages.length === 0 && (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px 0', opacity:0.7, gap:'10px' }}>
                <div style={{ fontSize:'2.8rem' }} className="animate-float-slow">🍽️</div>
                <p style={{ color:'#64748b', fontSize:'0.82rem', textAlign:'center', lineHeight:1.6, maxWidth:'260px' }}>
                  Ask about wine pairings, ingredient swaps, cooking techniques, or plating tips.
                </p>
              </div>
            )}

            {messages.map((msg, i) => {
              const isUser = msg.senderId === 'user-current';
              return (
                <div key={i} style={{ display:'flex', flexDirection:isUser?'row-reverse':'row', alignItems:'flex-end', gap:'8px' }}>
                  {/* Avatar */}
                  <div style={{
                    width:'28px', height:'28px', borderRadius:'50%', flexShrink:0,
                    background: isUser ? 'linear-gradient(135deg,#c5a880,#e6d5c3)' : 'linear-gradient(135deg,#7c3aed,#c5a880)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow: isUser ? 'none' : '0 0 10px rgba(124,58,237,0.3)',
                  }}>
                    {isUser ? <ChefHat size={13} color="#07090e" /> : <Brain size={13} color="#fff" />}
                  </div>
                  {/* Bubble */}
                  <div style={{
                    maxWidth:'78%', padding:'11px 14px',
                    borderRadius: isUser ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                    background: isUser
                      ? 'linear-gradient(135deg,rgba(197,168,128,0.25),rgba(197,168,128,0.12))'
                      : 'rgba(255,255,255,0.05)',
                    border: isUser
                      ? '1px solid rgba(197,168,128,0.3)'
                      : '1px solid rgba(255,255,255,0.07)',
                    backdropFilter:'blur(10px)',
                  }}>
                    <div style={{ fontSize:'0.83rem', lineHeight:1.6, color: isUser ? '#f1f5f9' : '#cbd5e1' }}>{msg.content}</div>
                    <div style={{ fontSize:'0.6rem', opacity:0.45, marginTop:'4px', textAlign:isUser?'right':'left', color:'#94a3b8' }}>
                      {formatTime(msg.createdAt)}{isUser && ' ✓✓'}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:'8px' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#c5a880)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Brain size={13} color="#fff" />
                </div>
                <div style={{ padding:'11px 16px', borderRadius:'16px 16px 16px 3px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:'5px', alignItems:'center' }}>
                  <span className="typing-dot-1" style={{ color:'#c5a880', fontSize:'1rem' }}>●</span>
                  <span className="typing-dot-2" style={{ color:'#c5a880', fontSize:'1rem' }}>●</span>
                  <span className="typing-dot-3" style={{ color:'#c5a880', fontSize:'1rem' }}>●</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── INPUT ── */}
          <form onSubmit={handleSend} style={{
            padding:'12px 14px',
            background:'#060810',
            borderTop:'1px solid rgba(197,168,128,0.12)',
            display:'flex', gap:'8px', alignItems:'center', flexShrink:0,
          }}>
            <div style={{ position:'relative', flexGrow:1 }}>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask the AI chef…"
                style={{
                  width:'100%', padding:'11px 14px 11px 38px',
                  borderRadius:'14px', fontSize:'0.82rem',
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(197,168,128,0.18)',
                  color:'#f1f5f9', outline:'none',
                  transition:'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor='rgba(197,168,128,0.45)'}
                onBlur={e => e.target.style.borderColor='rgba(197,168,128,0.18)'}
              />
              <Sparkles size={14} color="rgba(197,168,128,0.45)" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
            </div>
            <button type="submit" disabled={!inputText.trim()} style={{
              width:'40px', height:'40px', borderRadius:'50%', flexShrink:0,
              background: inputText.trim() ? 'linear-gradient(135deg,#c5a880,#e6d5c3)' : 'rgba(255,255,255,0.05)',
              border:'1px solid rgba(197,168,128,0.25)',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor: inputText.trim() ? 'pointer' : 'default',
              transition:'all 0.2s ease',
              boxShadow: inputText.trim() ? '0 0 16px rgba(197,168,128,0.3)' : 'none',
            }}>
              <Send size={15} color={inputText.trim() ? '#07090e' : 'rgba(255,255,255,0.25)'} />
            </button>
          </form>

          {/* Disclaimer */}
          <div style={{ padding:'7px 14px 10px', background:'#060810', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', borderTop:'1px solid rgba(255,255,255,0.03)', flexShrink:0 }}>
            <Zap size={11} color="#475569" />
            <span style={{ fontSize:'0.62rem', color:'#475569' }}>Kitchen Hub AI · Culinary guidance only</span>
          </div>
        </div>
      )}

      {/* ── FAB BUTTON ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: open
            ? 'linear-gradient(135deg,#ef4444,#dc2626)'
            : 'linear-gradient(135deg,#7c3aed 0%,#c5a880 50%,#10b981 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: open
            ? '0 8px 32px rgba(239,68,68,0.5)'
            : '0 8px 32px rgba(124,58,237,0.5), 0 0 0 0 rgba(124,58,237,0.4)',
          transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
          animation: open ? 'none' : 'glow-ring 3s ease-out infinite',
        }}
        title="AI Chef Advisor"
      >
        {open
          ? <X size={24} color="#fff" />
          : <MessageCircle size={26} color="#fff" />
        }

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span style={{
            position:'absolute', top:'-4px', right:'-4px',
            background:'#ef4444', color:'#fff',
            fontSize:'0.6rem', fontWeight:700,
            width:'18px', height:'18px', borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'2px solid #07090e',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
