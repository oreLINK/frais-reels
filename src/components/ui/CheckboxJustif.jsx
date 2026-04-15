import { CheckCircle2, Circle, Shield } from 'lucide-react';

export function CheckboxJustif({ label, description, checked, onChange }) {
  return (
    <label
      className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
        checked
          ? 'border-success bg-green-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {checked ? (
          <CheckCircle2 className="text-success" size={26} />
        ) : (
          <Circle className="text-gray-300" size={26} />
        )}
      </div>
      <div className="flex-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <p className={`font-semibold ${checked ? 'text-green-800' : 'text-navy'}`}>
          {label}
        </p>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
        {checked && (
          <p className="text-xs text-success mt-1.5 flex items-center gap-1">
            <Shield size={12} /> Ces frais seront comptabilisés comme sécurisés
          </p>
        )}
      </div>
    </label>
  );
}
