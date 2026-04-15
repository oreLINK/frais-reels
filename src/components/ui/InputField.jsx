export function InputField({ label, type = 'number', value, onChange, min = 0, step = 1, tooltip = null }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-navy mb-2">
        {label}
        {tooltip}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        step={step}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-navy"
      />
    </div>
  );
}
