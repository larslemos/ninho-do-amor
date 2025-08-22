'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export default function AudioControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element with a working wedding music URL
    // Using a placeholder wedding music URL - you can replace this with your actual audio file
    audioRef.current = new Audio();

    // For now, we'll use a placeholder. In production, you should:
    // 1. Upload your audio file to /public/audio/wedding-music.mp3
    // 2. Or use a direct audio file URL from a CDN
    audioRef.current.src = '/audio/wedding-music.mp3'; // This should be your actual audio file
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.preload = 'metadata'; // Added preload attribute for better performance

    const audio = audioRef.current;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setHasError(true);
      console.warn(
        'Wedding music file not found at /public/audio/wedding-music.mp3'
      ); // Updated error messaging
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
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current || hasError) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Try to play, handle potential autoplay restrictions
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.warn('Playback failed:', error);
      setHasError(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current || hasError) return;

    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current && !hasError) {
      audioRef.current.volume = newVolume;
    }
  };

  // Don't render if there's an error
  if (hasError) {
    return (
      <div className="fixed right-4 top-4 z-50 rounded-full border border-rose-200 bg-white/90 p-2 shadow-lg backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Music className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 z-50 rounded-full border border-rose-200 bg-white/90 p-2 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {/* Music indicator when not playing */}
        {!isPlaying && !isLoading && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
            <Music className="h-4 w-4 text-rose-600" />
          </div>
        )}

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading || hasError}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
            isPlaying
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
              : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
          } ${isLoading || hasError ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`}
          aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {/* Volume Controls - Show when playing */}
        {isPlaying && !hasError && (
          <div className="flex items-center gap-2 duration-300 animate-in slide-in-from-right">
            <button
              onClick={toggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-colors hover:bg-rose-200"
              aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              {isMuted ? (
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
              className="slider h-1 w-16 cursor-pointer appearance-none rounded-lg bg-rose-200"
              style={{
                background: `linear-gradient(to right, rgb(225 29 72) 0%, rgb(225 29 72) ${
                  volume * 100
                }%, rgb(254 205 211) ${volume * 100}%, rgb(254 205 211) 100%)`,
              }}
            />
          </div>
        )}

        {/* Pulse animation when playing */}
        {isPlaying && !hasError && (
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-rose-300 opacity-20"></div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgb(225 29 72);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgb(225 29 72);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
