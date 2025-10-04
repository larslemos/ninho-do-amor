// app/hooks/use-audio.tsx

'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isLoading: boolean;
  hasError: boolean;
  togglePlay: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioState | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted for autoplay with sound
  const [volume, setVolumeState] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio('/audio/Teeks_-_First_time.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.preload = 'metadata';

    const audio = audioRef.current;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
      // Attempt unmuted autoplay
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          toast({
            title: 'Música Iniciada',
            description: 'A música está tocando. Aproveite a celebração!',
            variant: 'success',
          });
        })
        .catch((error) => {
          console.warn('Unmuted autoplay failed:', error);
          // Fallback to muted autoplay
          audio.muted = true;
          setIsMuted(true);
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              toast({
                title: 'Música Iniciada (Silenciada)',
                description:
                  'A música está tocando sem som devido a restrições do navegador. Clique no ícone de volume para ativar o som.',
                variant: 'default',
              });
            })
            .catch((mutedError) => {
              console.error('Muted autoplay also failed:', mutedError);
              setIsPlaying(false);
            });
        });
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setHasError(true);
      console.warn('Audio file error:', e);
      toast({
        title: 'Erro',
        description:
          'Não foi possível carregar a música. Verifique o arquivo em /audio/Teeks_-_First_time.mp3.',
        variant: 'destructive',
      });
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setHasError(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && !hasError) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current || hasError) {
      toast({
        title: 'Erro',
        description:
          'Não foi possível reproduzir a música devido a um erro no arquivo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        toast({
          title: 'Música Iniciada',
          description: 'A música está tocando. Aproveite!',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Playback failed:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível reproduzir a música. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current || hasError) {
      toast({
        title: 'Erro',
        description:
          'Não foi possível ajustar o som devido a um erro no arquivo.',
        variant: 'destructive',
      });
      return;
    }

    setIsMuted((prev) => {
      const newMutedState = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMutedState;
      }
      if (!newMutedState) {
        toast({
          title: 'Som Ativado',
          description: 'A música agora está com som. Aproveite!',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Som Desativado',
          description: 'A música está silenciada.',
          variant: 'default',
        });
      }
      return newMutedState;
    });
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
      toast({
        title: 'Som Ativado',
        description: 'A música agora está com som. Aproveite!',
        variant: 'success',
      });
    }
  };

  const value: AudioState = {
    isPlaying,
    isMuted,
    volume,
    isLoading,
    hasError,
    togglePlay,
    toggleMute,
    setVolume,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
