export function Stepper({ currentStep, totalSteps, steps }) {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">

      {/* ── Mobile ── */}
      <div className="sm:hidden px-4 py-3">
        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'w-2 h-2 bg-success'
                  : i === currentStep
                  ? 'w-5 h-2 bg-navy'
                  : 'w-2 h-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
        {/* Label */}
        <p className="text-center text-xs font-semibold text-navy uppercase tracking-wider">
          {steps[currentStep]}
          <span className="text-gray-400 font-normal ml-2">{currentStep + 1} / {totalSteps}</span>
        </p>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden sm:block px-8 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-1.5 mb-2">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  i === currentStep
                    ? 'bg-navy text-white'
                    : i < currentStep
                    ? 'bg-success/10 text-success'
                    : 'text-gray-400'
                }`}
              >
                {i < currentStep && <span>✓</span>}
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div
              className="bg-navy h-1 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
