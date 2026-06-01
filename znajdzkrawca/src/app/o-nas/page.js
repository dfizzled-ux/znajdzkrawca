import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'O nas — Znajdź Krawca',
  description: 'Znajdź Krawca to bezpłatny katalog krawców i pracowni krawieckich w Polsce. Pomagamy Polakom znaleźć sprawdzonego krawca w swoim mieście.',
};

export default function ONasPage() {
  return (
    <>
      <header className="relative text-white py-12 px-4 overflow-hidden">
        <Image src="/hero.jpg" alt="" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-indigo-950/90" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-5 transition-colors">
            ← Powrót do strony głównej
          </Link>
          <h1 className="text-4xl font-bold">O nas</h1>
          <p className="text-blue-200 mt-2">Czym jest Znajdź Krawca?</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Nasz cel</h2>
          <p className="text-slate-600 leading-relaxed">
            Znajdź Krawca to bezpłatny katalog krawców i pracowni krawieckich w Polsce.
            Naszym celem jest ułatwienie Polakom znalezienia sprawdzonego krawca w ich mieście —
            bez przeglądania dziesiątek stron internetowych i bez straty czasu.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Co oferujemy</h2>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Katalog ponad 500 krawców i pracowni krawieckich w 10 miastach Polski</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Adresy, numery telefonów i linki do map dla każdego krawca</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Wyszukiwarka według miasta</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">✓</span> Bezpłatny dostęp — bez rejestracji</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Dla właścicieli firm</h2>
          <p className="text-slate-600 leading-relaxed">
            Jesteś krawcem lub właścicielem pracowni krawieckiej? Chcesz zaktualizować swoje dane,
            dodać zdjęcia lub znaleźć się w katalogu? Skontaktuj się z nami — pomożemy Ci dotrzeć
            do nowych klientów.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Kontakt</h2>
          <p className="text-slate-600 leading-relaxed">
            Masz pytania, sugestie lub chcesz zgłosić błąd w danych? Napisz do nas na adres:{' '}
            <a href="mailto:kontakt@znajdzkrawca.pl" className="text-blue-600 hover:underline font-medium">
              kontakt@znajdzkrawca.pl
            </a>
          </p>
        </div>

        <div className="mt-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Wróć do strony głównej
          </Link>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        © 2026 Znajdź Krawca — Katalog krawców w Polsce
      </footer>
    </>
  );
}
