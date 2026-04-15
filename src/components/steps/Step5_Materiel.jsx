import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { QuestionCard } from '../ui/QuestionCard';
import { CheckboxJustif } from '../ui/CheckboxJustif';
import { SourceLegale } from '../ui/SourceLegale';
import { calcMateriel } from '../../engine/calculs';
import { MATERIEL } from '../../config/fiscalite';

export function Step5_Materiel({ state, dispatch, onNext, onPrev }) {
  const [qIdx, setQIdx] = useState(0);
  const [newArticle, setNewArticle] = useState({ nom: '', date: '', prix: '' });
  const [addError, setAddError] = useState('');

  const materiel = calcMateriel(state.articlesPlus500, state.totalMoins500, state.abonnements);

  const questions = [
    'articles',
    'fournitures',
    'internet_montant',
    'internet_pct',
    'mobile_montant',
    'mobile_pct',
    'justif',
  ];

  const safeIdx = Math.min(qIdx, questions.length - 1);
  const currentQ = questions[safeIdx];
  const isLast = safeIdx === questions.length - 1;
  const total = questions.length;

  function goNext() {
    if (isLast) return onNext();
    setQIdx(safeIdx + 1);
  }

  function goBack() {
    if (safeIdx === 0) return onPrev();
    setQIdx(safeIdx - 1);
  }

  function handleAddArticle() {
    setAddError('');
    if (!newArticle.nom.trim()) { setAddError('Nom de l\'article requis'); return; }
    const prix = parseFloat(newArticle.prix);
    if (!prix || prix <= MATERIEL.seuilAmortissement) {
      setAddError(`Prix doit être supérieur à ${MATERIEL.seuilAmortissement} €`);
      return;
    }
    if (!newArticle.date) { setAddError('Date d\'achat requise'); return; }

    dispatch({ type: 'ADD_ARTICLE', payload: { ...newArticle, prix, id: Date.now() } });
    setNewArticle({ nom: '', date: '', prix: '' });
  }

  const cardProps = {
    stepTitle: 'Matériel',
    questionNum: safeIdx + 1,
    totalQuestions: total,
    onBack: goBack,
    onContinue: goNext,
    canContinue: true,
    isLast,
  };

  // ——— Articles > 500€ ———
  if (currentQ === 'articles') return (
    <QuestionCard
      {...cardProps}
      question={`Avez-vous acheté du matériel professionnel coûteux (> ${MATERIEL.seuilAmortissement} €) ?`}
      hint={`Ordinateur, écran, bureau, matériel technique… Ces achats sont amortis sur ${MATERIEL.dureeAmortissement} ans. Mettez 0 si aucun article, ou ajoutez-les ci-dessous.`}
    >
      {/* Formulaire d'ajout */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          value={newArticle.nom}
          onChange={(e) => setNewArticle({ ...newArticle, nom: e.target.value })}
          placeholder="Nom de l'article (ex : Laptop)"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-navy text-sm bg-white"
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={newArticle.prix}
              onChange={(e) => setNewArticle({ ...newArticle, prix: e.target.value })}
              placeholder="Prix (ex : 1200)"
              className="w-full px-4 py-3 pr-8 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-navy text-sm bg-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">€</span>
          </div>
          <input
            type="date"
            value={newArticle.date}
            onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-navy text-sm bg-white"
          />
        </div>
        {addError && <p className="text-danger text-xs">⚠ {addError}</p>}
        <button
          type="button"
          onClick={handleAddArticle}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-navy/30 text-navy rounded-xl hover:bg-navy/5 text-sm font-semibold transition-all"
        >
          <Plus size={16} /> Ajouter cet article
        </button>
      </div>

      {/* Liste des articles ajoutés */}
      {state.articlesPlus500.length > 0 && (
        <div className="space-y-2 mt-4">
          {state.articlesPlus500.map((article, idx) => (
            <div key={article.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="font-semibold text-navy text-sm">{article.nom}</p>
                <p className="text-xs text-gray-400">{article.date} · {article.prix.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-success">
                  {Math.round(article.prix / MATERIEL.dureeAmortissement).toLocaleString('fr-FR')} €/an
                </span>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'REMOVE_ARTICLE', payload: idx })}
                  className="text-gray-400 hover:text-danger transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold text-navy px-1">
            <span>Total amortissements/an</span>
            <span>{materiel.totalAmortissements.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
      )}
      <SourceLegale refKeys={MATERIEL.ref} />
    </QuestionCard>
  );

  // ——— Fournitures < 500€ ———
  if (currentQ === 'fournitures') return (
    <QuestionCard
      {...cardProps}
      question={`Total de vos petites fournitures et équipements (< ${MATERIEL.seuilAmortissement} €) ?`}
      hint="Souris, clavier, câbles, cartouches, cahiers, etc. Déduction intégrale l'année d'achat. Mettez 0 si aucun."
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.totalMoins500 === 0 ? '' : state.totalMoins500}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_TOTAL_MOINS_500', payload: isNaN(v) ? 0 : v });
          }}
          placeholder="ex : 250 (ou 0)"
          className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          €
        </span>
      </div>
    </QuestionCard>
  );

  // ——— Internet montant ———
  if (currentQ === 'internet_montant') return (
    <QuestionCard
      {...cardProps}
      question="Quel est votre abonnement internet annuel ?"
      hint="Forfait box internet du foyer. Seule la part d'usage professionnel sera déduite. Mettez 0 si non applicable."
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.abonnements.internet.montant === 0 ? '' : state.abonnements.internet.montant}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({
              type: 'SET_ABONNEMENT',
              key: 'internet',
              payload: { ...state.abonnements.internet, montant: isNaN(v) ? 0 : v },
            });
          }}
          placeholder="ex : 480 (ou 0)"
          className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          €
        </span>
      </div>
    </QuestionCard>
  );

  // ——— Internet % pro ———
  if (currentQ === 'internet_pct') return (
    <QuestionCard
      {...cardProps}
      question="Quel pourcentage de votre internet est utilisé à titre professionnel ?"
      hint="Estimez la part réelle : heures de travail vs loisirs. La valeur par défaut de 50 % est couramment admise."
      preview={
        state.abonnements.internet.montant > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Part déductible internet
            </p>
            <p className="text-2xl font-bold text-navy">
              {Math.round(state.abonnements.internet.montant * state.abonnements.internet.pctPro / 100).toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {state.abonnements.internet.pctPro} % × {state.abonnements.internet.montant.toLocaleString('fr-FR')} €
            </p>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.abonnements.internet.pctPro}
          onChange={(e) => {
            const v = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
            dispatch({
              type: 'SET_ABONNEMENT',
              key: 'internet',
              payload: { ...state.abonnements.internet, pctPro: v },
            });
          }}
          placeholder="ex : 50"
          className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          %
        </span>
      </div>
    </QuestionCard>
  );

  // ——— Mobile montant ———
  if (currentQ === 'mobile_montant') return (
    <QuestionCard
      {...cardProps}
      question="Quel est votre abonnement mobile annuel ?"
      hint="Forfait téléphone mobile. Mettez 0 si vous n'utilisez pas votre mobile à titre professionnel."
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.abonnements.mobile.montant === 0 ? '' : state.abonnements.mobile.montant}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            dispatch({
              type: 'SET_ABONNEMENT',
              key: 'mobile',
              payload: { ...state.abonnements.mobile, montant: isNaN(v) ? 0 : v },
            });
          }}
          placeholder="ex : 240 (ou 0)"
          className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          €
        </span>
      </div>
    </QuestionCard>
  );

  // ——— Mobile % pro ———
  if (currentQ === 'mobile_pct') return (
    <QuestionCard
      {...cardProps}
      question="Quel pourcentage de votre mobile est utilisé professionnellement ?"
      hint="Appels, SMS, data à titre professionnel. 30 à 50 % est généralement admis pour un usage mixte."
      preview={
        state.abonnements.mobile.montant > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">
              Part déductible mobile
            </p>
            <p className="text-2xl font-bold text-navy">
              {Math.round(state.abonnements.mobile.montant * state.abonnements.mobile.pctPro / 100).toLocaleString('fr-FR')} €
            </p>
          </div>
        )
      }
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={state.abonnements.mobile.pctPro}
          onChange={(e) => {
            const v = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
            dispatch({
              type: 'SET_ABONNEMENT',
              key: 'mobile',
              payload: { ...state.abonnements.mobile, pctPro: v },
            });
          }}
          placeholder="ex : 40"
          className="w-full text-2xl font-semibold px-5 py-4 pr-10 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 bg-white transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold pointer-events-none">
          %
        </span>
      </div>
    </QuestionCard>
  );

  // ——— Justificatifs ———
  if (currentQ === 'justif') return (
    <QuestionCard
      {...cardProps}
      question="Avez-vous vos factures et justificatifs matériel ?"
      hint="Factures nominatives au nom du salarié pour chaque article et abonnement."
      preview={
        <div>
          <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-2">
            Récapitulatif matériel
          </p>
          <div className="space-y-1 text-sm">
            {materiel.totalAmortissements > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Amortissements</span>
                <span className="font-semibold">{materiel.totalAmortissements.toLocaleString('fr-FR')} €</span>
              </div>
            )}
            {materiel.totalFournitures > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Fournitures</span>
                <span className="font-semibold">{materiel.totalFournitures.toLocaleString('fr-FR')} €</span>
              </div>
            )}
            {materiel.totalAbonnements > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Abonnements</span>
                <span className="font-semibold">{materiel.totalAbonnements.toLocaleString('fr-FR')} €</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-navy border-t border-blue-200 pt-1">
              <span>Total matériel</span>
              <span>{materiel.totalMateriel.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>
      }
    >
      <CheckboxJustif
        label="Oui, j'ai mes factures nominatives"
        description="Factures articles + Factures internet/mobile au nom du salarié"
        checked={state.justif_materiel}
        onChange={(val) => dispatch({ type: 'SET_JUSTIF_MATERIEL', payload: val })}
      />
    </QuestionCard>
  );

  return null;
}
