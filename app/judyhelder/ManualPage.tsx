import LeafDecoration from './LeafDecoration';
import HeartIcon from './HeartIcon';

import Image from 'next/image';

const ManualPage = () => {
  const handleGiftListClick = () => {
    console.log('Lista de presentes clicked');
  };

  const handleConfirmPresenceClick = () => {
    console.log('Confirmar presença clicked');
  };

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation(0.3);
  const { elementRef: interactiveRef, isVisible: interactiveVisible } = useScrollAnimation(0.3);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <LeafDecoration position="top-left" />
      <LeafDecoration position="top-right" />
      <LeafDecoration position="bottom-left" />
      <LeafDecoration position="bottom-right" />

      <div className="mx-auto max-w-4xl px-4">
        {/* Title */}
        <div
          ref={titleRef}
          className={`mb-12 text-center transition-all duration-1000 ${
            titleVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <h1 className="script-font text-script-text text-3xl sm:text-4xl lg:text-5xl">
            Manual do convidado
          </h1>
        </div>

        <div
          ref={contentRef}
          className={`grid items-center gap-8 transition-all delay-300 duration-1000 lg:grid-cols-2 lg:gap-12 ${
            contentVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          {/* Couple Illustrations */}
          <div className="order-1 flex justify-center space-x-6 sm:space-x-8 lg:order-1">
            {/* Woman in green dress */}
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-32 w-24 sm:h-40 sm:w-28 lg:h-44 lg:w-32">
                <img
                  src={greendressImage}
                  alt="Woman in green dress"
                  className="h-full w-full rounded-lg object-contain shadow-sm"
                />
                <Image
                  src={/iamges/deeegnrrss.jpg}
                  alt="Man in black suite"
                  width={300}
                  height={300}
                />
              </div>
            </div>

            {/* Man in tuxedo */}
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-32 w-24 sm:h-40 sm:w-28 lg:h-44 lg:w-32">
                <img
                  src={suitblImage}
                  alt="Man in tuxedo"
                  className="h-full w-full rounded-lg object-contain shadow-sm"
                />
                <Image src={/iamges/bilstu.jpg} alt="Man in black suite" width={300} height={300} />
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="order-2 space-y-4 sm:space-y-6 lg:order-2">
            <div className="space-y-2 sm:space-y-3">
              <p className="body-font text-script-text text-base font-semibold sm:text-lg">
                Confirme sua presença
              </p>
              <p className="body-font text-script-text text-base font-semibold sm:text-lg">
                Traje formal - casual
              </p>
              <p className="body-font text-script-text text-base font-semibold sm:text-lg">
                Branco é a cor da noiva
              </p>
              <p className="body-font text-script-text text-base font-semibold sm:text-lg">
                Não atrapalhe os fotógrafos
              </p>
              <p className="body-font text-script-text text-base font-semibold sm:text-lg">
                Seja pontual
              </p>
              <p className="body-font text-script-text text-base font-semibold sm:text-lg">
                Aproveite bastante
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div
          ref={interactiveRef}
          className={`mt-12 space-y-6 transition-all delay-500 duration-1000 sm:mt-16 sm:space-y-8 ${
            interactiveVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2 py-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex touch-manipulation items-center justify-center">
              <HeartIcon onClick={handleGiftListClick} />
            </div>
            <p className="body-font text-script-text text-center text-lg font-semibold sm:text-xl">
              Lista de presentes
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 py-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex touch-manipulation items-center justify-center">
              <HeartIcon onClick={handleConfirmPresenceClick} />
            </div>
            <p className="body-font text-script-text text-center text-lg font-semibold sm:text-xl">
              Confirmar presença
            </p>
          </div>

          {/* Interactive Note */}
          <div className="mt-6 text-center sm:mt-8">
            <p className="body-font text-body-text text-xs italic sm:text-sm">
              clique nos ícones para interragir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualPage;
