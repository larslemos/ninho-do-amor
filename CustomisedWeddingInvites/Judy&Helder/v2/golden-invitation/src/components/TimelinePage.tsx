import LeafDecoration from './LeafDecoration';
import HeartIcon from './HeartIcon';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const TimelinePage = () => {
  const handleHeartClick = () => {
    console.log('Heart clicked - interactive element');
  };

  const handleVenueClick = () => {
    window.open('https://maps.app.goo.gl/MBAvo4C4d6GkvXsG7', '_blank');
  };

  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation(0.3);
  const { elementRef: timelineRef, isVisible: timelineVisible } = useScrollAnimation(0.3);
  const { elementRef: noteRef, isVisible: noteVisible } = useScrollAnimation(0.3);

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      <LeafDecoration position="bottom-left" />
      <LeafDecoration position="bottom-right" />
      
      <div className="max-w-3xl mx-auto text-center px-4">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`mb-12 transition-all duration-1000 ${
            headerVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <p className="elegant-font text-lg sm:text-xl text-body-text mb-6 px-2">
            Com a bênção de Deus e de seus pais
          </p>
          
          <div className="mb-8">
            <h1 className="script-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-script-text mb-4 leading-tight">
              Judy
            </h1>
            <h1 className="script-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-script-text leading-tight">
              e Hélder
            </h1>
          </div>
          
          <p className="body-font text-base sm:text-lg text-body-text max-w-xl mx-auto px-2">
            Têm a honra de lhe convidar para celebrar seu casamento.
          </p>
        </div>
        
        {/* Timeline */}
        <div 
          ref={timelineRef}
          className={`space-y-8 transition-all duration-1000 delay-300 ${
            timelineVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          {/* Civil Ceremony */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center justify-center touch-manipulation">
              <HeartIcon onClick={handleHeartClick} />
            </div>
            <div className="border-t border-elegant-gold w-8 sm:w-12 hidden sm:block"></div>
            <div className="text-center sm:text-left">
              <h3 className="body-font text-lg sm:text-xl font-semibold text-script-text">
                Cerimônia Civil
              </h3>
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center justify-center touch-manipulation">
              <HeartIcon onClick={handleHeartClick} />
            </div>
            <div className="border-t border-elegant-gold w-8 sm:w-12 hidden sm:block"></div>
            <div className="text-center sm:text-left">
              <h3 className="body-font text-lg sm:text-xl font-semibold text-script-text">
                15 de Novembro de 2025
              </h3>
              <p className="body-font text-base sm:text-lg text-body-text">
                Pelas 14:00
              </p>
            </div>
          </div>
          
          {/* Venue */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center justify-center touch-manipulation animate-pulse">
              <HeartIcon onClick={handleVenueClick} />
            </div>
            <div className="border-t border-elegant-gold w-8 sm:w-12 hidden sm:block"></div>
            <div className="text-center sm:text-left">
              <h3 className="body-font text-lg sm:text-xl font-semibold text-script-text">
                The venue
              </h3>
              <p className="body-font text-base sm:text-lg text-body-text">
                Bairro Mahotas - Rua da igreja
              </p>
            </div>
          </div>
        </div>
        
        {/* Interactive Note */}
        <div 
          ref={noteRef}
          className={`mt-12 transition-all duration-1000 delay-500 ${
            noteVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <p className="body-font text-sm text-body-text italic">
            clique no ícone para interragir
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;