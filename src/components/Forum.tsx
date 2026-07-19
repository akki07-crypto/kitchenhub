import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThumbsUp, Send, ArrowLeft, Plus, Trophy } from 'lucide-react';

const Forum: React.FC = () => {
  const { forumPosts, createForumPost, replyToPost, upvotePost, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'discussions' | 'leaderboard'>('discussions');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Challenge Entry modal state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryDesc, setEntryDesc] = useState('');

  // New post states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Reply state
  const [replyContent, setReplyContent] = useState('');

  const selectedPost = forumPosts.find(p => p.id === selectedPostId);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    createForumPost(title, content, tags);
    setTitle('');
    setContent('');
    setTagInput('');
    setIsPosting(false);
    showToast('Discussion thread created successfully!', 'success');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedPostId) return;

    replyToPost(selectedPostId, replyContent);
    setReplyContent('');
    showToast('Reply posted!', 'success');
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim()) return;
    setIsChallengeModalOpen(false);
    setEntryTitle('');
    setEntryDesc('');
    showToast('🏆 Challenge Entry Submitted to Judges Panel!', 'success');
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  // Static list of top chef contributors
  const TOP_CHEFS = [
    { rank: 1, name: 'Chef Jean-Luc', avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150', badge: 'Michelin Master', points: 1420, contributions: 42 },
    { rank: 2, name: 'Chef Melissa Thorne', avatar: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150', badge: 'Plating Specialist', points: 1280, contributions: 36 },
    { rank: 3, name: 'Chef Antoine Laurent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', badge: 'Molecular Chemist', points: 1150, contributions: 29 },
    { rank: 4, name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', badge: 'Plating Artist', points: 940, contributions: 18 },
    { rank: 5, name: 'Elena Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', badge: 'Food Stylist', points: 820, contributions: 14 }
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px' }}>
        <button
          onClick={() => { setActiveTab('discussions'); setSelectedPostId(null); }}
          className="btn"
          style={{
            background: activeTab === 'discussions' ? 'var(--primary-gradient)' : 'rgba(197, 168, 128, 0.05)',
            color: activeTab === 'discussions' ? '#07090e' : 'var(--text-primary)',
            borderColor: activeTab === 'discussions' ? 'var(--primary)' : 'var(--border-glass)',
            padding: '10px 24px',
            borderRadius: '12px',
            fontWeight: 650,
            fontSize: '0.85rem'
          }}
        >
          💬 Culinary Discussions
        </button>
        <button
          onClick={() => { setActiveTab('leaderboard'); setSelectedPostId(null); }}
          className="btn"
          style={{
            background: activeTab === 'leaderboard' ? 'var(--primary-gradient)' : 'rgba(197, 168, 128, 0.05)',
            color: activeTab === 'leaderboard' ? '#07090e' : 'var(--text-primary)',
            borderColor: activeTab === 'leaderboard' ? 'var(--primary)' : 'var(--border-glass)',
            padding: '10px 24px',
            borderRadius: '12px',
            fontWeight: 650,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Trophy size={16} /> 🏆 Leaderboard & Challenges
        </button>
      </div>

      {/* 🏆 LEADERBOARD & CHALLENGES TAB */}
      {activeTab === 'leaderboard' && (
        <div className="animate-fade-in">
          {/* Active Challenge Banner */}
          <div className="glass-panel" style={{
            borderRadius: '24px',
            padding: '36px',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, rgba(197, 168, 128, 0.15) 0%, rgba(7, 9, 14, 0.9) 100%)',
            border: '1px solid var(--primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ background: 'var(--primary)', color: '#07090e', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  Weekly Cooking Challenge
                </span>
                <h2 style={{ fontSize: '2.4rem', marginTop: '12px', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
                  Artisanal Modernist Plating Challenge
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Create a dish featuring sauce sweeps, height, and negative space plating geometry. Upload your photo for community votes and judge evaluation!
                </p>

                <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 650 }}>🎁 Grand Prize: $150 Boutique Voucher + Golden Badge</span>
                  <span style={{ color: 'var(--text-muted)' }}>⏱️ Ends in 3 Days</span>
                </div>
              </div>

              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="btn btn-primary"
                style={{ padding: '14px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Trophy size={18} color="#07090e" />
                Submit Challenge Entry
              </button>
            </div>
          </div>

          {/* Global Leaderboard Table */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>Global Chef Leaderboard</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {TOP_CHEFS.map(chef => (
                <div
                  key={chef.rank}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: chef.rank === 1 ? 'rgba(197, 168, 128, 0.12)' : 'rgba(255,255,255,0.02)',
                    border: chef.rank === 1 ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: chef.rank === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: chef.rank === 1 ? '#07090e' : 'var(--text-secondary)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem'
                    }}>
                      #{chef.rank}
                    </div>
                    <img src={chef.avatar} alt={chef.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }} />
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem' }}>{chef.name}</h4>
                      <span className="tag" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>{chef.badge}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Contributions</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{chef.contributions} Posts</strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Reputation Points</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{chef.points} PTS</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 💬 DISCUSSIONS TAB */}
      {activeTab === 'discussions' && (
        selectedPost ? (
          // Thread Details View
          <div>
            <button 
              onClick={() => setSelectedPostId(null)}
              className="btn btn-secondary"
              style={{ marginBottom: '24px', padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} /> Back to Forums
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <img 
                      src={selectedPost.authorAvatar} 
                      alt={selectedPost.authorName} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{selectedPost.authorName}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Posted on {formatTime(selectedPost.createdAt)}</span>
                    </div>
                  </div>

                  <h2 style={{ fontSize: '1.6rem', marginBottom: '12px', lineHeight: 1.3 }}>{selectedPost.title}</h2>
                  
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                    {selectedPost.content}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {selectedPost.tags.map(tag => (
                      <span key={tag} className="tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                    <button
                      onClick={() => upvotePost(selectedPost.id)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ThumbsUp size={14} color="var(--primary)" />
                      <span>{selectedPost.upvotes} Upvotes</span>
                    </button>
                  </div>
                </div>

                {/* Replies */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: '12px 0 4px 0' }}>Replies ({selectedPost.replies.length})</h3>
                  {selectedPost.replies.map(reply => (
                    <div key={reply.id} className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <img src={reply.authorAvatar} alt={reply.authorName} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{reply.authorName}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{reply.content}</p>
                    </div>
                  ))}

                  {/* Add Reply Form */}
                  <form onSubmit={handleSendReply} className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Add a helpful chef response..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', borderRadius: '10px' }}>
                      <Send size={16} color="#07090e" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Main Forum Threads List
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '2.4rem', margin: 0, fontFamily: 'Playfair Display, serif' }}>Culinary Discussions</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>Ask questions about sauces, emulsions, knife maintenance, and plating tricks.</p>
              </div>

              <button
                onClick={() => setIsPosting(true)}
                className="btn btn-primary"
                style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={16} color="#07090e" /> Start Thread
              </button>
            </div>

            {/* Posts Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {forumPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className="glass-panel glass-panel-hover"
                  style={{ padding: '20px 24px', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <img src={post.authorAvatar} alt={post.authorName} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{post.authorName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {formatTime(post.createdAt)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', lineHeight: 1.3 }}>{post.title}</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {post.tags.map(t => (
                        <span key={t} className="tag" style={{ fontSize: '0.65rem' }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '20px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>💬 {post.replies.length}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>👍 {post.upvotes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Start Thread Modal */}
      {isPosting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,9,14,0.85)', backdropFilter: 'blur(12px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Create Discussion Thread</h3>
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" required placeholder="Topic Title..." value={title} onChange={e => setTitle(e.target.value)} className="form-input" style={{ width: '100%', padding: '12px' }} />
              <textarea required rows={4} placeholder="Describe your question or technique in detail..." value={content} onChange={e => setContent(e.target.value)} className="form-input" style={{ width: '100%', padding: '12px' }} />
              <input type="text" placeholder="Tags (comma separated e.g. Sauces, Plating)..." value={tagInput} onChange={e => setTagInput(e.target.value)} className="form-input" style={{ width: '100%', padding: '12px' }} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>Publish Thread</button>
                <button type="button" onClick={() => setIsPosting(false)} className="btn btn-secondary" style={{ padding: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Challenge Entry Modal */}
      {isChallengeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,9,14,0.85)', backdropFilter: 'blur(12px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px', fontFamily: 'Playfair Display, serif' }}>Submit Challenge Entry</h3>
            <form onSubmit={handleChallengeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input 
                type="text" 
                required 
                placeholder="Dish Title..." 
                value={entryTitle} 
                onChange={e => setEntryTitle(e.target.value)} 
                className="form-input" 
                style={{ width: '100%', padding: '12px' }} 
              />
              <textarea 
                required 
                rows={4} 
                placeholder="Describe your plating concept and ingredients used..." 
                value={entryDesc} 
                onChange={e => setEntryDesc(e.target.value)} 
                className="form-input" 
                style={{ width: '100%', padding: '12px' }} 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>Submit Entry</button>
                <button type="button" onClick={() => setIsChallengeModalOpen(false)} className="btn btn-secondary" style={{ padding: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
