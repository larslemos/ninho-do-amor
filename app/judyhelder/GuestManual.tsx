// components/GuestManualPage.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Heart, Gift, CheckCircle, Waves, Sun } from 'lucide-react';

// Custom hook for scroll animations
const useScrollAnimation = (threshold: number = 0.3) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  return { elementRef, isVisible };
};

interface GuestManualPageProps {
  weddingData?: {
    theme?: string;
    bride?: string;
    groom?: string;
  };
}

export default function GuestManualPage({ weddingData }: GuestManualPageProps) {
  const theme = weddingData?.theme || 'branco-dourado';

  const handleGiftListClick = () => {
    console.log('Lista de presentes clicked');
  };

  const handleConfirmPresenceClick = () => {
    console.log('Confirmar presença clicked');
  };

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.3);
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation(0.3);
  const { elementRef: interactiveRef, isVisible: interactiveVisible } = useScrollAnimation(0.3);

  const guidelines = [
    { text: 'Confirme sua presença', icon: CheckCircle },
    { text: 'Traje formal - casual', icon: Heart },
    {
      text: 'Branco é a cor da noiva',
      icon: () => <span className="text-2xl">👰</span>,
    },
    {
      text: 'Não atrapalhe os fotógrafos',
      icon: () => <span className="text-2xl">📸</span>,
    },
    { text: 'Seja pontual', icon: () => <span className="text-2xl">⏰</span> },
    {
      text: 'Aproveite bastante',
      icon: () => <span className="text-2xl">🎉</span>,
    },
  ];

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl px-4" data-theme={theme}>
      <div className="wedding-hero-card relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Constrain decorative elements to card bounds */}
        <div
          className="absolute right-4 top-4 h-16 w-16 opacity-20 md:h-24 md:w-24"
          style={{ maxWidth: '10%', maxHeight: '10%' }}
        >
          <Waves className="wedding-decorative-svg h-full w-full" />
        </div>
        <div
          className="absolute bottom-4 left-4 h-16 w-16 opacity-15 md:h-24 md:w-24"
          style={{ maxWidth: '10%', maxHeight: '10%' }}
        >
          <Sun className="wedding-decorative-svg h-full w-full" />
        </div>

        <div className="relative z-10 space-y-12 p-6 md:p-8">
          {/* Title Section */}
          <div
            ref={titleRef}
            className={`text-center transition-all duration-1000 ${titleVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
          >
            <div className="mb-6 flex justify-center">
              <div className="wedding-button flex h-16 w-16 items-center justify-center rounded-full shadow-xl md:h-20 md:w-20">
                <Heart className="h-8 w-8 text-white md:h-10 md:w-10" />
              </div>
            </div>
            <h1 className="wedding-names font-sacramento text-2xl md:text-4xl">
              Manual do Convidado
            </h1>
            <div className="wedding-accent-line mx-auto mt-4 h-0.5 w-16 opacity-50 md:mt-6 md:w-24"></div>
          </div>

          {/* Main Content */}
          <div
            ref={contentRef}
            className={`transition-all delay-300 duration-1000 ${contentVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
          >
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
              {/* Dress Code Illustrations */}
              <div className="order-1 flex justify-center gap-4 sm:gap-6">
                <div className="wedding-info-card rounded-2xl p-3 text-center shadow-lg md:p-4">
                  <div className="relative mx-auto mb-2 h-32 w-24 sm:h-40 sm:w-28 md:h-48 md:w-32">
                    <Image
                      src="/assets/blackwomangreendress.png"
                      alt="Traje feminino elegante"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <p className="wedding-text-secondary font-blancha text-xs font-semibold md:text-sm">
                    Mulheres
                  </p>
                </div>

                <div className="wedding-info-card rounded-2xl p-3 text-center shadow-lg md:p-4">
                  <div className="relative mx-auto mb-2 h-32 w-24 sm:h-40 sm:w-28 md:h-48 md:w-32">
                    <Image
                      src="/assets/blackmansuit.png"
                      alt="Traje masculino elegante"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <p className="wedding-text-secondary font-blancha text-xs font-semibold md:text-sm">
                    Homens
                  </p>
                </div>
              </div>

              {/* Guidelines List */}
              <div className="order-2 space-y-3">
                {guidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="wedding-info-card flex items-center gap-3 rounded-2xl p-3 shadow-lg transition-all duration-300 hover:scale-105 md:p-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="wedding-button flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full shadow-md md:h-10 md:w-10">
                      <guideline.icon className="h-4 w-4 text-white md:h-5 md:w-5" />
                    </div>
                    <p className="wedding-text-primary font-blancha text-sm font-semibold md:text-base">
                      {guideline.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Actions */}
          <div
            ref={interactiveRef}
            className={`space-y-6 transition-all delay-500 duration-1000 ${interactiveVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
          >
            <div className="wedding-accent-line mx-auto h-0.5 w-16 opacity-30 md:w-24"></div>
            {/* Add interactive buttons if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
