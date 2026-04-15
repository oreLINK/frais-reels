export function SliderInput({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', tooltip = null }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-navy mb-2">
        {label}
        {tooltip}
      </label>
      <div className="flex gap-3 items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded appearance-none accent-navy"
        />
        <div className="w-20 text-right">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
            min={min}
            max={max}
            step={step}
            className="w-full px-2 py-1 border border-gray-300 rounded text-right"
          />
          {unit && <span className="text-xs text-gray-600">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
