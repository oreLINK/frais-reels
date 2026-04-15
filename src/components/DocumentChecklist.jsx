import { useState } from 'react';
import { ArrowRight, FileText, Car, Utensils, Home, Monitor, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'revenus',
    icon: FileText,
    color: 'text-navy',
    bg: 'bg-navy/5',
    border: 'border-navy/10',
    title: 'Revenus',
    subtitle: 'Pour connaître votre base de calcul',
    docs: [
      {
        label: 'Dernière fiche de paie de l\'année',
        detail: 'Repérez le champ "Net imposable" ou "Cumul net imposable" — c\'est votre salaire net imposable annuel (SNI).',
        required: true,
      },
      {
        label: 'Ou : avis d\'imposition 2024 (revenus 2023)',
        detail: 'Ligne "Traitements et salaires" avant abattement. Utile si vous n\'avez pas votre dernière fiche sous la main.',
        required: false,
      },
    ],
  },
  {
    id: 'transports',
    icon: Car,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Transports',
    subtitle: 'Le poste le plus important pour beaucoup de salariés',
    docs: [
      {
        label: 'Carte grise du véhicule',
        detail: 'Pour connaître la puissance fiscale (colonne "P6" ou "CV fiscaux"). Voiture, moto ou cyclomoteur.',
        required: true,
      },
      {
        label: 'Distance exacte domicile ↔ lieu de travail',
        detail: 'En kilomètres aller simple. Utilisez Google Maps avec votre itinéraire habituel. Au-delà de 40 km, une justification particulière est exigée.',
        required: true,
      },
      {
        label: 'Nombre de jours travaillés sur site en 2025',
        detail: 'Comparez vos bulletins de salaire ou votre planning. Enlevez télétravail, congés, arrêts. Valeur typique : 100–220 j/an.',
        required: true,
      },
      {
        label: 'Montant annuel des péages (si concerné)',
        detail: 'Relevé de votre télépéage (Sanef, Vinci…) ou estimation sur l\'année. Uniquement les trajets domicile–travail.',
        required: false,
      },
      {
        label: 'Montant annuel du stationnement (si concerné)',
        detail: 'Abonnement parking ou coût moyen mensuel × 12. Uniquement le parking lié à votre activité professionnelle.',
        required: false,
      },
    ],
  },
  {
    id: 'repas',
    icon: Utensils,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Repas',
    subtitle: 'Si vous mangez hors de chez vous pour raisons professionnelles',
    docs: [
      {
        label: 'Coût moyen d\'un repas (restaurant ou cantine)',
        detail: 'Regardez vos tickets ou estimez votre dépense habituelle. Le simulateur plafonnera à 21,10 € au-delà duquel la dépense est jugée excessive.',
        required: true,
      },
      {
        label: 'Nombre de jours de repas hors domicile en 2025',
        detail: 'Jours où vous avez mangé sur votre lieu de travail ou en déplacement (pas à domicile). Différent du nombre de jours de présence si vous rentrez le midi.',
        required: true,
      },
      {
        label: 'Part patronale annuelle des tickets restaurant (si vous en avez)',
        detail: 'Visible sur votre bulletin de salaire, ligne "Tickets restaurant" côté employeur. Exemple : 6,91 € × 220 j = 1 520 €. Elle est à déduire de votre frais repas.',
        required: false,
      },
    ],
  },
  {
    id: 'logement',
    icon: Home,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Logement / Télétravail',
    subtitle: 'Si vous avez un espace dédié au télétravail chez vous',
    docs: [
      {
        label: 'Surface totale de votre logement (m²)',
        detail: 'Mentionnée dans votre bail ou votre acte de propriété. Surface habitable uniquement (hors cave, parking).',
        required: true,
      },
      {
        label: 'Surface de votre bureau dédié (m²)',
        detail: 'Mesurez la pièce ou la partie de pièce strictement réservée au travail. Un coin bureau délimité compte.',
        required: true,
      },
      {
        label: 'Loyer annuel (locataires) ou intérêts d\'emprunt (propriétaires)',
        detail: 'Loyer mensuel × 12. Pour un propriétaire : consultez le tableau d\'amortissement de votre prêt, ligne "Intérêts" de l\'année 2025.',
        required: false,
      },
      {
        label: 'Factures EDF et gaz annuelles 2025',
        detail: 'Total de l\'année sur votre espace client fournisseur. Prenez le montant annuel réel, pas une estimation.',
        required: false,
      },
      {
        label: 'Avis de taxe foncière 2025 (propriétaires)',
        detail: 'Disponible sur impots.gouv.fr ou dans votre courrier. Locataires : mettez 0.',
        required: false,
      },
      {
        label: 'Charges de copropriété annuelles 2025',
        detail: 'Sur le relevé annuel de votre syndic. Maison individuelle : mettez 0.',
        required: false,
      },
    ],
  },
  {
    id: 'materiel',
    icon: Monitor,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    title: 'Matériel & Abonnements',
    subtitle: 'Équipements et abonnements à usage professionnel',
    docs: [
      {
        label: 'Factures de tout équipement acheté en 2025',
        detail: 'Ordinateur, écran, clavier, chaise ergonomique, webcam… Les articles > 500 € sont amortis sur 3 ans, les autres sont déductibles à 100 % l\'année d\'achat.',
        required: false,
      },
      {
        label: 'Factures annuelles de votre box internet',
        detail: 'Total 12 mois sur votre espace client (Orange, SFR, Free, Bouygues…). Vous indiquerez le pourcentage d\'usage professionnel.',
        required: false,
      },
      {
        label: 'Factures annuelles de votre téléphone mobile',
        detail: 'Total 12 mois sur votre espace client. Même logique que l\'internet : proratisation par usage pro.',
        required: false,
      },
      {
        label: 'Estimation des petites fournitures (< 500 €)',
        detail: 'Papier, stylos, cartouches d\'encre, classeurs… Estimez le total annuel de vos achats à usage strictement professionnel.',
        required: false,
      },
    ],
  },
];

