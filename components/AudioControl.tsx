// app/components/AudioControl.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AudioControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start with sound enabled
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(true);
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
    audioRef.current.preload = 'auto';

    const audio = audioRef.current;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = async () => {
      setIsLoading(false);
      setHasError(false);

      // Attempt to play automatically when audio is ready
      try {
        // Set a small timeout to ensure audio is fully ready
        setTimeout(async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            // toast({
            //   title: 'Música Iniciada',
            //   description: 'A música está tocando. Aproveite!',
            //   variant: 'success',
            // });
          } catch (playError) {
            console.log('Autoplay blocked, waiting for user interaction');
            // Autoplay was blocked, we'll wait for user interaction
          }
        }, 500);
      } catch (error) {
        console.error('Audio play error:', error);
      }
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

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);

    // Attempt to play immediately if audio is already loaded
    if (audio.readyState >= 3) {
      // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
      handleCanPlay();
    }

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);

      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && !hasError) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, hasError]);

  const togglePlay = async () => {
    if (!audioRef.current || hasError) {
      toast({
        title: 'Erro',
        description: 'Não foi possível reproduzir a música devido a um erro no arquivo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast({
          title: 'Música Pausada',
          description: 'A música foi pausada.',
          variant: 'default',
        });
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        // toast({
        //   title: 'Música Iniciada',
        //   description: 'A música está tocando. Aproveite!',
        //   variant: 'success',
        // });
      }
    } catch (error) {
      console.error('Playback failed:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível reproduzir a música. Tente clicar novamente.',
        variant: 'destructive',
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current || hasError) {
      toast({
        title: 'Erro',
        description: 'Não foi possível ajustar o som devido a um erro no arquivo.',
        variant: 'destructive',
      });
      return;
    }

    setIsMuted((prev) => {
      const newMutedState = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMutedState;
      }
      if (!newMutedState && volume > 0) {
        toast({
          title: 'Som Ativado',
          description: 'A música agora está com som. Aproveite!',
          variant: 'success',
        });
      } else if (newMutedState) {
        toast({
          title: 'Som Desativado',
          description: 'A música está sem som.',
          variant: 'default',
        });
      }
      return newMutedState;
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);

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
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.muted = true;
      }
    }
  };

  // Add a global click handler to resume audio if it was blocked
  useEffect(() => {
    const handleGlobalClick = async () => {
      if (audioRef.current && !isPlaying && !hasError) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Audio resume on click failed:', error);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [isPlaying, hasError]);

  if (hasError) {
    return (
      <div className="place-card-enhanced fixed bottom-4 right-4 z-50 rounded-lg bg-white/90 p-3 shadow-inner backdrop-blur-sm duration-300 animate-in slide-in-from-right">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Music className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div className="place-card-enhanced fixed bottom-4 right-4 z-50 rounded-lg bg-white/90 p-3 shadow-inner backdrop-blur-sm duration-300 animate-in slide-in-from-right">
      <div className="flex items-center gap-2">
        <audio ref={audioRef} loop />

        <button
          onClick={togglePlay}
          disabled={isLoading || hasError}
          className={`rsvp-button rsvp-confirm flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
            isPlaying
              ? 'bg-sky-600 text-white shadow-lg'
              : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
          } ${
            isLoading || hasError ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
          } ${isPlaying ? 'animate-pulse' : ''}`}
          aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {!isLoading && (
          <div className="flex items-center gap-2 duration-300 animate-in slide-in-from-right">
            <button
              onClick={toggleMute}
              className="rsvp-button flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors hover:scale-105 hover:bg-sky-200"
              aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="slider h-1 w-16 cursor-pointer appearance-none rounded-lg bg-sky-200"
              aria-label="Ajustar volume da música"
              style={{
                background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(14 165 233) ${
                  volume * 100
                }%, rgb(186 230 253) ${volume * 100}%, rgb(186 230 253) 100%)`,
              }}
            />
          </div>
        )}

        <Heart className="h-5 w-5 text-sky-500" aria-hidden="true" />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgb(14 165 233);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgb(14 165 233);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
