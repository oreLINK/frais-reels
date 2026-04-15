import { ArrowRight, Calculator, Shield, FileText } from 'lucide-react';
import { DeadlineCard } from './ui/DeadlineCard';
import { ANNEE_REVENUS, ANNEE_DECLARATION } from '../config/fiscalite';

const FEATURES = [
  {
    icon: Calculator,
    color: 'text-navy',
    bg: 'bg-navy/5',
    label: 'Calcul guidé',
    desc: 'Étape par étape',
  },
  {
    icon: Shield,
    color: 'text-success',
    bg: 'bg-success/5',
    label: '100 % privé',
    desc: 'Données locales',
  },
  {
    icon: FileText,
    color: 'text-amber',
    bg: 'bg-amber/5',
    label: 'PDF complet',
    desc: 'Récap à garder',
  },
];

export function LandingPage({ onStart }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

      {/* Hero */}
      <div className="text-center mb-10">
        <p className="text-xs sm:text-sm font-semibold text-navy/60 uppercase tracking-widest mb-3">
          Revenus {ANNEE_REVENUS} · Déclaration {ANNEE_DECLARATION}
        </p>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-navy leading-tight mb-4">
          Frais réels ou abattement&nbsp;10&nbsp;%&nbsp;?
        </h2>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
          Répondez à quelques questions, comparez les deux options et obtenez
          un récapitulatif PDF prêt à conserver.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        {FEATURES.map(({ icon: Icon, color, bg, label, desc }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-4 sm:p-5 text-center border border-gray-100 shadow-sm"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2.5`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">{label}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Deadline card */}
      <DeadlineCard />

      {/* CTA */}
      <button
        onClick={onStart}
        type="button"
        className="w-full flex items-center justify-center gap-2.5 bg-navy text-white py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-blue-900 active:scale-[0.98] transition-all shadow-md"
      >
        Démarrer
        <ArrowRight size={22} />
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Environ 5 minutes · Aucune donnée transmise
      </p>
    </div>
  );
}
