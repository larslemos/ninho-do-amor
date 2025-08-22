// app/not-found.tsx - CORRECT
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="mx-4 max-w-md rounded-2xl bg-white/90 p-6 text-center shadow-lg">
        <h1 className="font-playfair mb-4 text-4xl font-bold text-rose-700">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-rose-600">
          Página Não Encontrada
        </h2>
        <p className="mb-6 text-rose-500">
          Desculpe, não conseguimos encontrar a página que procura.
        </p>
        <Link
          href="/"
          className="rounded-full bg-rose-600 px-6 py-3 font-medium text-white transition-colors hover:bg-rose-700"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