function CategoryCard({ cat, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = cat.icon;
  const required = cat.docs.filter((d) => d.required);
  const optional = cat.docs.filter((d) => !d.required);

  return (
    <div className={`bg-white border ${cat.border} rounded-2xl overflow-hidden shadow-sm`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={18} className={cat.color} />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-tight">{cat.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{cat.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="text-xs text-gray-400">{cat.docs.length} doc{cat.docs.length > 1 ? 's' : ''}</span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-3">
          {required.length > 0 && (
            <div className="space-y-2">
              {required.map((doc, i) => (
                <DocItem key={i} doc={doc} accentColor={cat.color} />
              ))}
            </div>
          )}
          {optional.length > 0 && (
            <>
              {required.length > 0 && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-1">
                  Si applicable
                </p>
              )}
              <div className="space-y-2">
                {optional.map((doc, i) => (
                  <DocItem key={i} doc={doc} optional />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DocItem({ doc, optional = false, accentColor }) {
  return (
    <div className={`rounded-xl p-3 ${optional ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 flex-shrink-0 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center ${
          optional ? 'bg-gray-200 text-gray-500' : 'bg-navy/10 text-navy'
        }`}>
          {optional ? '?' : '!'}
        </span>
        <div>
          <p className={`text-xs font-semibold ${optional ? 'text-gray-500' : 'text-gray-700'}`}>
            {doc.label}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{doc.detail}</p>
        </div>
      </div>
    </div>
  );
}

export function DocumentChecklist({ onStart }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">

      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-navy mb-2">
          Préparez vos documents
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Pour un résultat précis au centime près, ayez ces éléments à portée de main.
          Les sections marquées <span className="font-semibold text-navy">!</span> sont indispensables,
          les <span className="font-semibold text-gray-400">?</span> sont facultatives selon votre situation.
        </p>
      </div>

      {/* Cards par catégorie */}
      <div className="space-y-3 mb-6">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Conseil */}
      <div className="bg-navy/5 border border-navy/10 rounded-2xl p-4 mb-6 flex gap-3">
        <span className="text-navy text-lg flex-shrink-0 mt-0.5">💡</span>
        <p className="text-xs text-navy/70 leading-relaxed">
          Vous n'avez pas tout sous la main ? Pas de problème — vous pouvez entrer des
          estimations et ajuster les chiffres plus tard. Le simulateur reste valable même
          avec des données approximatives, mais le résultat sera d'autant plus fiable que
          vos données sont précises.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        type="button"
        className="w-full flex items-center justify-center gap-2.5 bg-navy text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-900 active:scale-[0.98] transition-all shadow-md"
      >
        Commencer
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
