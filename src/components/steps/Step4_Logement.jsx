import { useState } from 'react';
import { QuestionCard } from '../ui/QuestionCard';
import { CheckboxJustif } from '../ui/CheckboxJustif';
import { SourceLegale } from '../ui/SourceLegale';
import { calcLogement } from '../../engine/calculs';
import { TELETRAVAIL } from '../../config/fiscalite';

const CHARGES = [
  { key: 'loyer',        label: 'Loyer annuel (ou mensualité × 12)',     placeholder: 'ex : 10 800', hint: 'Loyer mensuel × 12. Propriétaire : mettez 0.' },
  { key: 'interets',     label: 'Intérêts d\'emprunt annuels',           placeholder: 'ex : 2 400',  hint: 'Intérêts du prêt immobilier si propriétaire. Mettez 0 si locataire.' },
  { key: 'edf',          label: 'Électricité annuelle',                   placeholder: 'ex : 800',    hint: null },
  { key: 'gaz',          label: 'Gaz annuel',                             placeholder: 'ex : 400',    hint: null },
  { key: 'taxeFonciere', label: 'Taxe foncière annuelle',                 placeholder: 'ex : 600',    hint: 'Locataire : mettez 0.' },
  { key: 'copro',        label: 'Charges de copropriété annuelles',       placeholder: 'ex : 1 200',  hint: 'Mettez 0 si maison individuelle.' },
];

