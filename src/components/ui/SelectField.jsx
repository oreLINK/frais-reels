export function SelectField({ label, value, onChange, options, tooltip = null }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-navy mb-2">
        {label}
        {tooltip}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
