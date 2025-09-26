import LeafDecoration from './LeafDecoration';
import lastPageImage from '@/assets/lastpage.webp';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const LastPage = () => {
  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation(0.3);
  const { elementRef: messageRef, isVisible: messageVisible } = useScrollAnimation(0.3);

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      <LeafDecoration position="bottom-left" />
      <LeafDecoration position="bottom-right" />
      
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Couple Photo */}
        <div 
          ref={imageRef}
          className={`mb-8 transition-all duration-1000 ${
            imageVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <img 
            src={lastPageImage}
            alt="Judy e Hélder - Celebrating Love"
            className="w-full max-w-xs sm:max-w-md lg:max-w-2xl mx-auto rounded-lg shadow-lg"
          />
        </div>
        
        {/* Message */}
        <div 
          ref={messageRef}
          className={`space-y-6 transition-all duration-1000 delay-300 ${
            messageVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <p className="elegant-font text-xl sm:text-2xl lg:text-3xl text-script-text leading-relaxed px-2">
            Contamos com sua presença para celebrar o nosso amor
          </p>
          
          <p className="script-font text-2xl sm:text-3xl lg:text-4xl text-script-text px-2">
            Com carinho, Judy & Hélder
          </p>
        </div>
      </div>
    </div>
  );
};

export default LastPage;