import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Users, Play, X, Radio, Ticket } from 'lucide-react';

interface ILiveWorkshop {
  id: string;
  title: string;
  chef: string;
  chefAvatar: string;
  dateStr: string;
  targetTimestamp: number;
  totalSeats: number;
  reservedSeats: number;
  image: string;
  topic: string;
}

const Academy: React.FC = () => {
  const { classes, showToast } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<string[]>([]);
  const [reservedWorkshops, setReservedWorkshops] = useState<string[]>([]);
  const [nowTime, setNowTime] = useState(Date.now());

  // Ticker for live countdown
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : '';
  };

  const handleEnroll = (classId: string) => {
    if (enrolledClasses.includes(classId)) return;
    setEnrolledClasses(prev => [...prev, classId]);
    showToast('Enrolled in Masterclass successfully!', 'success');
    const cls = classes.find(c => c.id === classId);
    if (cls) cls.studentsCount += 1;
  };

  const liveWorkshops: ILiveWorkshop[] = [
    {
      id: 'live-molecular',
      title: 'Live Stream: Molecular Gastronomy & Spheric Foams',
      chef: 'Chef Antoine Laurent',
      chefAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      dateStr: 'This Saturday @ 8:00 PM EST',
      targetTimestamp: Date.now() + (2 * 24 * 3600 * 1000 + 14 * 3600 * 1000),
      totalSeats: 25,
      reservedSeats: 19,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      topic: 'Direct Reverse Spherification & Liquid Nitrogen Drops'
    },
    {
      id: 'live-wagyu',
      title: 'Live Masterclass: Wagyu Searing & Truffle Basting',
      chef: 'Chef Jean-Luc',
      chefAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150',
      dateStr: 'Next Tuesday @ 7:00 PM EST',
      targetTimestamp: Date.now() + (5 * 24 * 3600 * 1000 + 8 * 3600 * 1000),
      totalSeats: 30,
      reservedSeats: 24,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      topic: 'Cast-Iron Thermal Control & French Butter Emulsions'
    }
  ];

  const handleReserveSeat = (w: ILiveWorkshop) => {
    if (reservedWorkshops.includes(w.id)) return;
    setReservedWorkshops(prev => [...prev, w.id]);
    w.reservedSeats += 1;
    showToast(`🎟️ Reserved VIP Seat for "${w.title}"! Calendar invite sent.`, 'success');
  };

  const formatCountdown = (targetTs: number) => {
    const diff = Math.max(0, targetTs - nowTime);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    return `${days.toString().padStart(2, '0')}d : ${hours.toString().padStart(2, '0')}h : ${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
  };

  const isEnrolled = (classId: string) => enrolledClasses.includes(classId);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Title */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Luxe Culinary Education
        </span>
        <h1 style={{ fontSize: '3rem', marginTop: '8px', marginBottom: '16px' }}>
          The Learning Academy
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.5 }}>
          Master culinary sciences and professional French plating with recorded masterclasses and live stream interactive workshops with Michelin-decorated chefs.
        </p>
      </div>

      {/* 🔴 LIVE INTERACTIVE WORKSHOPS SECTION */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 12px #ef4444' }} />
          <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'Playfair Display, serif' }}>Live Interactive Workshops & Reservations</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
          {liveWorkshops.map(w => {
            const isReserved = reservedWorkshops.includes(w.id);
            return (
              <div key={w.id} className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--primary-glow)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Radio size={12} className="animate-pulse" /> LIVE STREAM
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.dateStr}</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', lineHeight: 1.3 }}>{w.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{w.topic}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <img src={w.chefAvatar} alt={w.chef} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>{w.chef}</span>
                  </div>

                  {/* Countdown Box */}
                  <div className="glass-panel" style={{ padding: '12px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px', background: 'rgba(7, 9, 14, 0.8)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Starts In</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      {formatCountdown(w.targetTimestamp)}
                    </span>
                  </div>
                </div>

                {/* Footer RSVP */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="var(--primary)" /> {w.reservedSeats} / {w.totalSeats} Seats Booked
                  </span>

                  <button
                    onClick={() => handleReserveSeat(w)}
                    disabled={isReserved}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Ticket size={14} color="#07090e" />
                    {isReserved ? 'Seat Confirmed ✓' : 'Reserve Free VIP Seat'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🎓 RECORDED MASTERCLASSES GRID */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', fontFamily: 'Playfair Display, serif' }}>Recorded Technique Workshops</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px'
      }}>
        {classes.map((cls) => (
          <div 
            key={cls.id}
            className="glass-panel glass-panel-hover"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '460px'
            }}
          >
            {/* Class Image Container */}
            <div style={{ height: '220px', position: 'relative' }}>
              <img src={cls.image} alt={cls.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(7,9,14,0.9) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px'
              }}>
                <button 
                  onClick={() => setSelectedClassId(cls.id)}
                  className="btn btn-primary"
                  style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}
                >
                  <Play size={18} fill="#07090e" color="#07090e" />
                </button>
              </div>
            </div>

            {/* Class Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {cls.level}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    <Clock size={12} color="var(--primary)" />
                    {cls.duration}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.3rem', lineHeight: 1.3, marginBottom: '8px' }}>{cls.title}</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  {cls.description}
                </p>
              </div>

              {/* Class Footer */}
              <div style={{
                borderTop: '1px solid var(--border-glass)',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={cls.instructorAvatar} alt={cls.instructor} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cls.instructor}</span>
                </div>

                <button
                  onClick={() => handleEnroll(cls.id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 14px', borderRadius: '8px' }}
                >
                  {isEnrolled(cls.id) ? 'Enrolled ✓' : 'Enroll Free'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedClass && (
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
            maxWidth: '800px',
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedClassId(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(7,9,14,0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} />
            </button>

            <div style={{ height: '420px', width: '100%' }}>
              <iframe
                width="100%"
                height="100%"
                src={getYoutubeEmbedUrl(selectedClass.videoUrl)}
                title={selectedClass.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', margin: '0 0 8px 0' }}>{selectedClass.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{selectedClass.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academy;
