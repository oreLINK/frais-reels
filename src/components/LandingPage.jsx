import { ArrowRight, Calculator, Shield, FileText, TrendingUp, Receipt, Clock, AlertTriangle } from 'lucide-react';
import { DeadlineCard } from './ui/DeadlineCard';
import { SourceLegale } from './ui/SourceLegale';
import { ANNEE_REVENUS, ANNEE_DECLARATION, ABATTEMENT } from '../config/fiscalite';

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
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: 'PDF complet',
    desc: 'Récap à garder',
  },
];

export function LandingPage({ onStart }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

      {/* Hero */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-navy leading-tight mb-3">
          Frais réels ou abattement&nbsp;10&nbsp;%&nbsp;?
        </h2>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
          Trouvez l'option la plus avantageuse pour votre déclaration en 5 minutes.
        </p>
      </div>

      {/* Intro */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="space-y-5">

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center">
              <TrendingUp size={18} className="text-navy" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">L'abattement forfaitaire 10 %</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Par défaut, l'administration déduit automatiquement 10 % de vos revenus pour couvrir vos frais
                professionnels (plafonné à {new Intl.NumberFormat('fr-FR').format(ABATTEMENT.plafond)}&nbsp;€).
                C'est simple, mais pas toujours optimal.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Receipt size={18} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Les frais réels</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vous pouvez déclarer vos dépenses professionnelles réelles : trajets domicile-travail,
                repas, matériel, double résidence… Si leur total dépasse l'abattement forfaitaire,
                vous payez moins d'impôts.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
              <Clock size={18} className="text-success" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Ce simulateur vous fait gagner du temps</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                En 5 minutes, il calcule vos deux options, identifie la plus avantageuse et génère
                un PDF récapitulatif à conserver en cas de contrôle. Tout se passe dans votre navigateur —
                aucune donnée n'est transmise.
              </p>
            </div>
          </div>

        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-gray-100">
          {FEATURES.map(({ icon: Icon, color, bg, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-1.5`}>
                <Icon size={17} className={color} />
              </div>
              <p className="text-xs font-bold text-gray-700 leading-tight">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Déclaration en cours */}
      <div className="rounded-2xl overflow-hidden border-2 border-danger mb-6">
        <div className="bg-danger px-4 py-2.5 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0" />
          <span className="text-white font-bold text-sm uppercase tracking-wider">
            Déclaration en cours
          </span>
          <span className="text-white/75 text-xs ml-auto whitespace-nowrap">
            Revenus {ANNEE_REVENUS} · Déclaration {ANNEE_DECLARATION}
          </span>
        </div>
        <DeadlineCard />
      </div>

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

      {/* Sanctions */}
      <div className="mt-8 bg-red-50 border border-danger rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle size={18} className="text-danger flex-shrink-0 mt-0.5" />
          <h3 className="font-bold text-danger text-sm uppercase tracking-wide">
            Sanctions en cas de déclaration tardive
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-red-900 leading-relaxed">
          <li className="flex gap-2">
            <span className="font-bold flex-shrink-0">+10 %</span>
            <span>de majoration sur l'impôt dû si vous déclarez en retard, même sans mise en demeure.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold flex-shrink-0">+40 %</span>
            <span>si la déclaration n'est pas déposée dans les 30 jours suivant une mise en demeure de l'administration.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold flex-shrink-0">+0,20 %</span>
            <span>d'intérêts de retard par mois sur le montant de l'impôt non payé dans les délais.</span>
          </li>
        </ul>
        <div className="mt-3 pt-3 border-t border-red-200">
          <SourceLegale refKeys={['sanctions_retard_declaration', 'interets_retard']} />
        </div>
      </div>
    </div>
  );
}
