import { ChevronLeft } from 'lucide-react';

/**
 * Conteneur "une question à la fois" utilisé dans chaque étape.
 *
 * Props :
 *   stepTitle      string   – ex: "Transports"
 *   questionNum    number   – index courant (1-based)
 *   totalQuestions number
 *   question       string   – texte principal de la question
 *   hint           string?  – explication courte sous la question
 *   children                – le champ de saisie (input, select, toggle…)
 *   error          string?  – message d'erreur de validation
 *   canContinue    bool     – active/désactive le bouton Continuer
 *   onContinue     fn       – clic sur "Continuer"
 *   onBack         fn|null  – clic sur "Retour" (null = premier écran)
 *   isLast         bool     – change le label du bouton
 *   preview        node?    – aperçu du calcul en temps réel
 */
export function QuestionCard({
  stepTitle,
  questionNum,
  totalQuestions,
  question,
  hint,
  children,
  error,
  canContinue = true,
  onContinue,
  onBack,
  isLast = false,
  preview,
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 animate-slide-in">
      {/* Barre de navigation en-tête */}
      <div className="flex items-center justify-between mb-6 min-h-[28px]">
        {onBack ? (
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy transition-colors whitespace-nowrap"
          >
            <ChevronLeft size={18} />
            Retour
          </button>
        ) : (
          <span />
        )}
        <span className="text-xs font-semibold text-gray-400 tabular-nums">
          {questionNum} / {totalQuestions}
        </span>
      </div>

      {/* Indicateur de progression en pills */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < questionNum - 1
                ? 'bg-success flex-1'
                : i === questionNum - 1
                ? 'bg-navy flex-[2]'
                : 'bg-gray-200 flex-1'
            }`}
          />
        ))}
      </div>

      {/* Texte de la question */}
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-tight mb-3">
        {question}
      </h2>
      {hint && (
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-6">{hint}</p>
      )}

      {/* Champ de saisie */}
      <div className="mt-4">
        {children}
        {error && (
          <p className="text-danger text-sm mt-2 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>

      {/* Aperçu du calcul */}
      {preview && (
        <div className="mt-5 p-4 sm:p-5 bg-blue-50 border border-blue-100 rounded-2xl">
          {preview}
        </div>
      )}

      {/* Bouton principal */}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        type="button"
        className="mt-8 w-full flex items-center justify-center gap-2 py-4 px-6 bg-navy text-white rounded-2xl font-semibold text-base sm:text-lg hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        {isLast ? 'Voir le résultat →' : 'Continuer →'}
      </button>
    </div>
  );
}
