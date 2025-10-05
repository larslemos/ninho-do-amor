// app/components/judyhelder/JHCountdownSection.tsx

'use client';

import { useState, useEffect } from 'react';
import { Waves, Sun, Heart, Calendar, Clock } from 'lucide-react';
import type { WeddingData } from '@/types/wedding';

interface CountdownSectionProps {
  weddingData: WeddingData;
}

export default function JHCountdownSection({
  weddingData,
}: CountdownSectionProps) {
  const targetDate =
    weddingData.date && weddingData.time
      ? new Date(weddingData.date + 'T' + weddingData.time).getTime()
      : null;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isWeddingDay =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl px-4">
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

        <div className="relative z-10 space-y-8 p-6 md:p-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="wedding-button flex h-16 w-16 items-center justify-center rounded-full shadow-xl md:h-20 md:w-20">
                <Heart className="h-8 w-8 text-white md:h-10 md:w-10" />
              </div>
            </div>

            <h2 className="wedding-text-secondary font-blancha text-lg font-light md:text-xl">
              {isWeddingDay ? '🎉 É Hoje!' : '⏰ Falta Pouco...'}
            </h2>

            <p className="wedding-text-secondary font-blancha text-sm leading-relaxed md:text-base">
              {isWeddingDay ? (
                <>
                  Hoje é o grande dia do casamento de{' '}
                  <span className="wedding-names font-sacramento text-xl md:text-2xl">
                    {weddingData?.bride || 'Noiva'}
                  </span>{' '}
                  &{' '}
                  <span className="wedding-names font-sacramento text-xl md:text-2xl">
                    {weddingData?.groom || 'Noivo'}
                  </span>
                  !
                </>
              ) : (
                <>
                  A contagem decrescente já começou — falta pouco para
                  celebrarmos juntos o casamento de{' '}
                  <span className="wedding-names font-sacramento text-xl md:text-2xl">
                    {weddingData?.bride || 'Noiva'}
                  </span>{' '}
                  &{' '}
                  <span className="wedding-names font-sacramento text-xl md:text-2xl">
                    {weddingData?.groom || 'Noivo'}
                  </span>
                  !
                </>
              )}
            </p>
          </div>

          {/* Countdown Grid */}
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {[
              { value: timeLeft.days, label: 'Dias' },
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Minutos' },
              { value: timeLeft.seconds, label: 'Segundos' },
            ].map((item, index) => (
              <div
                key={index}
                className="wedding-info-card rounded-2xl p-2 text-center shadow-lg md:p-3"
              >
                <span className="wedding-text-primary block text-xl font-bold md:text-2xl">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="wedding-text-secondary font-blancha text-xs uppercase tracking-wide md:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Date & Time Info */}
          <div className="wedding-info-card space-y-4 rounded-2xl p-4 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="wedding-button flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg md:h-12 md:w-12">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="wedding-text-primary font-blancha text-base font-bold md:text-lg">
                    {weddingData.date
                      ? new Date(weddingData.date).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Data não disponível'}
                  </div>
                  <div className="wedding-text-secondary font-blancha text-xs md:text-sm">
                    {weddingData.date
                      ? new Date(weddingData.date).toLocaleDateString('pt-PT', {
                          weekday: 'long',
                        })
                      : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="wedding-button flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg md:h-12 md:w-12">
                  <Clock className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="wedding-text-primary font-blancha text-base font-bold md:text-lg">
                    {weddingData.time || 'Horário não disponível'}
                  </div>
                  <div className="wedding-text-secondary font-blancha text-xs md:text-sm">
                    Horário de início
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
