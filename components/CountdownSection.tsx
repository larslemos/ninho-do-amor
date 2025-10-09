// app/components/CountdownSection.tsx

'use client';

import { useState, useEffect } from 'react';
import { Waves, Sun, Heart } from 'lucide-react';
import type { WeddingData } from '@/types/wedding';

interface CountdownSectionProps {
  weddingData: WeddingData;
}

export default function CountdownSection({
  weddingData,
}: CountdownSectionProps) {
  const targetDate = new Date('2025-08-30T13:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [animateNumbers, setAnimateNumbers] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const newTimeLeft = {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
        setTimeLeft((prev) => {
          if (
            prev.days !== newTimeLeft.days ||
            prev.hours !== newTimeLeft.hours ||
            prev.minutes !== newTimeLeft.minutes ||
            prev.seconds !== newTimeLeft.seconds
          ) {
            setAnimateNumbers(true);
            setTimeout(() => setAnimateNumbers(false), 600);
          }
          return newTimeLeft;
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setAnimateNumbers(true);
        setTimeout(() => setAnimateNumbers(false), 600);
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
    <div className="place-card font-poppins relative mx-auto mt-6 w-full max-w-md rounded-xl p-6 text-center shadow-lg duration-300 animate-in slide-in-from-right sm:mt-8">
      {/* Decorative Beach Elements */}
      <div className="absolute right-0 top-0 h-20 w-20 opacity-10 sm:h-24 sm:w-24">
        <Waves className="h-full w-full text-sky-400" />
      </div>
      <div className="absolute bottom-4 left-4 h-16 w-16 opacity-10 sm:h-20 sm:w-20">
        <Sun className="h-full w-full text-orange-400" />
      </div>

      <div className="relative z-10">
        <h2 className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold text-sky-700 sm:text-xl">
          <Heart className="h-6 w-6 text-sky-500" />
          {isWeddingDay ? '🎉 É Hoje!' : '⏰ Falta Pouco...'}
        </h2>

        <p className="mb-6 font-quicksand text-sm leading-relaxed text-sky-600 sm:text-base">
          {isWeddingDay ? (
            <>
              Hoje é o grande dia do casamento de{' '}
              <span className="font-dancing text-lg font-semibold text-sky-700">
                {weddingData.wedding_details.bride}
              </span>{' '}
              &{' '}
              <span className="font-dancing text-lg font-semibold text-sky-700">
                {weddingData.wedding_details.groom}
              </span>
              !
            </>
          ) : (
            <>
              A contagem decrescente já começou — falta pouco para celebrarmos
              juntos o casamento de{' '}
              <span className="font-dancing text-lg font-semibold text-sky-700">
                {weddingData.wedding_details.bride}
              </span>{' '}
              &{' '}
              <span className="font-dancing text-lg font-semibold text-sky-700">
                {weddingData.wedding_details.groom}
              </span>
              !
            </>
          )}
        </p>

        <div className="status-badge mb-6 grid grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: timeLeft.days, label: 'Dias' },
            { value: timeLeft.hours, label: 'Horas' },
            { value: timeLeft.minutes, label: 'Minutos' },
            { value: timeLeft.seconds, label: 'S' },
          ].map((item, index) => (
            <div
              key={index}
              className={`place-card-enhanced rounded-lg bg-white/90 p-3 shadow-inner backdrop-blur-sm ${
                animateNumbers ? 'status-change-animation' : ''
              }`}
            >
              <span className="font-poppins block text-2xl font-bold text-sky-700 sm:text-3xl">
                {item.value.toString().padStart(2, '0')}
              </span>
              <span className="font-poppins text-xs uppercase tracking-wide text-sky-600 sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="place-card-enhanced rounded-lg bg-white/90 p-3 text-sm text-sky-600 shadow-inner backdrop-blur-sm sm:text-base">
          <p className="font-quicksand">
            📅{' '}
            <span className="font-semibold text-sky-700">
              30 de Agosto de 2025
            </span>
          </p>
          <p className="font-quicksand">
            🕐 <span className="font-semibold text-sky-700">13:00 (1 PM)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
