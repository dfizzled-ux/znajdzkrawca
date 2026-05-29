'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cities } from '@/lib/data';

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const match = cities.find(
      (c) => normalize(c.name) === normalize(q) || c.slug === normalize(q)
    );

    if (match) {
      setError('');
      router.push(`/${match.slug}`);
    } else {
      setError('Nie znaleziono miasta. Spróbuj: Warszawa, Kraków, Wrocław…');
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError('');
          }}
          placeholder="Wpisz nazwę miasta…"
          className="flex-1 px-4 py-3 rounded-lg text-slate-900 text-base bg-white border-2 border-white outline-none shadow-lg placeholder-slate-400 focus:border-amber-400 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold rounded-lg shadow-lg transition-colors cursor-pointer"
        >
          Szukaj
        </button>
      </form>
      {error && (
        <p className="mt-2 text-amber-200 text-sm">{error}</p>
      )}
    </div>
  );
}
