// app/not-found.tsx - CORRECT
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
            <div className="text-center p-6 bg-white/90 rounded-2xl shadow-lg max-w-md mx-4">
                <h1 className="text-4xl font-playfair font-bold text-rose-700 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-rose-600 mb-4">Página Não Encontrada</h2>
                <p className="text-rose-500 mb-6">
                    Desculpe, não conseguimos encontrar a página que procura.
                </p>
                <Link
                    href="/"
                    className="bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-700 transition-colors font-medium"
                >
                    Voltar ao Início
                </Link>
            </div>
        </div>
    )
}
