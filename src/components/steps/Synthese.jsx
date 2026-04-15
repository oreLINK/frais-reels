import { ChevronLeft, CheckCircle2, AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';
import { calcSynthese } from '../../engine/calculs';
import { Jauge } from '../ui/Jauge';
import { ExportBlock } from '../ui/ExportBlock';
import { SourceLegale } from '../ui/SourceLegale';
import { TEXTES, ANNEE_REVENUS } from '../../config/fiscalite';

// ─── Ligne de détail ───────────────────────────────────────────────────────────
const LIGNE = ({ label, montant, securise, nonZero }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-2.5">
      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
        montant === 0 ? 'bg-gray-200' : securise ? 'bg-success' : 'bg-amber-400'
      }`} />
      <span className="text-sm sm:text-base text-gray-600">{label}</span>
    </div>
    <span className={`text-sm sm:text-base font-bold ${
      montant === 0 ? 'text-gray-400' : securise ? 'text-success' : 'text-amber-500'
    }`}>
      {montant > 0 ? `${montant.toLocaleString('fr-FR')} €` : '—'}
    </span>
  </div>
);

// ─── Case à remplir (bloc navy) ────────────────────────────────────────────────
function CaseDeclaration({ titre, caseCode, montant, note }) {
  return (
    <div className="bg-navy text-white rounded-2xl p-5 sm:p-6 mb-4">
      <p className="text-xs sm:text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2">{titre}</p>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-3xl sm:text-4xl font-display font-bold leading-tight">{caseCode}</p>
          <p className="text-xs sm:text-sm text-blue-300 mt-1 leading-relaxed">{note}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl sm:text-3xl font-bold tabular-nums">{montant.toLocaleString('fr-FR')} €</p>
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export function Synthese({ state, onPrev }) {
  const synthese = calcSynthese(state);
  const { recommendation, fraisReelsTotal, abattement10, economie, allJustifs } = synthese;

  // Justificatifs manquants (pour scénario C)
  const manquants = [];
  if (synthese.totalTransport > 0 && !state.justif_transport) manquants.push('Transports');
  if (synthese.totalRepas > 0 && !state.justif_repas) manquants.push('Repas');
  if (synthese.totalLogement > 0 && !state.justif_logement) manquants.push('Logement');
  if (synthese.totalMateriel > 0 && !state.justif_materiel) manquants.push('Matériel');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

      {/* Navigation retour */}
      <button
        onClick={onPrev}
        type="button"
        className="flex items-center gap-1 text-sm sm:text-base text-gray-500 hover:text-navy transition-colors mb-6"
      >
        <ChevronLeft size={18} /> Modifier mes réponses
      </button>

      <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy mb-1">Votre synthèse</h2>
      <p className="text-sm sm:text-base text-gray-500 mb-6">Revenus {ANNEE_REVENUS}</p>

      {/* ── Jauge comparative ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-navy/60 uppercase tracking-wider mb-3">
          Comparaison des deux options
        </h3>
        <Jauge
          label1="Frais réels total"
          montant1={fraisReelsTotal}
          label2="Abattement 10 %"
          montant2={abattement10}
        />
      </div>

      {/* ── SCÉNARIO A — Abattement plus avantageux ───────────────── */}
      {recommendation === 'abattement' && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="text-success flex-shrink-0" size={22} />
              <h3 className="font-bold text-green-800 text-base">Abattement 10 % recommandé</h3>
            </div>
            <p className="text-sm text-green-700 leading-relaxed">
              L'abattement forfaitaire ({abattement10.toLocaleString('fr-FR')} €) est plus
              avantageux que vos frais réels ({fraisReelsTotal.toLocaleString('fr-FR')} €).
            </p>
            <p className="text-xs text-green-600 mt-2 font-medium">
              Bonne nouvelle — cette déduction s'applique automatiquement, aucune démarche
              supplémentaire n'est nécessaire.
            </p>
          </div>

          <CaseDeclaration
            titre="Ce que vous déclarez"
            caseCode="Rien de spécial"
            montant={state.sni - abattement10}
            note={`Revenu imposable · SNI ${state.sni.toLocaleString('fr-FR')} € − abattement ${abattement10.toLocaleString('fr-FR')} €`}
          />
        </>
      )}

      {/* ── SCÉNARIO B — Frais réels + dossier complet ───────────── */}
      {recommendation === 'frais_reels' && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="text-success flex-shrink-0" size={22} />
              <h3 className="font-bold text-green-800 text-base">Frais réels recommandés — dossier complet</h3>
            </div>
            <p className="text-sm text-green-700 leading-relaxed">
              Vos frais réels ({fraisReelsTotal.toLocaleString('fr-FR')} €) dépassent
              l'abattement forfaitaire ({abattement10.toLocaleString('fr-FR')} €) de{' '}
              <strong>{(fraisReelsTotal - abattement10).toLocaleString('fr-FR')} €</strong>.
            </p>
            {economie > 0 && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                Économie estimée : ~{economie.toLocaleString('fr-FR')} € (estimation à 30 % de TMI)
              </p>
            )}
          </div>

          <CaseDeclaration
            titre="Case à remplir sur votre déclaration"
            caseCode={TEXTES.caseDeclaration}
            montant={synthese.fraisSecurisesTotal}
            note="Traitements et salaires — frais réels"
          />
          <SourceLegale refKeys={TEXTES.ref.caseDeclaration} />
        </>
      )}

      {/* ── SCÉNARIO C — Frais réels > abattement mais justifs manquants ── */}
      {recommendation === 'abattement_prudence' && (
        <>
          {/* Recommandation immédiate : abattement */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={22} />
              <h3 className="font-bold text-amber-800 text-base">Abattement 10 % recommandé (prudence)</h3>
            </div>
            <p className="text-sm text-amber-700 leading-relaxed">
              Vos frais réels ({fraisReelsTotal.toLocaleString('fr-FR')} €) dépassent
              théoriquement l'abattement ({abattement10.toLocaleString('fr-FR')} €), mais
              certains justificatifs sont manquants.
            </p>
            {manquants.length > 0 && (
              <p className="text-xs text-amber-600 mt-2">
                Justificatifs absents : <strong>{manquants.join(', ')}</strong>
              </p>
            )}
            <p className="text-xs text-amber-700 mt-2 border-t border-amber-200 pt-2">
              Sans dossier complet, l'administration peut rejeter la déduction et appliquer
              des pénalités. Pour cette année, l'abattement est la solution sûre.
            </p>
          </div>

          {/* Projection année prochaine */}
          <div className="bg-navy/5 border border-navy/10 rounded-2xl p-4 mb-4 flex gap-3">
            <ArrowRight className="text-navy flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-navy">
                Pour l'année prochaine : préparez votre dossier dès maintenant
              </p>
              <p className="text-xs text-navy/70 mt-1 leading-relaxed">
                Conservez TOUS vos justificatifs {ANNEE_REVENUS + 1} au fil de l'eau
                (tickets, factures, relevés). Si vous reconstituez le même dossier l'an prochain,
                vous pourriez économiser ~{Math.round((fraisReelsTotal - abattement10) * 0.30).toLocaleString('fr-FR')} €.
              </p>
              <p className="text-xs text-navy/50 mt-1.5">
                Justificatifs à rassembler : {manquants.join(', ')}
              </p>
            </div>
          </div>

          <CaseDeclaration
            titre="Cette année — rien de spécial"
            caseCode="Abattement auto"
            montant={state.sni - abattement10}
            note={`Revenu imposable · SNI ${state.sni.toLocaleString('fr-FR')} € − abattement ${abattement10.toLocaleString('fr-FR')} €`}
          />
        </>
      )}

      {/* ── Détail par poste (toujours visible) ─────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-navy/60 uppercase tracking-wider mb-3">
          Détail de vos frais réels
        </h3>
        <LIGNE label="Transport" montant={synthese.totalTransport} securise={state.justif_transport} />
        <LIGNE label="Repas" montant={synthese.totalRepas} securise={state.justif_repas} />
        <LIGNE label="Logement / télétravail" montant={synthese.totalLogement} securise={state.justif_logement} />
        <LIGNE label="Matériel & abonnements" montant={synthese.totalMateriel} securise={state.justif_materiel} />
        <div className="flex justify-between pt-3 mt-1">
          <span className="font-bold text-navy text-base sm:text-lg">Total frais réels</span>
          <span className="font-bold text-navy text-lg sm:text-xl">
            {fraisReelsTotal.toLocaleString('fr-FR')} €
          </span>
        </div>
        {!allJustifs && synthese.fraisRisquesTotal > 0 && (
          <p className="text-sm text-amber-600 mt-2 pt-2 border-t border-gray-100">
            ⚠ dont {synthese.fraisRisquesTotal.toLocaleString('fr-FR')} € sans justificatifs (indicateurs en orange)
          </p>
        )}
      </div>

      {/* Avertissement contrôle fiscal (si frais réels choisis) */}
      {recommendation === 'frais_reels' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
          <AlertTriangle className="text-danger flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs text-red-700 leading-relaxed">
              {TEXTES.avertissementControle}
            </p>
            <SourceLegale refKeys={TEXTES.ref.avertissementControle} />
          </div>
        </div>
      )}

      {/* ── Export ───────────────────────────────────────────────── */}
      <ExportBlock state={state} synthese={synthese} />
    </div>
  );
}
