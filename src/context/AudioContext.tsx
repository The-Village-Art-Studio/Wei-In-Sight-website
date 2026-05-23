'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

const AudioCtx = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);

  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || hasStartedRef.current) return;

    try {
      audio.volume = 0.3;
      await audio.play();
      hasStartedRef.current = true;
      setIsPlaying(true);
    } catch {
      // Browser blocked autoplay — will retry on next interaction
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Attempt immediate autoplay (works if browser allows it)
    attemptPlay();

    // If autoplay was blocked, listen for ANY user interaction to start playback
    const handleInteraction = () => {
      if (!hasStartedRef.current) {
        attemptPlay();
      }
    };

    // Listen on capture phase so we catch the very first interaction
    document.addEventListener('click', handleInteraction, { capture: true, once: false });
    document.addEventListener('keydown', handleInteraction, { capture: true, once: false });
    document.addEventListener('touchstart', handleInteraction, { capture: true, once: false });
    document.addEventListener('scroll', handleInteraction, { capture: true, once: false });
    document.addEventListener('mousemove', handleInteraction, { capture: true, once: false });

    return () => {
      document.removeEventListener('click', handleInteraction, { capture: true });
      document.removeEventListener('keydown', handleInteraction, { capture: true });
      document.removeEventListener('touchstart', handleInteraction, { capture: true });
      document.removeEventListener('scroll', handleInteraction, { capture: true });
      document.removeEventListener('mousemove', handleInteraction, { capture: true });
    };
  }, [attemptPlay]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
        })
        .catch(console.error);
    }
  }, [isPlaying]);

  return (
    <AudioCtx.Provider value={{ isPlaying, togglePlay }}>
      <audio 
        ref={audioRef} 
        src="/frozen-in-time.mp3" 
        loop 
        preload="auto"
      />
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
