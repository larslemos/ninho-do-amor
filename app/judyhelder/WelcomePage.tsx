import LeafDecoration from './LeafDecoration';
import welcomeImage from '@/assets/welcomepg.webp';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const WelcomePage = () => {
  const { elementRef: verseRef, isVisible: verseVisible } = useScrollAnimation(0.3);
  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation(0.3);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      <LeafDecoration position="bottom-left" />
      <LeafDecoration position="bottom-right" />

      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Bible Verse */}
        <div
          ref={verseRef}
          className={`mb-8 transition-all duration-1000 ${
            verseVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <h1 className="script-font text-verse-text mb-2 px-2 text-2xl leading-relaxed sm:text-3xl lg:text-4xl">
            "O meu amado é meu, e eu sou dele"
          </h1>
          <p className="elegant-font text-body-text px-2 text-base sm:text-lg">
            (Cânticos dos Cânticos 2:16)
          </p>
        </div>

        {/* Couple Photo */}
        <div
          ref={imageRef}
          className={`relative transition-all delay-300 duration-1000 ${
            imageVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <img
            src={welcomeImage}
            alt="Judy e Hélder - Casal"
            className="mx-auto w-full max-w-xs rounded-lg shadow-lg sm:max-w-md lg:max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
