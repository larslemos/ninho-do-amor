'use client';

import { Music } from 'lucide-react';

export default function AudioControlSimple() {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-full border border-rose-200 bg-white/90 p-2 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
          <Music className="h-4 w-4 text-rose-600" />
        </div>
        <span className="pr-2 text-xs text-rose-600">Música em breve</span>
      </div>
    </div>
  );
}
