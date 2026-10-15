import Image from 'next/image';
import Link from 'next/link';

// Shared hero header + footer for city, district and service pages.
// crumbs: [{ href, label }] — the last one is rendered as plain text.
export function PageHero({ crumbs, title, subtitle }) {
  return (
    <header className="relative text-white py-12 px-4 overflow-hidden">
      <Image src="/hero.jpg" alt="" fill className="object-cover object-center" priority />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-indigo-950/90" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <nav className="text-blue-200 text-sm mb-5 flex flex-wrap items-center gap-2">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {i < crumbs.length - 1
                ? <Link href={c.href} className="hover:text-white transition-colors">{c.label}</Link>
                : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-blue-200 mt-2">{subtitle}</p>}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 py-6 text-center text-sm text-slate-400">
      <div className="mb-2">
        <Link href="/o-nas" className="hover:text-slate-600 transition-colors">O nas</Link>
        <span className="mx-2">·</span>
        <a href="mailto:kontakt@znajdzkrawca.pl" className="hover:text-slate-600 transition-colors">Kontakt</a>
      </div>
      © 2026 Znajdź Krawca — Katalog krawców w Polsce
    </footer>
  );
}

// Pill-style link list ("Dzielnice", "Usługi")
export function LinkPills({ heading, links }) {
  if (!links.length) return null;
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{heading}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
