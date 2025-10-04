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
  const targetDate = new Date(
    weddingData.date + 'T' + weddingData.time
  ).getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
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
        {/* Decorative Elements */}
        <div className="absolute right-8 top-8 h-24 w-24 opacity-20 md:h-32 md:w-32">
          <Waves className="wedding-decorative-svg h-full w-full" />
        </div>
        <div className="absolute bottom-8 left-8 h-20 w-20 opacity-15">
          <Sun className="wedding-decorative-svg h-full w-full" />
        </div>

        <div className="relative z-10 space-y-12 p-12">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="wedding-button flex h-20 w-20 items-center justify-center rounded-full shadow-xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>

            <h2 className="wedding-text-secondary font-blancha text-xl font-light md:text-2xl">
              {isWeddingDay ? '🎉 É Hoje!' : '⏰ Falta Pouco...'}
            </h2>

            <p className="wedding-text-secondary font-blancha text-lg leading-relaxed">
              {isWeddingDay ? (
                <>
                  Hoje é o grande dia do casamento de{' '}
                  <span className="wedding-names font-sacramento text-2xl">
                    {weddingData?.bride || 'Noiva'}
                  </span>{' '}
                  &{' '}
                  <span className="wedding-names font-sacramento text-2xl">
                    {weddingData?.groom || 'Noivo'}
                  </span>
                  !
                </>
              ) : (
                <>
                  A contagem decrescente já começou — falta pouco para
                  celebrarmos juntos o casamento de{' '}
                  <span className="wedding-names font-sacramento text-2xl">
                    {weddingData?.bride || 'Noiva'}
                  </span>{' '}
                  &{' '}
                  <span className="wedding-names font-sacramento text-2xl">
                    {weddingData?.groom || 'Noivo'}
                  </span>
                  !
                </>
              )}
            </p>
          </div>

          {/* Countdown Grid */}
          <div className="grid grid-cols-4 gap-4 md:gap-6">
            {[
              { value: timeLeft.days, label: 'Dias' },
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Minutos' },
              { value: timeLeft.seconds, label: 'Segundos' },
            ].map((item, index) => (
              <div
                key={index}
                className="wedding-info-card rounded-2xl p-4 text-center shadow-lg md:p-6"
              >
                <span className="wedding-text-primary block text-2xl font-bold md:text-4xl">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="wedding-text-secondary font-blancha text-xs uppercase tracking-wide md:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Date & Time Info */}
          <div className="wedding-info-card space-y-6 rounded-3xl p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="wedding-button flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="wedding-text-primary font-blancha text-lg font-bold">
                    {new Date(weddingData.date).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="wedding-text-secondary font-blancha text-sm">
                    {new Date(weddingData.date).toLocaleDateString('pt-PT', {
                      weekday: 'long',
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="wedding-button flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="wedding-text-primary font-blancha text-lg font-bold">
                    {weddingData.time}
                  </div>
                  <div className="wedding-text-secondary font-blancha text-sm">
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
