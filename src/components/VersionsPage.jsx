import { ArrowLeft, Tag } from 'lucide-react';

const VERSION = '2026.4.1';

const FEATURES = [
  {
    category: "Page d'accueil",
    items: [
      "Section explicative abattement forfaitaire 10 % vs frais réels, avec montants fiscaux dynamiques (plafond 14 555 €, plancher 509 €)",
      "Encadré « Déclaration en cours » avec dates officielles 2026 par zone géographique",
      "Compte à rebours J−N coloré (vert / orange / rouge) par date limite",
      "Recherche de zone par numéro de département",
      "Encart sanctions fiscales avec sources légales (art. 1728 et 1727 CGI)",
    ],
  },
  {
    category: "Checklist documentaire",
    items: [
      "5 catégories dépliables : Revenus, Transports, Repas, Logement, Matériel",
      "Documents requis et optionnels par catégorie",
    ],
  },
  {
    category: "Simulateur — Étape 1 · Revenus",
    items: [
      "Saisie du salaire net imposable (SNI)",
      "Calcul automatique de l'abattement 10 % (plancher 509 €, plafond 14 555 €)",
    ],
  },
  {
    category: "Simulateur — Étape 2 · Transports",
    items: [
      "Barème kilométrique voiture / moto / cyclo avec choix de puissance fiscale",
      "Majoration +20 % pour les véhicules 100 % électriques",
      "Saisie des jours travaillés sur site et de la distance aller",
      "Alerte et justification obligatoire au-delà de 40 km (art. 83 CGI)",
      "Prise en compte des péages et du stationnement",
    ],
  },
  {
    category: "Simulateur — Étape 3 · Repas",
    items: [
      "Coût réel du repas et nombre de jours hors domicile",
      "Déduction de la part ticket restaurant patronale",
      "Plafond légal à 21,10 € / repas et valeur domicile 5,45 €",
    ],
  },
  {
    category: "Simulateur — Étape 4 · Logement / Télétravail",
    items: [
      "Saisie de la surface totale du logement et de la surface dédiée au bureau",
      "Proratisation automatique du loyer / emprunt, EDF/gaz, taxe foncière, charges de copropriété",
    ],
  },
  {
    category: "Simulateur — Étape 5 · Matériel",
    items: [
      "Équipements > 500 € : amortissement linéaire sur 3 ans (art. 83 CGI)",
      "Équipements < 500 € : déduction immédiate",
      "Abonnements internet et téléphone avec pourcentage d'usage professionnel",
    ],
  },
  {
    category: "Synthèse",
    items: [
      "3 scénarios de recommandation : abattement forfaitaire, frais réels, prudence (dossier incomplet)",
      "Jauge comparative visuelle abattement vs frais réels",
      "Détail des déductions par catégorie",
      "Export PDF complet horodaté",
      "Copie du résumé en texte plain-text",
      "Sources légales dépliables (Légifrance, BOFiP, impots.gouv.fr)",
    ],
  },
  {
    category: "Technique",
    items: [
      "100 % local — aucune donnée transmise, tous les calculs dans le navigateur",
      "Analytique anonyme via GoatCounter (sans cookie, sans données personnelles)",
    ],
  },
];

export function VersionsPage({ onHome }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

      {/* Back */}
      <button
        onClick={onHome}
        type="button"
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Retour à l'accueil
      </button>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy mb-1">
          Versions
        </h2>
        <p className="text-gray-500 text-sm">
          Historique des fonctionnalités et améliorations.
        </p>
      </div>

      {/* Version block */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Version header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-navy/3">
          <span className="flex items-center gap-1.5 bg-navy text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <Tag size={11} />
            v{VERSION}
          </span>
          <span className="text-sm font-semibold text-gray-700">Avril 2026</span>
          <span className="ml-auto text-xs text-gray-400">Version initiale</span>
        </div>

        {/* Features list */}
        <div className="divide-y divide-gray-50">
          {FEATURES.map(({ category, items }) => (
            <div key={category} className="px-5 py-4">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-2.5">
                {category}
              </h3>
              <ul className="space-y-1.5">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="flex-shrink-0 text-success mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
