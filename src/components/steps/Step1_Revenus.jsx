import { useState } from 'react';
import { QuestionCard } from '../ui/QuestionCard';
import { calcAbattement10 } from '../../engine/calculs';
import { ABATTEMENT } from '../../config/fiscalite';

export function Step1_Revenus({ state, dispatch, onNext, onPrev }) {
  const [touched, setTouched] = useState(false);

  const abattement = calcAbattement10(state.sni);
  const error = touched && state.sni <= 0
    ? 'Entrez votre salaire net imposable (ex : 35 000)'
    : null;

  function handleInput(raw) {
    const val = parseInt(raw.replace(/\s/g, ''), 10);
    dispatch({ type: 'SET_SNI', payload: isNaN(val) ? 0 : val });
    if (touched) setTouched(false);
  }

  function handleContinue() {
    setTouched(true);
    if (state.sni > 0) onNext();
  }

  return (
    <QuestionCard
      stepTitle="Revenus"
      questionNum={1}
      totalQuestions={1}
      question="Quel est votre salaire net imposable annuel ?"
      hint="Rubrique « Net imposable » sur votre dernière fiche de paie annuelle. C'est le montant avant abattement 10 % sur votre avis d'imposition."
      error={error}
      canContinue={state.sni > 0}
      onContinue={handleContinue}
      onBack={onPrev}
      isLast
      preview={
        state.sni > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Seuil à battre — abattement 10 %
            </p>
            <p className="text-3xl font-display font-bold text-navy">
              {abattement.montant.toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {abattement.estPlancher && 'Minimum légal appliqué (509 €).'}
              {abattement.estPlafond && 'Plafond légal atteint (14 555 €).'}
              {!abattement.estPlancher && !abattement.estPlafond &&
                `= 10 % × ${state.sni.toLocaleString('fr-FR')} €. Vos frais réels doivent dépasser ce montant pour être intéressants.`}
            </p>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.sni === 0 ? '' : state.sni.toLocaleString('fr-FR')}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="ex : 35 000"
          className={`w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-danger focus:ring-danger/20 bg-red-50'
              : 'border-gray-200 focus:border-navy focus:ring-navy/10 bg-white'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          €
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Revenus {ABATTEMENT.taux * 100 | 0} % — plafond {ABATTEMENT.plafond.toLocaleString('fr-FR')} €
      </p>
    </QuestionCard>
  );
}
