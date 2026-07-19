import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, ChevronRight, ChevronLeft, Volume2, VolumeX, Timer, X } from 'lucide-react';

interface VoiceCookModeProps {
  recipe: { title: string; steps: string[] };
  onClose: () => void;
}

const VoiceCookMode: React.FC<VoiceCookModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceEnabledRef = useRef(true);
  const currentStepRef = useRef(0);
  const steps = recipe.steps;
  const totalSteps = steps.length;

  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);

  const speak = useCallback((text: string) => {
    if (!voiceEnabledRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.88;
    setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const startTimer = useCallback((minutes: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerSeconds(minutes * 60);
    setTimerRunning(true);
    setLastCommand('Timer: ' + minutes + ' min');
    speak('Timer started for ' + minutes + ' minutes.');
  }, [speak]);

  useEffect(() => {
    if (!timerRunning || timerSeconds === null) return;
    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev === null || prev <= 1) {
          setTimerRunning(false);
          speak('Timer complete! Check your dish!');
          if (timerRef.current) clearInterval(timerRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  const goNext = useCallback((c: number) => {
    const n = Math.min(c + 1, totalSteps - 1);
    if (n !== c) { speak('Step ' + (n + 1) + ' of ' + totalSteps + '. ' + steps[n]); setCurrentStep(n); setLastCommand('Next Step'); }
    else { speak('Recipe complete! Bon Appetit!'); setLastCommand('Done!'); }
  }, [totalSteps, steps, speak]);

  const goBack = useCallback((c: number) => {
    const b = Math.max(c - 1, 0);
    if (b !== c) { speak('Step ' + (b + 1) + '. ' + steps[b]); setCurrentStep(b); setLastCommand('Back'); }
  }, [steps, speak]);

  const repeatStep = useCallback((c: number) => {
    speak('Step ' + (c + 1) + '. ' + steps[c]);
    setLastCommand('Repeat');
  }, [steps, speak]);

  const processCommand = useCallback((text: string) => {
    const cmd = text.toLowerCase().trim();
    const c = currentStepRef.current;
    if (cmd.includes('next') || cmd.includes('aage')) goNext(c);
    else if (cmd.includes('back') || cmd.includes('previous')) goBack(c);
    else if (cmd.includes('repeat') || cmd.includes('again')) repeatStep(c);
    else if (cmd.includes('timer')) { const m = cmd.match(/(\d+)/); startTimer(m ? parseInt(m[1]) : 5); }
    else if (cmd.includes('pause') || cmd.includes('stop')) { window.speechSynthesis?.cancel(); setIsSpeaking(false); setLastCommand('Paused'); }
    else setLastCommand('Not recognized');
  }, [goNext, goBack, repeatStep, startTimer]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true; rec.interimResults = false; rec.lang = 'en-IN';
    rec.onresult = (event: any) => { const r = event.results[event.results.length - 1]; if (r.isFinal) processCommand(r[0].transcript); };
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
  }, [processCommand]);

  const toggleListening = () => {
    const rec = recognitionRef.current;
    if (!rec) { alert('Voice recognition not supported. Try Chrome or Edge.'); return; }
    if (isListening) { rec.stop(); setIsListening(false); }
    else { try { rec.start(); setIsListening(true); speak('Voice on. Say Next, Back, Repeat, or Timer.'); } catch { setIsListening(false); } }
  };

  useEffect(() => {
    const tid = setTimeout(() => speak('Cook mode. Step 1 of ' + totalSteps + '. ' + steps[0]), 600);
    return () => {
      clearTimeout(tid);
      window.speechSynthesis?.cancel();
      try { recognitionRef.current?.stop(); } catch {}
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fmt = (s: number) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const pct = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,8,18,0.97)', backdropFilter: 'blur(20px)', zIndex: 99999, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderBottom: '1px solid rgba(197,168,128,0.12)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ background: 'var(--primary-gradient)', borderRadius: '10px', padding: '6px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#07090e', textTransform: 'uppercase' }}>Cook Mode</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recipe.title}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setVoiceEnabled(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: voiceEnabled ? 'var(--primary)' : '#64748b', display: 'flex' }}>
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}><X size={22} /></button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}><span>Step {currentStep + 1}/{totalSteps}</span><span>{Math.round(pct)}%</span></div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
              <div style={{ width: pct + '%', height: '100%', background: 'var(--primary-gradient)', borderRadius: '2px', transition: 'width 0.4s' }} />
            </div>
          </div>
          <div style={{ background: 'rgba(15,22,36,0.65)', border: '1px solid rgba(197,168,128,0.18)', borderRadius: '28px', padding: '40px 48px', position: 'relative', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {isSpeaking && <div style={{ position: 'absolute', top: '20px', right: '24px', display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
              {[5,9,6,12,7,10,5].map((h,i) => <div key={i} style={{ width: '3px', height: h+'px', background: 'var(--primary)', borderRadius: '2px', animation: 'sw '+(0.5+i*0.08)+'s ease-in-out infinite alternate' }} />)}
            </div>}
            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '14px' }}>Step {currentStep + 1}</div>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.75, color: 'var(--text-primary)', margin: 0, fontFamily: 'Playfair Display, serif' }}>{steps[currentStep]}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => goBack(currentStep)} disabled={currentStep === 0} style={{ padding: '13px 26px', borderRadius: '14px', background: currentStep===0?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: currentStep===0?'#374151':'var(--text-primary)', cursor: currentStep===0?'not-allowed':'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={() => repeatStep(currentStep)} style={{ padding: '13px 26px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Repeat</button>
            <button onClick={() => startTimer(5)} style={{ padding: '13px 26px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Timer size={15} /> 5 min</button>
            <button onClick={() => startTimer(10)} style={{ padding: '13px 26px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Timer size={15} /> 10 min</button>
            <button onClick={() => goNext(currentStep)} style={{ padding: '13px 34px', borderRadius: '14px', background: currentStep===totalSteps-1?'linear-gradient(135deg,#059669,#10b981)':'var(--primary-gradient)', border: 'none', color: '#07090e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              {currentStep===totalSteps-1?'Finish':'Next'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(197,168,128,0.1)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'rgba(7,9,14,0.6)', gap: '16px', flexWrap: 'wrap' }}>
        {timerSeconds !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: timerSeconds<30?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.08)', border: '1px solid '+(timerSeconds<30?'rgba(239,68,68,0.3)':'rgba(16,185,129,0.2)'), borderRadius: '12px', padding: '8px 16px' }}>
            <Timer size={15} color={timerSeconds<30?'#f87171':'#34d399'} />
            <span style={{ fontWeight: 700, fontFamily: 'monospace', color: timerSeconds<30?'#f87171':'#34d399' }}>{fmt(timerSeconds)}</span>
            <button onClick={() => { setTimerSeconds(null); setTimerRunning(false); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>x</button>
          </div>
        ) : <div />}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: '#475569' }}>Say:</span>
          {['Next','Back','Repeat','Timer 5'].map(c => <span key={c} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b', fontStyle: 'italic' }}>'{c}'</span>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastCommand && <span style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>{lastCommand}</span>}
          <button onClick={toggleListening} style={{ width: '50px', height: '50px', borderRadius: '50%', background: isListening?'var(--primary-gradient)':'rgba(255,255,255,0.05)', border: isListening?'none':'1px solid var(--border-glass)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isListening?'0 0 0 8px rgba(197,168,128,0.1),0 0 28px rgba(197,168,128,0.25)':'none', transition: 'all 0.3s' }}>
            {isListening ? <Mic size={20} color="#07090e" /> : <MicOff size={20} color="#64748b" />}
          </button>
        </div>
      </div>
      <style>{'@keyframes sw{from{transform:scaleY(0.4)}to{transform:scaleY(1.5)}}'}</style>
    </div>
  );
};

export default VoiceCookMode;