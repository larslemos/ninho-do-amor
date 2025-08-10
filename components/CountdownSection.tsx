"use client"

import { useState, useEffect } from "react"
import type { WeddingData } from "@/types/wedding"

interface CountdownSectionProps {
  weddingData: WeddingData
}

export default function CountdownSection({ weddingData }: CountdownSectionProps) {
  // Set target date to August 30, 2025 at 13:00 (1 PM)
  const targetDate = new Date("2025-08-30T13:00:00").getTime()

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const isWeddingDay = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div className="w-[400px] p-6 mt-6 bg-rose-100 rounded-xl text-center shadow-lg border border-rose-200">
      <h2 className="text-xl font-semibold text-rose-700 mb-4">{isWeddingDay ? "🎉 É hoje!" : "⏰ Falta pouco..."}</h2>

      <p className="text-rose-500 mb-4">
        {isWeddingDay
          ? `Hoje é o grande dia do casamento de ${weddingData.wedding_details.bride} & ${weddingData.wedding_details.groom}!`
          : `A contagem decrescente já começou — falta pouco para celebrarmos juntos o casamento de ${weddingData.wedding_details.bride} & ${weddingData.wedding_details.groom}!`}
      </p>

      <div className="grid grid-cols-4 gap-3">
        {[
          { value: timeLeft.days, label: "Dias" },
          { value: timeLeft.hours, label: "Horas" },
          { value: timeLeft.minutes, label: "Minutos" },
          { value: timeLeft.seconds, label: "Segundos" },
        ].map((item, index) => (
          <div key={index} className="bg-rose-200 rounded-lg p-3">
            <span className="block font-bold text-2xl text-rose-700">{item.value.toString().padStart(2, "0")}</span>
            <span className="text-xs text-rose-600 uppercase tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-rose-600 text-sm">
        <p>
          📅 <strong>30 de Agosto de 2025</strong>
        </p>
        <p>
          🕐 <strong>13:00 (1 PM)</strong>
        </p>
      </div>
    </div>
  )
}
