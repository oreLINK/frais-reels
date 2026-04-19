import { useState } from 'react';
import { QuestionCard } from '../ui/QuestionCard';
import { CheckboxJustif } from '../ui/CheckboxJustif';
import { SourceLegale } from '../ui/SourceLegale';
import { calcRepas } from '../../engine/calculs';
import { REPAS } from '../../config/fiscalite';

export function Step3_Repas({ state, dispatch, onNext, onPrev }) {
  const [qIdx, setQIdx] = useState(0);
  const [touched, setTouched] = useState(false);

  const repas = calcRepas(
    state.typeRepas, state.coutRepas, state.joursRepas,
    state.aTicketResto, state.aTicketResto ? state.partPatronale : 0
  );

  const questions = [
    'typeRepas',
    'coutRepas',   // toujours demandé : la règle légale est identique pour cantine et restaurant
    'joursRepas',
    'ticketsResto',
    ...(state.aTicketResto ? ['partPatronale'] : []),
    'justif',
  ];

  const safeIdx = Math.min(qIdx, questions.length - 1);
  const currentQ = questions[safeIdx];
  const isLast = safeIdx === questions.length - 1;
  const total = questions.length;

  function canProceed() {
    if (currentQ === 'joursRepas') return state.joursRepas > 0;
    if (currentQ === 'coutRepas') return state.coutRepas > 0;
    return true;
  }

  function getError() {
    if (!touched) return null;
    if (currentQ === 'joursRepas' && state.joursRepas <= 0)
      return 'Entrez le nombre de jours (ex : 200)';
    if (currentQ === 'coutRepas' && state.coutRepas <= 0)
      return 'Entrez le coût moyen d\'un repas (ex : 12)';
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
    stepTitle: 'Repas',
    questionNum: safeIdx + 1,
    totalQuestions: total,
    onBack: goBack,
    onContinue: tryGoNext,
    canContinue: canProceed(),
    isLast,
    error: getError(),
  };

  // ——— QUESTION : type de repas ———
  if (currentQ === 'typeRepas') return (
    <QuestionCard
      {...cardProps}
      question="Où prenez-vous votre repas de midi ?"
      hint="Le mode de calcul diffère selon que vous allez au restaurant ou à la cantine d'entreprise."
    >
      <div className="grid grid-cols-2 gap-3 mt-2">
        {[
          { value: 'restaurant', label: 'Restaurant', icon: '🍽️', desc: 'Déduction du coût réel' },
          { value: 'cantine', label: 'Cantine', icon: '🏢', desc: 'Prix réel − forfait domicile' },
        ].map(({ value, label, icon, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => dispatch({ type: 'SET_TYPE_REPAS', payload: value })}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              state.typeRepas === value
                ? 'border-navy bg-navy text-white shadow-md'
                : 'border-gray-200 bg-white hover:border-navy/40'
            }`}
          >
            <div className="text-3xl mb-1">{icon}</div>
            <div className="text-sm font-semibold">{label}</div>
            <div className={`text-xs mt-0.5 ${state.typeRepas === value ? 'text-blue-200' : 'text-gray-400'}`}>
              {desc}
            </div>
          </button>
        ))}
      </div>
    </QuestionCard>
  );

  // ——— QUESTION : coût moyen repas (cantine ou restaurant) ———
  if (currentQ === 'coutRepas') return (
    <QuestionCard
      {...cardProps}
      question={state.typeRepas === 'cantine'
        ? 'Quel est le prix moyen que vous payez à la cantine ?'
        : 'Quel est le coût moyen d\'un repas au restaurant ?'}
      hint={state.typeRepas === 'cantine'
        ? `Prix effectivement débité (part salariale après subvention employeur). La déduction légale est : prix payé − ${REPAS.forfaitDomicile} € (forfait repas domicile), dans la limite de ${REPAS.plafondExcessif} €.`
        : `Montant réellement payé, ticket ou facture à l'appui. Déduction plafonnée à ${REPAS.plafondExcessif} € (coût excessif au-delà).`}
      preview={
        state.coutRepas > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Déduction par repas
            </p>
            <p className="text-2xl font-bold text-navy">
              {repas.deductionUnitaire.toFixed(2)} €
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              min({state.coutRepas} €, {REPAS.plafondExcessif} €) − {REPAS.forfaitDomicile} € (forfait repas domicile)
            </p>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={state.coutRepas === 0 ? '' : state.coutRepas}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            dispatch({ type: 'SET_COUT_REPAS', payload: isNaN(v) ? 0 : v });
            if (touched) setTouched(false);
          }}
          onBlur={() => setTouched(true)}
          placeholder="ex : 12"
          className={`w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
            getError()
              ? 'border-danger focus:ring-danger/20 bg-red-50'
              : 'border-gray-200 focus:border-navy focus:ring-navy/10 bg-white'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          €
        </span>
      </div>
      <SourceLegale refKeys={REPAS.ref} />
    </QuestionCard>
  );

  // ——— QUESTION : nombre de jours ———
  if (currentQ === 'joursRepas') return (
    <QuestionCard
      {...cardProps}
      question="Combien de jours avez-vous déjeuné sur votre lieu de travail ?"
      hint="Jours par an où vous avez payé un repas à l'extérieur (hors télétravail, congés)."
      preview={
        state.joursRepas > 0 && repas.deductionUnitaire > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Déduction repas estimée
            </p>
            <p className="text-2xl font-bold text-navy">
              {repas.totalNet.toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {state.joursRepas} jours × {repas.deductionUnitaire.toFixed(2)} €/repas
            </p>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.joursRepas === 0 ? '' : state.joursRepas}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_JOURS_REPAS', payload: isNaN(v) ? 0 : Math.min(365, v) });
            if (touched) setTouched(false);
          }}
          onBlur={() => setTouched(true)}
          placeholder="ex : 200"
          className={`w-full text-2xl font-semibold px-5 py-4 pr-16 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
            getError()
              ? 'border-danger focus:ring-danger/20 bg-red-50'
              : 'border-gray-200 focus:border-navy focus:ring-navy/10 bg-white'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold pointer-events-none">
          jours
        </span>
      </div>
    </QuestionCard>
  );

  // ——— QUESTION : tickets restaurant ———
  if (currentQ === 'ticketsResto') return (
    <QuestionCard
      {...cardProps}
      question="Avez-vous des tickets restaurant ?"
      hint="La part patronale de vos tickets restaurant vient réduire votre déduction repas."
    >
      <div className="grid grid-cols-2 gap-3 mt-2">
        {[
          { value: true, label: 'Oui', icon: '🎟️' },
          { value: false, label: 'Non', icon: '✗' },
        ].map(({ value, label, icon }) => (
          <button
            key={String(value)}
            type="button"
            onClick={() => dispatch({ type: 'SET_A_TICKET_RESTO', payload: value })}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              state.aTicketResto === value
                ? 'border-navy bg-navy text-white shadow-md'
                : 'border-gray-200 bg-white hover:border-navy/40'
            }`}
          >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-sm font-semibold">{label}</div>
          </button>
        ))}
      </div>
    </QuestionCard>
  );

  // ——— QUESTION : part patronale ———
  if (currentQ === 'partPatronale') return (
    <QuestionCard
      {...cardProps}
      question="Quel est le montant annuel de la part patronale de vos tickets restaurant ?"
      hint="Part prise en charge par votre employeur. Visible sur votre bulletin de paie. À déduire de vos frais de repas."
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.partPatronale === 0 ? '' : state.partPatronale}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_PART_PATRONALE', payload: isNaN(v) ? 0 : v });
          }}
          placeholder="ex : 500"
          className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          €
        </span>
      </div>
    </QuestionCard>
  );

  // ——— QUESTION : justificatifs ———
  if (currentQ === 'justif') return (
    <QuestionCard
      {...cardProps}
      question="Avez-vous vos justificatifs de repas ?"
      hint="Conservez tickets de caisse, notes de restaurant datées, ou relevés de badge cantine."
      preview={
        <div>
          <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
            Total repas
          </p>
          <p className="text-2xl font-bold text-navy">
            {repas.totalNet.toLocaleString('fr-FR')} €
          </p>
        </div>
      }
    >
      <CheckboxJustif
        label="Oui, j'ai mes justificatifs repas"
        description={
          state.typeRepas === 'cantine'
            ? 'Relevés badge cantine nominatifs'
            : 'Notes de restaurant datées et nominatives'
        }
        checked={state.justif_repas}
        onChange={(val) => dispatch({ type: 'SET_JUSTIF_REPAS', payload: val })}
      />
    </QuestionCard>
  );

  return null;
}
