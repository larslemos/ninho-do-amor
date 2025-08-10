"use client"

import type React from "react"
import { useState } from "react"

export default function FelicitationForm() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = new URLSearchParams(window.location.search).get("token")

    if (!token) {
      setStatus("Token não encontrado")
      return
    }

    if (!name.trim() || !message.trim()) {
      setStatus("Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/felicitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name: name.trim(), message: message.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus(data.message || "Mensagem enviada com sucesso! 🎉")
        setName("")
        setMessage("")
      } else {
        throw new Error(data.error || "Erro no servidor")
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err)
      setStatus("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[400px] p-6 mt-6 bg-rose-100 rounded-xl text-center shadow-lg border border-rose-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-rose-700 mb-2">💌 Deixe sua Felicitação</h2>
        <p className="text-rose-500 text-sm">Compartilhe seus votos de felicidade para os noivos!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label htmlFor="name" className="block text-rose-600 text-sm font-medium mb-1">
            Seu Nome e Apelido *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full p-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
            placeholder="Ex.: António João"
            disabled={loading}
          />
        </div>

        <div className="text-left">
          <label htmlFor="message" className="block text-rose-600 text-sm font-medium mb-1">
            Mensagem de Felicitação *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            maxLength={500}
            className="w-full p-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors resize-none"
            placeholder="Escreva sua mensagem de felicitação para os noivos..."
            disabled={loading}
          />
          <div className="text-right text-xs text-rose-400 mt-1">{message.length}/500 caracteres</div>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !message.trim()}
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </div>
          ) : (
            "Enviar Felicitação 💝"
          )}
        </button>
      </form>

      {status && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            status.includes("sucesso")
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  )
}
