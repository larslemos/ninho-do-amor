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
      className="relative min-h-screen flex items-center justify-center font-serif overflow-hidden px-4"
      style={{
        background: `
          linear-gradient(to right, transparent 49.9%, #c4b8a8 50%, #c4b8a8 50.1%, transparent 50.2%),
          #d9d0c2
        `
      }}
    >
      
      {/* Wax seal container */}
      <div className="flex flex-col items-center space-y-4">
        <div 
          className={`cursor-pointer transition-all duration-300 touch-manipulation ${
            isClicked ? 'animate-pulse' : ''
          }`}
          onClick={handleSealClick}
        >
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 relative flex items-center justify-center">
            <img 
              src={goldenHeart}
              alt="Wax Seal" 
              className="w-full h-auto rounded-full shadow-lg transition-transform duration-500 hover:rotate-2 hover:scale-105 active:scale-95"
            />
          </div>
        </div>
        
        {/* Click text */}
        <div className="text-[#7a5c46] text-sm sm:text-base italic tracking-wide text-center px-2">
          clique para abrir
        </div>
      </div>
      
      {/* Animation effect overlay */}
      {showAnimation && (
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-radial from-transparent via-white/20 to-transparent animate-fade-in" />
      )}
    </div>
  );
};

export default EntrancePage;