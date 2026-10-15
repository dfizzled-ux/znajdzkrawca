import Link from 'next/link';
import { tailorSlug } from '@/lib/slugify';

function Initials({ name }) {
  const words = name.trim().split(/\s+/);
  const letters = words.length >= 2
    ? words[0][0] + words[1][0]
    : name.slice(0, 2);
  return (
    <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center uppercase">
      {letters}
    </div>
  );
}

export default function TailorList({ citySlug, tailors }) {
  if (!tailors.length) {
    return (
      <p className="text-slate-500 text-center py-16">
        Brak krawców w tym mieście. Wróć wkrótce!
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {tailors.map((tailor) => (
        <Link
          key={tailor.id}
          href={`/${citySlug}/${tailorSlug(tailor)}`}
          className="group flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all"
        >
          <Initials name={tailor.name} />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
              {tailor.name}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 truncate">{tailor.address}</p>
            <div className="flex items-center gap-2 mt-1">
              {tailor.rating && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="text-amber-400">★</span>
                  <span className="font-medium text-slate-700">{tailor.rating.toFixed(1)}</span>
                  {tailor.reviewCount > 0 && (
                    <span className="text-slate-400">({tailor.reviewCount})</span>
                  )}
                </span>
              )}
              {tailor.phone && (
                <span className="text-slate-400 text-xs truncate">{tailor.phone}</span>
              )}
            </div>
          </div>
          <span className="shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors text-lg">→</span>
        </Link>
      ))}
    </div>
  );
}
