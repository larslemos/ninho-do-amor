"use client"

import { Music } from "lucide-react"

export default function AudioControlSimple() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-rose-200 p-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
          <Music className="w-4 h-4 text-rose-600" />
        </div>
        <span className="text-xs text-rose-600 pr-2">Música em breve</span>
      </div>
    </div>
  )
}
