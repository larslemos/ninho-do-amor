import LeafDecoration from './LeafDecoration';
import lastPageImage from '@/assets/lastpage.webp';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const LastPage = () => {
  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation(0.3);
  const { elementRef: messageRef, isVisible: messageVisible } = useScrollAnimation(0.3);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      <LeafDecoration position="bottom-left" />
      <LeafDecoration position="bottom-right" />

      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Couple Photo */}
        <div
          ref={imageRef}
          className={`mb-8 transition-all duration-1000 ${
            imageVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <img
            src={lastPageImage}
            alt="Judy e Hélder - Celebrating Love"
            className="mx-auto w-full max-w-xs rounded-lg shadow-lg sm:max-w-md lg:max-w-2xl"
          />
        </div>

        {/* Message */}
        <div
          ref={messageRef}
          className={`space-y-6 transition-all delay-300 duration-1000 ${
            messageVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <p className="elegant-font text-script-text px-2 text-xl leading-relaxed sm:text-2xl lg:text-3xl">
            Contamos com ça para celebrar o nosso amor
          </p>

          <p className="script-font text-script-text px-2 text-2xl sm:text-3xl lg:text-4xl">
            Com carinho, Judy & Hélder
          </p>
        </div>
      </div>
    </div>
  );
};

export default LastPage;
