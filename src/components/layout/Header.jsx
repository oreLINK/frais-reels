export function Header({ onHome }) {
  return (
    <header className="bg-navy text-white shadow-lg">
      <div className="flex items-center justify-center py-6 sm:py-8 px-4">
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onHome?.(); }}
          className="flex flex-col items-center gap-1.5 group"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight leading-none text-white group-hover:text-blue-200 transition-colors">
            Frais Réels
          </h1>
          <p className="text-blue-300 text-sm sm:text-base font-medium group-hover:text-blue-200 transition-colors">
            Revenus 2025 · Déclaration 2026
          </p>
        </a>
      </div>
    </header>
  );
}
