import LeafDecoration from './LeafDecoration';
import welcomeImage from '@/assets/welcomepg.webp';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const WelcomePage = () => {
  const { elementRef: verseRef, isVisible: verseVisible } = useScrollAnimation(0.3);
  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation(0.3);

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      <LeafDecoration position="bottom-left" />
      <LeafDecoration position="bottom-right" />
      
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Bible Verse */}
        <div 
          ref={verseRef}
          className={`mb-8 transition-all duration-1000 ${
            verseVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <h1 className="script-font text-2xl sm:text-3xl lg:text-4xl text-verse-text mb-2 leading-relaxed px-2">
            "O meu amado é meu, e eu sou dele"
          </h1>
          <p className="elegant-font text-base sm:text-lg text-body-text px-2">
            (Cânticos dos Cânticos 2:16)
          </p>
        </div>
        
        {/* Couple Photo */}
        <div 
          ref={imageRef}
          className={`relative transition-all duration-1000 delay-300 ${
            imageVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <img 
            src={welcomeImage}
            alt="Judy e Hélder - Casal"
            className="w-full max-w-xs sm:max-w-md lg:max-w-2xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;