export function Step4_Logement({ state, dispatch, onNext, onPrev }) {
  const [qIdx, setQIdx] = useState(0);
  const [touched, setTouched] = useState(false);

  const logement = calcLogement(state.surfaceTotale, state.surfaceBureau, state.charges);

  const questions = [
    'surfaceTotale',
    'surfaceBureau',
    ...CHARGES.map((c) => c.key),
    'justif',
  ];

  const safeIdx = Math.min(qIdx, questions.length - 1);
  const currentQ = questions[safeIdx];
  const isLast = safeIdx === questions.length - 1;
  const total = questions.length;

  function canProceed() {
    if (currentQ === 'surfaceTotale') return state.surfaceTotale > 0;
    if (currentQ === 'surfaceBureau')
      return state.surfaceBureau > 0 && state.surfaceBureau < state.surfaceTotale;
    return true;
  }

  function getError() {
    if (!touched) return null;
    if (currentQ === 'surfaceTotale' && state.surfaceTotale <= 0)
      return 'Entrez la surface totale en m² (ex : 65)';
    if (currentQ === 'surfaceBureau') {
      if (state.surfaceBureau <= 0) return 'Entrez la surface du bureau en m² (ex : 9)';
      if (state.surfaceBureau >= state.surfaceTotale)
        return 'La surface du bureau doit être inférieure à la surface totale';
    }
    return null;
  }

  function goNext() {
    setTouched(false);
    if (isLast) return onNext();
    setQIdx(safeIdx + 1);
  }

  function tryGoNext() {
    if (!canProceed()) { setTouched(true); return; }
    goNext();
  }

  function goBack() {
    setTouched(false);
    if (safeIdx === 0) return onPrev();
    setQIdx(safeIdx - 1);
  }

  const cardProps = {
    stepTitle: 'Logement',
    questionNum: safeIdx + 1,
    totalQuestions: total,
    onBack: goBack,
    onContinue: tryGoNext,
    canContinue: canProceed(),
    isLast,
    error: getError(),
  };

  // ——— Surface totale ———
  if (currentQ === 'surfaceTotale') return (
    <QuestionCard
      {...cardProps}
      question="Quelle est la surface habitable totale de votre logement ?"
      hint="En m², telle que mentionnée dans votre bail ou acte de propriété."
      preview={
        <div>
          <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
            Forfait alternatif (télétravail)
          </p>
          <p className="text-sm text-gray-700">
            Si vous préférez la simplicité : <strong>{TELETRAVAIL.forfaitJour} €/jour</strong> de télétravail
            <br />
            <span className="text-xs text-gray-500">
              Exemple : 100 j × {TELETRAVAIL.forfaitJour} € = {(100 * TELETRAVAIL.forfaitJour).toLocaleString('fr-FR')} €
            </span>
          </p>
          <SourceLegale refKeys={TELETRAVAIL.ref} />
        </div>
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.surfaceTotale === 0 ? '' : state.surfaceTotale}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_SURFACE_TOTALE', payload: isNaN(v) ? 0 : v });
            if (touched) setTouched(false);
          }}
          onBlur={() => setTouched(true)}
          placeholder="ex : 65"
          className={`w-full text-2xl font-semibold px-5 py-4 pr-12 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
            getError()
              ? 'border-danger focus:ring-danger/20 bg-red-50'
              : 'border-gray-200 focus:border-navy focus:ring-navy/10 bg-white'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold pointer-events-none">
          m²
        </span>
      </div>
    </QuestionCard>
  );

  // ——— Surface bureau ———
  if (currentQ === 'surfaceBureau') return (
    <QuestionCard
      {...cardProps}
      question="Quelle est la surface de votre bureau professionnel ?"
      hint="Espace dédié exclusivement au travail (pièce ou coin bureau délimité). Ce ratio détermine la part déductible de vos charges."
      preview={
        state.surfaceTotale > 0 && state.surfaceBureau > 0 && state.surfaceBureau < state.surfaceTotale && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Ratio de déduction
            </p>
            <p className="text-2xl font-bold text-navy">
              {((state.surfaceBureau / state.surfaceTotale) * 100).toFixed(1)} %
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {state.surfaceBureau} m² ÷ {state.surfaceTotale} m²
            </p>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.surfaceBureau === 0 ? '' : state.surfaceBureau}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_SURFACE_BUREAU', payload: isNaN(v) ? 0 : v });
            if (touched) setTouched(false);
          }}
          onBlur={() => setTouched(true)}
          placeholder="ex : 9"
          className={`w-full text-2xl font-semibold px-5 py-4 pr-12 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
            getError()
              ? 'border-danger focus:ring-danger/20 bg-red-50'
              : 'border-gray-200 focus:border-navy focus:ring-navy/10 bg-white'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold pointer-events-none">
          m²
        </span>
      </div>
    </QuestionCard>
  );

  // ——— Charges (loyer, edf, gaz, taxe, copro) ———
  const chargeConfig = CHARGES.find((c) => c.key === currentQ);
  if (chargeConfig) {
    const ratio = state.surfaceTotale > 0 ? (state.surfaceBureau / state.surfaceTotale) : 0;
    const valeur = state.charges[chargeConfig.key];
    const montantPro = Math.round(ratio * valeur);

    return (
      <QuestionCard
        {...cardProps}
        question={chargeConfig.label}
        hint={chargeConfig.hint || 'Montant annuel total du foyer. Seule la part proratisée à votre bureau sera déduite.'}
        preview={
          valeur > 0 && ratio > 0 && (
            <div>
              <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
                Part déductible ({(ratio * 100).toFixed(1)} %)
              </p>
              <p className="text-2xl font-bold text-navy">
                {montantPro.toLocaleString('fr-FR')} €
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {(ratio * 100).toFixed(1)} % × {valeur.toLocaleString('fr-FR')} €
              </p>
            </div>
          )
        }
      >
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={valeur === 0 ? '' : valeur}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              dispatch({ type: 'SET_CHARGE', key: chargeConfig.key, payload: isNaN(v) ? 0 : v });
            }}
            placeholder={chargeConfig.placeholder}
            className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
            €
          </span>
        </div>
      </QuestionCard>
    );
  }

  // ——— Justificatifs ———
  if (currentQ === 'justif') return (
    <QuestionCard
      {...cardProps}
      question="Avez-vous vos justificatifs logement ?"
      hint="L'administration exige des preuves documentées pour chaque charge déduite."
      preview={
        <div>
          <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
            Déduction logement estimée
          </p>
          <p className="text-2xl font-bold text-navy">
            {logement.totalLogement.toLocaleString('fr-FR')} €
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {logement.ratio.toFixed(1)} % × charges annuelles
          </p>
        </div>
      }
    >
      <CheckboxJustif
        label="Oui, j'ai mes justificatifs logement"
        description="Bail ou titre de propriété · Factures EDF/Gaz · Photo du bureau dédié"
        checked={state.justif_logement}
        onChange={(val) => dispatch({ type: 'SET_JUSTIF_LOGEMENT', payload: val })}
      />
    </QuestionCard>
  );

  return null;
}
