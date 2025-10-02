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

  const { elementRef: headerRef, isVisible: headerVisible } =
    useScrollAnimation(0.3);
  const { elementRef: timelineRef, isVisible: timelineVisible } =
    useScrollAnimation(0.3);
  const { elementRef: noteRef, isVisible: noteVisible } =
    useScrollAnimation(0.3);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      <LeafDecoration position="bottom-left" />
      <LeafDecoration position="bottom-right" />

      <div className="mx-auto max-w-3xl px-4 text-center">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-12 transition-all duration-1000 ${
            headerVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <p className="elegant-font text-body-text mb-6 px-2 text-lg sm:text-xl">
            Com a bênção de Deus e de seus pais
          </p>

          <div className="mb-8">
            <h1 className="script-font text-script-text mb-4 text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Judy
            </h1>
            <h1 className="script-font text-script-text text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              e Hélder
            </h1>
          </div>

          <p className="body-font text-body-text mx-auto max-w-xl px-2 text-base sm:text-lg">
            Têm a honra de lhe convidar para celebrar seu casamento.
          </p>
        </div>

        {/* Timeline */}
        <div
          ref={timelineRef}
          className={`space-y-8 transition-all delay-300 duration-1000 ${
            timelineVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          {/* Civil Ceremony */}
          <div className="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex touch-manipulation items-center justify-center">
              <HeartIcon onClick={handleHeartClick} />
            </div>
            <div className="border-elegant-gold hidden w-8 border-t sm:block sm:w-12"></div>
            <div className="text-center sm:text-left">
              <h3 className="body-font text-script-text text-lg font-semibold sm:text-xl">
                Cerimônia Civil
              </h3>
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex touch-manipulation items-center justify-center">
              <HeartIcon onClick={handleHeartClick} />
            </div>
            <div className="border-elegant-gold hidden w-8 border-t sm:block sm:w-12"></div>
            <div className="text-center sm:text-left">
              <h3 className="body-font text-script-text text-lg font-semibold sm:text-xl">
                15 de Novembro de 2025
              </h3>
              <p className="body-font text-body-text text-base sm:text-lg">
                Pelas 14:00
              </p>
            </div>
          </div>

          {/* Venue */}
          <div className="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex animate-pulse touch-manipulation items-center justify-center">
              <HeartIcon onClick={handleVenueClick} />
            </div>
            <div className="border-elegant-gold hidden w-8 border-t sm:block sm:w-12"></div>
            <div className="text-center sm:text-left">
              <h3 className="body-font text-script-text text-lg font-semibold sm:text-xl">
                The venue
              </h3>
              <p className="body-font text-body-text text-base sm:text-lg">
                Bairro Mahotas - Rua da igreja
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Note */}
        <div
          ref={noteRef}
          className={`mt-12 transition-all delay-500 duration-1000 ${
            noteVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <p className="body-font text-body-text text-sm italic">
            clique no ícone para interragir
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
