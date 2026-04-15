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
    <div className="max-w-lg mx-auto px-4 py-8">

      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-navy/50 uppercase tracking-widest mb-3">
          Revenus {ANNEE_REVENUS} · Déclaration {ANNEE_DECLARATION}
        </p>
        <h2 className="text-3xl font-display font-bold text-navy leading-tight mb-3">
          Frais réels ou abattement&nbsp;10&nbsp;%&nbsp;?
        </h2>
        <p className="text-gray-500 text-base leading-relaxed">
          Répondez à quelques questions, comparez les deux options et obtenez
          un récapitulatif PDF prêt à conserver.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {FEATURES.map(({ icon: Icon, color, bg, label, desc }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm"
          >
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-xs font-bold text-gray-700 leading-tight">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Deadline card */}
      <DeadlineCard />

      {/* CTA */}
      <button
        onClick={onStart}
        type="button"
        className="w-full flex items-center justify-center gap-2.5 bg-navy text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-900 active:scale-[0.98] transition-all shadow-md"
      >
        Démarrer
        <ArrowRight size={20} />
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        Environ 5 minutes · Aucune donnée transmise
      </p>
    </div>
  );
}
