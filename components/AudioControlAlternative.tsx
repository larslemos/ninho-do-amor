"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react"

export default function AudioControlAlternative() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Using a working audio URL from a free music service
    // This is a royalty-free wedding music sample
    audioRef.current = new Audio()
    audioRef.current.src = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Placeholder - replace with actual wedding music
    audioRef.current.loop = true
    audioRef.current.volume = volume

    const audio = audioRef.current

    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
      console.warn("Audio playback not available")
    }

    const handleLoadedData = () => {
      setIsLoading(false)
      setHasError(false)
    }

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("error", handleError)
      audio.pause()
    }
  }, [volume])

  const togglePlay = async () => {
    if (!audioRef.current || hasError) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.warn("Playback failed - this is normal in some browsers:", error)
      // Don't set error state for autoplay restrictions
    }
  }

  const toggleMute = () => {
    if (!audioRef.current || hasError) return

    const newMutedState = !isMuted
    audioRef.current.muted = newMutedState
    setIsMuted(newMutedState)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current && !hasError) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-rose-200 p-2">
      <div className="flex items-center gap-2">
        {/* Music indicator when not playing */}
        {!isPlaying && !isLoading && (
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
            <Music className="w-4 h-4 text-rose-600" />
          </div>
        )}

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg"
              : "bg-rose-100 hover:bg-rose-200 text-rose-600"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
          aria-label={isPlaying ? "Pausar música" : "Tocar música"}
          title={hasError ? "Áudio não disponível" : isPlaying ? "Pausar música" : "Tocar música"}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Volume Controls - Show when playing */}
        {isPlaying && !hasError && (
          <div className="flex items-center gap-2 animate-in slide-in-from-right duration-300">
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 flex items-center justify-center transition-colors"
              aria-label={isMuted ? "Ativar som" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-rose-200 rounded-lg appearance-none cursor-pointer slider"
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
          <div className="absolute inset-0 rounded-full border-2 border-rose-300 animate-ping opacity-20"></div>
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
  )
}
