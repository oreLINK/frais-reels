import { ChevronLeft, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { calcSynthese } from '../../engine/calculs';
import { Jauge } from '../ui/Jauge';
import { ExportBlock } from '../ui/ExportBlock';
import { SourceLegale } from '../ui/SourceLegale';
import { TEXTES } from '../../config/fiscalite';

const LIGNE = ({ label, montant, securise }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`text-sm font-bold ${securise ? 'text-success' : 'text-danger'}`}>
      {montant > 0 ? `${montant.toLocaleString('fr-FR')} €` : '—'}
    </span>
  </div>
);

export function Synthese({ state, onPrev }) {
  const synthese = calcSynthese(state);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Navigation retour */}
      <button
        onClick={onPrev}
        type="button"
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-navy transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Modifier mes réponses
      </button>

      <h2 className="text-2xl font-display font-bold text-navy mb-1">
        Votre synthèse
      </h2>
      <p className="text-sm text-gray-500 mb-6">Revenus 2025 · Déclaration {new Date().getFullYear()}</p>

      {/* Jauge comparaison */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h3 className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-3">
          Frais réels vs abattement 10 %
        </h3>
        <Jauge
          label1="Frais sécurisés"
          montant1={synthese.fraisSecurisesTotal}
          label2="Abattement 10 %"
          montant2={synthese.abattement10}
        />
      </div>

      {/* Verdict */}
      <div className={`rounded-2xl p-5 mb-4 border ${
        synthese.superieurAbattement
          ? 'bg-green-50 border-green-200'
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          {synthese.superieurAbattement
            ? <TrendingUp className="text-success" size={20} />
            : <TrendingDown className="text-amber-500" size={20} />
          }
          <h3 className={`font-bold ${synthese.superieurAbattement ? 'text-green-800' : 'text-amber-800'}`}>
            {synthese.superieurAbattement ? 'Option frais réels recommandée' : 'Abattement 10 % plus avantageux'}
          </h3>
        </div>
        <p className={`text-sm ${synthese.superieurAbattement ? 'text-green-700' : 'text-amber-700'}`}>
          {synthese.verdict}
        </p>
        {synthese.superieurAbattement && synthese.economie > 0 && (
          <p className="text-xs text-green-600 mt-1.5 font-medium">
            Économie estimée : ~{synthese.economie.toLocaleString('fr-FR')} € (estimation à 30 % de TMI)
          </p>
        )}
      </div>

      {/* Frais à risque */}
      {synthese.fraisRisquesTotal > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
          <AlertTriangle className="text-danger flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-bold text-danger">
              {synthese.fraisRisquesTotal.toLocaleString('fr-FR')} € de frais sans justificatifs
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              {TEXTES.avertissementControle}
            </p>
            <SourceLegale refKeys={TEXTES.ref.avertissementControle} />
          </div>
        </div>
      )}

      {/* Détail par poste */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h3 className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-3">
          Détail des frais
        </h3>
        <LIGNE label="Transport" montant={synthese.totalTransport} securise={state.justif_transport} />
        <LIGNE label="Repas" montant={synthese.totalRepas} securise={state.justif_repas} />
        <LIGNE label="Logement / télétravail" montant={synthese.totalLogement} securise={state.justif_logement} />
        <LIGNE label="Matériel & abonnements" montant={synthese.totalMateriel} securise={state.justif_materiel} />
        <div className="flex justify-between pt-3 mt-1">
          <span className="font-bold text-navy">Total sécurisé</span>
          <span className="font-bold text-success text-lg">
            {synthese.fraisSecurisesTotal.toLocaleString('fr-FR')} €
          </span>
        </div>
      </div>

      {/* Case 1AK */}
      <div className="bg-navy text-white rounded-2xl p-5 mb-4">
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
          Case à remplir sur votre déclaration
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-display font-bold">{TEXTES.caseDeclaration}</p>
            <p className="text-xs text-blue-300 mt-0.5">Traitements et salaires – frais réels</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums">
              {synthese.fraisSecurisesTotal.toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>
        <SourceLegale refKeys={TEXTES.ref.caseDeclaration} />
      </div>

      {/* Export */}
      <ExportBlock state={state} synthese={synthese} />
    </div>
  );
}
