import { Lock } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-navy text-white py-5 px-4 shadow-md">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight leading-none">
            Frais Réels
          </h1>
          <p className="text-blue-300 text-xs mt-1 font-medium">
            Revenus 2025 · Déclaration 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-blue-300 text-xs">
          <Lock size={12} />
          <span>Données locales uniquement</span>
        </div>
      </div>
    </header>
  );
}
