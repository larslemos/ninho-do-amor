import { useState } from 'react';
import goldenHeart from '@/assets/wax-seal.png';

interface EntrancePageProps {
  onEnter: () => void;
}

const EntrancePage = ({ onEnter }: EntrancePageProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSealClick = () => {
    setIsClicked(true);
    setShowAnimation(true);

    // Remove clicked animation after it completes
    setTimeout(() => {
      setIsClicked(false);
    }, 500);

    // Hide animation effect and transition to main invite
    setTimeout(() => {
      setShowAnimation(false);
      onEnter();
    }, 1000);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 font-serif"
      style={{
        background: `
          linear-gradient(to right, transparent 49.9%, #c4b8a8 50%, #c4b8a8 50.1%, transparent 50.2%),
          #d9d0c2
        `,
      }}
    >
      {/* Wax seal container */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className={`cursor-pointer touch-manipulation transition-all duration-300 ${
            isClicked ? 'animate-pulse' : ''
          }`}
          onClick={handleSealClick}
        >
          <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40 md:h-44 md:w-44">
            <img
              src={goldenHeart}
              alt="Wax Seal"
              className="h-auto w-full rounded-full shadow-lg transition-transform duration-500 hover:rotate-2 hover:scale-105 active:scale-95"
            />
          </div>
        </div>

        {/* Click text */}
        <div className="px-2 text-center text-sm italic tracking-wide text-[#7a5c46] sm:text-base">
          clique para abrir
        </div>
      </div>

      {/* Animation effect overlay */}
      {showAnimation && (
        <div className="bg-gradient-radial animate-fade-in pointer-events-none absolute inset-0 z-10 from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
};

export default EntrancePage;
