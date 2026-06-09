import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Nie znaleziono — Znajdź Krawca',
};

export default function NotFound() {
  return (
    <>
      <header className="relative text-white py-12 px-4 overflow-hidden">
        <Image src="/hero.jpg" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-indigo-950/90" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-5 transition-colors">
            ← Powrót do strony głównej
          </Link>
          <h1 className="text-4xl font-bold">Nie znaleziono strony</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">✂️</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Ta strona nie istnieje</h2>
        <p className="text-slate-500 mb-8">
          Szukany krawiec mógł zostać usunięty z katalogu lub adres URL jest nieprawidłowy.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          Wróć do strony głównej
        </Link>
      </main>

      <footer className="mt-auto border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        © 2026 Znajdź Krawca — Katalog krawców w Polsce
      </footer>
    </>
  );
}
