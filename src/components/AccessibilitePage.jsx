import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

function Check({ children }) {
  return (
    <li className="flex gap-2 text-sm text-gray-700">
      <CheckCircle size={15} className="text-success flex-shrink-0 mt-0.5" />
      {children}
    </li>
  );
}

function Cross({ children }) {
  return (
    <li className="flex gap-2 text-sm text-gray-700">
      <XCircle size={15} className="text-gray-300 flex-shrink-0 mt-0.5" />
      {children}
    </li>
  );
}

export function AccessibilitePage({ onHome }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

      <button
        onClick={onHome}
        type="button"
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Retour à l'accueil
      </button>

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy mb-1">
          Accessibilité
        </h2>
        <p className="text-gray-500 text-sm">
          Déclaration d'accessibilité — RGAA 4.1
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6 py-6 space-y-6">

        <div>
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">
            État de conformité
          </h3>
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-amber-500 font-bold text-sm">Non-conforme partiel</span>
            <span className="text-xs text-amber-700">Audit RGAA 4.1 non réalisé à ce jour.</span>
          </div>
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            Ce site s'efforce de respecter les bonnes pratiques d'accessibilité. Un audit complet selon
            le Référentiel Général d'Amélioration de l'Accessibilité (RGAA 4.1) n'a pas encore été conduit.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">
            Technologies utilisées
          </h3>
          <p className="text-sm text-gray-600">React 18, Tailwind CSS, HTML5 sémantique, SVG (icônes Lucide)</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">
            Points mis en place
          </h3>
          <ul className="space-y-2">
            <Check>Contrastes de couleurs suffisants (texte sur fond)</Check>
            <Check>Navigation au clavier fonctionnelle sur les formulaires</Check>
            <Check>Labels associés à chaque champ de saisie</Check>
            <Check>Design responsive — mobile, tablette et desktop</Check>
            <Check>Pas d'animation distrayante ou clignotante (hors indicateur de délai)</Check>
            <Check>Liens externes marqués (ouverture dans un nouvel onglet, rel="noopener")</Check>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">
            Points non encore vérifiés
          </h3>
          <ul className="space-y-2">
            <Cross>Compatibilité avec les lecteurs d'écran (NVDA, VoiceOver)</Cross>
            <Cross>Attributs ARIA sur les composants interactifs personnalisés</Cross>
            <Cross>Ordre de lecture logique dans toutes les vues</Cross>
            <Cross>Textes alternatifs exhaustifs pour tous les éléments visuels</Cross>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">
            Signaler un problème
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Si vous rencontrez un obstacle d'accessibilité sur ce site, merci de le signaler par email à{' '}
            <a href="mailto:orelienbertrand@gmail.com" className="text-navy hover:underline">
              orelienbertrand@gmail.com
            </a>.
            Nous nous engageons à vous répondre dans un délai raisonnable.
          </p>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Déclaration établie en avril 2026 · RGAA version 4.1
        </p>

      </div>
    </div>
  );
}
