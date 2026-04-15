import { useState } from 'react';
import { QuestionCard } from '../ui/QuestionCard';
import { AlertBox } from '../ui/AlertBox';
import { CheckboxJustif } from '../ui/CheckboxJustif';
import { SourceLegale } from '../ui/SourceLegale';
import { calcBaremeKm } from '../../engine/calculs';
import { LIMITE_DISTANCE_ALLER_KM, MAJORATION_ELECTRIQUE, BAREME_KM } from '../../config/fiscalite';

const PUISSANCES = {
  voiture: [
    { label: '3 CV', value: '3CV' },
    { label: '4 CV', value: '4CV' },
    { label: '5 CV', value: '5CV' },
    { label: '6 CV', value: '6CV' },
    { label: '7 CV et +', value: '7CV+' },
  ],
  moto: [
    { label: '1-2 CV', value: '1-2CV' },
    { label: '3-5 CV', value: '3-5CV' },
    { label: '5 CV+', value: '5CV+' },
  ],
};

export function Step2_Deplacements({ state, dispatch, onNext, onPrev }) {
  const [qIdx, setQIdx] = useState(0);
  const [touched, setTouched] = useState(false);

  const transport = calcBaremeKm(
    state.typeVehicule, state.puissance,
    state.distanceAller, state.joursTravailSite, state.estElectrique
  );
  const totalTransport = transport.montantKm + state.peages + state.parking;

  // Liste de questions active (puissance ignorée pour cyclo)
  const questions = [
    'typeVehicule',
    ...(state.typeVehicule !== 'cyclo' ? ['puissance'] : []),
    'electrique',
    'distance',
    'jours',
    'peages',
    'parking',
    'justif',
  ];

  const safeIdx = Math.min(qIdx, questions.length - 1);
  const currentQ = questions[safeIdx];
  const isLast = safeIdx === questions.length - 1;
  const total = questions.length;

  function canProceed() {
    if (currentQ === 'distance') return state.distanceAller > 0;
    if (currentQ === 'jours') return state.joursTravailSite > 0;
    return true;
  }

  function getError() {
    if (!touched) return null;
    if (currentQ === 'distance' && state.distanceAller <= 0)
      return 'Entrez la distance aller en km (ex : 12)';
    if (currentQ === 'jours' && state.joursTravailSite <= 0)
      return 'Entrez le nombre de jours (ex : 220)';
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
    stepTitle: 'Transports',
    questionNum: safeIdx + 1,
    totalQuestions: total,
    onBack: goBack,
    onContinue: tryGoNext,
    canContinue: canProceed(),
    isLast,
    error: getError(),
  };

  // ——— QUESTION : type de véhicule ———
  if (currentQ === 'typeVehicule') return (
    <QuestionCard
      {...cardProps}
      question="Quel véhicule utilisez-vous pour aller au travail ?"
      hint="Le type de véhicule détermine quel barème kilométrique s'applique."
    >
      <div className="grid grid-cols-3 gap-3 mt-2">
        {[
          { value: 'voiture', label: 'Voiture', icon: '🚗' },
          { value: 'moto', label: 'Moto', icon: '🏍️' },
          { value: 'cyclo', label: 'Cyclo', icon: '🛵' },
        ].map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => { dispatch({ type: 'SET_TYPE_VEHICULE', payload: value }); goNext(); }}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              state.typeVehicule === value
                ? 'border-navy bg-navy text-white shadow-md'
                : 'border-gray-200 bg-white hover:border-navy/40 hover:bg-slate-50'
            }`}
          >
            <div className="text-3xl mb-1">{icon}</div>
            <div className="text-sm font-semibold">{label}</div>
          </button>
        ))}
      </div>
    </QuestionCard>
  );

  // ——— QUESTION : puissance fiscale ———
  if (currentQ === 'puissance') return (
    <QuestionCard
      {...cardProps}
      question="Quelle est la puissance fiscale de votre véhicule ?"
      hint="Indiquée sur votre carte grise, case P.6 (en CV)."
    >
      <select
        value={state.puissance}
        onChange={(e) => dispatch({ type: 'SET_PUISSANCE', payload: e.target.value })}
        className="w-full text-lg px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy bg-white"
      >
        {PUISSANCES[state.typeVehicule]?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <SourceLegale refKeys={BAREME_KM.ref} />
    </QuestionCard>
  );

  // ——— QUESTION : électrique ———
  if (currentQ === 'electrique') return (
    <QuestionCard
      {...cardProps}
      question="Votre véhicule est-il 100 % électrique ?"
      hint={`Les véhicules électriques bénéficient d'une majoration de ${MAJORATION_ELECTRIQUE.taux * 100} % sur le barème kilométrique.`}
    >
      <div className="grid grid-cols-2 gap-3 mt-2">
        {[
          { value: true, label: 'Oui, électrique', icon: '⚡' },
          { value: false, label: 'Non', icon: '⛽' },
        ].map(({ value, label, icon }) => (
          <button
            key={String(value)}
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_ELECTRIQUE', payload: value });
              goNext();
            }}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              state.estElectrique === value
                ? 'border-navy bg-navy text-white shadow-md'
                : 'border-gray-200 bg-white hover:border-navy/40'
            }`}
          >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-sm font-semibold">{label}</div>
          </button>
        ))}
      </div>
      <SourceLegale refKeys={MAJORATION_ELECTRIQUE.ref} />
    </QuestionCard>
  );

  // ——— QUESTION : distance ———
  if (currentQ === 'distance') return (
    <QuestionCard
      {...cardProps}
      question="Quelle est la distance domicile → travail ?"
      hint="Distance aller simple, en kilomètres. Au-delà de 40 km, une justification est exigée."
      preview={
        state.distanceAller > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Distance annuelle
            </p>
            <p className="text-2xl font-bold text-navy">
              {(state.distanceAller * 2 * state.joursTravailSite).toLocaleString('fr-FR')} km
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {state.distanceAller} km × 2 × {state.joursTravailSite} jours
            </p>
            {transport.alerteDistance && (
              <div className="mt-3">
                <AlertBox
                  message={`Distance > ${LIMITE_DISTANCE_ALLER_KM.valeur} km : vous devrez justifier les circonstances particulières (absence d'emploi similaire plus proche, etc.).`}
                  type="warning"
                />
              </div>
            )}
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.distanceAller === 0 ? '' : state.distanceAller}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_DISTANCE_ALLER', payload: isNaN(v) ? 0 : v });
            if (touched) setTouched(false);
          }}
          onBlur={() => setTouched(true)}
          placeholder="ex : 12"
          className={`w-full text-2xl font-semibold px-5 py-4 pr-14 border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
            getError()
              ? 'border-danger focus:ring-danger/20 bg-red-50'
              : 'border-gray-200 focus:border-navy focus:ring-navy/10 bg-white'
          }`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold pointer-events-none">
          km
        </span>
      </div>
      <SourceLegale refKeys={LIMITE_DISTANCE_ALLER_KM.ref} />
    </QuestionCard>
  );

  // ——— QUESTION : jours travaillés ———
  if (currentQ === 'jours') return (
    <QuestionCard
      {...cardProps}
      question="Combien de jours par an travaillez-vous sur site ?"
      hint="Jours réellement effectués sur votre lieu de travail habituel. Hors télétravail, congés, RTT."
      preview={
        state.joursTravailSite > 0 && state.distanceAller > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Frais kilométriques estimés
            </p>
            <p className="text-2xl font-bold text-navy">
              {transport.montantKm.toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {transport.distanceAnnuelle.toLocaleString('fr-FR')} km × barème {state.puissance}
              {state.estElectrique && ' +20 %'}
            </p>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.joursTravailSite === 0 ? '' : state.joursTravailSite}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_JOURS_TRAVAIL', payload: isNaN(v) ? 0 : Math.min(365, v) });
            if (touched) setTouched(false);
          }}
          onBlur={() => setTouched(true)}
          placeholder="ex : 220"
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

  // ——— QUESTION : péages ———
  if (currentQ === 'peages') return (
    <QuestionCard
      {...cardProps}
      question="Avez-vous des péages annuels ?"
      hint="Total des péages autoroute payés pour vos trajets domicile-travail sur l'année. Mettez 0 si aucun."
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.peages === 0 ? '' : state.peages}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_PEAGES', payload: isNaN(v) ? 0 : v });
          }}
          placeholder="ex : 450 (ou 0)"
          className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          €
        </span>
      </div>
    </QuestionCard>
  );

  // ——— QUESTION : parking ———
  if (currentQ === 'parking') return (
    <QuestionCard
      {...cardProps}
      question="Avez-vous des frais de parking annuels ?"
      hint="Abonnement ou tickets parking liés à votre lieu de travail. Mettez 0 si aucun."
      preview={
        (state.peages > 0 || state.parking > 0 || state.distanceAller > 0) && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-2">
              Récapitulatif transport
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Kilométrique</span>
                <span className="font-semibold">{transport.montantKm.toLocaleString('fr-FR')} €</span>
              </div>
              {state.peages > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Péages</span>
                  <span className="font-semibold">{state.peages.toLocaleString('fr-FR')} €</span>
                </div>
              )}
              {state.parking > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Parking</span>
                  <span className="font-semibold">{state.parking.toLocaleString('fr-FR')} €</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-blue-200 pt-1 mt-1">
                <span className="text-navy">Total transport</span>
                <span className="text-navy">{totalTransport.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.parking === 0 ? '' : state.parking}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_PARKING', payload: isNaN(v) ? 0 : v });
          }}
          placeholder="ex : 300 (ou 0)"
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
      question="Avez-vous rassemblé vos justificatifs ?"
      hint="Sans justificatifs, ces frais seront affichés comme « à risque » dans la synthèse."
      preview={
        <div>
          <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-2">
            Total transport
          </p>
          <p className="text-2xl font-bold text-navy">
            {totalTransport.toLocaleString('fr-FR')} €
          </p>
        </div>
      }
    >
      <CheckboxJustif
        label="Oui, j'ai mes justificatifs transport"
        description="Carte grise · Factures garage / révisions · Calendrier de présence sur site"
        checked={state.justif_transport}
        onChange={(val) => dispatch({ type: 'SET_JUSTIF_TRANSPORT', payload: val })}
      />
    </QuestionCard>
  );

  return null;
}
