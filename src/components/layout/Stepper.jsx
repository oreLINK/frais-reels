export function Stepper({ currentStep, totalSteps, steps }) {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="max-w-2xl mx-auto">
        {/* Noms des étapes */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                i === currentStep
                  ? 'bg-navy text-white'
                  : i < currentStep
                  ? 'bg-success/10 text-success'
                  : 'text-gray-300'
              }`}
            >
              {i < currentStep && <span className="text-success">✓</span>}
              {step}
            </div>
          ))}
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-100 rounded-full h-1">
          <div
            className="bg-navy h-1 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
