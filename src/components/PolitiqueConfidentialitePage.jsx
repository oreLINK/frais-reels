import { ArrowLeft, Shield, BarChart2, Mail } from 'lucide-react';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={15} className="text-navy flex-shrink-0" />}
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider">{title}</h3>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed space-y-1.5 pl-5">{children}</div>
    </div>
  );
}

export function PolitiqueConfidentialitePage({ onHome }) {
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
          Politique de confidentialité
        </h2>
        <p className="text-gray-500 text-sm">
          Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679).
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-6 py-6">

        <Section icon={Shield} title="Données du simulateur">
          <p>
            <strong>Aucune donnée saisie dans le simulateur n'est collectée, transmise ou stockée.</strong>
          </p>
          <p>
            Tous les calculs s'effectuent exclusivement dans votre navigateur. Aucun serveur ne reçoit
            vos revenus, vos dépenses ou vos résultats. Aucun cookie de session ou de stockage local
            (localStorage) n'est utilisé pour les données du simulateur.
          </p>
          <p>
            Fermer l'onglet efface définitivement toutes les données saisies.
          </p>
        </Section>

        <Section icon={BarChart2} title="Analytique anonyme — GoatCounter">
          <p>
            Ce site utilise{' '}
            <a
              href="https://www.goatcounter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy hover:underline"
            >
              GoatCounter
            </a>
            , un outil d'analytique respectueux de la vie privée. GoatCounter collecte :
          </p>
          <ul className="space-y-1 mt-1 list-disc list-inside text-gray-600">
            <li>La page visitée et l'heure de visite</li>
            <li>Le type de navigateur et la résolution d'écran</li>
            <li>Le pays d'origine (dérivé de l'IP, <strong>non stockée</strong>)</li>
          </ul>
          <p className="mt-1.5">
            GoatCounter <strong>n'utilise pas de cookie</strong>, ne collecte aucune donnée permettant
            d'identifier une personne physique et est conforme au RGPD sans nécessiter de bandeau de
            consentement.
          </p>
          <p>
            Vous pouvez consulter sa politique de confidentialité et vous désabonner sur{' '}
            <a
              href="https://www.goatcounter.com/help/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy hover:underline"
            >
              goatcounter.com/help/privacy
            </a>.
          </p>
        </Section>

        <Section icon={Mail} title="Vos droits RGPD">
          <p>
            Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression,
            limitation du traitement et portabilité de vos données.
          </p>
          <p>
            <span className="font-medium">Responsable de traitement :</span> Aurélien Bertrand
          </p>
          <p>
            Pour exercer vos droits :{' '}
            <a href="mailto:orelienbertrand@gmail.com" className="text-navy hover:underline">
              orelienbertrand@gmail.com
            </a>
          </p>
          <p className="text-gray-500">
            En l'absence de données personnelles collectées par ce site, le seul traitement relevant
            est celui effectué par GoatCounter (voir ci-dessus).
          </p>
        </Section>

        <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          Dernière mise à jour : avril 2026
        </p>

      </div>
    </div>
  );
}
